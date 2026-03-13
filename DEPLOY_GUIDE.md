# AWS Deployment Guide (Beginner-Friendly) — GVS Portal

This repo is a full-stack app:

- Frontend: Vite/React built to static files and served by Nginx (see [client/Dockerfile](client/Dockerfile))
- Backend: Node/Express API (see [backend/index.js](backend/index.js))
- Database: PostgreSQL via Prisma (see [backend/prisma/schema.prisma](backend/prisma/schema.prisma))

The easiest “real production” AWS setup (with HTTPS and a managed database) is:

- RDS (PostgreSQL) for the database
- ECR to store Docker images
- ECS Fargate to run containers (no servers to manage)
- Application Load Balancer (ALB) for public traffic + HTTPS
- ACM (certificates) + Route 53 (domain DNS)

If you follow this guide step-by-step, you’ll have your app live on a domain with HTTPS.

---

## 0) Prerequisites (one-time)

### 0.1 Create an AWS account

Create an AWS account and enable billing alerts:

- In AWS Console, search “Budgets” → create a monthly budget alert.

### 0.2 Install tools on your PC

Install:

- Docker Desktop
- AWS CLI v2

Then set your AWS credentials (use an IAM user or SSO):

- `aws configure`

Choose a region and stick with it (example: `ap-south-1` or `us-east-1`).

---

## 1) Confirm your local production build works (recommended)

This is to avoid “AWS debugging” when the issue is local.

From repo root:

- `docker compose -f docker-compose.prod.yaml build`

If you want to run it locally too:

- Create [backend/.env](backend/.env) based on [backend/.env.example](backend/.env.example)
- `docker compose -f docker-compose.prod.yaml up`

Open:

- Frontend: `http://localhost/`
- Backend: `http://localhost:8000/`

---

## 2) Create the database (AWS RDS PostgreSQL)

### 2.1 Create RDS instance

AWS Console → RDS → “Create database”:

- Engine: PostgreSQL
- Template: Free tier (if available) / Dev-Test
- DB instance identifier: `gvsportal-db`
- Master username/password: set and save
- Public access: No (recommended)
- VPC: Default VPC is fine for first deploy

### 2.2 Create a Security Group rule for Postgres

You’ll create an ECS Task Security Group later. For now:

- RDS → Connectivity & Security → Security group → Inbound rules
- Allow PostgreSQL port `5432` FROM the ECS task Security Group (not from the whole internet)

### 2.3 Get the database endpoint and build `DATABASE_URL`

After RDS is available, note:

- Endpoint hostname
- Port (usually `5432`)
- Database name (create one, e.g. `gvsportal`)

Your `DATABASE_URL` will look like:

- `DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/gvsportal`

Tip: If your password contains special characters, URL-encode it.

---

## 3) Create Docker image registries (ECR)

AWS Console → ECR → “Create repository”:

- Create one repo for backend, one for frontend.

Example names:

- `gvsportal-backend`
- `gvsportal-client`

---

## 4) Build and push Docker images to ECR

### 4.1 Login Docker to ECR

Replace `REGION` and `ACCOUNT_ID`:

- `aws ecr get-login-password --region REGION | docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com`

### 4.2 Build + push backend image

From repo root:

- `docker build -t gvsportal-backend ./backend`
- `docker tag gvsportal-backend:latest ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/gvsportal-backend:latest`
- `docker push ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/gvsportal-backend:latest`

### 4.3 Build + push client image

From repo root:

- `docker build -t gvsportal-client ./client`
- `docker tag gvsportal-client:latest ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/gvsportal-client:latest`
- `docker push ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/gvsportal-client:latest`

---

## 5) Create ECS cluster (Fargate)

AWS Console → ECS → Clusters → Create:

- Cluster name: `gvsportal`
- Infrastructure: AWS Fargate (serverless)

---

## 6) Create CloudWatch log groups (recommended)

AWS Console → CloudWatch → Log groups → Create:

- `/ecs/gvsportal-client`
- `/ecs/gvsportal-backend`

---

## 7) Create an ECS Task Definition (runs both containers)

We will run TWO containers in ONE Fargate task:

- Container 1: Nginx (frontend) on port `80`
- Container 2: Express API (backend) on port `8000` (internal)

This makes routing simple: the Load Balancer only talks to Nginx, and Nginx forwards `/api/*` to the backend.

### 7.1 Create task definition

ECS → Task definitions → Create:

- Launch type: Fargate
- Task name: `gvsportal-task`
- CPU/memory: start small (e.g. 0.5 vCPU / 1GB)
- Task role: none (unless you need S3, SES, etc)
- Task execution role: create/choose the default

### 7.2 Add containers

Add `client` container:

- Image: `.../gvsportal-client:latest`
- Port mappings: `80`
- Logs: CloudWatch log group `/ecs/gvsportal-client`

Add `backend` container:

- Image: `.../gvsportal-backend:latest`
- Port mappings: `8000`
- Logs: CloudWatch log group `/ecs/gvsportal-backend`

### 7.3 Backend environment variables

Set these in the backend container (ECS Console → Task Definition → Container → Environment variables).

Required:

- `PORT=8000`
- `DATABASE_URL=...` (RDS connection string)
- `JWT_ACCESS_SECRET=...`
- `JWT_REFRESH_SECRET=...`
- `FRONTEND_URL=https://YOUR_DOMAIN` (must be set; your backend reads it)

If you use Cloudinary:

- `CLOUDINARY_CLOUD_NAME=...`
- `CLOUDINARY_API_KEY=...`
- `CLOUDINARY_API_SECRET=...`

Email/SMTP (only if features use it):

- `SMTP_HOST=...`, `SMTP_PORT=...`, `SMTP_USER=...`, `SMTP_PASSWORD=...`, `SMTP_FROM=...`

Security tip: put secrets in AWS Secrets Manager, then reference them in ECS (instead of plain text).

---

## 8) Create a Load Balancer (ALB) + HTTPS

### 8.1 Buy/bring a domain

You can:

- Buy a domain in Route 53, OR
- Use any domain provider and point DNS to Route 53 / ALB

### 8.2 Create an ACM certificate

AWS Console → ACM → Request certificate:

- Domain: `yourdomain.com` (and optionally `www.yourdomain.com`)
- Validation: DNS

If using Route 53, AWS can create the validation records automatically.

### 8.3 Create an Application Load Balancer

AWS Console → EC2 → Load Balancers → Create ALB:

- Internet-facing
- Listeners: 80 and 443
- Subnets: at least two public subnets
- Security group: allow inbound `80` and `443` from `0.0.0.0/0`

Create a Target Group:

- Target type: IP
- Protocol: HTTP
- Port: 80
- Health check path: `/`

Listener rules:

- 443 → forward to target group
- 80 → redirect to 443

---

## 9) Create ECS Service (connects task to ALB)

ECS → Cluster `gvsportal` → Services → Create:

- Launch type: Fargate
- Task definition: `gvsportal-task`
- Desired tasks: 1
- Networking: private subnets recommended (needs NAT to pull images)
- Security group for tasks: allow inbound `80` FROM the ALB security group

Load balancing:

- Select your ALB
- Select the target group created above
- Container to load balance: `client` on port `80`

Deploy service.

---

## 10) Run database migrations (Prisma)

Your schema has migrations in [backend/prisma/migrations](backend/prisma/migrations).

After the backend is connected to RDS, run:

- ECS → Task definitions → `gvsportal-task` → Run task
- Override command for backend container to: `npx prisma migrate deploy`

This applies migrations to the RDS database.

Optional: you can seed data by running:

- `node scripts/seedManager.js all`

But only do this if you understand what data it inserts.

---

## 11) Point your domain to the Load Balancer

If using Route 53:

- Hosted zone → Create record
- Type: A
- Alias: yes
- Choose ALB

Wait for DNS to propagate (5–30 minutes usually).

---

## 12) Final checklist / common issues

### 12.1 CORS / cookies issues

- Ensure `FRONTEND_URL` is set to your final HTTPS domain.
- Use only HTTPS in production.

### 12.2 Ports must match

- Backend listens on `PORT=8000` (set in ECS env)
- Client listens on `80` (Nginx)

### 12.3 Logs and debugging

- CloudWatch Logs → check `/ecs/gvsportal-backend` first
- If backend crashes on boot, it’s usually `DATABASE_URL` or Prisma migration issues

---

## 13) (Optional) CI/CD — deploy automatically on Git push

You can add a GitHub Actions workflow that:

- Builds images
- Pushes to ECR
- Updates ECS service

If you want, ask and I’ll generate a ready-to-use workflow file for this repo.

import applicationRouter from "./routes/application.routes.js";
import authRouter from "./routes/auth.routes.js";
import companyRoutes from "./routes/company.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import profileRouter from "./routes/profile.routes.js";
import { connectDB } from "./db/db.js";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import inviteCodeRouter from "./routes/invitecode.routes.js";
import jobsRouter from "./routes/job.routes.js";
import morgan from "morgan";
import tuitionRouter from "./routes/tuition.routes.js";
import messageRouter from "./routes/message.routes.js";
import userRouter from "./routes/user.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import cookieParser from "cookie-parser";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "./config/swaggerOptions.js"; // Ensure correct import
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, ".env") });

// Initialize Express app
const app = express();

// Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.set("trust proxy", 1);
app.use("/uploads", express.static(resolve(__dirname, "uploads")));

// CORS setup
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "http://localhost:8000",
      "http://localhost:3000",
      "https://job-portal-mern-sigma.vercel.app",
      ...(process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
        : []),
    ],
    credentials: true,
  })
);

// Removed app.options("*", cors()) – the main cors middleware already
// handles preflight OPTIONS and the bare cors() override conflicted by
// emitting Access-Control-Allow-Origin: * which breaks credentialed requests.

// Swagger setup
const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Test route (can be removed later)
app.get("/", (req, res) => {
  res.json({
    status: "Server is running!",
    allowedURL: process.env.FRONTEND_URL.split(",").map((url) => url.trim()),
  });
});

// Route handlers
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/invitecode", inviteCodeRouter);
app.use("/api/applications", applicationRouter);
app.use("/api/company", companyRoutes);
app.use("/api/tuition", tuitionRouter);
app.use("/api/messages", messageRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/admin", adminRoutes);

// Error-handling middleware (place this at the end)
app.use((err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  console.error(`[ERROR] ${req.method} ${req.originalUrl} ${statusCode}: ${err.message}`);
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    status: statusCode,
  });
});

// Connect to PostgreSQL via Prisma
connectDB().then(() => {
  // Start the server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});

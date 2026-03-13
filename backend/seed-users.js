import prisma from './db/db.js';
import bcrypt from 'bcryptjs';

const users = [
  { email: 'teacher@test.com', password: 'password123', role: 'jobSeeker', fullName: 'Test Teacher', isVerified: true },
  { email: 'school@test.com', password: 'password123', role: 'recruiter', fullName: 'Test School', isVerified: true },
  { email: 'parent@test.com', password: 'password123', role: 'parent', fullName: 'Test Parent', isVerified: true },
  { email: 'admin@test.com', password: 'admin123', role: 'admin', fullName: 'Test Admin', isVerified: true },
];

for (const u of users) {
  const hash = await bcrypt.hash(u.password, 10);
  const created = await prisma.user.create({ data: { ...u, password: hash } });
  console.log('Created:', created.email, created.role, created.id);
}
console.log('All test users created!');
process.exit(0);

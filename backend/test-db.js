import prisma from './db/db.js';

console.log('Testing database connection...');
const start = Date.now();

try {
  const result = await prisma.$queryRaw`SELECT 1 as test`;
  console.log(`DB OK in ${Date.now() - start}ms:`, result);
} catch (e) {
  console.log(`DB FAIL in ${Date.now() - start}ms:`, e.message.substring(0, 300));
}
process.exit();

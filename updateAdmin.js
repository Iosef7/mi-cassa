const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  
  // Create or update the user hidalgoiosef@gmail.com with SQL to avoid Prisma Client type issues
  // The table name is "User" in PostgreSQL.
  
  const result = await prisma.$executeRawUnsafe(`
    INSERT INTO "User" (id, name, email, role, password, "updatedAt")
    VALUES (gen_random_uuid()::text, 'Iosef (Admin)', 'hidalgoiosef@gmail.com', 'ADMIN', $1, now())
    ON CONFLICT (email) DO UPDATE 
    SET password = $1, role = 'ADMIN', name = 'Iosef (Admin)';
  `, adminPassword);
  
  console.log("Admin hidalgoiosef@gmail.com created/updated successfully with password: admin123");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

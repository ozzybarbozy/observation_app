import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("test123", 10); // Hash the password

  // Create a test user
  await prisma.user.upsert({
    where: { username: 'testuser' },
    update: {},
    create: {
      username: 'testuser',
      password: hashedPassword,
      email: 'test@example.com',
      name: 'Test User',
      role: 'USER', // Adjust based on your role setup
    },
  });

  console.log("Test user created or updated.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
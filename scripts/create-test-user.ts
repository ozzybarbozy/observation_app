import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('test123', 10);
  
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: 'test@example.com' }
  });

  if (existingUser) {
    // Update existing user
    const user = await prisma.user.update({
      where: { email: 'test@example.com' },
      data: {
        username: 'testuser',
        password: hashedPassword,
        name: 'Test User',
        role: 'USER'
      }
    });
    console.log('Test user updated:', user);
  } else {
    // Create new user with specific ID to match session
    const user = await prisma.user.create({
      data: {
        id: 'cm99nn7uq00002ojjpqwvtj7v', // Match the ID from your session
        username: 'testuser',
        password: hashedPassword,
        name: 'Test User',
        email: 'test@example.com',
        role: 'USER'
      }
    });
    console.log('Test user created:', user);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    create: {
      email: 'aydinhalil980@gmail.com',
      password: await argon2.hash('Admin123.'),
      profile: {
        create: {
          displayName: 'Halil Aydın',
        },
      },
      username: 'aydinthefirst',
    },
    update: {},
    where: { email: 'aydinhalil980@gmail.com' },
  });
}

main()
  .then(() => {
    console.log('Seeding completed successfully.');
  })
  .catch((e) => {
    console.error('Error during seeding:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const prisma = new PrismaClient();

  const users = await prisma.user.findMany({
    where: {
      profile: null, // Only update users without an avatar
    },
  });

  for (const user of users) {
    await prisma.profile.create({
      data: {
        displayName: user.username,
        user: { connect: { id: user.id } },
      },
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

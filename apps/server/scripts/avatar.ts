import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const prisma = new PrismaClient();

  const users = await prisma.user.findMany({
    where: {
      avatarUrl: null, // Only update users without an avatar
    },
  });

  for (const user of users) {
    const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.id}`;
    await prisma.user.update({
      data: { avatarUrl },
      where: { id: user.id },
    });
    console.log(`Updated avatar for user ${user.id}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

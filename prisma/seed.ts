import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.SEED_ADMIN_USERNAME || "admin";
  const password = process.env.SEED_ADMIN_PASSWORD || "troque-esta-senha";
  const nickname = process.env.SEED_ADMIN_NICKNAME || "Admin";

  const existente = await prisma.user.findUnique({ where: { username } });
  if (existente) {
    console.log(`Usuário admin "${username}" já existe, pulando seed.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { username, nickname, passwordHash, role: "ADMIN" },
  });

  console.log(`Admin criado! usuário: "${username}" senha: "${password}"`);
  console.log("Troque essa senha depois de logar (ou redefina no painel).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

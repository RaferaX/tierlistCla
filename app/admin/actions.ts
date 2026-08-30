"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Apenas admins podem fazer isso");
  }
  return session;
}

export async function criarMembro(formData: FormData) {
  await requireAdmin();

  const username = String(formData.get("username") || "").trim();
  const nickname = String(formData.get("nickname") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !nickname || password.length < 4) {
    throw new Error(
      "Preencha usuário, nick e uma senha com pelo menos 4 caracteres"
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { username, nickname, passwordHash, role: "MEMBER" },
  });

  revalidatePath("/admin");
}

export async function removerMembro(userId: string) {
  await requireAdmin();
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function redefinirSenha(userId: string, formData: FormData) {
  await requireAdmin();

  const password = String(formData.get("password") || "");
  if (password.length < 4) {
    throw new Error("Senha precisa ter pelo menos 4 caracteres");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  revalidatePath("/admin");
}

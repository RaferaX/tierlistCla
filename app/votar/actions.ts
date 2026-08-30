"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TIER_ORDER, type Tier } from "@/lib/tiers";

export async function votar(targetId: string, tier: Tier) {
  const session = await auth();
  if (!session?.user) throw new Error("Não autenticado");

  const voterId = session.user.id;

  if (voterId === targetId) {
    throw new Error("Você não pode votar em si mesmo");
  }

  if (!TIER_ORDER.includes(tier)) {
    throw new Error("Tier inválido");
  }

  // @@unique([voterId, targetId]) no schema garante que não dá pra votar 2x.
  // Se já existe voto, essa chamada falha e o voto fica travado (regra: voto único).
  await prisma.vote.create({
    data: { voterId, targetId, tier },
  });

  revalidatePath("/");
  revalidatePath("/votar");
  revalidatePath("/perfil");
}

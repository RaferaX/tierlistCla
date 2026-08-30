import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { calculateFinalTier, TIER_LABELS, type Tier } from "@/lib/tiers";

type VotoRecebido = {
  id: string;
  tier: string;
  voter: { nickname: string };
};

export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const votosRecebidos: VotoRecebido[] = await prisma.vote.findMany({
    where: { targetId: session.user.id },
    include: { voter: { select: { nickname: true } } },
    orderBy: { createdAt: "desc" },
  });

  const { tier, average } = calculateFinalTier(
    votosRecebidos.map((v: VotoRecebido) => v.tier as Tier)
  );

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="font-display font-700 text-3xl text-foreground mb-1">
        {session.user.name}
      </h1>
      <p className="text-muted text-sm mb-8">@{session.user.username}</p>

      <div className="rounded-lg border border-line bg-surface p-6 flex items-center gap-5 mb-8">
        {tier ? (
          <>
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center font-display font-700 text-3xl text-background shrink-0"
              style={{ background: `var(--tier-${tier.toLowerCase()})` }}
            >
              {tier}
            </div>
            <div>
              <p className="font-medium text-foreground">{TIER_LABELS[tier]}</p>
              <p className="text-muted text-sm">
                Média {average?.toFixed(2)} · {votosRecebidos.length} votos recebidos
              </p>
            </div>
          </>
        ) : (
          <p className="text-muted">
            Você ainda não recebeu votos suficientes pra ter um tier.
          </p>
        )}
      </div>

      <h2 className="font-display font-700 text-lg text-foreground mb-3">
        Votos recebidos
      </h2>

      {votosRecebidos.length === 0 ? (
        <p className="text-muted text-sm">Ninguém votou em você ainda.</p>
      ) : (
        <ul className="space-y-2">
          {votosRecebidos.map((v: VotoRecebido) => (
            <li
              key={v.id}
              className="rounded-md border border-line bg-surface px-4 py-2.5 flex items-center justify-between"
            >
              <span className="text-foreground text-sm">
                {v.voter.nickname}
              </span>
              <span
                className="w-7 h-7 rounded flex items-center justify-center font-display font-700 text-xs text-background"
                style={{ background: `var(--tier-${v.tier.toLowerCase()})` }}
              >
                {v.tier}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

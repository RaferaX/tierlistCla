import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  TIER_ORDER,
  TIER_LABELS,
  calculateFinalTier,
  type Tier,
} from "@/lib/tiers";
import { redirect } from "next/navigation";
import Link from "next/link";

type UserWithVotes = {
  id: string;
  nickname: string;
  votesReceived: { tier: string }[];
};

type RankedMember = {
  id: string;
  nickname: string;
  tier: Tier | null;
  average: number | null;
  votesCount: number;
};

export default async function HomePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const users: UserWithVotes[] = await prisma.user.findMany({
    include: { votesReceived: true },
    orderBy: { nickname: "asc" },
  });

  const ranked: RankedMember[] = users.map((u) => {
    const { tier, average } = calculateFinalTier(
      u.votesReceived.map((v) => v.tier as Tier)
    );
    return {
      id: u.id,
      nickname: u.nickname,
      tier,
      average,
      votesCount: u.votesReceived.length,
    };
  });

  const grouped: Record<Tier, RankedMember[]> = {
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
  };
  const semVotos: RankedMember[] = [];

  for (const member of ranked) {
    if (member.tier) grouped[member.tier].push(member);
    else semVotos.push(member);
  }

  for (const tier of TIER_ORDER) {
    grouped[tier].sort(
      (a: RankedMember, b: RankedMember) => (b.average ?? 0) - (a.average ?? 0)
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="mb-8">
        <h1 className="font-display font-700 text-3xl text-foreground">
          Ranking do Clã
        </h1>
        <p className="text-muted text-sm mt-1">
          Classificação por votos de batalha dos membros dos Mercenários.
        </p>
      </div>

      <div className="space-y-3">
        {TIER_ORDER.map((tier) => (
          <div
            key={tier}
            className="flex rounded-lg overflow-hidden border border-line"
          >
            <div
              className="w-16 shrink-0 flex flex-col items-center justify-center py-3 font-display font-700 text-2xl text-background"
              style={{ background: `var(--tier-${tier.toLowerCase()})` }}
            >
              {tier}
              <span className="font-sans font-normal text-[10px] text-background/70 mt-0.5 text-center px-1 leading-tight">
                {TIER_LABELS[tier]}
              </span>
            </div>
            <div className="flex-1 bg-surface flex flex-wrap gap-2 p-3 items-center min-h-[64px]">
              {grouped[tier].length === 0 && (
                <span className="text-muted text-sm px-1">
                  Ninguém aqui ainda
                </span>
              )}
              {grouped[tier].map((member: RankedMember) => (
                <span
                  key={member.id}
                  className="rounded-md bg-surface-hi border border-line px-3 py-1.5 text-sm text-foreground"
                  title={`Média ${member.average?.toFixed(1)} · ${member.votesCount} votos`}
                >
                  {member.nickname}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {semVotos.length > 0 && (
        <div className="mt-6">
          <p className="text-muted text-sm mb-2">Ainda sem votos suficientes</p>
          <div className="flex flex-wrap gap-2">
            {semVotos.map((member: RankedMember) => (
              <span
                key={member.id}
                className="rounded-md bg-surface border border-line px-3 py-1.5 text-sm text-muted"
              >
                {member.nickname}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <Link
          href="/votar"
          className="inline-block rounded-md bg-accent text-background font-medium px-5 py-2.5 hover:opacity-90 transition-opacity"
        >
          Votar nos membros
        </Link>
      </div>
    </div>
  );
}

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TIER_ORDER, type Tier } from "@/lib/tiers";
import { votar } from "./actions";

type Membro = { id: string; nickname: string };

export default async function VotarPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const meuId = session.user.id;

  const [todosMembros, meusVotos]: [Membro[], { targetId: string }[]] =
    await Promise.all([
      prisma.user.findMany({
        where: { id: { not: meuId } },
        orderBy: { nickname: "asc" },
        select: { id: true, nickname: true },
      }),
      prisma.vote.findMany({
        where: { voterId: meuId },
        select: { targetId: true },
      }),
    ]);

  const idsJaVotados = new Set(
    meusVotos.map((v: { targetId: string }) => v.targetId)
  );
  const pendentes = todosMembros.filter(
    (m: Membro) => !idsJaVotados.has(m.id)
  );
  const jaVotados = todosMembros.filter((m: Membro) =>
    idsJaVotados.has(m.id)
  );

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="font-display font-700 text-3xl text-foreground mb-1">
        Votar
      </h1>
      <p className="text-muted text-sm mb-8">
        Dê um tier pra cada membro. O voto é único — não dá pra mudar depois.
      </p>

      {pendentes.length === 0 ? (
        <p className="text-muted">
          Você já votou em todo mundo. Valeu por participar!
        </p>
      ) : (
        <ul className="space-y-3">
          {pendentes.map((membro: Membro) => (
            <li
              key={membro.id}
              className="rounded-lg border border-line bg-surface p-4 flex items-center justify-between gap-4 flex-wrap"
            >
              <span className="font-medium text-foreground">
                {membro.nickname}
              </span>
              <div className="flex gap-1.5">
                {TIER_ORDER.map((tier: Tier) => (
                  <form key={tier} action={votar.bind(null, membro.id, tier)}>
                    <button
                      type="submit"
                      className="w-10 h-10 rounded-md font-display font-700 text-background hover:opacity-80 transition-opacity"
                      style={{ background: `var(--tier-${tier.toLowerCase()})` }}
                    >
                      {tier}
                    </button>
                  </form>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      {jaVotados.length > 0 && (
        <div className="mt-10">
          <p className="text-muted text-sm mb-2">Já votados</p>
          <div className="flex flex-wrap gap-2">
            {jaVotados.map((m: Membro) => (
              <span
                key={m.id}
                className="rounded-md bg-surface border border-line px-3 py-1.5 text-sm text-muted"
              >
                {m.nickname}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

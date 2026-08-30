import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { criarMembro, removerMembro, redefinirSenha } from "./actions";

type MembroAdmin = {
  id: string;
  nickname: string;
  username: string;
  role: string;
  _count: { votesReceived: number; votesGiven: number };
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const membros: MembroAdmin[] = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { votesReceived: true, votesGiven: true } } },
  });

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="font-display font-700 text-3xl text-foreground mb-1">
        Painel Admin
      </h1>
      <p className="text-muted text-sm mb-8">
        Cadastre e gerencie os membros do clã.
      </p>

      <div className="rounded-lg border border-line bg-surface p-5 mb-10">
        <h2 className="font-display font-700 text-foreground mb-4">
          Novo membro
        </h2>
        <form action={criarMembro} className="grid sm:grid-cols-3 gap-3">
          <input
            name="nickname"
            placeholder="Nick no Minecraft"
            required
            className="rounded-md bg-surface-hi border border-line px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
          <input
            name="username"
            placeholder="Usuário de login"
            required
            className="rounded-md bg-surface-hi border border-line px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
          <input
            name="password"
            type="text"
            placeholder="Senha inicial"
            required
            className="rounded-md bg-surface-hi border border-line px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="sm:col-span-3 rounded-md bg-accent text-background font-medium py-2 text-sm hover:opacity-90 transition-opacity"
          >
            Cadastrar membro
          </button>
        </form>
      </div>

      <h2 className="font-display font-700 text-foreground mb-3">
        Membros ({membros.length})
      </h2>
      <ul className="space-y-2">
        {membros.map((m: MembroAdmin) => (
          <li
            key={m.id}
            className="rounded-lg border border-line bg-surface p-4 flex items-center justify-between flex-wrap gap-3"
          >
            <div>
              <p className="text-foreground font-medium">
                {m.nickname}{" "}
                {m.role === "ADMIN" && (
                  <span className="text-accent text-xs">(admin)</span>
                )}
              </p>
              <p className="text-muted text-xs">
                @{m.username} · {m._count.votesReceived} votos recebidos ·{" "}
                {m._count.votesGiven} votos dados
              </p>
            </div>

            <div className="flex items-center gap-2">
              <form
                action={redefinirSenha.bind(null, m.id)}
                className="flex items-center gap-1.5"
              >
                <input
                  name="password"
                  type="text"
                  placeholder="Nova senha"
                  className="rounded-md bg-surface-hi border border-line px-2 py-1.5 text-xs text-foreground outline-none focus:border-accent w-28"
                />
                <button
                  type="submit"
                  className="text-xs text-muted hover:text-accent-2 transition-colors"
                >
                  Redefinir
                </button>
              </form>

              {m.role !== "ADMIN" && (
                <form action={removerMembro.bind(null, m.id)}>
                  <button
                    type="submit"
                    className="text-xs text-muted hover:text-tier-s transition-colors"
                  >
                    Remover
                  </button>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

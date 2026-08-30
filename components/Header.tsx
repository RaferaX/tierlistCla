import Link from "next/link";
import { signOut } from "@/auth";

type HeaderUser = {
  name?: string | null;
  username?: string;
  role?: string;
} | null;

export default function Header({ user }: { user: HeaderUser }) {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto max-w-4xl px-5 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-display font-700 text-lg tracking-tight text-foreground"
        >
          Mercenários <span className="text-accent">Tier List</span>
        </Link>

        {user && (
          <nav className="flex items-center gap-5 text-sm">
            <Link href="/" className="text-muted hover:text-foreground transition-colors">
              Ranking
            </Link>
            <Link href="/votar" className="text-muted hover:text-foreground transition-colors">
              Votar
            </Link>
            <Link href="/perfil" className="text-muted hover:text-foreground transition-colors">
              Meu perfil
            </Link>
            {user.role === "ADMIN" && (
              <Link href="/admin" className="text-muted hover:text-foreground transition-colors">
                Admin
              </Link>
            )}
            <span className="text-muted hidden sm:inline">
              {user.name}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button className="text-muted hover:text-tier-s transition-colors">
                Sair
              </button>
            </form>
          </nav>
        )}
      </div>
    </header>
  );
}

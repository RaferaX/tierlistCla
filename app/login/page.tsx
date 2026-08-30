import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

async function login(formData: FormData) {
  "use server";

  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?erro=1");
    }
    throw error;
  }
}

type LoginPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const hasError = params?.erro === "1";

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <h1 className="font-display font-700 text-2xl text-foreground mb-1">
          Entrar no clã
        </h1>
        <p className="text-muted text-sm mb-8">
          Use o usuário e senha que o admin do clã te passou.
        </p>

        <form action={login} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm text-muted mb-1.5"
            >
              Usuário
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              className="w-full rounded-md bg-surface border border-line px-3 py-2.5 text-foreground outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm text-muted mb-1.5"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md bg-surface border border-line px-3 py-2.5 text-foreground outline-none focus:border-accent transition-colors"
            />
          </div>

          {hasError && (
            <p className="text-sm text-tier-s">
              Usuário ou senha incorretos.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-accent text-background font-medium py-2.5 hover:opacity-90 transition-opacity"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

# Mercenários — Tier List

Site do clã Mercenários (Minecraft, mod Pixelmon) com uma tier list onde
cada membro vota do melhor ao pior nas batalhas.

## Stack

- Next.js (App Router) + TypeScript
- Prisma + PostgreSQL
- NextAuth (login usuário/senha)
- Tailwind CSS

## Como funciona

- Só o **admin** cadastra membros (usuário + senha inicial), sem cadastro público
- Cada membro vota **uma única vez** em cada outro membro, atribuindo um tier (S/A/B/C/D)
- Ninguém vota em si mesmo
- Os votos são **públicos** — dá pra ver quem votou o quê no perfil de cada um
- O tier final de cada membro é a média dos votos (S=5 ... D=1), arredondada
  pro tier mais próximo

## Rodando localmente

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Copie o `.env.example` para `.env` e preencha:
   ```bash
   cp .env.example .env
   ```
   - `DATABASE_URL`: string de conexão de um banco Postgres. Pra testar local
     rápido, dá pra usar o [Neon](https://neon.tech) ou
     [Vercel Postgres](https://vercel.com/storage/postgres) (ambos têm plano
     gratuito) — não precisa instalar Postgres na sua máquina.
   - `AUTH_SECRET`: gere uma com `openssl rand -base64 32`
   - `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` / `SEED_ADMIN_NICKNAME`:
     seu usuário admin inicial

3. Crie as tabelas no banco:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Crie seu usuário admin:
   ```bash
   npm run seed
   ```

5. Rode o projeto:
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:3000`, faça login com o usuário/senha do seed,
   e cadastre o resto do clã em `/admin`.

## Deploy na Vercel

1. Suba o projeto num repositório no GitHub
2. Importe o repositório na Vercel
3. Crie um banco em **Storage → Postgres** (ou conecte um Neon/Supabase) —
   isso preenche o `DATABASE_URL` automaticamente
4. Adicione a variável `AUTH_SECRET` nas configurações do projeto
5. Depois do primeiro deploy, rode as migrations e o seed apontando pro banco
   de produção (pode rodar local com o `DATABASE_URL` de produção no `.env`,
   ou usar o terminal da Vercel)

## Próximos passos (ideias pra depois)

- Avatar dos membros puxando a skin do Minecraft (API tipo Crafatar/mc-heads)
- Categorias de votação além de "batalha geral" (ex: melhor farmer, melhor trader)
- Histórico de mudança de tier ao longo do tempo

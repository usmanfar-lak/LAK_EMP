# Lakarya Employee Self Service (ESS)

Production-ready starter for Lakarya Employee Portal:
- Next.js 14 App Router + TypeScript
- Microsoft Entra ID login (NextAuth)
- Role-based modules (Employee/Manager/HR)
- Admin local login
- Prisma + PostgreSQL
- Email notifications via Microsoft Graph

## ⚠️ Security
Never commit secrets. Store `AZURE_AD_CLIENT_SECRET`, `NEXTAUTH_SECRET`, and DB credentials in Railway/Vercel environment variables.
If you ever pasted a client secret publicly, revoke it immediately and rotate.

## Local setup

```bash
pnpm i
cp .env.example apps/web/.env.local
# Fill env vars
pnpm --filter @lakarya/web db:generate
pnpm --filter @lakarya/web db:migrate
pnpm dev
```

## Deploy
See section "Make it live" in the Copilot chat steps.

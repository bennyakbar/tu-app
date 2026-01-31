# Final Baseline Template - TU App

## Current Architecture
- **Framework**: Next.js 16 (App Router)
- **Runtime**: Node.js (via Turbopack)
- **Database**: PostgreSQL (via Prisma ORM)
- **Auth**: Custom Session (HTTP-only cookies) + Bcrypt
- **Styling**: Tailwind CSS
- **PDF**: @react-pdf/renderer
- **Excel**: xlsx

## Prisma Setup (CRITICAL)
- **Version**: Prisma v5 (Stable)
- **Client**: Single instance in `src/lib/prisma.ts`.
- **Initialization**: Standard `new PrismaClient()` without arguments.
- **Config**: Relies strictly on `prisma/schema.prisma` reading `DATABASE_URL` from environment.
- **Extensions**: None active to ensure stability.

## Runtime Requirements
- **Node.js Environment**: STRICTLY ENFORCED.
- **Edge Runtime**: BANNED for any database-interacting components.
- **Compliance Rule**: `export const runtime = "nodejs"` MUST be added to any Route Handler or Page that imports `prisma` if there is any ambiguity.

## Immutable Rules
1. **Never use `datasourceUrl`** in Prisma constructor.
2. **Never deploy Prisma to Edge** (Cloudflare Workers/Vercel Edge with DB access).
3. **Never modify `src/lib/prisma.ts`** to accept dynamic URLs unless passing strict type checks.
4. **Always serialize Decimal/Date** from Prisma before passing to Client Components.
5. **Single Source of Truth**: `docs/ERD.md` and `docs/PRD.md` govern all schema changes.

## Deployment
- Build Command: `npm run build` (Must pass without type errors).
- Start Command: `npm start`.

This baseline is FREEZEN. Any changes must respect these constraints.

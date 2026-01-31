# Deployment Checklist

## 1. Environment Variables
Ensure the following variables are set in your production environment (e.g., Vercel, VPS):

```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
SESSION_SECRET="generate_a_long_random_string_here"
NODE_ENV="production"
```

## 2. Database Migration
Run migration on the production database before deploying code:
```bash
npx prisma migrate deploy
```
*Note: Do not run `migrate dev` in production.*

## 3. Build & Start
Ensure the build passes without errors:
```bash
npm run build
```
Start the server:
```bash
npm start
```

## 4. Hardening Verify
- [ ] **Runtime**: Ensure `export const runtime = 'nodejs'` is present in all DB-interacting pages to prevent Edge Function errors.
- [ ] **Auth**: Users must be created via seed or direct DB access first (no public registration).
- [ ] **Role Protection**: Verify `src/middleware.ts` protects `/dashboard` routes.
- [ ] **HTTPS**: Production must use HTTPS (cookies are `Secure` by default in prod, though code says `httpOnly`). check `auth.ts` cookie settings.

## 5. Seed Initial Admin
Since there is no Registration page, you must seed an initial Admin user.
Use `npm run seed` if available, or create manually via `npx prisma studio`.

```bash
# Example Seed Command (if implemented)
# npx ts-node prisma/seed.ts
```

## 6. Backup & Maintenance
- Schedule regular database backups (pg_dump).
- Monitoring: Vercel Analytics or similar.

## 7. Known Limitations
- "Kenaikan Kelas" feature is UI-only placeholder (Phase 2).
- PDF generation requires server-side execution (Node.js).
- Excel export requires server-side execution (Node.js).

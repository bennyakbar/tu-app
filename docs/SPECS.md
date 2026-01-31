# Technical Specifications

## Frontend
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React
- **Notifications**: Sonner / React Hot Toast

## Backend
- **Runtime**: Node.js (via Next.js API Routes)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**:
  - Custom Session (HTTP-only cookies)
  - Bcrypt for password hashing

## Database & Storage
- **Database**: PostgreSQL
- **PDF Generation**: @react-pdf/renderer
- **Excel Export**: xlsx
- **Charts**: Recharts

## Deployment
- **Platform**: Vercel (recommended) / Docker-ready
- **Environment Variables**:
  - DATABASE_URL
  - JWT_SECRET (or SEQUENCE_KEY)

## Performance & Constraints
- Single school tenant
- No offline sync required
- Desktop-first UI design
# Fersa Support

Fersa Support is a multilingual, mobile-first after-sales technical support PWA. It contains a field portal for distributors and mechanics and a desktop service desk for support, technicians, and administrators.

## Included

- Next.js App Router, TypeScript, Tailwind CSS, shadcn-style components, Lucide, React Hook Form, Zod and TanStack Query.
- `next-intl` localization in Brazilian Portuguese (`pt-BR`), Spanish (`es`) and English (`en`), including browser locale detection, switcher and locale-aware dates.
- Mobile support journey: QR scanner (BarcodeDetector first, ZXing fallback), Part Number lookup, localized product content, guided diagnosis, self-service resolution, support-ticket wizard and ticket follow-up.
- Desktop service desk: operational metrics, language distribution, searchable ticket table and internal ticket view.
- Repository contracts with centralized mock/Supabase implementation selection. Mock is enabled by default and includes multilingual products, issues, tickets and routing.
- Supabase schema, database translations, Auth integration boundary, Realtime publication, RLS policies and Storage buckets.
- Installable PWA metadata, icons and an offline app-shell service worker.

## Run locally

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open the locale URL such as `http://localhost:3000/pt-BR`. In demonstration mode, no Supabase project is needed.

## Environment

| Variable                        | Purpose                                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_USE_MOCK_DATA`     | `true` (default) uses local multilingual demo repositories. Set to `false` to select Supabase repositories. |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL, required when mock mode is disabled.                                                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase browser anon key, required when mock mode is disabled.                                             |
| `NEXT_PUBLIC_APP_URL`           | Optional canonical deployment URL for auth recovery redirects. No domain is hardcoded.                      |

## Supabase setup

Apply `supabase/migrations/202608250001_initial_schema.sql`, then `supabase/rls.sql`. Details are in [supabase/README.md](supabase/README.md). The schema stores display content in translation tables and stores only stable enum values for statuses/priorities.

Storage buckets created by the migration:

- `avatars/{profileId}/...`
- `product-images/...`
- `manuals/{productId}/{locale}/...`
- `ticket-attachments/{organizationId}/{ticketId}/...`
- `technical-visits/{visitId}/...`

## Architecture

```text
src/
  app/                 routes and route groups
  components/          shadcn-style UI and composition components
  features/            form schema and feature services
  repositories/        contracts, mock and Supabase implementations
  services/            ticket routing, auth and future translation boundary
  i18n/                routing and request configuration
  lib/                 environment and Supabase helpers
  types/               domain types
messages/              pt-BR, es and en UI messages
supabase/              migrations and RLS policies
```

## Commands

```bash
npm run lint
npm run typecheck
npm run build
npm run format:check
```

## Production notes

Deploy to Vercel as a standard Next.js project. Configure the environment variables in Vercel; connect a custom subdomain there rather than embedding it in code. For sensitive admin writes and attachment signing, keep service-role operations in server-only routes, actions or Edge Functions. RLS is the authorization boundary; frontend role-specific navigation is only a user-experience layer.

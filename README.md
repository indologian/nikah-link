# NikahLink

Digital Wedding Invitation Platform

## Features

- Digital wedding invitation
- RSVP
- Guest management
- Wishes
- Gift / cashless
- Analytics
- Theme system
- Premium / Pro subscription
- Midtrans payment

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- Midtrans
- Vercel

## Subscription

| Plan | Price | Duration |
|------|------:|----------|
| Free | Rp0 | - |
| Premium | Rp99.000 | 90 hari |
| Pro | Rp299.000 | Lifetime |

## Development

npm install
npm run dev

## Environment Variables

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=

## Database

Supabase PostgreSQL + RLS

## Payment Architecture

Client
→ API
→ Create local subscription
→ Midtrans
→ Webhook
→ Verify Midtrans
→ Atomic subscription finalization

## Deployment

Vercel

## Project Structure

app/
components/
lib/
supabase/
graphify-out/
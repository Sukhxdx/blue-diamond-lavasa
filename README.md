# On Air & Blue Diamond Hotel

Booking site for Lavasa, Maharashtra.

- **On Air** is the villa. Guests book it as one whole home.
- **Blue Diamond Hotel** is the registered hotel name. Guests book rooms individually.
- The restaurant serves North Indian cuisine.

The public site, confirmation emails, and admin tools use these names. Prices, taxes, deposits, and contact details stay in configuration. They are not hard-coded.

## Stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS
- Supabase Postgres via Prisma for the restaurant. Staff sign-in is our own session cookie, not Supabase Auth
- Supabase Storage and Realtime, Razorpay, and Resend remain for the hotel booking work
- Razorpay for payments
- Resend for email
- Deploy target: Vercel

## 1. Run the site locally

You need Node.js 20.9 or newer.

```bash
cd "/Users/sukhada/Library/Mobile Documents/com~apple~CloudDocs/Blue_diamond_lavasa"
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`.env.local` is already created with empty secrets, so `cp` is only needed on a new machine. The home page, stay, restaurant, gallery, about, and contact pages load without Supabase or Razorpay keys. Live availability, checkout, and admin sign-in need those keys in later steps.

Check the project:

```bash
npm test
npm run lint
npm run build
```

## 2. What is in place

- Mobile-first shell, warm palette, serif headings, sans body text
- Search bar for check-in, check-out, and guests
- SEO metadata, Open Graph image, `sitemap.xml`, `robots.txt`, and JSON-LD for the hotel and villa
- Environment template in `.env.example`
- Folders for `app`, `components`, `lib`, `types`, and `supabase/migrations`

## Restaurant QR menu

Guests scan a table card that opens `/m?table=T01`. They enter a name and WhatsApp number, agree to the DPDP notice, and receive a 6-digit code. After the code checks out, the printed menu opens. Prices on the card are stored in paise and already include 5% GST.

The card had two split prices:

- Masala Papad `50/100` is stored as 1 pc and 2 pc
- Jeera Rice `90/130` is stored as half and full

Every dish on that card is vegetarian. Phone on the card: +91 96232 22130. Address: Link Road, Lavasa 412112.

### Database

Create a Supabase project and copy the pooler connection string into `DATABASE_URL`. Copy the direct connection string into `DIRECT_URL`. In Supabase, enable daily backups under Database → Backups. That is the backup, not a script in this app.

```bash
npx prisma generate
npx prisma migrate dev
npm run db:seed
```

`migrate dev` creates the migration on your machine. Production uses `npm run db:migrate`.

Fill the `SEED_*` values in `.env.local` before seeding. The seed creates one owner, two staff accounts, tables T01–T10, and the printed menu. Running it again does not overwrite prices or passwords.

Generate the two secrets:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Put the hex value in `DATA_PEPPER` and the base64 value in `APP_ENCRYPTION_KEY`.

For local testing without Meta, set `WHATSAPP_PROVIDER=console` and `DEV_RETURN_OTP=true`. The code is returned to the browser only in development. It is never written to the log. Production ignores `DEV_RETURN_OTP`.

### WhatsApp templates

1. In Meta Business Manager, add a WhatsApp Business phone number and a permanent token.
2. Create an authentication template for the one-time code. The body variable is the code. Leave `WHATSAPP_OTP_BUTTON=true` so the copy-code button receives it too.
3. Create a utility template whose body is “Welcome to Blue Diamond Restaurant”. If it has no variables, leave `WHATSAPP_WELCOME_HAS_NAME=false`.
4. After Meta approves both templates, set `WHATSAPP_PROVIDER=meta` and fill `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_OTP_TEMPLATE`, and `WHATSAPP_WELCOME_TEMPLATE`.

The provider lives behind `lib/whatsapp/types.ts`, so Twilio can replace the Meta client later without changing the OTP flow.

### Owner tools

Sign in at `/admin/login`. The owner can download QR cards, create staff, disable a staff account immediately, and turn on an authenticator app. Staff who open `/admin/tables` receive 403. Their home screen has no sales figures. Owner sessions end after 30 minutes idle, or 12 hours, whichever comes first. A guest menu session lasts until midnight IST.

### Deploy

Deploy the Next.js app on Vercel. Set every variable from `.env.example` in the Vercel project, with `WHATSAPP_PROVIDER=meta` and `DEV_RETURN_OTP` unset. Point `DATABASE_URL` at the Supabase pooler (port 6543, `pgbouncer=true`) and `DIRECT_URL` at the direct database (port 5432). Run `npx prisma migrate deploy` against `DIRECT_URL` before the first production request.

## 3. What comes next

Each step waits on the pricing, payment, and property details below.

1. Database migrations, row-level security, and seed data
2. Pricing and availability logic, with unit tests
3. Property pages, gallery, menu, and contact form
4. Booking, Razorpay order creation, and webhook confirmation
5. Admin dashboard
6. Confirmation email
7. Vercel deployment and the Razorpay webhook URL

Confirmed rules:

- The On Air villa and Blue Diamond Hotel rooms are separate inventory. Both can be booked on the same night.
- Guests pay a 30% advance online. The balance is due at check-in. The percentage stays editable in settings.
- Room and villa prices are GST-inclusive.
- Money is stored as integer paise, because Razorpay charges in paise.
- Weekend nights default to Friday and Saturday, and that rule stays editable in settings.

## Environment variables

| Name | Where it is used |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical links, sitemap, Open Graph |
| `NEXT_PUBLIC_PHONE_DISPLAY` | Number shown to guests |
| `NEXT_PUBLIC_PHONE_E164` | `tel:` link, digits with country code |
| `NEXT_PUBLIC_WHATSAPP_E164` | WhatsApp buttons. The floating button appears only after this is set |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public email link |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` | Map iframe `src` only |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser and server Supabase client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase key, protected by row-level security |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only. Bypasses row-level security |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Checkout in the browser |
| `RAZORPAY_KEY_ID` | Server order creation |
| `RAZORPAY_KEY_SECRET` | Server only |
| `RAZORPAY_WEBHOOK_SECRET` | Verifies `payment.captured` |
| `RESEND_API_KEY` | Confirmation email |
| `EMAIL_FROM` | From address, such as `Blue Diamond Hotel <bookings@yourdomain.com>` |
| `CRON_SECRET` | Expires unpaid 10-minute holds |

GST, advance percentage, check-in and check-out times, fees, and the cancellation policy will live in the database settings table, not in this file.

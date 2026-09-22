# Customer portal

Next.js App Router application for customer, machine, and user administration, plus account verification and password flows. Localization uses next-intl; styling uses Tailwind CSS.

1. Run `npm ci` in `Web`.
2. Copy `.env.example` to `.env.local` and configure your own Firebase project.
3. Run `npm run dev`.
4. Open `http://localhost:3000/en/portal/login`.

Authorized accounts, backend functions, and database rules must be provisioned separately. Use `npm run lint` for the existing lint command and `npm run build` to check a configured production build.

Select your own Firebase project when deploying a development instance.

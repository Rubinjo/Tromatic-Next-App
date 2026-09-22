# Customer portal

Next.js App Router application for customer, machine, and user administration, plus account verification and password flows. Localization uses next-intl; styling uses Tailwind CSS.

1. Run `npm ci` in `Web`.
2. Copy `.env.example` to `.env.local` and configure your own Firebase project.
3. Run `npm run dev`.
4. Open `http://localhost:3000/en/portal/login`.

`NEXT_PUBLIC_*` variables are browser-visible configuration, never server secrets. Authorized accounts, backend functions, and database rules must be provisioned separately. Use `npm run lint` for the existing lint command and `npm run build` to check a configured production build.

No Firebase project alias is committed. Any deployment must explicitly select your own project. Review the older dependencies before deploying a new instance.

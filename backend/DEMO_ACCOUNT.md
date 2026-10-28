# Live demo account

This creates a real, verified **learner** account in the database used by the backend. It uses the normal login API, so the deployed Vercel frontend needs no demo password or authentication bypass. No demo account is created automatically at application startup.

## Activate on Render

1. Deploy the backend version containing this command. Its normal build (`pnpm run build`) compiles the seed script.
2. In the backend Render service's **Environment** settings, add `DEMO_ACCOUNT_PASSWORD` with a password you choose, 12–72 characters long. Do not put it in Git, a `VITE_` variable, or the frontend's Vercel settings.
3. Optionally set `DEMO_ACCOUNT_EMAIL`. Its default is `demo@studyconnect.test`; this reserved test domain does not receive email. The account is verified by the setup command, so it does not need an OTP.
4. In the backend service's shell, run from its `backend` working directory:

   ```bash
   pnpm run seed:demo
   ```

   If your Render plan does not provide a shell, temporarily use this start command for one deployment:

   ```bash
   pnpm run seed:demo && pnpm run start:prod
   ```

   After it reports that the demo learner was created, restore `pnpm run start:prod` as your start command.

5. Open your Vercel site, select **Log In**, and enter `demo@studyconnect.test` (or your configured email) with the password you set in Render.

The script uses the existing `DB_*` variables and does not create or synchronize database tables. Start the normal backend at least once to prepare its schema. It prints the email and result, never the password. If the email already exists, that account and its password are left unchanged. Changing `DEMO_ACCOUNT_PASSWORD` later does not reset an existing account; use normal password recovery with a deliverable email or an authorized database administration process instead.

All visitors who use this account share its real learner data and permissions. Use sample information when exploring. Sessions, materials, and activity are not fabricated; empty states remain until actual actions create data.

## Local verification

Use a local database and set `DEMO_ACCOUNT_PASSWORD` only in your shell environment or ignored `backend/.env` file. From `backend`, run `pnpm run build`, `pnpm run seed:demo`, and `pnpm test`. Repeating the seed command must leave the account unchanged.

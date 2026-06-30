# Admin Panel Setup

## 1. Supabase configuration

1. Create or open your Supabase project.
2. Open the SQL editor and run the SQL from [SUPABASE_SCHEMA.sql](SUPABASE_SCHEMA.sql).
3. Confirm the generated tables exist:
   - `doctors`
   - `patients`
   - `appointments`
   - `activity_logs`
   - `admin_profiles`
4. In the Supabase dashboard, enable authentication for the Email/Password provider.

## 2. Environment variables

Set these values in your local `.env.local` or deployment environment:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_EMAILS=usmanbaig124@gmail.com
```

## 3. Create the initial admin account

1. Sign up or sign in with the email `usmanbaig124@gmail.com` through the app.
2. Open the admin roles page at `/admin/roles`.
3. Add the same email as a `super_admin` role.

## 4. Access the Admin Panel

After the account is marked as admin, visit:

- `/admin`
- `/admin/doctors`
- `/admin/appointments`
- `/admin/users`
- `/admin/analytics`
- `/admin/roles`

Non-admin users are redirected away from the admin area.

## 5. Security notes

- RLS is required for all admin-sensitive tables.
- Do not expose the service role key to the browser.
- Keep `NEXT_PUBLIC_ADMIN_EMAILS` limited to trusted addresses.
- Review access regularly from the roles page.

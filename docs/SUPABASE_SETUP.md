# Supabase setup (Mission Golf)

1. Create a Supabase project at https://supabase.com
2. Copy `.env.local.example` to `.env.local` and add your project URL and anon key
3. Run the SQL migration in `supabase/migrations/20260805000000_mission_golf.sql` in the Supabase SQL editor
4. Enable Email auth in Authentication → Providers
5. Add redirect URL: `http://localhost:3000/reset-password` (and your production URL)

## Tables

- `profiles` — user profile linked to `auth.users`
- `standards` — My Standard statements (5–8 per user)
- `missions` — mission lifecycle data
- `mission_intents` — daily mission intent / morning commit
- `daily_debriefs` — debrief submissions (jsonb)
- `evidence` — evidence entries derived from debriefs
- `reviews` — weekly/monthly/annual review completion

All tables use Row Level Security — users can only access their own rows.

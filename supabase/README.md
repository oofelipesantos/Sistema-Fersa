# Supabase

1. Create a Supabase project and copy the public URL and anonymous key into `.env.local`.
2. Apply `migrations/202608250001_initial_schema.sql` with the Supabase CLI.
3. Apply `rls.sql` after the migration.
4. Set `NEXT_PUBLIC_USE_MOCK_DATA=false` and restart the application.

The migration creates the required private buckets and enables Realtime for tickets, ticket messages, and notifications. The application uses only the anonymous key; administrative workflows should use server actions or Edge Functions with a service role key that is never exposed to the client.

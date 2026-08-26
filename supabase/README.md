# Supabase

1. Create a Supabase project and copy the public URL and anonymous key into `.env.local`.
2. Apply the SQL files in `migrations/` in timestamp order. For an existing project, do not reapply the historical initial schema; apply only pending migrations.
3. If the original project was provisioned manually, keep `rls.sql` as its baseline and apply the incremental migrations afterward. The latest migration replaces the affected policies idempotently.
4. Set `NEXT_PUBLIC_USE_MOCK_DATA=false` and restart the application.
5. For a disposable local project with seed products, run `tests/company_isolation.sql` to verify that one customer cannot read another customer's ticket.

The migrations create the required buckets and enable Realtime for tickets, ticket messages, and notifications. Product manuals are public content. Ticket attachments remain private and use paths in the form `{organizationId}/{ticketId}/{randomId}-{fileName}`; both relational and Storage policies validate access to the ticket.

Self-registration sends company data as Auth metadata. The `handle_new_user` trigger creates the company, profile and membership atomically with `PENDING` verification. Pending companies may open tickets; blocked companies cannot. The `review_organization` RPC is restricted to authenticated support and admin profiles by a security-definer role check.

The browser application uses only the anonymous key. Never expose the service-role key in a `NEXT_PUBLIC_*` variable or client bundle.

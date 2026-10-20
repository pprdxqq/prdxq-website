# PRDXQ Website

Static HTML, CSS, and JavaScript pages served by Vercel. The project inquiry endpoint and daily retention task are Vercel Functions. Inquiry records are stored in Supabase Postgres.

See [OPERATIONS.md](OPERATIONS.md) for local preview, service configuration, database migration, deployment, and the inquiry workflow.

## Local checks

Run the dependency-free inquiry validation tests with:

~~~sh
node --test
~~~

The public contact form remains disabled until its Turnstile site key and the required Vercel and Supabase environment variables have been configured.

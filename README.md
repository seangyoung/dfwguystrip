# DFW Guys Trip Hub

A GitHub Pages-hosted trip planning app for a small DFW group. It provides activity and itinerary browsing, magic-link sign-in, preference ranking, a candidate-date calendar, and a coordinator dashboard.

## Run locally

1. Copy `.env.example` to `.env`.
2. Add the Supabase project URL, public anonymous key, and the coordinator email. The app runs in a clearly labeled demo mode if these are absent.
3. Install dependencies with `npm install` and start with `npm run dev`.

## Configure Supabase

1. Create a Supabase project and run [`supabase/schema.sql`](./supabase/schema.sql) in its SQL Editor.
2. In Authentication > URL Configuration, add the production GitHub Pages URL and `http://localhost:5173` to redirect URLs.
3. Have the organizer sign in once, then run the final commented `update` statement in `schema.sql` with their actual email address to make that account a coordinator.
4. Add the three `VITE_*` values as GitHub repository variables. They are public client configuration, not service-role secrets.

## Deploy

Push to `main`, then enable **GitHub Pages** with **GitHub Actions** as the source. The included workflow builds and deploys automatically.

## Current data behavior

The interface includes seeded planning data so it is useful before a backend is connected. The SQL schema defines the production tables, roles, and row-level access policies. Connect the UI queries to the Supabase tables once the project configuration is available; this keeps individual participant responses private while coordinators can see aggregate results.

After running `supabase/schema.sql` in the Supabase SQL Editor, run `supabase/seed.sql` there as well. The seed establishes the activity and candidate-date IDs required for participant votes and availability responses. It is safe to rerun.

All figures labeled **Estimate** are planning figures, and source links should be rechecked before reservations are made.

# Finoptiv repair notes

## Changes included

- Replaced timestamp strings such as `"now()"` with actual ISO-8601 UTC timestamps for publishing and prediction resolution.
- Added explicit Supabase configuration checks and safer admin-verification errors (503 instead of opaque 500s when configuration/database access is unavailable).
- Added a database-backed health endpoint so the keep-alive request actually reaches Supabase.
- Added migration `0005_admin_storage_security.sql`: secure SECURITY DEFINER admin check, corrected user-scoped admin RLS policies, admin-only image-bucket management, bucket configuration, and `articles.updated_at` trigger. The FastAPI backend uses its privileged server key and therefore continues to enforce JWT/admin membership checks at the API layer.
- Added current Supabase publishable/secret key variable names while retaining legacy key compatibility.
- Added browser-side image MIME-type and 5 MB size checks.
- Removed the hardcoded contact-email fallback; Hire Me buttons appear only after `NEXT_PUBLIC_OWNER_EMAIL` is set.
- Fixed sitemap/robots domain detection using Vercel system variables.
- Added the missing public `/system-design` page, added it to the navigation and sitemap, and updated the architecture specification to match the one-project/two-service deployment.
- Added frontend production build to CI and changed keep-alive to a configurable `SITE_URL` repository variable.
- Added a Vercel Deploy Button and updated the deployment guide. Supabase project creation, SQL migrations, and the owner admin row still require the project owner's account actions.

## Apply

Extract the `overlay` folder into the repository root and allow it to merge with the existing `backend`, `frontend`, `supabase`, `.github`, `README.md`, `DEPLOYMENT-GUIDE.md`, and `vercel.json` paths. Do not replace the entire repository with the overlay; it only contains changed/new files.

Then commit and push the resulting changes to GitHub. Apply `0005_admin_storage_security.sql` in the Supabase SQL Editor after migrations `0001`–`0004` and before `seed.sql` (or run the full ordered list in the deployment guide).

## Verification status

The source changes were checked against the repository's current file layout. This environment could not run a full install/build or query the live Supabase project, and the linked GitHub connection is read-only, so no commit or deployment has been performed. Run the GitHub Actions workflow after pushing and verify `/api/backend/health` after deployment.

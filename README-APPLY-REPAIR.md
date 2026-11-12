# Apply the Finoptiv repair kit (Windows)

This kit contains only changed/new files, not a replacement copy of the whole repository.

## Easiest route with GitHub Desktop

1. Install/open **GitHub Desktop** and sign in with the GitHub account that owns `Sdsourab/finoptivbd`.
2. Choose **File → Clone repository → URL** and enter `https://github.com/Sdsourab/finoptivbd`.
3. Open the cloned repository folder from GitHub Desktop.
4. Extract this repair-kit ZIP **directly into that repository folder**. Keep the `overlay` folder and `APPLY-FIXES.ps1` beside the repository's existing `README.md` and `vercel.json`.
5. Open PowerShell in the repository folder and run:

```powershell
powershell -ExecutionPolicy Bypass -File .\APPLY-FIXES.ps1
```

6. The script copies the changed files into their correct paths and backs up any replaced files under `.finoptiv-backup/`.
7. Return to GitHub Desktop. Review the changed-file list, enter a commit message such as `fix: harden Supabase and Vercel deployment`, click **Commit to main**, then **Push origin**.
8. Once the changes are on GitHub, follow `DEPLOYMENT-GUIDE.md` and use the Vercel Deploy Button in the README.

## Important

- Do not upload the ZIP itself as the application source.
- Do not replace the repository with the `overlay` folder. The overlay is merged into the existing project.
- Run migration `0005_admin_storage_security.sql` after migrations `0001`–`0004` and before `seed.sql` on an existing Supabase project.
- The script does not read or change any Supabase secrets, GitHub secrets, or Vercel environment values.
- The GitHub connection available to this review has read-only permissions, so it cannot push these changes on your behalf. GitHub Desktop uses your own GitHub sign-in to publish the fixes.

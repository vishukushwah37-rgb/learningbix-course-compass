<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Routing is TanStack Router file routes (not React Router DOM); dashboards live under `src/routes/_authenticated/` and render their own shell — `__root.tsx` hides the marketing header/footer for app-area paths.
- Public catalogue reads (products, courses) go through `src/lib/catalog.functions.ts` with the publishable key so pages render on the server.
- Store pricing rules live only in `src/lib/pricing.ts`, shared by the cart and server-side order creation.
- Roles live in `user_roles`; signup may only create student/parent (enforced in the `handle_new_user` trigger); other roles are granted by admins.
- Quiz scoring and lesson completion run in security-definer database functions (`submit_quiz`, `complete_lesson`) so answer keys never reach students.
- Site images are hosted assets; URLs are collected in `src/lib/images.ts`.

# Portfolio (Next.js + Tailwind)

Two pages:
- `/` landing page
- `/more` full info, projects, and a "Leave a note" section (like, dislike, comments)

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

For production: `npm run build` then `npm start`.

## Your photo
Put your picture at `public/foto.jpg`. It automatically replaces the "K" in the pink frame.

## Edit your content
- Landing text, skills: `app/page.tsx`
- About, experiences, projects: `app/more/page.tsx`
- Colors and styles: `app/globals.css`

## Likes and comments
- API: `app/api/feedback/route.ts`, UI: `app/components/Feedback.tsx`
- Everything is saved in `data/feedback.json` (created automatically, ignored by git).
- One vote per visitor (a cookie identifies them). Tap the same button again to undo.
- To delete an unwanted comment, remove its entry from `data/feedback.json`.

### Deploying
The JSON file needs a server with a writable disk (your own VPS, Railway, Render with a disk).
On Vercel the disk is temporary, so likes and comments would be lost. For Vercel,
swap `lib/store.ts` for a database (e.g. Supabase or Vercel KV/Upstash). The rest of the code stays the same.

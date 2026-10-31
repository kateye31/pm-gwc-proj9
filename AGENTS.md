# Project 9 — Knight's Escape (Girls Who Code)

Mentor workspace for a 4-person student team building an OOP escape-room game. Demo: Thu Nov 12, 2026.
Team: Leslie, Sanjana (build), Shirley, Tvishaa (design). Mentor: Katrina.

## Folders
- `escape-room-starter/` — the students' game. Plain HTML/CSS/JS, no build step, open `index.html`.
  - `rooms.js` holds all puzzle content as data. `game.js` is logic. `style.css` is the design team's.
  - Keep it beginner-readable: no frameworks, no bundlers, short functions, plain comments.
  - Leave the `TODO` markers for students; they are their assigned work. Don't finish their tasks.
- `board/` — the team board, published as a claude.ai artifact.
  - Edit `quest-board.src.html`, then run `python board/build.py` (it inlines `fonts/` into `quest-board.html`). Never hand-edit `quest-board.html`.
  - It is a page fragment: no `<html>/<head>/<body>` tags (the host adds them). Keep `<title>` and `<style>` at the top.
  - Single dark theme ("lantern-lit dungeon"). Colors only via the `:root` tokens.
  - Public-site font: Beanzo is personal-use only, so `build_site.py` swaps in an open (OFL) Google Font for `--display` on GitHub Pages (now Grenze Gotisch, picked for legibility at 23px; Jacquard 24 was too hard to read). Labels and numbers there use bold Atkinson via `--label` / `--num`. Change it there, not in the board source. Font comparison: `board/fonts/specimen.jpg`.
  - Fonts: Beanzo (the team's font) for screen titles and big numbers only. All readable text (body, labels, buttons, small text) is Atkinson Hyperlegible (Google Fonts), fallback Times New Roman. Never Newstan/Road Hunter for small text: they're display fonts and unreadable small. No Inter/Geist.
  - Layout: app shell with screens My quest (`today`), Council, Team tasks, Game plan, plus Live (`mentor`), shown only when `user.isOwner()` is true. Personal links `#leslie`, `#sanjana`, `#shirley`, `#tvishaa`, `#katrina` pick the person and their Council seat. Don't add tabs; put new things inside an existing screen.
  - QA: `node board/checks/browser-qa.cjs` (needs Chrome). `council-tests.cjs` is a module the runner calls; running it alone tests nothing.
  - The Council markup lives in `council.html` (inlined by build.py); `council.js` depends on its ids.
  - Party mode (`party.html/css/js`, inlined by build.py): `#host` is the streamed big screen (controls only for the owner), `#play` is the phone controller (daily 4-letter room code + name). It reuses `window.P9_ROUNDS` from council.js and writes the same `workshop_sessions` / `workshop_answers` records, plus `party_players`. Inspired by party games; never copy another company's branding or art.
  - The game design belongs to the team (Group 9 design roadmap: warlock, 4 chambers). Don't invent rooms.
  - The Discord kit's posts live in `discord-kit.src.html` (private, gitignored). `build.py` inlines them into Live on the private Claude board only; the public site build never gets them (notes about the girls). The standalone kit still builds with `python board/build.py <out> discord-kit.src.html`.
  - Katrina edits the board herself: task Edit buttons, and "Edit the board" (rewrite text, hide/drag cards, add her own cards), saved as `kind: "page"` records in `workshop_sessions`. Her kit wording saves as `kind: "kit"` records. Never overwrite her edits; when she rewrites a post or task, match what she actually sent.
  - Data comes from `window.claude.use("db")`: `tasks` and `checkins` (`<date>_<name>`). Never hardcode records in the page.
  - Motion: transform/opacity only, ease `--ease-out`, under 300ms, respect `prefers-reduced-motion`.
  - Editing this file does not update the live page; Claude republishes it.

## Writing student tasks (Katrina's)
The girls are brand new to GitHub, VS Code and OOP. Every task must be doable without coming back to ask.
- Title names the concept plainly. "Done when" is one short sentence: what you see when it works.
- `steps`: a numbered list, one action each, ~9 max. Step 1 plays the game to that spot. The last steps save, refresh (F5), play to check, then commit and push (Team Guide, Part 3).
- Say where with search text, not line numbers: "In VS Code, open rooms.js, Ctrl+F: const WARLOCK".
- Define each code word the first time it appears, and say why (which concept; link the Charter table).
- Hints, not answers. Never paste the finished code.
- Check the search text exists on the student's branch in github.com/kateye31/group9 (the source of truth), and don't rely on notes from unmerged PRs.
- Write tasks to both the Claude artifact DB and Firebase.

## Board design rules (Katrina's)
- Art must be real, human-made work: public-domain paintings/manuscripts (Wikimedia Commons) or the students' own drawings. No AI-generated images. Credit every image on the page.
- No small uppercase "eyebrow" labels above headings. No colored left-border rails thicker than 1px.
- Files go through `window.p9SaveText(filename, text)` (the `downloads` capability). Plain `<a download>` links do nothing in the viewer.
- Keep `art/` images under ~250 KB each (JPEG, ~1400px wide max).

## Don'ts
- Don't commit or push unless asked.
- Don't add dependencies.

# Handoff: WorkAdventure and Hetzner for a fresh Claude session

Read this first if you are a new Claude instance asked to work on WorkAdventure
worlds or the Hetzner server. It is written for someone with no memory of the
previous sessions. Owner: Archana (GitHub varchanaiyer, email
varchanaiyer139@gmail.com). Date of writing: 11 September 2026.

## What exists

| Thing | Where | State |
| --- | --- | --- |
| The museum world (WorkAdventure maps, placards, generators) | this folder, `/Users/archana/Desktop/website_pictures/ai-safety-museum-world`, pushed to github.com/varchanaiyer/ai-safety-museum-world | deployed by GitHub Actions to GitHub Pages on every push to `main` |
| The museum, live | https://play.workadventu.re/_/global/varchanaiyer.github.io/ai-safety-museum-world/maps/core.tmj | hosted WorkAdventure, free plan, 10 visitors at a time. Do not move it without being asked |
| The original first-person museum (raycaster) | `/Users/archana/Desktop/website_pictures/ai-safety-museum-org`, branch `presence-voice`, uncommitted | canonical repo is github.com/aisafetymuseum/ai-safety-museum (Archana has read-only access); live at visit.aisafety.museum on Vercel |
| A Hetzner server running self-hosted WorkAdventure | `museum-play`, cx23, Falkenstein, IPv4 178.105.222.101 | up, healthy, 7.72 EUR/month, meant for a NEW world, not the museum |
| The plan and rationale | https://claude.ai/code/artifact/3bf05b63-1cc8-46f5-9d22-7c08b7842552 | decisions, costs, risks |

## Credentials and tools on this Mac

- Hetzner API token: stored in `~/.config/hcloud/cli.toml`, context name `museum`. Never print it. `hcloud context active` should say `museum`. Archana was advised to rotate it; if `hcloud` fails with 401, ask her for a new token and put it in that file.
- SSH to the server: `ssh -i ~/.ssh/id_ed25519 root@178.105.222.101` (the key is registered at Hetzner as `museum`).
- GitHub: `gh` is logged in as varchanaiyer with `repo` and `workflow` scopes.
- Node: use `source ~/.nvm/nvm.sh && nvm use 22`. The default Node 18 cannot run the WorkAdventure starter kit's build.
- Installed: `hcloud`, `cloudflared`, `gh`, Google Chrome (for headless tests), Tiled is not installed (`brew install --cask tiled`).
- Not available: AWS, Docker on the Mac, Vercel CLI. DigitalOcean, Fly and Railway CLIs are installed but logged out.
- This Mac has 8 GB of RAM. Never open more than three or four headless browser tabs of WorkAdventure at once; thirteen sent it into swap for an hour.

## The Hetzner server

Created by `hosting/provision.sh` from `hosting/cloud-init.yaml`. On the box:

- `/opt/workadventure/docker-compose.yaml` and `/opt/workadventure/.env` (WorkAdventure v1.33.6, the official Compose deployment; Traefik gets Let's Encrypt certificates automatically; single domain, path routing).
- Install log: `/opt/workadventure/setup.log`.
- Firewall (ufw): only SSH, 80, 443. Hetzner firewall `museum-web` does the same at the edge.
- Currently configured with `DOMAIN=play.aisafety.museum` and the museum as `START_ROOM_URL`. No DNS record points at it yet. Both values are placeholders until Archana names the new world.

To repoint it at a new hostname and world:

```sh
ssh -i ~/.ssh/id_ed25519 root@178.105.222.101
cd /opt/workadventure
sed -i 's|^DOMAIN=.*|DOMAIN=new.host.example|' .env
sed -i 's|^START_ROOM_URL=.*|START_ROOM_URL=/_/global/OWNER.github.io/REPO/maps/map.tmj|' .env
docker compose up -d
```

Then an `A` record for that hostname to 178.105.222.101, wait a minute, and
`https://new.host.example/` walks people into the default room. Any other
map works as `https://new.host.example/_/global/<host>/<path>.tmj`.

Useful: `docker compose ps`, `docker compose logs -f play`, `docker compose pull && docker compose up -d` to update after bumping `VERSION`.

To make another server: `SERVER_TYPE=cx23 ./hosting/provision.sh some.host you@example.com other-name`. To delete one: `hcloud server delete NAME` (this stops billing).

Self-hosted WorkAdventure has no visitor cap on the free plan's terms, but the docs say bots and custom avatar outfits are hosted-only features. LiveKit (bubbles of more than four) and Coturn (about 15 percent of visitors fail audio without it) are separate servers; see `hosting/README.md`.

## Making a new world

1. Clone https://github.com/workadventure/map-starter-kit, `rm -rf .git`, `git init -b main`.
2. In `.env`: `UPLOAD_MODE=GH_PAGES`. In `.github/workflows/build-and-deploy.yml`: branches `main`, `BASE_BRANCH: main`.
3. Draw maps in Tiled (32 px tiles, JSON export, `floorLayer` object group, embedded tilesets, `collides` tiles, a `start` layer) or generate them; this repo's `scripts/convert.cjs`, `scripts/tileset.cjs` and `scripts/paint.cjs` show how to generate maps and a CC0 tileset with labels from data.
4. `gh repo create OWNER/REPO --public --source . --push`, then enable Pages once the workflow has created the `gh-pages` branch: `gh api -X POST repos/OWNER/REPO/pages -f "source[branch]=gh-pages" -f "source[path]=/"`.
5. Play at `https://play.workadventu.re/_/global/OWNER.github.io/REPO/maps/map.tmj` (hosted, 10 visitors) or through the Hetzner server (no cap).

`HOW-TO-WORKADVENTURE.md` in this folder has the full property reference (openWebsite, exitUrl, silent, jitsiRoom, websites on the map, scripting) and the testing recipe.

## Testing a world in the real client

`hosting/tests/wa-client-test.js` drives the actual WorkAdventure client with Playwright through the name, avatar and camera screens, then walks to a placard and presses Space. It needs `npm i playwright-core` in a scratch folder and the installed Chrome:

```sh
node wa-client-test.js core OWNER.github.io/REPO '' placard        # hosted, public map
INSTANCE=global node wa-client-test.js core some.host '' exits        # walk through a door
```

Local maps cannot be tested from `localhost`: the client runs on an https page and browsers block it. Run `npm run dev` in the world repo, then `cloudflared tunnel --url http://localhost:5173`, wait twenty seconds before resolving the name (home routers cache a negative answer), and play `https://play.workadventu.re/_/test/<name>.trycloudflare.com/maps/map.tmj`. Vite must allow the host: `server.allowedHosts: [".trycloudflare.com"]`.

## Things learned the hard way

- WorkAdventure's free hosted plan counts 10 simultaneously connected users across your space, and refuses the eleventh. Whether a different instance label (`/_/other/`) is counted separately is untested; a test of it overloaded this Mac.
- Long scripted walks and click-to-walk fail with "No path found" on large open maps. Two tiles per grid cell would be better than the museum's three.
- Sites that send `X-Frame-Options` cannot open in the side panel; use `openTab`. The museum's 24 embeddable exhibits were checked one by one.
- Tile placement must use the same origin offset for every layer; a one-cell drift between walls and floors is easy to introduce.
- Archana's writing rule: no em dashes in anything written for her.

## The PRISM open day world (added 11 September 2026)

A second world, built with the recipe above, for the PRISM cohort showcase
(PRISM is the Peer-vetted Research Initiative for Safety Methodologies, Archana's
W2D2 fellowship; week 15 of the cohort is the showcase).

| Thing | Where |
| --- | --- |
| Repo | `/Users/archana/Desktop/website_pictures/prism-openday-world`, github.com/varchanaiyer/prism-openday-world, deployed to GitHub Pages by the same workflow |
| Play (hosted, 10 visitors) | https://play.workadventu.re/_/global/varchanaiyer.github.io/prism-openday-world/maps/lobby.tmj |
| Rooms | `lobby`, `posters` (a foyer with four doors), `posters-<track>` (one room per track, 23 NeurIPS 2025 posters in all), `stage` (one shared Jitsi call), `teams` (12 pods, opt-in calls), `lounge` (silent reading room) |
| Content | `content/posters.txt` (track + neurips.cc id), `content/teams.json`; `npm run posters && npm run content` regenerates everything |

Its `node_modules` is a symlink to this repo's, so `npm install` here first.
Poster pages on neurips.cc refuse iframes, so each poster has its own placard page
under `pages/posters/` that embeds the poster PNG (served by neurips.cc with open
CORS) and links back. Pages without an uploaded poster image are skipped by the
fetch script; nine candidates were dropped for that reason.

Lesson from the first play test: an arrival area placed on the tile next to an
exit mat throws the visitor straight back through the door. Keep arrivals two
tiles clear of any exit. `scripts/build-maps.cjs` now refuses to write maps if
an exit points at an arrival name that does not exist on the other side.

The Hetzner server was meant to serve this world. The intended change (not yet
applied when this was written; a permission prompt blocked it):

```sh
ssh -i ~/.ssh/id_ed25519 root@178.105.222.101
cd /opt/workadventure && cp .env .env.bak
sed -i 's|^DOMAIN=.*|DOMAIN=openday.prism-research.org|' .env
sed -i 's|^START_ROOM_URL=.*|START_ROOM_URL=/_/global/varchanaiyer.github.io/prism-openday-world/maps/lobby.tmj|' .env
docker compose up -d
```

Then an `A` record `openday.prism-research.org` to 178.105.222.101. Jitsi on the
server is `meet.jit.si`, `MAX_PER_GROUP=4`.

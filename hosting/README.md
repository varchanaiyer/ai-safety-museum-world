# Hosting WorkAdventure ourselves

Why: the hosted free plan admits ten visitors at a time. One small server of
our own has no such limit; WorkAdventure's own guide says a 2-CPU, 4 GB
machine handles about 300 concurrent users. Cost on Hetzner: 7.72 euros a
month including VAT for the `cx23` server (September 2026 price). The maps stay on GitHub Pages; the server only
runs the world. What we give up by self-hosting, per WorkAdventure's docs:
scripted bots and custom avatar outfits, which are hosted-only features.

## One-time setup, about fifteen minutes

1. **Hetzner account.** Sign up at hetzner.com, verify with a card, then in
   the Cloud Console create a project (call it `museum`).
2. **API token.** In that project: Security, API tokens, Generate API token,
   permissions Read & Write. Copy it once; Hetzner will not show it again.
3. **Tell the tool about it.** In Terminal:
   ```sh
   brew install hcloud          # already done on Archana's Mac
   hcloud context create museum # paste the token when asked
   ```
4. **Create the server.**
   ```sh
   ./hosting/provision.sh play.aisafety.museum you@example.com
   ```
   This creates an SSH key, a firewall that allows only SSH, HTTP and HTTPS,
   and a `cx23` server in Falkenstein running Ubuntu 24.04. On first boot the
   server installs Docker, downloads WorkAdventure `v1.33.6` (the official
   Compose deployment, with Traefik and automatic Let's Encrypt certificates),
   generates its secrets, and starts.
5. **DNS.** Add an `A` record at the domain's registrar:
   `play.aisafety.museum` pointing at the IP the script printed.
6. **Wait and check.**
   ```sh
   ./hosting/check.sh play.aisafety.museum
   ```
   It prints the play address when the certificate is issued:
   `https://play.aisafety.museum/_/global/varchanaiyer.github.io/ai-safety-museum-world/maps/core.tmj`

The museum is the default room, so `https://play.aisafety.museum/` alone
also walks people in.

## Operating it

- Logs: `ssh root@IP` then `cd /opt/workadventure && docker compose logs -f`.
- Update WorkAdventure: change `VERSION` in `/opt/workadventure/.env` to the
  new release tag, download the matching `docker-compose.prod.yaml` and
  `.env.prod.template` from that tag if the release notes say the compose
  file changed, then `docker compose pull && docker compose up -d`.
- Settings live in `/opt/workadventure/.env`. `MAX_PER_GROUP` (default 4) is
  the size of an audio and video bubble without LiveKit.
- Reboot-safe: Docker restarts the containers.

## When to add the two helpers

- **Coturn** when visitors on office or university networks report silence.
  WorkAdventure's guide: without it about 15 percent of visitors cannot
  connect audio and video. Second server, `TURN_SERVER` and
  `TURN_STATIC_AUTH_SECRET` in `.env`.
- **LiveKit** when a docent needs a bubble of more than four people. Third
  server, `LIVEKIT_HOST`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` in `.env`.

Both are documented in WorkAdventure's self-hosting guide; each is another
`cx22` at the same price.

## Files

- `cloud-init.yaml` the first-boot script, with placeholders `provision.sh` fills.
- `provision.sh` creates key, firewall and server with `hcloud`.
- `check.sh` waits for DNS and the certificate and prints the play address.

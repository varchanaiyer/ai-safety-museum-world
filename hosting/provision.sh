#!/usr/bin/env bash
# Creates the museum's WorkAdventure server on Hetzner Cloud.
#   ./provision.sh play.aisafety.museum you@example.com
# Needs an active hcloud context: `hcloud context create museum` (paste an API token).
set -euo pipefail
DOMAIN="${1:-play.aisafety.museum}"
ACME_EMAIL="${2:?second argument: an email address for the Lets Encrypt certificate notices}"
NAME="${3:-museum-play}"
START_ROOM_URL="${START_ROOM_URL:-/_/global/varchanaiyer.github.io/ai-safety-museum-world/maps/core.tmj}"
VERSION="${WA_VERSION:-v1.33.6}"
TYPE="${SERVER_TYPE:-cx23}"
LOCATION="${LOCATION:-fsn1}"
cd "$(dirname "$0")"
hcloud context active >/dev/null 2>&1 || { echo "No Hetzner token yet. Run: hcloud context create museum"; exit 1; }
if [ ! -f "$HOME/.ssh/id_ed25519.pub" ]; then ssh-keygen -t ed25519 -N "" -f "$HOME/.ssh/id_ed25519" -C museum >/dev/null; fi
hcloud ssh-key describe museum >/dev/null 2>&1 || hcloud ssh-key create --name museum --public-key-from-file "$HOME/.ssh/id_ed25519.pub" >/dev/null
if ! hcloud firewall describe museum-web >/dev/null 2>&1; then
  hcloud firewall create --name museum-web >/dev/null
  for p in 22 80 443; do hcloud firewall add-rule museum-web --direction in --protocol tcp --port "$p" --source-ips 0.0.0.0/0 --source-ips ::/0 >/dev/null; done
fi
sed -e "s|__DOMAIN__|$DOMAIN|g" -e "s|__ACME_EMAIL__|$ACME_EMAIL|g" -e "s|__START_ROOM_URL__|$START_ROOM_URL|g" -e "s|__VERSION__|$VERSION|g" cloud-init.yaml > /tmp/museum-cloud-init.yaml
hcloud server create --name "$NAME" --type "$TYPE" --image ubuntu-24.04 --location "$LOCATION" --ssh-key museum --firewall museum-web --user-data-from-file /tmp/museum-cloud-init.yaml
IP="$(hcloud server ip "$NAME")"
echo
echo "Server $NAME is up at $IP and is installing WorkAdventure (three to five minutes)."
echo "Add a DNS record now:   $DOMAIN   A   $IP"
echo "Then run:               ./check.sh $DOMAIN"
echo "Logs on the box:        ssh root@$IP tail -f /opt/workadventure/setup.log"

#!/usr/bin/env bash
# Waits for DNS and the certificate, then prints the play address.
#   ./check.sh play.aisafety.museum
set -uo pipefail
DOMAIN="${1:-play.aisafety.museum}"
START_ROOM_URL="${START_ROOM_URL:-/_/global/varchanaiyer.github.io/ai-safety-museum-world/maps/core.tmj}"
IP="$(hcloud server ip museum-play 2>/dev/null || true)"
for i in $(seq 1 60); do
  R="$(dig +short "$DOMAIN" @1.1.1.1 | tail -1)"
  if [ -n "$IP" ] && [ "$R" != "$IP" ]; then echo "DNS: $DOMAIN -> ${R:-nothing yet} (want $IP)"; sleep 20; continue; fi
  CODE="$(curl -s -o /dev/null --max-time 15 -w '%{http_code}' "https://$DOMAIN/" || true)"
  if [ "$CODE" = "200" ]; then echo "https://$DOMAIN/ answers 200 with a valid certificate."; echo; echo "Play address:"; echo "  https://$DOMAIN$START_ROOM_URL"; exit 0; fi
  echo "https://$DOMAIN/ -> ${CODE:-no answer} (certificate or containers still coming up)"; sleep 20
done
echo "Still not up after 20 minutes. Check: ssh root@$IP tail -50 /opt/workadventure/setup.log"; exit 1

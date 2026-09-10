/// <reference types="@workadventure/iframe-api-typings" />
/* The museum's map script: hall names as you cross into them, and the
   exhibit counter. Zones are tile layers named zone-<hall>, painted by
   scripts/convert.cjs; halls.json is written by the same script. */
import halls from "./halls.json";

const HALLS: Record<string, string> = halls;

WA.onInit().then(() => {
  for (const key of Object.keys(HALLS)) {
    WA.room.onEnterLayer("zone-" + key).subscribe(() => {
      try {
        WA.ui.banner.openBanner({ id: "hall", text: "You are entering " + HALLS[key], bgColor: "#141318", textColor: "#e9b949", closable: false, timeToClose: 3200 });
      } catch (e) { console.warn("banner", e); }
    });
  }
  const seen = WA.player.state.seen;
  const n = Array.isArray(seen) ? seen.length : 0;
  console.info("Museum script ready · exhibits seen so far:", n);
}).catch(e => console.error(e));

export {};

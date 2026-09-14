/// <reference types="@workadventure/iframe-api-typings" />
/* The museum's map script: hall names as you cross into them, and a Museum
   map button that opens the floor plan with a pin where you are standing.
   Zones are tile layers named zone-<hall>, painted by scripts/convert.cjs;
   halls.json is written by the same script. */
import halls from "./halls.json";

const HALLS: Record<string, string> = halls;
let here = "foyer";

function siteBase(): string {
  const url = WA.room.mapURL || "";
  const i = url.indexOf("/maps/");
  return i > 0 ? url.slice(0, i) : "";
}

WA.onInit().then(() => {
  for (const key of Object.keys(HALLS)) {
    WA.room.onEnterLayer("zone-" + key).subscribe(() => {
      here = key;
      try {
        WA.ui.banner.openBanner({ id: "hall", text: "You are entering " + HALLS[key], bgColor: "#141318", textColor: "#e9b949", closable: false, timeToClose: 3200 });
      } catch (e) { console.warn("banner", e); }
    });
  }
  const base = siteBase();
  if (base) {
    try {
      WA.ui.actionBar.addButton({
        id: "museum-map",
        label: "Museum map",
        callback: () => { WA.nav.openCoWebSite(base + "/placards/map.html?at=" + here, true, "", 60, 1, true); }
      });
    } catch (e) { console.warn("map button", e); }
  }
  const seen = WA.player.state.seen;
  const n = Array.isArray(seen) ? seen.length : 0;
  console.info("Museum script ready · exhibits seen so far:", n);
}).catch(e => console.error(e));

export {};

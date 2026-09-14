# The Museum of AI Safety · the WorkAdventure building

A top-down, walk-around version of [the museum](https://visit.aisafety.museum),
built on [WorkAdventure](https://workadventu.re): visitors see each other, talk
when they stand close, and read the same 65 placards.

Nothing here is drawn by hand yet. `scripts/convert.cjs` turns the museum's
floor plan and room modules into Tiled maps; `scripts/build-placards.cjs` turns
the exhibit files into placard pages; `scripts/tileset.cjs` paints the blockout
tileset. Volunteers refine the maps in Tiled from there.

```sh
nvm use 22                    # the build tools need Node 20 or newer
npm install
node scripts/tileset.cjs      # tilesets/museum-blockout.png
node scripts/convert.cjs      # maps/*.tmj and src/halls.json
node scripts/build-placards.cjs
npm run dev                   # serves the maps; open the address it prints
npm run buildmap              # validates and optimises into dist/
```

## Finding your way

Wayfinding is generated with the maps, from the same floor plan:

- **Lines on the floor.** Three coloured routes start at the Foyer arrival point: gold to the south wings (Workbench through the Off Switch Gallery), cyan to the New Wing, Arcade and Hall of Mirrors, pink to the Midway. Chevrons along each line show the direction of travel.
- **Floor signposts.** At the arrival point, inside every door, and on every boundary between halls, a plaque on the floor lists the nearest halls in each direction.
- **Map boards.** Each hall has a "you are here" board on a wall. Press SPACE in front of it for the full floor plan with a pin where you stand.
- **Museum map button.** The action bar has a Museum map button that opens the same plan, pinned to the hall you are in.

`scripts/wayfinding.cjs` decides where everything goes, `scripts/wayfinding-paint.cjs` draws the tiles, and `scripts/floorplan.cjs` writes `placards/map.html` and one plan per board. Routes are listed at the top of `wayfinding.cjs`; add a route there and rebuild.

| Folder | What lives there |
| --- | --- |
| `maps/` | one Tiled map per region: `core.tmj` and one per wing |
| `exhibits/`, `content/`, `rooms/`, `manifest.js` | the museum's content, unchanged from the main repository |
| `placards/` | generated placard pages, the directory, the gift shop, the board and mural pages |
| `pages/` | the hand-written board and mural pages the generator copies in |
| `tilesets/` | `museum-blockout.png` (CC0, generated) and WorkAdventure's own sets (map-only licence, see LICENSE.assets) |
| `src/` | the map script: hall names, the counter |
| `scripts/` | the converter, the placard builder, the tileset painter |

Set `PLACARDS_BASE` in `.env` to the https host the placards are served from.

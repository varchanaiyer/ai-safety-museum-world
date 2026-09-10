/* The blockout tileset's vocabulary. Shared by tileset.js (which paints it)
   and convert.js (which places it). Tile ids are zero-based; the GID in a
   map is id + firstgid (1). Eight columns, four rows, 32 px tiles. */
module.exports = {
  COLS: 8, ROWS: 4, SIZE: 32,
  T: {
    EMPTY: 0, COLLIDE: 1, ZONE: 2, START: 3,
    FLOOR_A: 4, FLOOR_B: 5, FLOOR_ROT: 6, WALL_TOP: 7,
    WALL_FACE: 8, PLACARD_L: 9, PLACARD_M: 10, PLACARD_R: 11, PLACARD_T: 12, PLACARD_V: 13, PLACARD_B: 14, GLASS: 15,
    TITLE_L: 16, TITLE_M: 17, TITLE_R: 18, SHELF_L: 19, SHELF_M: 20, SHELF_R: 21, VEND_L: 22, VEND_M: 23,
    VEND_R: 24, DOOR: 25, PEDESTAL: 26, FLOOR_SHOP: 27, FLOOR_OFFICE: 28, WALL_TOP_EDGE: 29, FLOOR_FAIL: 30, FLOOR_WING: 31
  }
};

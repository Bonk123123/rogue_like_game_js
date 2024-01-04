import Tile from '../AbstractTiles/Tile.js';

export default class WallTile extends Tile {
    constructor() {
        super({
            type: 'tileW',
        });
    }
}

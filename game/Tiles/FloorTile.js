import Tile from '../AbstractTiles/Tile.js';

export default class FloorTile extends Tile {
    constructor() {
        super({
            type: 'tileF',
        });
    }
}

import ActiveTile from '../AbstractTiles/ActiveTile.js';
import constants from '../constants.js';

export default class SwordTile extends ActiveTile {
    constructor(params) {
        super({
            x: params.x,
            y: params.y,
            type: 'tileSW',
        });
    }
}

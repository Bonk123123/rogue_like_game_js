import Tile from './Tile.js';

export default class ActiveTile extends Tile {
    constructor(params) {
        super({
            type: params.type,
        });
        this.x = params.x;
        this.y = params.y;
    }

    getPos() {
        return { x: this.x, y: this.y };
    }
    // activeTile: all active tile types
    isClose(activeTile) {
        return (
            (this.x + 1 === activeTile.x && this.y === activeTile.y) ||
            (this.x - 1 === activeTile.x && this.y === activeTile.y) ||
            (this.x === activeTile.x && this.y - 1 === activeTile.y) ||
            (this.x === activeTile.x && this.y + 1 === activeTile.y)
        );
    }
}

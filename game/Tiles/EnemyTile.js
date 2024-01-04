import LifeTile from '../AbstractTiles/LifeTile.js';
import constants from '../constants.js';

export default class EnemyTile extends LifeTile {
    constructor(params) {
        super({
            x: params.x,
            y: params.y,
            type: 'tileE',
            attack_power: constants.ENEMY_ATTACK_POWER,
        });
        this.direction = params.direction;
    }

    changeDirection() {
        if (this.direction.x === 0) {
            this.direction.y = this.direction.y === 1 ? -1 : 1;
        } else {
            this.direction.x = this.direction.x === 1 ? -1 : 1;
        }
    }
}

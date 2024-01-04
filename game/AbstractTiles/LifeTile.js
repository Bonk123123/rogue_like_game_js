import ActiveTile from './ActiveTile.js';
import constants from '../constants.js';

export default class LifeTile extends ActiveTile {
    constructor(params) {
        super({
            x: params.x,
            y: params.y,
            type: params.type,
        });
        this.health = constants.LIFE_HEALTH;
        this.attack_power = params.attack_power;
    }

    moveTo(pos) {
        this.x = pos.x;
        this.y = pos.y;
    }

    getHealth() {
        return this.health;
    }

    // health: number
    healthDown(health) {
        if (this.health - health <= 0) {
            this.health = 0;
        } else {
            this.health -= health;
        }
    }

    // health: number
    healthUp(health) {
        if (this.health + health >= 100) {
            this.health = 100;
        } else {
            this.health += health;
        }
    }
}

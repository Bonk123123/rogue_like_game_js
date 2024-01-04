import LifeTile from '../AbstractTiles/LifeTile.js';
import constants from '../constants.js';

export default class PersonTile extends LifeTile {
    constructor(params) {
        super({
            x: params.x,
            y: params.y,
            type: 'tileP',
            attack_power: constants.PERSON_ATTACK_POWER,
        });
    }

    multAttackPower(mult) {
        this.attack_power *= mult;
    }
}

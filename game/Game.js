import constants from './constants.js';
import PersonTile from './Tiles/PersonTile.js';
import EnemyTile from './Tiles/EnemyTile.js';
import SwordTile from './Tiles/SwordTile.js';
import HealthTile from './Tiles/HealthTile.js';
import LifeTile from './AbstractTiles/LifeTile.js';
import Field from './Field.js';

export default class Game {
    static #instance = null;

    #field = new Field({
        width: constants.FIELD_WIDTH,
        height: constants.FIELD_HEIGHT,
    });
    #move_number = 0;
    #main_node = null;
    #end = false;
    #camera = { x: 1, y: 1 };
    #hero = null;
    #enemies = [];
    #healths = [];
    #swords = [];

    constructor(params) {
        if (Game.#instance) return Game.#instance;

        this.#main_node = params.main_node;

        Game.#instance = this;
    }

    init() {
        const rooms = this.#field.getRooms();

        // init Hero
        const room_center_x =
            rooms[0].x + Math.floor((rooms[0].x1 - rooms[0].x) / 2);
        const room_center_y =
            rooms[0].y + Math.floor((rooms[0].y1 - rooms[0].y) / 2);

        this.#hero = new PersonTile({ x: room_center_x, y: room_center_y });
        this.#field.changeTile(this.#hero);

        // set camera position
        this.#setCameraPosition({
            x: this.#hero.getPos().x - (constants.GAME_WINDOW_WIDTH - 1) / 2,
            y: this.#hero.getPos().y - (constants.GAME_WINDOW_HEIGHT - 1) / 2,
        });

        // hero control
        addEventListener('keydown', (e) => this.#controls(e));

        // init Enemies
        const enemies_count = this.#field.getSomePosOfRandomFreeSpace(
            constants.ENEMIES_QUANTITY
        );

        enemies_count.forEach((pos) => {
            const newEnemy = new EnemyTile({
                x: pos.x,
                y: pos.y,
                direction:
                    Math.random() > 0.5
                        ? {
                              x: 1,
                              y: 0,
                          }
                        : {
                              x: 0,
                              y: 1,
                          },
            });

            this.#enemies.push(newEnemy);
            this.#field.changeTile(newEnemy);
        });

        // init items
        const pos_of_floor = this.#field.getSomePosOfRandomFreeSpace(
            constants.HEALTHS_UP_QUANTITY + constants.SWORDS_QUANTITY
        );

        pos_of_floor.forEach((pos, i) => {
            if (i < constants.HEALTHS_UP_QUANTITY) {
                const health = new HealthTile({ x: pos.x, y: pos.y });
                this.#healths.push(health);
                this.#field.changeTile(health);
            } else {
                const sword = new SwordTile({ x: pos.x, y: pos.y });
                this.#swords.push(sword);
                this.#field.changeTile(sword);
            }
        });

        // first display
        this.#display();
    }

    #controls(e) {
        const heroOldPos = this.#hero.getPos();

        if (this.#end) {
            return;
        }

        if (this.#hero.getHealth() <= 0) {
            let loseDiv = document.createElement('div');

            loseDiv.classList.add('lose');

            loseDiv.innerHTML = 'Game Over';

            this.#main_node.append(loseDiv);

            this.#end = true;

            return;
        }

        if (this.#enemies.length <= 0) {
            let winDiv = document.createElement('div');

            winDiv.classList.add('lose');

            winDiv.innerHTML = 'you Win!!! moves: ' + this.#move_number;

            this.#main_node.append(winDiv);

            this.#end = true;

            return;
        }

        switch (e.code) {
            case 'KeyW':
                if (
                    !this.#field.isWallOrEnemy({
                        x: heroOldPos.x,
                        y: heroOldPos.y - 1,
                    })
                )
                    this.#hero.moveTo({
                        x: heroOldPos.x,
                        y: heroOldPos.y - 1,
                    });
                break;
            case 'KeyS':
                if (
                    !this.#field.isWallOrEnemy({
                        x: heroOldPos.x,
                        y: heroOldPos.y + 1,
                    })
                )
                    this.#hero.moveTo({
                        x: heroOldPos.x,
                        y: heroOldPos.y + 1,
                    });
                break;
            case 'KeyD':
                if (
                    !this.#field.isWallOrEnemy({
                        x: heroOldPos.x + 1,
                        y: heroOldPos.y,
                    })
                )
                    this.#hero.moveTo({
                        x: heroOldPos.x + 1,
                        y: heroOldPos.y,
                    });
                break;
            case 'KeyA':
                if (
                    !this.#field.isWallOrEnemy({
                        x: heroOldPos.x - 1,
                        y: heroOldPos.y,
                    })
                )
                    this.#hero.moveTo({
                        x: heroOldPos.x - 1,
                        y: heroOldPos.y,
                    });

                break;
            case 'Space':
                const cells = this.#field.getCells();
                if (
                    this.#field.isEnemy({
                        x: heroOldPos.x,
                        y: heroOldPos.y - 1,
                    })
                )
                    cells[heroOldPos.x][heroOldPos.y - 1].healthDown(
                        this.#hero.attack_power
                    );
                if (
                    this.#field.isEnemy({
                        x: heroOldPos.x,
                        y: heroOldPos.y + 1,
                    })
                )
                    cells[heroOldPos.x][heroOldPos.y + 1].healthDown(
                        this.#hero.attack_power
                    );
                if (
                    this.#field.isEnemy({
                        x: heroOldPos.x - 1,
                        y: heroOldPos.y,
                    })
                )
                    cells[heroOldPos.x - 1][heroOldPos.y].healthDown(
                        this.#hero.attack_power
                    );
                if (
                    this.#field.isEnemy({
                        x: heroOldPos.x + 1,
                        y: heroOldPos.y,
                    })
                )
                    cells[heroOldPos.x + 1][heroOldPos.y].healthDown(
                        this.#hero.attack_power
                    );

                break;
        }

        if (
            this.#field.isSword({
                x: this.#hero.getPos().x,
                y: this.#hero.getPos().y,
            }) ||
            this.#field.isHealth({
                x: this.#hero.getPos().x,
                y: this.#hero.getPos().y,
            })
        ) {
            this.#field.setTileToFloor({
                x: this.#hero.getPos().x,
                y: this.#hero.getPos().y,
            });
        }

        this.#field.swapTiles(heroOldPos, this.#hero.getPos());
        this.#step();

        this.#setCameraPosition({
            x: this.#hero.getPos().x - (constants.GAME_WINDOW_WIDTH - 1) / 2,
            y: this.#hero.getPos().y - (constants.GAME_WINDOW_HEIGHT - 1) / 2,
        });
        this.#display();
    }

    // pos: {x: number, y: number}
    #setCameraPosition(pos) {
        if (pos.x <= 19 && pos.x >= 0) {
            this.#camera.x = pos.x;
        } else if (pos.x > 19) {
            this.#camera.x = 19;
        } else if (pos.x < 0) {
            this.#camera.x = 0;
        }
        if (pos.y <= 11 && pos.y >= 0) {
            this.#camera.y = pos.y;
        } else if (pos.y > 11) {
            this.#camera.y = 11;
        } else if (pos.y < 0) {
            this.#camera.y = 0;
        }
    }

    // frame of game
    #display() {
        this.#main_node.innerHTML = '';
        const cells = this.#field.getCells();
        for (let i = 0; i < constants.GAME_WINDOW_WIDTH; i++) {
            for (let j = 0; j < constants.GAME_WINDOW_HEIGHT; j++) {
                let tile = document.createElement('div');
                tile.classList.add(
                    'tile',
                    cells[i + this.#camera.x][j + this.#camera.y].type
                );
                if (
                    cells[i + this.#camera.x][j + this.#camera.y] instanceof
                    LifeTile
                ) {
                    let tileHealth = document.createElement('div');
                    tileHealth.classList.add('health');
                    tileHealth.style.width =
                        cells[i + this.#camera.x][
                            j + this.#camera.y
                        ].getHealth() + '%';
                    tile.appendChild(tileHealth);
                }
                tile.style.top = j * 50 + 'px';
                tile.style.left = i * 50 + 'px';
                this.#main_node.append(tile);
            }
        }
    }

    #step() {
        this.#enemies.forEach((enemy, i, enemies) => {
            if (enemy.health <= 0) {
                this.#field.setTileToFloor({ x: enemy.x, y: enemy.y });
                enemies.splice(i, 1);
            }
            if (!enemy.isClose(this.#hero)) {
                const enemyOldPos = enemy.getPos();
                if (
                    this.#field.isFloor({
                        x: enemyOldPos.x + enemy.direction.x,
                        y: enemyOldPos.y + enemy.direction.y,
                    })
                ) {
                    enemy.moveTo({
                        x: enemyOldPos.x + enemy.direction.x,
                        y: enemyOldPos.y + enemy.direction.y,
                    });
                    this.#field.swapTiles(enemyOldPos, enemy.getPos());
                } else {
                    enemy.changeDirection();
                }
            } else {
                this.#hero.healthDown(enemy.attack_power);
            }
        });

        this.#healths.forEach((health, i, healths) => {
            if (this.#hero.x === health.x && this.#hero.y === health.y) {
                this.#hero.healthUp(constants.HEALTH_UP);
                healths.splice(i, 1);
            }
        });

        this.#swords.forEach((sword, i, swords) => {
            if (this.#hero.x === sword.x && this.#hero.y === sword.y) {
                this.#hero.multAttackPower(constants.ATTACK_MULTIPLICATION);
                swords.splice(i, 1);
            }
        });

        this.#move_number++;
    }
}

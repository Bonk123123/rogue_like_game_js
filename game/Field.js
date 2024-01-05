import constants from './constants.js';
import WallTile from './Tiles/WallTile.js';
import FloorTile from './Tiles/FloorTile.js';
import EnemyTile from './Tiles/EnemyTile.js';
import SwordTile from './Tiles/SwordTile.js';
import HealthTile from './Tiles/HealthTile.js';

export default class Field {
    constructor(params) {
        this.room_count = 0;
        this.cells = [];
        this.rooms = [];

        // fill map
        for (let i = 0; i < params.width; i++) {
            this.cells.push(Array(params.height).fill(new WallTile()));
        }

        // generate rooms count
        this.room_count =
            Math.random() * (constants.MAX_ROOMS - constants.MIN_ROOMS) +
            constants.MIN_ROOMS;

        // build map
        for (let i = 0; i < this.room_count; i++) {
            const { coord, room_width, room_height } = this.generateRoom();

            this.rooms.push({
                x: coord.x,
                y: coord.y,
                x1: coord.x + room_width,
                y1: coord.y + room_height,
            });

            const XorY = Math.round(Math.random());

            const room_center = XorY
                ? this.rooms[this.rooms.length - 1].x +
                  Math.round(
                      (this.rooms[this.rooms.length - 1].x1 -
                          this.rooms[this.rooms.length - 1].x) /
                          2
                  )
                : this.rooms[this.rooms.length - 1].y +
                  Math.round(
                      (this.rooms[this.rooms.length - 1].y1 -
                          this.rooms[this.rooms.length - 1].y) /
                          2
                  );

            for (let j = 0; j < this.cells.length; j++) {
                for (let k = 0; k < this.cells[j].length; k++) {
                    if (
                        (j > coord.x &&
                            k > coord.y &&
                            j < coord.x + room_width &&
                            k < coord.y + room_height) ||
                        (XorY && j === room_center) ||
                        (!XorY && k === room_center)
                    ) {
                        this.cells[j][k] = new FloorTile();
                    }
                }
            }
        }
    }

    getCells() {
        return this.cells;
    }

    getRooms() {
        return this.rooms;
    }

    getRoomsCount() {
        return this.room_count;
    }

    // pos: {x: number, y: number}
    setTileToFloor(pos) {
        this.cells[pos.x][pos.y] = new FloorTile();
    }

    // pos: {x: number, y: number}
    isSword(pos) {
        return this.cells[pos.x][pos.y] instanceof SwordTile;
    }

    // pos: {x: number, y: number}
    isHealth(pos) {
        return this.cells[pos.x][pos.y] instanceof HealthTile;
    }

    // pos: {x: number, y: number}
    isEnemy(pos) {
        return this.cells[pos.x][pos.y] instanceof EnemyTile;
    }

    // pos: {x: number, y: number}
    isWallOrEnemy(pos) {
        return (
            this.cells[pos.x][pos.y] instanceof WallTile ||
            this.cells[pos.x][pos.y] instanceof EnemyTile
        );
    }

    // pos: {x: number, y: number}
    isFloor(pos) {
        if (
            pos.x > this.cells.length - 1 ||
            pos.y > this.cells[0].length - 1 ||
            pos.x < 0 ||
            pos.y < 0
        )
            return false;
        return this.cells[pos.x][pos.y] instanceof FloorTile;
    }

    // quantity: number
    // return {x: number, y: number}[]
    getSomePosOfRandomFreeSpace(quantity) {
        let all_pos_of_free_space = [];

        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[i].length; j++) {
                if (this.cells[i][j] instanceof FloorTile) {
                    all_pos_of_free_space.push({ x: i, y: j });
                }
            }
        }

        let random_pos_free_spaces = [];

        for (let i = 0; i < quantity; i++) {
            const random_index = Math.ceil(
                Math.random() * all_pos_of_free_space.length
            );

            random_pos_free_spaces.push(all_pos_of_free_space[random_index]);
        }

        return random_pos_free_spaces;
    }

    // return {coords: {x: number, y: number}, room_width: number, room_height: number}
    generateRoom() {
        let tries_count = 0;
        let coord, room_width, room_height;

        // a, b: {x: number, y: number, x1: number, y1: number}
        function intersects(a, b) {
            return a.y < b.y1 || a.y1 > b.y || a.x1 < b.x || a.x > b.x1;
        }

        while (true) {
            coord = {
                x: Math.round(Math.random() * (this.cells.length - 1)),
                y: this.cells[0]
                    ? Math.round(Math.random() * (this.cells[0].length - 1))
                    : 0,
            };
            room_width = Math.round(
                Math.random() *
                    (constants.MAX_WIDTH_ROOM - constants.MIN_WIDTH_ROOM) +
                    constants.MIN_WIDTH_ROOM
            );
            room_height = Math.round(
                Math.random() *
                    (constants.MAX_HEIGHT_ROOM - constants.MIN_HEIGHT_ROOM) +
                    constants.MIN_HEIGHT_ROOM
            );

            const boundingRoom = {
                x: coord.x,
                y: coord.y,
                x1: coord.x + room_width,
                y1: coord.y + room_height,
            };

            if (
                boundingRoom.x1 > this.cells.length - 1 ||
                (this.cells[0] && boundingRoom.y1 > this.cells[0].length - 1)
            )
                continue;

            let loop = false;
            for (let i = 0; i < this.rooms.length; i++) {
                if (intersects(boundingRoom, this.rooms[i])) {
                    loop = true;
                    break;
                }
            }

            if (!loop || tries_count > 100)
                return { coord, room_width, room_height };
            tries_count++;
        }
    }

    // activeTile: all active tile types
    changeTile(activeTile) {
        const pos = activeTile.getPos();

        this.cells[pos.x][pos.y] = activeTile;
    }

    // tilePos1, tilePos2: {x: number, y: number}
    swapTiles(tilePos1, tilePos2) {
        const tile1 = this.cells[tilePos1.x][tilePos1.y];
        this.cells[tilePos1.x][tilePos1.y] = this.cells[tilePos2.x][tilePos2.y];
        this.cells[tilePos2.x][tilePos2.y] = tile1;
    }
}

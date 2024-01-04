import Game from './game/Game.js';

const field_node = document.getElementsByClassName('field')[0];

const game = new Game({
    main_node: field_node,
});

game.init();

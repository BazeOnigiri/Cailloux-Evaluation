import Menu from "./scenes/menu.js";
import Game from "./scenes/game.js";
import End from "./scenes/end.js";

window.config = {
    width: 1024,
    height: 640,

    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    type: Phaser.AUTO,
    scene: [Menu, Game, End],
    backgroundColor: '#ffffff',

    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: false
        }
    },
};

const game = new Phaser.Game(window.config);


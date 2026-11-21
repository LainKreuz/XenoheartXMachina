import {Start} from './scenes/Start.js';
import {Game} from './scenes/Game.js';
import {Result} from './scenes/Result.js';
//Abajo está la configuración principal y esencial para el juego
const config = {

    type: Phaser.AUTO, //Tipo de configuracion

    title: 'Xenoheart Machina', //Titulo

    description: 'A 2D Space Shooter where you fight alien ships.', //Descripcion del juego

    parent: 'game-container', //A quien esta conectado

    width: 480,

    height: 800,

    backgroundColor: ' #000000', //Color del fondo

    pixelArt: true, //Usa Pixel Art porque mis assets fueron hechos en AseSprite
    
    physics: {

        default: 'arcade', //El tipo de fisicas que se van a usar, en este caso para juegos arcade
        
        arcade: { 

            gravity: { x: 0, y: 0}, //No agregar gravedad ni en X ni en Y

            debug: false //No enviar informacion al jugar
        }

    },

    scene: [Start,
        Game,
        Result,
        
    ], //La escena donde pasa el juego

    scale: {
        mode: Phaser.Scale.FIT, //Para que se adapte
        autoCenter: Phaser.Scale.CENTER_BOTH, //Para que se centre
    }
};

new Phaser.Game(config); //Para marcar una nueva configuración del juego, utilizando la funcion de const

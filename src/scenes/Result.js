export class Result extends Phaser.Scene{

    constructor() {
        super('Result');
    }

    preload(){
        this.load.image('fondoResultado', 'assets/Sprites/XHMFondo.png');
    }

    create(data = {}){

        const victoria = data.victoria === true; //aqui se guarda el dato de la victoria como booleano

        const puntos = data.puntos ?? 0; //para evitar errores, por si el jugador no tiene puntos

        this.add.tileSprite(240, 400, 480, 800, 'fondoResultado').setTileScale(0.5);

        this.add.rectangle(240, 400, 480, 800, 0x20715, 0.75);

        this.add.text(
            240,310, //posicion
            victoria ? 'VICTORIA' : 'DERROTA', {
                fontFamily: 'Arial',
                fontSize: '44px',
                color: '#ffffff',
                fontStyle: 'bold'
            }  //para ver si victoria es verdadero, si es falso entonces mostrar el otro texto
        ).setOrigin(0.5);

        this.add.text(240, 410, 'PUNTOS: ' + puntos, {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#ffffff' 
        }).setOrigin(0.5);

        const boton = this.add.rectangle(240, 540, 260, 75, 0x20715, 1);

        boton.setInteractive({
            useHandCursor: true
        });

        this.add.text(240, 540, 'CONTINUAR', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

                boton.on('pointerdown', () => {
            this.scene.start('Game'); //para iniciar el juego
        });
    }
}
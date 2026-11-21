export class Start extends Phaser.Scene {

    constructor(){
        super('Start'); 
    }

    preload(){
        this.load.image('fondoMenu', 'assets/Sprites/XHMFondo.png')
    }

    create(){
        this.add.tileSprite(240,400,480,800, 'fondoMenu').setTileScale(0.5); //El tileSprite tiene una escala de 0.5 aqui
        
        this.add.text(240,230, 'Xenoheart Machina', {
            fontFamily: 'Arial',
            fontSize: '44px',
            color: '#a419b0',
            fontStyle: 'bold'
        }).setOrigin(0.5); //poner el origen del texto
    
        const boton = this.add.rectangle(240, 450, 260, 75, 0x10285d, 0.95); //agregar un rectangulo para el menu, color en otro formato y menos opacidad

        boton.setInteractive({
                useHandCursor: true //para que el boton sea interactivo
        });

        this.add.text(240, 450, 'Iniciar', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#ffffff'
        }).setOrigin(0.5); //poner el origen del texto

        boton.on('pointerdown', () => {
            this.scene.start('Game'); //para iniciar el juego
        });
    }




}
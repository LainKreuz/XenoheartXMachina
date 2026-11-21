export class Game extends Phaser.Scene{ //Exporta la clase que hicimos y se extiende a la escena

    constructor() {
        super('Game'); //Se construye el objeto de la escena, Juego
    }

    preload() {
        //Antes de empezar cualquier fotograma, esto va a empezar
        this.load.image('FondoJuego', 'assets/Sprites/XHMFondo.png'); //Carga la imagen y le da un nombre, cargando a la memoria de la computadora

        this.load.image('NaveJugador', 'assets/Sprites/XHMNaveJugador.png');
        
        this.load.image('NaveNodriza', 'assets/Sprites/XHMNaveNodrizaEnemiga.png');

        this.load.image('NaveEnemiga', 'assets/Sprites/XHMNaveEnemiga.png');

        this.load.image('disparoJugador', 'assets/Sprites/XHMBala.png');
    }

    //Ahora para crear los assets como tal
    create(){

        this.cameras.main.setBackgroundColor('#802c70') //Se crea la camara para mostrar algo del juego

        this.FondoJuego = this.add.tileSprite(240,400,480,800, 'FondoJuego'); //Agrega el fondo como un sprite en el tileset dentro de una posición minima y maxima

        this.FondoJuego.setTileScale(0.5); //Ajustar para que quede mejor en el epsacio

        this.FondoJuego.tilePositionY = 1600; //Para que salga por debajo y se desplace el fondo. Es la mitad de 3200.
        
        this.NaveJugador = this.add.image(240, 650, 'NaveJugador'); //Para poner la posicion de la nave en esas coordenadas

        const escalaNave = 90 / this.NaveJugador.width; //Dividr 90 entre el ancho de la nave

        this.NaveJugador.setScale(escalaNave);

        this.NaveJugador.setDepth(10);

        this.physics.add.existing(this.NaveJugador); //Le hace saber al juego que este es un objeto físico y no una imagen estática

        this.NaveJugador.body.setAllowGravity(false); //Deshabilita la gravedad de la nave

        this.NaveJugador.body.setDirectControl(true); //Esto es para decirle al juego que aunque tenga fisicas, lo que predomina es el control del jugador sobre el objeto.

        this.NaveJugador.body.setSize(
                this.NaveJugador.width * 0.55,
                this.NaveJugador.height * 0.7,
                true //Disminuye el area de choque de las naves.
        );

        this.NaveJugador.setInteractive({
            pixelPerfect: true, //Detecta la silueta visible del sprite para no tomar en cuenta los alfas
            alphaTolerance: 10, //Que los pixeles sean casi transparentes
            useHandCursor: true, //Para que se use con el mouse
        });

        this.punteroEnUso = null;

        this.input.on('pointerdown', (pointer, objetos) => {

            if (!objetos.includes(this.NaveJugador)) return; //comentarluego

            if (this.punteroEnUso !== null) return;

            this.punteroEnUso = pointer;

            this.inicioToqueX = pointer.x; //Se guardara en el X, lado a lado
            this.inicioToqueY = pointer.y; //Se guardara en el Y, arriba a abajo

            this.inicioNaveX = this.NaveJugador.x //Posicion X de la nave
            this.inicioNaveY = this.NaveJugador.y //Posicion Y de la nave
        });

        this.input.on('pointermove', (pointer) => {

            if(this.partidaTerminada) return; //si la partida termino, regresa

            
            if (pointer !== this.punteroEnUso || !pointer.isDown) return; //Si pointer no es el Puntero en Uso o no se es´ta moviendo
            
            const movimientoX = pointer.x - this.inicioToqueX; //Calcular el desplazamiento de X menos donde se estaba antes.
            const movimientoY = pointer.y - this.inicioToqueY; //Calcular el desplazamiento de Y menos donde se estaba antes.
            
            const nuevaX = this.inicioNaveX + movimientoX; //El movimiento final
            const nuevaY = this.inicioNaveY + movimientoY; //El movimiento final

            const mitadAncho = this.NaveJugador.displayWidth / 2; //La mitad de la pantalla en Y
            const mitadAlto = this.NaveJugador.displayHeight / 2; //La mitad de la pantalla en Y

            const porcentajeSalida = 0.0001; //Hasta donde se puede salir

            const margenSalida = this.NaveJugador.displayWidth * porcentajeSalida; //El margen al cual puede salir la lave de la pantalla

            this.NaveJugador.x = Phaser.Math.Clamp(
                nuevaX,
                mitadAncho - margenSalida,
                480 - mitadAncho + margenSalida //Declarar hasta donde se puede salir, teniendo en cuanto el ancho de la pantalla calculado desde el medio.

            );

            this.NaveJugador.y = Phaser.Math.Clamp(
                nuevaY,
                mitadAlto,
                800 - mitadAlto //Lo mismo pero en altura
            );
        });

        this.input.on('pointerup', (pointer) => {
            if(pointer == this.punteroEnUso){
                this.punteroEnUso = null; //Al controlar la nave, si suelto el clic o ya no toco nada entonces se deja el puntero vacio y asi se suelta el control de la nave.
            } 

        });

        this.input.on('pointerupoutside', (pointer) => {
            if (pointer == this.punteroEnUso){
                this.punteroEnUso = null;
            }

        });
    

        this.vidas = 3; //Valor default para VIDAS
        this.puntos = 0; //Valor default para SCORE

        //Informacion de la Nave Nodriza
        this.NaveNodriza = this.add.image(240,145, 'NaveNodriza');

        const escalaNodriza = 135 / this.NaveNodriza.width;

        this.NaveNodriza.setScale(escalaNodriza);
        
        this.NaveNodriza.setDepth(5);
        ////////////////////////////////

        //Informacion de los enemigos
        this.enemigos = this.physics.add.group({

            allowGravity: false //Quita la gravedad a un grupo, en este caso los enemigos
        }); 

        this.partidaTerminada = false;
        this.invulnerable = false;
        this.contadorGeneracion = 0;

        this.add.rectangle(240, 24, 480, 48, 0x20715, 0.85).setDepth(100); //barra de score

        this.textoVidas = this.add.text(25, 24, 'VIDAS: ' + this.vidas, {
            fontFamily: 'Arial',
            fontSize: '21px',
            color: '#ffffff'
        }).setOrigin(0, 0.5).setDepth(101); //el texto va arriba de la barrita

        this.textoPuntos = this.add.text(
            285, 24, 'PUNTOS: ' + this.puntos, {
                fontFamily: 'Arial',
                fontSize: '21px',
                color: '#ffffff'
            }).setOrigin(0, 0.5).setDepth(101); //barra dae puntos

        this.disparos = this.physics.add.group({
            allowGravity: false //las balas no tienen gravedad
        });

        this.temporizadorDisparos = this.time.addEvent({
            delay: 500, //microsegundos entre disparos
            callback: this.disparar, //para ir al disparo
            callbackScope: this, //para que podamos disparar siempre que queramos
            loop: true //se repetira siempre
        });

        this.temporizadorEnemigos = this.time.addEvent({
            delay: 2000, //2 segundos, 1000 microsegundos = 1 segundo
            callback: this.crearEnemigo, //para crear enemigos
            callbackScope: this, //a este
            loop: true //generacion de enemigos constante
        });

        this.physics.add.overlap(
            this.disparos,
            this.enemigos,
            this.destruirEnemigo, //para las balas que impactan en los enemigos
            null, //no se usara ninguna otra funcion
            this //para indicar que esto puede destruir enemigos en escena
        );

        this.physics.add.overlap(
            this.NaveJugador,
            this.enemigos,
            this.recibirImpacto, //para recibir impactos del enemigo
            null,
            this
        );
    }   

    crearEnemigo(){
        if (this.partidaTerminada) return; //si la partida ha termindo

        const separaciones = [-45, 0, 45]; //para donde son generados

        const indice = this.contadorGeneracion % 3; //para  poder tener un maximo de naves de forma que no busque mas posiciones

        this.contadorGeneracion++; //agrega uno constantemente

        const x = this.NaveNodriza.x + separaciones[indice];

        const y = this.NaveNodriza.y + this.NaveNodriza.displayHeight / 2;

        const enemigo = this.enemigos.get(x, y, 'NaveEnemiga');

        if (!enemigo) return; //si no hay enemigos regresa

        enemigo.enableBody(
            true, x, y, true, true //COMENTARIOPENDIENTE
        );

        enemigo.setScale(65 / enemigo.width); //escala entre el ancho

        enemigo.body.setSize(
            enemigo.width * 0.6,
            enemigo.height * 0.7,
            true //colisionable
        );

        enemigo.setDepth(8);
        enemigo.setVelocity(0, 100);
    }

    disparar(){
        if (this.partidaTerminada) return; //si la partida termino dejar de disparar

        const x = this.NaveJugador.x;
        const y = this.NaveJugador.y - this.NaveJugador.displayHeight * 0.4; //para ir arriba

        const disparo = this.disparos.get(
            x, y, 'disparoJugador' //la posicion
        );

        if (!disparo) return; //si no hay disparos regresar

        disparo.enableBody(true, x, y, true, true); //COMENTARIOPENDIENTE

        disparo.setScale(40 / disparo.height);

        disparo.setDepth(9); //misma que los enemigos

        disparo.body.setAllowGravity(false); //no tiene gravedad

        disparo.setVelocity(0, -500); //las balas van hacia arriba
    }

    destruirEnemigo(disparo, enemigo){

        if (this.partidaTerminada) return; //regresar si esta terminada

        if (!disparo.active || !enemigo.active) return; //por si hay algo muy fuera del rango jugable

        disparo.disableBody(true, true); //para quitar el disparo si colisiona con algo

        enemigo.disableBody(true, true); //este igual desaparece

        this.puntos++; //agrega un punto

        this.textoPuntos.setText('PUNTOS: ' + this.puntos); //para cambiar el texto

        if (this.puntos >= 30) { 
            this.finalizarPartida(true); //termina el juego si hay 30 o mas puntos
        }
    }

    recibirImpacto(jugador, enemigo){
        if (this.partidaTermianda || !enemigo.active) return; //para evitar errores por si ya la partida termino

        enemigo.disableBody(true, true); //para eliminar el enemigo

        if (this.invulnerable) return; //por si el jugador es invencible, regresar

        this.vidas--;

        this.textoVidas.setText('VIDAS: ' + this.vidas); //ajustar el texto

        if (this.vidas <= 0){
            this.NaveJugador.setVisible(false);
            this.finalizarPartida(false);
            return;
        }

        this.tweens.add({

            targets: this.NaveJugador,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: 4,

            onComplete: () => {

                this.NaveJugador.setAlpha(1);
                this.invulnerable = false;
            }
        });
    }

    finalizarPartida(victoria){

        if(this.partidaTerminada) return; //si termino la partida, regresa

        this.partidaTerminada = true;
        
        this.temporizadorEnemigos.remove();
        this.temporizadorDisparos.remove();
        
        this.enemigos.getChildren().forEach((enemigo) => {
            if (enemigo.active){
                enemigo.disableBody(true, true);
            }
        }); //COMENTARIOPENDIENTE

        this.disparos.getChildren().forEach((disparo) => {
            if(disparo.active){
                disparo.disableBody(true, true);
            }
        });

        this.time.delayedCall(700, () => {

            this.scene.start('Result', {
                victoria: victoria,
                puntos: this.puntos 
            }); //comentariopendiente
        });
    }

    update(){
        this.enemigos.getChildren().forEach((enemigo) => {
            if(!enemigo.active) return;
            if (enemigo.y - enemigo.DisplayHeight / 2 > 800){
                enemigo.disableBody(true, true); //COMENTARIOPENDIENTE
            } 
        });

        this.disparos.getChildren().forEach((disparo) => {
            if (!disparo.active) return;

        }); //COMENTARIOPENDIENTE
    }
}


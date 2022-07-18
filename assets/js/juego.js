    //Funciones autoinvocadas
    // (() => {

    // });
const miModulo = (() => {
    'use strict'

    let deck          = [];
    const tipos       = ['C', 'D', 'H', 'S'],
          especiales  = ['A', 'J', 'Q', 'K'];

    let puntosJugadores = [];

    //Rerencias del HTML
    const   btnNuevo   = document.querySelector('#btnNuevo'),
            btnPedir   = document.querySelector('#btnPedir'),
            btnDetener = document.querySelector('#btnDetener');

    btnDetener.disabled = true;

    const divCartasJugadores = document.querySelectorAll('.divCartas'),
          puntosHTML       = document.querySelectorAll('small');

    //Esta función inicializa el juego
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }

        puntosHTML.forEach(elem => elem.innerText = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = '');

        btnPedir.disabled = false;
        btnDetener.disabled = false;

    }

    //Esta función crea un nuevo mazo aleatoreo
    const crearDeck = () => {
        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (const tipo of tipos) {
                deck.push(i + tipo);  
            }
        }
        for (const tipo of tipos) {
            for (const especial of especiales) {
                deck.push(especial + tipo)
            }
        }
        return _.shuffle(deck);
    }

    const pedirCarta = () => {
        if (deck.length === 0) {
            throw 'No quedan cartas en la baraja';
        }
        return deck.pop();
    }

    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        return(isNaN(valor) ) ? 
                                (valor === 'A') ? 11 : 10
                                : valor * 1;
    };

    // Turno: 0 = primer jugador, y el último será la computadora
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const cartaImg = document.createElement('img');
        cartaImg.src = `assets/cartas/${carta}.png`;
        cartaImg.classList='carta'
        divCartasJugadores[turno].append(cartaImg); 
    };

    const determinarGanador = () => {

        const [puntosMinimos, puntosCPU] = puntosJugadores;

        setTimeout(() => {
            if(puntosCPU === puntosMinimos){
                alert('Nadie ganó');
            } else if (puntosMinimos > 21){
                alert('Computadora Gana');
            } else if (puntosCPU > 21){
                alert('Ganaste!')
            } else {
                alert('Computadora gana!')
            }
        }, 1000);
    }

    //turno de la computadora
    const turnoComputadora = (puntosMinimos) => {
        let puntosCPU = 0;
        do {
            const carta = pedirCarta();
            puntosCPU = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);
        } while ((puntosCPU < puntosMinimos) && (puntosMinimos <= 21));
        determinarGanador(); 
    };

    //Acción botones
    //Event                             callBack
    btnPedir.addEventListener('click', () => {

        btnDetener.disabled = false;
        const carta = pedirCarta();

        const puntosJugador = acumularPuntos(carta, 0)

        crearCarta(carta, 0);

        if (puntosJugador > 21) {
            console.warn('Perdiste!');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);

        } else if (puntosJugador === 21){
                console.warn('21, genial');
                btnPedir.disabled = true;
                btnDetener.disabled = true;
                turnoComputadora(puntosJugador);
            }
    });

    btnDetener.addEventListener('click', () => {
        btnDetener.disabled = true;
        btnPedir.disabled = true;
        turnoComputadora(puntosJugadores[0]);

    });

    btnNuevo.addEventListener('click', () => {    
        inicializarJuego();
    });

    return {
        nuevaPartida: inicializarJuego
    }

})();





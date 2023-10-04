const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const startPauseBt = document.querySelector('#start-pause');
const musicaFocoInput = document.querySelector('#alternar-musica');
const iniciarOuPausarBt = document.querySelector('#start-pause span');
const iniciarOuPausarImg = document.querySelector('.app__card-primary-butto-icon');
const tempoNaTela = document.querySelector('#timer');
const musica = new Audio('/sons/luna-rise-part-one.mp3');
const audioStart = new Audio('/sons/play.wav');
const audioPause = new Audio('/sons/pause.mp3');
const audioEnd = new Audio('/sons/beep.mp3');
const openModalButton = document.querySelector("#open-modal");
const closeModalButton = document.querySelector("#close-modal");
const modal = document.querySelector("#modal");
const fade = document.querySelector("#fade");

let tempoDecorridoEmSegundos = 1500;

const inpFoco = document.querySelector('#inp__foco');
const inpCurto = document.querySelector('#inp__curto');
const inpLongo = document.querySelector('#inp__longo');

let tempoFoco = parseInt(inpFoco.value);
let tempoCurto = parseInt(inpCurto.value);
let tempoLongo = parseInt(inpLongo.value);

const confirmModalButton = document.querySelector("#confirm-modal");

confirmModalButton.addEventListener("click", () => {
    tempoFoco = parseInt(inpFoco.value);
    tempoCurto = parseInt(inpCurto.value);
    tempoLongo = parseInt(inpLongo.value);

    if (html.getAttribute('data-contexto') === 'foco') {
        tempoDecorridoEmSegundos = tempoFoco * 60;
    } else if (html.getAttribute('data-contexto') === 'descanso-curto') {
        tempoDecorridoEmSegundos = tempoCurto * 60;
    } else if (html.getAttribute('data-contexto') === 'descanso-longo') {
        tempoDecorridoEmSegundos = tempoLongo * 60;
    }

    mostrarTempo();
    toggleModal();
});

const toggleModal = () => {
    [modal, fade].forEach((el) => el.classList.toggle("hide"));
};

[openModalButton, closeModalButton, fade].forEach((el) => {
    el.addEventListener("click", () => toggleModal());
});

let intervaloId = null;

musica.loop = true;

musicaFocoInput.addEventListener('change', () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
});

focoBt.addEventListener('click', () => {
    // Aplica o tempo de foco
    tempoDecorridoEmSegundos = tempoFoco * 60;
    alterarContexto('foco');
    focoBt.classList.add('active');
    mostrarTempo();
});

curtoBt.addEventListener('click', () => {
    // Aplica o tempo curto
    tempoDecorridoEmSegundos = tempoCurto * 60;
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
    mostrarTempo();
});

longoBt.addEventListener('click', () => {
    // Aplica o tempo longo
    tempoDecorridoEmSegundos = tempoLongo * 60;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
    mostrarTempo();
});

function alterarContexto(contexto) {
    mostrarTempo();
    botoes.forEach(function (contexto) {
        contexto.classList.remove('active');
    });
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);

    switch (contexto) {
        case "foco":
            titulo.innerHTML = `
            Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>
            `;
            break;
        case "descanso-curto":
            titulo.innerHTML = `
            Que tal dar uma respirada? <strong class="app__title-strong">Faça uma pausa curta!</strong>`;
            break;
        case "descanso-longo":
            titulo.innerHTML = `
            Hora de voltar à superfície. <strong class="app__title-strong">Faça uma pausa longa.</strong>
            `;
            break;
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0) {
        audioEnd.play();
        alert('Tempo finalizado!');
        zerar();
        return;
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
};

startPauseBt.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    if (intervaloId) {
        audioPause.play();
        zerar();
        return;
    }
    audioStart.play();
    intervaloId = setInterval(contagemRegressiva, 1000);
    iniciarOuPausarBt.textContent = "Pausar";
    iniciarOuPausarImg.setAttribute('src', `/imagens/pause.png`);
}

function zerar() {
    clearInterval(intervaloId);
    iniciarOuPausarBt.textContent = "Começar";
    iniciarOuPausarImg.setAttribute('src', `/imagens/play_arrow.png`);
    intervaloId = null;
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {
        minute: '2-digit',
        second: '2-digit'
    });
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();
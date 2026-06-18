// --- Estados Globais da Partida ---
let pontuacao = 0;
let tempoRestante = 30; 
let jogoAtivo = false;
let intervaloTempo;
let erroCometidoNaRodada = false;
let audioCtx = null; // Inicializado no primeiro clique para respeitar as regras dos navegadores

const paresDeFiguras = [
    { normal: "🐵", diferente: "🐱" },
    { normal: "🦁", diferente: "🐷" },
    { normal: "🐸", diferente: "🦆" },
    { normal: "🦊", diferente: "🐰" },
    { normal: "🐼", diferente: "🐨" },
    { normal: "🦖", diferente: "🦄" },
    { normal: "🚗", diferente: "✈️" },
    { normal: "🍎", diferente: "🍌" }
];

// --- Motor de Áudio Nativo (Web Audio API) ---
function inicializarAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function tocarSomAcerto() {
    inicializarAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    // Som alegre que sobe de frequência rapidamente
    osc.frequency.setValueAtTime(440, audioCtx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
}

function tocarSomErro() {
    inicializarAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    // Som grave de aviso sutil, sem assustar a criança
    osc.frequency.setValueAtTime(220, audioCtx.currentTime); 
    osc.frequency.linearRampToValueAtTime(150, audioCtx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
}

function tocarSomVitoria() {
    inicializarAudio();
    // Pequena fanfarra de 3 notas sequenciais alegres
    const notas = [523.25, 659.25, 783.99]; // Notas C5, E5, G5
    notas.forEach((freq, i) => {
        setTimeout(() => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        }, i * 150);
    });
}

// --- Construção da Interface via DOM ---
function construirInterface() {
    const app = document.getElementById('app');
    if (!app) return;

    const container = document.createElement('div');
    container.classList.add('game-container');

    const titulo = document.createElement('h1');
    titulo.textContent = 'Ache o Diferente! 🦊';
    titulo.style.color = '#2E7D32';

    const painel = document.createElement('div');
    painel.classList.add('painel-status');

    const placar = document.createElement('div');
    placar.id = 'placar';
    placar.innerHTML = '<strong>Pontos:</strong> 0';

    const cronometro = document.createElement('div');
    cronometro.id = 'cronometro';
    cronometro.innerHTML = '<strong>Tempo:</strong> 30s';

    painel.appendChild(placar);
    painel.appendChild(cronometro);

    const btnJogar = document.createElement('button');
    btnJogar.id = 'btn-jogar';
    btnJogar.classList.add('btn-principal');
    btnJogar.textContent = 'Começar a Brincadeira! 🎮';
    btnJogar.addEventListener('click', iniciarPartida);

    const grid = document.createElement('div');
    grid.id = 'grid-jogo';
    grid.classList.add('grid-cenario');
    
    for (let i = 0; i < 9; i++) {
        const bloco = document.createElement('div');
        bloco.classList.add('bloco');
        bloco.textContent = "❓";
        grid.appendChild(bloco);
    }

    const rankingDiv = document.createElement('div');
    rankingDiv.id = 'ranking-vagas';
    rankingDiv.classList.add('ranking-container');

    container.appendChild(titulo);
    container.appendChild(painel);
    container.appendChild(grid);
    container.appendChild(btnJogar);
    container.appendChild(rankingDiv);
    
    app.appendChild(container);
    atualizarTabelaRanking();
}

function iniciarPartida() {
    if (jogoAtivo) return;
    inicializarAudio(); // Ativa o contexto de áudio no clique do botão

    pontuacao = 0;
    tempoRestante = 30;
    jogoAtivo = true;
    
    document.getElementById('btn-jogar').style.visibility = 'hidden';
    atualizarPlacarInterface();

    intervaloTempo = setInterval(contarTempo, 1000);
    gerarNovaRodada();
}

function gerarNovaRodada() {
    if (!jogoAtivo) return;
    
    erroCometidoNaRodada = false; 
    const grid = document.getElementById('grid-jogo');
    grid.innerHTML = ''; 

    const parAtual = paresDeFiguras[Math.floor(Math.random() * paresDeFiguras.length)];
    const indiceDiferente = Math.floor(Math.random() * 9);

    for (let i = 0; i < 9; i++) {
        const bloco = document.createElement('div');
        bloco.classList.add('bloco');
        
        if (i === indiceDiferente) {
            bloco.textContent = parAtual.diferente;
            bloco.dataset.tipo = 'diferente';
        } else {
            bloco.textContent = parAtual.normal;
            bloco.dataset.tipo = 'normal';
        }

        bloco.addEventListener('mousedown', processarEscolha);
        grid.appendChild(bloco);
    }
}

function processarEscolha(evento) {
    if (!jogoAtivo) return;

    const blocoClicado = evento.target;

    if (blocoClicado.dataset.tipo === 'diferente') {
        tocarSomAcerto(); // som de acerto disparado instantaneamente
        
        if (!erroCometidoNaRodada) {
            pontuacao += 15; 
        } else {
            pontuacao += 10;
        }
        
        atualizarPlacarInterface();
        gerarNovaRodada(); 
    } else {
        // Evita disparar o som caso a criança clique em um bloco que já foi ocultado
        if (blocoClicado.style.filter.includes('opacity')) return;
        
        tocarSomErro(); // som de erro/aviso sutil
        erroCometidoNaRodada = true;
        blocoClicado.style.filter = 'opacity(0.15)';
    }
}

function atualizarPlacarInterface() {
    document.getElementById('placar').innerHTML = `<strong>Pontos:</strong> ${pontuacao}`;
}

function contarTempo() {
    tempoRestante--;
    document.getElementById('cronometro').innerHTML = `<strong>Tempo:</strong> ${tempoRestante}s`;

    if (tempoRestante <= 0) {
        encerrarPartida();
    }
}

function encerrarPartida() {
    jogoAtivo = false;
    clearInterval(intervaloTempo);
    tocarSomVitoria(); // Dispara a fanfarra musical de comemoração

    const blocos = document.querySelectorAll('.bloco');
    blocos.forEach(b => {
        b.textContent = "💤"; 
        b.style.filter = 'none';
    });

    setTimeout(() => {
        const nome = prompt("Parabéns! Você encontrou muitas figuras! Digite seu nome:") || "Pequeno Explorador";
        gravarNoRanking(nome, pontuacao);
        atualizarTabelaRanking();

        const btn = document.getElementById('btn-jogar');
        btn.textContent = 'Jogar de Novo! 🔄';
        btn.style.visibility = 'visible';
    }, 100);
}

function gravarNoRanking(nome, pontos) {
    let dadosRanking = JSON.parse(localStorage.getItem('rankingFiguras')) || [];
    dadosRanking.push({ nome, pontos });
    dadosRanking.sort((a, b) => b.pontos - a.pontos);
    dadosRanking = dadosRanking.slice(0, 3);
    localStorage.setItem('rankingFiguras', JSON.stringify(dadosRanking));
}

function atualizarTabelaRanking() {
    const containerRanking = document.getElementById('ranking-vagas');
    if (!containerRanking) return;
    containerRanking.innerHTML = ''; 

    const tituloRanking = document.createElement('h3');
    tituloRanking.textContent = '🏆 Melhores Pontuações 🏆';
    containerRanking.appendChild(tituloRanking);

    const dados = JSON.parse(localStorage.getItem('rankingFiguras')) || [];

    if (dados.length === 0) {
        const aviso = document.createElement('p');
        aviso.textContent = 'Ainda não há recordes. Seja o primeiro!';
        containerRanking.appendChild(aviso);
        return;
    }

    const tabela = document.createElement('table');
    const cabecalho = document.createElement('tr');
    cabecalho.innerHTML = '<th>Lugar</th><th>Nome</th><th>Pontos</th>';
    tabela.appendChild(cabecalho);

    dados.forEach((jogador, index) => {
        const linha = document.createElement('tr');
        linha.innerHTML = `<td>${index + 1}º</td><td>${jogador.nome}</td><td>${jogador.pontos}</td>`;
        tabela.appendChild(linha);
    });

    containerRanking.appendChild(tabela);
}

document.addEventListener('DOMContentLoaded', construirInterface);
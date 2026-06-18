// --- Estados Globais da Partida ---
let pontuacao = 0;
let tempoRestante = 30; 
let jogoAtivo = false;
let intervaloTempo;
let erroCometidoNaRodada = false;

// Banco de figuras divertidas organizadas em duplas (Repetido vs Intruso)
// Escolhi figuras bem diferentes para que uma criança de 6 anos consiga diferenciar sem se frustrar
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

function construirInterface() {
    const app = document.getElementById('app');
    if (!app) return;

    const container = document.createElement('div');
    container.classList.add('game-container');

    const titulo = document.createElement('h1');
    titulo.textContent = 'Ache a Figura Diferente! 🦊';
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

    // Grid Inicial montado via DOM puro
    const grid = document.createElement('div');
    grid.id = 'grid-jogo';
    grid.classList.add('grid-cenario');
    
    // Cria 9 blocos com uma interrogação lúdica antes do jogo começar
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
    grid.innerHTML = ''; // Limpeza limpa do tabuleiro anterior

    // Sorteia um par de figuras do nosso banco de dados
    const parAtual = paresDeFiguras[Math.floor(Math.random() * paresDeFiguras.length)];
    
    // Sorteia qual das 9 posições vai receber a figura intrusa
    const indiceDiferente = Math.floor(Math.random() * 9);

    for (let i = 0; i < 9; i++) {
        const bloco = document.createElement('div');
        bloco.classList.add('bloco');
        
        if (i === indiceDiferente) {
            // Injeta a figura diferente
            bloco.textContent = parAtual.diferente;
            bloco.dataset.tipo = 'diferente';
        } else {
            // Injeta as figuras repetidas normais
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
        // Se achou a figura correta sem errar nenhuma outra antes, ganha bônus de atenção (+15)
        if (!erroCometidoNaRodada) {
            pontuacao += 15; 
        } else {
            pontuacao += 10;
        }
        
        atualizarPlacarInterface();
        gerarNovaRodada(); 
    } else {
        // Clicou na figura repetida (errou)
        erroCometidoNaRodada = true;
        // O bloco com a figura errada fica quase invisível para ajudar a criança a focar nas outras opções
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

    const blocos = document.querySelectorAll('.bloco');
    blocos.forEach(b => {
        b.textContent = "💤"; // Sinaliza o fim do jogo de forma fofa
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
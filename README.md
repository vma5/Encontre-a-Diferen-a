# Projeto: Encontre a Figura Diferente! 🦊

## Desenvolvedor
* Victor Martins Almeida

---

## 🕹️ Mecânica e Tema Escolhidos
O projeto baseia-se na mecânica de discriminação cognitiva "Encontre o Diferente" (*Odd One Out*). O tabuleiro gera 9 blocos contendo figuras de animais ou objetos idênticos (renderizados via Emojis nativos de alta legibilidade), exceto por **um único bloco** que abriga uma figura completamente diferente. O objetivo da criança é tocar no intruso.

## 🧒 Briefing do Cliente (Público-Alvo)
* **Cliente escolhido:** Criança de 6 anos.
* **Exigências de Design:** Substituição de cores abstratas por figuras concretas de fácil identificação (animais), botões e fontes gigantes, ambiente alegre de floresta, e ausência completa de punições ou pontuações negativas.

---

## 🎯 Minhas Decisões de Design (Justificadas)

* **Tamanho e Formato do Grid:** Fixado em **3×3**. É a proporção ideal para manter o campo focal estável em crianças nessa idade.
* **Uso de Figuras em vez de Cores:** Cores muito próximas podem causar cansaço visual ou excluir crianças com daltonismo. O uso de figuras de animais (como Macaco vs Gato) é muito mais lúdico, divertido e inclusivo.
* **Fórmula de Pontuação:** Cada acerto soma $+10$ pontos. Cliques errados não retiram pontos. Em vez disso, a figura errada perde opacidade (`filter: opacity(0.15)`), sumindo aos poucos e ajudando a criança por eliminação visual.
* **Critérios de Tempo:** Partidas rápidas de **30 segundos** para garantir o pico máximo de dopamina e atenção sem entediar.
* **Condição de Término:** Ao fim do tempo, as figuras dormem (`💤`) no lugar do tabuleiro e um prompt acolhedor salva o recorde do pequeno jogador.

---

## ✨ Seu Diferencial: "Bônus Atenção Máxima"
Criação do multiplicador de pontos por clique direto controlado pelo estado da variável `erroCometidoNaRodada`.
* **Como funciona no código:** Na função `processarEscolha()`, se o usuário identificar o bicho intruso logo na primeira olhada sem errar nenhuma caixa antes, a rodada vale $+15$ pontos. Se ele errar e precisar do auxílio de eliminação, a rodada volta a valer os $10$ pontos tradicionais.

---

## 📜 Regras do Jogo
1. Aperte o botão verde para iniciar a brincadeira.
2. Procure nas caixas qual é o animalzinho diferente que ficou perdido no grupo.
3. Toque no animalzinho diferente para ganhar pontos e mudar de fase!
4. Se tocar no bicho errado, ele vai sumir devagarzinho para te ajudar a achar o certo.

---

## 🚀 Como Executar o Projeto

1. Baixe os arquivos organizados nas pastas `css/` e `js/`.
2. Abra o arquivo central `index.html` em qualquer navegador (Chrome, Safari, Edge) no computador ou celular.

---

## 🤔 Reflexão Obrigatória

1. **Qual foi o bug mais chato e como resolveu?**
   O bug mais chato foi a seleção acidental do texto dos emojis quando a criança clicava muito rápido nas caixas, o que destacava o bloco com uma caixa azul feia do navegador. Resolvi aplicando a regra de CSS `user-select: none;` na classe `.bloco`.

2. **Por que escolheu essa fórmula de pontuação?**
   Para recompensar o instinto de observação calma da criança por meio do bônus de 15 pontos, ensinando-a a analisar o cenário antes de sair clicando na tela desordenadamente.

3. **Como o briefing do cliente mudou suas decisões?**
   Substituir cores puras por emojis de animais foi a maior mudança baseada no briefing. Animais geram conexão afetiva imediata com crianças de 6 anos, tornando o jogo infinitamente mais atraente do que blocos de cores sólidas.

4. **Se tivesse mais uma semana, o que mudaria?**
   Adicionaria sons reais de animais (um rugido de leão, um miado de gato) tocando toda vez que a respectiva rodada fosse gerada na tela.

5. **Aponte uma função sua que ficou boa e explique o que ela faz.**
   A função `atualizarTabelaRanking()`. Ela é muito boa porque limpa o container via DOM nativo no início de cada chamada e reconstrói uma tabela HTML limpa lendo os dados salvos em formato string JSON do `localStorage`.

---

## 🧐 Bônus Aplicados

* **Mecânica Original Extra:** Mecânica de bônus por acerto direto (Atenção Máxima).
* **Efeitos Sonoros Nativos:** Geração e síntese de áudio em tempo real via código com a Web Audio API
* **Ranking Local:** Salvamento e exibição dinâmica em tabela com persistência via `localStorage`.
* **Responsividade:** Uso de caixas proporcionais com flexibilidade de tamanho (`font-size: 3rem` e `aspect-ratio: 1/1`) perfeitas para qualquer tela de celular touch-screen.

---

## 💳 Créditos e Referências
* Tabela de Emojis Unicode nativos adaptados de repositórios públicos.

---

## 📄 Licença
Este projeto está sob a licença MIT.
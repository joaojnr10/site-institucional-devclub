//==================================================
// CÉU ESPACIAL COM ESTRELAS E METEOROS
// =================================================
const meteorSky = document.querySelector(".ceu-animado");

//Cria estrelas pequenas por toda tela
const numberOfStars = window.innerWidth < 600 ? 24 : 52;//Quantidade de estrelas

for (let index = 0; index < numberOfStars; index += 1) {//Cria as estrelas
    const star = document.createElement('span');
    star.className = 'estrela-fundo';

    // Cada estrela recebe posição, tamanho e velocidade diferentes.
    star.style.setProperty('--star-x', `${Math.random() * 100}%`);
    star.style.setProperty('--star-y', `${Math.random() * 100}%`);
    // O tamanho das estrelas varia de 1 a 2.
    star.style.setProperty('--star-size', `${Math.random() * 2.2 + 1}px`);
    star.style.setProperty('--star-opacity', `${Math.random() * .55 + .25}`);
    star.style.setProperty('--star-speed', `${Math.random() * 3 + 2}s`);
    star.style.setProperty('--star-delay', `${Math.random() * -5}s`);

    meteorSky.appendChild(star);
}

// CRIA METEOROS PASSANDO NA TELA
const numberOfMeteors = window.innerWidth < 600 ? 6 : 12;

for (let index = 0; index < numberOfMeteors; index += 1) {
    const meteor = document.createElement('span');
    meteor.className = 'meteoro';

    // As variáveis evitam que todos os meteoros caiam no mesmo ponto e instante.
    meteor.style.setProperty('--meteor-x', `${35 + Math.random() * 75}%`);
    meteor.style.setProperty('--meteor-y', `${-20 + Math.random() * 55}%`);
    meteor.style.setProperty('--meteor-length', `${90 + Math.random() * 150}px`);
    // Ciclos curtos deixam a queda perceptível sem precisar esperar muito.
    meteor.style.setProperty('--meteor-speed', `${5 + Math.random() * 4}s`);
    meteor.style.setProperty('--meteor-delay', `${Math.random() * -10}s`);

    meteorSky.appendChild(meteor);
}

// =================================================
//      SCROL HORIZONTAL DOS PROFESSORES
// =================================================
const teachersTrack = document.querySelector('.lista-professores-horizontal');

if (teachersTrack) {
    teachersTrack.addEventListener('wheel', event => {
        const isMovingDown = event.deltaY > 0;
        const isMovingUp = event.deltaY < 0;
        const reachedStart = teachersTrack.scrollLeft <= 1;
        const reachedEnd = Math.ceil(teachersTrack.scrollLeft + teachersTrack.clientWidth) >= teachersTrack.scrollWidth - 1;

        // Não bloqueia a página quando o usuário já chegou a uma das pontas.
        if ((isMovingUp && reachedStart) || (isMovingDown && reachedEnd)) return;

        event.preventDefault();
        teachersTrack.scrollBy({ left: event.deltaY * 1.4, behavior: 'auto' });
    }, { passive: false });
}

// =================================================
//          PERGUNTAS FREQUENTES
// =================================================
document.querySelectorAll('details').forEach(detail => {
    detail.addEventListener('toggle', () => {
        if (!detail.open) return;
        document.querySelectorAll('details').forEach(otherDetail => {
            if (otherDetail !== detail) otherDetail.open = false;
        });
    });
});

// =================================================
//          BOTAO DO ASSISTENTE DE IA
//             E ASSISTENTE DE IA
// =================================================
const chatBubble = document.querySelector(".balao-assistente");
const chatButton = document.querySelector(".botao-assistente");
const closeChatButton = document.querySelector(".fechar-assistente");
const chatForm = document.querySelector(".formulario-assistente");
const chatInput = document.querySelector(".campo-assistente");
const chatMessages = document.querySelector(".mensagens-assistente");
const sendButton = document.querySelector(".enviar-assistente");

const webhookUrl =
  "https://treinamento-n8n-n8n-webhook.5t0uy4.easypanel.host/webhook/assistente-devclub";


chatButton.addEventListener("click", () => {//Abre e fecha o chat
  chatBubble.classList.toggle("oculto");

  if (!chatBubble.classList.contains("oculto")) {//Coloca o foco no input
    chatInput.focus();
  }
});


closeChatButton.addEventListener("click", () => {
  chatBubble.classList.add("oculto");
});


function adicionarMensagem(texto, remetente) {
  const message = document.createElement("div");

  message.classList.add(
    "mensagem-assistente",
    remetente === "usuario"
      ? "mensagem-usuario"
      : "mensagem-bot"
  );

  message.textContent = texto;

  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  return message;
}


chatForm.addEventListener("submit", async event => {
  event.preventDefault();

  const mensagem = chatInput.value.trim();

  if (!mensagem) {
    return;
  }

  adicionarMensagem(mensagem, "usuario");

  chatInput.value = "";
  chatInput.disabled = true;
  sendButton.disabled = true;

  const loadingMessage = adicionarMensagem(
    "Clubinho está digitando...",
    "bot"
  );

  try {
    const body = new URLSearchParams({
      mensagem
    });

    const response = await fetch(webhookUrl, {
      method: "POST",
      body
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(
        `Erro HTTP ${response.status}: ${responseText}`
      );
    }

    if (!responseText) {
      throw new Error("O assistente devolveu uma resposta vazia.");
    }

    const data = JSON.parse(responseText);

    loadingMessage.textContent =
      data.resposta ||
      "Não consegui encontrar uma resposta.";
  } catch (error) {
    console.error("Erro no assistente:", error);

    loadingMessage.textContent =
      "Não consegui responder agora. Tente novamente em alguns instantes.";
  } finally {
    chatInput.disabled = false;
    sendButton.disabled = false;
    chatInput.focus();

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
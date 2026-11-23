const URL = "https://jsonplaceholder.typicode.com/posts?_limit=6";

const botao = document.querySelector("#btn-carregar");
const filtro = document.querySelector("#filtro");
const mensagem = document.querySelector("#mensagem");
const painel = document.querySelector("#lista-posts");

let publicacoes = [];

function mostrarMensagem(texto, ehErro = false) {
  mensagem.textContent = texto;
  mensagem.classList.toggle("erro", ehErro);
}

function renderizarPublicacoes(lista) {
  painel.replaceChildren();

  lista.forEach((publicacao) => {
    const cartao = document.createElement("article");
    cartao.classList.add("cartao");

    const titulo = document.createElement("h2");
    titulo.textContent = publicacao.title;

    const texto = document.createElement("p");
    texto.textContent = publicacao.body;

    const autor = document.createElement("small");
    autor.textContent = `Usuário ${publicacao.userId} · Publicação #${publicacao.id}`;

    cartao.append(titulo, texto, autor);
    painel.append(cartao);
  });
}

function carregarPublicacoes() {

  mostrarMensagem("Carregando publicações...");
  botao.disabled = true;

  fetch(URL)
    .then((resposta) => {
      if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
      }
      return resposta.json();
    })
    .then((dados) => {
      console.log(dados);
      publicacoes = dados;
      filtro.value = "";
      renderizarPublicacoes(publicacoes);
      mostrarMensagem(`${publicacoes.length} publicações carregadas.`);
    })
    .catch((erro) => {
      console.error(erro);
      publicacoes = [];
      painel.replaceChildren();
      mostrarMensagem(
        "Não foi possível carregar as publicações. Tente novamente.",
        true
      );
    })
    .finally(() => {
      botao.disabled = false;
    });
}

botao.addEventListener("click", () => {
  console.log("Botão clicado!");
  carregarPublicacoes();
});

filtro.addEventListener("input", () => {
  const termo = filtro.value.trim().toLowerCase();

  const encontradas = publicacoes.filter((item) => {
    return item.title.toLowerCase().includes(termo);
  });

  renderizarPublicacoes(encontradas);

  if (publicacoes.length === 0) {
    return;
  }

  if (encontradas.length === 0) {
    mostrarMensagem("Nenhuma publicação encontrada.");
  } else {
    mostrarMensagem(
      `${encontradas.length} de ${publicacoes.length} publicações exibidas.`
    );
  }
});
const USUARIO_CORRETO = "admin";
const SENHA_CORRETA = "1234";

// Array contendo os dados iniciais de produção da Fazenda Bela Serra
let historicoProducao = [
  { id: 1, data: "2026-10-25", produto: "Leite Tipo A", quantidade: 480 },
  { id: 2, data: "2026-10-26", produto: "Queijo Artesanal", quantidade: 150 },
  { id: 3, data: "2026-10-27", produto: "Doce de Leite", quantidade: 90 }
];

// ==========================================
// ELEMENTOS DO DOM
// ==========================================
const loginContainer = document.getElementById("login-container");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");
const loggedUserName = document.getElementById("logged-user-name");
const logoutBtn = document.getElementById("logout-btn");

const productionForm = document.getElementById("production-form");
const dataInput = document.getElementById("data-producao");
const produtoInput = document.getElementById("produto");
const quantidadeInput = document.getElementById("quantidade");
const formMessage = document.getElementById("form-message");

const tabelaProducao = document.getElementById("tabela-producao");
const statTotal = document.getElementById("stat-total");
const statMedia = document.getElementById("stat-media");
const statQtd = document.getElementById("stat-qtd");

// ==========================================
// AUTENTICAÇÃO E LOGIN
// ==========================================
loginForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const usuario = usernameInput.value.trim();
  const senha = passwordInput.value.trim();

  // Estrutura condicional if/else para validação de acesso
  if (usuario === USUARIO_CORRETO && senha === SENHA_CORRETA) {
    loginError.classList.add("hidden");
    loginContainer.classList.add("hidden");
    dashboard.classList.remove("hidden");
    loggedUserName.textContent = usuario;

    // Inicializa a interface com os dados
    atualizarInterface();
  } else {
    loginError.textContent = "Usuário ou senha incorretos! Utilize 'admin' e '1234'.";
    loginError.classList.remove("hidden");
  }
});

// Logout
logoutBtn.addEventListener("click", function() {
  dashboard.classList.add("hidden");
  loginContainer.classList.remove("hidden");
  usernameInput.value = "";
  passwordInput.value = "";
});

// ==========================================
// FUNÇÕES DE CÁLCULO E MANIPULAÇÃO DE DADOS
// ==========================================

// Função com laço 'for' para calcular o total e a média dos itens do array
function calcularEstatisticas() {
  let somaTotal = 0;

  for (let i = 0; i < historicoProducao.length; i++) {
    somaTotal += Number(historicoProducao[i].quantidade);
  }

  const quantidadeLotes = historicoProducao.length;
  const media = quantidadeLotes > 0 ? (somaTotal / quantidadeLotes) : 0;

  return {
    total: somaTotal.toFixed(1),
    media: media.toFixed(1),
    quantidade: quantidadeLotes
  };
}

// Função para atualizar a tabela e os indicadores na tela
function atualizarInterface() {
  tabelaProducao.innerHTML = "";

  // Percorre a lista (array) de registros usando o laço for
  for (let i = 0; i < historicoProducao.length; i++) {
    const item = historicoProducao[i];
    const tr = document.createElement("tr");

    // Condicional if/else para definir o status de qualidade do produto
    let statusTexto = "";
    let statusClasse = "";

    if (item.quantidade >= 150) {
      statusTexto = "Lote Premium / Alta Produção";
      statusClasse = "status-alto";
    } else {
      statusTexto = "Lote Padrão / Produção Regular";
      statusClasse = "status-normal";
    }

    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.data}</td>
      <td>${item.produto}</td>
      <td>${item.quantidade}</td>
      <td class="${statusClasse}">${statusTexto}</td>
    `;

    tabelaProducao.appendChild(tr);
  }

  // Atualiza os cards estatísticos do topo
  const stats = calcularEstatisticas();
  statTotal.textContent = `${stats.total} un / L`;
  statMedia.textContent = `${stats.media} un / L`;
  statQtd.textContent = stats.quantidade;
}

// ==========================================
// CADASTRO DE NOVOS REGISTROS
// ==========================================
productionForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const data = dataInput.value;
  const produto = produtoInput.value;
  const quantidade = parseFloat(quantidadeInput.value);

  // Validação com if/else e tratamento de erros
  if (!data || !produto || isNaN(quantidade) || quantidade <= 0) {
    exibirMensagem("Preencha todos os campos com valores válidos.", "error");
    return;
  }

  // Criação do novo objeto para adicionar ao array
  const novoRegistro = {
    id: historicoProducao.length + 1,
    data: data,
    produto: produto,
    quantidade: quantidade
  };

  // Adiciona o item ao array principal
  historicoProducao.push(novoRegistro);

  // Atualiza a interface e exibe mensagem de sucesso
  atualizarInterface();
  exibirMensagem("Registro adicionado com sucesso!", "success");

  // Reseta o formulário
  productionForm.reset();
});

// Função utilitária para exibir mensagens de feedback
function exibirMensagem(texto, tipo) {
  formMessage.textContent = texto;
  formMessage.className = `message ${tipo}`;
  formMessage.classList.remove("hidden");

  setTimeout(function() {
    formMessage.classList.add("hidden");
  }, 3000);
}



// Dados usados somente para apresentar a interface.
const clientes = [
    {
        id: 1,
        nome: "Ana Paula",
        email: "ana@email.com",
        telefone: "21999990001"
    },
    {
        id: 2,
        nome: "Carlos Silva",
        email: "carlos@email.com",
        telefone: "21999990002"
    }
];

// Referências aos elementos da página.
const telaConsulta = document.querySelector("#tela-consulta");
const telaFormulario = document.querySelector("#tela-formulario");

const menuConsulta = document.querySelector("#menu-consulta");
const menuCadastro = document.querySelector("#menu-cadastro");

const formulario = document.querySelector("#formulario-cliente");
const tituloFormulario = document.querySelector("#titulo-formulario");
const botaoSalvar = document.querySelector("#botao-salvar");

const campoId = document.querySelector("#cliente-id");
const campoNome = document.querySelector("#nome");
const campoEmail = document.querySelector("#email");
const campoTelefone = document.querySelector("#telefone");

const pesquisa = document.querySelector("#pesquisa");
const listaClientes = document.querySelector("#lista-clientes");
const estadoVazio = document.querySelector("#estado-vazio");
const quantidadeResultados = document.querySelector(
    "#quantidade-resultados"
);

const mensagem = document.querySelector("#mensagem");
const modalExclusao = document.querySelector("#modal-exclusao");

// Exibe uma mensagem sem alterar os dados.
function exibirMensagem(texto) {
    mensagem.textContent = texto;
    mensagem.hidden = false;
}

function limparMensagem() {
    mensagem.textContent = "";
    mensagem.hidden = true;
}

// Atualiza o destaque do menu.
function atualizarMenu(itemAtivo) {
    [menuConsulta, menuCadastro].forEach((item) => {
        const ativo = item === itemAtivo;

        item.classList.toggle("ativa", ativo);

        if (ativo) {
            item.setAttribute("aria-current", "page");
        } else {
            item.removeAttribute("aria-current");
        }
    });
}

// Abre a tela de consulta.
function abrirConsulta() {
    limparMensagem();

    telaConsulta.hidden = false;
    telaFormulario.hidden = true;

    atualizarMenu(menuConsulta);

    document.querySelector("#titulo-consulta").focus();
}

// Abre o formulário vazio ou com um cliente de exemplo.
function abrirFormulario(cliente = null) {
    limparMensagem();
    formulario.reset();

    campoId.value = cliente ? cliente.id : "";

    if (cliente) {
        tituloFormulario.textContent = "Editar cliente";
        botaoSalvar.textContent = "Salvar alterações";

        campoNome.value = cliente.nome;
        campoEmail.value = cliente.email;
        campoTelefone.value = cliente.telefone || "";

        // Edição pertence à área de consulta de clientes.
        atualizarMenu(menuConsulta);
    } else {
        tituloFormulario.textContent = "Novo cliente";
        botaoSalvar.textContent = "Salvar cliente";

        atualizarMenu(menuCadastro);
    }

    telaConsulta.hidden = true;
    telaFormulario.hidden = false;

    tituloFormulario.focus();
}

// Normaliza o texto para facilitar a pesquisa.
function normalizar(texto) {
    return String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

// Formatação visual dos telefones de exemplo.
function formatarTelefone(telefone) {
    const numeros = (telefone || "").replace(/\D/g, "");

    if (numeros.length === 11) {
        return numeros.replace(
            /(\d{2})(\d{5})(\d{4})/,
            "($1) $2-$3"
        );
    }

    return telefone || "Não informado";
}

// Cria uma célula usando texto, sem interpretar HTML.
function criarCelula(texto, classe = "") {
    const celula = document.createElement("td");

    celula.textContent = texto;

    if (classe) {
        celula.className = classe;
    }

    return celula;
}

// Desenha os clientes na tabela.
function renderizarClientes() {
    const termo = normalizar(pesquisa.value.trim());

    const filtrados = clientes.filter((cliente) => {
        const conteudo = [
            cliente.nome,
            cliente.email,
            cliente.telefone,
            formatarTelefone(cliente.telefone)
        ].join(" ");

        return normalizar(conteudo).includes(termo);
    });

    listaClientes.replaceChildren();

    filtrados.forEach((cliente) => {
        const linha = document.createElement("tr");

        linha.append(
            criarCelula(`#${cliente.id}`),
            criarCelula(cliente.nome, "nome-cliente"),
            criarCelula(cliente.email),
            criarCelula(formatarTelefone(cliente.telefone))
        );

        const celulaAcoes = document.createElement("td");
        const acoes = document.createElement("div");

        acoes.className = "acoes";

        const botaoEditar = document.createElement("button");

        botaoEditar.type = "button";
        botaoEditar.className = "botao-tabela";
        botaoEditar.textContent = "Editar";
        botaoEditar.setAttribute(
            "aria-label",
            `Editar ${cliente.nome}`
        );

        botaoEditar.addEventListener("click", () => {
            abrirFormulario(cliente);
        });

        const botaoExcluir = document.createElement("button");

        botaoExcluir.type = "button";
        botaoExcluir.className = "botao-tabela excluir";
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.setAttribute(
            "aria-label",
            `Excluir ${cliente.nome}`
        );

        botaoExcluir.addEventListener("click", () => {
            document.querySelector("#nome-exclusao").textContent =
                cliente.nome;

            modalExclusao.showModal();
        });

        acoes.append(botaoEditar, botaoExcluir);
        celulaAcoes.append(acoes);
        linha.append(celulaAcoes);

        listaClientes.append(linha);
    });

    estadoVazio.hidden = filtrados.length > 0;

    quantidadeResultados.textContent =
        filtrados.length === 1
            ? "1 cliente encontrado"
            : `${filtrados.length} clientes encontrados`;
}

// Navegação.
menuConsulta.addEventListener("click", abrirConsulta);

menuCadastro.addEventListener("click", () => {
    abrirFormulario();
});

document.querySelector("#botao-novo")
    .addEventListener("click", () => {
        abrirFormulario();
    });

document.querySelector("#botao-voltar")
    .addEventListener("click", abrirConsulta);

document.querySelector("#botao-cancelar")
    .addEventListener("click", abrirConsulta);

// Pesquisa local.
pesquisa.addEventListener("input", renderizarClientes);

// Demonstração do envio do formulário.
// O navegador valida required e type="email" antes deste evento.
formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    const operacao = campoId.value ? "edição" : "cadastro";

    exibirMensagem(
        `Demonstração de ${operacao}: os dados não foram enviados ` +
        "nem salvos. A integração com a API será implementada depois."
    );
});

// Demonstração da exclusão.
document.querySelector("#cancelar-exclusao")
    .addEventListener("click", () => {
        modalExclusao.close();
    });

document.querySelector("#confirmar-exclusao")
    .addEventListener("click", () => {
        modalExclusao.close();

        exibirMensagem(
            "Demonstração de exclusão: nenhum cliente foi removido."
        );
    });

// Preenche os indicadores.
document.querySelector("#total-clientes").textContent =
    clientes.length;

document.querySelector("#total-telefones").textContent =
    clientes.filter((cliente) => cliente.telefone).length;

// Desenha a consulta inicial.
renderizarClientes();
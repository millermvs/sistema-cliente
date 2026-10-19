const express = require("express");
const swaggerUi = require("swagger-ui-express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// ======================================================
// "BANCO DE DADOS" EM MEMÓRIA
// ======================================================

let clientes = [
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

let proximoId = 3;

// ======================================================
// CONFIGURAÇÃO DO SWAGGER
// ======================================================

const swaggerDocument = {
    openapi: "3.0.0",

    info: {
        title: "API de Clientes",
        version: "1.0.0",
        description: "API REST para gerenciamento de clientes em memória."
    },

    servers: [
        {
            url: "http://localhost:3000",
            description: "Servidor local"
        }
    ],

    components: {
        schemas: {
            Cliente: {
                type: "object",

                properties: {
                    id: {
                        type: "integer",
                        example: 1
                    },

                    nome: {
                        type: "string",
                        example: "Ana Paula"
                    },

                    email: {
                        type: "string",
                        example: "ana@email.com"
                    },

                    telefone: {
                        type: "string",
                        example: "21999999999"
                    }
                }
            },

            ClienteCadastro: {
                type: "object",

                required: [
                    "nome",
                    "email"
                ],

                properties: {
                    nome: {
                        type: "string",
                        example: "Mariana Souza"
                    },

                    email: {
                        type: "string",
                        example: "mariana@email.com"
                    },

                    telefone: {
                        type: "string",
                        example: "21988887777"
                    }
                }
            },

            Erro: {
                type: "object",

                properties: {
                    mensagem: {
                        type: "string",
                        example: "Cliente não encontrado."
                    }
                }
            }
        }
    },

    paths: {

        "/": {
            get: {
                summary: "Retorna informações da API",

                responses: {
                    200: {
                        description: "API funcionando corretamente"
                    }
                }
            }
        },

        "/api/clientes": {

            get: {
                summary: "Lista todos os clientes",
                tags: ["Clientes"],

                responses: {
                    200: {
                        description: "Lista de clientes",

                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",

                                    items: {
                                        $ref: "#/components/schemas/Cliente"
                                    }
                                }
                            }
                        }
                    }
                }
            },

            post: {
                summary: "Cadastra um novo cliente",
                tags: ["Clientes"],

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ClienteCadastro"
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: "Cliente cadastrado com sucesso",

                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Cliente"
                                }
                            }
                        }
                    },

                    400: {
                        description: "Dados inválidos",

                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Erro"
                                }
                            }
                        }
                    }
                }
            }
        },

        "/api/clientes/{id}": {

            get: {
                summary: "Consulta um cliente pelo ID",
                tags: ["Clientes"],

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "integer"
                        }
                    }
                ],

                responses: {
                    200: {
                        description: "Cliente encontrado",

                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Cliente"
                                }
                            }
                        }
                    },

                    404: {
                        description: "Cliente não encontrado",

                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Erro"
                                }
                            }
                        }
                    }
                }
            },

            put: {
                summary: "Atualiza um cliente",
                tags: ["Clientes"],

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "integer"
                        }
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ClienteCadastro"
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description: "Cliente atualizado com sucesso",

                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Cliente"
                                }
                            }
                        }
                    },

                    404: {
                        description: "Cliente não encontrado",

                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Erro"
                                }
                            }
                        }
                    }
                }
            },

            delete: {
                summary: "Exclui um cliente",
                tags: ["Clientes"],

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "integer"
                        }
                    }
                ],

                responses: {
                    204: {
                        description: "Cliente excluído com sucesso"
                    },

                    404: {
                        description: "Cliente não encontrado",

                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Erro"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

// ======================================================
// SWAGGER
// ======================================================

app.use(
    "/swagger",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

// ======================================================
// ROTA PRINCIPAL
// ======================================================

app.get("/", (req, res) => {
    res.json({
        nome: "API de Clientes",
        versao: "1.0.0",
        status: "online",
        swagger: "/swagger"
    });
});

// ======================================================
// LISTAR TODOS OS CLIENTES
// ======================================================

app.get("/api/clientes", (req, res) => {
    res.json(clientes);
});

// ======================================================
// CONSULTAR CLIENTE POR ID
// ======================================================

app.get("/api/clientes/:id", (req, res) => {

    const id = Number(req.params.id);

    const cliente = clientes.find(
        cliente => cliente.id === id
    );

    if (!cliente) {
        return res.status(404).json({
            mensagem: "Cliente não encontrado."
        });
    }

    res.json(cliente);
});

// ======================================================
// CADASTRAR CLIENTE
// ======================================================

app.post("/api/clientes", (req, res) => {

    const {
        nome,
        email,
        telefone
    } = req.body;

    if (!nome || !email) {
        return res.status(400).json({
            mensagem: "Nome e email são obrigatórios."
        });
    }

    const cliente = {
        id: proximoId++,
        nome,
        email,
        telefone
    };

    clientes.push(cliente);

    res.status(201).json(cliente);
});

// ======================================================
// ATUALIZAR CLIENTE
// ======================================================

app.put("/api/clientes/:id", (req, res) => {

    const id = Number(req.params.id);

    const cliente = clientes.find(
        cliente => cliente.id === id
    );

    if (!cliente) {
        return res.status(404).json({
            mensagem: "Cliente não encontrado."
        });
    }

    const {
        nome,
        email,
        telefone
    } = req.body;

    cliente.nome = nome ?? cliente.nome;
    cliente.email = email ?? cliente.email;
    cliente.telefone = telefone ?? cliente.telefone;

    res.json(cliente);
});

// ======================================================
// EXCLUIR CLIENTE
// ======================================================

app.delete("/api/clientes/:id", (req, res) => {

    const id = Number(req.params.id);

    const indice = clientes.findIndex(
        cliente => cliente.id === id
    );

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Cliente não encontrado."
        });
    }

    clientes.splice(indice, 1);

    res.status(204).send();
});

// ======================================================
// INICIALIZAÇÃO DA API
// ======================================================

app.listen(PORT, () => {

    console.log("");
    console.log("=======================================");
    console.log(" API DE CLIENTES");
    console.log("=======================================");
    console.log(`API:     http://localhost:${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/swagger`);
    console.log("=======================================");
    console.log("");

});
const connection = require('../BACKEND-APP/dbConfig.js');

var questionario;
var contQuest = 0;
var numAlunos = 0;
var clientesId = [];
let requestQueue = [];
let canCallGetQuestionario = false;

function getQuestionario() {
    return new Promise((resolve, reject) => {
        var sql = `
            SELECT 
                q.idQuestao,
                q.enunciado,
                q.fkAssunto,
                q.tipoQuestao,
                a.idalternativas,
                a.Questao_idQuestao,
                a.Questao_fkAssunto,
                a.letra,
                a.descricao,
                a.resposta
            FROM 
                mydb.Questao q
            INNER JOIN 
                mydb.alternativas a ON q.idQuestao = a.Questao_idQuestao
            ORDER BY 
                q.idQuestao, a.letra
        `;
        connection.query(sql, function (err, result) {
            if (err) {
                return reject(err);
            }
            // Processa os resultados para montar o JSON personalizado
            let questoesMap = {};

            result.forEach(row => {
                if (!questoesMap[row.idQuestao]) {
                    questoesMap[row.idQuestao] = {
                        idQuestao: row.idQuestao,
                        enunciado: "Determine se as afirmações abaixo são verdadeiras (V) ou falsas (F)",
                        alternativas: []
                    };
                }

                questoesMap[row.idQuestao].alternativas.push({
                    questao: row.idQuestao,
                    idalternativas: row.idalternativas,
                    letra: row.letra,
                    descricao: row.descricao,
                    resposta: row.resposta
                });
            });

            // Converte o mapa em uma lista
            let questoesList = Object.values(questoesMap);
            questionario = questoesList;
            resolve(questoesList);
        });
    });
}

function getProximaQuestao(request, response) {
    console.log("função proxima questão");
    console.log(questionario[0]);
    let i = contQuest;
    contQuest++;
    return response.json(questionario[i]);
}

function liberaQuestionario(request, response) {
    clientesId.push(request.id);
    requestQueue.push({ request, response });

    if (requestQueue.length >= 5 && canCallGetQuestionario) {
        getQuestionario().then(result => {
            // Enviar a mesma resposta para todos os clientes na fila
            requestQueue.forEach(({ response }) => {
                response.json(result);
            });

            // Limpar a fila
            requestQueue = [];
            numAlunos = 0;  // Resetar o contador de alunos
        }).catch(error => {
            // Em caso de erro, enviar uma resposta de erro para todos os clientes na fila
            requestQueue.forEach(({ response }) => {
                response.status(500).json({ error: 'Erro no processamento' });
            });

            // Limpar a fila
            requestQueue = [];
            numAlunos = 0;  // Resetar o contador de alunos
        });
    } else {
        console.log("Esperando jogadores...");
        numAlunos++;
    }
}

function enableGetQuestionario() {
    canCallGetQuestionario = true;
    console.log("getQuestionario agora pode ser chamada.");

    if (requestQueue.length >= 5) {
        getQuestionario().then(result => {
            // Enviar a mesma resposta para todos os clientes na fila
            requestQueue.forEach(({ response }) => {
                response.json(result);
            });

            // Limpar a fila
            requestQueue = [];
            numAlunos = 0;  // Resetar o contador de alunos
        }).catch(error => {
            // Em caso de erro, enviar uma resposta de erro para todos os clientes na fila
            requestQueue.forEach(({ response }) => {
                response.status(500).json({ error: 'Erro no processamento' });
            });

            // Limpar a fila
            requestQueue = [];
            numAlunos = 0;  // Resetar o contador de alunos
        });
    }
}

module.exports = {
    getQuestionario,
    getProximaQuestao,
    liberaQuestionario,
    enableGetQuestionario
};

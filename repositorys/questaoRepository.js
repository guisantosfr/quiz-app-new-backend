require('./config/dbConfig')
const mysql = require("mysql");
const csvtojson = require('csvtojson');
// const db = mysql.createConnection({
//     host:"projetoengajamento.czuc0qggowbu.us-east-1.rds.amazonaws.com",
//     port:"3306",
//     user:"adminG",
//     password:"Chernobyl371",
//     database:"mysql",
// })

const csv = require('csv-parser');
const readline = require("readline");
const fs = require("fs");
const fastcsv = require("fast-csv");
const arquivo = "questaoRepository.csv"; 
//let stream  = fs.createReadStream("turma.csv");
let stream  = fs.createReadStream("turma.csv");
//lendo csv


//criando conexão com o banco
csvtojson().fromFile(arquivo).then(source => { 
  
    // Fetching the data from each row  
    // and inserting to the table "sample" 
    for (var i = 0; i < source.length; i++) { 
        var Enunciado = source[i]["Enunciado"]
            //fkAssunto = source[i]["fkAssunto"], 
            //tipoQuestao = source[i]["tipoQuestao"] 
  
        var query =  
        `INSERT INTO mydb.Questao (Enunciado,fkAssunto,tipoQuestao) values(?,?,?);`; 
        var items = [Enunciado, '2','1']; 
         //Inserindo Questão
        db.query(query, items,  
            (err, results, fields) => { 
            if (err) { 
                console.log( 
                "Erro ao inserir linha", i + 1); 
                return console.log(err); 
            } 
        }); 
        console.log("questão inserida")
        const alternativas = [
            { letra: 'A', texto:  source[i]["LetraA"], resposta: source[i]["RespostaA"]},
            { letra: 'B', texto:  source[i]["LetraB"], resposta: source[i]["RespostaB"] },
            { letra: 'C', texto:  source[i]["LetraC"], resposta: source[i]["RespostaC"]},
            { letra: 'D', texto:  source[i]["LetraD"], resposta: source[i]["RespostaD"]}
        ];
        // Query para inserir nas alternativas
        let queryAlternativas = '';
        
        // Adiciona as alternativas usando o último ID da questão inserida
        alternativas.forEach(alternativa => {
            queryAlternativas += `
                INSERT INTO mydb.Alternativas (Questao_idQuestao,letra,descricao,resposta)
                VALUES (LAST_INSERT_ID(), '${alternativa.letra}', '${alternativa.texto}', '${alternativa.resposta}');
            `;
        });
        // var queryAlternativas=
        // "INSERT INTO alternativas (questao_id, letra, texto, resposta) VALUES
        // (1, 'A', 'O Rio Nilo é o rio mais longo do mundo.', 'V'),
        // (1, 'B', 'O Monte Everest é a montanha mais alta do mundo em relação ao nível do mar.', 'V'),
        // (1, 'C', 'A capital do Brasil é São Paulo.', 'F'),
        // (1, 'D', 'A Terra é o terceiro planeta mais próximo do Sol.', 'V')";

       
        db.query(queryAlternativas,  
            (err, results, fields) => { 
            if (err) { 
                console.log( 
                "Erro ao inserir linha", i + 1); 
                return console.log(err); 
            } 
        }); 
        console.log("alternativas inseridas")

    } 

console.log( 
"Todos os items inseridos com sucesso"); 
db.end();
}); 
// //inserindo a questão
// db.connect((err)=>{
//     if(err){
//         console.log(err.message);
//         return;
//     }
//     console.log("connected");

//     var sql = "INSERT INTO mydb.Aluno (Nome,email,idAluno) VALUES ?";
//     //var sql = "INSERT INTO mydb.Assunto (Texto) VALUES ('Assunto sample')";
//     db.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("1 record inserted");
//     });
//     //insere as alternativas logo em seguida

//     var query =
//               "INSERT INTO mydb.Aluno (Nome,email,idAluno) VALUES ?";
//               db.query(query, [csvData], (error, response) => {
//               console.log(error || response);
//             });
//     db.end();
// })
// stream.pipe(csvStream);
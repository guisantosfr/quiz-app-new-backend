const express = require("express");
const db = require("./dbConfig")
const cors = require("cors");
const mysql = require("mysql");
const routes = require('./routes');

const app=express();
    app.use(cors());
    app.use(routes);
    app.listen(5000,()=>console.log("servidor escutando"));


    // app.get("/getAluno",(req,res)=>{


    //     res.send("Conexão com sucesso")
    //     console.log("conexão sucesso")
    // })
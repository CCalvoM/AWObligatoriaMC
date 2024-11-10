"use strict";

const config = {
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'AW_24',
    port : 3307         // Puerto de la BBDD 
}

const PORT = process.env.port ?? 3000       // Puerto del Servidor : El de la variable de entorno. Sino --> 3000

module.exports = { config, PORT }
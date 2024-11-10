// RECURSOS
const mysql = require('mysql')
const path = require("path");
const express = require("express");

// MODULOS
const {config, PORT} = require('./config')

// CREAR UN SERVIDOR EXPRESS.JS
const app = express();
const ficheros = path.join(__dirname, "public");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(express.static(ficheros));

// CREANDO POOL DE CONEXIÓN A BBDD 
const pool = mysql.createPool(config)

app.get('/', (req, res) => {
    res.render("login") 
})

//  EJECUTAMOS EL SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor ejecutando en el puerto http://localhost:${PORT}`)
})
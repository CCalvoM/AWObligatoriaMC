// RECURSOS
const path = require('path')
const express = require('express')

// MODULOS + ROUTERS
const {PORT} = require('./config')
const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')

// CREAR UN SERVIDOR EXPRESS.JS
const app = express();
const ficheros = path.join(__dirname, "public");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(express.static(ficheros));

app.get('/', (req, res) => {
    res.render("login") 
})

app.use('/login', loginRouter)
app.use('/register', registerRouter)

//  EJECUTAMOS EL SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor ejecutando en el puerto http://localhost:${PORT}`)
})
// RECURSOS
const path = require('path')
const express = require('express')

// MODULOS + ROUTERS
const {PORT} = require('./config')
const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')
const middlewareSesion = require('./middlewares/session')

// CREAR UN SERVIDOR EXPRESS.JS
const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CREAR SESSION MIDDLEWARE
app.use(middlewareSesion);

app.get('/', (req, res) => {
    res.render("login") 
})

app.use('/login', loginRouter)
app.use('/register', registerRouter)

// CONTROLAMOS ERRORES FINALMENTE
app.use((err, req, res, next) => {
    console.error(err.stack);

    // Respuesta personalizada según el error
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Ha ocurrido un error inesperado.'
    });
});

//  EJECUTAMOS EL SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor ejecutando en el puerto http://localhost:${PORT}`)
})
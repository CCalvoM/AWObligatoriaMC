// RECURSOS
const mysql = require('mysql')
const path = require('path')
const express = require('express')
const bcrypt = require('bcrypt')

// FICHEROS
const DAOUsuario = require('./DAOs/DAOUsuario')
const DAOFacultad = require('./DAOs/DAOFacultad')

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

// CREANDO DAO USUARIO
const daoU = new DAOUsuario(pool)
const daoF = new DAOFacultad(pool)

app.get('/', (req, res) => {
    res.render("login") 
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    const user = req.body;

    daoU.readUsuario(user.correo, async (err, usuario) => {
        if(err)
            return res.status(500).json({ message: `ERROR: Error al leer el usuario con correo: ${user.correo}`})

        if(!usuario.existe)
            return res.status(400).json({ message: `ERROR: Usuario: ${user.correo} no existe en la BBDD. Registrate`})

        try { 
            const match = await bcrypt.compare(user.contrasena, usuario.contrasena)
            if(!match)
                return res.status(401).json({ message: `ERROR: Contraseña Incorrecta`})
    
            // Contraseña correcta
            if(usuario.rol == "asistente")
                res.redirect('/userAsistente')
            else
                res.redirect('/userOrganizador')
        } catch (compareError) {
            return res.status(500).json({ message: 'ERROR: Error al verificar la contraseña' });
        }
    })
})

app.get('/register', (req, res) => {
    daoF.readAll((err, facultades) => {
        if(err)
            return res.status(500).json({message: err.message})

        res.render('register', { facultades });
    })
})

app.post('/register', async (req, res) => {
    const user = req.body;

    daoU.readUsuario(user.correo, async (err, usuario) => {
        if(err)
            return res.status(500).json({ message: `ERROR: Error al leer el usuario: ${user.nombre}` });

        if(usuario.existe)
            return res.status(400).json({ message: `ERROR: El usuario con el nombre: ${user.nombre} y correo: ${user.correo} ya existe`})

        try {
            const hashPassword = await bcrypt.hash(user.contrasena, 10)
            user.contrasena = hashPassword

            daoU.addUsuario(user, (error) => {
                if (error)
                    return res.status(500).json({ message: `ERROR: Error al crear el usuario: ${user.nombre}` }) 
                
                res.redirect('/login')
                
            });
        } catch (error) {
            return res.status(500).json({ message: `ERROR: Error al encriptar la contraseña para el usuario: ${user.nombre}` })
        }
    })
})

//  EJECUTAMOS EL SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor ejecutando en el puerto http://localhost:${PORT}`)
})
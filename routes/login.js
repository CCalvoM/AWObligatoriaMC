// RECURSOS
const mysql = require('mysql')
const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()

// FICHEROS
const {config} = require('../config')
const DAOUsuario = require('../DAOs/DAOUsuario')
const {validateLogIn} = require('../middlewares/validation')

// CREANDO POOL DE CONEXIÓN A BBDD 
const pool = mysql.createPool(config)

// INSTANCIAMOS DAOs
const daoU = new DAOUsuario(pool)

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/', validateLogIn, async (req, res) => {
    const user = req.body;

    daoU.readUsuario(user.correo, async (err, result) => {
        if(err)
            return res.status(500).json({ message: `ERROR: Error al leer el usuario con correo: ${user.correo}`})

        if(!result.existe)
            return res.status(400).json({ message: `ERROR: Usuario: ${user.correo} no existe en la BBDD. Registrate`})

        const usuario = result.usuario

        const match = await bcrypt.compare(user.password, usuario.contrasena)
        if(!match)
            return res.status(401).json({ message: `ERROR: Contraseña Incorrecta`})

        //Guardar Sesion + Datos en la sesión
        req.session.user = usuario.correo
        console.log('se deberia haber guardado correctamente la sesion')
        // Contraseña correcta
        if(usuario.user == 'asistente') { 
            console.log('es un asistente y entra aqui)')
            res.redirect('/userAsistente')}
        else
            res.redirect('/userOrganizador')
        })
})

module.exports = router
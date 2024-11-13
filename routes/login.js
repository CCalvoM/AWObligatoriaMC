// RECURSOS
const mysql = require('mysql')
const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()

// FICHEROS
const {config} = require('../config')
const DAOUsuario = require('../DAOs/DAOUsuario')

// CREANDO POOL DE CONEXIÓN A BBDD 
const pool = mysql.createPool(config)

// INSTANCIAMOS DAOs
const daoU = new DAOUsuario(pool)

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/', async (req, res) => {
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

module.exports = router
// RECURSOS
const mysql = require('mysql')
const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()

// FICHEROS
const {config} = require('../config')
const DAOFacultad = require('../DAOs/DAOFacultad')
const DAOUsuario = require('../DAOs/DAOUsuario')

// CREANDO POOL DE CONEXIÓN A BBDD 
const pool = mysql.createPool(config)

// INSTANCIAMOS DAOs
const daoU = new DAOUsuario(pool)
const daoF = new DAOFacultad(pool)

router.get('/', (req, res) => {
    daoF.readAll((err, facultades) => {
        if(err)
            return res.status(500).json({message: err.message})

        res.render('register', { facultades });
    })
})

router.post('/', async (req, res) => {
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

module.exports = router
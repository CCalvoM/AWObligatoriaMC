class DAOUsuario {
    constructor(pool) { this.pool = pool };

    // TODO : COntraseña encryptada en BBDD
    addUsuario(user, callback) { // Tras registro: creamos un User ¿No se debe poder repetir nombre en la BBDD? : Lógica de Negocio?
        // Creamos Conexión con BBDD
        this.pool.getConnection((err, connection) => {
            if(err)
                callback(new Error("ERROR : Error conectando a la base de datos"))
            else {
                const query = 'INSERT INTO usuarios (id, nombre, telefono, correo, rol, id_facultad, username, contrasena) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
                connection.query(query, [user.id, user.nombre, user.telefono, user.correo, user.rol, user.id_facultad, user.username, user.contrasena],
                    (error, res) => {
                        connection.release()

                        if(error)
                            callback(new Error("ERROR : Error dando de alta usuario en la BBDD"))
                        else
                            callback(null)
                    }
                )
            }
        })
    }

    readUsuario(correo, callback) { // Durante registro: Comprobamos user (correo) != BBDD && Durante Login: Comprobamos user != 0
        // Creamos Conexión con la BBDD
        this.pool.getConnection((err, connection) => {
            if(err)
                callback(new Error("ERROR: Error conectando a la base de datos"))
            else {
                const query = 'SELECT * FROM usuarios WHERE correo = ?'
                connection.query(query, [correo], 
                    (error, res) => {
                        connection.release()

                        if(error)
                            callback(new Error(`ERROR: Error leyendo el usuario con correo: ${correo}`))

                        else if (res.length === 0)
                            callback(null, { existe:false, message: `No se encontró un usuario con el correo: ${correo}` })
                        
                        else {
                            const usuario = res[0]
                            callback(null, {existe:true, usuario})
                        }     
                })
            }
        })
    }
}

module.exports = DAOUsuario;
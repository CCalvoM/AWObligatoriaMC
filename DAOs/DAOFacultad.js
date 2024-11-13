class DAOFacultad {
    constructor(pool) { this.pool = pool }

    readAll(callback) {
        this.pool.getConnection((err, connection) => {
            if(err) 
                return callback(new Error("ERROR: Error conectando con la base de datos"))

            const query = 'SELECT * FROM facultades'
            connection.query(query, (error, res) => {
                connection.release()

                if(error)
                    return callback(new Error('ERROR: Error al buscar todas las facultades'))
                
                if(res.length === 0)
                    return callback(new Error('ERROR: No existen facultades que leer en la base de datos'))

                let facultades = []
                res.forEach(facultad => {
                    let id = facultad.id;
                    let nombre = facultad.nombre;

                    facultades.push({id, nombre})
                })
                return callback(null, facultades)
            })
        })
    }
}

module.exports = DAOFacultad;
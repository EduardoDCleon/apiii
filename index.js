const express = require('express')
const mysql =  require('mysql')
const bodyParser = require('body-parser')

const app = express()

app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    next()
})

app.use(bodyParser.json())

const PUERTO = 3000

const conexion = mysql.createConnection(
    {
        host: 'localhost',
        database: 'alupratic',
        user: 'root',
        password:''
    }
)

app.listen(PUERTO, () =>{
    console.log(`Servidor corriendo en el puerto: ${PUERTO}`)
})

conexion.connect(error =>{
    if(error) throw error
    console.log('Conexion exitosa a la base de datos');
})

app.get('/', (req, res) =>{
    res.send('API')
})

app.get('/empleados', (req, res) => {
    const query = 'SELECT * FROM empleados'
    conexion.query(query, (error, resultado)=>{
        if(error) return console.error(error.message)

        if (resultado.lenght > 0){
            res.json(resultado)
        }else {
            res.json(`No hay registros`)
        }
    })
})

app.get('/empleados/:id', (req, res) => {
    const { id } = req.params
    const query = `SELECT * FROM empleados WHERE id_empleado=${id}`
    conexion.query(query,(error, resultado) => {
        if(error) return console.error(error.message)
        if (resultado.lenght > 0){
            res.json(resultado)
        }else {
            res.json(`No hay registros con ese id`)
        }
    })
})


app.post('/empleados/agregar', (req, res) => {
    const empleado = {
        nombre: req.body.nombre,
        puesto: req.body.puesto
    } 

    const query = `INSERT INTO empleados SET ?`
    conexion.query(query, empleado, (error, resultado) => {
        if(error) return console.error(error.message)

        res.json(`Se inserto correctamente el empleado`)
    })
})


app.put('/empleados/actualizar/:id', (req, res) => {
    const { id } = req.params
    const { nombre, puesto } = req.body

    const query = `UPDATE empleados SET nombre='${nombre}', puesto='${puesto}' WHERE id_empleado='${id}'`
    conexion.query(query, (error, resultado) => {
        if(error) return console.error(error.message)
    })
})

app.delete('/empleados/borrar/:id', (req, res) => {
    const { id } = req.params

    const query = `DELETE FROM empleados WHERE id_empleado=${id}`
    conexion.query(query, (error, resultado) => {
        if(error) return console.error(error, message)

        res.json(`Se elimino correctamente el empleado`)
    })
})
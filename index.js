const express = require('express')
const handlebars = require("express-handlebars")
const { Server: HTTPServer } = require('http')
const { Server: SocketServer } = require('socket.io')
const Contenedor = require('./archivos')

//! SERVER
const app = express()
const PORT = process.env.PORT || 8081

const httpServer = new HTTPServer(app)
const io = new SocketServer(httpServer)

//! MIDDLEWARES
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//! HANDLEBARS FRONTEND
app.engine('hbs', handlebars.engine({
        extname: "hbs",
        layoutsDir: __dirname + "/views/layouts",
        partialsDir: __dirname + '/views/partials/',
        defaultLayout: "index"
}))
    
app.set('view engine', 'hbs')
app.set('views', './views')
    
app.use(express.static('views'))

const productos = [
    {
        title: "The Hobbit",
        price: "45.25",
        thumbnail: "https://cdn2.iconfinder.com/data/icons/artificial-intelligence-6/64/ArtificialIntelligence25-256.png",
        id: 1
    }
]

const dbMensajes = new Contenedor('./db/mensajes.json')

app.get('/', (req, res) => {
    res.render('main', {
        docTitle: "Desafio"
    })
})

io.on('connection', async socket => {
    //! CONECTADO
    console.log(`conectado: ${socket.id}`)

    //! ENVIA PRODUCTOS Y MENSAJES DE LA DB
    socket.emit('productos', productos)
    try {
        let allMensajes = await dbMensajes.getAll()
        console.log(allMensajes)
        socket.emit('mensajes', allMensajes)
    } catch (err) {
        console.log(`Error get all messages from db: ${err.message}`)
    }

    //! RECIBE NUEVO PRODUCTO Y ENVIA A TODOS LOS SOCKETS
    socket.on('nuevo_producto', data => {
        const { title, price, thumbnail } = data
        productos.push({ title, price, thumbnail, id: productos.length + 1 })
        io.sockets.emit('productos', productos)
    })

    //! RECIBE NUEVO MENSAJE Y ENVIA A TODOS LOS SOCKETS
    socket.on('nuevo_mensaje',  async msg => {
        try {

            //* NODEMON SE REINICIA PORQE SE MODIFICA UN ARCHIVO (mensajes.json)
            const { correo, mensaje, hora } = msg
            await dbMensajes.save({ correo, mensaje, hora})

            let allMensajes = await dbMensajes.getAll()
            console.log(allMensajes)
            io.sockets.emit('mensajes', allMensajes)

        } catch (err) {
            console.log(`Error get all messages from db: ${err.message}`)
        }
    })
})














const server = httpServer.listen(PORT, () => {
    console.log(`Server express, Websockets y handlebars iniciado - PORT: ${PORT}`)
})


server.on('error', error => {
    console.log(error.message)
})



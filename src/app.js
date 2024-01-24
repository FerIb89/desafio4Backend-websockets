
const express = require('express')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')
const app = express()
const cors = require('cors')
const {sockets} = require('./sockets.js')

const { cartsRouter } = require('./routes/cartsRouter.js')
const { productsRouter } = require('./routes/productsRouter.js')

const { gestionProd } = require('./fileSystem/ProductManager.js')

let products = []
const fetchProducts = async () => {
    try {
        products = await gestionProd.getProducts()
    } catch (error) {
        console.error('Error ❌: no se encontro el producto')
        throw new Error(error)
    }
}
fetchProducts()

const PORT = process.env.PORT || 8080;
const httpServer = app.listen(PORT, () => console.log(`Escuchando el puerto ${PORT} 🛸 `))

const socketServer = new Server(httpServer)


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))


app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.get('/', async (req, res) => {
    res.status(200).render('home', { products: products })
})

app.get('/realtimeproducts', async (req, res) => {
    const products = await gestionProd.getProducts()
    res.status(200).render('realtimeproducts', { products: products })
})

// socketServer.on("connection", (socket)=> {
//   console.log("USUARIO CONECTADO")
//})
sockets(socketServer)
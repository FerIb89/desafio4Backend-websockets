
const { gestionProd } = require('./fileSystem/ProductManager')

const sockets = (socketServer) => {
    let addedProducts = []

    socketServer.on('connection', async (socket) => {
        console.log("Usuario conectado 💻");


        socket.on('productReceived', async (data) => {
            await gestionProd.addProduct(data)
            addedProducts.push(data)
            socketServer.emit('addedProducts', addedProducts)
        })

        socket.on('productDelete', async (data) => {
            const products = await gestionProd.getProducts()
            const productDelete = products.find(p => p.code === data)
            if (!Boolean(productDelete)) {
                console.error('Error ❌: no se encontro el producto')
                return
            }
            await gestionProd.deleteProduct(productDelete.id)
        })
        socket.on("disconnect", () => {
            console.log("Usuario desconectado 👋")
        })

    })
}

module.exports = {
    sockets
}
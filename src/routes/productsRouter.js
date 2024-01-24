
const express = require('express')
const productsRouter = express.Router()
const { gestionProd } = require('../fileSystem/ProductManager')


productsRouter.get('/', async (req, res) => {
    const products = await gestionProd.getProducts()
    const limit = req.query.limit
    let respuesta = products;

    if (limit && !isNaN(Number(limit))) {
        respuesta = products.slice(0, limit)
    }
    res.status(200).send(respuesta)
});


productsRouter.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const product = await gestionProd.getProductById(Number(pid))
    res.status(200).send(product)
});

productsRouter.post('/', async (req, res) => {
    const products = await gestionProd.getProducts()

    const product = {
        id: 1,
        title: req.body.title,
        description: req.body.description,
        code: String(req.body.code),
        price: Number(req.body.price),
        status: true,
        stock: Number(req.body.stock),
        category: req.body.category,
        thumbnail: [req.body.thumbnail],
    }

    await gestionProd.addProduct(product)
    res.status(200).send('producto agregado con exito ✅')
});

productsRouter.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const productUpdated = {
        title: req.body.title,
        description: req.body.description,
        code: String(req.body.code),
        price: Number(req.body.price),
        status: true,
        stock: Number(req.body.stock),
        category: req.body.category,
        thumbnail: [req.body.thumbnail] 
    }
    gestionProd.updateFile(Number(pid), productUpdated)

    res.status(200).send('producto actualizado correctamente 🔼')
})

productsRouter.delete('/:pid', (req, res) => {
    const { pid } = req.params
    gestionProd.deleteProduct(Number(pid))
    res.status(200).send('producto eliminado 💥')

})

module.exports = {
    productsRouter,
}
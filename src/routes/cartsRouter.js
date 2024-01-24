
const express = require('express')
const cartsRouter = express.Router()

const { gestionCart } = require('../fileSystem/CartManager');
const { gestionProd } = require('../fileSystem/ProductManager');


cartsRouter.post('/', (req, res) => {
     
    const cart = {
        products: []
    }
    gestionCart.addCart(cart)
    res.status(200).send('cart created')
});

cartsRouter.get('/:cid', async (req, res) => {
    const cid = req.params.cid
      
    const carts = await gestionCart.getCarts()
    let cart = carts.find((c) => c.id === Number(cid))
    if (cart) {
        res.status(200).send(cart.products)
    }
    console.error('Error ❌: No se encontro el caarito con ese cid')
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
          
    let cart = await gestionCart.getCartById(Number(cid))
    let product = await gestionProd.getProductById(Number(pid))

    const productAdd = {
        id: product.id,
        quantity: 1
    }

    gestionCart.addToCart(cart, productAdd)
   
    res.status(200).send('producto agregado al carrito 🛒')
});


module.exports = {
    cartsRouter,
}

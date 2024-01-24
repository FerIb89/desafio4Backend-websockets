
const fsPromises = require('fs').promises

class ProductManager {

    async #readFileProducts() {

        try {
            const content = await fsPromises.readFile('DB/products.json', 'utf-8')
            const contentParse = JSON.parse(content);
            return contentParse
        } catch (error) {
            console.error('Error: no se logro leer el archivo ❌')
            throw new Error(error)
        }
    }
    async getProducts() {
        const fileContent = await this.#readFileProducts()
        try {
            if (fileContent.length === 0) console.log('no se encontraron productos en el archivo 🔎')
            return fileContent
        } catch (error) {
            console.error('Error ❌: no se encontraron productos en el archivo 🔎')
            throw new Error(error)
        }
    }
    async writeFileProducts(data) {
        try {
            await fsPromises.writeFile('DB/products.json', JSON.stringify(data))
            console.log('productos escritos con exito✅')
        } catch (error) {
            throw new Error(error)
        }
    }
    async addProduct(product) {
        const fileContent = await this.#readFileProducts()
        let codeUsed = fileContent.some(item => item.code === product.code)

        const idGenerator = () => {
            let id = 1
            const lastProduct = fileContent[fileContent.length - 1]
            if (lastProduct) { id = lastProduct.id + 1 }
            return id
        }

        try {

            if (product.title && product.description && product.price && product.thumbnail && product.code && product.stock && !codeUsed) {
                fileContent.push({
                    id: idGenerator(),
                    ...product
                })
                console.log(`Producto ${product.title} agregado`)
                await this.writeFileProducts(fileContent)

            } else {
                console.error(`Error: Codigo repetido. El codigo ${product.code} ya esta en uso 📢`)
            }
        } catch (error) {
            console.error('Error ❌: No se pudo agregar el producto')
            throw new Error(error)
        }

    }
    async getProductById(id) {
        const fileContent = await this.#readFileProducts()

        let productFound = fileContent.find(prod => prod.id === id)
        try {
            if (productFound) {
                console.log(`producto con id: ${id} encontrado 🌝 `)
                return productFound
            } else {
                console.error(`Error ❌: No se encontro el producto con id ${id}`)
            }
        } catch (error) {
            console.error(`Error ❌: No se encontro el producto con id ${id}`)
            throw new Error(error)
        }
    }
    async deleteProduct(id) {
        let fileContent = await this.#readFileProducts()
        let productFound = fileContent.find((product) => product.id === id)
        if (!productFound) {
            console.log(`Error ❌: No se encontro el producto con id ${id}`)
            return
        }
        try {
            let newProductList = fileContent.filter((product) => product.id !== id);
            await this.writeFileProducts(newProductList)
            console.log(`producto con el Id ${id} se ha eliminado con exito ✅`)
        } catch (error) {
            console.error(`Error ❌: no se ha podido eliminar el producto con id ${id}`)
            throw new Error(error)
        }
    }
    async updateFile(id, obj) {
        const fileContent = await this.#readFileProducts()
        try {
            let productFoundIndex = fileContent.findIndex((p) => p.id === id)
            fileContent[productFoundIndex] = { id: id, ...obj }
            this.writeFileProducts(fileContent)
            console.log('product updated')
        } catch (error) {
            console.error(`Error ❌: producto con el ${id} no ha sido actualizado`)
            throw new Error(error)
        }
    }
}

const gestionProd = new ProductManager()

module.exports = {
    gestionProd
}
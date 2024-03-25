const fs = require('fs/promises')

class ProductManager {
    constructor(path){
        this.path = path;
        this.products;
    }

    async getProducts(){
        try {
            const dataJSON = await fs.readFile(this.path, "utf-8");
            return JSON.parse(dataJSON);
          } catch (error) {
            return [];
          }
    }

    async addProduct(title, description, price, thumbnail, stock){
        const product = {
            id: await this.generateId(),
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: this.getRandomCode(9),
            stock: stock
        };
        try {
            let products = await this.getProducts();
            if (products.some(existingProduct => existingProduct.id === product.id)) {
                console.log('Ya existe un producto con el mismo ID. No se puede agregar.');
                return;
            }
            products.push(product);
            const productJSON = JSON.stringify(products, null, '\t');
            await fs.writeFile(this.path, productJSON, 'utf-8');
            console.log('Se agregó el nuevo producto:', product);
        } catch (error) {
            console.error(error);
        }
    }

    async generateId(){
        this.products = await this.getProducts();
        try {
            if(this.products.length === 0){
                return 1
            } else {
                return this.products.at(-1).id + 1
            }
        } catch (error) {
            console.error(error)
        }
    }

    getRandomCode(length){
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    
        return result;
    }

    async getProductById(productID) {
        try {
            this.products = await this.getProducts();
            const productFound = this.products.find(product => product.id === productID)
            if(productFound){
                return console.log(productFound)
            } else {
                console.log('No existe un producto con ese id')
            }
        } catch (error) {
            console.error(error)
        }

    }

    async updateProduct(productId, updates) {
        try {
            let products = await this.getProducts();
            const productIndex = products.findIndex(product => product.id === productId);
            if (productIndex !== -1) {
                if (updates.id && updates.id !== productId) {
                    console.log("No se puede cambiar el ID del producto.");
                    return;
                }
                products[productIndex] = { ...products[productIndex], ...updates };
                const productJSON = JSON.stringify(products, null, '\t');
                await fs.writeFile(this.path, productJSON, 'utf-8');
                console.log("Producto actualizado correctamente.");
            } else {
                console.log("Producto no encontrado.");
            }
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    }

    async deleteProduct(productID){
        try {
            let products = await this.getProducts();
            const productIndex = products.findIndex(product => product.id === productID);
            if (productIndex !== -1){
                products.splice(productIndex, 1)
                const productsJSON = JSON.stringify(products, null, '\t')
                await fs.writeFile(this.path, productsJSON, 'utf-8')
            } else {
                console.log('El producto con ese ID no existe')
            }
        } catch (error) {
            console.error(error)
        }
    }
}

(async () => {
    let pm = new ProductManager('./data.json');
    // await pm.addProduct('Zapatos', 'Devestir', 12000, '/imagenes', 20)
    // await pm.getProductById(1);
    // await pm.updateProduct(1, {title2:'popo'})
    await pm.deleteProduct(1)
})()
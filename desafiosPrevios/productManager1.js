class ProductManager {

    constructor() {
        this.products = [];
    }

    getProducts() {
        return this.products
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        let exists = (this.products.findIndex(product => product.code === code) !== -1);
        let noEmpty = !(title && description && price && thumbnail && code && stock);
        if (exists || noEmpty) {
            console.log(`Producto no añadido`);
        } else {
            let id = this.products.length + 1;
            let newProduct ={
                
                title:title,
                description:description,
                price:price,
                thumbnail:thumbnail,
                code:code,
                stock:stock,
                id:id
            }
            this.products.push(newProduct);
            console.log(`Product ${title} added with ID ${id}`);
        }

    }
    getProductById(id) {
        let idProduct = this.products.findIndex(product => product.id === id);
        if (idProduct === -1) {
            console.log('No se encontró');
        } else {
            return this.products[idProduct]
        }
    }
}

let pm = new ProductManager;
console.log(pm.getProducts());
pm.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)
console.log(pm.getProducts());
pm.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "dce123", 25)
console.log(pm.getProducts());
pm.getProductById(2)

console.log(pm.getProductById(2));
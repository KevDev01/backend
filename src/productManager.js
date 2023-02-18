import fs from "fs";

export default class ProductManager  {

    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        if (fs.existsSync(this.path)) {
            let data = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } else {
            return [];
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        let products = await this.getProducts();
        let exists = products.findIndex((product) => product.code === code) !== -1;
        let noEmpty = !(title && description && price && thumbnail && code && stock);
        if (exists || noEmpty) {
          console.log("Producto no añadido");
        } else {
          let id = products.length + 1;
          let newProduct ={   
            title:title,
            description:description,
            price:price,
            thumbnail:thumbnail,
            code:code,
            stock:stock,
            id:id
        }
          products.push(newProduct);
          await fs.promises.writeFile(this.path, JSON.stringify(products,null,2));
          console.log(`Producto añadido con el ID: ${id}`);
        }
      }

      async getProductById(id) {
        let products = await this.getProducts();
        let idProduct = products.findIndex((product) => product.id === id);
        let exists = idProduct !== -1;
        if (exists) {
          return products[idProduct];
        } else {
          console.log("Producto no encontrado");
        }
      }

      async updateProduct(id, title, description, price, thumbnail, code, stock) {
        let products = await this.getProducts();
        let idProduct = products.findIndex((product) => product.id === id);
        let exists = idProduct !== -1;
        if (exists) {
          products[idProduct].title = title;
          products[idProduct].description = description;
          products[idProduct].price = price;
          products[idProduct].thumbnail = thumbnail;
          products[idProduct].code = code;
          products[idProduct].stock = stock;
          await fs.promises.writeFile(this.path, JSON.stringify(products,null,2));
          console.log(`El producto ${title} se ha actualizado`);
        } else {
          console.log("Producto no encontrado");
        }
      }

      async deleteProduct(id) {
        let products = await this.getProducts();
        let idProduct = products.findIndex((product) => product.id === id);
        let exists = idProduct !== -1;
        if (exists) {
          products[idProduct] = {};
          await fs.promises.writeFile(this.path, JSON.stringify(products,null,2));
          console.log(`El producto con el ${id} ha sido eliminado`);
        } else {
          console.log("Producto no encontrado");
        }
      }

}

/* let pm = new ProductManager("./files/products.json"); */
/* pm.getProducts().then(products => console.log(products)); */
/* pm.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
pm.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "dce125", 10);
pm.getProducts().then(products => console.log(products));
pm.getProductById(1).then(product => console.log(product));
pm.updateProduct(1, "modificacion", "Producto modificado", 300, "Imagen mod", "xyz123", 15);
pm.deleteProduct(2); */

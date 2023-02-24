import fs from "fs";
import { v4 as createID } from "uuid";

class Product {
  constructor(id, title, description, code, price, status = true, stock, category, thumbnails) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.code = code;
    this.price = price;
    this.status = status;
    this.stock = stock;
    this.category = category;
    this.thumbnails = thumbnails;
  }
}

export default class ProductManager {

  constructor(path) {
    this.path = path;
  }

  async getProducts(limit) {
    let fileExists = fs.existsSync(this.path);
    if (fileExists) {
      let data = await fs.promises.readFile(this.path, "utf-8");
      let products = JSON.parse(data);
      return products.slice(0, limit);
    } else {
      return [];
    }
  }

  async addProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let products = await this.getProducts();
    let exists = products.findIndex((product) => product.code === code) !== -1;
    let noEmpty = !(title && description && code && price && stock && category);
    if (exists || noEmpty) {
      res.status(400).json({
        error: `Producto no añadido. Errors:${exists ? " El producto ya existe" : ""}${noEmpty ? " Se deben completar todos los campos " : ""
          }`,
      });
    } else {
      price = Number(price);
      stock = Number(stock);
      status === "false" ? (status = false) : (status = true);
      let id = createID();
      let newProduct = new Product(id, title, description, code, price, status, stock, category, thumbnails);
      products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      res.status(201).json({ message: `Producto añadido` });
    }
  }

  async getProductById(req, res) {
    res.setHeader("Content-Type", "application/json");
    let products = await this.getProducts();
    let product = products.find((product) => product.id === req.params.pid);
    if (product) {
      res.status(200).json({ product });
    } else {
      res.status(400).json({ error: "Producto no encontrado" });
    }
  }

  async updateProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let id = req.params.pid;
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    let products = await this.getProducts();
    let IDIndex = products.findIndex((product) => product.id === id);
    let exists = IDIndex !== -1;
    if (exists) {
      let indexByCode = products.findIndex((product) => product.code === code);
      let codeExists = indexByCode !== IDIndex && indexByCode !== -1;
      if (codeExists) {
        res.status(400).json({ error: "El código ya existe" });
      } else {
        price = Number(price);
        stock = Number(stock);
        status === "false" && (products[IDIndex].status = false);
        status === "true" && (products[IDIndex].status = true);
        title && (products[IDIndex].title = title);
        description && (products[IDIndex].description = description);
        code && (products[IDIndex].code = code);
        price && (products[IDIndex].price = price);
        stock && (products[IDIndex].stock = stock);
        category && (products[IDIndex].category = category);
        thumbnails && (products[IDIndex].thumbnails = thumbnails);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        res.status(201).json({ message: "Producto actualizado" });
      }
    } else {
      res.status(400).json({ error: "Producto no encontrado" });
    }
  }

  async deleteProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let id = await req.params.pid;
    let products = await this.getProducts();
    let index = products.findIndex((product) => product.id === id);
    let exists = index !== -1;
    if (exists) {
      products.splice(index, 1);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      res.status(201).json({ message: "Producto eliminado" });
    } else {
      res.status(400).json({ error: "Producto no encontrado" });
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

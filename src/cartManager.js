import fs from "fs";
import { v4 as createID } from "uuid";

class Cart {
  constructor(id, alias, products = []) {
    this.id = id;
    this.alias = alias;
    this.products = products;
  }
}

class CartItem {
  constructor(productId, quantity = 1) {
    this.product = productId;
    this.quantity = quantity;
  }
}

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    let exists = fs.existsSync(this.path);
    if (exists) {
      let data = await fs.promises.readFile(this.path, "utf-8");
      let carts = JSON.parse(data);
      return carts;
    }else{
      return [];
    }
  }

  async addCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    let carts = await this.getCarts();
    let newCart = new Cart(createID(), req.query.alias);
    carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    res.status(201).json({message: "Carrito creado"});
  }

  async getCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    let carts = await this.getCarts();
    let cart = carts.find((cart) => cart.id === req.params.cid);
    if (cart) {
      res.status(200).json({ cart });
    }else{
      res.status(400).json({error:"Carrito no encontrado"});
    }
  }

  async addProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let carts = await this.getCarts();
    let index = carts.findIndex((cart) => cart.id === req.params.cid);
    let exists = index !== -1;
    if (exists) {
      let prodIndex = carts[index].products.findIndex((item) => item.product === req.params.pid);
      let productExists = prodIndex !== -1;
      if (productExists) {
        carts[index].products[prodIndex].quantity++;
      } else {
        let cartItem = new CartItem(req.params.pid);
        carts[index].products.push(cartItem);
      }
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      res.status(201).json({message: "Producto añadido"});
    } else {
      res.status(400).json({error: "Carrito no encontrado"});
    }
  }
}
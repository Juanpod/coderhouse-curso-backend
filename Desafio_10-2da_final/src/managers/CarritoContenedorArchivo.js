const fs = require('fs');
const path = require('path');

class Carrito {
    constructor(nameFile){
        this.nameFile = path.join(__dirname,"..",`files/${nameFile}`);
        console.log(this.nameFile);
    }
    async crearCarrito(){
        try {
            if(fs.existsSync(this.nameFile)){
                let data = await fs.promises.readFile(this.nameFile, "utf-8");
                const jsondata = JSON.parse(data);
                let id;
                if(jsondata.length == 0){
                    id = 1;
                } else {
                    id = jsondata[jsondata.length-1].id + 1;
                }
                const newCart = {};
                newCart["id"] = id;
                newCart["timestamp"] = Date.now();
                newCart["productos"] = [];
                await jsondata.push(newCart);
                await fs.promises.writeFile(this.nameFile, JSON.stringify(jsondata, null, 2));
                console.log("Carrito creado con exito")
                return id;
            }
        } catch {
            console.log("No se pudo crear el carrito")
        }
    }
    async borrarCarrito(id){
        try {
                let data = await fs.promises.readFile(this.nameFile, "utf-8");
            const jsondata = JSON.parse(data);
            let exist = false;
            for (const producto in jsondata){
                if (jsondata[producto].id == id){
                    exist = true
                    jsondata.splice(producto,1)
                    await fs.promises.writeFile(this.nameFile,JSON.stringify(jsondata,null,2));
                    console.log(`Carrito con el id ${id} borrado con exito`)
                }
            }
            if(!exist){
                console.log("No se encontró el producto");
                return false;
            } else {
                return true;
            }
        } catch {
            onsole.log("No se pudo buscar el carrito", error)
        }
        
    }

    async getById(id) {
        try {
            let data = await fs.promises.readFile(this.nameFile, "utf-8");
            const jsondata = JSON.parse(data);
            let exist = false
            for (const carrito in jsondata){
                if (jsondata[carrito].id == id){
                    exist = true
                    const cart = jsondata[carrito];
                    return cart.productos;
                }
            }
            if(!exist){
                console.log("No se encontró el carrito")
                return false
            }
        } catch {
            Console.log("No se pudo buscar el carrito", error)
        }
    }
    async addProduct(id, product) {
        try {
            let data = await fs.promises.readFile(this.nameFile, "utf-8");
            const carritos = JSON.parse(data);
            const index = carritos.findIndex(elm=>elm.id === id);
            if(index == -1){
                console.log("No se encuentra el carrito")
                return false
            } else {
                const cart = carritos[index];
                cart.productos.push(product);
                carritos[index] = cart;
                await fs.promises.writeFile(this.nameFile, JSON.stringify(carritos,null,2));
                console.log("Producto agregado")
            }
        } catch {
            console.log("No se pudo agregar el producto al carrito");
        }
    }
    async deleteProduct(id, idProduct) {
        try {
            let data = await fs.promises.readFile(this.nameFile, "utf-8");
            const carritos = JSON.parse(data);
            const index = carritos.findIndex(elm=>elm.id === id);
            if(index == -1){
                console.log("No se encuentra el carrito")
                return false
            } else {
                const cart = carritos[index];
                const productos =cart.productos
                const index2 = productos.findIndex(elm=>elm.id === idProduct);
                productos.splice(index2,1);
                carritos[index] = cart;
                await fs.promises.writeFile(this.nameFile, JSON.stringify(carritos,null,2));
            }
        } catch {
            console.log("No se pudo agregar el producto al carrito");
        }
    }
}

module.exports = {Carrito}
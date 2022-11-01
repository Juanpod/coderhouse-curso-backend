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
                    const producto = jsondata[carrito];
                    return producto.productos;
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
}

module.exports = {Carrito}
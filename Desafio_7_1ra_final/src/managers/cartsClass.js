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
}

module.exports = {Carrito}
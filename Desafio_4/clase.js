const fs = require('fs');
class Contenedor{
    constructor(archivo){
        this.archivo = archivo;
    }
    async save(Object){
       // Recibe un objeto, lo guarda en el archivo, devuelve el id asignado
       try {
            try{
                //Si no existe el archivo productos.txt encuentra un error y lo crea
                let data = await fs.promises.readFile(`${this.archivo}.txt`, "utf-8"); 
                let jsondata = JSON.parse(data);
                if(typeof(jsondata) != typeof([])){
                    throw new Error
                }
            }
            catch{
                await fs.promises.writeFile(`${this.archivo}.txt`,JSON.stringify([],null,2));
            }
            let data = await fs.promises.readFile(`${this.archivo}.txt`, "utf-8");
            if (data ==""){
                try{
                    await fs.promises.writeFile(`${this.archivo}.txt`,JSON.stringify([],null,2));
                    data = await fs.promises.readFile(`${this.archivo}.txt`, "utf-8")
                }
                catch(error){
                    console.log(error);
                }
            }
            const jsondata = JSON.parse(data);
            //Asignandole un numero de id tomando en cuenta el id anterior
            let id;
            if(jsondata.length == 0){
                id = 1;
            } else {
                id = jsondata[jsondata.length-1].id + 1;
            }
            Object["id"] = id;
            //Agregando el objeto al arreglo existente
            await jsondata.push(Object)
            await fs.promises.writeFile(`${this.archivo}.txt`,JSON.stringify(jsondata,null,2));
            console.log(`Producto guardado, con el numero de id ${id}`)
            }
            
       catch(error){
        console.log("No se pudo agregar el producto")
       }
    }
    async updateById(id, body){
        try {
            const productos = await this.getAll();
            const index = productos.findIndex(elm=>elm.id === id);
            if(index == -1){
                console.log("No se encuentra el id")
                return null
            }
            productos[index] = {
                ...body,
                id:id
            };
            await fs.promises.writeFile(`${this.archivo}.txt`,JSON.stringify(productos,null,2));
            return productos;
        } catch (error) {
            console.log("No se puede actualizar el producto")
        }
    }
    async getById(id){
        //Recibe un id y devuelve el objeto con ese id, o null si no está
        try{
            //Leyendo el contenido actual del archivo
            let data = await fs.promises.readFile(`${this.archivo}.txt`, "utf-8"); 
            // Convirtiendo el texto en un objeto de javascript
            const jsondata = JSON.parse(data); 
            let exist = false
            for (const producto in jsondata){
                if (jsondata[producto].id == id){
                    exist = true
                    return jsondata[producto]
                }
            }
            if(!exist){
                console.log("No se encontró el producto")
                return null
            }
        }
        catch(error){
            console.log("No se pudo buscar el producto", error)
        }
    }
    async getAll(){
        //Devuelve un array con los objetos presentes en el archivo
        try {
            let data = await fs.promises.readFile(`${this.archivo}.txt`, "utf-8");
            let productos = JSON.parse(data);
            return productos;
        }
        catch (error) {
            console.log("Error de lectura",error);
        }
    }
    async deleteById(id){
        //Elimina del archivo el objeto con id buscado
        try{
            //Leyendo el contenido actual del archivo
            let data = await fs.promises.readFile(`${this.archivo}.txt`, "utf-8"); 
            // Convirtiendo el texto en un objeto de javascript
            const jsondata = JSON.parse(data); 
            let exist = false
            for (const producto in jsondata){
                if (jsondata[producto].id == id){
                    exist = true
                    jsondata.splice(producto,1)
                    await fs.promises.writeFile(`${this.archivo}.txt`,JSON.stringify(jsondata,null,2));
                    console.log(`Producto con el id ${id} borrado con exito`)
                }
            }
            if(!exist){
                console.log("No se encontró el producto")
                return null
            }
        }
        catch(error){
            console.log("No se pudo borrar", error);
        }
    }
    async deleteAll(){
        //Elimina todos los objetos presentes en el archivo
        try{
            //Leyendo el contenido actual del archivo
            let data = await fs.promises.readFile(`${this.archivo}.txt`, "utf-8"); 
            // Convirtiendo el texto en un objeto de javascript
            const jsondata = JSON.parse(data); 
            //El metodo splice permite eliminar los objetos
            jsondata.splice(0,jsondata.length)
            await fs.promises.writeFile(`${this.archivo}.txt`,JSON.stringify(jsondata,null,2));
            console.log("Todos los productos fueron borrados")
            // Otra forma de borrar todo es sobrescribiendo el archivo con un array vacio []
            //
            // await fs.promises.writeFile(`${this.archivo}.txt`,JSON.stringify([],null,2));
            // console.log("Objetos borrados");
        }
        catch(error){
            console.log(error);
        }
    }

}
module.exports = {Contenedor}
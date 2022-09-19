// const { Console } = require('console');
const fs = require('fs');
//const { json } = require('stream/consumers');

class Contenedor{
    constructor(archivo){
        this.archivo = archivo;
    }
    async save(Object){
       // Recibe un objeto, lo guarda en el archivo, devuelve el id asignado
       try {
            try{
                await fs.promises.readFile(`${this.archivo}.txt`, "utf-8"); //Si no existe el archivo productos.txt encuentra un error y lo crea
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
            const jsondata = JSON.parse(data); // Convirtiendo el texto en un objeto de javascript
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
    async getById(id){
        //Recibe un id y devuelve el objeto con ese id, o null si no está
        try{
            let data = await fs.promises.readFile(`${this.archivo}.txt`, "utf-8"); //Leyendo el contenido actual del archivo
            const jsondata = JSON.parse(data); // Convirtiendo el texto en un objeto de javascript
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
            return JSON.parse(data);
        }
        catch (error) {
            console.log("Error de lectura",error);
        }
    }
    async deleteById(id){
        //Elimina del archivo el objeto con id buscado
        try{
            let data = await fs.promises.readFile(`${this.archivo}.txt`, "utf-8"); //Leyendo el contenido actual del archivo
            const jsondata = JSON.parse(data); // Convirtiendo el texto en un objeto de javascript
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
            
            let data = await fs.promises.readFile(`${this.archivo}.txt`, "utf-8"); //Leyendo el contenido actual del archivo
            const jsondata = JSON.parse(data); // Convirtiendo el texto en un objeto de javascript
            jsondata.splice(0,jsondata.length)
            await fs.promises.writeFile(`${this.archivo}.txt`,JSON.stringify(jsondata,null,2));
            console.log("Todos los productos fueron borrados")
            // Otra forma de borrar todo es sobrescribiendo el archivo con un array vacio []
            // await fs.promises.writeFile(`${this.archivo}.txt`,JSON.stringify([],null,2));
            // console.log("Objetos borrados");
        }
        catch(error){
            console.log(error);
        }
    }

}
module.exports = {Contenedor}









// fs.readFile(contenedor.archivo,"utf-8", (error, contenido)=>{
//     if(error){
//         console.log(error);
//     } else {
//         const data = JSON.parse(contenido);
//         console.log(data)
//     }
// });

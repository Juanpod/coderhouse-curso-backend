const { syncBuiltinESMExports } = require("module");
const { resolve } = require("path");
const {Contenedor} = require("./clase") ;

const contenedor = new Contenedor("productos")

async function main(){
    producto1 = { title: "Escuadra",price:143.45, thumbnail:"URL"}
    producto2 = { title: "Calculadora",price:234.56, thumbnail:"URL"}
    producto3 = { title: "Globo Terraqueo",price:345.67, thumbnail:"URL"}
    producto4 = { title: "Lapiz",price:140.45, thumbnail:"URL"}
    producto5 = { title: "Cuaderno",price:400, thumbnail:"URL"}
    producto6 = { title: "Libro",price:600, thumbnail:"URL"}
    producto7 = { title: "Mochila",price:443.45, thumbnail:"URL"}

    function sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    let delay = 1000
    await contenedor.save(producto1);
    await sleep(delay);
    await contenedor.save(producto2);
    await sleep(delay);
    await contenedor.save(producto3);
    await sleep(delay);
    await contenedor.save(producto4);
    await sleep(delay);
    await contenedor.save(producto5);
    await sleep(delay);
    await contenedor.save(producto6);
    await sleep(delay);
    await contenedor.save(producto7);
    await sleep(delay);
    let getById = await contenedor.getById(3)
    console.log("El producto buscado es",getById)
    await sleep(delay);
    let getAll = await contenedor.getAll()
    console.log("Los productos existentes son:",getAll)
    await sleep(delay);
    await contenedor.deleteById(3);
    await sleep(delay);
    await contenedor.deleteById(6);
    await sleep(delay);
    await contenedor.deleteById(7);
    await sleep(delay);
    await sleep(delay);
    await contenedor.deleteAll()
    await sleep(delay);
    await contenedor.save(producto1);
    await sleep(delay);
    await contenedor.save(producto2);
    await sleep(delay);
    await contenedor.save(producto3);
    await sleep(delay);
    await contenedor.deleteById(3);
    await sleep(delay);
    await contenedor.save(producto4);
    await sleep(delay);
    let getAll2 = await contenedor.getAll()
    console.log("Los productos existentes son:",getAll2)
    await sleep(delay);
    await contenedor.deleteAll()
    
    

    
}


main();


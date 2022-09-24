const {Contenedor} = require("./clase.js");
const express = require("express");

const contenedor = new Contenedor("productos")

//Crear el servidor
const app = express();

//Configurar las rutas
app.get("/productos", async (req, res)=>{
    let getAll = await contenedor.getAll()
    res.send(getAll)
})
app.get("/productRandom", async (req, res)=>{
    let getAll = await contenedor.getAll();
    const randomId =  parseInt(Math.random()*getAll.length+1);
    let producto = await contenedor.getById(randomId);
    res.send(producto)
})

// Levantando el servidor
app.listen(8080,()=>{
    console.log("Server up")
})


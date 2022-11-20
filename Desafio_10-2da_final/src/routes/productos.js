const express = require('express');
const routerProductos = express.Router();

const {productsModel} = require('../models/productsModel.js');

const {Contenedor} = require('../managers/ProductoContenedorArchivo.js');

//const productos = new Contenedor("productos.json");

// Prueba con contenedor mongo
const {ContenedorMongoDb} = require('../managers/ContenedorMongoDb.js');
const URL ="mongodb://127.0.0.1/tienda";
const productos = new ContenedorMongoDb(URL, productsModel );
//-----


const admin = true;

routerProductos.get("/", async(req,res)=>{
    try{
        const listaProductos = await productos.getAll();
        if(listaProductos.length == 0){
            console.log("No hay productos");
            res.json({
                mensaje: "No hay productos"
            });
        } else {
            console.log(listaProductos);
            res.json(listaProductos);
        }
        
    } catch (error){
        res.status(500).send("error en el servidor")
    }
})

routerProductos.get("/:id", async(req,res)=>{
    try{
        const id = req.params.id;
        const producto = await productos.getById(id);
        if (producto.length != 0){
            console.log(producto)
            res.json(producto)
        } else {
            res.json({
                error:"producto no encontrado"
            })
            console.log("Producto no encontrado")
        }
    } catch (error){
        res.status(500).send("hubo un error en el servidor")
    }
})

routerProductos.post("/", async(req,res)=>{
    if(admin){
        try{
            const newProduct = req.body;
            await productos.save(newProduct);
            res.json({
                mensaje:"producto guardado",
                producto: req.body
            })
            console.log("Guardado con exito")
    
        } catch (error){
            res.status(500).send("hubo un error en el servidor")
        }
    } else {
        res.json({
            error : -1,
            description: "ruta / y metodo post no autorizada"
        })
    }
    
})

routerProductos.put("/:id", async(req,res)=>{
    if(admin){
        try{
            const id = req.params.id;
            const newUpdate = req.body;
            const actualizados = await productos.updateById(id,newUpdate);
            if(actualizados.matchedCount == 0){
                res.json({
                    error:"No se encuentra el id"
                })
            } else {
                res.json({
                    message:`El producto con el id ${id} fue actualizado`,
                    response: newUpdate
                })
            }
    
        } catch (error){
            console.log(error);
            res.status(500).send("hubo un error en el servidor")
        }
    } else {
        res.json({
            error : -1,
            description: "ruta / y metodo put no autorizada"
        })
    }
    
})

routerProductos.delete("/:id", async(req,res)=>{
    if(admin){
        try{
            const id = req.params.id;
            let result = await productos.deleteById(id);
            if(result.deletedCount == 1){
                res.json({
                    Mensaje:`Producto con el id ${id} fue borrado`
                })
                console.log(`Producto con el id ${id} fue borrado`);
            } else {
                res.json({
                    error:`Producto con el id ${id} no fue encontrado`
                })
                console.log(`Producto con el id ${id} no fue encontrado`);
            }
            
        } catch (error){
            res.status(500).send("hubo un error en el servidor")
        }
    } else {
        res.json({
            error : -1,
            description: "ruta / y metodo delete no autorizada"
        })
    }
    
})

routerProductos.delete("/", async(req,res)=>{
    try{
        let result = await productos.deleteAll();
        console.log(result);
        res.json({
            Mensaje: "Todos los productos fueron borrados"
        });
    } catch (error){
        res.status(500).send("error en el servidor")
    }
})

module.exports = routerProductos;
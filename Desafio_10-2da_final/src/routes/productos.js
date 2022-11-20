const express = require('express');
const routerProductos = express.Router();

const {Contenedor} = require('../managers/ProductoContenedorArchivo.js');

//const productos = new Contenedor("productos.json");

// Prueba con contenedor mongo
const {ContenedorMongoDb} = require('../managers/ContenedorMongoDb.js');
const URL ="mongodb://127.0.0.1/tienda";
const productos = new ContenedorMongoDb(URL, "modelo");
//-----


const admin = true;

routerProductos.get("/", async(req,res)=>{
    try{
        const listaProductos = await productos.getAll();
        console.log(listaProductos);
        res.json(listaProductos);
    } catch (error){
        res.status(500).send("error en el servidor")
    }
})

routerProductos.get("/:id", async(req,res)=>{
    try{
        const id = req.params.id;
        const producto = await productos.getById(id);
        if (producto == []){
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
            let producto = await productos.getById(id);
            if(producto){
                await productos.deleteById(id);
                res.json({
                    Mensaje:`Producto con el id ${id} fue borrado`
                })
            } else {
                res.json({
                    error:`Producto con el id ${id} no fue encontrado`
                })
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

module.exports = routerProductos;
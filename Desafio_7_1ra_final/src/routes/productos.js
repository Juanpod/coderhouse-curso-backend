const express = require('express');
const routerProductos = express.Router();

const {Contenedor} = require('../managers/productsClass.js');

const productos = new Contenedor("productos.json");

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
        if (producto){
            console.log(producto)
            res.json(producto)
        } else {
            res.json({
                error:"producto no encontrado"
            })
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
            const actualizados = await productos.updateById(JSON.parse(id),newUpdate);
            if(actualizados == false){
                res.json({
                    error:"No se encuentra el id"
                })
            } else {
                res.json({
                    message:`El producto con el id ${id} fue actualizado`,
                    response: actualizados
                })
            }
    
        } catch (error){
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
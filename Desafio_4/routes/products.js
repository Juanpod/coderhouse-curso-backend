const express = require("express");
const {Contenedor} = require("../clase");

const productsRouter = express.Router();

const contenedor = new Contenedor("productos");

productsRouter.get("/", async(req,res)=>{
    try{
        const productos = await contenedor.getAll();
        console.log(productos);
        res.send(productos);
    } catch (error){
        res.status(500).send("error en el servidor")
    }
})

productsRouter.get("/:id", async(req,res)=>{
    try{
        const id = req.params.id;
        const producto = await contenedor.getById(id);
        if (producto){
            console.log(producto)
            res.send(producto)
        } else {
            res.json({
                error:"producto no encontrado"
            })
        }
    } catch (error){
        res.status(500).send("hubo un error en el servidor")
    }
})

productsRouter.post("/", async(req,res)=>{
    try{
        const newProduct = req.body;
        const productos = await contenedor.save(newProduct);
        res.json({
            mensaje:"producto guardado",
            producto: req.body
        })

    } catch (error){
        res.status(500).send("hubo un error en el servidor")
    }
})

productsRouter.put("/:id", async(req,res)=>{
    try{
        const id = req.params.id;
        const newUpdate = req.body;
        const actualizados = await contenedor.updateById(JSON.parse(id),newUpdate);
        if(actualizados == null){
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
})

productsRouter.delete("/:id", async(req,res)=>{
    try{
        const id = req.params.id;
        producto = await contenedor.getById(id);
        if(producto){
            await contenedor.deleteById(id);
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
})

module.exports = productsRouter;

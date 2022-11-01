const express = require('express');
const routerCarritos = express.Router();

const {Carrito} = require('../managers/cartsClass.js');

const carrito = new Carrito("carritos.json");

routerCarritos.post("/", async(req,res)=>{
        try{
            let id = await carrito.crearCarrito();
            console.log("El id del carrito es",id)
            res.json({
                mensaje:"carrito creado",
                id: id
            })
    
        } catch (error){
            res.status(500).send("hubo un error en el servidor")
        }
})

routerCarritos.delete("/:id", async (req, res) =>{
    try {
        let id = req.params.id;
        let result = await carrito.borrarCarrito(id);
        if(result){
            res.json({
                mensaje: "carrito borrado"
            })
        } else {
            res.json({
                mensaje: "carrito no encontrado"
            })
        }
    } catch {
        console.log("no se pudo borrar el carrito");
    }

})

routerCarritos.get("/:id/productos", async (req,res) => {
    try {
        let id = req.params.id;
        const productos = await carrito.getById(id);
        if(productos){
            res.json({
                productos : productos
            })
        } else {
            res.json({
                mensaje : "no se encontro el carrito"
            })
        }
    } catch {
        console.log("no se pudo buscar el carrito");
    }
})




module.exports = routerCarritos;


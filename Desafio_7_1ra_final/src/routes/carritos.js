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
})




module.exports = routerCarritos;


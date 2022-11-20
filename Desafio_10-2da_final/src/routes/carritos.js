const express = require('express');
const routerCarritos = express.Router();

//const {Carrito} = require('../managers/CarritoContenedorArchivo.js');

//const carrito = new Carrito("carritos.json");

//const {Contenedor} = require('../managers/ProductoContenedorArchivo.js');

const {productsModel} = require('../models/productsModel.js');
const {carritosModel} = require('../models/carritosModel.js');

//const productos = new Contenedor("productos.json");

const {ContenedorMongoDb} = require('../managers/ContenedorMongoDb.js');
const URL ="mongodb://127.0.0.1/tienda";
const productos = new ContenedorMongoDb(URL, productsModel);
const carrito = new ContenedorMongoDb(URL, carritosModel )



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
        const productosCarrito = await carrito.getById(id);
        if(productosCarrito){
            res.json({
                productos : productosCarrito
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

routerCarritos.post("/:id/productos/:id_prod", async (req,res) => {
    try {
        let id = parseInt(req.params.id);
        let idProduct = req.params.id_prod;
        const newProduct = await productos.getById(idProduct);
        const existCart = await carrito.getById(id);
        if(existCart){
            if(newProduct){
                await carrito.addProduct(id,newProduct);
                res.json({
                    mensaje: "exito"
                }) 
            } else {
                res.json({
                    mensaje: "no se encuentra el producto"
                }) 
            }
        } else {
            res.json({
                mensaje: "no se encuentra el carrito"
            }) 
        }
        
        
    } catch {
        console.log("no se pudo buscar el carrito")
    }
})

routerCarritos.delete("/:id/productos/:id_prod", async (req,res) => {
    try {
        let id = parseInt(req.params.id);
        let idProduct = parseInt(req.params.id_prod);
        const productId = await productos.getById(idProduct);
        const existCart = await carrito.getById(id);
        if(existCart){
            if(productId){
                await carrito.deleteProduct(id,idProduct);
                res.json({
                    mensaje: "exito"
                }) 
            } else {
                res.json({
                    mensaje: "no se encuentra el producto"
                }) 
            }
        } else {
            res.json({
                mensaje: "no se encuentra el carrito"
            }) 
        }
        
        
    } catch {
        console.log("no se pudo buscar el carrito")
    }
})






module.exports = routerCarritos;


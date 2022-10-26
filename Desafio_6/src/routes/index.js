//Se importa la clase Contenedor
const {Contenedor} = require('../components/clase')
//Se instancia Router
const express = require('express');
const router = express.Router();


//Se instancia un objeto de la clase Contenedor
const contenedor = new Contenedor('productos');




//Aqui se crean las rutas

router.get('/',(req,res)=>{
    res.render('home')
})

router.get('/productos',async (req,res)=>{
    
    res.render('productos',{productos : await contenedor.getAll()})   
})

router.post("/productos", async(req,res)=>{
    try{
        const newProduct = req.body;
        const productos = await contenedor.save(newProduct);
        res.redirect('/')

    } catch (error){
        res.status(500).send("hubo un error en el servidor")
    }
})





module.exports = router

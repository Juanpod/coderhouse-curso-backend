//Se importa el modulo Router desde express
import {Router} from 'express';
//Se importa la clase Contenedor
import { Contenedor } from '../components/clase.js';
//Se instancia Router
const router = Router();
//Esto es lo mismo que:
//const express = require('express');
//const router = express.Router();


//Se instancia un objeto de la clase Contenedor
const contenedor = new Contenedor('productos');




//Aqui se crean las rutas

router.get('/',(req,res)=>{
    res.render('home.pug')
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





// Se exporta router
export { router };

//Es lo mismo que 
//module.exports = router

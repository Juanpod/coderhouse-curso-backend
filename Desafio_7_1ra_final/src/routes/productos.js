const express = require('express');
const routerProductos = express.Router();

const {Contenedor} = require('../managers/productsClass.js');

const productos = new Contenedor;


routerProductos.get('/', (req, res) =>{
    res.render('home')
})

module.exports = routerProductos;
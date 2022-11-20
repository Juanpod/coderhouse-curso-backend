console.log('Hola mundo');
//settings 
const path = require('path');
const express = require('express');
const app = express();
const routerProdutos = require('./routes/productos.js');
const routerCarritos = require('./routes/carritos.js');



const PORT = process.env.PORT || 3000;

//static files
const publicFolder = path.join(__dirname, "public");
app.use(express.static(publicFolder));

//Middlewares para poder recibir informacion POST, PUT...
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//Middleware para que el servidor use router al llegar a /
app.use('/api/productos', routerProdutos);
app.use('/api/carrito', routerCarritos);

//express server
app.listen(PORT,()=>{
    console.log(`server on port ${PORT}`);
})



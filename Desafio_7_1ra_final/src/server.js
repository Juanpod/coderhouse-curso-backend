console.log('Hola mundo');
//settings 
const path = require('path');
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const routerProdutos = require('./routes/productos.js');


const PORT = process.env.PORT || 8080;

const folderViews = path.join(__dirname, "views");

//static files
app.use(express.static(path.join(__dirname, 'public')));

//express server
app.listen(PORT,()=>{
    console.log(`server on port ${PORT}`);
})

//Middlewares para poder recibir informacion POST, PUT...
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine('hbs', handlebars.engine({extname : 'hbs'}));
app.set('view engine', 'hbs');
app.set('views', folderViews);

//Middleware para que el servidor use router al llegar a /
app.use('/', routerProdutos);

//express server
app.listen(PORT,()=>{
    console.log(`server on port ${PORT}`);
})



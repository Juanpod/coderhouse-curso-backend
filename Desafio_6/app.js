const express = require("express");
const router = require("./src/routes/index")
const {Server} = require("socket.io");
const { Server: HttpServer } = require("http");
//Se importa engine de express-handlebars
const handlebars = require("express-handlebars");

//Crear servidor de express con el nombre app
const app = express();
const httpServer = new HttpServer(app);
const io = new Server(httpServer);





//Middlewares para poder recibir informacion POST, PUT...
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Establecemos la configuracion de handlebars
app.engine('hbs', handlebars.engine({extname : 'hbs'}));
//establecemos el motor de plantillas que se utiliza
app.set('view engine', 'hbs');
//establecemos el directorio donde se encuentran los archivos de plantilla
app.set('views', './src/views');
//espacio publico del servidor, para que handlebars pueda acceder a la carpeta
app.use(express.static('public'));


//Middleware para que el servidor use router al llegar a /
app.use('/', router);



//Levantar el servidor
app.listen(3000, () => console.log('Servidor iniciado en el puerto 3000'));





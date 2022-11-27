console.log("Hola mundo");
//settings
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Importar normalizr
const {normalize, schema} = require("normalizr");

// opciones de la base de datos

const options = require("./config/dbConfig");

//static files
app.use(express.static(path.join(__dirname, 'public')));

//express server
const server = app.listen(PORT,()=>{
    console.log(`server on port ${PORT}`);
})

// Websocket server and connection to express server
const SocketIO = require('socket.io');
const io = SocketIO(server);


const ContenedorSql = require("./managers/contenedorSql");
const {HistorialChat} = require("./managers/chatClass");
const {Contenedor} = require("./managers/productsClass");

//Historial de chat

//const historial = new ContenedorSql(options.sqliteDB, "chat");
const historial = new HistorialChat("historial.json");

//Productos
//const productos = new ContenedorSql(options.mariaDB, "products");

const productos = new Contenedor("productos.json");


//Normalizacion

//crear los esquemas --------
// primero el esquema del autor (la informacion mas "profunda")
const authorSchema = new schema.Entity("autores", {} ) //un tercer parametro en caso de no tener una propiedad llamado id, idAttribute:"propiedad"


//esquema mensajes
const messageSchema = new schema.Entity("mensajes",{
    author:authorSchema},
    {idAttribute:"timestamp"});

//creacion de un nuevo objeto para generar un esquema global,
// ya que la informacion viene en un array y no en un objeto

//esquema global

const chatSchema = new schema.Entity("chat", {
    messages: [messageSchema]
}, {idAttribute:"id"});

 //------ in cracion de esquemas

//crear una funcion para normalizar los datos

const normalizarDatos = (data)=>{
    const normalizeData = normalize({id:"chatHistory", messages:data}, chatSchema);
    return normalizeData;
}

const normalizarMensajes = async() => {
    const results = await historial.getAll();
    const mensajesNormalizados = normalizarDatos(results);
    return mensajesNormalizados;
}


//Websockets
io.on("connection", async(socket) => {
    console.log("nuevo usuario conectado", socket.id);
    // -------------- chat ----------------

    //Envia el historial de chat a los nuevos usuarios
    socket.emit("historico",await normalizarMensajes());

    // Recibe nuevos mensaje y envia historial al resto de usuario
    socket.on('mensaje-chat', async(data) =>{
        console.log(data);
        await historial.save(data);
        let historicoMensajes;
        //historicoMensajes = await historial.getAll();
        io.sockets.emit('historico', await normalizarMensajes());
    })
    
    socket.on('typing', (data) =>{
        socket.broadcast.emit('typing',data);
    })
    //-----------fin-chat--------------------

    //--------------formulario -------------
    socket.emit('productList', await productos.getAll());
    socket.on('newProduct', async (data)=>{
        console.log(data);
        await productos.save(data);
        io.sockets.emit('productList', await productos.getAll());
    })
})


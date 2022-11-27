console.log("Hola mundo");
//settings
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

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

//Websockets
io.on("connection", async(socket) => {
    console.log("nuevo usuario conectado", socket.id);
    // -------------- chat ----------------

    //Envia el historial de chat a los nuevos usuarios
    socket.emit("historico",await historial.getAll());

    // Recibe nuevos mensaje y envia historial al resto de usuario
    socket.on('mensaje-chat', async(data) =>{
        console.log(data);
        await historial.save(data);
        let historicoMensajes;
        historicoMensajes = await historial.getAll();
        io.sockets.emit('historico',historicoMensajes);
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
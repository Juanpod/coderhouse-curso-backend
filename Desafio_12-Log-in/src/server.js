console.log("Hola mundo");
//settings
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { faker } = require('@faker-js/faker');
faker.locale = "es";
const handlebars = require('express-handlebars');
// Importar normalizr
const {normalize, schema} = require("normalizr");


//static files
app.use(express.static(path.join(__dirname, 'public')));

// agregado 

const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
app.use(cookieParser());


//configuracion template engine handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://juanpod:coder@coderdata.jzdt2lh.mongodb.net/desafio12?retryWrites=true&w=majority"
    }),
    secret:"secretoDeEstado",
    resave:false,
    saveUninitialized: false,
    cookie:{
        maxAge:600000
    }
}));

// routes
//view routes

const checkUserLogged = (req,res,next)=>{
    if(req.session.username){
        next();
    } else{
        res.redirect("/login");
    }
}
app.get('/',checkUserLogged, (req,res)=>{
    console.log(req.session);
    user = req.session.username;
    res.render('home',{username : user})
})

app.get("/login",(req,res)=>{
    const {user} = req.query;
    if(req.session.username){
        return res.redirect("/")
    } else{
        if(user){
            req.session.username = user;
            return res.redirect("/");
        } else{
            res.render("login");
        }
    }
});


app.get("/logout",(req,res)=>{
    user = req.session.username;
    console.log(user);
    req.session.destroy();
    res.render('logout',{username : user});
});



//fin agregado
//express server
const server = app.listen(PORT,()=>{
    console.log(`server on port ${PORT}`);
})

// Websocket server and connection to express server
const SocketIO = require('socket.io');
const io = SocketIO(server);

const {HistorialChat} = require("./managers/chatClass");
const {Contenedor} = require("./managers/productsClass");

//Historial
const historial = new HistorialChat("historial.json");

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


app.get("/api/productos-test",(req,res)=>{
    let arrayProducts=[];
    for(let i=0;i<5;i++){
        arrayProducts.push(
            {
                title: faker.commerce.product(),
                price: faker.commerce.price(1,20000),
                thumbnail: faker.image.avatar(),
                id: faker.datatype.uuid()
            }
        )
    }
    console.log(arrayProducts);
    res.send(arrayProducts);
})






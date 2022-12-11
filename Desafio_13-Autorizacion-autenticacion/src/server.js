console.log("Hola mundo");
//settings
const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const {normalize, schema} = require("normalizr");
const { faker } = require('@faker-js/faker');
faker.locale = "es";
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
//importaciones para passport 
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {UserModel} = require('./models/user.js');

//conectamos a la base de datos 
const mongoUrl = "mongodb+srv://juanpod:coder@coderdata.jzdt2lh.mongodb.net/userDB?retryWrites=true&w=majority";

mongoose.connect(mongoUrl,{
    useNewUrlParser: true,
    useUnifiedTopology:true
},(error)=>{
    if(error) return console.log(`Hubo un error conectandose a la base ${error}`);
    console.log("conexion a la base de datos de manera exitosa")
});

//servidor express
const app = express();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT,()=>{
    console.log(`server on port ${PORT}`);
})

//static files
app.use(express.static(path.join(__dirname, 'public')));
//interpretacion de formato json desde el cliente
app.use(express.json()); //lectura de json desde el cuerpo de la peticion.
app.use(express.urlencoded({extended:true})); //lectura de json desde un metodo post de formulario

app.use(cookieParser());

//configuracion template engine handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');

app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://juanpod:coder@coderdata.jzdt2lh.mongodb.net/sessionDB?retryWrites=true&w=majority"
    }),
    secret:"secretoDeEstado",
    resave:false,
    saveUninitialized: false,
    cookie:{
        maxAge:600000
    }
}));

//configurar passport
app.use(passport.initialize()); //conectamos a passport con express.
app.use(passport.session());//vinculacion entre passport y las sesiones de nuestros usuarios.

//serializar un usuario
passport.serializeUser((user,done)=>{
    done(null, user.id)
});

//deserializar al usuario
passport.deserializeUser((id,done)=>{
    //validar si el usuario existe en db.
    UserModel.findById(id,(err, userFound)=>{
        return done(err, userFound)
    })
});

//crear una funcion para encriptar la contrase;
// estaesmiPass => ahjsgduyqwte234296124ahsd-hash
const createHash = (password)=>{
    const hash = bcrypt.hashSync(password,bcrypt.genSaltSync(10));
    return hash;
}

//estrategia de registro utilizando passport local.
passport.use("signupStrategy", new LocalStrategy(
    {
        passReqToCallback:true,
        usernameField: "email"
    },
    (req,username,password,done)=>{
        //logica para registrar al usuario
        //verificar si el usuario exitse en db
        UserModel.findOne({username:username},(error,userFound)=>{
            if(error) return done(error,null,{message:"Hubo un error"});
            if(userFound) return done(null,null,{message:"El usuario ya existe"});
            //guardamos el usuario en la db
            const newUser={
                name:req.body.name,
                username:username,
                password:createHash(password)
                // password:password
            };
            UserModel.create(newUser,(error,userCreated)=>{
                if(error) return done(error, null, {message:"Hubo un error al registrar el usuario"})
                return done(null,userCreated);
            })
        })
    }
));

// Estrategia de login

function isValidPassword (user, password) {
    return bcrypt.compareSync(password, user.password);
}

passport.use('loginStrategy', new LocalStrategy(
    {
        usernameField: "email"
    },
    (username, password, done) => {
        UserModel.findOne({username:username},(error,user)=>{
            if(error) {
                return done(error,null,{message:"Hubo un error"});
            }
            if(!user) {
                return done(null,false,{message:"El usuario no existe"});
            }

            if(!isValidPassword(user, password)) {
                return done(null,false,{message:"Clave invalida"});
            }
            return done(null, user);
        })
    }
))

// routes
//view routes


app.get('/', (req,res)=>{
    if(req.isAuthenticated()){
        console.log(req.session.username);
        const user = {
            name : req.session.name,
            email : req.session.username
        }
        res.render('home',{username : user})
    } else{
        res.send("<div>Debes <a href='/login'>inciar sesion</a> o <a href='/registro'>registrarte</a></div>")
    } 
})
app.get("/registro", (req,res)=>{
    const errorMessage = req.session.messages ? req.session.messages[0] : '';
    if(req.session.username){
        return res.redirect("/");
    } else {
        res.render('signup',{error:errorMessage});
    }
    req.session.messages = [];
})

app.get("/login",(req,res)=>{
    const errorMessage = req.session.messages ? req.session.messages[0] : '';
    // const {user} = req.query;
    let user;
    if(req.session.username){
        return res.redirect("/")
    } else{
        if(user){
            req.session.username = user;
            return res.redirect("/");
        } else{
            res.render("login",{error:errorMessage});
        }
    }
    req.session.messages = [];
});

app.get("/failLogin", (req,res)=>{
    const errorMessage = req.session.messages ? req.session.messages[0] : '';
    res.render("failLogin",{error:errorMessage})
    req.session.messages = [];
})
app.get("/failRegistro", (req,res)=>{
    const errorMessage = req.session.messages ? req.session.messages[0] : '';
    res.render("failRegistro",{error:errorMessage})
    req.session.messages = [];
})

app.get("/logout",(req,res)=>{
    user = req.session.username;
    console.log(user);
    req.session.destroy();
    res.render('logout',{username : user});
});

//rutas para autenticacion

app.post("/signup",passport.authenticate("signupStrategy",{
    failureRedirect:"/failRegistro",
    failureMessage: true
}),(req,res)=>{
    const user = req.body.email;
    const nombre = req.body.name;
    req.session.username = user;
    req.session.name = nombre;
    res.redirect("/")
});

//ruta de autenticacion login

app.post("/login",passport.authenticate("loginStrategy",{
    failureRedirect:"/failLogin",
    failureMessage: true
}),(req,res)=>{
    const user = req.body.email;
    const nombre = req.body.name;
    req.session.username = user;
    req.session.name = nombre;
    res.redirect("/")
});



//fin agregado


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






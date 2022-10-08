//Importar el modulo de express
const express = require("express");
//Importar el paquete de rutas
const productRouter = require("./routes/products");
//Crear el servidor express
const app = express();
//Levantar el servidor
app.listen(8080,()=>console.log("Server listening on port 8080"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/productos", productRouter);
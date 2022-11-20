const mongoose = require("mongoose");

const productsCollection = "productos";

const productsSchema = new mongoose.Schema(
    {
        nombre:{
            type: String,
            required: true
        },
        descripcion:{
            type: String,
            required: true
        },
        precio: {
            type: Number,
            required: true
        },
        codigo:{
            type: String,
            required: true
        },
        stock:{
            type: Number,
            required: true
        },
        imagen:{
            type: String,
            required: true
        }
    }
);

const productsModel = mongoose.model(productsCollection, productsSchema);
module.exports = {productsModel};
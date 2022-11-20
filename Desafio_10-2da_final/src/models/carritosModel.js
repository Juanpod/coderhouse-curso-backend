const mongoose = require("mongoose");

const {productsSchema} = require('./productsModel.js');

const carritosCollection = "carritos";

const carritosSchema = new mongoose.Schema(
    {
        productos:[productsSchema]
        
    }
);

const carritosModel = mongoose.model(carritosCollection, carritosSchema);
module.exports = {carritosModel};
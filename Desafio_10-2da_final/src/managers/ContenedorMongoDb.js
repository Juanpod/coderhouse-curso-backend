const mongoose = require("mongoose");
const {productsModel} = require('../models/productsModel.js');

class ContenedorMongoDb {
    constructor(URL, model){
        this.model = model;
        mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, error=>{
            if(error) throw new Error(`Conexion fallida ${error}`);
            console.log("conexion base de datos exitosa!")
        })
    }

    async save(object){
        try{
            await productsModel.create(object);
            console.log("Guardado con exito")
        
        } catch (error) {
        console.log(error);
        }

    }

    async updateById(id, body){
        try {
            const result = await productsModel.updateOne(
                {_id:id},
                {$set:{
                    nombre:body.nombre,
                    descripcion:body.descripcion,
                    precio:body.precio,
                    codigo:body.codigo,
                    stock:body.stock,
                    imagen:body.imagen
                }});
            return result;
            
        } catch (error){
            console.log(error);
        }
    }

    async getById(id){
        try{
            const result = await productsModel.find({_id:id},{__v:0});
            return result;

        } catch (error) {
            console.log(error);
        }
    }

    async getAll(){
        try{
            const result = await productsModel.find({},{__v:0});
            return result;
        } catch (error) {
        }
    }

    async deleteById(id) {
        try {
            const result = await productsModel.deleteOne({_id:id})
            return result;
        } catch(error) {
            console.log(error);
        }
    }
}

module.exports = {ContenedorMongoDb};


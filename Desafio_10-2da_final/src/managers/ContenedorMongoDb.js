const mongoose = require("mongoose");
const { carritosModel } = require("../models/carritosModel");
const { productsModel } = require("../models/productsModel");


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
        console.log(this.model)
    }

    async save(object){
        try{
            await this.model.create(object);
            
        
        } catch (error) {
        console.log(error);
        }

    }

    async updateById(id, body){
        try {
            const result = await this.model.updateOne(
                {_id:id},
                {$set:{
                    nombre:body.nombre,
                    descripcion:body.descripcion,
                    precio:body.precio,
                    codigo:body.codigo,
                    stock:body.stock,
                    imagen:body.imagen
                }});
            if(result.matchedCount == 0){
                return false;
            }
            return true;
            
        } catch (error){
            console.log(error);
        }
    }

    async getById(id){
        try{
            const result = await this.model.find({_id:id},{__v:0});
            if(result.length == 0){
                return false;
            }
            if(this.model == carritosModel){
                return result[0].productos;
            }
            
            return result;
            

        } catch (error) {
            console.log(error);
        }
    }

    async getAll(){
        try{
            const result = await this.model.find({},{__v:0});
            return result;
        } catch (error) {
        }
    }

    async deleteById(id) {
        try {
            const result = await this.model.deleteOne({_id:id});
            if(result.deletedCount == 1){
                return true;
            }
            return false;
        } catch(error) {
            console.log(error);
        }
    }

    async deleteAll() {
        try {
            const result = await this.model.deleteMany({});
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async crearCarrito(){
        try{
            console.log("crear carrito");
            const result = await this.model.create({productos:[]});
            return result._id;
        } catch (error) {
            console.log(error);
        }
    }

    async borrarCarrito(id) {
        try {
            const result = await this.model.deleteOne({_id:id});
            if(result.deletedCount == 1){
                return true;
            }
            return false;
        } catch(error) {
            console.log(error);
        }
    }

    async addProduct(id, newProduct){
        try {
            
            const products = await this.getById(id);
            products.push(newProduct[0]);
            const result = await this.model.updateOne(
                {_id:id},
                {$set:{
                    productos:products
                }});
            if(result.matchedCount == 0){
                return false;
            }
            return true;
        }catch(error){
            console.log(error);
        }
    }

    async deleteProduct(id, idProduct) {
        try {
            const products = await this.getById(id);
            const index = products.findIndex(elm=>elm.id === idProduct);
            console.log(index);
            products.splice(index,1);
            await this.model.updateOne(
                {_id:id},
                {$set:{
                    productos:products
                }});
            
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = {ContenedorMongoDb};


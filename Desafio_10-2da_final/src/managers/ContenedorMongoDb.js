const mongoose = require("mongoose");


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
            return result;
            
        } catch (error){
            console.log(error);
        }
    }

    async getById(id){
        try{
            const result = await this.model.find({_id:id},{__v:0});
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
            return result;
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

}

module.exports = {ContenedorMongoDb};


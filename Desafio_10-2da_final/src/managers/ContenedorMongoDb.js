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

}

module.exports = {ContenedorMongoDb};


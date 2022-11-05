// Se especifican las opciones de configuracion de las bases de datos a utilizar
const options = {
    mariaDB:{
        client:"mysql",
        connection:{
            host:"127.0.0.1",
            user:"root",
            password:"",
            database:"ecommerce"
        }
    }
}

module.exports = options;
const knex = require("knex");

class ContenedorMysql{
    constructor(options, tableName){
        this.database = knex(options);
        this.tableName = tableName;
    }
    async getAll(){
        try{
            //select * from products
            const data = await this.database.from(this.tableName).select("*");
            const products = data.map(elm=>({...elm}))
            //console.log("Datos",products);
            return products;
        } catch (error) {
            return `hubo un error ${error}`
        }
        
    }
    async save(product) {
        try{
            const [productId] = await this.database.from(this.tableName).insert(product);
            return `Nuevo producto guardado con el id: ${productId}`;
        } catch (error) {
            return `hubo un error ${error}`
        }
    }
}

module.exports = ContenedorMysql;
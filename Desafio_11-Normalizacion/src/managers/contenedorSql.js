const knex = require("knex");

class ContenedorSql{
    constructor(options, tableName){
        this.database = knex(options);
        this.tableName = tableName;
    }
    async getAll(){
        try{
            //select * from products
            const data = await this.database.from(this.tableName).select("*");
            const results = data.map(elm=>({...elm}))
            //console.log("Datos",products);
            return results;
        } catch (error) {
            return `hubo un error ${error}`
        }
        
    }
    async save(data) {
        try{
            const [id] = await this.database.from(this.tableName).insert(data);
            return `Nuevo elemento guardado con el id: ${id}`;
        } catch (error) {
            return `hubo un error ${error}`
        }
    }
}

module.exports = ContenedorSql;
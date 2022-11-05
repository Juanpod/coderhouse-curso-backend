//Script para crear las tablas requeridas

// Se importan las opciones de configuracion de las bases de datos
const options = require("../config/dbConfig");
const knex = require("knex");

//instancia de la base de datos.
// instancia de mysql (mariadb)
const dbmysql = knex(options.mariaDB);

const createTables = async()=>{
    // verificar si la tabla ya existe en la base de datos
    const tableProductsExists = await dbmysql.schema.hasTable("products");
    if(tableProductsExists){
        await dbmysql.schema.dropTable("products");
    }
    // se crea la tabla
    await dbmysql.schema.createTable("products", table=>{
        //se definen los campos de la tabla products
        table.increments("id");
        table.string("title",30).nullable(false);
        table.integer("price").nullable(false);
        table.string("thumbnail",300).nullable(false);
    });
    console.log("table 'products' created succesfully");
    dbmysql.destroy();
}

createTables();


//Script para crear las tablas requeridas

// Se importan las opciones de configuracion de las bases de datos
const options = require("../config/dbConfig");
const knex = require("knex");
const { sqliteDB } = require("../config/dbConfig");

//instancia de la base de datos.
// instancia de mysql (mariadb)
const dbmysql = knex(options.mariaDB);
//instancia de sqlite
const dbsqlite = knex(options.sqliteDB);

const createTables = async()=>{
    try {
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

        const tableChatExists = await dbsqlite.schema.hasTable("chat");
        if(tableChatExists){
            await dbsqlite.schema.dropTable("chat");
        }
        await dbsqlite.schema.createTable("chat", table =>{
            table.increments("id");
            table.string("username",30);
            table.string("timestamp",10);
            table.string("message", 200);
        });
        console.log("Table 'chat' created");
        dbsqlite.destroy();


    } catch(error){
        console.log(error);
    }
}

createTables();


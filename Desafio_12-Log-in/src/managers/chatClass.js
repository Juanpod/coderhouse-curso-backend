const fs = require('fs');
const path = require('path');

class HistorialChat {
    constructor(nameFile){
        this.nameFile = path.join(__dirname,"..",`files/${nameFile}`);
        console.log(this.nameFile);
    }
    async save(message){
        try {
            if(fs.existsSync(this.nameFile)){
                let history = await this.getAll();
                history.push(message);
                await fs.promises.writeFile(this.nameFile, JSON.stringify(history, null, 2));
            }
        } catch {
            console.log("No se pudo agregar el mensaje al historial")
        }
        
    }
    async getAll(){
        if(fs.existsSync(this.nameFile)){
            try {
            const data = await fs.promises.readFile(this.nameFile,'utf-8');
            const history = JSON.parse(data);
            return history;
            } catch {
                console.log('No se puede leer el archivo de historial')
            }   
        }
        return {status:'error',message:"No hay productos"}   
    }

}

module.exports = {HistorialChat}
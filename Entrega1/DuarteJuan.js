class Usuario{
    constructor(nombre, apellido, libros, mascotas) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
    }
    getFullname(){
        return `${this.nombre} ${this.apellido}`;
    }
    countMascotas(){
        return this.mascotas.length;
    }
    addBook(nombre,autor){
        const newBook = {nombre: nombre, autor: autor};
        this.libros.push(newBook);
    }
    getBookNames(){
        let libros = [];
        for (let i in this.libros){
            libros.push(this.libros[i].nombre);
        }
        return libros;
    }
}

const usuario = new Usuario("Juan", "Duarte",[{nombre:"Ready Player One",autor:"Ernest Cline"}],["Paty","Dogy"]);
console.log("El nombre completo del usuario es", usuario.getFullname());
console.log("Tiene", usuario.countMascotas(),"mascotas");
//Quiero añadir un libro mas.
usuario.addBook("Yo Robot","Isaac Asimov");
const nombres = usuario.getBookNames();
console.log("Tiene en su coleccion de libros", nombres);
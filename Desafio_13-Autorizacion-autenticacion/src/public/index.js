console.log("javascript funcionando ok");
const socket = io();


//esquemas del lado del front

const authorSchema = new normalizr.schema.Entity("autores", {} )

const messageSchema = new normalizr.schema.Entity("mensajes",{
    author:authorSchema},
    {idAttribute:"timestamp"});

const chatSchema = new normalizr.schema.Entity("chat", {
    messages: [messageSchema]
}, {idAttribute:"id"});


//-------------------chat -------------------
// let user = document.getElementById("nombre"); //Obtiene el usuario 
// let message = document.getElementById("message"); //Obtiene el mensaje
let sendbtn = document.getElementById("send"); //Obtiene el boton de enviar
//Escucha el evento click para emitir el mensaje-chat con un objeto que contiene usuario y mensaje
sendbtn.addEventListener('click', ()=>{
    // let user = document.getElementById("nombre"); //Obtiene el usuario 
    // console.log("el usuario es ", user.value)
    socket.emit('mensaje-chat',{
        author: {
            id: mail.value,
            nombre:nombre.value,
            apellido:lastName.value,
            edad:age.value,
            alias:nickname.value,
            avatar:avatar.value
            
        },
        timestamp: new Date().toLocaleString(),
        message:message.value
    })
    console.log({
        author: {
            id: mail.value,
            nombre:nombre.value,
            apellido:lastName.value,
            edad:age.value,
            alias:nickname.value,
            avatar:avatar.value
            
        },
        timestamp: new Date().toLocaleString(),
        message:message.value
    });
    message.value="";

})
// Funcionalidad que muestra cuando alguien esta escribiendo
let action = document.getElementById("status");
message.addEventListener('keydown', ()=>{
    socket.emit('typing', nombre.value);
})
socket.on('typing', (data)=>{
    action.innerHTML = `<p>${data} is typing</p>`
})




//Recibe los mensajes anteriores y nuevos mensajes enviados al servidor desde otro cliente.
let history = document.getElementById("history");
socket.on('historico', (data)=>{
    //desnormalizar
    const normalData = normalizr.denormalize(data.result, chatSchema, data.entities);
    action.innerHTML = "";
    let elementos="";
    normalData.messages.forEach(item => {
        elementos = elementos + `<p><strong>${item.timestamp} - ${item.author.nombre}</strong>: ${item.message}</p>`;
    });
    history.innerHTML = elementos;
})
//-----------------------------fin chat-------------------------------------

//-----------------------------formulario------------------------

let title = document.getElementById("title");
let price = document.getElementById("price");
let thumbnail = document.getElementById("thumbnail");

let productForm = document.getElementById("productForm");
productForm.addEventListener('submit', ()=>{
    socket.emit('newProduct', {
        title:title.value,
        price:price.value,
        thumbnail:thumbnail.value
    })
    console.log({
        title:title.value,
        price:price.value,
        thumbnail:thumbnail.value
    })

})

const productsContainer = document.getElementById('productsContainer');
const crearTabla = async (data)=>{
    const respuesta = await fetch("./templates/tabla.handlebars");
    const resultado = await respuesta.text();
    const template = Handlebars.compile(resultado);
    const html = template({productos:data});
    return html;
}

socket.on('productList', async (data) => {
    console.log(data)
    const htmlProducts = await crearTabla(data);
    productsContainer.innerHTML = htmlProducts;
})



//* CONECCION
const socket = io.connect()
console.log('WebSocket Connected')

//* ACTUALIZA LISTA DE PRODUCTOS
const renderTable = (data) => {
    const html = data.map(elem => `
        <tr key=${elem.id}>
            <td>${elem.id}</td>
            <td>${elem.title}</td>
            <td>${elem.price}</td>
            <td>
                <img src=${elem.thumbnail} alt="s" width="30" />
            </td>
        </tr>   
    `).join(' ')
    document.getElementById('lista-productos').innerHTML = html
}

socket.on('productos', data => {
    console.log(data)
    renderTable(data)
})

//* ENVIO DE NUEVO PRODUCTO
const registrar = (e) => {
    e.preventDefault()
    const title = nuevoProducto.title.value
    const price = nuevoProducto.price.value
    const thumbnail = nuevoProducto.thumbnail.value

    socket.emit('nuevo_producto', {title: title, price: price, thumbnail: thumbnail})

}

let nuevoProducto = document.querySelector('#registro_producto')
nuevoProducto.addEventListener("submit", registrar)

//* ACTUALIZA MENSAJES
const renderMensajes = (msg) => {
    const html = msg.map(val => `
       <li key=${val.id}>
            <div>
                ><span id="msg-correo">${val.correo}</span>
                <span id="msg-hora">[${val.hora}]: </span>
                <span id="msg-mensaje">${val.mensaje}</span>
            </div>
       </li> 
    `).join(' ')
    document.getElementById('chat').innerHTML = html
}

socket.on('mensajes', msg => {
    console.log(msg)
    renderMensajes(msg)
})

//* ENVIO DE MENSAJES
const enviar = (e) => {
    e.preventDefault()

    const correo = nuevoMensaje.correo.value
    const mensaje = nuevoMensaje.mensaje.value
    const hora = new Date().toLocaleString()
    nuevoMensaje.mensaje.value = ''

    socket.emit('nuevo_mensaje', {correo: correo, mensaje: mensaje, hora: hora})
}

let nuevoMensaje = document.querySelector('#formulario-chat')
nuevoMensaje.addEventListener("submit", enviar)

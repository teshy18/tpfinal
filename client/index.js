let user = undefined

$(document).ready(function () {

// 1 - se oculta lo ocion de iniciar sesión si existe un usuario logueado
// 2 - se muestra el boton de cerrar sesión en caso de que exista un usuario 
if(!user){
    $('#banner').addClass('visually-hidden')
    $('#navbar').removeClass('visually-hidden')
}


$.get( "http://127.0.0.1:4000/", data =>{
        console.log(data)
    } );    




$('#iniciar').click(function(event){
    event.preventDefault();
    console.log('realizando peticion')

    $.get( "http://127.0.0.1:4000/login", data =>{
        console.log(data)
    } );    
    
})

$('#registrar').click(function(event){
    event.preventDefault();
    console.log('realizando peticion de registro')

    $.get( "http://127.0.0.1:4000/register", data =>{
        console.log(data)
    } );    
    
})





})
$(document).ready(function () {

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
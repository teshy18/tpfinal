'use strict'

const mongoose =  require('mongoose');
const Schema = mongoose.Schema;


const pruebaSchema = Schema({
    email: String,
    password: String,
});

// Exportamos el modelo para usarlo en otros ficheros
module.exports = mongoose.model('users', pruebaSchema);
'use strict'

const mongoose =  require('mongoose');


const Schema = mongoose.Schema;

const UserSchema = Schema({
    name: String,
    surname: String,
    nick: String,
    email: String,
    password: String,
});

// Exportamos el modelo para usarlo en otros ficheros
module.exports = mongoose.model('User', UserSchema);
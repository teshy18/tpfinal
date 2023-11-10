'use strict'

const mongoose =  require('mongoose');


const Schema = mongoose.Schema;

const UserSchema = Schema({
    email: String,
    password: String,
    nick: String,
    refreshToken: String
});

// Exportamos el modelo para usarlo en otros ficheros
module.exports = mongoose.model('users', UserSchema);
const { verify } = require("jsonwebtoken");


//al usar el middleware se busca el token de autenticacion en el header de la peticion y si esta se devuelve el ID del usuario correspondiente. 
const isAuth = req =>{

    const authorization =  req.headers['authorization']

    if(!authorization) {
        return res.status(403).send({message: 'La peticion no tiene la cabecera de autenticación'});
    }

    const token = authorization.split(' ')[1]

    const {userId} = verify(token, process.env.ACCESS_TOKEN_SECRET)

    return userId
}


module.exports = {
    isAuth

}
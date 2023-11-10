require('dotenv/config')

const express = require('express');
const cors  = require('cors');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const {verify} = require('jsonwebtoken');
const {hash, compare} = require('bcryptjs');


const { 
    createAccessToken,
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken
 } = require('./services/tokens');
const { isAuth } = require('./services/isAuth');
const router = require('./routes');
const { getUser } = require('./controllers/user');


//CONEXION  A BASE DE DATOS
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@tpfinal.bg9gdys.mongodb.net/tpfinal?retryWrites=true&w=majority`

mongoose.Promise = global.Promise;
mongoose.connect(url)
    .then(() => {
        
        console.log("La conexión a la base de datos se ha realizado correctamente")
    
    })
    .catch(err => console.log(err));


////SERVIDOR
const PORT = process.env.PORT
const app = express();

app.set('view engine', 'ejs');

//MIDDLEWARES
app.use( cors());
app.use(express.json());  //soprta JSON-encoded en bodies request
app.use(express.urlencoded({extended:true}))  //soporta URL-encoded bodies
app.use(cookieParser()) //manejo de cookies

app.use(express.static('public'));



app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

app.use(router)


///HASTA ACA TODO BIEN...



app.post('/registro', async (req, res)=>{
    const {email, password} = req.body

    try{
        // Se verifica si el usuario existe
        const user = db.find(user => user.email === email)
        if (user){
            throw new Error('El usuario ya existe')
        }
        // Si el usuario no existe se hashea la contraseña
        const hashedPassword = await hash(password,10)

        //Se guarda el usuario en la DB
        db.push({
            id: db.length,
            email: email,
            password: hashedPassword
        })
        console.log(db)

        res.send({
            message: 'Usuario creado con exito'
        })
        

    }catch (err){
        res.send({
            error: `${err.message}`
        })
    }
})


// app.post('/login', async (req, res)=>{
//     const {email, password} = req.body

//     try{
//         // Se verifica si el usuario existe
//         const user = db.find(user => user.email === email)
        
//         // Si el usuario no existe se envia un error
//         if (!user){
//             throw new Error('El usuario no existe')
//         }

//         //se valida la contraseña 
//         const valid = await compare(password, user.password)
//         if (!valid) throw new Error('La contraseña es incorrecta')
        
//         //se crea el accesstoken y refreshtoken
//         const accessToken = createAccessToken(user.id)
//         const refreshToken = createRefreshToken(user.id)

//         //se guerda el RefreshToken en la DB
//         user.refreshToken = refreshToken

//         //se envia el refreshtoken como cookie y el acces de forma normal. 
//         sendAccessToken(req, res, accessToken)
//         sendRefreshToken(res, refreshToken)
        
        

//     }catch (err){
//         res.send({
//             error: `${err.message}`
//         })
//     }
// })


app.post('/logout', async (req, res)=>{
    res.clearCookie('refreshToken', {path:'/refresh_tokens'})
    res.send({
        message: 'Sesion cerrada'
    })
})

app.post('/protected', async (req,res)=>{

    try {
        const userId = isAuth(req)

        if(userId !== null){
            res.send({
                data: 'data protegida'
            })
        }

    } catch (error) {
        res.send({
            error: `${err.message}`
        })
    }
})

// app.post('/refresh_tokens', (req, res)=>{
//     const token = req.cookies.refreshToken;

//     //si no tengo un token devuelvo un accessToken vacio
//     if(!token) return res.send({ accessToken: ''})

//     //si tengo un token tengo que verificarlo
//     let payload = null
//     try {
//         payload = verify(token, process.env.REFRESH_TOKEN_SECRET)
//     } catch (error) {
//         return res.send({accessToken: ''})
//     }

//     //Token valido >>  Validación del usuario
//     const user = getUser(req, res)
//     if(!user) return res.send({ accessToken: ''})
//     //Usuario valido >> validación del refreshToken 
//     if(user.refreshToken !== token ) return res.send({ accessToken: ''})

//     //Si el usuario  y el token son  validos se crea un accesToken
//     const accessToken = createAccessToken(user.email)
//     const refreshToken = createRefreshToken(user.email)
    
//     user.refreshToken = refreshToken //se actualiza el token en DB

//     sendRefreshToken(res, refreshToken);
//     return res.send({accessToken})

    


// })



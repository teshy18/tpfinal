require('dotenv/config')

const express = require('express');
const cors  = require('cors');
const cookieParser = require('cookie-parser');
const {verify} = require('jsonwebtoken');
const {hash, compare} = require('bcryptjs');

const  { MongoClient } = require('mongodb');
const {db} = require('../db/db');

const { 
    createAccessToken,
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken
 } = require('./tokens');

const { isAuth } = require('./isAuth');


const server = express();
const port = process.env.PORT

//midlewares
//manejo de cookies
server.use(cookieParser())

//CORS ---- cambiar la ruta segun el host del front.
server.use(
    cors({
        origin: 'http://localhost:3000',
        credentials:true
    })
    );

//Soporte en peticiones
server.use(express.json());  //soprta JSON-encoded en bodies request
server.use(express.urlencoded({extended:true}))  //soporta URL-encoded bodies



server.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})


server.get('/', (req, res) => {
res.send('Hello World!')
})

server.post('/registro', async (req, res)=>{
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


server.post('/login', async (req, res)=>{
    const {email, password} = req.body

    try{
        // Se verifica si el usuario existe
        const user = db.find(user => user.email === email)
        
        // Si el usuario no existe se envia un error
        if (!user){
            throw new Error('El usuario no existe')
        }

        //se valida la contraseña 
        const valid = await compare(password, user.password)
        if (!valid) throw new Error('La contraseña es incorrecta')
        
        //se crea el accesstoken y refreshtoken
        const accessToken = createAccessToken(user.id)
        const refreshToken = createRefreshToken(user.id)

        //se guerda el RefreshToken en la DB
        user.refreshToken = refreshToken

        //se envia el refreshtoken como cookie y el acces de forma normal. 
        sendAccessToken(req, res, accessToken)
        sendRefreshToken(res, refreshToken)
        
        

    }catch (err){
        res.send({
            error: `${err.message}`
        })
    }
})


server.post('/logout', async (req, res)=>{
    res.clearCookie('refreshToken', {path:'/refresh_tokens'})
    res.send({
        message: 'Sesion cerrada'
    })
})

server.post('/protected', async (req,res)=>{

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

server.post('/refresh_token', (req, res)=>{
    const token = req.cookies.refreshToken;

    //si no tengo un token devuelvo un accessToken vacio
    if(!token) return res.send({ accessToken: ''})

    //si tengo un token tengo que verificarlo
    let payload = null
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        return res.send({accessToken: ''})
    }

    //Token valido >>  Validación del usuario
    const user = db.find(user => user.id === payload.user)
    if(!user) return res.send({ accessToken: ''})
    //Usuario valido >> validación del refreshToken 
    if(user.refreshToken !== token ) return res.send({ accessToken: ''})

    //Si el usuario  y el token son  validos se crea un accesToken
    const accessToken = createAccessToken(user.id)
    const refreshToken = createRefreshToken(user.id)
    
    user.refreshToken = refreshToken //se actualiza el token en DB

    sendRefreshToken(res, refreshToken);
    return res.send({accessToken})

    


})


// //MONGODB
// //credenciales
// const user = 'sebastesitore'
// const password = 'witrYvPkLOWJIMRO'

// //dbconection
// const uri = `mongodb+srv://${user}:${password}@tpfinal.bg9gdys.mongodb.net/?retryWrites=true&w=majority`

// const client = new MongoClient(uri)


// async function run() {
//     try {
//         await client.connect();
//         // database and collection code goes here
//         const db = client.db("sample_guides");
//         const coll = db.collection("comets");

//         // FINDS 
//         // const cursor = coll.find({
//         //     $and: [{ orderFromSun: { $gt: 2 } }, { orderFromSun: { $lt: 5 } }],
//         //   });

        
//         // INSERT
//         // const docs = [
//         //     {name: "Halley's Comet", officialName: "1P/Halley", orbitalPeriod: 75, radius: 3.4175, mass: 2.2e14},
//         //     {name: "Wild2", officialName: "81P/Wild", orbitalPeriod: 6.41, radius: 1.5534, mass: 2.3e13},
//         //     {name: "Comet Hyakutake", officialName: "C/1996 B2", orbitalPeriod: 17000, radius: 0.77671, mass: 8.8e12}
//         // ];

//         // //InsertMany
//         // const result = await coll.insertMany(docs); //el objeto resultado guarda los ids de los objetos insertados en la db
//         // console.log(result.insertedIds);//imprime el resultado de la operacion insertMany


//         // //UPDATE   
//         // const filter = {};
//         // const updateDoc = {
//         //     $mul: {
//         //         radius: 1.60934
//         //     }
//         // };
//         // const result = await coll.updateMany(filter, updateDoc);

        
//         // //RESULT
//         // console.log("Number of documents updated: " + result.modifiedCount);
//         // //imprime el numero de operaciones realizadas.

//         //DELETE
//          // delete code goes here
//     const doc = {
//         orbitalPeriod: {
//           $gt: 5,
//           $lt: 85
//         }
//       };
//       const result = await coll.deleteMany(doc);
//        // amount deleted code goes here
//     console.log("Number of documents deleted: " + result.deletedCount);

        
//         // const cursor = coll.find()
//         // // iterate code goes here
//         // await cursor.forEach(console.log);

//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }

// run().catch(console.dir);


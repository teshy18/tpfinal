
const User = require('../models/user');
const {hash, compare} = require('bcryptjs');
const { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken } = require('../services/tokens');
const { ObjectId } = require('mongodb');


module.exports = {
  // addUser: async (req, res) => {
  //   const { email, password } = req.body;

  //   if (!email || !password ) {
  //     return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  //   }

  //   const user = new User({
  //     email,
  //     password,
  //   });

  //   try {
  //     const newItem = await item.save();
  //     res.status(201).json(newItem);
  //   } catch (error) {
  //     console.error('Error al agregar el elemento:', error);
  //     res.status(500).json({ message: 'Error interno del servidor' });
  //   }
  // },
 
 
  getUser: async (req, res) => {
    const {email, password} = req.body
    try {
      const user = await User.findOne({ email })
      res.json(user);
    } catch (error) {
      console.error('Error al obtener los elementos:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },



  loginUser: async (req, res) =>{
      const {email, password} = req.body
      console.log('usuario logueando...')

    try{
        // Se verifica si el usuario existe
        const user = await User.findOne({ email })
        
     
        // Si el usuario no existe se envia un error
        if (!user){
            throw new Error('El usuario no existe')
        }
        
        //se valida la contraseña 
        const valid = await compare(password, user.password)
        if (!valid) throw new Error('La contraseña es incorrecta')
        
        //se crea el accesstoken y refreshtoken
        const accessToken = createAccessToken(user._id.toHexString())
        const refreshToken = createRefreshToken(user._id.toHexString())
        
        //se guerda el RefreshToken en la DB
        // User.findOneAndUpdate({email: email}, { $set: { refreshToken: refreshToken }})
        user.refreshToken = refreshToken
        await user.save()
        
        
        console.log(`usuario '${user.nick} logueado con exito!`)

        // //se envia el refreshtoken como cookie y el access de forma normal. 
        sendRefreshToken(res, refreshToken)
        sendAccessToken(req, res, accessToken)
        
        

    }catch (error){
      console.error();
        res.send({
            error: `${error}`
        })
    }
  }

};



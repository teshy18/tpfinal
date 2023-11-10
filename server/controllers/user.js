
const User = require('../models/user');
const {hash, compare} = require('bcryptjs');
const { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken } = require('../services/tokens');


module.exports = {
  getUser: async (req, res) => {
    try {
      const user = await User.find();
      res.json(user);
    } catch (error) {
      console.error('Error al obtener los elementos:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  addUser: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password ) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const user = new User({
      email,
      password,
    });

    try {
      const newItem = await item.save();
      res.status(201).json(newItem);
    } catch (error) {
      console.error('Error al agregar el elemento:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },


  loginUser: async (req, res) =>{
      const {email, password} = req.body
      console.log(email)

    try{
        // Se verifica si el usuario existe
        const user = await User.findOne({ email })
        console.log('usuario desde base de datos: ', user)//posiblemente de error
        // Si el usuario no existe se envia un error
        if (!user){
            throw new Error('El usuario no existe')
        }

        //se valida la contraseña 
        const valid = await compare(password, user.password)
        if (!valid) throw new Error('La contraseña es incorrecta')
        
        //se crea el accesstoken y refreshtoken
        const accessToken = createAccessToken(user._id)
        const refreshToken = createRefreshToken(user._id)
         
        
        //se guerda el RefreshToken en la DB
       
        Model.findOneAndUpdate(user, { refreshToken })

        //se envia el refreshtoken como cookie y el acces de forma normal. 
        sendAccessToken(req, res, accessToken)
        sendRefreshToken(res, refreshToken)
        
        

    }catch (err){
        res.send({
            error: `${err.message}`
        })
    }
  }

};



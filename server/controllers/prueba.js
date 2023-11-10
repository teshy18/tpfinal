
const Prueba2 = require('../models/p');


module.exports = {


  addUserP: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password ) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const usuairoP = new Prueba2({
      email,
      password,
    });

    try {
      const newUser  = await usuairoP.save();
      res.send(newUser);

    } catch (error) {
      console.error('Error al agregar el elemento:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
    
  },



};



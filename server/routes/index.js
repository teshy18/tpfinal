const express = require('express');
const { loginUser, getUser } = require('../controllers/user');
const router = express.Router();



// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// define the home page route
router.get('/', function(req, res) {
  console.log('usuario en main..')
  res.render('main');
});


//Login
router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', function(req, res) {
  console.log('logueando' , req.body)
  loginUser(req, res) 

 

  // res.send('logueando');
});

//REGISTER
router.get('/register', function(req, res) {
  res.render('registro');
});

router.post('/refresh_token', (req, res)=>{
  const token = req.cookies.refreshToken;
  console.log('buscando refrehstoken...')
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
  
  const user = getUser(req, res)
  if(!user) return res.send({ accessToken: ''})
  //Usuario valido >> validación del refreshToken 
  if(user.refreshToken !== token ) return res.send({ accessToken: ''})

  //Si el usuario  y el token son  validos se crea un accesToken
  const accessToken = createAccessToken(user.email)
  const refreshToken = createRefreshToken(user.email)
  
  user.refreshToken = refreshToken //se actualiza el token en DB

  sendRefreshToken(res, refreshToken);
  return res.send({accessToken})

  


})

module.exports = router;
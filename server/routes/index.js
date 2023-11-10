const express = require('express');
const { loginUser } = require('../controllers/user');
const { addUserP } = require('../controllers/prueba');
const prueba = require('../controllers/prueba');
const router = express.Router();



// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// define the home page route
router.get('/', function(req, res) {
  console.log('usuario en main..')
  res.send('Main');
});


//Login
router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', function(req, res) {
  loginUser(req, res)

  // res.send('logueando');
});

//REGISTER
router.get('/register', function(req, res) {
  addUserP(req, res)
  res.send('Registrar usuario');
});

router.post('/prueba', function(req, res){
 addUserP(req,res)
})

module.exports = router;
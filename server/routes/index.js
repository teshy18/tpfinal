const express = require('express');
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
  res.send('About birds');
});

//REGISTER
router.get('/register', function(req, res) {
  res.send('Registrar usuario');
});


module.exports = router;
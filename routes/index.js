var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bem Vindo!' });
  console.log("app inicializado e respondendo");
});


router.get('/register', function(req, res, next){
  res.render('register', { title: 'Criar conta'});
});


const userController = require('../modules/user/userController');
const authMiddleware = require('../middlewares/auth');

// Rota POST para processar o form de cadastro
router.post('/register', userController.register);

// Rota para processar o formulário de login
router.post('/login', userController.login);

// Rota para processar o logout
router.get('/logout', userController.logout);

// Rota para exibir o feed de vídeos (protegida por autenticação)
router.get('/feed', authMiddleware, (req, res) => {
   res.render('home', { user: req.session.user });
});


module.exports = router;

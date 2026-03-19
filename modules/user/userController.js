const User = require('./userModel');
const bcrypt = require('bcrypt');


exports.register = async(req, res) => {
    const {username, email, password, confirmPassword, fullName } = req.body;
    console.log("Dados do formulário: ", username, email)

    try{
        if (password !== confirmPassword) {
            req.flash('error','As senhas não coincidem!');
            return res.redirect('/register');
        }

        const emailExists = await User.findOne({where: {email}});
        const usernameExists = await User.findOne({where:{username}});
        if (emailExists || usernameExists){
            req.flash('error','Este email ou usuário já está cadastrado');
            return res.redirect('/register')
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(password, hashedPassword);

        await User.create({
            username,
            email,
            password: hashedPassword,
            fullName
        });

        req.flash('success','Conta criada com sucesso! Faça seu login.');
        res.redirect('/login');
    }
    catch(error)
    {
        console.log(error);
        req.flash('error','Erro ao criar conta! Tente novamente.');
        res.redirect('/register');
    }
}; 

exports.login = async (req, res) => {
   try {
      const { login, password } = req.body;

      const user = await User.findOne({
         where: {
            [require('sequelize').Op.or]: [{ email: login }, { username: login }]
         }
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
         req.flash('error', 'E-mail/Usuário ou senha incorretos.');
         return res.redirect('/login');
      }

      req.session.user = {
         id: user.id,
         username: user.username,
         email: user.email
      };

      res.redirect('/feed');

   } catch (error) {
      console.error(error);
      req.flash('error', 'Ocorreu um erro ao tentar entrar.');
      res.redirect('/login');
   }
};


exports.logout = (req, res) => {
   req.session.destroy(() => {
      res.redirect('/');
   });
};

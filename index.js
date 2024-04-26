// Importações necessárias
const express = require('express');
const bcrypt = require('bcrypt');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');
const User = require('./models/user');
require('./connect');

// Extração de variáveis de configuração
const { port, secret, adminEmail, adminPassword } = config;

// Inicialização do aplicativo Express
const app = express();

// Configurações do aplicativo
app.set('config', config);
app.set('pkg', pkg);

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authMiddleware(secret));

// Função assíncrona para verificar e criar o usuário administrador
async function initAdminUser() {
  try {
    const existingAdminUser = await User.findOne({ email: adminEmail });

    if (!existingAdminUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const adminUser = new User({
        email: adminEmail,
        password: hashedPassword,
        roles: ['admin'],
      });
      await adminUser.save();
      console.log('Usuário administrador criado com sucesso!');
    }
  } catch (error) {
    throw new Error(`Erro ao inicializar o usuário administrador: ${error.message}`);
  }
}

// Inicialização do usuário administrador e servidor
initAdminUser().then(() => {
  routes(app, (err) => {
    if (err) {
      throw new Error(`Erro ao registrar rotas: ${err.message}`);
    }

    app.use(errorHandler);

    app.listen(port, () => {
      console.info(`App listening on port ${port}`);
    });
  });
}).catch((error) => {
  console.error(error.message);
  process.exit(1);
});

// Exportação do aplicativo Express
module.exports = app;
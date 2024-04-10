const express = require('express');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');
const bcrypt = require('bcrypt');
const User = require('./models/user');
require('./connect');

const { port, secret, adminEmail, adminPassword } = config;
const app = express();

app.set('config', config);
app.set('pkg', pkg);

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authMiddleware(secret));

// Verificar e criar usuário administrador
async function initAdminUser() {
  try {
    // Verificar se o usuário admin já existe no banco de dados
    const existingAdminUser = await User.findOne({ email: adminEmail });

    // Se o usuário admin não existir, criá-lo e salvá-lo no banco de dados
    if (!existingAdminUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const adminUser = new User({
        email: adminEmail,
        password: hashedPassword,
        roles: ["admin"]
      });
      await adminUser.save();
      console.log('Usuário administrador criado com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao inicializar o usuário administrador:', error.message);
    process.exit(1); // Encerra o aplicativo em caso de erro
  }
}

initAdminUser().then(() => {
  // Registrar rotas após a criação do usuário administrador
  routes(app, (err) => {
    if (err) {
      throw err;
    }

    app.use(errorHandler);

    app.listen(port, () => {
      console.info(`App listening on port ${port}`);
    });
  });
}).catch((error) => {
  console.error('Erro ao verificar e criar usuário administrador:', error);
});

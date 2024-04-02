const express = require('express');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg = require('./package.json');
const { connect } = require('./connect');

const { port, secret } = config;
const app = express();

app.set('config', config);
app.set('pkg', pkg);

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authMiddleware(secret));

// Conectando ao banco de dados
connect().then(() => {
  // Registrar rutas
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
  console.error('Erro ao conectar ao banco de dados:', error);
});

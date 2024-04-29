const mongoose = require('mongoose');
const config = require('./config');

async function connectToDatabase() {
  try {
    console.log('Conectando ao banco de dados...');

    // let dbUrl;

    // if (process.env.MONGODB_URI) {
    //   dbUrl = process.env.MONGODB_URI; 
    // } else {
    //   dbUrl = config.dbUrl;
    // }

    const dbUrl = config.dbUrl;
    console.info(dbUrl);

    const db = await mongoose.connect(dbUrl);

    if (db.connection.readyState === 1) {
      console.log(`Conectado ao banco de dados ${db.connection.name}`);
    } else {
      console.log(`Banco de dados '${db.connection.name}' criado com sucesso.`);
    }

    return db; 
  } catch (error) {
    console.error('Erro ao conectar-se ao banco de dados:', error);
    throw new Error('Não foi possível se conectar ao banco de dados.');
  }
}

connectToDatabase();

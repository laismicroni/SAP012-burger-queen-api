const mongoose = require('mongoose');
const config = require('./config');

async function connectToDatabase() {
  try {
    console.log('Conectando ao banco de dados...');

    // let dbUrl;

    // if (process.env.MONGO_URL) {
    //   dbUrl = process.env.MONGO_URL; 
    // } else {
    //   dbUrl = config.dbUrl;
    // }

    dbUrl = config.dbUrl;

    const db = await mongoose.connect(dbUrl, { dbName: 'burguer-queen-db' });

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

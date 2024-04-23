const mongoose = require('mongoose');
const config = require('./config');

async function connectToDatabase() {
  try {
    console.log('Conectando ao banco de dados...');
    const db = await mongoose.connect(config.dbUrl, { dbName: 'burguer-queen-db' });

    // Verifique se o banco de dados precisa ser criado
    if (db.connection.readyState === 1) {
      console.log(`Conectado ao banco de dados ${db.connection.name}`);
    } else {
      console.log(`Banco de dados '${db.connection.name}' criado com sucesso.`);
    }

    return db; // Retorne a instância de conexão do banco de dados
  } catch (error) {
    console.error('Erro ao conectar-se ao banco de dados:', error);
    throw new Error('Não foi possível se conectar ao banco de dados.');
  }
}

connectToDatabase();

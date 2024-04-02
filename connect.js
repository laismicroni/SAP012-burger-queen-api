const mongoose = require("mongoose");
const config = require("./config");

const { dbUrl } = config;

async function connect() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
}

module.exports = { connect };

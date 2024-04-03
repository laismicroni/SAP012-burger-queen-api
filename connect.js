const mongoose = require("mongoose");
const config = require("./config");
const { MongoClient } = require('mongodb');

const { dbUrl } = config;

async function connect() {
  try {
    await mongoose.connect(dbUrl);
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
}

// let db;

// async function connect() {
//   if (db) {
//     return db;
//   }
//   const client = new MongoClient(dbUrl);
//   try {
//     await client.connect();
//     const db = client.db('bq'); // Reemplaza <NOMBRE_DB> por el nombre del db
//     return db;
//   } catch (error) {
//     console.error(e);
//   }
// }

module.exports = { connect };


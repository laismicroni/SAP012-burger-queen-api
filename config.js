//require('dotenv').config();

exports.port = process.argv[2] || process.env.PORT || 8080;
exports.dbUrl = process.env.MONGODB_URI || process.env.DB_URL || 'mongodb://bq:secret@localhost:27017'; 
exports.secret = process.env.JWT_SECRET || 'esta-es-la-api-burger-queen';
exports.adminEmail = process.env.ADMIN_EMAIL || 'admin@localhost';
exports.adminPassword = process.env.ADMIN_PASSWORD || 'changeme';


const mongoose = require('mongoose');

// Connection to stock DB
const dbConnection1 = mongoose.createConnection('mongodb://localhost/FYPDatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// Connection to Credentials DB
const dbConnection2 = mongoose.createConnection('mongodb://localhost/Credentials', { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = { dbConnection1, dbConnection2 };

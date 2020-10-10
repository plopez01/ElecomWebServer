const express = require('express');
const app = express();

// Controllers
var AuthController = require('./controllers/auth');
var DatabaseController = require('./controllers/database')

DatabaseController.setupDatabase('Users','id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, pskhash TEXT, salt TEXT');

// Routes
app.get('/login', AuthController.loginUser);


app.listen(3000);
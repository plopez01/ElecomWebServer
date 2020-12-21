const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Controllers
var AuthController = require('./controllers/auth');
var DatabaseController = require('./controllers/database')

DatabaseController.setupDatabase('Users','id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, username TEXT, pskhash TEXT, salt TEXT, session TEXT');

// Routes
app.post('/login', AuthController.loginUser);

app.post('/register', AuthController.registerUser);

app.get("/see", DatabaseController.returnAllEntries);


app.listen(3000);
console.log('[Server/INFO] Server Ready!')
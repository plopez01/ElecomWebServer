const fs = require("fs");
const express = require('express');
const app = express();
const dbFile = "./data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

db.serialize(() =>{
  if(!exists){
    db.run("CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, pskhash TEXT, salt TEXT)");
    console.log("Creating Users Table...");
  } else {
    console.log("Users Database ready!");
  }
  
});

// load routes

// routes
var UserController = require('./controllers/user');

app.get('/login', UserController.loginUser);




app.listen(3000);
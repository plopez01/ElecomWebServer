const express = require('express');
const app = express();
const dbFile = "./data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

db.serialize(() =>{
  if(!exists){
    db.run("CREATE TABLE Users (id INTEGRER PRIMARY KEY AUTOINCREMENT, name TEXT, pskhash TEXT, salt TEXT)");
    console.log("Creating Users Table...");
  } else {
    console.log("Users Database ready!");
  }
  
});

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.listen(3000);
const dbFile = "./data/sqlite.db";
const httpCodes = require('../util/responseCodes.json');
const fs = require("fs");
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

module.exports = {
    //Creates a table with name and arguments if not exists
    setupDatabase(name, args){
        db.serialize(() =>{
          if(!exists){
            db.run(`CREATE TABLE ${name} (${args})`);
            console.log(`Creating ${name} Table...`);
          } else {
            console.log(`${name} Database ready!`);
          }
        });
    },
    registerUserDB(email){
      db.run('INSERT INTO Users (email) VALUES (?)', email);
      console.log("Inserted");
    },
    loginUserDB(email, pass){    
      db.all(`SELECT * from Users WHERE email=?`, email, function(err, rows) {
          if(err) { 
            console.error(err);
            return httpCodes.INTERNAL_SERVER_ERROR;
          }
          if(rows.length == 0){
            console.log("Not found");
            return httpCodes.NOT_FOUND;
          }else{
            console.log("The user exists");
            console.log(rows[0]);
            return httpCodes.OK;
          }
      });
    }

}
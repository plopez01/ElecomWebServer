const dbFile = "./data/sqlite.db";
const httpCodes = require('../util/responseCodes.json');
const crypoUtils = require('../util/crypto')
const fs = require("fs");
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

module.exports = {
  // DEBUG
  // Todo: delete when not needed
  returnAllEntries(request, response){
    db.all("SELECT * from Users", (err, rows) => {
      response.send(JSON.stringify(rows));
    });
  },

  //Creates a table with name and arguments if not exists
  setupDatabase(name, args){
      db.serialize(() =>{
        if(!exists){
          console.log(`Creating ${name} Table...`);
          db.run(`CREATE TABLE ${name} (${args})`);
          console.log(`${name} Database ready!`);
        } else {
          console.log(`${name} Database ready!`);
        }
      });
  },
  registerUserDB(email, pass, username){
    return new Promise(function(resolve) {
      const cEmail = crypoUtils.cleanseString(email);
      const cPass = crypoUtils.cleanseString(pass);
      const cUsername = crypoUtils.cleanseString(username);
  
      const passwordData = crypoUtils.sha512Salt(cPass);
  
      db.all(`SELECT * from Users WHERE email=?`, cEmail, function(err, rows) {
        if(err) { 
          console.error(err);
          resolve(httpCodes.INTERNAL_SERVER_ERROR);
        }
        if(rows.length == 0){
          db.run('INSERT INTO Users (email, username, pskhash, salt) VALUES (?, ?, ?, ?)', [cEmail, cUsername, passwordData.hash, passwordData.salt], function(err){
            if(err) { 
              console.error(err);
              resolve(httpCodes.INTERNAL_SERVER_ERROR);
            }
            console.log(`Registered new User with email: ${cEmail}`);
            resolve(httpCodes.OK);
          });
        }else{
          resolve(httpCodes.NOT_ACCEPTABLE);
        }
      });
    });
  },
  loginUserDB(email, pass){   
    return new Promise(function(resolve) {

      const cEmail = crypoUtils.cleanseString(email);
      const cPass = crypoUtils.cleanseString(pass);

      db.all(`SELECT * from Users WHERE email=?`, cEmail, function(err, rows) {
        if(err) { 
          console.error(err);
          resolve(httpCodes.INTERNAL_SERVER_ERROR);
        }
        if(rows.length == 0){
          resolve(httpCodes.NOT_FOUND);
        }else{
          
          const incomingSaltedHash = crypoUtils.sha512Salt(cPass, rows[0].salt);

          if(rows[0].pskhash == incomingSaltedHash.hash){
            console.log(`Logged new User with email: ${cEmail}`);
            resolve(httpCodes.OK);
          }else{
            resolve(httpCodes.UNAUTHORIZED);
          }

          
        }
      });
    });
  }

}
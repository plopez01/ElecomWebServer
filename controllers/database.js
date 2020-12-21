const dbFile = "./data/sqlite.db";
const httpCodes = require('../util/responseCodes.json');
const cryptoUtils = require('../util/crypto')
const fs = require("fs");

//Crete data folder if doesn't exist
if (!fs.existsSync('./data')) {
  console.log('[Database/INFO] Creating data directory...');
  fs.mkdirSync('./data');
}

const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

function handleError(resolve, err){
  if(err) { 
    console.error('[Database/ERROR] ' + err);
    resolve({ statusCode: httpCodes.INTERNAL_SERVER_ERROR });
  }
}
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
        console.log(`[Database/INFO] Creating ${name} Table...`);
        db.run(`CREATE TABLE ${name} (${args})`);
      }
      console.log(`[Database/INFO] ${name} Database ready!`);
    });
  },
  registerUserDB(email, pass, username){
    return new Promise(function(resolve) {
      const cEmail = cryptoUtils.cleanseString(email);
      const cPass = cryptoUtils.cleanseString(pass);
      const cUsername = cryptoUtils.cleanseString(username);
  
      const passwordData = cryptoUtils.sha512Salt(cPass);
      
      //Create the session token from the sum of email and pass with a new salt
      //TODO: Is this secure? probably not so much
      const session = cryptoUtils.sha512Salt(cEmail+cPass).hash;

      db.all(`SELECT * from Users WHERE email=?`, cEmail, function(err, rows) {
        handleError(resolve, err);
        if(rows.length == 0){
          db.run('INSERT INTO Users (email, username, pskhash, salt, session) VALUES (?, ?, ?, ?, ?)', [cEmail, cUsername, passwordData.hash, passwordData.salt, session], function(err){
            handleError(resolve, err);
            console.log(`[Database/INFO] Registered new User with email: ${cEmail}`);
            resolve({ statusCode: httpCodes.OK, sessionToken: session});
          });
        }else{
          resolve({ statusCode: httpCodes.NOT_ACCEPTABLE });
        }
      });
    });
  },
  loginUserDB(email, pass){   
    return new Promise(function(resolve) {

      const cEmail = cryptoUtils.cleanseString(email);
      const cPass = cryptoUtils.cleanseString(pass);

      const session = cryptoUtils.sha512Salt(cEmail+cPass).hash;

      db.all(`SELECT * from Users WHERE email=?`, cEmail, function(err, rows) {
        handleError(resolve, err);
        if(rows.length == 0){
          resolve({ statusCode: httpCodes.NOT_FOUND });
        }else{
          const incomingSaltedHash = cryptoUtils.sha512Salt(cPass, rows[0].salt);

          if(rows[0].pskhash == incomingSaltedHash.hash){
            db.all(`UPDATE Users SET session=? WHERE email=?`, [session, cEmail], function(err) {
              handleError(resolve, err);
              console.log(`[Database/INFO] Logged User with email: ${cEmail}`);
              resolve({ statusCode: httpCodes.OK, sessionToken: session });
            });
          }else{
            resolve({ statusCode: httpCodes.UNAUTHORIZED });
          }
        }
      });
    });
  }
}
const dbFile = "./data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);
const fs = require("fs");

module.exports = {
    setupDatabase(name, args){
        db.serialize(() =>{
            if(!exists){
              db.run(`CREATE TABLE ${name} (${args})`);
              console.log(`Creating ${name} Table...`);
            } else {
              console.log(`${name} Database ready!`);
            }
        });
    }
}
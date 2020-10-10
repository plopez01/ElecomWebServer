const { Database } = require('sqlite3');
var DatabaseController = require('../controllers/database');


module.exports = {
    loginUser(req, res){
       
        var params = req.body;

        var email = params.email;

        var pass = params.pass;

        if(email){
            res.status(DatabaseController.loginUserDB(email, pass));
        }else{
            res.status(400).send({message: 'Falta el parametro'});
        }
    },
    
    registerUser(req, res){
        
    }
    
}
const { Database } = require('sqlite3');
const DatabaseController = require('../controllers/database.js');
const httpCodes = require('../util/responseCodes.json');

module.exports = {
    loginUser(req, res){
       
        var params = req.body;

        var email = params.email;

        var pass = params.pass;

        if(email){
            res.status(DatabaseController.loginUserDB(email, pass));
        }else{
            res.status(httpCodes.NOT_FOUND).send({message: 'Falta el parametro'});
        }
    },
    
    registerUser(req, res){

    }
    
}
const { Database } = require('sqlite3');
var DatabaseController = require('../controllers/database')


module.exports = {
    loginUser(req, res){
       
        var params = req.body;

        var email = params.email;

        if(email){
            DatabaseController.loginUserDB(email);
        }else{
            return res.status(404).send({message: 'Falta el parametro'})
        }
    }
    
}
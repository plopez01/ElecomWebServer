const DatabaseController = require('../controllers/database.js');
const httpCodes = require('../util/responseCodes.json');

module.exports = {
    loginUser(req, res){
        var body = req.body;

        if(body.email && body.password){
            DatabaseController.loginUserDB(body.email, body.password).then(function(response){
                res.status(response.statusCode).send(response.userData);
            });
        }else{
            res.status(httpCodes.BAD_REQUEST).send({message: 'Missing parameters'});
        }
    },
    registerUser(req, res){
        var body = req.body;

        if(body.email && body.password && body.username){
            DatabaseController.registerUserDB(body.email, body.password, body.username).then(function(response){
                res.status(response.statusCode).send(response.userData);
            });
        }else{
            res.status(httpCodes.BAD_REQUEST).send({message: 'Missing parameters'});
        }
    }
}
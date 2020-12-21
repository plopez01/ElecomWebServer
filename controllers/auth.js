const DatabaseController = require('../controllers/database.js');
const httpCodes = require('../util/responseCodes.json');

module.exports = {
    loginUser(req, res){
        var body = req.body;

        if(body.email && body.password){
            DatabaseController.loginUserDB(body.email, body.password).then(function(data){
                res.status(data.statusCode).send(data.sessionToken);
            });
        }else{
            res.status(httpCodes.BAD_REQUEST).send({message: 'Missing parameters'});
        }
    },
    registerUser(req, res){
        var body = req.body;

        if(body.email && body.password && body.username){
            DatabaseController.registerUserDB(body.email, body.password, body.username).then(function(data){
                res.status(data.statusCode).send(data.sessionToken);
            });
        }else{
            res.status(httpCodes.BAD_REQUEST).send({message: 'Missing parameters'});
        }
    }
}
function loginUser(req, res){
    res.status(200).send({
        message: 'Hola'
    }); 
}

module.exports = {
    loginUser
}
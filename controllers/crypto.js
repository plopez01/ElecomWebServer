const crypto = require('crypto');

var genSalt = function(len){
    return crypto.randomBytes(Math.ceil(len/2)).toString('hex').slice(0, len);
}

module.exports = {
    sha512Salt(password){
        const salt = genSalt(16);

        var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    
        hash.update(password);
        var value = hash.digest('hex');
        return {
                salt:salt,
                passwordHash:value
        };
    } 
}
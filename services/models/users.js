var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var userSchema = mongoose.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    }
}, {timestamps: true});

var User = module.exports = mongoose.model('users', userSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.passwoord, salt, function(err, hash){
            if(err) throw err;

            newUser.passwoord = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback){
    var query = {_id : id};
    User.findOne(query, callback);
};

module.exports.resetPassword = function(username, newPassword, callback){
    User.getUserByUsername(username, function(err, user){
        if(err) throw err;

        if(user){
            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(newPassword, salt, function(err, hash){
                    user.passwoord = hash;
                    user.save(callback);
                });
            });
        }
            
    });
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        if(err) throw err;

        callback(null, isMatch);
    });
};
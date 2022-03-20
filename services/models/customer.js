var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    phone: {
        type: String,
        index: true
    },
    gender: {
        type: String
    },
    age: {
        type: Number
    },
    photo_url: {
        type: String
    }
}, {timestamps: true});

var Customer = module.exports = mongoose.model('customers', userSchema);

module.exports.createCustomer = function(newCustomer, callback){
    newCustomer.save(callback);
};

module.exports.getUserByPhone = function(phone, callback){
    var query = {phone: phone};
    Customer.findOne(query, callback);
}

// statistical visualization, for example.
module.exports.getAllMale = function(callback){
    var query = {gender: 'Male'};
    Customer.find(query, callback);
}
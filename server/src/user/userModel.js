//dependencies
const mongoose = require('mongoose');

//schema library
const Schema = mongoose.Schema;

//initialize user schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
});

//export user model
module.exports = mongoose.model('user', userSchema, 'employees');
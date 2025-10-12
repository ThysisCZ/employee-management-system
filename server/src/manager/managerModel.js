// dependencies
const mongoose = require('mongoose');

// define manager schema
const managerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 60,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePicture: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    }
}, {
    timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// export model
module.exports = mongoose.model('Manager', managerSchema);
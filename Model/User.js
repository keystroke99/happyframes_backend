let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// Basic User Schema for Google Authentication
const userSchema = new Schema({
    email: {
        type: String,
        default:null
    },
    googleId: {
        type: String,
        default: null
    },
    facebookId: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('User', userSchema);
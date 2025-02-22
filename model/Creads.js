const mongoose = require("mongoose");

const credsSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile_picture: {
        type: String,
        // required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
});

const Cred = mongoose.model("credential", credsSchema);

module.exports = Cred;
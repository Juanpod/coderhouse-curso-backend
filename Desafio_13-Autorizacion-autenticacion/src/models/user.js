const mongoose = require('mongoose');
const usersCollection = "users";

const userSchema = new mongoose.Schema({
    name: String,
    username:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required:true
    }
});

const UserModel = mongoose.model(usersCollection, userSchema);
module.exports = {UserModel};
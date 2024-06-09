const mongoose =require('mongoose');

const userSchema= new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    phone: {
        type:Number,
        required:true,
        unique:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    role:{
      type:String,
      required:true  
    },
    password:{
        type:String,
        required:true,
    },
    profileImg:{
        type:String,
        required:true
    },
    savePlaylist:{
        type:Array
    }

    
})

const Register =new mongoose.model("Register",userSchema);

module.exports =Register;
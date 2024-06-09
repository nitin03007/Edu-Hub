const mongoose=require('mongoose');

const playlistSchema= new mongoose.Schema({
    playlist_name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    teacher_Email:{
        type:String,
        required:true
    },
    teacher_Name:{
        type:String,
        required:true
    },
    teacher_Img:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    }
})


const Playlist= new mongoose.model('playist',playlistSchema);

module.exports= Playlist;
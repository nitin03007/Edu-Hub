const mongoose=require('mongoose');


const videoSchema =mongoose.Schema({
    video_name:{
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
    playlist_Name:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    videoFile_name:{
        type:String,
        required:true,
    }
})

const Video= new mongoose.model('video',videoSchema);

module.exports=Video;
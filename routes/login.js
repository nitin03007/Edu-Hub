var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const { GoogleGenerativeAI } = require('@google/generative-ai');

const multer =require('multer');

const loginController= require("../controller/loginController");

const auth=require("../middleware/auth");
const session = require('express-session');

var dotenv =require('dotenv');
dotenv.config({ path: "./config.env" });


const GAPI_KEY = process.env.API_KEY ; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(GAPI_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

router.post('/generate-response', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        console.log("Response->>>>",response);
        const text = response.text();
        console.log("Text ->>>>>",text);
        res.json({ message: text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error generating response' });
    }
});





// Storage and Filename Setting
let storage=multer.diskStorage({
  destination:"public/backendImages/",
  filename: (req,file,cb)=>{

    const uniqueFilename = Date.now() + '-' + file.originalname;
    cb(null, uniqueFilename);

    // cb(null,file.originalname)
  }
})

let upload=multer({
  storage:storage
})


/* GET home page. */
router.get('/',auth.isLogout, function(req, res) {
  res.render('login',{data:req.session});
});

router.get('/login',auth.isLogout, function(req, res) {
  res.render('login',{name:req.session.name});
});

router.get('/about', function(req, res) {
  res.render('about',{data:req.session});
});


router.get('/contactus', function(req, res) {
  res.render('contactus',{data:req.session});
});

// For Student Registeration
router.get("/signup",auth.isLogout,function(req,res){
  res.render("signup",{data:req.session});
})

// For Teacher Registeration
router.get("/tsignup",auth.isLogout,function(req,res){
  res.render("tsignup",{data:req.session});
})

router.get('/view_profile',auth.isLogin,async function(req,res){

  teacher_Email=req.query.teacher_email;

  teacher_Name=req.query.teacher_name;

  try {

    const Teacher =require('../models/register_model');
    const Playlist = require("../models/playlist_model");

    const Video = require("../models/video_model");

    var teacher_img= await Teacher.findOne({email:teacher_Email},{
      profileImg:1,_id:0})
    
    var play_count= await Playlist.countDocuments({teacher_Email:{$eq:teacher_Email}}) 

    var t_playlist= await Playlist.find({teacher_Email:teacher_Email}); 

    var video_count= await Video.countDocuments({teacher_Email:{$eq:teacher_Email}})  

    const user = await Teacher.findOne({ email: req.session.email }); // Find the document based on the email field
    if (user) {
       var playlistSize = user.savePlaylist.length; // Get the size of the 'savePlaylist' array using the length property
        console.log("Size of savePlaylist array:", playlistSize);
      }

    console.log(play_count,'VideoCount ->',video_count);

    teacher_detail={
      name: teacher_Name,
      email:teacher_Email,
      img:teacher_img.profileImg,
      v_count:video_count,
      play_count:play_count
    }

    console.log(teacher_detail);

  } catch (error) {
    console.log("Playlist Count Error ",error)
  }

  res.render('view_profile',{data:req.session,teacher_detail:teacher_detail,t_playlist:t_playlist,playlistSize});
})

router.get("/home",auth.isLogin, async function(req,res){

  teacher_Email=req.session.email;

  try {
    
    const Register =require('../models/register_model');

    const Playlist = require("../models/playlist_model");

    var t_playlist= await Playlist.find().limit(6); 

    const user = await Register.findOne({ email: req.session.email }); // Find the document based on the email field
        if (user) {
            var playlistSize = user.savePlaylist.length; // Get the size of the 'savePlaylist' array using the length property
            console.log("Size of savePlaylist array:", playlistSize);
            
        }

  } catch (error) {
    console.log("Playlist Count Error ",error)
  }


  res.render("home",{data:req.session,t_playlist:t_playlist,playlistSize});
})

router.get("/t_home",auth.isLogin, async function(req,res){

  teacher_Email=req.session.email;

  try {
    const Playlist = require("../models/playlist_model");

    const Video = require("../models/video_model");
    
    var play_count= await Playlist.countDocuments({teacher_Email:{$eq:teacher_Email}}) 

    var t_playlist= await Playlist.find().limit(6); 

    var video_count= await Video.countDocuments({teacher_Email:{$eq:teacher_Email}})  

    console.log(play_count,'VideoCount ->',video_count);

  } catch (error) {
    console.log("Playlist Count Error ",error)
  }

  res.render("t_home",{data:req.session,play_count:play_count,video_count:video_count,t_playlist:t_playlist});
})  


router.get('/courses',auth.isLogin,async function(req,res){

  teacher_Email=req.session.email;

  try {
    const Playlist = require("../models/playlist_model");

    var t_playlist= await Playlist.find(); 


  } catch (error) {
    console.log("Playlist fetch Error ",error)
  }


  res.render('courses',{data:req.session,t_playlist:t_playlist})
});

router.get('/teachers',auth.isLogin,async function(req,res){


  var teacher_detail=[];

  try {
    const Playlist = require("../models/playlist_model");

    const Video = require("../models/video_model");

    const Teacher =require("../models/register_model");

    const teachers = await Teacher.find({role:"Teacher"});

    for (const teacher of teachers) {
      // Get the count of playlists created by the teacher
      const playlistCount = await Playlist.countDocuments({ teacher_Email: teacher.email });

      // Get the count of videos uploaded by the teacher
      const videoCount = await Video.countDocuments({ teacher_Email: teacher.email });

      // Create an object with the teacher's information, playlist count, and video count
      const teacherInfo = {
          name: teacher.name,
          img:teacher.profileImg,
          email: teacher.email,
          playlists: playlistCount,
          videos: videoCount
      };

      // Push the teacher information object to the teacher_count array
      teacher_detail.push(teacherInfo);
  }

  console.log("Teacher Detail:", teacher_detail);

  } catch (error) {
    console.log("Playlist Count Error ",error)
  }

  res.render('teachers',{data:req.session,teacher_detail:teacher_detail})
})


router.get("/t_playlist",auth.isLogin, async function(req,res){

  teacher_Email=req.session.email;

  try {
    const Playlist = require("../models/playlist_model");

    
    var t_playlist= await Playlist.find({teacher_Email:teacher_Email}) 

    console.log(t_playlist);
  } catch (error) {
    console.log("Playlist Count Error ",error)
  }


  res.render('t_playlist',{data:req.session,t_playlist:t_playlist})
})

router.get('/watch_video', auth.isLogin, async function(req,res){

  teacher_Email=req.session.email;
  video_name=req.query.video_name;

  try {
    const Video = require("../models/video_model");

    // const Playlist = require("../models/playlist_model");
    // var playlist= await Playlist.findOne({playlist_name:playlist_name}) 
    
    var video_detail= await Video.findOne({video_name:video_name}) 

    console.log(video_detail);

  } catch (error) {
    console.log("Video PLay Error ",error)
  }

  res.render('watch_video',{data:req.session,video_detail})
})

router.get("/v_upload",auth.isLogin, async function(req,res){

  teacher_Email=req.session.email;

  try {
    const Playlist = require("../models/playlist_model");
    
    var playList= await Playlist.find({teacher_Email:{$eq:teacher_Email}},{playlist_name:1,_id:0}) 

    console.log("PlayList made by Teacher",playList);

  } catch (error) {
    console.log("Playlist Fetch Error ",error)
  }


  res.render('v_upload',{data:req.session,playList:playList });
})

router.get('/p_create',auth.isLogin, function(req,res){
  res.render('p_create',{data:req.session});
})

router.get('/playlist_detail',auth.isLogin,async function(req,res){

  teacher_Email=req.session.email;
  playlist_name=req.query.playlist_name;

  try {
    const Video = require("../models/video_model");

    const Playlist = require("../models/playlist_model");
    var playlist= await Playlist.findOne({playlist_name:playlist_name}) 
    
    var playlist_detail= await Video.find({playlist_Name:playlist_name}) 

    console.log(playlist_detail);

  } catch (error) {
    console.log("Playlist Fetch Error ",error)
  }

  res.render('playlist_detail',{data:req.session,playlist_detail:playlist_detail,playlist:playlist})
})

router.get('/std_playlist',auth.isLogin,async function(req,res){

  std_email=req.query.std_email;

  var save_playlist = [];

  try {
    const Playlist = require("../models/playlist_model");

    const Student =require("../models/register_model");

    var playLists= await Student.find({email:{$eq:std_email}},{savePlaylist:1,_id:0}) 
    // const playlists = await Student.find({savePlaylist});


    // console.log(playLists)

    

  for (const playlistData of playLists) {
    const playlists = playlistData.savePlaylist;

    for (const playlist of playlists) {
      const playlistInfo = await Playlist.find({ playlist_name: playlist });
      // console.log(playlistInfo);
      save_playlist.push(playlistInfo);
    }
  }



  var new_playlist=save_playlist.flat();

  console.log("Save Playlist Detail:", new_playlist);

  } catch (error) {
    console.log("Playlist Count Error ",error)
  }




  res.render('std_playlist',{data:req.session,save_playlist:new_playlist})
})

router.post('/contactus',loginController.contactus);

router.post('/del_std_playlist',loginController.del_std_playlist);

router.post('/std_playlist',loginController.std_playlist);

router.post('/t_playlist',loginController.delete_playlist);

router.post('/p_create',upload.single('p_thumbnail'),loginController.create_playlist);

router.post('/v_upload',upload.fields([{ name: 'v_thumbnail', maxCount: 1 }, { name: 'video', maxCount: 1 }]),loginController.upload_video);

router.post("/signup",upload.single('profileImg'), loginController.register);

router.post("/login",loginController.login);

router.get("/logout",auth.isLogin,async function(req,res){ 
  try {
    req.session.destroy();
    res.redirect('/');
    
  } catch (error) {
    console.error(error);
  }
})


module.exports = router;

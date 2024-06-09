const bcrypt = require("bcrypt"); // Import bcrypt library
const { log, Console } = require("console");
const fs=require('fs');
var path = require('path');
// const nodemailer = require('nodemailer');
const emailjs = require('emailjs-com');


const login= async (req,res)=>{
    const data={
        email:req.body.email,
        password:req.body.password
    };

    try {
        const Register = require("../models/register_model");
        // console.log(req.body.email);
        const check=await Register.findOne({email:req.body.email});

        // console.log(check.password);

        if(!check){
            // res.send("User Name Cannot Found");
            return res.status(400).json({ success: false, message: "User Doesn't Exist!!" });
        }
        // Compare the Hash password from the database
        const isPassword= await bcrypt.compare(req.body.password, check.password);
        console.log(isPassword);
        if(isPassword){
            // res.render("home");

            // sess=req.session;
            // sess.name=check.name;
            // sess.email=check.email;
            req.session.user_id=check._id;
            req.session.email=check.email;
            req.session.role=check.role;
            req.session.name=check.name;
            req.session.profileImg=check.profileImg;
            console.log(req.session.email);
            res.status(200).json({ success: true, message: "Login Successfully",role:check.role });
        }
        else{

            return res.status(400).json({ success: false, message: "Wrong Password!!!" });
            // res.send("Wrong Password!!!");
        }
    } catch (error) {
        // console.log("in Catch");
        console.error("Error Occured at Catch --> ",error);
        // res.send("Error Occured!!!");
        res.status(500).json({ success: false, message: "Error Occured in Logging Data" });
    }


};


const register = async (req, res) => {
    const data = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        role:req.body.role,
        password: req.body.pass,
        profileImg :req.file.filename
    };

    console.log(req.body);
    console.log(data);

    try {
        const Register = require("../models/register_model");

        const existingUser_email = await Register.findOne({ email: data.email });
        const existingUser_phone = await Register.findOne({ phone: data.phone });

        if (existingUser_email || existingUser_phone) {
            return res.status(400).json({ success: false, message: "User Already Exists. Please Choose Different Email or Phone Number!!" });
        } else {
            // Hashing the Password

            const saltround = 10;
            const hashpassword = await bcrypt.hash(data.password, saltround);

            data.password = hashpassword;

            const userdata = await Register.insertMany([data]);
            console.log("Data Inserted ->", userdata);
            res.status(200).json({ success: true, message: "Data Inserted Successfully" });
        }

    } catch (error) {
        console.error("Error Inserting Data:", error);
        res.status(500).json({ success: false, message: "Error Inserting Data" });
    }
};






const create_playlist= async(req,res)=>{
    const data = {
        playlist_name: req.body.title,
        description: req.body.description,
        teacher_Email: req.body.teacher_email,
        teacher_Name:req.body.teacher_Name,
        teacher_Img:req.body.teacher_Img,
        thumbnail:req.file.filename
    };

    console.log(req.body);
    console.log(data);

    try {
        const Playlist = require("../models/playlist_model");

        const existing_playlist = await Playlist.findOne({ playlist_name: data.playlist_name });

        if (existing_playlist ) {
            return res.status(400).json({ success: false, message: "Play list Already Exists. Please Choose Different Name For Your Playlist" });
        } else {

            const playlistdata = await Playlist.insertMany([data]);
            console.log("Data Inserted ->", playlistdata);
            return res.status(200).json({ success: true, message: "Playlist Created Successfully" });
        }

    } catch (error) {
        console.error("Error Creating Playlist", error);
        return res.status(500).json({ success: false, message: "Error Creating Playlist" });
    }
}

const upload_video= async(req,res)=>{

    const data = {
        video_name : req.body.title,
        description : req.body.description,
        teacher_Email : req.body.teacher_email,
        teacher_Name:req.body.teacher_Name,
        teacher_Img:req.body.teacher_Img,
        playlist_Name : req.body.playlist,
        thumbnail : req.files['v_thumbnail'][0].filename, // Assuming the field name is 'v_thumbnail'
        videoFile_name : req.files['video'][0].filename // Assuming the field name is 'video'

    }

    console.log(req.body);
    console.log(data);

    try {
        const Video = require("../models/video_model");

        const existing_video = await Video.findOne({ video_name: data.video_name });
        console.log("Here------");
        if (existing_video ) {
            return res.status(400).json({ success: false, message: "Video Already Exists. Please Choose Different Name For Your Video" });
        } else {
            console.log("Here-----elsers-");
            const videodata = await Video.insertMany([data]);
            console.log("Data Inserted ->", videodata);
            return res.status(200).json({ success: true, message: "Video Uploaded Successfully" });
        }

    } catch (error) {
        console.error("Error Uploading Video", error);
        return res.status(500).json({ success: false, message: "Error Uploading Video" });
    }


};


const delete_playlist= async(req,res)=>{

    const playlist_name=req.body.playlist_name;
    const thumbnail =req.body.thumbnail;

    console.log(playlist_name,thumbnail);
    try {

        const dir =path.join(__dirname.replace("\controller",""));

        const Playlist = require('../models/playlist_model');
    
        const Video =require('../models/video_model');
    
        const v_count= await Video.find({ playlist_Name: playlist_name },{videoFile_name:1,thumbnail:1,_id:0});

        const playlistDeleteResult = await Playlist.deleteOne({ playlist_name: playlist_name });
        
        if (playlistDeleteResult.deletedCount > 0) {
            // Playlist deleted successfully
            console.log('Playlist deleted successfully');
            
            // Delete associated videos
            const videoDeleteResult = await Video.deleteMany({ playlist_Name: playlist_name });
    
            // Check if videos were deleted
            if (videoDeleteResult.deletedCount > 0) {
                console.log('Associated videos deleted successfully');
                // Delete associated images/files
                v_count.forEach(element => {
                    
                    fs.unlinkSync(dir+`/public/backendImages/${element.thumbnail}`);
                    fs.unlinkSync(dir+`/public/backendImages/${element.videoFile_name}`);
                });
            } else {
                console.log('No associated videos found');
            }
            fs.unlinkSync(dir+`/public/backendImages/${thumbnail}`);
            return res.status(200).json({ success: true, message: "Playlist Deleted Successfully" });
        } else {
            console.log('Playlist not found or not deleted');
            return res.status(404).json({ success: false, message: "Playlist not found or not deleted" });
        }
    } 
        
     catch (error) {
        console.log("Error in Deleting Playlist",error);
        return res.status(500).json({ success: false, message: "Error in Deleting Playlist" })
    }



};

const contactus = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone=req.body.number;
    const message=req.body.msg;


    emailjs
    .send(
      "service_0sky6do",
      "template_5zptrts",
      {
        from_name: name,
        from_email: email,
        phone_number: phone,
        message: message,
      },
      'TDfqTALbUgjq5cvEE' // Your user ID from EmailJS
    )
    .then((response) => {
      console.log('Email sent:', response.status, response.text);
      return res.status(200).json({ success: true, message: "Email Sent" });
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      return res.status(500).json({ success: false, message: "Email Not Sent !!, Try again!!" });
    });

};

const std_playlist = async (req, res) => {
    const playlist_name = req.body.playlist_name;
    const student_email = req.body.student_email;

    console.log(playlist_name, student_email);

    try {
        const Register = require("../models/register_model");

        const user = await Register.findOne({ email: student_email });

        if (user) {
            if (user.savePlaylist.includes(playlist_name)) {
                console.log("Playlist Already Exists");
                // return "Playlist Already Exists";
                return res.json({ success: false, message: "Playlist Already Exists!!" });
                // return res.status(400).json({ success: false, message: "Playlist Already Exists." });
            } else {
                user.savePlaylist.push(playlist_name);
                await user.save(); // Save the updated user document
                console.log("Playlist added to user's saved playlists:", student_email, playlist_name);
                return res.status(200).json({ success: true, message: "Playlist Saved Successfully" });
            }
        } else {
            console.log("User not found");
            return res.status(404).json({ success: false, message: "User not found." });
        }

    } catch (error) {
        console.error("Error Saving Playlist", error);
        return res.status(500).json({ success: false, message: "Error Saving Playlist" });
    }
};


const del_std_playlist=async(req,res)=>{

    const playlist_name = req.body.playlist_name;
    const student_email = req.body.student_email;

    console.log(playlist_name, student_email);

    try {
        const Register = require("../models/register_model");

        const user = await Register.findOne({ email: student_email });

        if (!user) {
            console.log("User not found");
            return res.status(404).json({ success: false, message: "User not found." });
        }

            // Remove playlist from savePlaylist array
            const updatedUser = await Register.findOneAndUpdate(
                { email: student_email },
                { $pull: { savePlaylist: playlist_name } },
                { new: true }
            );

            if (updatedUser) {
                console.log("Playlist removed from user's saved playlists:", student_email, playlist_name);
                return res.status(200).json({ success: true, message: "Playlist removed successfully." });
            } else {
                console.log("Playlist not found in user's saved playlists");
                return res.status(404).json({ success: false, message: "Playlist not found in user's saved playlists." });
            }
        

    } catch (error) {
        console.error("Error Removing Playlist", error);
        return res.status(500).json({ success: false, message: "Error Removing Playlist" });
    }


}



module.exports = {
    register: register, // Export the register function
    login:login,
    create_playlist:create_playlist,
    upload_video : upload_video,
    delete_playlist:delete_playlist,
    std_playlist:std_playlist,
    del_std_playlist:del_std_playlist,
    contactus:contactus
};

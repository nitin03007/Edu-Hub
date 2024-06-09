const mongoose =require("mongoose");

mongoose.connect("mongodb://localhost:27017/E-learning",{
    // useNewUrlParse:true,
    // useUnifiedToplogy:true,
    // useCreateIndex:true
}).then(()=>{
    console.log("Connection Succesfull");
}).catch((e)=>{
    console.log('NO Connection Error->',e );
})


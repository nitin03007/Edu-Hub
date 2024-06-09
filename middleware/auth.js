
const isLogin =async(req,res,next)=>{
    
    try {

        if(!req.session.user_id){
            // console.log("Logined Not Done");
            return res.redirect('/');
        }
        
        next();

        
    } catch (error) {
        console.log("In The Catch ---->>>>")
        console.log(error.message);
    }

}

const isLogout= async(req,res,next)=>{

    try {
        if(req.session.user_id){
            // console.log("logi n done");
            return res.redirect('/home');
        }
        next();

        
    } catch (error) {
        console.log("In The Catch ---->>>>")
        console.error(error);
    }
}


module.exports={
    isLogin,
    isLogout
}
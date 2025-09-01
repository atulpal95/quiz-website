module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.path,",,",req.originalUrl )
      if(! req.isAuthenticated()){
        // redirect 
        req.session.redirectUrl=req.originalUrl;
          
          return res.redirect("/login");
          
        }
  next();
  }


  module.exports.saveRedirecrUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
  }
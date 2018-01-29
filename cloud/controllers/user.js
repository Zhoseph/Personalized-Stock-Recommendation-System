var temp = require('../utilities/PageTemp');
//New_User:direct to signup page, method:get
exports.newUser = function (req,res) {
    if(req.session.user==null){
        res.render("signup.html",temp.normal("Signup",{err:null}));
    }else{
        res.redirect("http://localhost:1337/home")//when use get request "/user_new_user" after successful login
    }
}
//Login   method:post
exports.login = function(req,res){
        var username=req.body.username;
        var password=req.body.password;
        Parse.User.logIn(username,password,{
            success:function(user){
                //console.log(user.currentUser())
                console.log("user.getSessionToken():"+user.getSessionToken());
                var x = {"username":req.body.username,"id":user.id,"sessionToken":user.getSessionToken(),"risk_level":user.get("Personal_Risk_Level")};
                //var x={username:req.body.username,id:user.id};
                x.formatString = JSON.stringify(x);
                req.session.user = x;
                //bind local variables and redirect
                console.log("login创建的session是"+JSON.stringify(req.session));
                if(user.get("Personal_Risk_Level")==null){
                    res.redirect("/home/profile");
                }else{res.render('dashboard.html',temp.dashboard("Dashboard",
                    {user:req.session.user}));}
                //res.redirect("http://localhost:1337/home");
            },
            error:function(user,error){
                console.log("user.js"+error);
                res.render('login.html',temp.normal("Login",null));
            }
        });
};

//Signup method:post
exports.signUp = function(req,res){
    var user=new Parse.User();
    user.set("username",req.body.username);
    user.set("password",req.body.password);
    user.set("eamil",req.body.email);
    user.signUp(null,{
        success:function(user){
            console.log(user);
            console.log("token:"+user._sessionToken);
            var b ={username:req.body.username,id:user.id};
            req.session.user = b;
            res.redirect("http://localhost:1337/home");
        },
        error:function(user,error){
            console.log("error.message",error.message);
            res.render("signup.html",temp.signup("Signup",{err:error.message}));
        }
    });
}
//Logout
exports.logout=function (req,res,next) {
    req.session.destroy();
    next();
}
/**
 * Created by Ming on 11/20/16.
 */
var temp = require('../utilities/PageTemp');
exports.auth = function(req,res,next){
    if(req.session == null|| req.session.user == null){
        res.render('login.html',temp.normal("Login",null));
    }else {
        next();
    }
};
//
exports.transURL = function(req,res,next){
    if(req.session.user == null){
        res.render('login.html',temp.normal("Login",null));
    }else {
        next();
    }
};

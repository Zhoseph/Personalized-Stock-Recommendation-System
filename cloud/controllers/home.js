var temp = require('../utilities/PageTemp');
//var db = require("./db_Connection");
var mysql      = require('mysql');
var async      = require('async');
var connection = mysql.createConnection({
    host     : 'sql3.freemysqlhosting.net',
    user     : 'sql3147554',
    password : 'x87VNPD7Qg',
    database : 'sql3147554'
});
connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... nn"+err.message);
    }
});
//Home
exports.home=function(req,res){
    if(req.session.user.risk_level==null){
        res.redirect("/home/profile");
    }else{
        console.log("exports.home");
        res.render('dashboard.html',temp.dashboard("Dashboard",{user:req.session.user,content:"dashboard"}));
    }
};
//Dashboard
exports.dashboard=function(req,res){
    if(req.session.user.risk_level==null){
        //idle
    }else{
        res.render('dashboard.html',temp.dashboard("Dashboard",{user:req.session.user,content:"dashboard"}));
    }

};
//Profile
exports.profile=function(req,res){
        res.render('profile.html',temp.dashboard("Dashboard",{user:req.session.user,content:"profile"}));
};
exports.psychological_profile=function(req,res){
        res.render('psychological_profile.html', temp.dashboard("Psychological Profile", {
            user: req.session.user,
            content: "psychological_profile"
        }));

};

exports.reservation=function(req,res){

    if(req.session.user.risk_level==null){
        //idle
    }else {
        res.render('stockList.html', temp.dashboard("Stock List", {user: req.session.user, content: "stoclList"}));
    }
};
exports.stock_detail=function(req,res){

    //connection.end();

    res.render('stockDetail.html',temp.dashboard("Stock Detail",{user:req.session.user,
        "stock_code":req.params.code}));

};
exports.stock_comparison = function (req,res) {
    var todayDate=new Date(new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate());
    var dayOfThisWeek=new Date().getDay() - 1;
    console.log("dayOfThisWeek",dayOfThisWeek);
    //var dayOfLastLastYear=new Date().setDate(today.getDate()-7*52*2);
    var thisMonday = new Date(todayDate.getTime() - 1000*60*60*24*dayOfThisWeek);
    var thisFriday = new Date(todayDate.getTime() + 1000*60*60*24*(5-dayOfThisWeek-1));
    var monday = new Date(thisMonday);
    var friday = new Date(thisFriday);
    var mondayOfLastWeek = new Date(thisMonday.setDate(thisMonday.getDate()-7));
    var fridayOfLastWeek = new Date(thisFriday.setDate(thisFriday.getDate()-7));
    var mondayOfLastYear = new Date(thisMonday.setDate(thisMonday.getDate()-7*52));
    var fridayOfLastYear = new Date(thisFriday.setDate(thisFriday.getDate()-7*52));
    var mondayOf2YearAgo = new Date(thisMonday.setDate(thisMonday.getDate()-7*52));
    var fridayOf2YearAgo = new Date(thisFriday.setDate(thisFriday.getDate()-7*52));
    console.log("monday",monday);
    console.log("friday",friday);
    console.log("mondayOfLastWeek",mondayOfLastWeek);
    console.log("fridayOfLastWeek",fridayOfLastWeek);

    console.log("mondayOfLastYear",mondayOfLastYear);
    console.log("fridayOfLastYear",fridayOfLastYear);

    console.log("mondayOf2YearAgo",mondayOf2YearAgo);
    console.log("fridayOf2YearAgo",fridayOf2YearAgo);

    var sql0 = "select * from daily_price where symbol_id = (select id from symbol where abbrev = '"+req.params.code+"')" +
        " and ((price_date BETWEEN '"+ monday.getFullYear() + "-" + parseInt(monday.getMonth()+1) + "-" +monday.getDate()
        +"' and  '"+ friday.getFullYear() + "-" + parseInt(friday.getMonth()+1) + "-" + friday.getDate()
        +"') or ("
        +" price_date BETWEEN '" +mondayOfLastWeek.getFullYear() + "-" + parseInt(mondayOfLastWeek.getMonth()+1) + "-" + mondayOfLastWeek.getDate()
        +"' and '" +fridayOfLastWeek.getFullYear() + "-" + parseInt(fridayOfLastWeek.getMonth()+1) + "-" + fridayOfLastWeek.getDate()
        +"') or ("
        +" price_date BETWEEN '" +mondayOfLastYear.getFullYear() + "-" + parseInt(mondayOfLastYear.getMonth()+1) + "-" + mondayOfLastYear.getDate()
        +"' and '" +fridayOfLastYear.getFullYear() + "-" + parseInt(fridayOfLastYear.getMonth()+1) + "-" + fridayOfLastYear.getDate()
        +"') or ("
        +" price_date BETWEEN '" +mondayOf2YearAgo.getFullYear() + "-" + parseInt(mondayOf2YearAgo.getMonth()+1) + "-" + mondayOf2YearAgo.getDate()
        +"' and '" +fridayOf2YearAgo.getFullYear() + "-" + parseInt(fridayOf2YearAgo.getMonth()+1) + "-" + fridayOf2YearAgo.getDate()+"'))";

    var sql1 = "select * from daily_price where symbol_id = (select id from symbol where abbrev = '"+req.params.code+"')" +
        " and (price_date BETWEEN '"+ monday.getFullYear() + "-" + parseInt(monday.getMonth()+1) + "-" +monday.getDate()
        +"' and  '"+ friday.getFullYear() + "-" + parseInt(friday.getMonth()+1) + "-" + friday.getDate()
        +"')";

    var sql2 = "select * from daily_price where symbol_id = (select id from symbol where abbrev = '"+req.params.code+"')" +
        " and ("
        +" price_date BETWEEN '" +mondayOfLastWeek.getFullYear() + "-" + parseInt(mondayOfLastWeek.getMonth()+1) + "-" + mondayOfLastWeek.getDate()
        +"' and '" +fridayOfLastWeek.getFullYear() + "-" + parseInt(fridayOfLastWeek.getMonth()+1) + "-" + fridayOfLastWeek.getDate()
        +"')";

    var sql3 = "select * from daily_price where symbol_id = (select id from symbol where abbrev = '"+req.params.code+"')" +
        " and price_date  BETWEEN '" +mondayOfLastYear.getFullYear() + "-" + parseInt(mondayOfLastYear.getMonth()+1) + "-" + mondayOfLastYear.getDate()
        +"' and '" +fridayOfLastYear.getFullYear() + "-" + parseInt(fridayOfLastYear.getMonth()+1) + "-" + fridayOfLastYear.getDate()
        +"' ";
    var sql4 = "select * from daily_price where symbol_id = (select id from symbol where abbrev = '"+req.params.code+"')" +
        " and price_date  BETWEEN '" +mondayOf2YearAgo.getFullYear() + "-" + parseInt(mondayOf2YearAgo.getMonth()+1) + "-" + mondayOf2YearAgo.getDate()
        +"' and '" +fridayOf2YearAgo.getFullYear() + "-" + parseInt(fridayOf2YearAgo.getMonth()+1) + "-" + fridayOf2YearAgo.getDate()+"'";

    console.log("sql1",sql1);
    console.log("sql2",sql2);
    console.log("sql3",sql3);
    console.log("sql4",sql4);


            async.parallel({
                thisWeek:function(callback) {
                    connection.query(sql1,
                        function(err, rows, fields) {
                            if (!err) {
                                callback(null,rows);
                            }else {
                                console.log('Error while performing Query.'+err.message);
                            }
                        });
                },
                lastWeek:function(callback) {
                    connection.query(sql2,
                        function(err, rows, fields) {
                            if (!err) {
                                callback(null,rows);
                            }else {
                                console.log('Error while performing Query.'+err.message);
                            }
                        });
                },
                weekOfLastYear:function(callback){
                    connection.query(sql3,
                        function(err, rows, fields) {
                            if (!err) {
                                callback(null,rows);
                            }else {
                                console.log('Error while performing Query.'+err.message);
                            }
                        });
                },
                weekOf2YearsAgo:function(callback){
                    connection.query(sql4,
                        function(err, rows, fields) {
                            if (!err) {
                                callback(null,rows);
                            }else {
                                console.log('Error while performing Query.'+err.message);
                            }
                        });
                }
            }, function(err, results) {
                // optional callback
                console.log(results);
                res.send(results);
            });
            //connection.end();

    //connection.end();
};

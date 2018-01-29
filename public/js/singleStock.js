/**
 * Created by Ming on 12/1/16.
 */
app.controller('SingleStockCtrl',function($scope,$http,theBiggerService){
    $scope.$on('current_user_handle_broadcast', function() {
        $scope.$apply(function() {
            console.log("ProfileCtrl heard current user changing");
            $scope.currentUser = theBiggerService.getCurrentUser();
            $scope.currentUser.age = $scope.currentUser.get("age");
            $scope.currentUser.wealthPercentage = $scope.currentUser.get("wealthPercentage");
            $scope.currentUser.netWealth = $scope.currentUser.get("netWealth");
            $scope.currentUser.stageOfLifeValue = $scope.currentUser.get("stageOfLifeValue");
            $scope.currentUser.decisionMakingStyleValue = $scope.currentUser.get("decisionMakingStyleValue");
            $scope.currentUser.selectedStockList = $scope.currentUser.get("stockSubscribe");
            $scope.currentUser.Personal_Risk_Level = $scope.currentUser.get("Personal_Risk_Level");
            console.log("$scope.currentUser", $scope.currentUser);
            $scope.getStandardDeviation();
            $scope.getComparisonData();
        });
    });
    $scope.getComparisonData = function () {
        console.log("getComparisonData");
        async.parallel({
            mySqlData:function(cb){
                $http({
                    method: 'POST',
                    url: '/home/stock_comparison/'+global_stock_code
                }).then(function successCallback(response) {
                    cb(null,response.data);
                }, function errorCallback(response) {
                        console.error(response.message);
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                });
            },
            mongoData:function(cb){
                var todayDate=new Date(new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate());
                var dayOfThisWeek=new Date().getDay();
                console.log("dayOfThisWeek",dayOfThisWeek);
                //var dayOfLastLastYear=new Date().setDate(today.getDate()-7*52*2);
                var thisMonday = new Date(todayDate.getTime() + 1000*60*60*24*(1-dayOfThisWeek));
                var thisTuesday = new Date(todayDate.getTime() + 1000*60*60*24*(2-dayOfThisWeek));
                var thisWednesday = new Date(todayDate.getTime() + 1000*60*60*24*(3-dayOfThisWeek));
                var thisThursday = new Date(todayDate.getTime() + 1000*60*60*24*(4-dayOfThisWeek));
                var thisFriday = new Date(todayDate.getTime() + 1000*60*60*24*(5-dayOfThisWeek));
                console.log("thisMonday",thisMonday);
                console.log("thisTuesday",thisTuesday);
                console.log("thisWednesday",thisWednesday);
                console.log("thisThursday",thisThursday);
                console.log("thisFriday",thisFriday);
                var monday = new Date(thisMonday);
                var friday = new Date(thisFriday);
                var predictions = Parse.Object.extend("PredictedPrice");
                var query = new Parse.Query(predictions);
                var queryDataRange = [];
                queryDataRange.push(thisMonday.getFullYear()+"-"+parseInt(thisMonday.getMonth()+1)+"-"+thisMonday.getDate(),
                    thisTuesday.getFullYear()+"-"+parseInt(thisTuesday.getMonth()+1)+"-"+thisTuesday.getDate(),
                    thisWednesday.getFullYear()+"-"+parseInt(thisWednesday.getMonth()+1)+"-"+thisWednesday.getDate(),
                    thisThursday.getFullYear()+"-"+parseInt(thisThursday.getMonth()+1)+"-"+thisThursday.getDate(),
                    thisFriday.getFullYear()+"-"+parseInt(thisFriday.getMonth()+1)+"-"+thisFriday.getDate());
                //queryDataRange.push("2016-11-1","2016-11-28");
                console.log("queryDataRange",queryDataRange);
                query.containedIn("date", queryDataRange);
                query.equalTo("ticker_symbol",global_stock_code);

                query.find({
                    success: function (results) {
                        console.log("Successfully retrieved " + results.length + " predictions.");
                        console.log(results);
                        var pricesInRes = [];
                        results.forEach(function(i){
                            pricesInRes.push(i.get("predicted_price"));
                        });
                        cb(null,pricesInRes);
                    },
                    error: function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });
            }
        }, (function(err, results){
            console.log("final result:",JSON.stringify(results));
            var data = {
                labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                datasets: [
                    {
                        label: "Prediction in this week",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(223, 31, 86,0.4)",
                        borderColor: "rgba(223, 31, 86,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: results.mongoData,
                        spanGaps: false,
                    },
                    {
                        label: "This Week",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: _.map(results.mySqlData.thisWeek, 'close_price'),
                        spanGaps: false,
                    }/*{
                        label: "Last Week",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(159, 141, 95,0.4)",
                        borderColor: "rgba(159, 141, 95,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(191,63,191,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: _.map(results.mySqlData.lastWeek, 'close_price'),
                        spanGaps: false,
                        hidden: true,
                    }*//*,{
                        label: "The Week of Last Year",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(223, 168, 31,0.4)",
                        borderColor: "rgba(223, 168, 31,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(191,63,191,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: _.map(results.mySqlData.weekOfLastYear, 'close_price'),
                        spanGaps: false,
                        hidden: true,
                    },*//*{
                        label: "The Week of 2 Year Ago",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(63, 191, 63,0.4)",
                        borderColor: "rgba(63, 191, 63,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(63, 191, 63,1)",
                        pointHoverBorderColor: "rgba(63, 191, 63,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: _.map(results.mySqlData.weekOf2YearsAgo, 'close_price'),
                        spanGaps:false,
                    }*/
                ]
            };
            var ctx1 = document.getElementById("stock-comparison-close_price-graph");
            var myLineChart = new Chart(ctx1, {
                type: 'line',
                data: data

            });
        }));

    };

    $scope.getStandardDeviation = function(){
        var sd = Parse.Object.extend("StandardDeviation");
        var sdQuery = new Parse.Query(sd);
        sdQuery.containedIn("year", [new Date().getFullYear(),new Date().getFullYear()-1]);
        sdQuery.equalTo("ticker_symbol",global_stock_code);
        sdQuery.find({
            success: function (inresults) {
                console.log("standard deviation: Successfully retrieved " + inresults.length + " predictions.");
                console.log(inresults);
                var sdOfThisYear = [];
                var sdOfLastYear = [];
                inresults.forEach(function (i) {

                    if(i.get("year") == new Date().getFullYear()-1){
                        sdOfLastYear.push(i.get("standard_deviation"));
                    }else if(i.get("year") == new Date().getFullYear()){
                        sdOfThisYear.push(i.get("standard_deviation"));
                    }
                });
                console.log("sdOfThisYear",sdOfThisYear);
                console.log("sdOfLastYear",sdOfLastYear);
                var data = {
                    labels: ["Jan", "Feb", "Mar", "Apr", "May","June","July","Aug","Sep","Oct","Nov","Dec"],
                    datasets: [
                        {
                            label: "This Year",
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: "rgba(223, 31, 86,0.4)",
                            borderColor: "rgba(223, 31, 86,1)",
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: "rgba(75,192,192,1)",
                            pointBackgroundColor: "#fff",
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: "rgba(75,192,192,1)",
                            pointHoverBorderColor: "rgba(220,220,220,1)",
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: sdOfThisYear,
                            spanGaps: false,
                        },
                        {
                            label: "Last Year",
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: "rgba(75,192,192,0.4)",
                            borderColor: "rgba(75,192,192,1)",
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: "rgba(75,192,192,1)",
                            pointBackgroundColor: "#fff",
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: "rgba(75,192,192,1)",
                            pointHoverBorderColor: "rgba(220,220,220,1)",
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: sdOfLastYear,
                            spanGaps: false,
                        }
                    ]
                };
                var ctx2 = document.getElementById("stock-sd-graph");
                var myLineChart = new Chart(ctx2, {
                    type: 'line',
                    data: data

                });
            },
            error: function (error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        });
    };
    /*$scope.$on('prediction_handle_broadcast', function() {
        $scope.$apply(function() {
            var data_prediction = theBiggerService.getPredictions();
            var data_sd = theBiggerService.getStandardDeviation();
            var sdOfThisYear = [];
            var sdOfLastYear = [];
            data_sd.forEach(function (i) {
                console.log("data_sd.forEach:",JSON.stringify(i));
                if(i.ticker_symbol == global_stock_code){
                    if(i.year == 2015){
                        sdOfLastYear.push(i.standard_deviation);
                    }else if(i.year == 2016){
                        sdOfThisYear.push(i.standard_deviation);
                    }
                }
            });
            console.log("sdOfThisYear",sdOfThisYear);
            console.log("sdOfLastYear",sdOfLastYear);
            var data = {
                labels: ["Jan", "Feb", "Mar", "Apr", "May","June","July","Aug","Sep","Oct","Nov","Dec"],
                datasets: [
                    {
                        label: "This Year",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(223, 31, 86,0.4)",
                        borderColor: "rgba(223, 31, 86,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: sdOfThisYear,
                        spanGaps: false,
                    },
                    {
                        label: "Last Year",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: sdOfLastYear,
                        spanGaps: false,
                    }
                ]
            };
            var ctx2 = document.getElementById("stock-sd-graph");
            var myLineChart = new Chart(ctx2, {
                type: 'line',
                data: data

            });
        });
    });*/

});

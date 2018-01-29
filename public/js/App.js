/**
 * Created by Ming on 11/27/16.
 */
var app = angular.module('TheBiggerApp', []);
app.factory('theBiggerService', function($rootScope) {
    $rootScope.service = {};
    $rootScope.service.loading = false;
    $rootScope.service.currentUser;
    $rootScope.service.stockPredictions;
    $rootScope.service.standardDeviation;
    // $rootScope.currentModule = "common";

    var sharedService = {};
    sharedService.currentModule = "common";
    sharedService.setLoadingState = function (state) {
        $rootScope.service.loading = state;
    };
    sharedService.updateCurrentUser = function (newUser) {
        $rootScope.service.currentUser = newUser;
    };
    sharedService.getCurrentUser = function () {
        return $rootScope.service.currentUser;
    };
    sharedService.getPredictions = function () {
        return $rootScope.service.stockPredictions;
    };
    sharedService.getStandardDeviation = function () {
        return $rootScope.service.standardDeviation;
    };
    sharedService.broadcastCurrentUser = function () {
        $rootScope.$broadcast('current_user_handle_broadcast');
    };
    sharedService.updatePredictions = function (data) {
        console.log("updatePredictions",data);
        localStorage.setItem("thebigger_predictions", data);
        $rootScope.service.stockPredictions = data;
        sharedService.broadcastPredictions();
    };
    sharedService.updateSD = function (data) {
        console.log("thebigger_standardDeviation",data);
        localStorage.setItem("thebigger_standardDeviation", data);
        $rootScope.service.standardDeviation = data;
    };
    sharedService.broadcastPredictions = function () {
        $rootScope.$broadcast('prediction_handle_broadcast');
    };
    setTimeout(function () {
        $rootScope.$apply(function () {
            Parse.User.become(currentUser.sessionToken).then(function (user) {
                $rootScope.service.currentUser = user;
                console.log("$rootScope.service.currentUser", user);
                sharedService.broadcastCurrentUser()
            }, function (error) {
                // The token could not be validated.
            });
        })
    }, 2);
    if (localStorage.getItem("prediction_handle_broadcast") == null ||
        localStorage.getItem("prediction_handle_broadcast").length == 0) {
        setTimeout(function () {
            $rootScope.$apply(function () {
                var predictions = Parse.Object.extend("PredictedPrice");
                var query = new Parse.Query(predictions);
                query.find({
                    success: function (results) {
                        console.log("Successfully retrieved " + results.length + " predictions.");
                        console.log(results);
                        var data = [];
                        results.forEach(function(s){
                            data.push({"ticker_symbol":s.get("ticker_symbol"),
                                "date":s.get("date"),
                                "predicted_price":s.get("predicted_price"),
                                "cur_price":s.get("cur_price")
                            });
                        });
                        var sd = Parse.Object.extend("StandardDeviation");
                        var sdQuery = new Parse.Query(sd);
                        sdQuery.equalTo("year", new Date().getFullYear()-1);
                        sdQuery.equalTo("month", parseInt(new Date().getMonth()+1));
                        sdQuery.find({
                            success: function (inresults) {
                                console.log("standard deviation: Successfully retrieved " + inresults.length + " predictions.");
                                console.log(inresults);
                                var indata = [];
                                inresults.forEach(function(s){
                                    indata.push({"ticker_symbol":s.get("ticker_symbol"),
                                        "standard_deviation":s.get("standard_deviation"),
                                        "year":s.get("year"),
                                        "month":s.get("month")
                                    });
                                });
                                console.log("indata",indata);
                                sharedService.updateSD(indata);
                                sharedService.updatePredictions(data);
                            },
                            error: function (error) {
                                console.log("Error: " + error.code + " " + error.message);
                            }
                        });
                    },
                    error: function (error) {
                        console.log("Error: " + error.code + " " + error.message);
                    }
                });
            })

        }, 1);
    }else {
        $rootScope.service.stockPredictions = localStorage.getItem("prediction_handle_broadcast");
        console.log($rootScope.service.stockPredictions);
    }
    return sharedService;
});

app.controller('CommonCtrl', function($scope,$http,theBiggerService) {

    $scope.dashboard=function () {
        $http.get("/home/dashboard").then(function(response){

            alert(response.toString());
        });
    };
    $scope.profile=function () {
        $http.get("/home/profile").then(
            function suc(response){
                $scope.TEST=response.data.num;
                alert(response.data.message+" at least works for profile request");},
            function fail(response){
                alert("FAILURE");
            });
    };
    $scope.setCurrentModule = function (module) {
        console.log("setCurrentModule",module);
        theBiggerService.currentModule = module;
    };
    //$scope.stageOfLifeValue;
    $scope.welcome = "welcome to this system";
/*    $scope.currentUserAtAngularjs;
    $scope.fetchCurrentUser = function(){
        $scope.currentUserAtAngularjs = parseUser;
        console.log(parseUser.username);
    }*/
});
app.controller('ProfileCtrl',function($scope,$http,theBiggerService){
    $scope.currentUser = {};
    $scope.currentUser.age = 0;
    $scope.currentUser.wealthPercentage = 0.0;
    $scope.currentUser.netWealth = 0;
    $scope.currentUser.stageOfLifeValue =0;
    $scope.currentUser.Personal_Risk_Level =0;
    $scope.currentUser.decisionMakingStyleValue = 0;
    $scope.$on('current_user_handle_broadcast', function() {
        $scope.$apply(function() {
            console.log("ProfileCtrl heard current user changing");
            $scope.currentUser = theBiggerService.getCurrentUser();
            $scope.currentUser.age = $scope.currentUser.get("age");
            $scope.currentUser.wealthPercentage = $scope.currentUser.get("wealthPercentage");
            $scope.currentUser.netWealth = $scope.currentUser.get("netWealth");
            $scope.currentUser.stageOfLifeValue = $scope.currentUser.get("stageOfLifeValue");
            $scope.currentUser.decisionMakingStyleValue = $scope.currentUser.get("decisionMakingStyleValue");
            $scope.currentUser.Personal_Risk_Level = $scope.currentUser.get("Personal_Risk_Level");
            $scope.questions = $scope.currentUser.get("decisionMakingStyleChoices");
            $scope.currentUser.styles_a = $scope.currentUser.get("styles_a");
            $scope.currentUser.styles_b = $scope.currentUser.get("styles_b");
            $scope.currentUser.styles_c = $scope.currentUser.get("styles_c");
            $scope.currentUser.styles_d = $scope.currentUser.get("styles_d");
            console.log("$scope.currentUser", $scope.currentUser);
            $scope.initQuestions();
            switch (theBiggerService.currentModule){
                case "dashboard":
                    $scope.drawRadarGraph();
                    break;
                default:
                    console.log("currentModule",theBiggerService.currentModule);
            }
            
        });
    });

    $scope.submitBasicInfo = function(){
        $scope.currentUser.set("age", $scope.currentUser.age);
        $scope.currentUser.set("wealthPercentage",$scope.currentUser.wealthPercentage);
        $scope.currentUser.set("netWealth",$scope.currentUser.netWealth);
        $scope.currentUser.set("stageOfLifeValue", $scope.currentUser.stageOfLifeValue);
        theBiggerService.setLoadingState(true);
        $scope.currentUser.save(null, {
            success: function(user) {
                $scope.$apply(function() {
                    theBiggerService.updateCurrentUser(user);
                    theBiggerService.setLoadingState(false);
                    window.location="/home/psychological_profile";
                });
            },
            error: function(user, error) {
                console.error(error);
                theBiggerService.setLoadingState(false);

            }
        });
        //下面代码可以参考
        /*Parse.User.current().set("age", $scope.currentUser.age);
         Parse.User.current().set("wealthPercentage",$scope.currentUser.wealthPercentage);
         Parse.User.current().set("netWealth",$scope.currentUser.netWealth);
         Parse.User.current().set("stageOfLifeValue", $scope.currentUser.stageOfLifeValue);
         // $rootScope.service.loading = true;

         theBiggerService.setLoadingState(true);
         Parse.User.current().save(null, {
         success: function(user) {
         $scope.$apply(function() {
         theBiggerService.updateCurrentUser(user);
         theBiggerService.setLoadingState(false);
         });
         },
         error: function(user, error) {
         console.error(error);
         theBiggerService.setLoadingState(false);

         }
         });*/
    };
    $scope.currentUser.decisionMakingStyleValue = 0;

    $scope.submitDecisionMakingStyle = function() {
        $scope.calculateRiskTolerance();
        $scope.currentUser.set("decisionMakingStyleChoices", JSON.parse(angular.toJson($scope.questions)));
        $scope.currentUser.set("decisionMakingStyleValue", $scope.currentUser.decisionMakingStyleValue);
        $scope.currentUser.set("Personal_Risk_Level", $scope.currentUser.Personal_Risk_Level);
        $scope.currentUser.set("styles_a", $scope.currentUser.styles_a);
        $scope.currentUser.set("styles_b", $scope.currentUser.styles_b);
        $scope.currentUser.set("styles_c", $scope.currentUser.styles_c);
        $scope.currentUser.set("styles_d", $scope.currentUser.styles_d);
        theBiggerService.setLoadingState(true);
        $scope.currentUser.save(null, {
            success: function (user) {
                $scope.$apply(function () {
                    theBiggerService.updateCurrentUser(user);
                    theBiggerService.setLoadingState(false);
                    //$scope.calculateRiskTolerance();
                    window.location = "/home/reservation";
                });
            },
            error: function (user, error) {
                console.error(error);
                theBiggerService.setLoadingState(false);

            }
        });
    };
    $scope.calculateRiskTolerance = function () {
        $scope.calculateStyle();
        var rt = (parseFloat($scope.currentUser.wealthPercentage/10 + 1)+
            (parseFloat($scope.currentUser.stageOfLifeValue+$scope.currentUser.age/10)/2)
            +parseFloat($scope.currentUser.decisionMakingStyleValue))/3;
        $scope.currentUser.Personal_Risk_Level = rt;

        console.log("rt",$scope.currentUser.Personal_Risk_Level);
    };


    $scope.calculateStyle = function () {
        $scope.currentUser.styles_a = 0;
        $scope.currentUser.styles_b = 0;
        $scope.currentUser.styles_c = 0;
        $scope.currentUser.styles_d = 0;
        $scope.questions.forEach(function (q) {
            if(q.value == "A"){
                $scope.currentUser.styles_a++;
            }else if(q.value == "B"){
                $scope.currentUser.styles_b++;
            }else if(q.value == "C"){
                $scope.currentUser.styles_c++;
            }else if(q.value == "D"){
                $scope.currentUser.styles_d++;
            }
        });
        console.log($scope.currentUser.styles_a);
        console.log($scope.currentUser.styles_b);
        console.log($scope.currentUser.styles_c);
        console.log($scope.currentUser.styles_d);
        $scope.currentUser.decisionMakingStyleValue = $scope.currentUser.styles_a * 0.027 + $scope.currentUser.styles_b * 0.059 + $scope.currentUser.styles_c * 0.076 + $scope.currentUser.styles_d * 0.083;
    };
    $scope.questionText= [];
    $scope.questions= [];
    //init questions
    $scope.initQuestions = function () {
        if(!$scope.currentUser.decisionMakingStyleChoices || $scope.currentUser.decisionMakingStyleChoices.length == 0
        ||!$scope.questions || $scope.questions.length ==0) {
            console.log("initiating questions....");
            $scope.questionText = [
                "I keep all my mail. I never throw anything out",

                "My favorite subject in school was mathematics",

                "I would rathersit in front of the television than organize one of myclosets",

                "I would rather work by myself than in groups.5. Iconsider myself to be independent",

                "When asked out to dinner or a movie, I generally organize the event",

                "I am bothered by people who don't work har",

                "I never leave anything unfinishe",

                "I generally drive veryfast",

                "I enjoycompetitive sports",

                "I rarely worry about finances",

                "I like seeing scary movies",

                "I'm always eager to meet new people",

                "I sometimes becoe impatient waiting for an aelevator",

                "People accuse me of having a 'quick temper'",

                "I become nervous when flying",

                "I don't like contact sports like football",

                "When arguing with friends, I am usuallythe one who concedes",

                "I never had a strong bond with my parents",

                "I wish I could be more expressive with myfeelings",

                "I never raise my voice",

                "I don't like to discuss personal items with friends",

                "I like art",

                "I would classify my political beliefs asliberal",

                "I am not easily excitable",

                "I don'tswim in the ocean",

                "I am afraid of public speaking",

                "If offered a bigger house, I would pass because I don't like the hassle of moving",

                "I have had many relationships with the opposite sex",

                "I often wear cutting-edge new fashions",

                "I will always take the initiative when others do not"
            ];
            var i = -1;
            $scope.questions = [];
            $scope.questionText.forEach(function (text) {
                i++;
                $scope.questions.push({"id": i, "text": text, "value": "B"});
            });
        }
        else {
            $scope.questions= $scope.currentUser.decisionMakingStyleChoices;
        }
    }
    $scope.drawRadarGraph = function () {
        console.log("decision making");
        var data = {
            labels: ["Methodical", "Individualist", "Spontaneous", "Cautious"],
            datasets: [
                {
                    label: "My Decision-making style",
                    backgroundColor: "rgba(255,99,132,0.2)",
                    borderColor: "rgba(255,99,132,1)",
                    pointBackgroundColor: "rgba(255,99,132,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(255,99,132,1)",
                    data: [$scope.currentUser.styles_a, $scope.currentUser.styles_b, $scope.currentUser.styles_c,
                        $scope.currentUser.styles_d]
                },
                {
                    label: "Most Common Style",
                    backgroundColor: "rgba(179,181,198,0.2)",
                    borderColor: "rgba(179,181,198,1)",
                    pointBackgroundColor: "rgba(179,181,198,1)",
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(179,181,198,1)",
                    data: [15, 16, 14, 20]
                },
            ]
        };
        var ctx = document.getElementById("decision-style-graph");
        new Chart(ctx, {
            type: "radar",
            data: data,
            options: {
                scale: {
                    ticks: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

});


app.directive( 'elemReady', function( $parse ) {
    return {
        restrict: 'A',
        link: function( $scope, elem, attrs ) {
            elem.ready(function(){
                $scope.$apply(function(){
                    var func = $parse(attrs.elemReady);
                    func($scope);
                })
            });
        }
    }
});
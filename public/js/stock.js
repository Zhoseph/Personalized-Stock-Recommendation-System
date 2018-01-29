/**
 * Created by Ming on 11/29/16.
 */
app.controller('StockCtrl',function($scope,$http,theBiggerService){
    $scope.currentUser = {};
    $scope.currentUser.age = 0;
    $scope.currentUser.wealthPercentage = 0.0;
    $scope.currentUser.netWealth = 0;
    $scope.currentUser.stageOfLifeValue =0;
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
        });
    });
    $scope.$on('prediction_handle_broadcast', function() {
        $scope.$apply(function() {
            console.log("ProfileCtrl heard prediction_handle_broadcast changing");
            var data_prediction = theBiggerService.getPredictions();
            var data_sd = theBiggerService.getStandardDeviation();
            $scope.stockList.forEach(function (s) {
                var prediction = _.filter(data_prediction, {ticker_symbol: s.code})[0];
                s.predicted_price = prediction.predicted_price;
                s.cur_price = prediction.cur_price;
                s.difference = prediction.predicted_price - prediction.cur_price;
                var sd = _.filter(data_sd, {ticker_symbol: s.code})[0];
                s.standard_deviation = sd.standard_deviation;
            });
            switch (theBiggerService.currentModule){
                case "dashboard":
                    $scope.getStockSubscribe();
                    break;
                default:
                    console.log("currentModule",theBiggerService.currentModule);
            }
        });
    });

    $scope.currentUser.decisionMakingStyleValue = 0;
    $scope.submitStockSubscribe = function() {
        console.log("$scope.currentUser.selectedStockList:",$scope.currentUser.selectedStockList);
        $scope.currentUser.set("stockSubscribe", $scope.currentUser.selectedStockList);
        //$scope.currentUser.set("decisionMakingStyleValue", 10);
        theBiggerService.setLoadingState(true);
        $scope.currentUser.save(null, {
            success: function (user) {
                $scope.$apply(function () {
                    theBiggerService.updateCurrentUser(user);
                    theBiggerService.setLoadingState(false);
                    window.location = "/home/dashboard";
                });
            },
            error: function (user, error) {
                console.error(error);
                theBiggerService.setLoadingState(false);
            }
        });
    };
    $scope.stockList = [              {"code":"ATVI","name":"Activision Blizzard, Inc","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"ADBE","name":"Adobe Systems Incorporated","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"GOOG","name":"Alphabet Inc. in Class C","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"GOOGL","name":"Alphabet Inc. in Class A","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"ADI","name":"Analog Devices, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"AAPL","name":"Apple Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"AMAT","name":"Applied Materials, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"ADSK","name":"Autodesk, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"ADP","name":"Automatic Data Processing, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"CA","name":"CA Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"CERN","name":"Cerner Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"CSCO","name":"Cisco Systems, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"CTXS","name":"Citrix Systems, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"CTSH","name":"Cognizant Technology Solutions Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"DOV","name":"Dover Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"EA","name":"Electronic Arts Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"FB","name":"Facebook, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"FISV","name":"Fiserv, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"HPQ","name":"HP Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"ITW","name":"Illinois Tool Works Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"INTC","name":"Intel Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"IBM","name":"International Business Machines Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"INTU","name":"Intuit Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"LLL","name":"L-3 Communications Holdings, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"LRCX","name":"Lam Research Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"LLTC","name":"Linear Technology Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"LNKD","name":"LinkedIn Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"MXIM","name":"Maxim Integrated Products, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"MCHP","name":"Microchip Technology Incorporated","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"MU","name":"Micron Technology, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"MSFT","name":"Microsoft Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"MSI","name":"Motorola Solutions, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"NVDA","name":"NVIDIA Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"OMC","name":"Omnicom Group Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"ORCL","name":"Oracle Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"PANW","name":"Palo Alto Networks, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"QCOM","name":"QUALCOMM Incorporated","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"RHT","name":"Red Hat, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"CRM","name":"Salesforce.com Inc","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"NOW","name":"ServiceNow, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"SWKS","name":"Skyworks Solutions, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"SYMC","name":"Symantec Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"TXN","name":"Texas Instruments Incorporated","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"VRSK","name":"Verisk Analytics, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"VMW","name":"Vmware, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"WDC","name":"Western Digital Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"WDAY","name":"Workday, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"XLNX","name":"Xilinx, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
        {"code":"YHOO","name":"Yahoo! Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0}];
    //$scope.currentUser.selectedStockList;
    //init stock names
    $scope.initStockList = function () {
        if(!$scope.stockList || $scope.stockList.length !=0){
            $scope.stockList = [
                {"code":"ATVI","name":"Activision Blizzard, Inc","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"ADBE","name":"Adobe Systems Incorporated","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"GOOG","name":"Alphabet Inc. in Class C","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"GOOGL","name":"Alphabet Inc. in Class A","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"ADI","name":"Analog Devices, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"AAPL","name":"Apple Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"AMAT","name":"Applied Materials, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"ADSK","name":"Autodesk, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"ADP","name":"Automatic Data Processing, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"CA","name":"CA Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"CERN","name":"Cerner Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"CSCO","name":"Cisco Systems, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"CTXS","name":"Citrix Systems, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"CTSH","name":"Cognizant Technology Solutions Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"DOV","name":"Dover Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"EA","name":"Electronic Arts Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"FB","name":"Facebook, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"FISV","name":"Fiserv, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"HPQ","name":"HP Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"ITW","name":"Illinois Tool Works Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"INTC","name":"Intel Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"IBM","name":"International Business Machines Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"INTU","name":"Intuit Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"LLL","name":"L-3 Communications Holdings, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"LRCX","name":"Lam Research Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"LLTC","name":"Linear Technology Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"LNKD","name":"LinkedIn Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"MXIM","name":"Maxim Integrated Products, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"MCHP","name":"Microchip Technology Incorporated","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"MU","name":"Micron Technology, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"MSFT","name":"Microsoft Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"MSI","name":"Motorola Solutions, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"NVDA","name":"NVIDIA Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"OMC","name":"Omnicom Group Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"ORCL","name":"Oracle Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"PANW","name":"Palo Alto Networks, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"QCOM","name":"QUALCOMM Incorporated","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"RHT","name":"Red Hat, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"CRM","name":"Salesforce.com Inc","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"NOW","name":"ServiceNow, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"SWKS","name":"Skyworks Solutions, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"SYMC","name":"Symantec Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"TXN","name":"Texas Instruments Incorporated","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"VRSK","name":"Verisk Analytics, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"VMW","name":"Vmware, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"WDC","name":"Western Digital Corporation","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"WDAY","name":"Workday, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"XLNX","name":"Xilinx, Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0},
                {"code":"YHOO","name":"Yahoo! Inc.","predicted_price":0,"cur_price":0,"difference":0,"standard_deviation":0}
            ];
        }
    };
    $scope.selectOneStock = function (code) {
        if(!$scope.currentUser.selectedStockList){
            $scope.currentUser.selectedStockList = [];
        }
        $scope.currentUser.selectedStockList.push(code)
    };
    $scope.subscribeResult = [];
    $scope.getStockSubscribe = function () {
        console.log("getStockSubscribe");
        console.log($scope.currentUser.selectedStockList);
        $scope.subscribeResult = _.filter($scope.stockList, function (i) {
            console.log("looking",i);
            var r = $scope.currentUser.selectedStockList.indexOf(i.code) > -1;
            console.info(r);
            return r;
        })
    }
});

/**
 * Created by Ming on 11/20/16.
 */
exports.dashboard = function(title,data){
    if(!data)
        data = {};
    return {layout:"dashboard_temp.html", title:title, data:data}
};
exports.normal = function(title,data){
    if(!data)
        data = {};
    return {layout:"empty_temp.html",title:title,data:data}
};

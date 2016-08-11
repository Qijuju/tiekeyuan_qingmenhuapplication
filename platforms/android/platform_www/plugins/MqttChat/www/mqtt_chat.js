cordova.define("MqttChat.mqtt_chat", function(require, exports, module) {
var exec = require('cordova/exec');

exports.getChats = function(arg0, success, error) {
    exec(success, error, "MqttChat", "getChats", [arg0]);
};

exports.startMqttChat = function(arg0, success, error) {//arg0：topicId
    exec(success, error, "MqttChat", "startMqttChat", [arg0]);
};
exports.sendMsg = function(arg0, arg1, success, error) {//arg0：topicId
    exec(success, error, "MqttChat", "sendMsg", [arg0,arg1]);
};
exports.save = function(arg0, arg1, success, error) {//arg0：key arg1：value
    exec(success, error, "MqttChat", "save", [arg0,arg1]);
};
exports.saveLogin = function(arg0, arg1, success, error) {//arg0：key arg1：value
    exec(success, error, "MqttChat", "saveLogin", [arg0,arg1]);
};
exports.getString = function(arg0, success, error) {//arg0：key
    exec(success, error, "MqttChat", "getString", [arg0]);
};
exports.disconnect = function(success, error) {
    exec(success, error, "MqttChat", "disconnect", []);
};
exports.getUserInfo = function(success, error) {//获取用户信息
    exec(success, error, "MqttChat", "getUserInfo", []);
};
exports.getMyTopic = function(success, error) {//获取当前登录用户的topic
    exec(success, error, "MqttChat", "getMyTopic", []);
};

});

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
exports.getTopic = function(userID,type,success, error) {//获取当前登录用户的topic
    exec(success, error, "MqttChat", "getTopic", [userID,type]);
};
exports.getUserId = function(success, error) {//获取当前登录用户的topic
    exec(success, error, "MqttChat", "getUserId", []);
};
exports.openDocWindow = function(type, success, error) {//打开文件管理器  参数声明：type：打开查看的文件的类型 *或all：所有文件，video：视频文件，audio：音频文件
    exec(success, error, "MqttChat", "openDocWindow", [type]);
};

exports.getIconDir =function(success,error){
exec(success, error, "MqttChat", "getIconDir", [])
};
exports.getFileContent =function(filePath, success,error){//拍照后发送图片需要的数据
exec(success, error, "MqttChat", "getFileContent", [filePath])
};
exports.takePhoto =function(success,error){//拍照
exec(success, error, "MqttChat", "takePhoto", [])
};
exports.takeVideo =function(success,error){//录制小视频
exec(success, error, "MqttChat", "takeVideo", [])
};
exports.setOnNetStatusChangeListener =function(success,error){//网络监听
exec(success, error, "MqttChat", "setOnNetStatusChangeListener", [])
};
exports.getMqttStatus =function(success){//MQTT连接状态获取
exec(success, null, "MqttChat", "getMqttStatus", [])
};
exports.setExitStartedStatus =function(){//改变登录状态为未登录
exec(null, null, "MqttChat", "setExitStartedStatus", [])
};
exports.startRecording =function(success, error){//开始录音
exec(success, error, "MqttChat", "startRecording", [])
};
exports.stopRecording =function(success, error){//停止录音
exec(success, error, "MqttChat", "stopRecording", [])
};
exports.playRecord =function(playVoiceName,success, error){//播放录音
exec(success, error, "MqttChat", "playRecord", [playVoiceName])
};
exports.stopPlayRecord =function(success, error){//停止播放录音
exec(success, error, "MqttChat", "stopPlayRecord", [])
};
exports.setProxyMode =function(mode){//设置距离感应器模式（0为正常模式，1为听筒模式）
exec(null, null, "MqttChat", "setProxyMode", [mode])
};
exports.getProxyMode =function(success){//获取距离感应器模式（0为正常模式，1为听筒模式）
exec(success, null, "MqttChat", "getProxyMode", [])
};
});

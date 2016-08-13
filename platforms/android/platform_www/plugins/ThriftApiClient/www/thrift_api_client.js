cordova.define("ThriftApiClient.thrift_api_client", function(require, exports, module) {
var exec = require('cordova/exec');

exports.login = function(username,password,imCode, success, error) {
  exec(success, error, "ThriftApiClient", "login", [username,password,imCode]);
};
exports.activeUser = function(userId,imCode, success, error) {
  exec(success, error, "ThriftApiClient", "activeUser", [userId,imCode]);
};
exports.getDatetime = function(userId, success, error) {
  exec(success, error, "ThriftApiClient", "getDatetime", [userId]);
};
exports.seachUsers = function(username,searchText,pageNum,pageCount, success, error) {
  exec(success, error, "ThriftApiClient", "seachUsers", [username,searchText,pageNum,pageCount]);
};
exports.getChild = function(ID,deptID,pageNum,pageCount, success, error) {
  exec(success, error, "ThriftApiClient", "getChild", [ID,deptID,pageNum,pageCount]);
};
exports.getDeparment = function(ID,deptID, success, error) {
  exec(success, error, "ThriftApiClient", "getDeparment", [ID,deptID]);
};
exports.getUserRoot = function(ID, success, error) {
  exec(success, error, "ThriftApiClient", "getUserRoot", [ID]);
};
exports.getUser = function(userID, success, error) {
  exec(success, error, "ThriftApiClient", "getUser", [userID]);
};
exports.updatePwd = function(oldPWD, newPWD, confirmPWD, success, error) {
  exec(success, error, "ThriftApiClient", "updatePwd", [oldPWD, newPWD, confirmPWD]);
};
exports.updateUserInfo = function(newUserInfoObj, success, error) {//newUserInfoObj：这是一个JSONObject
  exec(success, error, "ThriftApiClient", "updateUserInfo", [newUserInfoObj]);
};
exports.getHeadPic = function(picUserID, picSize, success, error) {
  exec(success, error, "ThriftApiClient", "getHeadPic", [picUserID, picSize]);
};
exports.setHeadPic = function(filePath,success, error) {
  exec(success, error, "ThriftApiClient", "setHeadPic", [filePath]);
};
exports.getVersionInfo = function(success, error) {
  exec(success, error, "ThriftApiClient", "getVersionInfo", []);
};
exports.getVersion = function(savePath, versionCode, success, error) {
  exec(success, error, "ThriftApiClient", "getVersion", [savePath,versionCode]);
};
exports.addAttention = function(membersArr, success, error) {
  exec(success, error, "ThriftApiClient", "addAttention", [membersArr]);
};
exports.removeAttention = function(membersArr, success, error) {
  exec(success, error, "ThriftApiClient", "removeAttention", [membersArr]);
};
exports.getAttention = function(success, error) {
  exec(success, error, "ThriftApiClient", "getAttention", []);
};
exports.needUpgrade = function(versionName, success, error) {
  exec(success, error, "ThriftApiClient", "needUpgrade", [versionName]);
};
exports.getHistoryMsg = function(sessionType, sessionID, pageNum, pageCount, success, error) {
  exec(success, error, "ThriftApiClient", "getHistoryMsg", [sessionType, sessionID, pageNum, pageCount]);
};
exports.getMsgCount = function(sessionType, sessionID, success, error) {
  exec(success, error, "ThriftApiClient", "getMsgCount", [sessionType, sessionID]);
};
exports.cancelUser = function(success, error) {//解绑用户，以让其他设备可以登录使用该账户
  exec(success, error, "ThriftApiClient", "cancelUser", []);
};

});

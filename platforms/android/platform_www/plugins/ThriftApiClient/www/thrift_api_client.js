cordova.define("ThriftApiClient.thrift_api_client", function(require, exports, module) {
var exec = require('cordova/exec');

exports.login = function(username,password, success, error) {
  exec(success, error, "ThriftApiClient", "login", [username,password]);
};
exports.activeUser = function(userId, success, error) {
  exec(success, error, "ThriftApiClient", "activeUser", [userId]);
};
exports.getDatetime = function(userId, success, error) {
  exec(success, error, "ThriftApiClient", "getDatetime", [userId]);
};
exports.seachUsers = function(username,searchText,pageNum,pageCount, success, error) {
  exec(success, error, "ThriftApiClient", "seachUsers", [username,searchText,pageNum,pageCount]);
};
exports.getChild = function(deptID,pageNum,pageCount, success, error) {
  exec(success, error, "ThriftApiClient", "getChild", [deptID,pageNum,pageCount]);
};
exports.getDeparment = function(deptID, success, error) {
  exec(success, error, "ThriftApiClient", "getDeparment", [deptID]);
};
exports.getUserRoot = function(success, error) {
  exec(success, error, "ThriftApiClient", "getUserRoot", []);
};
exports.getUser = function(userID, success, error) {
  exec(success, error, "ThriftApiClient", "getUser", [userID]);
};
exports.checkLocalUser = function(userMBObj, success, error) {
  exec(success, error, "ThriftApiClient", "checkLocalUser", [userMBObj]);
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
exports.getVersion = function(savePath, versionCode,filesize,success, error) {
  exec(success, error, "ThriftApiClient", "getVersion", [savePath,versionCode,filesize]);
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
exports.openFile = function(filePath,success, error) {
  exec(success, error, "ThriftApiClient", "openFile", [filePath]);
};

//以下是群组的10个接口
exports.addGroup = function(groupName, deptsArr, membersArr, success, error) {//创建群组  groupName：群组名, deptsArr：所有部门（deptID的组合）, membersArr：所有选中人员（人员ID的组合）
  exec(success, error, "ThriftApiClient", "addGroup", [groupName,deptsArr,membersArr]);
};
exports.getGroup = function(groupIdsArr, success, error) {//获取群组（列表）信息  groupIdsArr：群组ID的集合
  exec(success, error, "ThriftApiClient", "getGroup", [groupIdsArr]);
};
exports.modifyGroup = function(groupType, groupID, groupName, groupText, success, error) {//修改群信息  groupType：群组类型, groupID：群组ID, groupName：群组名称, groupText：群族公告
  exec(success, error, "ThriftApiClient", "modifyGroup", [groupType,groupID,groupName,groupText]);
};
exports.removeGroup = function(groupID, success, error) {//解散群组  groupID：群组ID
  exec(success, error, "ThriftApiClient", "removeGroup", [groupID]);
};
exports.getGroupUpdate = function(groupType, groupID, objectsArr, success, error) {//获取群组指定信息  groupType：群组类型, groupID：群组ID, objectsArr：查询的项目代码列表
  exec(success, error, "ThriftApiClient", "getGroupUpdate", [groupType,groupID,objectsArr]);
};
exports.groupAddMember = function(groupID, deptsArr, membersArr, success, error) {//群组添加人员（列表）  groupID：群组ID, deptsArr选中所有部门的ID的集合, membersArr：选中所有人员的ID的集合
  exec(success, error, "ThriftApiClient", "groupAddMember", [groupID, deptsArr, membersArr]);
};
exports.groupRemoveMember = function(groupID, membersArr, success, error) {//群组移除人员（列表）  groupID：群组ID, membersArr：要删除的群组成员
  exec(success, error, "ThriftApiClient", "groupRemoveMember", [groupID,membersArr]);
};
exports.groupAddAdmin = function(groupID, adminsArr, success, error) {//群组添加管理员（列表）  groupID：群组ID, adminsArr：添加的所有管理员的ID
  exec(success, error, "ThriftApiClient", "groupAddAdmin", [groupID,adminsArr]);
};
exports.groupRemoveAdmin = function(groupID, adminsArr, success, error) {//群组移除管理员（列表）  groupID：群组ID, adminsArr：所有管理员的集合
  exec(success, error, "ThriftApiClient", "groupRemoveAdmin", [groupID,adminsArr]);
};
exports.getAllGroup = function(success, error) {//获取用户所有群组
  exec(success, error, "ThriftApiClient", "getAllGroup", []);
};
exports.installApk = function(targetPath, success, error) {//安装应用
  exec(success, error, "ThriftApiClient", "installApk", [targetPath]);
};
exports.getAllGroupIds = function(success, error) {//获取所有群组的群组ID，群组ID之间以逗号隔开，返回字符串
  exec(success, error, "ThriftApiClient", "getAllGroupIds", []);
};
exports.qrcodeLogin = function(qrcode, success, error) {//二维码扫描接口， qrcode：扫描到的二维码
  exec(success, error, "ThriftApiClient", "qrcodeLogin", [qrcode]);
};
exports.sendFile = function(objectTP,objectID,filePath, success, error) {//图片上传接口
  exec(success, error, "ThriftApiClient", "sendFile", [objectTP,objectID,filePath]);
};
exports.sendDocFile = function(objectTP,objectID,filePath, success, error) {//图片上传接口
  exec(success, error, "ThriftApiClient", "sendDocFile", [objectTP,objectID,filePath]);
};
exports.getFile = function(objectTP,objectID,picSize, success, error) {//图片上传接口
  exec(success, error, "ThriftApiClient", "getFile", [objectTP,objectID,picSize]);
};
});

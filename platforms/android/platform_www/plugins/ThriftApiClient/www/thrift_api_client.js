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

});

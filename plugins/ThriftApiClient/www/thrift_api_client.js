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

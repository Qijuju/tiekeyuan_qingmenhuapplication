var exec = require('cordova/exec');

 exports.getApk = function(packagename, appId, name,url, success, error) {
	exec(success, error, "OAIntegration", "getApk", [packagename, appId, name,url]);
 };

exports.createDsk = function(packagename, appId, name,success, error) {
  exec(success, error, "OAIntegration", "createDsk", [packagename, appId, name]);


  //获取当前版本号
  exports.getCurrentVersion = function(success, error) {
    exec(success, error, "OAIntegration", "getCurrentVersion");
  };


  //获取当前是否是wifi状态
  exports.getWifiState = function(success, error) {
    exec(success, error, "OAIntegration", "getWifiState");
  };
};

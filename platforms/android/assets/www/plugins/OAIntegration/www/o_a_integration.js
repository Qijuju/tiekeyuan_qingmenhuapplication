cordova.define("OAIntegration.o_a_integration", function(require, exports, module) {
var exec = require('cordova/exec');

 exports.getApk = function(packagename, appId, name,url, success, error) {
	exec(success, error, "OAIntegration", "getApk", [packagename, appId, name,url]);
 };

 //创建桌面快捷方式
 exports.createDsk = function(packagename, appId, name, success, error) {
 	exec(success, error, "OAIntegration", "createDsk", [packagename, appId, name]);
  };

 //获取当前版本号
    exports.getCurrentVersion = function(success, error) {
     	exec(success, error, "OAIntegration", "getCurrentVersion",[]);
      };

 //创建桌面快捷方式
  exports.getWifiState = function(success, error) {
  	exec(success, error, "OAIntegration", "getWifiState", []);
   };


});

var exec = require('cordova/exec');

 exports.getApk = function(packagename, appId, name,url, success, error) {
	exec(success, error, "OAIntegration", "getApk", [packagename, appId, name,url]);
 };

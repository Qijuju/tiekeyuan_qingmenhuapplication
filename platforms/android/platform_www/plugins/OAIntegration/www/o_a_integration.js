cordova.define("OAIntegration.o_a_integration", function(require, exports, module) {
var exec = require('cordova/exec');

 exports.getApk = function(packagename, appId, name, success, error) {
	exec(success, error, "OAIntegration", "getApk", [packagename, appId, name]);
 };

});

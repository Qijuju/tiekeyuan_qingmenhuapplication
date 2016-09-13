cordova.define("ToastUtils.toast_utils", function(require, exports, module) {
var exec = require('cordova/exec');

 exports.showToast = function(content) {
	exec(null, null, "ToastUtils", "showToast", [content]);
 };

});

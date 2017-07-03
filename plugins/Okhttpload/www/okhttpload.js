var exec = require('cordova/exec');

 exports.upload = function(key, value, success, error) {
	exec(success, error, "Okhttpload", "upload", [key, value]);
 };
 exports.download = function(key, defValue, success, error) {
	exec(success, error, "Okhttpload", "download", [key, defValue]);
 };

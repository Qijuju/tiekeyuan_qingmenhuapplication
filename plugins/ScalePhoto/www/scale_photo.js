var exec = require('cordova/exec');

 exports.scale = function(filepath, success, error) {
	exec(success, error, "ScalePhoto", "scale", [filepath]);
 };
 exports.netScale = function(imageid,imagename,samllfilepath, success, error) {
	exec(success, error, "ScalePhoto", "netScale", [imageid,imagename,samllfilepath]);
 };

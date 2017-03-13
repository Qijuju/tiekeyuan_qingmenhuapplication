var exec = require('cordova/exec');

 exports.queryPhoto = function(sessionid, type, success, error) {
	exec(success, error, "GridPhoto", "queryPhoto", [sessionid, type]);
 };

var exec = require('cordova/exec');


 exports.getLocalContactsInfos = function(arg0, success, error) {
     exec(success, error, "localContact", "getLocalContactsInfos", [arg0]);
   };




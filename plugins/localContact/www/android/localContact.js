var exec = require('cordova/exec');


  exports.getLocalContactsInfos = function(arg0, success, error) {
     exec(success, error, "localContact", "getLocalContactsInfos", [arg0]);
   };
  exports.getLocalContactsInfosBynumber = function(arg0, success, error) {
    exec(success, error, "localContact", "getLocalContactsInfosBynumber", [arg0]);
  };
  exports.getLocalContactsInfosByText = function(arg0, success, error) {
    exec(success, error, "localContact", "getLocalContactsInfosByText", [arg0]);
  };



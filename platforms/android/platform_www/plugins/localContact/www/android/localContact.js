cordova.define("localContact.localContact", function(require, exports, module) {
  var exec = require('cordova/exec');


  exports.getLocalContactsInfos = function(arg0, success, error) {
    exec(success, error, "localContact", "getLocalContactsInfos", [arg0]);
  };

  exports.getLocalContactsInfosByText = function(arg0, success, error) {
    exec(success, error, "localContact", "getLocalContactsInfosByText", [arg0]);
  };

});

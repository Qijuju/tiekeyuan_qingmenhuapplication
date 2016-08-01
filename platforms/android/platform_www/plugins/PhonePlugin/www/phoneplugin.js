cordova.define("PhonePlugin.phoneplugin", function(require, exports, module) {
var exec = require('cordova/exec');

  exports.call = function(arg0, success, error) {//arg0 : phonenumber
    exec(success, error, "PhonePlugin", "call", [arg0]);
  };

  exports.sms = function(arg0, success, error) {//arg0 : phonenumber
    exec(success, error, "PhonePlugin", "sms", [arg0]);
  };
});

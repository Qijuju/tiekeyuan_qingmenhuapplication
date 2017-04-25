var exec = require('cordova/exec');

  exports.insert = function(arg0,arg1, success, error) {//arg0 : phonenumber
    exec(success, error, "SavaLocalPlugin", "insert", [arg0,arg1]);
  };
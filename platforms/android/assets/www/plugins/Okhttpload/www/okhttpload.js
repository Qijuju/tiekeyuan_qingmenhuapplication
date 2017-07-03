cordova.define("Okhttpload.okhttpload", function(require, exports, module) {
  var exec = require('cordova/exec');

  exports.upload = function(messageDetail,objectTP,objectID,filepath,url, success, error) {
    exec(success, error, "Okhttpload", "upload", [messageDetail,objectTP,objectID,filepath, url]);
  };
  exports.download = function(fileId,type,picSize,offset, success, error) {
    exec(success, error, "Okhttpload", "download", [fileId,type,picSize,offset]);
  };
   exports.downloadFile = function(messageDetail,offset, success, error) {
      exec(success, error, "Okhttpload", "downloadFile", [messageDetail,offset]);
    };

});


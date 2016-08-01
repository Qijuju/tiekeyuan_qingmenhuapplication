cordova.define("MqttChat.mqtt_chat", function(require, exports, module) {
  var exec = require('cordova/exec');

  exports.getChats = function(arg0, success, error) {
    exec(success, error, "MqttChat", "getChats", [arg0]);
  };

  exports.startMqttChat = function(arg0, success, error) {//arg0：topicId
    exec(success, error, "MqttChat", "startMqttChat", [arg0]);
  };
  exports.sendMsg = function(arg0, arg1, success, error) {//arg0：topicId
    exec(success, error, "MqttChat", "sendMsg", [arg0,arg1]);
  };

});

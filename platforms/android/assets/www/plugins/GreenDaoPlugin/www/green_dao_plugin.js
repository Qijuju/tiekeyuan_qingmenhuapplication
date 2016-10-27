cordova.define("GreenDaoPlugin.green_dao_plugin", function (require, exports, module) {
  var exec = require('cordova/exec');

//services:service业务类名(相应表对应的业务逻辑类);str:参数名(相应表对应的字段名String类型)
  exports.loadDataByArg = function (services, str, success, error) {
    exec(success, error, "GreenDaoPlugin", "loadDataByArg", [services, str]);
  };
//services:service业务类名(相应表对应的业务逻辑类)
  exports.loadAllData = function (services, success, error) {
    exec(success, error, "GreenDaoPlugin", "loadAllData", [services]);
  };
//services:service业务类名(相应表对应的业务逻辑类);where:查询语句;args:参数列表(相应表对应的字段名String类型)
  exports.queryData = function (services, where, args, success, error) {
    exec(success, error, "GreenDaoPlugin", "queryData", [services, where, args]);
  };
//services:service业务类名(相应表对应的业务逻辑类);jsonObject:对象名(相应表对应的对象名)
  exports.saveObj = function (services, jsonObject, success, error) {
    exec(success, error, "GreenDaoPlugin", "saveObj", [services, jsonObject]);
  };
//services:service业务类名(相应表对应的业务逻辑类);arraylist:数组对象名(相应表对应的数组名)
  exports.saveDataLists = function (services, arraylist, success, error) {
    exec(success, error, "GreenDaoPlugin", "saveDataLists", [services, arraylist]);
  };
//services:service业务类名(相应表对应的业务逻辑类)
  exports.deleteAllData = function (services, success, error) {
    exec(success, error, "GreenDaoPlugin", "deleteAllData", [services]);
  };
//services:service业务类名(相应表对应的业务逻辑类);str:参数名(相应表对应的字段名String类型)
  exports.deleteDataByArg = function (services, str, success, error) {
    exec(success, error, "GreenDaoPlugin", "deleteDataByArg", [services, str]);
  };
//services:service业务类名(相应表对应的业务逻辑类);jsonObject:对象名(相应表对应的对象名)
  exports.deleteObj = function (services, jsonObject, success, error) {
    exec(success, error, "GreenDaoPlugin", "deleteObj", [services, jsonObject]);
  };
//services:service业务类名(相应表对应的业务逻辑类);isSingle:聊天类型(是否为单聊;‘true’:单聊;‘false’:群聊)
  exports.queryMessagelistByIsSingle = function (services, isSingle, success, error) {
    exec(success, error, "GreenDaoPlugin", "queryMessagelistByIsSingle", [services, isSingle]);
  };
  exports.loadByCount = function (success, error) {
    exec(success, error, "GreenDaoPlugin", "loadByCount", []);
  };
  exports.queryByConditions = function (services,success, error) {
      exec(success, error, "GreenDaoPlugin", "queryByConditions", [services]);
    };
   exports.querySearchDetail = function (name, message,success, error) {
       exec(success, error, "GreenDaoPlugin", "querySearchDetail", [name, message]);
    };

    exports.queryGroupOrSingleChat = function (type, sessionid,success, error) {
           exec(success, error, "GreenDaoPlugin", "queryGroupOrSingleChat", [type, sessionid]);
    };

    exports.queryGroupIds = function (one, two,success, error) {
               exec(success, error, "GreenDaoPlugin", "queryGroupIds", [one, two]);
        };
  exports.queryByType = function (one, two,success, error) {
    exec(success, error, "GreenDaoPlugin", "queryByType", [one, two]);
  };

    exports.qureyHistoryMsg = function (type,success, error) {
                exec(success, error, "GreenDaoPlugin", "qureyHistoryMsg", [type]);
         };
    exports.queryNotifyChat = function (type, sessionid,success, error) {//新版通知==列表带2参数
            exec(success, error, "GreenDaoPlugin", "queryNotifyChat", [type, sessionid]);
          },
          exports.queryNewNotifyChat=function (type, sessionid,success, error) {//新版通知==消息带2参数
            exec(success, error, "GreenDaoPlugin", "queryNewNotifyChat", [type, sessionid]);
          };
    exports.queryDataByDate=function (date, type,success, error) {//日期查询
       exec(success, error, "GreenDaoPlugin", "queryDataByDate", [date, type]);
    }

    exports.queryByFilepic = function (ssid,type,success, error) {
                exec(success, error, "GreenDaoPlugin", "queryByFilepic", [ssid,type]);
         };
    exports.querySlowNotifyChat = function(type, sessionid,success, error){//一般通知
           exec(success, error, "GreenDaoPlugin", "querySlowNotifyChat", [type, sessionid]);
    };

    exports.querySlowDataByDate=function (date, type,success, error) {//日期查询
           exec(success, error, "GreenDaoPlugin", "querySlowDataByDate", [date, type]);
        };

     exports.queryDataByquery=function (query,success, error) {//日期查询
           exec(success, error, "GreenDaoPlugin", "queryDataByquery", [query]);
        }

        exports.queryDataByIdAndIsread = function(sessionid,isread,success, error){//一般通知
                   exec(success, error, "GreenDaoPlugin", "queryDataByIdAndIsread", [sessionid,isread]);
            };
        exports.getUUID = function(success){//一般通知
                           exec(success, null,"GreenDaoPlugin", "getUUID",[]);
                    };
});

var exec = require('cordova/exec');

//services:service业务类名(相应表对应的业务逻辑类);str:参数名(相应表对应的字段名String类型)
exports.loadDataByArg = function(services,str, success, error) {
  exec(success, error, "GreenDaoPlugin", "loadDataByArg", [services,str]);
};
//services:service业务类名(相应表对应的业务逻辑类)
exports.loadAllData = function(services, success, error) {
  exec(success, error, "GreenDaoPlugin", "loadAllData", [services]);
};
//services:service业务类名(相应表对应的业务逻辑类);where:查询语句;args:参数列表(相应表对应的字段名String类型)
exports.queryData = function(services,where,args, success, error) {
  exec(success, error, "GreenDaoPlugin", "queryData", [services,where,args]);
};
//services:service业务类名(相应表对应的业务逻辑类);jsonObject:对象名(相应表对应的对象名)
exports.saveObj = function(services,jsonObject, success, error) {
  exec(success, error, "GreenDaoPlugin", "saveObj", [services,jsonObject]);
};
//services:service业务类名(相应表对应的业务逻辑类);arraylist:数组对象名(相应表对应的数组名)
exports.saveDataLists = function(services,arraylist, success, error) {
  exec(success, error, "GreenDaoPlugin", "saveDataLists", [services,arraylist]);
};
//services:service业务类名(相应表对应的业务逻辑类)
exports.deleteAllData = function(services, success, error) {
  exec(success, error, "GreenDaoPlugin", "deleteAllData", [services]);
};
//services:service业务类名(相应表对应的业务逻辑类);str:参数名(相应表对应的字段名String类型)
exports.deleteDataByArg = function(services,str, success, error) {
  exec(success, error, "GreenDaoPlugin", "deleteDataByArg", [services,str]);
};
//services:service业务类名(相应表对应的业务逻辑类);jsonObject:对象名(相应表对应的对象名)
exports.deleteObj = function(services,jsonObject, success, error) {
  exec(success, error, "GreenDaoPlugin", "deleteObj", [services,jsonObject]);
};
//services:service业务类名(相应表对应的业务逻辑类);isSingle:聊天类型(是否为单聊;‘true’:单聊;‘false’:群聊)
exports.queryMessagelistByIsSingle = function(services,isSingle, success, error) {
  exec(success, error, "GreenDaoPlugin", "queryMessagelistByIsSingle", [services,isSingle]);
};
//通过具体的某个字段来排序
exports.loadByCount = function(success, error) {
  exec(success, error, "GreenDaoPlugin", "loadByCount", []);
};

exports.queryByConditions = function (services,success, error) {
  exec(success, error, "GreenDaoPlugin", "queryByConditions", [services]);
};

exports.querySearchDetail = function (name, message,success, error) {
  exec(success, error, "GreenDaoPlugin", "querySearchDetail", [name, message]);
};





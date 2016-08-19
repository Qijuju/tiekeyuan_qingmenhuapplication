/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('common.services', [])
  .factory('$greendao',function () {
    var greendao;
    document.addEventListener('deviceready',function () {
      greendao = cordova.require('GreenDaoPlugin.green_dao_plugin');
    });
    return {
      //
      loadAllData:function (services, success, error) {
        greendao.loadAllData(services, success, error);
      },
      loadDataByArg:function (services,str, success, error) {

      },
      queryData:function (services,where,args, success, error) {
        greendao.queryData(services,where,args, success, error);
      },
      saveObj:function (services,jsonObject, success, error) {
        greendao.saveObj(services,jsonObject, success, error);
      },
      saveDataLists:function (services,arraylist, success, error) {
        greendao.saveDataLists(services,arraylist, success, error);
      },
      deleteAllData:function (services, success, error) {
        greendao.deleteAllData(services, success, error);
      },
      deleteDataByArg:function (services,str, success, error) {
        greendao.deleteDataByArg(services,str, success, error);
      },
      deleteObj:function (services,jsonObject, success, error) {
        greendao.deleteObj(services,jsonObject, success, error);

      },
      queryMessagelistByIsSingle:function (services,isSingle, success, error) {

      },
      loadByCount:function (success,error) {
        greendao.loadByCount(success,error);
      },

      queryByConditions:function (services, success, error) {
        greendao.queryByConditions(services,success,error);
      },
      querySearchDetail :function (name, message,success, error) {
        greendao.querySearchDetail (name, message,success, error);
      },

    };

  })

  .factory('$api', function () {//系统接口。
    var api;
    return {
      init: function () {
        document.addEventListener('deviceready', function () {
          api = cordova.require('ThriftApiClient.thrift_api_client');
        });
      },
      login:function(username,password, success, error) {
        api.login(username,password, success, error);
      },
      activeUser:function(userId, success, error) {
        api.activeUser(userId, success, error);
      },
      getDatetime: function (userId, success, error) {
        api.getDatetime(userId, success, error);
      },
      seachUsers: function (username, searchText, pageNum, pageCount, success, error) {
        api.seachUsers(username, searchText, pageNum, pageCount, success, error);
      },
      getChild: function (deptID, pageNum, pageCount, success, error) {
        api.getChild(deptID, pageNum, pageCount, success, error);
      },
      getDeparment: function (deptID, success, error) {
        api.getDeparment(deptID, success, error);
      },
      getUserRoot: function (success, error) {
        api.getUserRoot(success, error);
      },
      getUser: function (userID, success, error) {
        api.getUser(userID, success, error);
      },
      updatePwd: function (oldPWD, newPWD, confirmPWD, success, error) {
        api.updatePwd(oldPWD, newPWD, confirmPWD, success, error);
      },
      updateUserInfo: function (newUserInfoObj, success, error) {//newUserInfoObj：这是一个JSONObject
        api.updateUserInfo(newUserInfoObj, success, error);
      },
      getHeadPic: function (picUserID, picSize, success, error) {
        api.getHeadPic(picUserID, picSize, success, error);
      },
      setHeadPic: function (success, error) {
        api.setHeadPic(success, error);
      },
      getVersionInfo: function (success, error) {
        api.getVersionInfo(success, error);
      },
      getVersion: function (savePath, success, error) {
        api.getVersion(savePath, success, error);
      },
      addAttention: function (membersArr, success, error) {
        api.addAttention(membersArr, success, error);
      },
      removeAttention: function (membersArr, success, error) {
        api.removeAttention(membersArr, success, error);
      },
      getAttention: function (success, error) {
        api.getAttention(success, error);
      },
      needUpgrade:function(versionName, success, error) {
        api.needUpgrade(versionName, success, error);
      },
      checkUpdate:function ($ionicPopup, $ionicLoading, $cordovaFileOpener2, $mqtt) {
        api.getVersionInfo(function (msg) {
          var versionName = msg.versionName;
          var versionDesc = msg.versionDesc;
          var targetPath = "";
          api.needUpgrade(versionName, function (msg) {
            if(msg == 'true') {
              var confirmPopup = $ionicPopup.confirm({
                title: '版本升级',
                template: versionDesc, //从服务端获取更新的内容
                cancelText: '取消',
                okText: '升级'
              });
              confirmPopup.then(function (res) {
                if(res) {
                  var loading = $ionicLoading.show({
                    template: "下载中..."//"已经下载：0%"
                  });
                  api.getVersion("", versionName, function (msg) {
                    targetPath = msg;
                    $ionicLoading.hide();
                    $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive').then(function () {
                      // 成功
                      $mqtt.save('install_cancel', 'false');
                      // $mqtt.save('install_cancel_version', '');
                    }, function (err) {
                      // 错误
                      $mqtt.save('install_cancel', 'false');
                      // $mqtt.save('install_cancel_version', '');
                    });
                  },function (msg) {
                    $ionicLoading.hide();
                    alert(msg);
                  });
                } else {
                  //取消更新
                  $mqtt.save('install_cancel', 'true');
                  // $mqtt.save('install_cancel_version', versionName);
                }

              });
            } else if(msg != 'false') {
              alert(msg);
            }
          },function (msg) {
            alert("检查更新失败！");
          });
        }, function (msg) {
          alert(msg);
        });
      },
      getHistoryMsg:function(sessionType, sessionID, pageNum, pageCount, success, error) {//获取历史消息
        api.getHistoryMsg(sessionType, sessionID, pageNum, pageCount, success, error);
      },
      getMsgCount:function(sessionType, sessionID, success, error) {//获取历史消息数
        api.getMsgCount(sessionType, sessionID, success, error);
      },
      cancelUser:function(success, error) {//解绑用户（让其他用户可以使用该帐号登录其他设备）
        api.cancelUser(success,error);
      }
    };
  })

  .factory('$ToastUtils', function () {//系统接口。
    var toast_utils;
    document.addEventListener('deviceready',function () {
      toast_utils = cordova.require('ToastUtils.toast_utils');
    });
    return{
      showToast:function(content,success, error) {
        toast_utils.showToast(content,success,error);
      }
    }
  })

.factory('$saveMessageContacts',function ($greendao) {

  return{
    saveMessageContacts:function (id,phone,name) {

      $greendao.queryData("TopContactsService", 'where _id =?', id, function (msg) {
        if (msg.length > 0) {
          //如果大于0说明已经村上去一次
          var messageCount = msg[0].count;
          //取到值后再重新存一次
          var queryTopContact = {};
          queryTopContact._id = msg[0]._id;
          queryTopContact.phone = msg[0].phone;
          queryTopContact.name = msg[0].name;
          queryTopContact.type = msg[0].type;
          queryTopContact.count = messageCount + 1;
          queryTopContact.when = 0;

          $greendao.saveObj('TopContactsService', queryTopContact, function (data) {

          }, function (err) {

          });
        }else{
          var firstTopContact = {};
          firstTopContact._id = id;
          firstTopContact.phone = phone;
          firstTopContact.name = name;
          firstTopContact.type = "3";
          firstTopContact.count =  1;
          firstTopContact.when = 0;
          $greendao.saveObj('TopContactsService', firstTopContact, function (data) {
          }, function (err) {

          });
        }
      })

    }
  }



})


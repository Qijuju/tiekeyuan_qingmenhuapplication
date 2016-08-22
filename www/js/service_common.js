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
      }

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
      },
      //以下为群组接口
      addGroup:function(groupName, deptsArr, membersArr, success, error) {
        //创建群组  groupName：群组名, deptsArr：所有部门（deptID的组合）, membersArr：所有选中人员（人员ID的组合）
        api.addGroup(groupName, deptsArr, membersArr, success, error);
      },
      getGroup:function(groupIdsArr, success, error) {
        //获取群组（列表）信息  groupIdsArr：群组ID的集合
        api.getGroup(groupIdsArr, success, error);
      },
      modifyGroup:function(groupType, groupID, groupName, groupText, success, error){
        //修改群信息  groupType：群组类型, groupID：群组ID, groupName：群组名称, groupText：群族公告
        api.modifyGroup(groupType, groupID, groupName, groupText, success, error);
      },
      removeGroup:function(groupID, success, error) {
        //解散群组  groupID：群组ID
        api.removeGroup(groupID, success, error);
      },
      getGroupUpdate:function(groupType, groupID, objectsArr, success, error) {
        //获取群组指定信息  groupType：群组类型, groupID：群组ID, objectsArr：查询的项目代码列表
        api.getGroupUpdate(groupType, groupID, objectsArr, success, error);
      },
      groupAddMember:function(groupID, deptsArr, membersArr, success, error) {
        //群组添加人员（列表）  groupID：群组ID, deptsArr选中所有部门的ID的集合, membersArr：选中所有人员的ID的集合
        api.groupAddMember(groupID, deptsArr, membersArr, success, error);
      },
      groupRemoveMember:function(groupID, membersArr, success, error) {
        //群组移除人员（列表）  groupID：群组ID, membersArr：要删除的群组成员
        api.groupRemoveMember(groupID, membersArr, success, error);
      },
      groupAddAdmin:function(groupID, adminsArr, success, error) {
        //群组添加管理员（列表）  groupID：群组ID, adminsArr：添加的所有管理员的ID
        api.groupAddAdmin(groupID, adminsArr, success, error);
      },
      groupRemoveAdmin:function(groupID, adminsArr, success, error) {
        //群组移除管理员（列表）  groupID：群组ID, adminsArr：所有管理员的集合
        api.groupRemoveAdmin(groupID, adminsArr, success, error);
      },
      getAllGroup:function(success, error) {
        //获取用户所有群组
        api.getAllGroup(success, error);
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


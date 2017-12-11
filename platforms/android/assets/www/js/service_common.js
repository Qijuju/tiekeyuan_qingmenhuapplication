/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('common.services', [])
  .factory('$greendao', function () {
    var greendao;
    document.addEventListener('deviceready', function () {
      greendao = cordova.require('GreenDaoPlugin.green_dao_plugin');
    });
    return {
      //
      loadAllData: function (services, success, error) {
        greendao.loadAllData(services, success, error);
      },
      loadDataByArg: function (services, str, success, error) {
        greendao.loadDataByArg(services, str, success, error);
      },
      queryData: function (services, where, args, success, error) {
        greendao.queryData(services, where, args, success, error);
      },
      saveObj: function (services, jsonObject, success, error) {
        greendao.saveObj(services, jsonObject, success, error);
      },
      saveDataLists: function (services, arraylist, success, error) {
        greendao.saveDataLists(services, arraylist, success, error);
      },
      deleteAllData: function (services, success, error) {
        greendao.deleteAllData(services, success, error);
      },
      deleteDataByArg: function (services, str, success, error) {
        greendao.deleteDataByArg(services, str, success, error);
      },
      deleteObj: function (services, jsonObject, success, error) {
        greendao.deleteObj(services, jsonObject, success, error);

      },
      queryMessagelistByIsSingle: function (services, isSingle, success, error) {

      },
      loadByCount: function (success, error) {
        greendao.loadByCount(success, error);
      },

      queryByConditions: function (services, success, error) {
        greendao.queryByConditions(services, success, error);
      },
      querySearchDetail: function (name, message, success, error) {
        greendao.querySearchDetail(name, message, success, error);
      },
      queryGroupOrSingleChat: function (type, sessionid, success, error) {//消息带2参数
        greendao.queryGroupOrSingleChat(type, sessionid, success, error);
      },
      queryGroupIds: function (one, two, success, error) {
        greendao.queryGroupIds(one, two, success, error);
      },
      queryByType: function (one, two, success, error) {
        greendao.queryByType(one, two, success, error);
      },
      qureyHistoryMsg: function (type, success, error) {
        greendao.qureyHistoryMsg(type, success, error);
      },
      queryByFilepic: function (ssid, type, success, error) {
        greendao.queryByFilepic(ssid, type, success, error);
      },
      queryNotifyChat: function (type, sessionid, success, error) {//新版通知==列表带2参数
        greendao.queryNotifyChat(type, sessionid, success, error);
      },
      queryNewNotifyChat: function (type, sessionid, success, error) {//新版通知==消息带2参数
        greendao.queryNewNotifyChat(type, sessionid, success, error);
      },
      queryDataByDate: function (date, type, success, error) {
        greendao.queryDataByDate(date, type, success, error);
      },
      querySlowNotifyChat: function (type, sessionid, success, error) {//新版一般通知==列表带2参数
        greendao.querySlowNotifyChat(type, sessionid, success, error);
      },
      querySlowDataByDate: function (date, type, success, error) {
        greendao.querySlowDataByDate(date, type, success, error);
      },
      queryDataByquery: function (query, success, error) {
        greendao.queryDataByquery(query, success, error);
      },
      queryDataByIdAndIsread: function (sessionid, isread, success, error) {
        greendao.queryDataByIdAndIsread(sessionid, isread, success, error);
      },
      getUUID: function (success) {//获取UUID码
        greendao.getUUID(success);
      },
      queryByToday: function (success, error) {
        greendao.queryByToday(success, error);
      },
      queryByWeek: function (success, error) {
        greendao.queryByWeek(success, error);
      },
      queryByYesterday: function (success, error) {
        greendao.queryByYesterday(success, error);
      },
      queryNotifyCount: function (sessionid, success, error) {
        greendao.queryNotifyCount(sessionid, success, error)
      },
      queryLongFile: function (ssid, type, success, error) {
        greendao.queryLongFile(ssid, type, success, error);
      },
      queryWeekFile: function (ssid, type, success, error) {
        greendao.queryWeekFile(ssid, type, success, error);
      },
      queryMonthFile: function (ssid, type, success, error) {
        greendao.queryMonthFile(ssid, type, success, error);
      },
      queryTodayFile: function (ssid, type, success, error) {
        greendao.queryTodayFile(ssid, type, success, error);
      },

      deleteBySessionid: function (sessionid, success, error) {
        greendao.deleteBySessionid(sessionid, success, error);

      }
    };

  })
  .factory('$api', function ($ToastUtils) {//系统接口。
    var api;
    return {
      init: function () {
        document.addEventListener('deviceready', function () {
          api = cordova.require('ThriftApiClient.thrift_api_client');
        });
      },
      openFile: function (filePath, success, error) {
        api.openFile(filePath, success, error);
      },
      login: function (username, password, success, error) {
        api.login(username, password, success, error);
      },
      confirmSecretText: function (id,mepId,secretText, success, error) {
        api.confirmSecretText(id,mepId,secretText, success, error);
      },
      activeUser: function (userId, success, error) {
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
      getOtherHeadPic: function (picUserID, picSize, success, error) {
        api.getOtherHeadPic(picUserID, picSize, success, error);
      },
      setHeadPic: function (success, error) {
        api.setHeadPic(success, error);
      },
      getVersionInfo: function (success, error) {
        api.getVersionInfo(success, error);
      },
      getVersion: function (savePath, versionname, filesize, success, error) {
        api.getVersion(savePath, versionname, filesize, success, error);
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
      needUpgrade: function (versionName, success, error) {
        api.needUpgrade(versionName, success, error);
      },
      installApk: function (targetPath, success, error) {//安装应用
        api.installApk(targetPath, success, error);
      },
      downloadMHApk: function (fileid, filesize, success, error) {//升级应用(包含下载和安装，http)
        api.downloadMHApk(fileid, filesize, success, error);
      },
      downloadQYYIcon: function (fileid, success, error) {//下载轻应用图标
        api.downloadQYYIcon(fileid,success, error);
      },
      getWelcomePic: function (picUserID, picSize, success, error) {
        api.getWelcomePic(picUserID, picSize, success, error);
      },
      checkUpdate: function ($ionicPopup, $cordovaFileOpener2,isFromMy) {

        var flag ;//请求来源
        var versionName;//应用版本名
        var versionDesc;//应用版本描述
        var filesize ;//应用大小

        /**
         * 该判断是为了解析该请求来源：若为true,说明来源于关于--在线升级
         * 若为false，说明来源于应用主界面
         */
        if(isFromMy){
          flag = false;
        }else{
          cordova.plugins.MqttChat.getString('isShowConfirm',function (succ) {
            console.log("进来了吗");
            if(succ != null ||succ != '' || succ != undefined){
              flag = succ;
            }
          },function (err) {
            flag = false;
          });
        }

        api.getVersionInfo(function (msg) {
          /**
           * 若版本号不为空，则表示要提示用户升级
           * 若版本号为空，则表示当前应用已是最新版本
           */
          if(msg.versionName != null && msg.versionName != ''){
            versionName = msg.versionName;
            versionDesc = msg.versionDesc;
            filesize = msg.size;

            api.needUpgrade(versionName,function(isUpdate){
              if(isUpdate == 'true'){
                flag = false;
              }
            },function (err) {
            });
            console.log("查看flag"+flag);
            /**
             * 进入主界面时，判断是升级or忽略，若是忽略则服务端不发布新版本前都不提示升级
             */
            if(!flag){
                //需要升级
                var confirmPopup = $ionicPopup.confirm({
                  title: '版本升级',
                  template: versionDesc, //从服务端获取更新的内容
                  cancelText: '忽略',
                  okText: '升级'
                });

                confirmPopup.then(function (res) {
                  if (res) {
                    //点击升级走的方法
                    api.downloadMHApk(versionName, filesize, function (succ) {
                      // 成功
                      cordova.plugins.MqttChat.save('local_versionname', versionName);
                    }, function (err) {
                      // 错误
                      cordova.plugins.MqttChat.save('local_versionname', "");
                    });
                  } else {
                    //点击取消更新走的方法
                    flag = true;
                    cordova.plugins.MqttChat.save('isShowConfirm',flag);
                    cordova.plugins.MqttChat.save('local_versionname', versionName);
                  }

                });
            }
          }else{
            $ToastUtils.showToast(msg);
          }

          //判断此版本是否需要升级
          // api.needUpgrade(versionName, function (data) {
          //   // console.log("文件大小和版本名"+filesize+"====="+versionName+"======="+JSON.stringify(data));
          //
          // }, function (err) {
          //   //判断是否能升级失败
          // })


        }, function (err) {
          //获取版本信息失败
          $ToastUtils.showToast(err);
        });

      },
      getHistoryMsg: function (sessionType, sessionID, pageNum, pageCount, success, error) {//获取历史消息
        api.getHistoryMsg(sessionType, sessionID, pageNum, pageCount, success, error);
      },
      getMsgCount: function (sessionType, sessionID, success, error) {//获取历史消息数
        api.getMsgCount(sessionType, sessionID, success, error);
      },
      cancelUser: function (success, error) {//解绑用户（让其他用户可以使用该帐号登录其他设备）
        api.cancelUser(success, error);
      },
      //以下为群组接口
      addGroup: function (groupName, deptsArr, membersArr, success, error) {
        //创建群组  groupName：群组名, deptsArr：所有部门（deptID的组合）, membersArr：所有选中人员（人员ID的组合）
        api.addGroup(groupName, deptsArr, membersArr, success, error);
      },
      getGroup: function (groupIdsArr, success, error) {
        //获取群组（列表）信息  groupIdsArr：群组ID的集合
        api.getGroup(groupIdsArr, success, error);
      },
      modifyGroup: function (groupType, groupID, groupName, groupText, success, error) {
        //修改群信息  groupType：群组类型, groupID：群组ID, groupName：群组名称, groupText：群族公告
        api.modifyGroup(groupType, groupID, groupName, groupText, success, error);
      },
      removeGroup: function (groupID, success, error) {
        //解散群组  groupID：群组ID
        api.removeGroup(groupID, success, error);
      },
      getGroupUpdate: function (groupType, groupID, objectsArr, success, error) {
        //获取群组指定信息  groupType：群组类型, groupID：群组ID, objectsArr：查询的项目代码列表
        api.getGroupUpdate(groupType, groupID, objectsArr, success, error);
      },
      groupAddMember: function (groupID, deptsArr, membersArr, success, error) {
        //群组添加人员（列表）  groupID：群组ID, deptsArr选中所有部门的ID的集合, membersArr：选中所有人员的ID的集合
        api.groupAddMember(groupID, deptsArr, membersArr, success, error);
      },
      groupRemoveMember: function (groupID, membersArr, success, error) {
        //群组移除人员（列表）  groupID：群组ID, membersArr：要删除的群组成员
        api.groupRemoveMember(groupID, membersArr, success, error);
      },
      groupAddAdmin: function (groupID, adminsArr, success, error) {
        //群组添加管理员（列表）  groupID：群组ID, adminsArr：添加的所有管理员的ID
        api.groupAddAdmin(groupID, adminsArr, success, error);
      },
      groupRemoveAdmin: function (groupID, adminsArr, success, error) {
        //群组移除管理员（列表）  groupID：群组ID, adminsArr：所有管理员的集合
        api.groupRemoveAdmin(groupID, adminsArr, success, error);
      },
      getAllGroup: function (success, error) {
        //获取用户所有群组
        api.getAllGroup(success, error);
      },
      getAllGroupIds: function (success, error) {//获取所有群组的群组ID，群组ID之间以逗号隔开，返回字符串
        api.getAllGroupIds(success, error);
      },
      //二维码登录接口，qrcode：扫描到的二维码  返回布尔类型的值：true为成功，false为登录失败
      qrcodeLogin: function (qrcode, success, error) {
        api.qrcodeLogin(qrcode, success, error);
      },
      //图片发送接口
      sendFile: function (objectTP, objectID, filePath, success, error) {
        api.sendFile(objectTP, objectID, filePath, success, error);
      },
      //文件发送接口
      sendDocFile: function (messageDetail, objectTP, objectID, filePath, success, error) {
        api.sendDocFile(messageDetail, objectTP, objectID, filePath, success, error);
      },
      getFile: function (objectTP, objectID, picSize, success, error) {//图片下载接口
        api.getFile(objectTP, objectID, picSize, success, error);
      },
      checkLocalUser: function (userMBList, success, error) {//通讯录验证接口    userMBObj：通讯录联系人集合
        api.checkLocalUser(userMBList, success, error);
      },
      openFileByPath: function (path, msg, success, error) {//打开文件
        api.openFileByPath(path, msg, success, error);
      },
      SetDeptInfo: function (success, error) {//登录成功将部门信息入库
        api.SetDeptInfo(success, error);
      },
      readMessage: function (sessionType, sessionID, sendWhen, success, error) {//确认消息回复
        api.readMessage(sessionType, sessionID, sendWhen, success, error);
      },
      getNotifyMsg: function (date, isAttention, formId, pageNum, pageCount, success, error) {//获取通知消息
        api.getNotifyMsg(date, isAttention, formId, pageNum, pageCount, success, error)
      },
      setNotifyMsg: function (msgId, setReaded, setToped, setAttention, success, error) {//设置已读未读消息
        api.setNotifyMsg(msgId, setReaded, setToped, setAttention, success, error)
      },
      getMsgReadList: function (msgId, isReaded, success, error) {//获取确认 未确认列表
        api.getMsgReadList(msgId, isReaded, success, error)
      },
      sendOperateLog: function (type, when, appId, success, error) {//新增一个客户端操作记录的接口
        api.sendOperateLog(type, when, appId, success, error);
      },
      switchLoginUser : function(infoBean,success, error) {//新增一个登陆返回信息转换接口
        api.switchLoginUser(infoBean, success, error);
      }
    };
  })

  .factory('$ToastUtils', function () {//系统接口。
    /*原生提供的插件调用方法*/
    // var toast_utils;
    // document.addEventListener('deviceready',function () {
    //   toast_utils = cordova.require('ToastUtils.toast_utils');
    // });
    return {
      // showToast:function(content,success, error) {
      //   toast_utils.showToast(content,success,error);
      // }
      /**cordova-totast 插件提供公共方法**/
      showToast: function (messgaeText) {
        window.plugins.toast.showWithOptions({
          message: messgaeText,
          duration: "short", // 2000 ms
          position: "bottom",
          styling: {
            opacity: 1, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
            backgroundColor: '#808080', // make sure you use #RRGGBB. Default #333333
            textColor: '#FFFFFF', // Ditto. Default #FFFFFF
            textSize: 10, // Default is approx. 13.
            cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100
            horizontalPadding: 20, // iOS default 16, Android default 50
            verticalPadding: 16 // iOS default 12, Android default 30
          }
        });
      }
    }
  })
  .factory('$ScalePhoto', function () {//放大缩小图片的
    var scalephoto;
    document.addEventListener('deviceready', function () {
      scalephoto = cordova.require('ScalePhoto.scale_photo');
    });
    return {
      scale: function (filepath, success, error) {
        scalephoto.scale(filepath, success, error)
      },
      netScale: function (fileid, imagename, smallfilepath, succsee, error) {
        scalephoto.netScale(fileid, imagename, smallfilepath, succsee, error)
      }
    }

  })

  // 定义随机色
  .factory('$RandomColor', function () {
    return {
      randomC:function () {
        var r = Math.floor(Math.random()*256);
        var g = Math.floor(Math.random()*256);
        var b = Math.floor(Math.random()*256);

        if (r>200&&g>200&&b>200){
          r = Math.floor(Math.random()*201);
          g = Math.floor(Math.random()*201);
          b = Math.floor(Math.random()*201);
        }

        var rgbC = "rgb("+r+","+g+","+b+")";
        return rgbC;
      }
    }
  })

  .factory('$GridPhoto', function () {
    var gridPhoto;
    document.addEventListener('deviceready', function () {
      gridPhoto = cordova.require('GridPhoto.grid_photo');
    });

    return {
      queryPhoto: function (sessionid, type, success, error) {
        gridPhoto.queryPhoto(sessionid, type, success, error)

      }
    }

  })

  .factory('$saveMessageContacts', function ($greendao) {

    return {
      saveMessageContacts: function (id, phone, name) {

        $greendao.queryData("TopContactsService", 'where _id =?', id, function (msg) {
          if (msg.length > 0) {
            //如果大于0说明已经村上去一次
            var messageCount = msg[0].count;
            //取到值后再重新存一次
            var queryTopContact = {};
            queryTopContact._id = msg[0]._id;
            queryTopContact.phone = phone;
            queryTopContact.name = msg[0].name;
            queryTopContact.type = msg[0].type;
            queryTopContact.count = messageCount + 1;
            queryTopContact.when = 0;

            $greendao.saveObj('TopContactsService', queryTopContact, function (data) {

            }, function (err) {

            });
          } else {
            var firstTopContact = {};
            firstTopContact._id = id;
            firstTopContact.phone = phone;
            firstTopContact.name = name;
            firstTopContact.type = "3";
            firstTopContact.count = 1;
            firstTopContact.when = 0;
            $greendao.saveObj('TopContactsService', firstTopContact, function (data) {
            }, function (err) {

            });
          }
        })

      }
    }


  })

  .factory('$okhttp', function () {//上传下载
    var okhttp;
    document.addEventListener('deviceready', function () {
      okhttp = cordova.require('Okhttpload.okhttpload');
    });
    return {
      upload: function (messageDetail, objectTP, objectID, filepath, url, success, error) {
        okhttp.upload(messageDetail, objectTP, objectID, filepath, url, success, error)
      },
      download: function (fileId, type, picSize, offset, succsee, error) {
        okhttp.download(fileId, type, picSize, offset, succsee, error)
      },
      downloadFile: function (messagedetail, offset, isrightpath, succsee, error) {
        okhttp.downloadFile(messagedetail, offset, isrightpath, succsee, error)
      }
    }

  })

  .factory('$judgeAOrI', function () {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    // alert('是否是Android：'+isAndroid);
    // alert('是否是iOS：'+isiOS);
    return {
      judgeAndroid: function () {
        return isAndroid;
      },
      judgeIos: function () {
        return isiOS;
      }
    }
  })

  .factory('$pubionicloading', function ($judgeAOrI) {
    return {
      showloading: function (title, content) {
        // alert("进来了吗"+$judgeAOrI.judgeAndroid());
        if ($judgeAOrI.judgeAndroid()) {
          // alert("aaaa");
          window.plugins.spinnerDialog.show(title, content, true);
        } else if ($judgeAOrI.judgeIos()) {
          window.plugins.spinnerDialog.show(title, content, true, {
            overlayOpacity: 0.35,
            textColorRed: 1,
            textColorGreen: 1,
            textColorBlue: 1
          });
        }
      },
      hide: function () {
        window.plugins.spinnerDialog.hide();
      }
    }
  })
  .factory('$BadgeCount', function ($greendao, $scope) {
    return {
      getBadgeCount: function () {
        $greendao.loadAllData('ChatListService', function (msg) {
          $scope.allNoRead = 0;
          if (msg.length > 0) {
            for (var i = 0; i < msg.length; i++) {
              $scope.allNoRead = $scope.allNoRead + parseInt(msg[i].count, 10);
            }
            cordova.plugins.notification.badge.set($scope.allNoRead, function (succ) {
              // alert("刷新监听成功" + succ);
              cordova.plugins.MqttChat.saveInt("badgeCount", $scope.allNoRead);
            }, function (err) {
              alert("失败" + err);
            });
          }
        }, function (err) {

        })
      }
    }
  })

  .factory('$formalurlapi',function () {

    // var baseurl="http://immobile.r93535.com:8088/crbim/imApi/1.0";//门户模块正式环境地址
    var baseurl="http://imtest.crbim.win:8080/apiman-gateway/jishitong/interface/1.0?apikey=b8d7adfb-7f2c-47fb-bac3-eaaa1bdd9d16";//门户模块开发环境地址
    // var baseurl="http://88.1.1.22:8081";//门户模块测试环境地址
    // var baseurl="http://chuannanims.r93535.com:8088";
    // var baseurl="http://202.137.140.133:6001";//老挝环境
    return{
      getBaseUrl:function () {
        return baseurl;
      }
    }
  })

  //由于前端调用的js进行code转换时
  .factory('$relex',function () {
    return{
      getReplaceAfter:function (data) {
        return data.replace(/\+/g, '%20');
      }
    }
  })




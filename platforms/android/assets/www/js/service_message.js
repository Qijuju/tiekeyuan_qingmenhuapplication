/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('message.services', [])


  //单聊会话列表的数据保存
.factory('$chatarr',function ($state,$stateParams,$rootScope,$greendao,$mqtt) {
  var mainlist=new Array();
  var savedata;
  var id,chatname;
  return{
    getAll:function (isPersonSend) {
      if(isPersonSend === 'true'){
        var chatitem={};
        if(chatitem.id === undefined || chatitem.chatName === undefined){
          chatitem.id=$rootScope.id;
          chatitem.chatName=$rootScope.username;
          // alert(chatitem.id+"监听消息来源"+chatitem.chatName);
        }else{
          chatitem.id=$stateParams.id;
          chatitem.chatName=$stateParams.ssid;
        }
        chatitem.imgSrc='';
        chatitem.lastText='';
        chatitem.count='';
        chatitem.isDelete='false';
        chatitem.lastDate=new Date().getTime();
        chatitem.chatType='U';
        mainlist.push(chatitem);
        $greendao.saveObj('ChatListService',chatitem,function (data) {
          // alert("保存成功"+data.length)
        },function (err) {
        });
        $rootScope.$broadcast('chatarr.update');
      }
      return mainlist;
    },
    setData:function (data) {
      savedata = data;
    },
    getData:function () {
      return savedata;
    },
    getIdChatName:function (id,chatname) {
      $rootScope.id=id;
      $rootScope.username=chatname;
      // alert("先收到"+$rootScope.id+$rootScope.username);
    }
  }
})

  //群组会话列表的数据保存
  .factory('$grouparr',function ($state,$stateParams,$rootScope,$greendao,$mqtt) {
    var grouplist=new Array();
    var savegroupdata;
    return{
      getAllGroupList:function (isGroupSend) {
        alert("标识符"+isGroupSend);
        if(isGroupSend === 'true'){
          alert("跳转到service界面"+$stateParams.id+$stateParams.sessionid);
          var groupchatitem={};
          groupchatitem.id=$stateParams.id;
          groupchatitem.chatName=$stateParams.sessionid;
          groupchatitem.imgSrc='img/icon_org.png';
          groupchatitem.lastText='';
          groupchatitem.count='';
          groupchatitem.isDelete='false';
          groupchatitem.lastDate=new Date().getTime();
          groupchatitem.chatType='G';
          grouplist.push(groupchatitem);
          $greendao.saveObj('ChatListService',groupchatitem,function (data) {
            alert("保存成功"+data.length)
          },function (err) {
          });
          $rootScope.$broadcast('groupchatarr.update');
        }
        return grouplist;
      },
      setData:function (data) {
        savegroupdata = data;
      },
      getData:function () {
        return savegroupdata;
      }
    }
  })

  .factory('$mqtt',function ($rootScope,$greendao) {
    var mqtt;
    var msgs=new Array();
    var danliao=new Array();
    var qunliao=new Array();

    var groupMsgs=new Array();
    var lastMsgs=new Array();
    var size;
    var count = 0;
    var groupCount=0;
    var isLogin = false;

    document.addEventListener('deviceready',function () {
      mqtt = cordova.require('MqttChat.mqtt_chat');
    });
    return{

      startMqttChat:function(topics){
        document.addEventListener('deviceready',function () {
          mqtt.startMqttChat(topics,function (message) {
          },function (message) {
          });
        });
        return -1;
      },


      getMqtt:function(){
        return mqtt;
      },


      sendMsg:function (topic, content, id,localuser,localuserId,sqlid) {
        var messageDetail={};
        messageDetail._id=sqlid;
        messageDetail.sessionid=id;
        messageDetail.type='User';
        messageDetail.from='true';
        messageDetail.message=content;
        messageDetail.messagetype='normal';
        messageDetail.platform='Windows';
        messageDetail.when=new Date().getTime();
        messageDetail.isFailure='false';
        messageDetail.isDelete='false';
        messageDetail.imgSrc='';
        messageDetail.username=localuser;
        messageDetail.senderid=localuserId;
        alert("发送者id"+localuserId);
        mqtt.sendMsg(topic, messageDetail, function (message) {
          alert("发送者id123"+localuserId);
          danliao.push(messageDetail);
          $greendao.saveObj('MessagesService',messageDetail,function (data) {
          },function (err) {
            alert(err+"sendmistake");
          });
          $rootScope.firstSendId=messageDetail.sessionid;
          // alert("发送消息时对方id"+$rootScope.firstSendId);
          $rootScope.$broadcast('msgs.update');
          return "成功";
        },function (message) {
          messageDetail.isFailure='true';
          danliao.push(messageDetail);
          $greendao.saveObj('MessagesService',messageDetail,function (data) {
            if (data != 'success') {
              messageDetail._id = data;
              // alert(messageDetail._id+"消息失败id"+data);
              $rootScope.$broadcast('msgs.error');
            }
          },function (err) {
          });
          return "失败";
        });
        return "啥也不是";
      },

      arriveMsg:function (topic) {
        mqtt.getChats(topic,function (message) {
          var arriveMessage={};
          arriveMessage._id='';
          arriveMessage.sessionid=message.sessionid;
          arriveMessage.type=message.type;
          arriveMessage.from=message.from;
          arriveMessage.message=message.message;
          arriveMessage.messagetype=message.messagetype;
          arriveMessage.platform=message.platform;
          arriveMessage.when=message.when;
          arriveMessage.isFailure=message.isFailure;
          arriveMessage.isDelete=message.isDelete;
          arriveMessage.imgSrc=message.imgSrc;
          arriveMessage.username=message.username;
          arriveMessage.senderid=message._id;
          alert("接受消息"+arriveMessage.senderid);
          $greendao.saveObj('MessagesService',arriveMessage,function (data) {
            alert(data.length+"收消息");
          },function (err) {
          });
          if(message.type==="User"){
            count++;
            // alert("接受消息的sessionid"+arriveMessage.sessionid+arriveMessage.username);
            $rootScope.firstSessionid=arriveMessage.sessionid;
            $rootScope.firstUserName=arriveMessage.username;
            // alert("存的对不对"+$rootScope.firstSessionid);
            danliao.push(arriveMessage);
          }else {
            groupCount++;
            qunliao.push(arriveMessage);
          }
          $rootScope.$broadcast('msgs.update');

          return size;

        },function (message) {
          return 0;
        });

        return "nihao";
      },

      getDanliao:function () {
        return danliao;
      },
      getQunliao:function () {
        return qunliao;
      },

      getMsgCount:function () {
        return count;
      },

      clearMsgCount:function () {
        count=0;
      },

      getMsgGroupCount:function () {
        return groupCount;
      },

      clearMsgGroupCount:function () {
        // alert("clear");
        groupCount=0;
      },
      getFirstReceiverSsid:function(){
        // alert($rootScope.firstSessionid+"save");
        return $rootScope.firstSessionid;
      },
      getFirstReceiverChatName:function () {
        return $rootScope.firstUserName;
      },
      getSenderID:function () {
        return $rootScope.firstSendId;
      },

      sendGroupMsg:function (topic, content, id,localuser,localuserId,sqlid) {
        alert("发送群消息"+sqlid);
        var messageReal={};
        messageReal._id=sqlid;
        messageReal.sessionid=id;
        messageReal.type='Group';
        messageReal.from='true';
        messageReal.message=content;
        messageReal.messagetype='normal';
        messageReal.platform='Windows';
        messageReal.when=new Date().getTime();
        messageReal.isFailure='false';
        messageReal.isDelete='false';
        messageReal.imgSrc='';
        messageReal.username=localuser;
        messageReal.senderid=localuserId;
        alert(chatname+"ssss");
        mqtt.sendMsg(topic, messageReal, function (message) {
          qunliao.push(messageReal);
          $greendao.saveObj('MessagesService',messageReal,function (data) {
            alert("群组消息保存成功");
          },function (err) {
            alert("群组消息保存失败");
          });
          $rootScope.$broadcast('groupMsgs.update');
          return "成功";
        },function (message) {
          messageReal.isFailure='true';
          qunliao .push(messageReal);
          $greendao.saveObj('MessagesService',messageReal,function (data) {
            alert(data);
          },function (err) {
            alert(err+"msgerr");
          });
          $rootScope.$broadcast('groupMsgs.error');
          return "失败";
        });
        return "啥也不是";
      },

      // rececivGroupMsg:function (topic) {
      //
      //   mqtt.getChats(topic,function (message) {
      //     if(!(message.id===topic)){
      //
      //       var messageGroup={};
      //       messageGroup._id=message._id;
      //       messageGroup.account=message.account;
      //       messageGroup.sessionid=message.sessionid;
      //       messageGroup.type=message.type;
      //       messageGroup.from=message.from;
      //       messageGroup.message=message.message;
      //       messageGroup.messagetype=message.messagetype;
      //       messageGroup.platform=message.platform;
      //       messageGroup.when=message.when;
      //       messageGroup.isFailure='false';
      //       // msgs.push(messageGroup);
      //       $greendao.saveObj('MessagesService',messageGroup,function (data) {
      //         // alert("群组接收消息保存成功");
      //       },function (err) {
      //         alert("群组接收消息保存失败");
      //       });
      //       // messages.addMsgs(messageGroup);
      //       groupCount++;
      //       $rootScope.$broadcast('groupMsgs.update');
      //       return size;
      //     }
      //   },function (message) {
      //     return 0;
      //   });
      //
      //   return "nihao";
      // },






      // getAllMsg:function () {
      //   // messages.getMsgsBySingle(function (data) {
      //   //   $scope.msgs=data;
      //   // })
      //   return msgs;
      // },
      //
      // getAllGroupMsg:function () {
      //   // messages.getMsgsBySingle(function (data) {
      //   //   $scope.groupMsgs=data;
      //   // })
      //   return msgs;
      // },
      disconnect:function (success, error) {
        mqtt.disconnect(success, error);
      },
      save:function (key,value) {
        mqtt.save(key,value);
      },
      getUserInfo:function (success, error) {//获取用户信息（登录之后可以使用该方法）
        mqtt.getUserInfo(success, error);
      },
      setLogin:function (loginStatus) {
        isLogin = loginStatus;
      },
      isLogin:function () {
        return isLogin;
      }


    };
  })

  .factory('$historyduifang',function ($api,$rootScope) {
    var historymessageduifang;
    return{
      getHistoryduifanga:function (sessionType, sessionID, pageNum, pageCount) {
        $api.getHistoryMsg(sessionType, sessionID, pageNum, pageCount,function (message) {
          historymessageduifang=message;
          $rootScope.$broadcast('historymsg.duifang');
        },function (message) {
          $rootScope.$broadcast('historymsg.duifang');
        });
      },
      getHistoryduifangc:function () {
        return historymessageduifang;
      }
    }
  })

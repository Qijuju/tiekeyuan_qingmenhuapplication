/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('message.services', [])


  //单聊会话列表的数据保存
.factory('$chatarr',function ($state,$stateParams,$rootScope,$greendao,$mqtt) {
  var mainlist =new Array();
  var savedata;
  var id,chatname;
  return{
    getAll:function (isPersonSend,messageType) {
      if(isPersonSend === 'true'){
        var chatitem={};
        if(chatitem.id === undefined || chatitem.chatName === undefined){
          chatitem.id=$rootScope.id;
          chatitem.chatName=$rootScope.username;
          // alert(chatitem.id+"监听消息来源"+chatitem.chatName);
        }else{
          chatitem.id=$stateParams.id;
          chatitem.chatName=$stateParams.ssid;
          // alert(chatitem.id+"监听消息来源222"+chatitem.chatName);
        }
        chatitem.imgSrc='';
        chatitem.lastText='';
        chatitem.count='';
        chatitem.isDelete='false';
        chatitem.lastDate=new Date().getTime();
        chatitem.senderId ='';
        chatitem.senderName ='';
        if(messageType === 'User'){
          chatitem.chatType='User';
        }else if(messageType === 'Dept'){
          chatitem.chatType='Dept';
        }else if(messageType === 'Group'){
          chatitem.chatType='Group';
        }
        mainlist.push(chatitem);
        // alert("进来会话列表了吗");
        $greendao.saveObj('ChatListService',chatitem,function (data) {
          $rootScope.$broadcast('chatarr.update');
          // alert("保存成功"+data.length)
        },function (err) {
        });
      }
      return mainlist;
    },
    setData:function (data) {
      mainlist =new Array();
      savedata = data;
      mainlist =savedata;
    },
    updatechatdata:function (data) {
      for(var i=0;i<=mainlist.length-1;i++){
        if( mainlist[i].id === data.id){
          // alert("找出chat数组的被更改的数据了"+i);
          mainlist.splice(i,1);
        }
      }
      mainlist.unshift(data);
      // alert("建群时消息"+data.lastText);
    },
    getAllData:function () {
      // alert("service界面数组长度"+mainlist.length);
      return mainlist;
    },
    getIdChatName:function (id,chatname) {
      $rootScope.id=id;
      $rootScope.username=chatname;
      // alert("先收到"+$rootScope.id+$rootScope.username);
    }
  }
})

  .factory('$notifyarr',function ($state,$stateParams,$rootScope,$greendao,$mqtt) {
    var notifylist =new Array();
    var savenotifydata;
    var id,chatname;
    return{
      createNotifyData:function (isNotifySend,messageType) {
        if(isNotifySend === 'true'){
          var chatitem={};
          if(chatitem.id === undefined || chatitem.chatName === undefined){
            chatitem.id=$rootScope.id;
            chatitem.chatName=$rootScope.username;
            // alert(chatitem.id+"监听消息来源"+chatitem.chatName);
          }else{
            chatitem.id=$stateParams.id;
            chatitem.chatName=$stateParams.ssid;
            // alert(chatitem.id+"监听消息来源222"+chatitem.chatName);
          }
          chatitem.imgSrc='';
          chatitem.lastText='';
          chatitem.count='';
          chatitem.isDelete='false';
          chatitem.lastDate=new Date().getTime();
          chatitem.senderId ='';
          chatitem.senderName ='';
          if(messageType === 'System'){
            chatitem.chatType='System';
          }else if(messageType === 'Alarm'){
            chatitem.chatType='Alarm';
          }
          notifylist.push(chatitem);
          // alert("进来会话列表了吗");
          $greendao.saveObj('NotifyListService',chatitem,function (data) {
            $rootScope.$broadcast('notifyarr.update');
            // alert("保存成功"+data.length)
          },function (err) {
          });
        }
        return notifylist;
      },
      setNotifyData:function (data) {
        notifylist=new Array();
        savenotifydata = data;
        notifylist =savenotifydata;
      },
      updatelastData:function (data) {
        for(var i=0;i<=notifylist.length-1;i++){
          // alert("data ===="+data.lastText+"数组长度"+notifylist.length);
          if( notifylist[i].id === data.id){
            // alert("找出数组的被更改的数据了"+i);
            notifylist.splice(i,1);
          }
        }
        notifylist.unshift(data);
        // alert("push after"+notifylist[notifylist.length-1].lastText+"数组长度"+notifylist.length);
      },
      getAllNotifyData:function () {
        // alert("service界面数组长度"+notifylist.length);
        return notifylist;
      },
      getNotifyIdChatName:function (id,chatname) {
        $rootScope.id=id;
        $rootScope.username=chatname;
        // alert("先收到"+$rootScope.id+$rootScope.username);
      }
    }
  })


  //群组会话列表的数据保存
  // .factory('$grouparr',function ($state,$stateParams,$rootScope,$greendao,$mqtt) {
  //   var grouplist =new Array();
  //   var savegroupdata;
  //   return{
  //     getAllGroupList:function (isGroupSend,messageType) {
  //       if(isGroupSend === 'true'){
  //         // alert("跳转到service界面"+$stateParams.sessionid);
  //         var groupchatitem={};
  //         if(groupchatitem.id === undefined || groupchatitem.chatName === undefined){
  //           groupchatitem.id=$rootScope.id;
  //           groupchatitem.chatName=$rootScope.username;
  //           // alert("dsddfs"+$rootScope.id+$rootScope.username);
  //           // alert(groupchatitem.id+"监听群组消息来源"+groupchatitem.chatName);
  //         }else{
  //           groupchatitem.id=$stateParams.id;
  //           groupchatitem.chatName=$stateParams.sessionid;
  //         }
  //         groupchatitem.imgSrc='img/quntu1.png';
  //         groupchatitem.lastText='';
  //         groupchatitem.count='';
  //         groupchatitem.isDelete='false';
  //         groupchatitem.lastDate=new Date().getTime();
  //         groupchatitem.senderId ='',
  //         groupchatitem.senderName ='';
  //         if(messageType === 'Dept'){
  //           groupchatitem.chatType='Dept';
  //         }else if(messageType === 'Group'){
  //           groupchatitem.chatType='Group';
  //         }
  //         // alert("保存记录成功群");
  //         grouplist.push(groupchatitem);
  //         $greendao.saveObj('ChatListService',groupchatitem,function (data) {
  //           $rootScope.$broadcast('groupchatarr.update');
  //           // alert("保存成功"+data.length)
  //         },function (err) {
  //         });
  //
  //       }
  //       return grouplist;
  //     },
  //     setData:function (data) {
  //       grouplist=new Array();
  //       savegroupdata = data;
  //       grouplist=savegroupdata;
  //     },
  //     updateGroupData:function (data) {
  //       for(var i=0;i<=grouplist.length-1;i++){
  //         // alert("data ===="+data.lastText+"数组长度"+notifylist.length);
  //         if( grouplist[i].id === data.id){
  //           // alert("找出数组的被更改的数据了"+i);
  //           grouplist.splice(i,1);
  //         }
  //       }
  //       grouplist.unshift(data);
  //       // alert("push after"+notifylist[notifylist.length-1].lastText+"数组长度"+notifylist.length);
  //     },
  //     getAllGroupChatList:function () {
  //       return grouplist;
  //     },
  //     getGroupIdChatName:function (id,chatname) {
  //       $rootScope.id=id;
  //       $rootScope.username=chatname;
  //       // alert("先收到群组"+$rootScope.id+$rootScope.username);
  //     }
  //   }
  // })

  .factory('$mqtt',function ($rootScope,$greendao,$api) {
    var mqtt;
    var msgs=new Array();
    var danliao=new Array();
    var qunliao=new Array();
    var sysmsg=new Array();
    var size;
    var count = 0;
    var groupCount=0;
    var syscount =0;
    var isLogin = false;
    document.addEventListener('deviceready',function () {
      mqtt = cordova.require('MqttChat.mqtt_chat');
    });
    return{

      startMqttChat:function(topics){
        if (topics === undefined || topics === null || topics === '') {
          alert('非法登录！');
          return;
        }
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


      sendMsg:function (topic, content, id,localuser,localuserId,sqlid,messagetype,picPath) {
        var messageDetail={};
        messageDetail._id=sqlid;
        messageDetail.sessionid=id;
        messageDetail.type='User';
        messageDetail.from='true';
        if (messagetype === undefined || messagetype === null || messagetype === '') {
          messagetype = 'normal';
        }
        messageDetail.message=content;
        messageDetail.messagetype=messagetype;
        messageDetail.platform='Windows';
        messageDetail.when=new Date().getTime();
        messageDetail.isFailure='false';
        messageDetail.isDelete='false';
        messageDetail.imgSrc='';
        messageDetail.username=localuser;
        messageDetail.senderid=localuserId;
        //判断是不是位置
        if(messagetype === 'LOCATION'){
          // alert("添加定位之前"+danliao.length+messageDetail.message+messagetype);
            danliao.push(messageDetail);
            $greendao.saveObj('MessagesService',messageDetail,function (data) {
              $rootScope.$broadcast('msgs.update');
            },function (err) {
            });
          var arrs = content.split(',');
          var longt = arrs[0];
          var lat = arrs[1];
          messageDetail.message=longt+","+lat;
        }
        mqtt.sendMsg(topic, messageDetail, function (message) {
          if (picPath != undefined && picPath != null && picPath != '') {
            messageDetail.message = picPath;
          }
          if(messagetype === 'LOCATION'){
            messageDetail.message=content;
            // alert("发送出去后的类型"+messageDetail.messagetype);
          }
          //判断是不是位置
          if(!(messagetype === 'LOCATION')){
            danliao.push(messageDetail);
            $greendao.saveObj('MessagesService',messageDetail,function (data) {
              $rootScope.$broadcast('msgs.update');
            },function (err) {
              // alert(err+"sendmistake");
            });
            // alert("发送消息"+content);
          }
          $rootScope.firstSendId=messageDetail.sessionid;
          // alert("发送消息时对方id"+$rootScope.firstSendId);
          return "成功";
        },function (message) {
          if (picPath != undefined && picPath != null && picPath != '') {
            messageDetail.message = picPath;
          }
          messageDetail.isFailure='true';
          danliao.push(messageDetail);
          $greendao.saveObj('MessagesService',messageDetail,function (data) {
            $rootScope.$broadcast('msgs.error');
            if (data != 'success') {
              messageDetail._id = data;
              // alert(messageDetail._id+"消息失败id"+data);
            }
          },function (err) {
          });
          return "失败";
        });
        return "啥也不是";
      },
      sendDocFileMsg:function (topic, fileContent, content, id,localuser,localuserId,sqlid,messagetype,picPath) {
        var messageDetail={};
        messageDetail._id=sqlid;
        messageDetail.sessionid=id;
        messageDetail.type='User';
        messageDetail.from='true';
        if (messagetype === undefined || messagetype === null || messagetype === '') {
          messagetype = 'normal';
        }
        messageDetail.message=content;
        messageDetail.messagetype=messagetype;
        messageDetail.platform='Windows';
        messageDetail.when=new Date().getTime();
        messageDetail.isFailure='false';
        messageDetail.isDelete='false';
        messageDetail.imgSrc='';
        messageDetail.username=localuser;
        messageDetail.senderid=localuserId;
        // alert("发送者id"+localuserId);
        var progress = '0';
        if (picPath != undefined && picPath != null && picPath != '') {
          messageDetail.message = picPath;
        }
        messageDetail.message = '' + '###' + content;
        danliao.push(messageDetail);
        $rootScope.$broadcast('msgs.update');
        var sendType = 'F';
        if (messagetype == 'Image') {
          sendType = 'I';
        }
        $api.sendDocFile(sendType, null, fileContent, function (sdata) {
          if (sdata[2] === '-1') {
            /*$ToastUtils.showToast('文件发送失败！',function (msg) {
            },function (err) {
            });*/
            messageDetail.isFailure='true';
            $greendao.saveObj('MessagesService',messageDetail,function (data) {
              if (data != 'success') {
                messageDetail._id = data;
              }
              $rootScope.$broadcast('msgs.error');
            },function (err) {
            });
            return;
          }
          messageDetail.message = sdata[1] + '###' + content;
          $rootScope.$broadcast('msgs.update');
          if (sdata[2] != '1') {
            $greendao.saveObj('MessagesService',messageDetail,function (data) {
              messageDetail._id = data;
              $rootScope.$broadcast('msgs.update');
            },function (err) {
            });
          } else {
            var myMsg = messageDetail.message.split('###');
            var newMsg = messageDetail.message  ;
            if (myMsg != undefined && myMsg != null && myMsg != '' && myMsg.length > 0) {
              newMsg = '';
              for (var i = 0; i < myMsg.length; i++) {
                if (i === 0) {
                  newMsg += myMsg[i];
                } else if (i === 1) {
                  newMsg += '###' + sdata[0];
                } else {
                  newMsg += '###' + myMsg[i];
                }
              }
            }
            messageDetail.message = newMsg;
            mqtt.sendMsg(topic, messageDetail, function (message) {
              /*if (picPath != undefined && picPath != null && picPath != '') {
                messageDetail.message = picPath;
              }*/
              $rootScope.firstSendId=messageDetail.sessionid;
              $rootScope.$broadcast('msgs.update');
              return "成功";
            },function (message) {
              /*if (picPath != undefined && picPath != null && picPath != '') {
                messageDetail.message = picPath;
              }*/
              messageDetail.isFailure='true';
              danliao.push(messageDetail);
              $greendao.saveObj('MessagesService',messageDetail,function (data) {
                $rootScope.$broadcast('msgs.error');
                if (data != 'success') {
                  messageDetail._id = data;
                }
              },function (err) {
              });
              return "失败";
            });
          }
        }, function (err) {
        });
        return "啥也不是";
      },

      arriveMsg:function (topic) {
        mqtt.getChats(topic,function (message) {
          var arriveMessage={};
          arriveMessage._id='';
          arriveMessage.sessionid=message.sessionid;
          arriveMessage.type=message.type;
          // alert("监听消息类型"+arriveMessage.type);
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
          alert("接受消息对方id"+arriveMessage.message);
          // alert("接受消息对方id"+arriveMessage.messagetype+message._id);

          if (message.type === "Alarm" || message.type === "System") {   //文件或者图片

            $greendao.saveObj('SystemMsgService',arriveMessage,function (data) {
              // alert(data.length+"收通知消息");
            },function (err) {
            });
            $greendao.queryData("NotifyListService","where id =?",arriveMessage.sessionid,function (data) {
              if(data.length>0){
                syscount=data[0].count;
                // alert("有值"+syscount);
                syscount++;
                $rootScope.$broadcast('notify.update');
              }else{
                syscount =0;
                // alert("接受群消息service"+data.length+arriveMessage.sessionid);
                syscount++;
                $rootScope.$broadcast('notify.update');
                // alert("syscount"+syscount);
              }
            },function (err) {
              // alert(err);
            });
            $rootScope.firstSessionid=arriveMessage.sessionid;
            $rootScope.firstUserName=arriveMessage.username;
            $rootScope.messagetype= arriveMessage.type;
            // alert("存的对不对"+$rootScope.firstSessionid+$rootScope.messagetype+$rootScope.firstUserName);
          }else if(message.type ==="User" || message.type ==="Group" || message.type ==="Dept"){//普通消息
            if (message.messagetype === "Image" || message.messagetype === "File") {   //文件或者图片
              var objectTP = 'I';
              if (message.messagetype === "Image") {
                objectTP = 'I';
              } else if(message.messagetype === "File") {
                objectTP = 'F';
              }
              var newMessage = arriveMessage.message;
              arriveMessage.message = '';
              danliao.push(arriveMessage);
              $rootScope.$broadcast('msgs.update');
              $api.getFile(objectTP,newMessage,'120',function (data) {
                // alert("图片下载成功");
                // arriveMessage.message = data;
                if (data === '100') {
                  arriveMessage.message = newMessage;
                  $rootScope.$broadcast('msgs.update');
                  alert(newMessage);
                }
                $greendao.saveObj('MessagesService',arriveMessage,function (data) {
                },function (err) {
                });
                $rootScope.$broadcast('msgs.update');
                if(message.type==="User"){
                  $greendao.queryData("ChatListService","where id =?",arriveMessage.sessionid,function (data) {
                    if(data.length>0){
                      count=data[0].count;
                      // alert("有值"+groupCount);
                      count++;
                      $rootScope.$broadcast('msgs.update');
                    }else{
                      count =0;
                      // alert("接受群消息service"+data.length+arriveMessage.sessionid);
                      count++;
                      $rootScope.$broadcast('msgs.update');
                      // alert("groupCount"+groupCount);
                    }
                  },function (err) {
                    // alert(err);
                  });
                  // alert("接受消息的sessionid"+arriveMessage.sessionid+arriveMessage.username);
                  $rootScope.firstSessionid=arriveMessage.sessionid;
                  $rootScope.firstUserName=arriveMessage.username;
                  $rootScope.messagetype= arriveMessage.type;
                  $rootScope.$broadcast('msgs.update');
                  // alert("存的对不对"+$rootScope.firstSessionid+$rootScope.messagetype);
                }else{
                  $greendao.queryData("ChatListService","where id =?",arriveMessage.sessionid,function (data) {
                    if(data.length>0){
                      groupCount=data[0].count;
                      // alert("有值"+groupCount);
                      groupCount++;
                      $rootScope.$broadcast('msgs.update');
                    }else{
                      groupCount =0;
                      // alert("接受群消息service"+data.length+arriveMessage.sessionid);
                      groupCount++;
                      $rootScope.$broadcast('msgs.update');
                      // alert("groupCount"+groupCount);
                    }
                  },function (err) {
                    // alert(err);
                  });
                  // alert("测测是不是先出来");

                  $rootScope.firstSessionid=arriveMessage.sessionid;
                  $rootScope.firstUserName=arriveMessage.username;
                  $rootScope.messagetype= arriveMessage.type;
                  // alert("群组存的对不对"+$rootScope.firstSessionid+$rootScope.firstUserName+$rootScope.messagetype);
                  qunliao.push(arriveMessage);
                }

              },function (err) {
                $ToastUtils.showToast("图片下载失败"+err);
              });

            }else if(message.messagetype === "LOCATION"){
              $greendao.saveObj('MessagesService',arriveMessage,function (data) {
              },function (err) {
              });
              if(message.type==="User"){
                $greendao.queryData("ChatListService","where id =?",arriveMessage.sessionid,function (data) {
                  if(data.length>0){
                    count=data[0].count;
                    // alert("有值"+groupCount);
                    count++;
                    $rootScope.$broadcast('msgs.update');
                  }else{
                    count =0;
                    // alert("接受群消息service"+data.length+arriveMessage.sessionid);
                    count++;
                    $rootScope.$broadcast('msgs.update');
                    // alert("groupCount"+groupCount);
                  }
                },function (err) {
                  // alert(err);
                });
                // alert("接受消息的sessionid"+arriveMessage.sessionid+arriveMessage.username);
                $rootScope.firstSessionid=arriveMessage.sessionid;
                $rootScope.firstUserName=arriveMessage.username;
                $rootScope.messagetype= arriveMessage.type;
                $rootScope.$broadcast('msgs.update');
                // alert("存的对不对"+$rootScope.firstSessionid+$rootScope.messagetype);
                danliao.push(arriveMessage);
              }else{
                qunliao.push(arriveMessage);
                $greendao.queryData("ChatListService","where id =?",arriveMessage.sessionid,function (data) {
                  if(data.length>0){
                    groupCount=data[0].count;
                    // alert("有值"+groupCount);
                    groupCount++;
                    $rootScope.$broadcast('msgs.update');
                  }else{
                    groupCount =0;
                    // alert("接受群消息service"+data.length+arriveMessage.sessionid);
                    groupCount++;
                    $rootScope.$broadcast('msgs.update');
                    // alert("groupCount"+groupCount);
                  }
                },function (err) {
                  // alert(err);
                });
                // alert("测测是不是先出来");

                $rootScope.firstSessionid=arriveMessage.sessionid;
                $rootScope.firstUserName=arriveMessage.username;
                $rootScope.messagetype= arriveMessage.type;
                // alert("群组存的对不对"+$rootScope.firstSessionid+$rootScope.firstUserName+$rootScope.messagetype);
              }
            }else{
              // alert("收到群组信息增该");
              $greendao.saveObj('MessagesService',arriveMessage,function (data) {
              },function (err) {
              });
              if(message.type==="User"){
                danliao.push(arriveMessage);
                // alert("jinlailema");
                count++;
                // alert("接受消息的sessionid"+arriveMessage.sessionid+arriveMessage.username);
                $rootScope.firstSessionid=arriveMessage.sessionid;
                $rootScope.firstUserName=arriveMessage.username;
                $rootScope.messagetype= arriveMessage.type;
                $rootScope.$broadcast('msgs.update');
                // alert("存的对不对"+$rootScope.firstSessionid+$rootScope.messagetype);
              }else{
                qunliao.push(arriveMessage);
                $greendao.queryData("ChatListService","where id =?",arriveMessage.sessionid,function (data) {
                  if(data.length>0){
                    groupCount=data[0].count;
                    // alert("有值"+groupCount);
                    groupCount++;
                    $rootScope.$broadcast('msgs.update');
                  }else{
                    groupCount =0;
                    // alert("接受群消息service"+data.length+arriveMessage.sessionid);
                    groupCount++;
                    $rootScope.$broadcast('msgs.update');
                    // alert("groupCount"+groupCount);
                  }
                },function (err) {
                  // alert(err);
                });
                // alert("测测是不是先出来");

                $rootScope.firstSessionid=arriveMessage.sessionid;
                $rootScope.firstUserName=arriveMessage.username;
                $rootScope.messagetype= arriveMessage.type;
                // alert("群组存的对不对"+$rootScope.firstSessionid+$rootScope.firstUserName+$rootScope.messagetype);
              }
            }
          }
          return size;
        },function (message) {
          return 0;
        });

        return "nihao";
      },
      getDanliao:function () {
        // alert("单聊长度"+danliao.length);
        return danliao;
      },
      setDanliao:function (data) {
        danliao =new Array();
        for(var i=0;i<data.length;i++){
          danliao.unshift(data[i]);
        }
      },
      adddanliaodata:function (data) {
        // for(var i=0;i<=danliao.length-1;i++){
        //   if( danliao[i].id === data.id){
        //     // alert("找出chat数组的被更改的数据了"+i);
        //     danliao.splice(i,1);
        //   }
        // }
        danliao.unshift(data);
        // alert("建群时消息"+data.message);
      },
      setQunliao:function (data) {
        qunliao=new Array();
        for(var i=0;i<data.length;i++){
          qunliao.unshift(data[i]);
        }
      },
      getQunliao:function () {
        return qunliao;
      },
      getSysmsg:function () {
        return sysmsg;
      },
      getMsgCount:function () {
        return count;
      },
      getSyscount:function () {
        return syscount;
      },
      clearSysCount:function () {
        syscount=0;
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
      getMessageType:function () {
        return $rootScope.messagetype;
      },
      getSenderID:function () {
        return $rootScope.firstSendId;
      },

      sendGroupMsg:function (topic, content, id,grouptype,localuser,localuserId,sqlid) {
        // alert("发送群消息"+sqlid+localuserId+grouptype);
        var messageReal={};
        messageReal._id=sqlid;
        messageReal.sessionid=id;
        messageReal.type=grouptype;
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
        // alert(localuser+"ssss");
        mqtt.sendMsg(topic, messageReal, function (message) {
          qunliao.push(messageReal);
          $greendao.saveObj('MessagesService',messageReal,function (data) {
            $rootScope.$broadcast('msgs.update');
            // alert("群组消息保存成功");
          },function (err) {
            alert("群组消息保存失败");
          });
          return "成功";
        },function (message) {
          messageReal.isFailure='true';
          qunliao .push(messageReal);
          $greendao.saveObj('MessagesService',messageReal,function (data) {
            $rootScope.$broadcast('msgs.error');
            // alert(data);
          },function (err) {
            // alert(err+"msgerr");
          });
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
      },
      openDocWindow:function(type, success, error) {//打开文件管理器
        if (type === undefined) {
          type = "*";
        }
        mqtt.openDocWindow(type, success, error);
      },
      getIconDir:function(success,error){
        mqtt.getIconDir(success,error);
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

  // .factory('$cordovaScreenshot',  function ($q){
  //   return {
  //     capture: function (filename, extension, quality){
  //       extension = extension || 'jpg';
  //       quality = quality || '100';
  //
  //       var defer = $q.defer();
  //
  //       navigator.screenshot.save(function (error, res){
  //         if (error) {
  //           console.error(error);
  //           defer.reject(error);
  //         } else {
  //           console.log('screenshot saved in: ', res.filePath);
  //           defer.resolve(res.filePath);
  //         }
  //       }, extension, quality, filename);
  //
  //       return defer.promise;
  //     }
  //   };
  // })

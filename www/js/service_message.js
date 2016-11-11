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
    deletechatdata:function (data) {
      for(var i=0;i<=mainlist.length-1;i++){
        // alert("找出chat数组"+mainlist[i].id+"==="+data);
        if( mainlist[i].id === data){
          // alert("找出chat数组的要删除的数据"+i);
          mainlist.splice(i,1);
        }
      }
      // alert("看看长度"+mainlist.length);
    },
    getAllData:function () {
      // alert("service界面数组长度"+mainlist.length);
      return mainlist;
    },
    getIdChatName:function (id,chatname) {
      $rootScope.id=id;
      $rootScope.username=chatname;
      // alert("先收到"+$rootScope.id+$rootScope.username);
    },
    setIdToMc:function (id) {
      return id;
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
          chatitem.chatType='Level_1';
          // if(messageType === 'System'){
          //   chatitem.chatType='System';
          // }else if(messageType === 'Alarm'){
          //   chatitem.chatType='Alarm';
          // }
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
        notifylist =new Array();
        for(var i=0;i<data.length;i++){
          notifylist.unshift(data[i]);
        }
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


  .factory('$slowarr',function ($state,$stateParams,$rootScope,$greendao,$mqtt) {
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
          chatitem.chatType='Common';
          // if(messageType === 'System'){
          //   chatitem.chatType='System';
          // }else if(messageType === 'Alarm'){
          //   chatitem.chatType='Alarm';
          // }
          notifylist.push(chatitem);
          // alert("进来会话列表了吗");
          $greendao.saveObj('SlowNotifyListService',chatitem,function (data) {
            $rootScope.$broadcast('slowarr.update');
            // alert("一般报警保存成功"+data.length)
          },function (err) {
          });
        }
        return notifylist;
      },
      setNotifyData:function (data) {
        notifylist =new Array();
        for(var i=0;i<data.length;i++){
          notifylist.unshift(data[i]);
        }
      },
      updatelastData:function (data) {
        for(var i=0;i<=notifylist.length-1;i++){
          // alert("data ===="+data.lastText+"数组长度"+notifylist.length);
          if( notifylist[i].id === data.id){
            // alert("yiban找出数组的被更改的数据了"+i);
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

  .factory('$mqtt',function ($rootScope,$greendao,$api,$ToastUtils) {
    var mqtt;
    var msgs=new Array();
    var danliao=new Array();
    var qunliao=new Array();
    var fastarr =new Array();
    var slowarr =new Array();
    var size;
    var count = 0;//单聊通知数量
    var groupCount=0;//群聊通知数量
    var syscount =0;//通用系统通知数量
    var fastcount=0;//紧急通知数量
    var slowcount=0;//一般通知数量
    var oacount=0;//公文处理通知数量
    var bhzcount=0;//拌合站通知数量
    var sycount=0;//试验室通知数量
    var cjgccount=0;//沉降观测通知数量
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


      sendMsg:function (topic, content, id,localuser,localuserId,sqlid,messagetype,picPath,$mqtt) {
        var messageDetail={};
        messageDetail._id=sqlid;
        // alert("改造后的id"+sqlid);
        messageDetail.sessionid=id;
        messageDetail.type='User';
        messageDetail.from='true';
        if (messagetype === undefined || messagetype === null || messagetype === '') {
          messagetype = 'normal';
        }
        messageDetail.message=content;
        messageDetail.messagetype=messagetype;
        // alert("发送的类型"+messagetype);
        messageDetail.platform='Windows';
        messageDetail.when=new Date().getTime();
        messageDetail.isFailure='false';
        messageDetail.isDelete='false';
        messageDetail.imgSrc='';
        messageDetail.username=localuser;
        messageDetail.senderid=localuserId;
        messageDetail.isread='1';
        messageDetail.isSuccess='false';
        messageDetail.daytype='1';
        messageDetail.istime='false';
        if (sqlid != undefined && sqlid != null && sqlid != '') {
          // alert("SQLID不为空：" + sqlid)
          for(var i=0;i<danliao.length;i++){
            if(danliao[i]._id === sqlid){
              // alert("SQLID已经找到：" + sqlid)
              danliao.splice(i, 1);
              $rootScope.$broadcast('msgs.update');
              break;
            }
          }
        }
        //判断是不是位置
        if(messagetype === 'LOCATION'){
          // alert("添加定位之前"+danliao.length+messageDetail.message+messagetype);
          //   danliao.push(messageDetail);
          //   $greendao.saveObj('MessagesService',messageDetail,function (data) {
          //     $rootScope.$broadcast('msgs.update');
          //   },function (err) {
          //   });
          var arrs = content.split(',');
          var longt = arrs[0];
          var lat = arrs[1];
          messageDetail.message=longt+","+lat;
        }

            //发送消息前先展示在界面上
            // alert("数组长度前"+danliao.length+messageDetail.message);
            danliao.push(messageDetail);
            $greendao.saveObj('MessagesService',messageDetail,function (data) {
              $rootScope.$broadcast('msgs.update');
            },function (err) {
            });

          /**
           * 转圈是监听网络状态，若失败，则显示消息发送失败
           */
          /*if(new Date().getTime()-messageDetail.when < 20 * 1000){

          }*/

          mqtt.sendMsg(topic, messageDetail, function (msg) {
              $mqtt.updateDanliao(msg);
              // messageDetail.isSuccess=msg.isS;
              // if (picPath != undefined && picPath != null && picPath != '') {
              //   messageDetail.message = picPath;
              // }
              if(messagetype === 'LOCATION'){
                // alert("成功发送定位qian长度"+danliao.length);
                // $mqtt.updateDanliao(messageDetail);
                // alert("成功发送定位后长度"+danliao.length);
                msg.message=content;
                // alert("发送过去的定位内容"+messageDetail.message);
                // danliao.push(msg);
                // alert("数组正确后"+danliao.length+danliao[danliao.length-1].isSuccess);
                // alert("发送成功后的位置"+msg.message);
                $greendao.saveObj('MessagesService',msg,function (data) {
                  $rootScope.$broadcast('msgs.update');
                },function (err) {
                });
              }
              //判断是不是位置
              if(!(messagetype === 'LOCATION')){
                //当消息从未成功到成功的这个状态时，先删除群组之前那个状态保存的数据
                // alert("发送消息"+messageDetail.message+messageDetail.isSuccess);
                //然后再入库成功状态的消息

                // danliao.push(msg);
                // alert("数组正确后"+danliao.length+danliao[danliao.length-1].isSuccess);
                $greendao.saveObj('MessagesService',msg,function (data) {
                  // alert("数组长度后"+danliao[danliao.length-1].message+danliao[danliao.length-1].isSuccess);
                  $rootScope.$broadcast('msgs.update');
                },function (err) {
                  // alert(err+"sendmistake");
                });
              }
              $rootScope.firstSendId=messageDetail.sessionid;
              // alert("发送消息时对方id"+$rootScope.firstSendId);
              return "成功";
            },function (err) {
              // alert("没网时进来失败方法了吗？");
              //失败时先删除或者后删除数组里的数据都行，反正success状态都一样为false
              $mqtt.updateDanliao(err);
              // danliao.push(err);
              if (picPath != undefined && picPath != null && picPath != '') {
                messageDetail.message = picPath;
              }
              $greendao.saveObj('MessagesService',err,function (data) {
                $rootScope.$broadcast('msgs.error');
              },function (err) {
              });
              return "失败";
            });

        return "啥也不是";
      },
      sendDocFileMsg:function (topic, fileContent, content, id,localuser,localuserId,sqlid,messagetype,picPath,$mqtt) {
        var messageDetail={};
        messageDetail._id=sqlid;
        // alert("service拿到的id"+messageDetail._id);
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
        messageDetail.isread='1';
        messageDetail.isSuccess='false';
        messageDetail.daytype='1';
        messageDetail.istime='false';
        // alert("发送者id"+localuserId);
        if (sqlid != undefined && sqlid != null && sqlid != '') {
          for(var i=0;i<danliao.length;i++){
            if(danliao[i]._id === sqlid){
              danliao.splice(i, 1);
              $rootScope.$broadcast('msgs.update');
              break;
            }
          }
        }
        var progress = '0';
        /*if (picPath != undefined && picPath != null && picPath != '') {
          messageDetail.message = picPath;
        }*/
        /**
         *  先将图片展示在界面上入库完成并发送监听
         * @type {string}
           */
        // alert("图片入数组前长度"+danliao.length);

        /**
         * 转圈是监听网络状态，若失败，则显示消息发送失败
         */
        // $mqtt.setOnNetStatusChangeListener(function (succ) {
        //   if(succ === 'false'){
        //     $mqtt.updateDanliao(messageDetail);
        //     messageDetail.isFailure='true';
        //     danliao.push(messageDetail);
        //     $greendao.saveObj('MessagesService',messageDetail,function (data) {
        //       $rootScope.$broadcast('msgs.error');
        //     },function (err) {
        //     });
        //   }
        // },function (err) {
        // });

        messageDetail.message = '' + '###' + content;
        danliao.push(messageDetail);
        // alert("图片入数组后长度"+danliao.length);
        $greendao.saveObj('MessagesService',messageDetail,function (data) {
          $rootScope.$broadcast('msgs.update');
        },function (err) {
        });
        var sendType = 'F';
        if (messagetype == 'Image') {
          sendType = 'I';
        }

        $api.sendDocFile(sendType, null, fileContent, function (sdata) {


          //图片上传过程中失败了，从图片管理器删除该图片
          if (sdata[2] === '-1') {
            // alert("估计就将计就计")


            $greendao.deleteDataByArg('FilePictureService',sdata[1],function (msg) {
              // alert("清除数据成功")
            },function (err) {

            });
            /**
             * 在发送过程中上传图片失败时，先将数组里之前的isSuccess=‘false’的数据删了将isFailure状态置为‘true’
             * @type {string}
               */
            // alert("图片上传过程中失败入数组前长度"+danliao.length);
            $mqtt.updateImgFileDanliao(messageDetail);
            // alert("图片上传过程中失败入数组后长度"+danliao.length);
            messageDetail.isFailure='true';
            $greendao.saveObj('MessagesService',messageDetail,function (data) {
              $rootScope.$broadcast('msgs.error');
            },function (err) {
            });
            return;
          }

          //重发时删除
          // if (sqlid != undefined && sqlid != null && sqlid != '') {
          //   for(var i=0;i<danliao.length;i++){
          //     if(danliao[i]._id === sqlid){
          //       danliao.splice(i, 1);
          //       $rootScope.$broadcast('msgs.update');
          //       break;
          //     }
          //   }
          // }
          //为了让用户能立即看到图片，并发送监听
          messageDetail.message = sdata[1] + '###' + content;
          // $rootScope.$broadcast('msgs.update');
          //图片没发完
          if (sdata[2] != '1') {
            $greendao.saveObj('MessagesService',messageDetail,function (data) {
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
              // alert("发了几次是几次");
              // alert("发送图片成功前数组长度"+danliao.length);
              $mqtt.updateDanliao(message);
              // message.isSuccess='true';

              var savefilepic={};
              savefilepic.filepicid=sdata[1];
              savefilepic.from="true";
              savefilepic.sessionid=id;
              savefilepic.fromname=localuser;
              savefilepic.toname="你好"
              savefilepic.smallurl=sdata[0];
              savefilepic.bigurl=sdata[0];
              savefilepic.bytesize=content.split('###')[1];
              savefilepic.megabyte=content.split('###')[2];
              savefilepic.filename=content.split('###')[3];
              if(sendType=="F"){
                savefilepic.type="file";
              }else if(sendType=="I"){
                savefilepic.type="image";
              }
              savefilepic.when=0;
              // danliao.push(message);
              // alert("发送图片成功后数组长度"+danliao.length);
              $greendao.saveObj('MessagesService',message,function (data) {
                $rootScope.$broadcast('msgs.update');
              },function (err) {
              });

              $greendao.saveObj("FilePictureService",savefilepic,function (data) {
              },function (err) {
              })
              $rootScope.firstSendId=message.sessionid;
              return "成功";
            },function (message) {
              // alert("发送图片直接失败前数组长度"+danliao.length);
              $mqtt.updateDanliao(message);
              // message.isFailure='true';
              // danliao.push(message);
              // alert("发送图片直接失败后数组长度"+danliao.length);
              $greendao.saveObj('MessagesService',message,function (data) {
                $rootScope.$broadcast('msgs.error');
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
          arriveMessage._id=message._id;
          arriveMessage.sessionid=message.sessionid;
          arriveMessage.type=message.type;
          // alert("监听消息类型"+message._id);
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
          arriveMessage.isread=message.isread;
          arriveMessage.isSuccess=message.isSuccess;
          arriveMessage.daytype=message.daytype;
          arriveMessage.istime=message.istime;
          // arriveMessage.isread='0';
          // alert("接受消息对方id"+arriveMessage.message);
          // alert("接受消息对方id"+arriveMessage.messagetype+message._id);
          // alert("进来了吗"+message.type);
          if(message.type === 'Platform'){
            $rootScope.$broadcast('newnotify.update');
            /*//当消息为系统通知时
           /!* //alert("进来了吗紧急"+message.msgLevel);
            arriveMessage.msglevel=message.msgLevel;
            $greendao.saveObj('SystemMsgService',arriveMessage,function (data) {
               //alert("保存平台消息成功");
            },function (err) {

            });*!/
            /!**
             * 判断未读数量
             *!/
              if(message.msgLevel === 'Level_1'){        //紧急消息
                //alert("通知进入紧急选择段");
                fastarr.push(arriveMessage);
                $greendao.queryNotifyChat(message.msgLevel,message.sessionid,function (data) {
                  if(data.length>0){
                    fastcount=data[0].count;
                    // alert("紧急count有值"+fastcount);
                    fastcount++;
                    $rootScope.$broadcast('newnotify.update');
                  }else{
                    fastcount =0;
                    // alert("接受群消息service"+data.length+arriveMessage.sessionid);
                    fastcount++;
                    $rootScope.$broadcast('newnotify.update');
                    // alert("fastcount"+fastcount);
                  }
                },function (err) {
                  // alert(err);
                });
              }else if (message.msgLevel === 'Common'){    //一般消息
                //alert("通知进入一般选择段");
                slowarr.push(arriveMessage);
                $greendao.querySlowNotifyChat(message.msgLevel,message.sessionid,function (data) {
                  if(data.length>0){
                    slowcount=data[0].count;
                     //alert("一般有值"+slowcount);
                    slowcount++;
                    $rootScope.$broadcast('newnotify.update');
                  }else{
                    slowcount =0;
                    //alert("接受群消息service2222"+data.length+arriveMessage.sessionid);
                    slowcount++;
                    $rootScope.$broadcast('newnotify.update');
                     //alert("slowcount"+slowcount);
                  }
                },function (err) {
                  // alert(err);
                });
              }

            $rootScope.firstSessionid=arriveMessage.sessionid;
            $rootScope.firstUserName=arriveMessage.username;
            $rootScope.messagetype= arriveMessage.msglevel;
            // alert("新版通知存的对不对"+$rootScope.firstSessionid+$rootScope.messagetype+$rootScope.firstUserName);*/
          } else if (message.type === "Alarm" || message.type === "System") {   //老版的系统报警和推送
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
          }else if(message.type ==="User" || message.type ==="Group" || message.type ==="Dept"){       //消息模块
            if (message.messagetype === "Image" || message.messagetype === "File") {   //文件或者图片
              var objectTP = 'I';
              if (message.messagetype === "Image") {
                objectTP = 'I';
              } else if(message.messagetype === "File") {
                objectTP = 'F';
              }
              var newMessage = arriveMessage.message;
              arriveMessage.message = '';
              // danliao.push(arriveMessage);
              // $rootScope.$broadcast('msgs.update');
              if (objectTP === 'F') {             //当发送消息的为图片时
                // alert("文件传输啊的的的大的的的的的的的")
                arriveMessage.message = newMessage;
                //当文件下载完了，入数组，无需入库(因为在java后端已经入库了)
                if(message.type==="User"){
                  danliao.push(arriveMessage);
                  $rootScope.$broadcast('msgs.update');
                }else if(message.type ==="Group" || message.type ==="Dept"){
                  qunliao.push(arriveMessage);
                  $rootScope.$broadcast('msgs.update');
                }

                var arrivefile={};
                arrivefile.filepicid=arriveMessage.message.split('###')[0];
                arrivefile.from="false";
                arrivefile.sessionid=arriveMessage.sessionid;
                arrivefile.fromname=arriveMessage.username;
                arrivefile.toname="";
                arrivefile.smallurl=arriveMessage.message.split('###')[1];
                arrivefile.bigurl=arriveMessage.message.split('###')[1];
                arrivefile.bytesize=arriveMessage.message.split('###')[2];
                arrivefile.megabyte=arriveMessage.message.split('###')[3];
                arrivefile.filename=arriveMessage.message.split('###')[4];
                if(arriveMessage.messagetype=="Image"){
                  arrivefile.type="image";
                }else if(arriveMessage.messagetype=="File"){
                  arrivefile.type="file";
                }
                arrivefile.when=0;

                $greendao.saveObj("FilePictureService",arrivefile,function (data) {

                },function (err) {

                });

            } else if(objectTP === 'I'){        //当发送消息的为图片时
                $api.getFile(objectTP, newMessage, '100', function (data) {
                  // alert("图片下载成功");
                  // arriveMessage.message = data;
                  // alert("图片下载成功了啊的的的大的的的的的的的")
                  if (data === '100') {
                    arriveMessage.message = newMessage;
                    //当图片下载完了，入数组，无需入库(因为在java后端已经入库了)
                    if(message.type==="User"){
                      danliao.push(arriveMessage);
                      $rootScope.$broadcast('msgs.update');
                    }else if(message.type ==="Group" || message.type ==="Dept"){
                      qunliao.push(arriveMessage);
                      $rootScope.$broadcast('msgs.update');
                    }

                    var arrivepic={};
                    arrivepic.filepicid=arriveMessage.message.split('###')[0];
                    arrivepic.from="false";
                    arrivepic.sessionid=arriveMessage.sessionid;
                    arrivepic.fromname=arriveMessage.username;
                    arrivepic.toname="";
                    arrivepic.smallurl=arriveMessage.message.split('###')[1];
                    arrivepic.bigurl=arriveMessage.message.split('###')[1];
                    arrivepic.bytesize=arriveMessage.message.split('###')[2];
                    arrivepic.megabyte=arriveMessage.message.split('###')[3];
                    arrivepic.filename=arriveMessage.message.split('###')[4];
                    if(arriveMessage.messagetype=="Image"){
                      arrivepic.type="image";
                    }else if(arriveMessage.messagetype=="File"){
                      arrivepic.type="file";
                    }
                    arrivepic.when=0;

                    $greendao.saveObj("FilePictureService",arrivepic,function (data) {

                    },function (err) {

                    });
                  }

                }, function (err) {
                  $ToastUtils.showToast("图片下载失败" + err);
                });
              }

            }else if(message.messagetype === "LOCATION"){         //当消息为定位时
              if(message.type==="User"){
                danliao.push(arriveMessage);
                $rootScope.$broadcast('msgs.update');
              }else if(message.type ==="Group" || message.type ==="Dept"){
                qunliao.push(arriveMessage);
                $rootScope.$broadcast('msgs.update');
              }

            }else{       //当消息为文本时
              if(message.type==="User"){
                danliao.push(arriveMessage);
                $rootScope.$broadcast('msgs.update');
              }else if(message.type ==="Group" || message.type ==="Dept"){
                // alert("进群消息service---push前长度"+qunliao.length);
                qunliao.push(arriveMessage);
                // alert("进群消息service---push后长度"+qunliao.length);
                $rootScope.$broadcast('msgs.update');
            }
            // $rootScope.firstSessionid=arriveMessage.sessionid;
              // $rootScope.firstUserName=arriveMessage.username;
              // $rootScope.messagetype= arriveMessage.type;
              // alert("群组存的对不对"+$rootScope.firstSessionid+$rootScope.firstUserName+$rootScope.messagetype);

              // $greendao.saveObj('MessagesService',arriveMessage,function (data) {
              //   if(message.type==="User"){
              //     danliao.push(arriveMessage);
              //     count++;
              //     // $greendao.queryData("ChatListService","where id =?",arriveMessage.sessionid,function (data) {
              //     //   if(data.length>0){
              //     //     count=data[0].count;
              //     //     // alert("有值"+groupCount);
              //     //
              //     //     $rootScope.$broadcast('msgs.update');
              //     //   }else{
              //     //     count =0;
              //     //     // alert("接受群消息service"+data.length+arriveMessage.sessionid);
              //     //     count++;
              //     //     $rootScope.$broadcast('msgs.update');
              //     //     // alert("groupCount"+groupCount);
              //     //   }
              //     // },function (err) {
              //     //   // alert(err);
              //     // });
              //     $rootScope.firstSessionid=arriveMessage.sessionid;
              //     $rootScope.firstUserName=arriveMessage.username;
              //     $rootScope.messagetype= arriveMessage.type;
              //     $rootScope.$broadcast('msgs.update');
              //     // alert("存的对不对"+$rootScope.firstSessionid+$rootScope.messagetype);
              //   }else{
              //     qunliao.push(arriveMessage);
              //     $greendao.queryData("ChatListService","where id =?",arriveMessage.sessionid,function (data) {
              //       if(data.length>0){
              //         groupCount=data[0].count;
              //         // alert("有值"+groupCount);
              //         groupCount++;
              //         $rootScope.$broadcast('msgs.update');
              //       }else{
              //         groupCount =0;
              //         // alert("接受群消息service"+data.length+arriveMessage.sessionid);
              //         groupCount++;
              //         $rootScope.$broadcast('msgs.update');
              //         // alert("groupCount"+groupCount);
              //       }
              //     },function (err) {
              //       // alert(err);
              //     });
              //     // alert("测测是不是先出来");
              //
              //     $rootScope.firstSessionid=arriveMessage.sessionid;
              //     $rootScope.firstUserName=arriveMessage.username;
              //     $rootScope.messagetype= arriveMessage.type;
              //     // alert("群组存的对不对"+$rootScope.firstSessionid+$rootScope.firstUserName+$rootScope.messagetype);
              //   }
              // },function (err) {
              // });
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
      updateImgFileDanliao:function (data) {
        for(var i=0;i<danliao.length;i++){
          // alert("进来删数组数据了吗"+danliao.length+data._id+"数组id"+danliao[i]._id+"数组状态"+danliao[i].isSuccess  );
          if( danliao[i]._id === data._id){
            // alert("找出chat数组的被更改的数据了"+i);
            danliao.splice(i,1);
            break;
          }
        }
      },
      updateDanliao:function (data) {
        for(var i=0;i<danliao.length;i++){
          // alert("进来删数组数据了吗"+danliao.length+data._id+"数组id"+danliao[i]._id+"数组状态"+danliao[i].isSuccess  );
          if( danliao[i]._id === data._id){
            // alert("找出chat数组的被更改的数据了"+i);
            danliao.splice(i,1,data);
            break;
          }
        }
      },
      detaildanliaoupdate:function () {
        // alert("进来改数组");
        for(var i = 0;i<danliao.length;i++){
          if(danliao[i].isSuccess === 'false'){
            danliao[i].isFailure='true';
          }
        }
      },
      detailqunliaoupdate:function () {
        // alert("进来改数组");
        for(var i = 0;i<qunliao.length;i++){
          if(qunliao[i].isSuccess === 'false'){
            qunliao[i].isFailure='true';
          }
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
      updateQunliao:function (data) {
        for(var i=0;i<qunliao.length;i++){
          // alert("进来删数组数据了吗"+qunliao.length+data._id+"数组id"+qunliao[i]._id+"数组状态"+qunliao[i].isSuccess  );
          if( qunliao[i]._id === data._id){
            // alert("找出chat数组的被更改的数据了"+i);
            qunliao.splice(i,1,data);
            break;
          }
        }
      },
      getFastmsg:function () {
        return fastarr;
      },
      getSlowmsg:function () {
        return slowarr;
      },
      setFastmsg:function (data) {
        fastarr=new Array();
        for(var i=0;i<data.length;i++){
          fastarr.unshift(data[i]);
        }
      },
      setSlowmsg:function (data) {
        slowarr=new Array();
        for(var i=0;i<data.length;i++){
          slowarr.unshift(data[i]);
        }
      },
      //紧急count值
      getFastcount:function () {
        return fastcount;
      },
      //一般count值
      getSlowcount:function () {
        // alert("靠"+slowcount);
        return slowcount;
      },
      //公文处理count值
      getOaCount:function () {
        return oacount;
      },
      //拌合站count值
      getBhzCount:function () {
        return bhzcount;
      },
      //试验室count值
      getSyCount:function () {
        return sycount;
      },
      getCjgcCount:function () {
        return cjgccount;
      },
      setOaCount:function (count) {
        oacount=count;
      },
      setBhzCount:function (count) {
        bhzcount=count;
      },
      setSyCount:function (count) {
        sycount=count;
      },
      setCjgcCount:function (count) {
        cjgccount=count;
      },
      clearOaCount:function () {
        oacount=0;
      },
      clearBhzCount:function () {
        bhzcount=0;
      },
      clearSyCount:function () {
        sycount=0;
      },
      clearCjgcCount:function () {
        cjgccount=0;
      },
      clearFastcount:function () {
        fastcount=0;
      },
      clearSlowcount:function () {
        slowcount=0;
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

      sendGroupMsg:function (topic, content, id,grouptype,localuser,localuserId,sqlid,$mqtt) {
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
        messageReal.isread='1';
        messageReal.isSuccess='false';
        messageReal.daytype='1';
        messageReal.istime='false';
        if (sqlid != undefined && sqlid != null && sqlid != '') {
          for(var i=0;i<qunliao.length;i++){
            if(qunliao[i]._id === sqlid){
              qunliao.splice(i, 1);
              $rootScope.$broadcast('msgs.update');
              break;
            }
          }
        }

          /**
           *  当消息还未发送成功或者失败时，先展示在界面上，入库并发送监听
           */
          // alert("成功前长度"+qunliao.length);
          qunliao.push(messageReal);
          $rootScope.$broadcast('msgs.update');
          // alert("成功后长度"+qunliao.length);
          $greendao.saveObj('MessagesService',messageReal,function (data) {
            $mqtt.updateQunliao(messageReal);
            $rootScope.$broadcast('msgs.update');
            // alert("群组消息保存成功");
          },function (err) {
            // alert("群组消息保存失败");
          });

        /**
         * 转圈是监听网络状态，若失败，则显示消息发送失败
         */
        // $mqtt.setOnNetStatusChangeListener(function (succ) {
        //   if(succ === 'false'){
        //     $mqtt.updateDanliao(messageDetail);
        //     messageDetail.isFailure='true';
        //     danliao.push(messageDetail);
        //     $greendao.saveObj('MessagesService',messageDetail,function (data) {
        //       $rootScope.$broadcast('msgs.error');
        //     },function (err) {
        //     });
        //   }
        // },function (err) {
        // });

          /**
           * 消息发送成功/失败的回调
           */
          mqtt.sendMsg(topic, messageReal, function (message) {
            //改变状态前，删除数据
            // alert("成功发送前长度"+qunliao.length);
            $mqtt.updateQunliao(message);
            // messageReal.isSuccess='true';
            // qunliao.push(message);
            // alert("成功发送hou长度"+qunliao.length);
            $greendao.saveObj('MessagesService',message,function (data) {
              $rootScope.$broadcast('msgs.update');
              // alert("群组消息保存成功");
            },function (err) {
              // alert("群组消息保存失败");
            });
            return "成功";
          },function (message) {
            // alert("发送失败前长度"+qunliao.length);
            $mqtt.updateQunliao(message);
            // messageReal.isFailure='true';
            // qunliao.push(message);
            // alert("发送失败后长度"+qunliao.length);
            // if (sqlid != undefined && sqlid != null && sqlid != '') {
            //   for(var i=0;i<qunliao.length;i++){
            //     if(qunliao[i]._id === sqlid){
            //       qunliao.splice(i, 1);
            //       $rootScope.$broadcast('msgs.update');
            //       break;
            //     }
            //   }
            // }
            $greendao.saveObj('MessagesService',message,function (data) {
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
      },
      getFileContent:function (filePath, success, error) {
        mqtt.getFileContent(filePath, success, error);
      },
      takePhoto:function (success, error) {//拍照方法
        mqtt.takePhoto(success, error);
      },
      setOnNetStatusChangeListener:function(success,error) {//网络监听
        // alert("走监听事件了吗");
        mqtt.setOnNetStatusChangeListener(success,error);
      },
      getMqttStatus:function(success) {//MQTT连接状态获取
        mqtt.getMqttStatus(success);
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

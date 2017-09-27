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
        }else{
          chatitem.id=$stateParams.id;
          chatitem.chatName=$stateParams.ssid;
        }
        chatitem.imgSrc='';
        chatitem.lastText='';
        chatitem.count='';
        chatitem.isDelete='false';
        chatitem.lastDate=new Date().getTime();
        chatitem.senderId ='';
        chatitem.senderName ='';
        chatitem.isSuccess='';
        chatitem.daytype='';
        chatitem.isRead='';
        chatitem.isFailure='';
        chatitem.messagetype='';
        if(messageType === 'User'){
          chatitem.chatType='User';
        }else if(messageType === 'Dept'){
          chatitem.chatType='Dept';
        }else if(messageType === 'Group'){
          chatitem.chatType='Group';
        }
        mainlist.push(chatitem);
        $greendao.saveObj('ChatListService',chatitem,function (data) {
          $rootScope.$broadcast('chatarr.update');
          alertMsg("保存成功"+data.length)
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
          mainlist.splice(i,1);
        }
      }
      mainlist.unshift(data);
    },
    updatedatanosort:function (data) {
      for(var i=0;i<=mainlist.length-1;i++){
        if( mainlist[i].id === data.id){
          mainlist.splice(i,1,data);
        }
      }
    },
    deletechatdata:function (data) {
      for(var i=0;i<=mainlist.length-1;i++){
        if( mainlist[i].id === data){
          mainlist.splice(i,1);
        }
      }
    },
    getAllData:function () {
      return mainlist;
    },
    getIdChatName:function (id,chatname) {
      $rootScope.id=id;
      $rootScope.username=chatname;
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

          notifylist.push(chatitem);
          $greendao.saveObj('NotifyListService',chatitem,function (data) {
            $rootScope.$broadcast('notifyarr.update');
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
          if( notifylist[i].id === data.id){
            notifylist.splice(i,1);
          }
        }
        notifylist.unshift(data);
      },
      getAllNotifyData:function () {
        return notifylist;
      },
      getNotifyIdChatName:function (id,chatname) {
        $rootScope.id=id;
        $rootScope.username=chatname;
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

          notifylist.push(chatitem);
          $greendao.saveObj('SlowNotifyListService',chatitem,function (data) {
            $rootScope.$broadcast('slowarr.update');
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
          if( notifylist[i].id === data.id){
            notifylist.splice(i,1);
          }
        }
        notifylist.unshift(data);
      },
      getAllNotifyData:function () {
        return notifylist;
      },
      getNotifyIdChatName:function (id,chatname) {
        $rootScope.id=id;
        $rootScope.username=chatname;
      }
    }
  })

  .factory('$mqtt',function ($rootScope,$greendao,$api,$ToastUtils,$state,$okhttp) {
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
    var keyvalue;
    //MQTT连接状态
    var isNetConnect = true;

    document.addEventListener('deviceready',function () {
      mqtt = cordova.require('MqttChat.mqtt_chat');
    });
    return{
      startMqttChat:function(topics,success,error){
        if (topics === undefined || topics === null || topics === '') {
          alert('非法登录！');
          return;
        }
        document.addEventListener('deviceready',function () {
          mqtt.startMqttChat(topics,success,error);
        });
        return -1;
      },
      getMqtt:function(){
        return mqtt;
      },
      sendMsg:function (topic, content, id,localuser,localuserId,sqlid,messagetype,picPath,$mqtt) {
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

        if($rootScope.securlpicaaa==undefined||$rootScope.securlpicaaa==null||$rootScope.securlpicaaa.length==0){
          messageDetail.imgSrc='';
        }else{
          messageDetail.imgSrc=$rootScope.securlpicaaa;
        }
        messageDetail.username=localuser;
        messageDetail.senderid=localuserId;
        messageDetail.isread='1';
        messageDetail.isSuccess='false';
        messageDetail.daytype='1';
        messageDetail.istime='false';
        if (sqlid != undefined && sqlid != null && sqlid != '') {
          for(var i=0;i<danliao.length;i++){
            if(danliao[i]._id === sqlid){
              danliao.splice(i, 1);
              $rootScope.$broadcast('msgs.update');
              break;
            }
          }
        }
        //判断是不是位置
        if(messagetype === 'LOCATION'){

          var arrs = content.split(',');
          var longt = arrs[0];
          var lat = arrs[1];
          messageDetail.message=longt+","+lat + "," + arrs[2];
        }

            //发送消息前先展示在界面上
            danliao.push(messageDetail);
            $greendao.saveObj('MessagesService',messageDetail,function (data) {
              $rootScope.$broadcast('msgs.update');
            },function (err) {
            });

          /**
           * 转圈是监听网络状态，若失败，则显示消息发送失败
           */


          mqtt.sendMsg(topic, messageDetail, function (msg) {
              $mqtt.updateDanliao(msg);

              if(messagetype === 'LOCATION'){
                msg.message=content;
                $greendao.saveObj('MessagesService',msg,function (data) {
                  $rootScope.$broadcast('msgs.update');
                  //往消息主界面发送一个监听
                  $mqtt.sendupdate(msg.sessionid,msg._id);
                  $rootScope.$broadcast('sendsuccess.update');
                },function (err) {
                });
              }
              //判断是不是位置
              if(!(messagetype === 'LOCATION')){
                // alert("发送成功的消息"+msg);
                //当消息从未成功到成功的这个状态时，先删除群组之前那个状态保存的数据
                // alert("发送消息"+messageDetail.message+messageDetail.isSuccess);
                //然后再入库成功状态的消息

                // danliao.push(msg);
                // alert("数组正确后"+danliao.length+danliao[danliao.length-1].isSuccess);
                $greendao.saveObj('MessagesService',msg,function (data) {
                  // alert("数组长度后"+danliao[danliao.length-1].message+danliao[danliao.length-1].isSuccess);
                  $rootScope.$broadcast('msgs.update');
                  //往消息主界面发送一个监听
                  $mqtt.sendupdate(msg.sessionid,msg._id);
                  $rootScope.$broadcast('sendsuccess.update');
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
      sendDocFileMsg:function (topic, fileContent, content, id,localuser,localuserId,sqlid,messagetype,picPath,$mqtt, type) {
        if (type === undefined || type === null || type === '') {
          type = 'User';
        }
        var messageDetail={};
        messageDetail._id=sqlid;
        // alert("service拿到的id"+messageDetail._id);
        messageDetail.sessionid=id;
        messageDetail.type=type;
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

        if (type === 'User') {
          if (sqlid != undefined && sqlid != null && sqlid != '') {
            for (var i = 0; i < danliao.length; i++) {
              if (danliao[i]._id === sqlid) {
                danliao.splice(i, 1);
                $rootScope.$broadcast('msgs.update');
                break;
              }
            }
          }
        } else {
          if (sqlid != undefined && sqlid != null && sqlid != '') {
            for (var i = 0; i < qunliao.length; i++) {
              if (qunliao[i]._id === sqlid) {
                qunliao.splice(i, 1);
                $rootScope.$broadcast('msgs.update');
                break;
              }
            }
          }
        }
        var progress = '0';
        messageDetail.message = '' + '###' + content;
        if (messageDetail.messagetype === 'Image' || messageDetail.messagetype === 'File' || messageDetail.messagetype === 'Audio' || messageDetail.messagetype === 'Vedio') {
          messageDetail.message = messageDetail.message + '###0';
        }
        var fileIsImage = "File";
        if (messageDetail.messagetype === 'File') {
          var msg = messageDetail.message.split('###')[1];
          var suffix = msg.lastIndexOf("\.");
          var lastIndex = msg.substr(suffix, msg.length);
          fileIsImage = (lastIndex === '.jpg' || lastIndex === '.jpeg' || lastIndex === '.png' || lastIndex === '.bmp' || lastIndex === '.gif' || lastIndex === 'tif');
          messageDetail.messagetype = fileIsImage ? "Image" : "File";
          messagetype = messageDetail.messagetype;
        }
        if (type === 'User') {
          danliao.push(messageDetail);
        } else {
          qunliao.push(messageDetail);
        }

        $greendao.saveObj('MessagesService',messageDetail,function (data) {

          $rootScope.$broadcast('msgs.update');
        },function (err) {
        });
        var sendType = 'F';
        if (messagetype == 'Image') {
          sendType = 'I';
        }
        //var uploadurl="http://imtest.crbim.win:1666/UploadFile";
        $okhttp.upload(messageDetail, sendType, null, fileContent,"",function (sdata) {
          var msgDetail = sdata[3];
          msgDetail.message = sdata[1] + '###' + content;
          //图片上传过程中失败了，从图片管理器删除该图片
          if (sdata[2] === '-1') {
            //如果图片发送失败，就更新数组(界面根据-1去展示叹号)
            msgDetail.message = msgDetail.message + "###-1";
            if (type === 'User') {
              $mqtt.updateDanliao(msgDetail);
            } else {
              $mqtt.updateQunliao(msgDetail);
            }
            $rootScope.$broadcast('sendprogress.update');
            $greendao.deleteDataByArg('FilePictureService',sdata[1],function (msg) {

            },function (err) {

            });
            msgDetail.isFailure='true';
            $greendao.saveObj('MessagesService',msgDetail,function (data) {
              $rootScope.$broadcast('msgs.error');
            },function (err) {
            });
            return;
          }

          //为了让用户能立即看到图片，并发送监听
          //图片没发完
          if (!isNaN(sdata[2])) {
            var sendProgress = parseInt(parseFloat(sdata[2])*100+'');
            msgDetail.message = msgDetail.message + "###" + sendProgress;
          }
          if (sdata[2] != '1') {
            $greendao.saveObj('MessagesService',msgDetail,function (data) {
              // msgDetail.sendProgress = sdata[2];
              if (type === 'User') {
                $mqtt.updateDanliao(msgDetail);
                $rootScope.$broadcast('sendprogress.update');
              } else {
                $mqtt.updateQunliao(msgDetail);
                $rootScope.$broadcast('sendgroupprogress.update');
              }
            },function (err) {
            });
          } else {
            var myMsg = msgDetail.message.split('###');
            var newMsg = msgDetail.message  ;
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
            msgDetail.message = newMsg;
            mqtt.sendMsg(topic, msgDetail, function (message) {
              // alert("群发图片回执"+JSON.stringify(message));

              // alert("发送图片成功前数组长度"+danliao.length+"========="+content);
              if (type === 'User') {
                $mqtt.updateDanliao(message);
              } else {
                $mqtt.updateQunliao(message);
              }


              if (msgDetail.messagetype != 'Audio' && msgDetail.messagetype != 'Vedio') {
                var savefilepic = {};
                savefilepic.filepicid = sdata[1];
                savefilepic._id = msgDetail._id;
                savefilepic.from = "true";
                savefilepic.sessionid = id;
                savefilepic.fromname = localuser;
                savefilepic.toname = "你好"
                savefilepic.smallurl = sdata[0];
                savefilepic.bigurl = sdata[0];
                savefilepic.bytesize = content.split('###')[1];
                savefilepic.megabyte = content.split('###')[2];
                // alert("语音文件大小" + savefilepic.megabyte);
                savefilepic.filename = content.split('###')[3];
                if (sendType == "F") {
                  savefilepic.type = "file";
                } else if (sendType == "I") {
                  savefilepic.type = "image";
                }
                savefilepic.when = 0;
                $greendao.saveObj("FilePictureService", savefilepic, function (data) {
                }, function (err) {
                })
              }
              $greendao.saveObj('MessagesService',message,function (data) {
                // alert("保存messgae表"+data);
                $rootScope.$broadcast('msgs.update');
                //往消息主界面发送一个监听
                $rootScope.$broadcast('sendsuccess.update');
                $rootScope.$broadcast('sendFilesuccess.update',message.sessionid);
              },function (err) {
              });

              $rootScope.firstSendId=message.sessionid;
              return "成功";
            },function (message) {
              // alert("发送图片直接失败前数组长度"+danliao.length);
              if (type === 'User') {
                $mqtt.updateDanliao(message);
              } else {
                $mqtt.updateQunliao(message);
              }

              $greendao.saveObj('MessagesService',message,function (data) {
                $rootScope.$broadcast('msgs.error');
              },function (err) {
              });
              return "失败";
            });

          }

        },function (error) {

        });
        return "啥也不是";
      },

      arriveMsg:function (topic) {
        mqtt.getChats(topic,function (message) {
          var arriveMessage={};
          arriveMessage._id=message._id;
          arriveMessage.sessionid=message.sessionid;
          arriveMessage.type=message.type;
          arriveMessage.from=message.from;
          arriveMessage.message=message.message;
          arriveMessage.messagetype=message.messagetype;
          arriveMessage.platform=message.platform;
          arriveMessage.when=message.when;
          arriveMessage.isFailure=message.isFailure;
          arriveMessage.isDelete=message.isDelete;
          arriveMessage.username=message.username;
          arriveMessage.senderid=message.senderid;
          arriveMessage.imgSrc=message.imgSrc;
          arriveMessage.isread=message.isread;
          arriveMessage.isSuccess=message.isSuccess;
          arriveMessage.daytype=message.daytype;
          arriveMessage.istime=message.istime;
          if(message.messagetype === 'Event_KUF'){
            $state.go('login');
            return;
          }
          if(message.type === 'Platform'){

            var notifyMessage={};

              notifyMessage.FromID=message._id;
              notifyMessage.FromName=message.username;
              notifyMessage.IsReaded=false;
              notifyMessage.IsToped=false;
              notifyMessage.LevelName=message.levelName;
              notifyMessage.Level=message.msgLevel
              notifyMessage.Link=message.link;
              notifyMessage.LinkType=message.linkType;
              notifyMessage.Msg=message.message;
              notifyMessage.MsgDate=message.when;
              notifyMessage.Title=message.title;
              notifyMessage.msgId=message.msgId;
              notifyMessage.IsAttention=false;
              notifyMessage.__isset_bitfield="";
            $rootScope.$broadcast('newnotify.update',notifyMessage);
          } else if (message.type === "Alarm" || message.type === "System") {   //老版的系统报警和推送
            $greendao.saveObj('SystemMsgService',arriveMessage,function (data) {
            },function (err) {
            });
            $greendao.queryData("NotifyListService","where id =?",arriveMessage.sessionid,function (data) {
              if(data.length>0){
                syscount=data[0].count;
                syscount++;
                $rootScope.$broadcast('notify.update');
              }else{
                syscount =0;
                syscount++;
                $rootScope.$broadcast('notify.update');
              }
            },function (err) {
            });
            $rootScope.firstSessionid=arriveMessage.sessionid;
            $rootScope.firstUserName=arriveMessage.username;
            $rootScope.messagetype= arriveMessage.type;
          }else if(message.type ==="User" || message.type ==="Group" || message.type ==="Dept"){       //消息模块
            if (message.messagetype === "Image" || message.messagetype === "File" || message.messagetype === "Audio" || message.messagetype === 'Vedio') {   //文件或者图片
              var objectTP = 'I';
              if (message.messagetype === "Image") {
                objectTP = 'I';
              } else if(message.messagetype === "File") {
                objectTP = 'F';
              } else if (message.messagetype === "Audio") {
                objectTP = 'A';
              } else if (message.messagetype === "Vedio") {
                objectTP = 'V';
              }
              var newMessage = arriveMessage.message;
              arriveMessage.message = '';
              if (objectTP === 'F') {//当发送消息的为图片时
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
                arrivefile._id=arriveMessage._id;
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

            } else if(objectTP === 'I' || objectTP === 'A' || objectTP === 'V'){        //当发送消息的为图片时
                $okhttp.download(arriveMessage,newMessage,'100',0, function (data) {
                    arriveMessage.message = data;
                    //当图片下载完了，入数组，无需入库(因为在java后端已经入库了)
                    if(message.type==="User"){
                      danliao.push(arriveMessage);
                      $rootScope.$broadcast('msgs.update');
                    }else if(message.type ==="Group" || message.type ==="Dept"){
                      qunliao.push(arriveMessage);
                      $rootScope.$broadcast('msgs.update');
                    }

                    if (arriveMessage.messagetype!="Audio" && arriveMessage.messagetype!="Vedio") {
                      var arrivepic={};
                      arrivepic.filepicid=arriveMessage.message.split('###')[0];
                      arrivepic._id=arriveMessage._id;
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
            }
          }
          return size;
        },function (message) {
          return 0;
        });

        return "nihao";
      },
      getDanliao:function () {
        return danliao;
      },
      setDanliao:function (data) {
        danliao =new Array();
        for(var i=0;i<data.length;i++){
          danliao.unshift(data[i]);
        }
      },
      sendupdate:function (sessionid,id) {
        keyvalue=sessionid+","+id;
        return keyvalue;
      },
      receiveupdate:function () {
        return keyvalue;
      },
      updateImgFileDanliao:function (data) {
        for(var i=0;i<danliao.length;i++){
          if( danliao[i]._id === data._id){
            danliao.splice(i,1);
            break;
          }
        }
      },
      updateImgFileQunliao:function (data) {
        for(var i=0;i<qunliao.length;i++){
          if( qunliao[i]._id === data._id){
            qunliao.splice(i,1);
            break;
          }
        }
      },
      updateDanliao:function (data) {
        for(var i=0;i<danliao.length;i++){
          if( danliao[i]._id === data._id){
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
        for(var i = 0;i<qunliao.length;i++){
          if(qunliao[i].isSuccess === 'false'){
            qunliao[i].isFailure='true';
          }
        }
      },
      adddanliaodata:function (data) {

        danliao.unshift(data);
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
          // alert("进来群组删数组数据了吗"+qunliao.length+data._id+"数组id"+qunliao[i]._id+"数组状态"+qunliao[i].isSuccess+"群消息"+qunliao[i].message);
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

      sendGroupMsg:function (topic, content, id,grouptype,localuser,localuserId,sqlid,messagetype,$mqtt) {
        //alert("发送群消息"+content);
        var messageReal={};
        messageReal._id=sqlid;
        messageReal.sessionid=id;
        messageReal.type=grouptype;
        messageReal.from='true';
        messageReal.message=content;
        messageReal.messagetype=messagetype;
        messageReal.platform='Windows';
        messageReal.when=new Date().getTime();
        messageReal.isFailure='false';
        messageReal.isDelete='false';

        if($rootScope.securlpicaaa==undefined||$rootScope.securlpicaaa==null||$rootScope.securlpicaaa.length==0){
          messageReal.imgSrc='';
        }else{
          var imssrc=$rootScope.securlpicaaa;
          messageReal.imgSrc=imssrc;
        }
        // messageReal.imgSrc='';
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

        //判断是不是位置
        if( messagetype === 'LOCATION'){;
          var arrs = content.split(',');
          var longt = arrs[0];
          var lat = arrs[1];
          messageReal.message=longt+","+lat + "," + arrs[2];
        }

          /**
           *  当消息还未发送成功或者失败时，先展示在界面上，入库并发送监听
           */
          qunliao.push(messageReal);
          $greendao.saveObj('MessagesService',messageReal,function (data) {
            // $mqtt.updateQunliao(messageReal);
            $rootScope.$broadcast('msgs.update');
            // alert("群组消息保存成功");
          },function (err) {
            // alert("群组消息保存失败");
          });

          /**
           * 消息发送成功/失败的回调
           */
          mqtt.sendMsg(topic, messageReal, function (message) {
            //改变状态前，删除数据
            // alert("成功发送后长度"+qunliao.length);
            $mqtt.updateQunliao(message);
            if(messagetype === 'LOCATION') {
              message.message = content;
              $greendao.saveObj('MessagesService', message, function (data) {
                $rootScope.$broadcast('msgs.update');
                //往消息主界面发送一个监听
                $mqtt.sendupdate(message.sessionid,message._id);
                $rootScope.$broadcast('sendsuccess.update');
              }, function (err) {
              });
            }else{
              // alert(message.imgSrc+"+++")
              $greendao.saveObj('MessagesService',message,function (data) {
                $rootScope.$broadcast('msgs.update');
                // alert("群组消息保存成功");
                //往消息主界面发送一个监听
                $mqtt.sendupdate(message.sessionid,message._id);
                $rootScope.$broadcast('sendsuccess.update');
              },function (err) {
                // alert("群组消息保存失败");
              });
            }
            return "成功";
          },function (message) {
            $mqtt.updateQunliao(message);
            $greendao.saveObj('MessagesService',message,function (data) {
              $rootScope.$broadcast('msgs.error');
            },function (err) {
            });
          return "失败";

        });

        return "啥也不是";
      },
      disconnect:function (success, error) {
        mqtt.disconnect(success, error);
      },
      switchAccount:function(userID, success, error){//切换账号
        mqtt.switchAccount(userID, success, error);
      },
      hasParttimeAccount:function(success, error) {//判断是否有兼职账号
        mqtt.hasParttimeAccount(success, error);
      },
      save:function (key,value) {
        mqtt.save(key,value);
      },
      saveInt:function (key,value) {
        mqtt.saveInt(key,value);
      },
      getInt:function (key,success,error) {
        mqtt.getInt(key,success,error);
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
      takeVideo:function(success,error) {//录制小视频
        mqtt.takeVideo(success, error);
      },
      setOnNetStatusChangeListener:function(success,error) {//MQTT监听
        // alert("走监听事件了吗");
        mqtt.setOnNetStatusChangeListener(function (succ) {
          isNetConnect = true;
          $rootScope.$broadcast('netStatusNow.update');
        },function (err) {
          isNetConnect = false;
          $rootScope.$broadcast('netStatusNow.update');
        });
      },
      getIMStatus:function () {//获取MQTT连接状态
        return isNetConnect;
      },
      setOnNetChangeListener:function(success,error) {//网络监听
        mqtt.setOnNetChangeListener(success,error);
      },
      getMqttStatus:function(success) {//MQTT连接状态获取
        mqtt.getMqttStatus(success);
      },
      setExitStartedStatus:function() {//改变登录状态为未登录
        mqtt.setExitStartedStatus();
      },
      startRecording:function(success, error) {//开始录音
        mqtt.startRecording(success, error);
      },
      stopRecording:function(success, error) {//结束录音
        mqtt.stopRecording(success, error);
      },
      playRecord:function(fileName,success, error) {//播放录音
        mqtt.playRecord(fileName,success, error);
      },
      stopPlayRecord:function(success, error) {//停止播放录音
        mqtt.stopPlayRecord(success, error);
      },
      setProxyMode:function(mode) {//设置距离感应器模式（0为正常模式，1为听筒模式）
        mqtt.setProxyMode(mode);
      },
      getProxyMode:function(success) {//获取距离感应器模式（0为正常模式，1为听筒模式）
        mqtt.getProxyMode(success);
      },
      isVideo:function(filePath) {//filePath：文件全路径  判断文件是否是视频格式
        if (filePath === null || filePath.indexOf('.') <= 0) {
          return false;
        }
        var suffix = filePath.substring(filePath.lastIndexOf('.'), filePath.length).toLowerCase();
        return suffix === '.avi' || suffix === '.mp4' || suffix === '.wmv' || suffix === '.rmvb' ||
        suffix === '.rm' || suffix === '.mpg' || suffix === '.mlv' || suffix === '.mpe' ||
          suffix === '.mpeg' || suffix === '.dat' || suffix === '.mpe' || suffix === '.mpeg' ||
          suffix === '.m2v' || suffix === '.vob' || suffix === '.asf' || suffix === '.mov' ||
          suffix === '.divx' || suffix === '.wmf' || suffix === '.ts';
      },
      getMonthOrDay:function (monthOrDay) {//修正日期的month或day（如果小于9，则在其前面加0，否则不变）
        return (monthOrDay>9 ? (monthOrDay + "") : ("0" + monthOrDay));
      },
      getNetStatus:function(success) {//获取当前网络状态
        mqtt.getNetStatus(success);
      },
      //获取imcode码
      getImcode:function (success, error) {
        mqtt.getImcode(success, error)
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

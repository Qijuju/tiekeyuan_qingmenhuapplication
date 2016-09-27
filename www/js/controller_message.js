/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('message.controllers', [])
  .controller('MessageDetailCtrl', function ($scope, $state, $http, $ionicScrollDelegate, $mqtt, $ionicActionSheet, $greendao, $timeout, $rootScope, $stateParams,$chatarr,$ToastUtils, $cordovaCamera,$api,$searchdata,$phonepluin) {
    $scope.a=0;
    $scope.gengduo=function () {

      if ($scope.a==0){
        //加滑动底部
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
        document.getElementById("contentaa").style.marginBottom='165px';
        $scope.a=1;
      }else {
        document.getElementById("contentaa").style.marginBottom='0px';
        $scope.a=0;
      }
    };
    $scope.zhiling=function () {
      document.getElementById("contentaa").style.marginBottom='0px';
      $scope.a=0;
    };
    //清表数据
    // $greendao.deleteAllData('MessagesService',function (data) {
    //   $ToastUtils.showToast(data);
    // },function (err) {
    //   $ToastUtils.showToast(err);
    // });
    $scope.userId = $stateParams.id; //对方id
    // alert("单聊对方id"+$scope.userId);
    $scope.viewtitle = $stateParams.ssid;//接收方姓名
    $scope.groupType = $stateParams.grouptype;//聊天类型
    //对话框名称
    $scope._id='';
    $scope.myUserID = $rootScope.rootUserId;//当前用户id
    $scope.localusr=$rootScope.userName;//当前用户名
    $scope.longitude = $stateParams.longitude;//当前用户id
    $scope.latitude=$stateParams.latitude;//当前用户名
    // alert("经度"+$scope.longitude)
    // alert("纬度"+$scope.latitude)
    var isAndroid = ionic.Platform.isAndroid();
    // $ToastUtils.showToast("当前用户名"+$scope.myUserID+$scope.localusr);
    //在个人详情界面点击创建聊天时，在聊天详情界面，创建chatitem
    if ($rootScope.isPersonSend === 'true') {
      // alert("长度");
      $chatarr.getIdChatName($scope.userId,$scope.viewtitle);
      $chatarr.getAll($rootScope.isPersonSend,$scope.groupType);
      // $ToastUtils.showToast($scope.items.length + "长度");
      $scope.$on('chatarr.update', function (event) {
        $scope.$apply(function () {
          // alert("进入单聊会话列表监听");
          $scope.items=$chatarr.getAllData();
          // alert($scope.items.length);
        });
      });
      $rootScope.isPersonSend = 'false';
    }
    // $ToastUtils.showToast($scope.viewtitle+"抬头"+$scope.myUserID);
    $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,10', $scope.userId, function (data) {
      //根据不同用户，显示聊天记录，查询数据库以后，不论有没有数据，都要清楚之前数组里面的数据
      // for (var j = 0; j <= $mqtt.getDanliao().length-1; j++) {
      //   $mqtt.getDanliao().splice(j, $mqtt.getDanliao().length);//清除之前数组里存的数据
      // }
      // for (var i = 1; i <= data.length; i++) {
      //   $mqtt.getDanliao().push(data[data.length - i]);
      // }
      $mqtt.setDanliao(data);
      $scope.msgs = $mqtt.getDanliao();
      //$ToastUtils.showToast($scope.msgs[$scope.msgs.length - 1]._id+"asdgf" + $scope.msgs[$scope.msgs.length - 1].message);
    }, function (err) {
      // $ToastUtils.showToast(err);
    });

    var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
    var footerBar = document.body.querySelector('#messageDetail .bar-footer');
    var txtInput = angular.element(footerBar.querySelector('textarea'));

    $scope.$on('$ionicView.enter', function () {

      viewScroll.scrollBottom();

    });
    $scope.doRefresh = function () {
      $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,' + ($mqtt.getDanliao().length + 10), $scope.userId, function (data) {
        if ($scope.msgs.length < 50) {
          // for (var j = 0; j <= $mqtt.getDanliao().length-1; j++) {
          //   $mqtt.getDanliao().splice(j, $mqtt.getDanliao().length);//清除之前数组里存的数据
          // }
          // for (var i = 1; i <= data.length; i++) {
          //   $mqtt.getDanliao().push(data[data.length - i]);
          // }
          $mqtt.setDanliao(data);
          $scope.msgs = $mqtt.getDanliao();
        } else if ($scope.msgs.length >= 50) {
          $scope.nomore = "true";
        }
        $scope.$broadcast("scroll.refreshComplete");
      }, function (err) {
        // $ToastUtils.showToast(err);
      });
    }
    $scope.getPhoto = function(sourceTypeStr,topic, content, id,localuser,localuserId,sqlid) {
      var sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
      if (sourceTypeStr === 'PHOTOLIBRARY') {
        sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
      } else if(sourceTypeStr === 'CAMERA') {
        sourceType = Camera.PictureSourceType.CAMERA;
      }
      var options = {
        quality: 50,
        targetWidth: 320,
        targetHeight: 320,
        saveToPhotoAlbum: false,
        sourceType: sourceType,
        // destinationType: Camera.DestinationType.DATA_URL
        destinationType: Camera.DestinationType.FILE_URI
      };

      $cordovaCamera.getPicture(options).then(function(imageURI) {
        // console.log($stateParams.conversationType + '--' + imageURI);
        // alert(imageURI)
        var picPath = imageURI;
        console.log("getPicture:" + picPath);
        // if(isIOS){
        //   picPath = imageURI.replace('file://','');
        // }
        if(isAndroid){
          picPath = imageURI.substring(0, imageURI.indexOf('?'));
        }
        // alert(picPath + "//ssss");
        $api.sendFile('I',null,picPath,function (data) {
          $scope.imgPath=data[0];
          $scope.objID=data[1];
          // alert(data[0] + "::::" + data[1]);

          $mqtt.getMqtt().getTopic(topic, "User", function (userTopic) {
            // $ToastUtils.showToast("单聊topic"+userTopic+$scope.groupType);
            $scope.suc = $mqtt.sendMsg(userTopic, $scope.objID, id,localuser,localuserId,sqlid, "Image",$scope.imgPath);
            $scope.send_content = "";
            keepKeyboardOpen();
          }, function (msg) {
          });

        },function (err) {
          $ToastUtils.showToast(err+"上传图片失败",null,null);
        });
        // RongCloudLibPlugin.sendImageMessage({
        //     conversationType: $stateParams.conversationType,
        //     targetId: $stateParams.targetId,
        //     imagePath: picPath,
        //     extra: "this is a extra text"
        //   },
        //   function(ret, err) {
        //     // $scope.lstResult = JSON.stringify(ret);
        //     if (ret) {
        //       if (ret.status == "prepare") {
        //         //消息此时未发送成功，可以加入样式标明；成功后更新样式
        //         appendNewMsg(ret.result.message, true);
        //         console.log("prepare:" +  JSON.stringify(ret.result.message));
        //         // alert("prepare");
        //       }
        //       if (ret.status == "success") {
        //         // alert("success");
        //         // 后续加入发送成功后修改显示样式
        //       }
        //     }
        //     if (err) {
        //       alert("sendImageMessage error: " + JSON.stringify(err));
        //       console.log("sendImageMessage error: " + JSON.stringify(err));
        //     }
        //   }
        // );
        // $scope.lstResult = imageURI;
      }, function(err) {
        console.error(err);
      });
    };

    $scope.openDocumentWindow = function (topic, content, id,localuser,localuserId,sqlid) {
      $mqtt.openDocWindow(function (filePath) {
        // alert(filePath);
        $api.sendDocFile('F', null, filePath, function (data) {
          // alert(filePath);
          // alert(filePath);
          $scope.filePath=data[0];
          $scope.fileObjID=data[1];

          $mqtt.getMqtt().getTopic(topic, "User", function (userTopic) {
            // $ToastUtils.showToast("单聊topic"+userTopic+$scope.groupType);
            $scope.suc = $mqtt.sendMsg(userTopic, $scope.fileObjID, id, localuser, localuserId, sqlid, "File", $scope.filePath);
            $scope.send_content = "";
            keepKeyboardOpen();
          });


        });
      }, function (err) {
      });
    };

    /*$("#butAlbum").bind('click', function() {
     window.alert("asdfadg");
     getPhoto(Camera.PictureSourceType.PHOTOLIBRARY);
     return false;
     });*/

    window.addEventListener("native.keyboardshow", function (e) {
      viewScroll.scrollBottom();
    });

    $scope.sendSingleMsg = function (topic, content, id,localuser,localuserId,sqlid) {
      $mqtt.getMqtt().getTopic(topic, $scope.groupType, function (userTopic) {
        // $ToastUtils.showToast("单聊topic"+userTopic+$scope.groupType);
        $scope.suc = $mqtt.sendMsg(userTopic, content, id,localuser,localuserId,sqlid);
        $scope.send_content = "";
        keepKeyboardOpen();
      }, function (msg) {
      });
    };
    function keepKeyboardOpen() {
      console.log('keepKeyboardOpen');
      txtInput.one('blur', function () {
        txtInput[0].focus();
      });

      $scope.onDrag = function () {
        var keyboard = cordova.require('ionic-plugin-keyboard.keyboard');
        keyboard.close();
      };

    }

    //在联系人界面时进行消息监听，确保人员收到消息
    //收到消息时，创建对话聊天(cahtitem)
    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // $scope.msgs=$mqtt.getDanliao();
        // alert("发送定位之后"+$scope.msgs.length+$scope.msgs[$scope.msgs.length-1].message);
        //当lastcount值变化的时候，进行数据库更新：将更改后的count的值赋值与unread，并将该条对象插入数据库并更新
        $scope.lastCount = $mqtt.getMsgCount();
        // 当群未读消息lastGroupCount数变化的时候
        $scope.lastGroupCount = $mqtt.getMsgGroupCount();
        // alert("是不是先拿到这个值"+$scope.lastGroupCount);
        $scope.firstUserId = $mqtt.getFirstReceiverSsid();
        $scope.receiverssid = $scope.firstUserId;
        $scope.chatName = $mqtt.getFirstReceiverChatName();
        $scope.firstmessageType = $mqtt.getMessageType();

        /**
         * 判断是单聊未读还是群聊未读
         */
        if ($scope.lastCount > 0 && $scope.firstmessageType ==='User') {
          // alert("进来单聊"+$scope.receiverssid);
          //当监听到有消息接收的时候，去判断会话列表有无这条记录，有就将消息直接展示在界面上；无就创建会话列表
          // 接收者id
          // $scope.receiverssid=$mqtt.getFirstReceiverSsid();
          //收到消息时先判断会话列表有没有这个用户
          $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
            // $ToastUtils.showToast(data.length + "收到消息时，查询chat表有无当前用户");
            if (data.length === 0) {
              // $ToastUtils.showToast("没有该会话");
              $rootScope.isPersonSend = 'true';
              if ($rootScope.isPersonSend === 'true') {
                $scope.messageType = $mqtt.getMessageType();
                // alert("会话列表聊天类型" + $scope.messageType);
                //往service里面传值，为了创建会话
                $chatarr.getIdChatName($scope.receiverssid, $scope.chatName);
                $chatarr.getAll($rootScope.isPersonSend, $scope.messageType);
                // $ToastUtils.showToast($scope.items.length + "长度");
                $scope.$on('chatarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.items = $chatarr.getAllData();
                  });
                });
                $rootScope.isPersonSend = 'false';
              }
            }
          }, function (err) {
            // $ToastUtils.showToast("收到未读消息时，查询chat列表" + err);
          });
          //取出与‘ppp’的聊天记录最后一条
          $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.receiverssid, function (data) {
            // $ToastUtils.showToast("未读消息时取出消息表中最后一条数据"+data.length);
            // alert("消息类型"+data[0].messagetype);
            if(data[0].messagetype === "Image"){
              $scope.lastText = "[图片]";//最后一条消息内容
            }else if(data[0].messagetype === "LOCATION"){
              $scope.lastText = "[位置]";//最后一条消息内容
            }else {
              $scope.lastText = data[0].message;//最后一条消息内容
            }
            $scope.lastDate = data[0].when;//最后一条消息的时间
            // $ToastUtils.showToast($scope.chatName + "用户名1");
            $scope.srcName = data[0].username;//消息来源人名字
            $scope.srcId = data[0].senderid;//消息来源人id
            $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
            //取出‘ppp’聊天对话的列表数据并进行数据库更新
            $greendao.queryData('ChatListService', 'where id=?', $scope.receiverssid, function (data) {
              $scope.unread = $scope.lastCount;
              // $ToastUtils.showToast("未读消息时取出消息表中最后一条数据" + data.length + $scope.unread);
              var chatitem = {};
              chatitem.id = data[0].id;
              chatitem.chatName = data[0].chatName;
              chatitem.imgSrc = $scope.imgSrc;
              chatitem.lastText = $scope.lastText;
              chatitem.count = $scope.unread;
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = $scope.lastDate;
              chatitem.chatType = data[0].chatType;
              chatitem.senderId = $scope.srcId;
              chatitem.senderName = $scope.srcName;
              $greendao.saveObj('ChatListService', chatitem, function (data) {
                $chatarr.updatechatdata(chatitem);
                $rootScope.$broadcast('lastcount.update');
              }, function (err) {
                // $ToastUtils.showToast(err + "数据保存失败");
              });
            }, function (err) {
              // $ToastUtils.showToast(err);
            });
          }, function (err) {
            // $ToastUtils.showToast(err);
          });
        } else if ($scope.lastGroupCount > 0) {
          // alert("进来群聊id"+$scope.receiverssid);
          // $ToastUtils.showToast("监听群未读消息数量"+$scope.lastGroupCount+$scope.receiverssid);
          /**
           * 1.首先查询会话列表是否有该会话(chatListService)，若无，创建会话；若有进行第2步
           * 2.查出当前群聊的最后一条聊天记录(messageService)
           * 3.查出会话列表的该条会话，将取出的数据进行赋值(chatListService)
           * 4.保存数据(chatListService)
           * 5.数据刷新(chatListService)按时间降序排列展示
           */
          $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
            // alert(data.length+"收到消息时，查询chat表有无当前用户");
            if (data.length === 0) {
              // alert("群聊主界面没有该会话");
              $rootScope.isPersonSend = 'true';
              if ($rootScope.isPersonSend === 'true') {
                $scope.messageType = $mqtt.getMessageType();
                //获取消息来源人
                $scope.chatName = $mqtt.getFirstReceiverChatName();//取到消息来源人，准备赋值，保存chat表
                // alert("群组会话列表聊天类型"+$scope.messageType+$scope.chatName);
                //根据群组id获取群名称
                $greendao.queryData('GroupChatsService', 'where id =?', $scope.receiverssid, function (data) {
                  // alert(data[0].groupName);
                  $rootScope.groupName = data[0].groupName;
                  //往service里面传值，为了创建会话
                  $chatarr.getIdChatName($scope.receiverssid, $scope.groupName);
                  $chatarr.getAll($rootScope.isPersonSend, $scope.messageType);
                  // alert($scope.items.length + "长度");
                  $scope.$on('chatarr.update', function (event) {
                    $scope.$apply(function () {
                      $scope.items=$chatarr.getAllData();
                      /**
                       *  若会话列表有该群聊，取出该会话最后一条消息，并显示在会话列表上
                       *
                       */
                      // $ToastUtils.showToast("群组长度" + $scope.items.length);
                      $scope.savelastmsg();
                    });
                  });
                  $rootScope.isPersonSend = 'false';
                }, function (err) {
                  // $ToastUtils.showToast(err + "查询群组对应关系");
                });
              }
            }else{
              $scope.savelastmsg();
            }
          }, function (err) {
            // $ToastUtils.showToast("收到群组未读消息时，查询chat列表" + err);
          });
          $scope.savelastmsg=function () {
            $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.receiverssid, function (data) {
              $scope.lastText = data[0].message;//最后一条消息内容
              $scope.lastDate = data[0].when;//最后一条消息的时间
              $scope.srcName = data[0].username;//消息来源人名字
              $scope.srcId = data[0].senderid;//消息来源人id
              // alert($scope.srcName + "消息来源人" + $scope.srcId + $scope.lastText);
              $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
              //取出id聊天对话的列表数据并进行数据库更新
              $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
                $scope.unread = $scope.lastGroupCount;
                // alert("未读群消息时取出消息表中最后一条数据" + data.length + $scope.unread);
                var chatitem = {};
                chatitem.id = data[0].id;
                if($rootScope.groupName === '' || $rootScope.groupName === undefined){
                  chatitem.chatName =$rootScope.groupName;
                  // alert("群名称："+chatitem.chatName);
                }else{
                  chatitem.chatName =data[0].chatName ;
                  // alert("群名称2222"+chatitem.chatName);
                }
                // $ToastUtils.showToast("第一次创建会话时保存的群聊名称"+chatitem.chatName);
                chatitem.imgSrc = data[0].imgSrc;
                chatitem.lastText = $scope.lastText;
                chatitem.count = $scope.unread;
                chatitem.isDelete = data[0].isDelete;
                chatitem.lastDate = $scope.lastDate;
                chatitem.chatType = data[0].chatType;
                chatitem.senderId = $scope.srcId;
                chatitem.senderName = $scope.srcName;
                $greendao.saveObj('ChatListService', chatitem, function (data) {
                  $chatarr.updatechatdata(chatitem);
                  $rootScope.$broadcast('lastcount.update');
                }, function (err) {
                  // $ToastUtils.showToast(err + "数据保存失败");
                });
              }, function (err) {
                // $ToastUtils.showToast(err);
              });
            }, function (err) {
              // $ToastUtils.showToast(err);
            });
          }
        }
        //加滑动底部
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });
    $scope.$on('msgs.error', function (event) {
      $scope.$apply(function () {
        $scope.msgs = $mqtt.getDanliao();
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

    // 点击按钮触发，或一些其他的触发条件
    $scope.resendshow = function (topic, content, id,localuser,localuserId,sqlid) {
      // $scope.msgs.remove(msgSingle);
      // $ToastUtils.showToast(msgSingle);
      // 显示操作表
      $ionicActionSheet.show({
        buttons: [
          {text: '重新发送'},
          {text: '删除'},
        ],
        // destructiveText: '重新发送',
        // titleText: 'Modify your album',
        cancelText: '取消',
        buttonClicked: function (index) {
          if (index === 0) {
            //消息发送失败重新发送成功时，页面上找出那条带叹号的message并删除，未能正确取值。
            alert($mqtt.getDanliao().length);
            for(var i=0;i<$mqtt.getDanliao().length;i++){
              // alert(sqlid+i+"来了" );
              if($mqtt.getDanliao()[i]._id === sqlid){
                // alert("后"+$mqtt.getDanliao()[i]._id);
                $mqtt.getDanliao().splice(i, 1);
                break;
              }
            }
            $scope.sendSingleMsg(topic, content, id,localuser,localuserId,sqlid);
          } else if (index === 1) {

          }
          return true;
        }
      });

    };

    $scope.backFirstMenu = function (groupType) {
      $mqtt.clearMsgCount();
      // $ToastUtils.showToast("无参进来的userid"+$scope.userId);
      //收到消息时先判断会话列表有没有这个用户
      //如果直接创建聊天到聊天详情界面，继续返回到主界面，而会话列表还没有该条会话，进行会话列表的item添加
      $greendao.queryData('ChatListService','where id =?',$scope.userId,function (data) {
        // $ToastUtils.showToast(data.length+"收到消息时，查询chat表有无当前用户");
        if(data.length ===0){
          // $ToastUtils.showToast("单聊没有该会话");
          $rootScope.isPersonSend='true';
          if ($rootScope.isPersonSend === 'true') {
            // $ToastUtils.showToast("长度");
            //往service里面传值，为了创建会话
            $chatarr.getIdChatName($scope.userId,$scope.viewtitle);
            $scope.items = $chatarr.getAll($rootScope.isPersonSend,groupType);
            // $ToastUtils.showToast($scope.items.length + "单聊长度");
            $scope.$on('chatarr.update', function (event) {
              $scope.$apply(function () {
                $scope.items = $chatarr.getAll($rootScope.isPersonSend,groupType);
              });
            });
            $rootScope.isPersonSend = 'false';
          }
        }
      },function (err) {
        // $ToastUtils.showToast("收到未读消息时，查询chat列表"+err);
      });
      $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.userId, function (data) {
        if (data.length === 0) {
          // $ToastUtils.showToast("无数据返回主界面1");
          $scope.lastText = '';//最后一条消息内容
          $scope.lastDate = 0;//最后一条消息的时间
          $scope.chatName = $scope.viewtitle;//对话框名称
          $scope.imgSrc = '';//最后一条消息的头像
          $scope.srcId='';//若没有最后一条消息，则将senderid=‘’
          $scope.srcName ='';//若没有最后一条数据，则将senderName=‘’
        } else {
          if(data[0].messagetype === "Image"){
            // alert("返回即时通");
            $scope.lastText = "[图片]";//最后一条消息内容
          }else if(data[0].messagetype === "LOCATION"){
            $scope.lastText = "[位置]";//最后一条消息内容
          }else {
            $scope.lastText = data[0].message;//最后一条消息内容
          }
          $scope.lastDate = data[0].when;//最后一条消息的时间
          $scope.chatName = data[0].username;//对话框名称
          $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
          $scope.srcName = data[0].username;//消息来源人名字
          $scope.srcId = data[0].senderid;//消息来源人id
        }
        // $ToastUtils.showToast("无参跳转用户名"+$scope.userId);
        $greendao.queryData('ChatListService', 'where id=?', $scope.userId, function (data) {
          // $ToastUtils.showToast("无参跳转查询消息列表"+data.length);
          var chatitem = {};
          chatitem.id = data[0].id;
          chatitem.chatName = data[0].chatName;
          chatitem.imgSrc = $scope.imgSrc;
          chatitem.lastText = $scope.lastText;
          chatitem.count = '0';
          chatitem.isDelete = data[0].isDelete;
          chatitem.lastDate = $scope.lastDate;
          chatitem.chatType = data[0].chatType;
          chatitem.senderId = $scope.srcId;
          chatitem.senderName = $scope.srcName;
          $greendao.saveObj('ChatListService', chatitem, function (data) {
            // $ToastUtils.showToast("save success");
            $greendao.queryByConditions('ChatListService', function (data) {
              // $ToastUtils.showToast("加载成功");
              $state.go("tab.message", {
                "id": $scope.userId,
                "sessionid": $scope.chatName,
                "grouptype":"User"
              });
            }, function (err) {
              // $ToastUtils.showToast(err + "加载全部数据失败");
            });
          }, function (err) {
            // $ToastUtils.showToast(err + "数据保存失败");
          });
        }, function (err) {
          // $ToastUtils.showToast(err + "查询聊天列表失败");
        });
      }, function (err) {
        // $ToastUtils.showToast(err + "数据离开失败");
      });
    }

    //当前聊天记录超过50条时，跳转到历史消息记录页面
    $scope.skipmessagebox = function () {
      // $ToastUtils.showToast("正确进入聊天方法"+$scope.viewtitle+$scope.userId);
      $state.go("historyMessage", {
        id: $scope.userId,
        ssid: $scope.viewtitle
      });

    };

    //点击小头像，跳转到聊天设置界面
    $scope.personalSetting = function () {
      $state.go('personalSetting', {
        id: $scope.userId,
        ssid:$scope.viewtitle
      });
    };

    //点击定位，跳转查询位置界面
    $scope.gogelocation = function (messagetype,topic, content, id,localuser,localuserId,sqlid,groupType) {
      $state.go('sendGelocation', {
        topic:topic,
        id: id,
        ssid:$scope.viewtitle,
        localuser:localuser,
        localuserId:localuserId,
        sqlid:sqlid,
        grouptype:$scope.groupType,
        messagetype:messagetype
      });
    };
    var map ="";
    var point ="";
    // $scope.changelocation =function (content) {
    //   alert("jinlaisddfsdsdf===");
    //   var long=content.substring(0,(content).indexOf(','));
    //   var lat=content.substring((content).indexOf(',')+1,content.length);
    //   alert("long"+long);
    //   alert("lat"+lat);
    //   map = new BMap.Map("container"); // 创建地图实例
    //   point = new BMap.Point(long, lat); // 创建点坐标
    //   map.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别
    //   // var marker = new BMap.Marker(point); // 创建标注
    //   // map.addOverlay(marker); // 将标注添加到地图中
    // }

    $scope.godetail=function (userid) {
      $state.go('person',{
        'userId':userid
      });
    }

    $scope.entermap=function (content) {
      $scope.longitude=content.substring(0,(content).indexOf(','));
      $scope.latitude=content.substring((content).indexOf(',')+1,content.length);
      // alert("发送经纬度"+content+"sdfs"+$scope.longitude+"-----------"+$scope.latitude);
      $state.go('mapdetail', {
        id: $scope.userId,
        ssid:$scope.viewtitle,
        grouptype:$scope.groupType,
        longitude:$scope.longitude,
        latitude:$scope.latitude
      });
    }

    $scope.callperson=function () {
      $searchdata.personDetail($scope.userId);
    }
    $scope.$on('person.update', function (event) {
      $scope.$apply(function () {
        var phone=$searchdata.getPersonDetail().user.Mobile;
        if(phone.length==0||phone==null||phone==""){
          $ToastUtils.showToast("电话号码为空")
        }else {
          $phonepluin.call($scope.userId, phone, $scope.chatName,1);
        }
      })
    });

  })


  .controller('MessageGroupCtrl', function ($scope, $state, $http, $ionicScrollDelegate, $mqtt, $ionicActionSheet, $greendao, $timeout,$stateParams,$rootScope,$chatarr,$ToastUtils) {
    /**
     * 从其他应用界面跳转带参赋值
     */
    $scope.groupid=$stateParams.id;
    $scope.chatname=$stateParams.chatName;
    $scope.grouptype=$stateParams.grouptype;
    $scope.ismygroup=$stateParams.ismygroup;
    // alert("新建群时"+$scope.groupid+$scope.chatname+$scope.ismygroup);
    /**
     * 全局的当前用户和id进行赋值，并且将发送消息的id置为‘’
     * @type {string}
     * @private
     */
    $scope._id='';
    $scope.localusr = $rootScope.userName;
    $scope.myUserID = $rootScope.rootUserId;

    // $ToastUtils.showToast("跳进群组详聊"+$scope.groupid+$scope.chatname+$scope.grouptype+$scope.ismygroup);

    if ($rootScope.isPersonSend === 'true') {
      // alert("进群啦");
      $chatarr.getIdChatName($scope.groupid,$scope.chatname);
      $chatarr.getAll($rootScope.isPersonSend,$scope.grouptype);
      // $ToastUtils.showToast($scope.items.length + "群聊长度");
      $scope.$on('chatarr.update', function (event) {
        $scope.$apply(function () {
          $scope.items =$chatarr.getAllData();
        });
      });
      $rootScope.isPersonSend = 'false';
      // $ToastUtils.showToast("走这吗？"+$rootScope.isGroupSend);
    }
    /**
     * 从数据库根据时间降序查询10条数据进行展示
     *
     */
    $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,10', $scope.groupid, function (data) {
      // $ToastUtils.showToast("进入群聊界面，查询数据库长度"+data.length);
      // for (var j = 0; j <= $mqtt.getQunliao().length-1; j++) {
      //   $mqtt.getQunliao().splice(j, $mqtt.getQunliao().length);//清除之前数组里存的数据
      // }
      // for (var i = 1; i <= data.length; i++) {
      //   $mqtt.getQunliao().push(data[data.length - i]);
      // }
      $mqtt.setQunliao(data);
      $scope.groupmsgs = $mqtt.getQunliao();
    }, function (err) {
      // $ToastUtils.showToast(err);
    });


    var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
    var footerBar = document.body.querySelector('#messageGroupDetail .bar-footer');
    var txtInput = angular.element(footerBar.querySelector('textarea'));

    //获取更多数据
    $scope.doRefresh = function () {
      // $ToastUtils.showToast("群组刷新");
      $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,' + ($mqtt.getQunliao().length + 10), $scope.groupid, function (data) {
        if ($scope.groupmsgs.length < 50) {
          // $ToastUtils.showToast("群组刷新《50");
          // for (var j = 0; j <= $mqtt.getQunliao().length-1; j++) {
          //   $mqtt.getQunliao().splice(j, $mqtt.getQunliao().length);//清除之前数组里存的数据
          // }
          // for (var i =1; i <=data.length; i++) {
          //   $mqtt.getQunliao().push(data[data.length - i]);
          // }
          $mqtt.setQunliao(data);
          $scope.groupmsgs = $mqtt.getQunliao();
        } else if ($scope.groupmsgs.length >= 50) {
          $scope.nomore = "true";
        }
        $scope.$broadcast("scroll.refreshComplete");
      }, function (err) {
        // $ToastUtils.showToast(err);
      });
    }

    window.addEventListener("native.keyboardshow", function (e) {
      viewScroll.scrollBottom();
    });

    $scope.sendSingleGroupMsg = function (topic, content, id,grouptype,localuser,localuserId,sqlid) {
      $mqtt.getMqtt().getTopic(topic, $scope.grouptype, function (userTopic) {
        // $ToastUtils.showToast("群聊topic"+userTopic+$scope.grouptype);
        $mqtt.sendGroupMsg(userTopic, content, id,grouptype,localuser,localuserId,sqlid);
        $scope.send_content = ""
        keepKeyboardOpen();
      });
    };
    function keepKeyboardOpen() {
      console.log('keepKeyboardOpen');
      txtInput.one('blur', function () {
        txtInput[0].focus();
      });

      $scope.onDrag = function () {
        var keyboard = cordova.require('ionic-plugin-keyboard.keyboard');
        keyboard.close();
      };

    }

    // $mqtt.arriveMsg("cll");
    //在联系人界面时进行消息监听，确保人员收到消息
    //收到消息时，创建对话聊天(cahtitem)
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        //当lastcount值变化的时候，进行数据库更新：将更改后的count的值赋值与unread，并将该条对象插入数据库并更新
        $scope.lastCount = $mqtt.getMsgCount();
        // 当群未读消息lastGroupCount数变化的时候
        $scope.lastGroupCount = $mqtt.getMsgGroupCount();
        // alert("是不是先拿到这个值"+$scope.lastGroupCount);
        $scope.firstUserId = $mqtt.getFirstReceiverSsid();
        $scope.receiverssid = $scope.firstUserId;
        $scope.chatName = $mqtt.getFirstReceiverChatName();
        $scope.firstmessageType = $mqtt.getMessageType();

        /**
         * 判断是单聊未读还是群聊未读
         */
        if ($scope.lastCount > 0 && $scope.firstmessageType ==='User') {
          // alert("进来单聊");
          //当监听到有消息接收的时候，去判断会话列表有无这条记录，有就将消息直接展示在界面上；无就创建会话列表
          // 接收者id
          // $scope.receiverssid=$mqtt.getFirstReceiverSsid();
          //收到消息时先判断会话列表有没有这个用户
          $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
            // $ToastUtils.showToast(data.length + "收到消息时，查询chat表有无当前用户");
            if (data.length === 0) {
              // $ToastUtils.showToast("没有该会话");
              $rootScope.isPersonSend = 'true';
              if ($rootScope.isPersonSend === 'true') {
                $scope.messageType = $mqtt.getMessageType();
                // alert("会话列表聊天类型" + $scope.messageType);
                //往service里面传值，为了创建会话
                $chatarr.getIdChatName($scope.receiverssid, $scope.chatName);
                $chatarr.getAll($rootScope.isPersonSend, $scope.messageType);
                // $ToastUtils.showToast($scope.items.length + "长度");
                $scope.$on('chatarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.items = $chatarr.getAllData();
                  });
                });
                $rootScope.isPersonSend = 'false';
              }
            }
          }, function (err) {
            // $ToastUtils.showToast("收到未读消息时，查询chat列表" + err);
          });
          //取出与‘ppp’的聊天记录最后一条
          $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.receiverssid, function (data) {
            // $ToastUtils.showToast("未读消息时取出消息表中最后一条数据"+data.length);
            if(data[0].messagetype === "Image"){
              $scope.lastText = "[图片]";//最后一条消息内容
            }else if(data[0].messagetype === "LOCATION"){
              $scope.lastText = "[位置]";//最后一条消息内容
            }else {
              $scope.lastText = data[0].message;//最后一条消息内容
            }
            $scope.lastDate = data[0].when;//最后一条消息的时间
            // $ToastUtils.showToast($scope.chatName + "用户名1");
            $scope.srcName = data[0].username;//消息来源人名字
            $scope.srcId = data[0].senderid;//消息来源人id
            $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
            //取出‘ppp’聊天对话的列表数据并进行数据库更新
            $greendao.queryData('ChatListService', 'where id=?', $scope.receiverssid, function (data) {
              $scope.unread = $scope.lastCount;
              // $ToastUtils.showToast("未读消息时取出消息表中最后一条数据" + data.length + $scope.unread);
              var chatitem = {};
              chatitem.id = data[0].id;
              chatitem.chatName = data[0].chatName;
              chatitem.imgSrc = $scope.imgSrc;
              chatitem.lastText = $scope.lastText;
              chatitem.count = $scope.unread;
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = $scope.lastDate;
              chatitem.chatType = data[0].chatType;
              chatitem.senderId = $scope.srcId;
              chatitem.senderName = $scope.srcName;
              $greendao.saveObj('ChatListService', chatitem, function (data) {
                $chatarr.updatechatdata(chatitem);
                $rootScope.$broadcast('lastcount.update');
              }, function (err) {
                // $ToastUtils.showToast(err + "数据保存失败");
              });
            }, function (err) {
              // $ToastUtils.showToast(err);
            });
          }, function (err) {
            // $ToastUtils.showToast(err);
          });
        } else if ($scope.lastGroupCount > 0) {
          // alert("进来群聊id"+$scope.receiverssid);
          // $ToastUtils.showToast("监听群未读消息数量"+$scope.lastGroupCount+$scope.receiverssid);
          /**
           * 1.首先查询会话列表是否有该会话(chatListService)，若无，创建会话；若有进行第2步
           * 2.查出当前群聊的最后一条聊天记录(messageService)
           * 3.查出会话列表的该条会话，将取出的数据进行赋值(chatListService)
           * 4.保存数据(chatListService)
           * 5.数据刷新(chatListService)按时间降序排列展示
           */
          $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
            // alert(data.length+"收到消息时，查询chat表有无当前用户");
            if (data.length === 0) {
              // alert("群聊主界面没有该会话");
              $rootScope.isPersonSend = 'true';
              if ($rootScope.isPersonSend === 'true') {
                $scope.messageType = $mqtt.getMessageType();
                //获取消息来源人
                $scope.chatName = $mqtt.getFirstReceiverChatName();//取到消息来源人，准备赋值，保存chat表
                // alert("群组会话列表聊天类型"+$scope.messageType+$scope.chatName);
                //根据群组id获取群名称
                $greendao.queryData('GroupChatsService', 'where id =?', $scope.receiverssid, function (data) {
                  // alert(data[0].groupName);
                  $rootScope.groupName = data[0].groupName;
                  //往service里面传值，为了创建会话
                  $chatarr.getIdChatName($scope.receiverssid, $scope.groupName);
                  $chatarr.getAll($rootScope.isPersonSend, $scope.messageType);
                  // alert($scope.items.length + "长度");
                  $scope.$on('chatarr.update', function (event) {
                    $scope.$apply(function () {
                      $scope.items=$chatarr.getAllData();
                      /**
                       *  若会话列表有该群聊，取出该会话最后一条消息，并显示在会话列表上
                       *
                       */
                      // $ToastUtils.showToast("群组长度" + $scope.items.length);
                      $scope.savegrouplastmsg();
                    });
                  });
                  $rootScope.isPersonSend = 'false';
                }, function (err) {
                  // $ToastUtils.showToast(err + "查询群组对应关系");
                });
              }
            }else{
              $scope.savegrouplastmsg();
            }
          }, function (err) {
            // $ToastUtils.showToast("收到群组未读消息时，查询chat列表" + err);
          });
          $scope.savegrouplastmsg=function () {
            $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.receiverssid, function (data) {
              $scope.lastText = data[0].message;//最后一条消息内容
              $scope.lastDate = data[0].when;//最后一条消息的时间
              $scope.srcName = data[0].username;//消息来源人名字
              $scope.srcId = data[0].senderid;//消息来源人id
              // alert($scope.srcName + "消息来源人" + $scope.srcId + $scope.lastText);
              $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
              //取出id聊天对话的列表数据并进行数据库更新
              $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
                $scope.unread = $scope.lastGroupCount;
                // alert("未读群消息时取出消息表中最后一条数据" + data.length + $scope.unread);
                var chatitem = {};
                chatitem.id = data[0].id;
                if($rootScope.groupName === '' || $rootScope.groupName === undefined){
                  chatitem.chatName =$rootScope.groupName;
                  // alert("群名称："+chatitem.chatName);
                }else{
                  chatitem.chatName =data[0].chatName ;
                  // alert("群名称2222"+chatitem.chatName);
                }
                // $ToastUtils.showToast("第一次创建会话时保存的群聊名称"+chatitem.chatName);
                chatitem.imgSrc = data[0].imgSrc;
                chatitem.lastText = $scope.lastText;
                chatitem.count = $scope.unread;
                chatitem.isDelete = data[0].isDelete;
                chatitem.lastDate = $scope.lastDate;
                chatitem.chatType = data[0].chatType;
                chatitem.senderId = $scope.srcId;
                chatitem.senderName = $scope.srcName;
                $greendao.saveObj('ChatListService', chatitem, function (data) {
                  $chatarr.updatechatdata(chatitem);
                  $rootScope.$broadcast('lastcount.update');
                }, function (err) {
                  // $ToastUtils.showToast(err + "数据保存失败");
                });
              }, function (err) {
                // $ToastUtils.showToast(err);
              });
            }, function (err) {
              // $ToastUtils.showToast(err);
            });
          }
        }
        //加滑动底部
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

    $scope.$on('msgs.error', function (event) {
      $scope.$apply(function () {
        $scope.groupmsgs = $mqtt.getQunliao();
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

    $scope.backSecondMenu = function () {
      $mqtt.clearMsgGroupCount();
      // $ToastUtils.showToast("无参进来的userid"+$scope.userId);
      //收到消息时先判断会话列表有没有这个用户
      //如果直接创建聊天到聊天详情界面，继续返回到主界面，而会话列表还没有该条会话，进行会话列表的item添加
      $greendao.queryData('ChatListService','where id =?',$scope.groupid,function (data) {
        // $ToastUtils.showToast(data.length+"收到消息时，查询chat表有无当前用户");
        if(data.length ===0){
         // alert("群聊没有该会话");
          $rootScope.isPersonSend='true';
          if ($rootScope.isPersonSend === 'true') {
            $chatarr.getIdChatName($scope.groupid,$scope.chatname);
            $chatarr.getAll($rootScope.isPersonSend,$scope.grouptype);
            // $ToastUtils.showToast($scope.items.length + "群聊长度");
            $scope.$on('chatarr.update', function (event) {
              $scope.$apply(function () {
                $scope.items = $chatarr.getAllData();
              });
            });
            $rootScope.isPersonSend = 'false';
          }
        }
      },function (err) {
        // $ToastUtils.showToast("收到未读消息时，查询chat列表"+err);
      });
      // alert("进行返回时"+$scope.groupid);
      $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.groupid, function (data) {
        if (data.length === 0) {
          // alert("无数据返回主界面1");
          $scope.lastText = '';//最后一条消息内容
          $scope.lastDate = 0;//最后一条消息的时间
          $scope.chatName = $scope.chatname;//对话框名称
          $scope.imgSrc = '';//最后一条消息的头像
          $scope.senderId='';//若没有最后一条消息，则将senderid=‘’
          $scope.senderName ='';//若没有最后一条数据，则将senderName=‘’
        } else {
          if(data[0].messagetype === "Image"){
            $scope.lastText = "[图片]";//最后一条消息内容
          }else if(data[0].messagetype === "LOCATION"){
            $scope.lastText = "[位置]";//最后一条消息内容
          }else {
            // alert("进来了吗？");
            $scope.lastText = data[0].message;//最后一条消息内容
          }
          $scope.lastDate = data[0].when;//最后一条消息的时间
          $scope.chatName = data[0].username;//对话框名称
          // alert("拿到消息"+$scope.chatName);
          $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
          $scope.senderId = data[0].senderid;
        }
       // alert("无参跳转用户名");
        $greendao.queryData('ChatListService', 'where id=?',$scope.groupid, function (data) {
          $scope.groupCount=$mqtt.getMsgGroupCount();
          // alert("无参跳转查询消息列表"+data.length);
          var chatitem = {};
          chatitem.id = data[0].id;
          if(!($scope.chatname === data[0].chatName)){
            chatitem.chatName = $scope.chatname;
            // alert("这次应该正确了把？"+chatitem.chatName);
          }else{
            chatitem.chatName = data[0].chatName;
          }
          // alert("拿到聊天名字"+chatitem.chatName);
          chatitem.imgSrc = data[0].imgSrc;
          chatitem.lastText = $scope.lastText;
          chatitem.count = $scope.groupCount;
          chatitem.isDelete = data[0].isDelete;
          chatitem.lastDate = $scope.lastDate;
          chatitem.chatType = data[0].chatType;
          chatitem.senderId =$scope.senderId,
            chatitem.senderName =$scope.chatName;
          $greendao.saveObj('ChatListService', chatitem, function (data) {
            // $ToastUtils.showToast("save success");
            $greendao.queryByConditions('ChatListService', function (data) {
              // alert("加载成功");
              $state.go("tab.message", {
                "id": $scope.groupid,
                "sessionid": $scope.chatName,
                "grouptype":$scope.grouptype
              });
            }, function (err) {
              // $ToastUtils.showToast(err + "加载全部数据失败");
            });
          }, function (err) {
            // $ToastUtils.showToast(err + "数据保存失败");
          });
        }, function (err) {
          // $ToastUtils.showToast(err + "查询聊天列表失败");
        });
      }, function (err) {
        // $ToastUtils.showToast(err + "数据离开失败");
      });
    }

    //当前聊天记录超过50条时，跳转到历史消息记录页面
    $scope.skipgroupmessagebox = function () {
      // $ToastUtils.showToast("正确进入聊天方法"+$scope.viewtitle+$scope.userId);
      $state.go("historyMessage", {
        "id":$scope.groupid,
        "ssid": $scope.chatname,
        "grouptype":$scope.grouptype
      });

    };


    // 点击按钮触发，或一些其他的触发条件
    $scope.resendgroupshow = function (topic, content, id,grouptype,localuser,localuserId,sqlid) {

      // 显示操作表
      $ionicActionSheet.show({
        buttons: [
          {text: '重新发送'},
          {text: '删除'},
        ],
        // destructiveText: '重新发送',
        // titleText: 'Modify your album',
        cancelText: '取消',
        buttonClicked: function (index) {
          // $ToastUtils.showToast(index);
          if (index === 0) {
            //消息发送失败重新发送成功时，页面上找出那条带叹号的message并删除，未能正确取值。
            // alert($mqtt.getQunliao().length);
            for(var i=0;i<$mqtt.getQunliao().length;i++){
              // alert(sqlid+i+"来了" );
              if($mqtt.getQunliao()[i]._id === sqlid){
                // alert("后"+$mqtt.getQunliao()[i]._id);
                $mqtt.getQunliao().splice(i, 1);
                break;
              }
            }
            $scope.sendSingleGroupMsg(topic, content, id,grouptype,localuser,localuserId,sqlid);
          } else if (index === 1) {

          }
          return true;
        }
      });

    };
    //:groupid/:chatname/:grouptype
    $scope.goGroupDetail=function (id,name,type,ismygroup) {
      $state.go('groupSetting',{
        'groupid':id,
        'chatname':name,
        'grouptype':type,
        'ismygroup':ismygroup
      });
    }
    $scope.godetail=function (userid) {
      $state.go('person',{
        'userId':userid
      });
    }


  })


  .controller('MessageCtrl', function ($scope, $http, $state, $mqtt, $chatarr, $stateParams, $rootScope, $greendao,$timeout,$contacts,$ToastUtils,$cordovaBarcodeScanner,   $location,$api) {
    // alert($location.path());
    $scope.a=false
    $scope.popadd=function () {
      if (!$scope.a){
        $scope.a=true
      }else {
        $scope.a=false
      }
    }
    $scope.shefalse=function () {
      $scope.a=false
    }
    //发起群聊
    $scope.createGroupChats=function () {
      var selectInfo={};
      //当创建群聊的时候先把登录的id和信息  存到数据库上面
      selectInfo.id=$scope.loginId;
      selectInfo.grade="0";
      selectInfo.isselected=true;
      selectInfo.type='user'
      $greendao.saveObj('SelectIdService',selectInfo,function (msg) {

      },function (err) {

      })

      $state.go('addnewpersonfirst',{
        "createtype":'single',
        "groupid":'0',
        "groupname":''
      });
    }




    //扫一扫
    $scope.saoyisao = function () {
      $scope.a=false
      $cordovaBarcodeScanner.scan().then(function(imageData) {
        $ToastUtils.showToast(imageData.text);
        $api.qrcodeLogin(imageData.text,function (msg) {
          $ToastUtils.showToast(msg)
        },function (msg) {
          $ToastUtils.showToast(msg)
        });
        // console.log("Barcode Format -> " + imageData.format);
        // console.log("Cancelled -> " + imageData.cancelled);
      }, function(error) {
        // $ToastUtils.showToast( error);
        //$ToastUtils.showToast(error)
      });
    };

    // //nfc
    // $scope.nfcaaa = function () {
    //  nfc.showSettings(function (msg) {
    //    alert(msg);
    //  },function (msg) {
    //    alert(msg);
    //  })
    //   $scope.tags=nfcService.tag;
    // }
    //  if (window.nfc) {
    //    nfc.bytesToHexString(input);
    //    alert()
    //  } else {
    //    input;
    //  }
    //  if (window.nfc) {
    //    nfc.bytesToString(input);
    //  } else {
    //    input;
    //  }


    //清表数据
    // $greendao.deleteAllData('ChatListService',function (data) {
    //   $ToastUtils.showToast(data);
    // },function (err) {
    //   $ToastUtils.showToast(err);
    // });
    /**
     * 注释主界面创建列表的代码(封闭入口)
     * 创建群组成功 以后点击直接进入群组/单人聊天界面
     */

    // $scope.userId = $stateParams.id;
    // $scope.userName = $stateParams.sessionid;
    // $scope.messageType = $stateParams.grouptype;
    // // $ToastUtils.showToast($scope.userId+"messageC"+$scope.userName+$scope.messageType);
    // if($rootScope.isGroupSend === 'true'){
    //   //若是从群聊那边传过来的，就调用service存储
    //   $grouparr.getGroupIdChatName($scope.userId,$scope.userName);
    //   $scope.items = $grouparr.getAllGroupList($rootScope.isGroupSend,$scope.messageType);
    //   // $ToastUtils.showToast($scope.items.length + "群聊长度");
    //   $scope.$on('groupchatarr.update', function (event) {
    //     $scope.$apply(function () {
    //       $scope.items = $chatarr.getAllGroupList($rootScope.isPersonSend,$scope.messageType);
    //     });
    //   });
    //   $rootScope.isGroupSend = 'false';
    //   // $ToastUtils.showToast("走这吗？"+$rootScope.isGroupSend);
    // }else if($rootScope.isPersonSend === 'true'){
    //   //若是从单聊那边创建聊天过来的，就调用service存储
    //   //获取单聊的对方的userid和username
    //   $chatarr.getIdChatName($scope.userId,$scope.userName);
    //   $scope.items = $chatarr.getAll($rootScope.isPersonSend,$scope.messageType);
    //   // $ToastUtils.showToast($scope.items.length + "danliao长度");
    //   $scope.$on('chatarr.update', function (event) {
    //     $scope.$apply(function () {
    //       $scope.items = $chatarr.getAll($rootScope.isPersonSend,$scope.messageType);
    //     });
    //   });
    //   $rootScope.isPersonSend = 'false';
    // }


    //如果不是创建聊天，就直接从数据库里取列表数据
    $greendao.queryByConditions('ChatListService',function (data) {
      // alert("创建群成功以后，有没有走这个方法"+data.length);
      $chatarr.setData(data);
      $scope.items=$chatarr.getAllData();
      // $ToastUtils.showToast($scope.items.length+"聊天列表长度");
    },function (err) {
      // $ToastUtils.showToast("按时间查询失败"+err);
    });
    $mqtt.arriveMsg("");

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        //当lastcount值变化的时候，进行数据库更新：将更改后的count的值赋值与unread，并将该条对象插入数据库并更新
        $scope.lastCount = $mqtt.getMsgCount();
        // 当群未读消息lastGroupCount数变化的时候
        $scope.lastGroupCount = $mqtt.getMsgGroupCount();
        // alert("是不是先拿到这个值"+$scope.lastGroupCount);
        $scope.firstUserId = $mqtt.getFirstReceiverSsid();
        $scope.receiverssid = $scope.firstUserId;
        $scope.chatName = $mqtt.getFirstReceiverChatName();
        $scope.firstmessageType = $mqtt.getMessageType();

        /**
         * 判断是单聊未读还是群聊未读
         */
        if ($scope.lastCount > 0 && $scope.firstmessageType ==='User') {
          // alert("进来单聊");
          //当监听到有消息接收的时候，去判断会话列表有无这条记录，有就将消息直接展示在界面上；无就创建会话列表
          // 接收者id
          // $scope.receiverssid=$mqtt.getFirstReceiverSsid();
          //收到消息时先判断会话列表有没有这个用户
          $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
            // $ToastUtils.showToast(data.length + "收到消息时，查询chat表有无当前用户");
            if (data.length === 0) {
              // alert("没有该会话");
              $rootScope.isPersonSend = 'true';
              if ($rootScope.isPersonSend === 'true') {
                $scope.messageType = $mqtt.getMessageType();
                // alert("会话列表聊天类型" + $scope.messageType);
                //往service里面传值，为了创建会话
                $chatarr.getIdChatName($scope.receiverssid, $scope.chatName);
                $chatarr.getAll($rootScope.isPersonSend, $scope.messageType);
                // $ToastUtils.showToast($scope.items.length + "长度");
                $scope.$on('chatarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.items = $chatarr.getAllData();
                  });
                });
                $rootScope.isPersonSend = 'false';
              }
            }
          }, function (err) {
            // $ToastUtils.showToast("收到未读消息时，查询chat列表" + err);
          });
          //取出与‘ppp’的聊天记录最后一条
          $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.receiverssid, function (data) {
            // $ToastUtils.showToast("未读消息时取出消息表中最后一条数据"+data.length);
            if(data[0].messagetype === "Image"){
              $scope.lastText = "[图片]";//最后一条消息内容
            }else if(data[0].messagetype === "LOCATION"){
              $scope.lastText = "[位置]";//最后一条消息内容
            }else {
              $scope.lastText = data[0].message;//最后一条消息内容
            }
            // alert("丧心病狂"+$scope.lastText);
            $scope.lastDate = data[0].when;//最后一条消息的时间
            // $ToastUtils.showToast($scope.chatName + "用户名1");
            $scope.srcName = data[0].username;//消息来源人名字
            $scope.srcId = data[0].senderid;//消息来源人id
            $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
            //取出‘ppp’聊天对话的列表数据并进行数据库更新
            $greendao.queryData('ChatListService', 'where id=?', $scope.receiverssid, function (data) {
              $scope.unread = $scope.lastCount;
              // $ToastUtils.showToast("未读消息时取出消息表中最后一条数据" + data.length + $scope.unread);
              var chatitem = {};
              chatitem.id = data[0].id;
              chatitem.chatName = data[0].chatName;
              chatitem.imgSrc = $scope.imgSrc;
              chatitem.lastText = $scope.lastText;
              chatitem.count = $scope.unread;
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = $scope.lastDate;
              chatitem.chatType = data[0].chatType;
              chatitem.senderId = $scope.srcId;
              chatitem.senderName = $scope.srcName;
              $greendao.saveObj('ChatListService', chatitem, function (data) {
                // alert("走不走");
                $chatarr.updatechatdata(chatitem);
                $rootScope.$broadcast('lastcount.update');
              }, function (err) {
                // $ToastUtils.showToast(err + "数据保存失败");
              });
            }, function (err) {
              // $ToastUtils.showToast(err);
            });
          }, function (err) {
            // $ToastUtils.showToast(err);
          });
        } else if ($scope.lastGroupCount > 0) {
          // alert("进来群聊id"+$scope.receiverssid);
          // $ToastUtils.showToast("监听群未读消息数量"+$scope.lastGroupCount+$scope.receiverssid);
          /**
           * 1.首先查询会话列表是否有该会话(chatListService)，若无，创建会话；若有进行第2步
           * 2.查出当前群聊的最后一条聊天记录(messageService)
           * 3.查出会话列表的该条会话，将取出的数据进行赋值(chatListService)
           * 4.保存数据(chatListService)
           * 5.数据刷新(chatListService)按时间降序排列展示
           */
          $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
            // alert(data.length+"收到消息时，查询chat表有无当前用户");
            if (data.length === 0) {
              // alert("群聊主界面没有该会话");
              $rootScope.isPersonSend = 'true';
              if ($rootScope.isPersonSend === 'true') {
                $scope.messageType = $mqtt.getMessageType();
                //获取消息来源人
                $scope.chatName = $mqtt.getFirstReceiverChatName();//取到消息来源人，准备赋值，保存chat表
                // alert("群组会话列表聊天类型"+$scope.messageType+$scope.chatName);
                //根据群组id获取群名称
                $greendao.queryData('GroupChatsService', 'where id =?', $scope.receiverssid, function (data) {
                  // alert(data[0].groupName);
                  $rootScope.groupName = data[0].groupName;
                  //往service里面传值，为了创建会话
                  $chatarr.getIdChatName($scope.receiverssid, $scope.groupName);
                  $chatarr.getAll($rootScope.isPersonSend, $scope.messageType);
                  // alert($scope.items.length + "长度");
                  $scope.$on('chatarr.update', function (event) {
                    $scope.$apply(function () {
                      // alert("进来了刷新");
                      $scope.items=$chatarr.getAllData();
                      /**
                       *  若会话列表有该群聊，取出该会话最后一条消息，并显示在会话列表上
                       *
                       */
                      // $ToastUtils.showToast("群组长度" + $scope.items.length);
                      $scope.savemsglastmsg();
                    });
                  });
                  $rootScope.isPersonSend = 'false';
                }, function (err) {
                  // $ToastUtils.showToast(err + "查询群组对应关系");
                });
              }
            }else{
              $scope.savemsglastmsg();
            }
          }, function (err) {
            // $ToastUtils.showToast("收到群组未读消息时，查询chat列表" + err);
          });
          $scope.savemsglastmsg=function () {
            $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.receiverssid, function (data) {
              $scope.lastText = data[0].message;//最后一条消息内容
              $scope.lastDate = data[0].when;//最后一条消息的时间
              $scope.srcName = data[0].username;//消息来源人名字
              $scope.srcId = data[0].senderid;//消息来源人id
              // alert($scope.srcName + "消息来源人" + $scope.srcId + $scope.lastText);
              $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
              /**
               * 当群已经存在时，必须重新取一次群名称，不然会报错
               */
              $greendao.queryData('GroupChatsService', 'where id =?', $scope.receiverssid, function (data) {
                $rootScope.groupName=data[0].groupName;
                // alert("能拿到数据吗?"+$rootScope.groupName);
              },function (err) {

              });
              //取出id聊天对话的列表数据并进行数据库更新
              $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
                $scope.unread = $scope.lastGroupCount;
                // alert("未读群消息时取出消息表中最后一条数据" + data.length + $scope.unread);
                var chatitem = {};
                chatitem.id = data[0].id;
                if($rootScope.groupName === '' || $rootScope.groupName === undefined){
                    chatitem.chatName =$rootScope.groupName;
                    // alert("群名称："+chatitem.chatName);
                }else{
                  chatitem.chatName =data[0].chatName ;
                  // alert("群名称2222"+chatitem.chatName);
                }
                // $ToastUtils.showToast("第一次创建会话时保存的群聊名称"+chatitem.chatName);
                chatitem.imgSrc = data[0].imgSrc;
                chatitem.lastText = $scope.lastText;
                chatitem.count = $scope.unread;
                chatitem.isDelete = data[0].isDelete;
                chatitem.lastDate = $scope.lastDate;
                chatitem.chatType = data[0].chatType;
                chatitem.senderId = $scope.srcId;
                chatitem.senderName = $scope.srcName;
                $greendao.saveObj('ChatListService', chatitem, function (data) {
                  $chatarr.updatechatdata(chatitem);
                  $rootScope.$broadcast('lastcount.update');
                }, function (err) {
                  // $ToastUtils.showToast(err + "数据保存失败");
                });
              }, function (err) {
                // $ToastUtils.showToast(err);
              });
            }, function (err) {
              // $ToastUtils.showToast(err);
            });
          }
        }
        //加滑动底部
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

    $scope.$on('lastcount.update', function (event) {
      $scope.$apply(function () {
        // alert("进来数据刷新");
        $scope.items = $chatarr.getAllData();
      });
    });

    // $scope.$on('lastgroupcount.update', function (event) {
    //   $scope.$apply(function () {
    //     // $ToastUtils.showToast("响应数据刷新监听");
    //     $scope.items = $grouparr.getAllGroupChatList();
    // });
    //
    // });
    //进入单聊界面
    $scope.goDetailMessage = function (id, ssid,chatType) {
      $scope.a=false;
      // $ToastUtils.showToast("单聊界面"+id+ssid+chatType);
      $mqtt.clearMsgCount();
      $mqtt.clearMsgGroupCount();
      if(chatType === "User"){
        //进入聊天详情界面
        // $ToastUtils.showToast("进入单聊界面");
        $state.go('messageDetail',
          {
            "id": id,
            "ssid": ssid,
            "grouptype":chatType
          });

      }else if(chatType === "Dept"){
        // $ToastUtils.showToast("进入部门界面");
        // $mqtt.clearMsgGroupCount();
        // $scope.lastGroupCount = $mqtt.getMsgGroupCount();
        $state.go('messageGroup',{
          "id":id,
          "chatName":ssid,
          "grouptype":chatType,
          "ismygroup":false
        });
      }else if(chatType === "Group"){
        // $ToastUtils.showToast("进入群聊界面");
        // $mqtt.clearMsgGroupCount();
        // $scope.lastGroupCount = $mqtt.getMsgGroupCount();
        $greendao.queryData('GroupChatsService','where id =?',id,function (data) {

          $state.go('messageGroup',{
            "id":id,
            "chatName":ssid,
            "grouptype":chatType,
            "ismygroup":data[0].ismygroup,
          });

        },function (err) {

        });


      }

    };

    $scope.goSearch = function () {
      $scope.a=false;
      $state.go("searchmessage",{
        "UserIDSM":$scope.userId,
        "UserNameSM":$scope.userName
      });
    }


    $scope.$on('$ionicView.enter', function () {
      $contacts.loginInfo();
      $scope.$on('login.update', function (event) {
        $scope.$apply(function () {

          //部门id
          $scope.loginId=$contacts.getLoignInfo().userID;
          $scope.depid=$contacts.getLoignInfo();
          $scope.departmentId=$contacts.getLoignInfo().deptID;
          $contacts.loginDeptInfo($scope.departmentId);
        })
      });

      $scope.$on('logindept.update', function (event) {
        $scope.$apply(function () {

          //部门id
          $scope.deptinfo = $contacts.getloginDeptInfo();
          //部门群的信息会被放入
          var deptobj={};
          deptobj.id=$scope.departmentId;
          deptobj.groupName=$scope.deptinfo;
          deptobj.groupType='Dept';
          deptobj.ismygroup=false;
          $greendao.saveObj("GroupChatsService",deptobj,function (msg) {

          },function (err) {
            // $ToastUtils.showToast(err);
          })
        })
      });
    });

  })


  .controller('SettingAccountCtrl',function ($scope,$state,$stateParams,$greendao,$ToastUtils,$contacts) {

    //进入界面先清除数据库表
    $greendao.deleteAllData('SelectIdService',function (data) {

    },function (err) {

    })

    //取出聊天界面带过来的id和ssid
    $scope.userId=$stateParams.id;//对方用户id
    $scope.userName=$stateParams.ssid;//对方名字


    $scope.godetailaa=function () {
      $state.go('person',{
        'userId':$scope.userId
      });
    }

    $contacts.loginInfo();
    $scope.$on('login.update', function (event) {
      $scope.$apply(function () {
        //登录人员的id
        $scope.loginId=$contacts.getLoignInfo().userID;
        //部门id
        $scope.depid=$contacts.getLoignInfo().deptID;

      })
    });

    $scope.gohistoryMessage = function () {
      // $ToastUtils.showToast("要跳了")
      $state.go('historyMessage',{
        id:$scope.userId,
        ssid:$scope.userName
      });
    }
    if ($scope.userName.length>2){
      $scope.jiename=$scope.userName.substring(($scope.userName.length-2),$scope.userName.length);
    }else {
      $scope.jiename=$scope.userName
    }

    // $ToastUtils.showToast($scope.userId+"daiguolai"+$scope.userName);
    $scope.addFriend1=function () {
      $state.go("myAttention1");
    }
    //返回到聊天记录界面
    $scope.gobackmsgdetail=function (id,ssid) {
      // $ToastUtils.showToast("返回聊天界面"+id+ssid);
      $state.go('messageDetail',{
        id:id,
        ssid:ssid
      });
    };

    //清空聊天记录
    $scope.clearMsg=function (id,ssid) {
      //查询消息记录list
      // $greendao.deleteAllData('MessagesService',function (data) {
      //   $ToastUtils.showToast(data);
      // },function (err) {
      //   $ToastUtils.showToast(err);
      // });
      $greendao.queryData('MessagesService','where sessionid =?',$scope.userId,function (data) {
        $ToastUtils.showToast("删除成功");
        // $ToastUtils.showToast(data.length+"查询消息记录长度");
        for(var i=0;i<data.length;i++){
          var key=data[i]._id;
          // $ToastUtils.showToast("消息对象"+key);
          $greendao.deleteDataByArg('MessagesService',key,function (data) {
          },function (err) {
            // $ToastUtils.showToast(err+清空消息记录失败);
          });
        }
      },function (err) {
        // $ToastUtils.showToast(err+"查询所有记录失败");
      });

    };

    $scope.meizuo=function () {
      $ToastUtils.showToast("此功能暂未开发");

    }

    //添加人员功能
    $scope.addNewPerson=function () {
      $scope.addList=[];

      $scope.addList.push($scope.loginId);
      $scope.addList.push($scope.userId);

      for(var i=0;i<$scope.addList.length;i++){
        //当创建群聊的时候先把登录的id和信息  存到数据库上面
        var selectInfo={};
        selectInfo.id=$scope.addList[i];
        selectInfo.grade="0";
        selectInfo.isselected=true;
        selectInfo.type='user'
        $greendao.saveObj('SelectIdService',selectInfo,function (msg) {

        },function (err) {

        })
      }
      $state.go('addnewpersonfirst',{
        "createtype":'single',
        "groupid":'0',
        "groupname":''
      });



    }




  })

  .controller('historyMessageCtrl',function ($scope, $http, $state, $stateParams,$api,$historyduifang,$mqtt,$ToastUtils,$ionicHistory) {
    $scope.id = $stateParams.id;
    $scope.ssid = $stateParams.ssid;
    $scope.grouptype=$stateParams.grouptype;
    // $ToastUtils.showToast("从群聊界面跳转过来的"+$scope.grouptype);
    $mqtt.getUserInfo(function (msg) {
      $scope.UserID= msg.userID
    },function (msg) {

    });
    $scope.goSetting = function () {
      $ionicHistory.goBack();
      /**
       * 根据聊天类型跳转到相应的设置界面
       */
      // if($scope.grouptype === 'Dept' || $scope.grouptype === 'Group'){
      //   $state.go('groupSetting',{
      //     "id":$scope.id,
      //     "ssid":$scope.ssid,
      //     "grouptype":$scope.grouptype
      //   });
      // }else if($scope.grouptype === 'User'){
      //   $state.go('personalSetting',{
      //     "id":$scope.id,
      //     "ssid":$scope.ssid,
      //     "grouptype":$scope.grouptype
      //   });
      // }
    }
    $scope.totalpage=1
    $scope.dangqianpage=1;
    //总页数
    $api.getMsgCount("U", $scope.id,function (msg) {

      var mo = msg%10;
      if(mo === 0) {
        $scope.totalpage = msg / 10;
        if ($scope.totalpage === 0){
          $scope.totalpage=1;
        }
      } else {
        $scope.totalpage = (msg - mo) / 10 + 1;
      }

      // $scope.totalpage=msg/10+1   ;
      // $ToastUtils.showToast($scope.totalpage)
    },function (msg) {
      $ToastUtils.showToast("失败");
    });
    $historyduifang.getHistoryduifanga("U",$scope.id,1,10);
    $scope.$on('historymsg.duifang',function (event) {
      $scope.$apply(function () {
        $scope.historyduifangsss=$historyduifang.getHistoryduifangc().reverse();
      })
    });

    //下一页
    $scope.nextpage=function () {
      if ($scope.dangqianpage<$scope.totalpage){
        $scope.dangqianpage++;
        $historyduifang.getHistoryduifanga("U",$scope.id,$scope.dangqianpage,"10");
        $scope.$on('historymsg.duifang',function (event) {
          $scope.$apply(function () {
            $scope.historyduifangsss=$historyduifang.getHistoryduifangc().reverse();
          })
        });

      }else {
        $ToastUtils.showToast("已经到最后一页了")
      }
    }
    //上一页
    $scope.backpage=function () {
      if($scope.dangqianpage>1){
        $scope.dangqianpage--;
        $historyduifang.getHistoryduifanga("U",$scope.id,$scope.dangqianpage,"10");
        $scope.$on('historymsg.duifang',function (event) {
          $scope.$apply(function () {
            $scope.historyduifangsss=$historyduifang.getHistoryduifangc().reverse();
          })
        });


      }else {
        $ToastUtils.showToast("已经到第一页了");
      }
    }

  })

  .controller('groupSettingCtrl', function ($scope, $state, $stateParams,$ionicHistory,$ToastUtils,$api,$greendao,$group,$ionicLoading,$timeout) {

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });

    $scope.groupId = $stateParams.groupid;
    $scope.groupType = $stateParams.grouptype;
    $scope.ismygroup=$stateParams.ismygroup;

    $scope.ismygroupaaa=$stateParams.ismygroup+"";
    $scope.listM=[];
    $scope.listM.push('GN');
    $scope.listM.push('GT');
    $group.groupDetail($scope.groupType,$scope.groupId,$scope.listM);
    $scope.$on('groupdetail.update', function (event) {
      $scope.$apply(function () {
        $timeout(function () {
          $ionicLoading.hide();
          $scope.groupName=$group.getGroupDetail().groupName;

        });

      })
    });



    //
    $scope.goGroupPerson=function (id,name,type) {

      if(type=='Group'){
        $state.go('groupMember',{
          "groupid":id,
          "chatname":name,
          "grouptype":type,
          "ismygroup":$scope.ismygroup
        });
      }else {
        $state.go('groupDeptMember',{
          "groupid":id,
          "chatname":name,
          "grouptype":type
        });
      }
    };


    //解散群
    $scope.dissolveGroup=function (aa) {

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 100,
        showDelay: 0
      });

      $api.removeGroup($scope.groupId,function (msg) {

        $ionicLoading.hide();
        $greendao.deleteDataByArg('ChatListService',$scope.groupId,function (msg) {

          $state.go('tab.message',{
            "id":$scope.groupId,
            "sessionid":$scope.groupName,
            "grouptype":"Group"
          });

        },function (err) {
          // $ToastUtils.showToast(err)
        })

      },function (err) {
        $ToastUtils.showToast('解散群失败')
        $ionicLoading.hide();


      });
    }


    //修改群名称
    $scope.goGroupName=function (id,name) {
      $state.go('groupModifyName',{
        "groupid":id,
        "groupname":name
      });
    };

    $scope.backAny = function () {
      // alert("返回聊天界面"+$scope.groupName);
      $state.go('messageGroup',{
        "id":$scope.groupId,
        "chatName":$scope.groupName,
        "grouptype":$scope.groupType,
        "ismygroup":$scope.ismygroup,
      });
    };

    $scope.gohistoryMessagea = function () {
      // $ToastUtils.showToast("要跳了")
      $state.go('historymessagegroup',{
        grouptype:$scope.groupType,
        id:$scope.groupId
      });
    }

    $scope.meizuo=function () {
      $ToastUtils.showToast("此功能暂未开发");
    }

    //打开群公告界面
    $scope.groupNotice=function () {

      $state.go('groupNotice',{
        "groupid":$scope.groupId,
        "grouptype":$scope.groupType,
        "groupname":$scope.groupName,
        "ismygroup":$scope.ismygroup,
      });

    }

  })

  .controller('historymessagegroupCtrl',function ($scope, $http, $state, $stateParams,$api,$historyduifang,$mqtt,$ToastUtils,$ionicHistory) {
    $scope.groupid = $stateParams.id;
    // $scope.ssid = $stateParams.ssid;
    $scope.grouptype=$stateParams.grouptype;
    if($scope.grouptype=="Group"){
      $scope.grouptype="G"
    }
    if($scope.grouptype=="Dept"){
      $scope.grouptype="D"
    }
    // $ToastUtils.showToast("从群聊界面跳转过来的"+$scope.grouptype);
    $scope.totalpage=1
    $scope.dangqianpage=1;
    $mqtt.getUserInfo(function (msg) {
      $scope.UserID= msg.userID
    },function (msg) {

    });

    $scope.goSetting = function () {
      $ionicHistory.goBack();
    }

    $api.getMsgCount($scope.grouptype, $scope.groupid,function (msg) {

      var mo = msg%10;
      if(mo === 0) {
        $scope.totalpage = msg / 10;
        if ($scope.totalpage === 0){
          $scope.totalpage=1;
        }
      } else {
        $scope.totalpage = (msg - mo) / 10 + 1;
      }

      // $scope.totalpage=msg/10+1   ;
      // $ToastUtils.showToast($scope.totalpage)
    },function (msg) {
      $ToastUtils.showToast("失败");
    });

    $historyduifang.getHistoryduifanga($scope.grouptype,$scope.groupid,1,10);
    $scope.$on('historymsg.duifang',function (event) {
      $scope.$apply(function () {
        $scope.historyduifangsss=$historyduifang.getHistoryduifangc().reverse();
      })
    });

    //下一页
    $scope.nextpage=function () {
      if ($scope.dangqianpage<$scope.totalpage){
        $scope.dangqianpage++;
        $historyduifang.getHistoryduifanga($scope.grouptype,$scope.groupid,$scope.dangqianpage,"10");
        $scope.$on('historymsg.duifang',function (event) {
          $scope.$apply(function () {
            $scope.historyduifangsss=$historyduifang.getHistoryduifangc().reverse();
          })
        });

      }else {
        $ToastUtils.showToast("已经到最后一页了")
      }
    }
    //上一页
    $scope.backpage=function () {
      if($scope.dangqianpage>1){
        $scope.dangqianpage--;
        $historyduifang.getHistoryduifanga($scope.grouptype,$scope.groupid,$scope.dangqianpage,"10");
        $scope.$on('historymsg.duifang',function (event) {
          $scope.$apply(function () {
            $scope.historyduifangsss=$historyduifang.getHistoryduifangc().reverse();
          })
        });


      }else {
        $ToastUtils.showToast("已经到第一页了");
      }
    }

  })

  .controller('sendGelocationCtrl',function ($scope,$state,$ToastUtils,$cordovaGeolocation,$stateParams,$mqtt) {
    //取出聊天界面带过来的id和ssid
    $scope.topic=$stateParams.topic;
    $scope.userId=$stateParams.id;//对方用户id
    $scope.userName=$stateParams.ssid;//对方用户名
    $scope.localuser=$stateParams.localuser;//当前用户名
    $scope.localuserId=$stateParams.localuserId;//当前用户id
    $scope.sqlid=$stateParams.sqlid;//itemid
    $scope.grouptype=$stateParams.grouptype;//grouptype
    $scope.messagetype=$stateParams.messagetype;//消息类型
    // alert("拿到的数据"+$scope.userId+$scope.userName+$scope.localuser+$scope.localuserId+$scope.sqlid+$scope.grouptype+$scope.messagetype);

    var lat="";
    var long="";
    //获取定位的经纬度
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    // alert("进来了")
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
      lat  = position.coords.latitude+0.006954;//   39.952728
      long = position.coords.longitude+0.012647;//  116.329102
      // $ToastUtils.showToast("经度"+lat+"纬度"+long);
      var map = new BMap.Map("container"); // 创建地图实例
      var point = new BMap.Point(long, lat); // 创建点坐标
      map.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别
      map.addControl(new BMap.NavigationControl());
      map.addControl(new BMap.NavigationControl());
      map.addControl(new BMap.ScaleControl());
      map.addControl(new BMap.OverviewMapControl());
      map.addControl(new BMap.MapTypeControl());
      var marker = new BMap.Marker(point); // 创建标注
      map.addOverlay(marker); // 将标注添加到地图中
      marker.enableDragging();
      marker.addEventListener("dragend", function(e){           //116.341749   39.959682
        // alert("当前位置：" + e.point.lng + ", " + e.point.lat);// 116.341951   39.959632
        lat=e.point.lat;
        long=e.point.lng;
      })

      // 创建地理编码实例
      var myGeo = new BMap.Geocoder();
      // // 根据坐标得到地址描述
      // myGeo.getLocation(new BMap.Point(long, lat), function(result){
      //   if (result){
      //     alert(result.address);
      //   }
      // });
      //查询功能
      // var local = new BMap.LocalSearch(map, {
      //   renderOptions: {map: map, panel: "results"},
      //   pageCapacity: 10
      // });
      // local.searchInBounds(" ", map.getBounds());
      var mOption = {
        poiRadius : 100,           //半径为1000米内的POI,默认100米
        numPois : 5                //列举出50个POI,默认10个
      }
      $scope.weizhis=[];
      // map.addOverlay(new BMap.Circle(point,500));        //添加一个圆形覆盖物,圆圈，显示不显示都行
      myGeo.getLocation(point,
        function mCallback(rs){
          var allPois = rs.surroundingPois;       //获取全部POI（该点半径为100米内有6个POI点）
          for(var i=0;i<allPois.length;i++){
            // document.getElementById("panel").innerHTML += "<p style='font-size:12px;'>" + (i+1) + "、" + allPois[i].title + ",地址:" + allPois[i].address + "</p>";
            map.addOverlay(new BMap.Marker(allPois[i].point));

            $scope.$apply(function () {
              $scope.weizhis.push(allPois[i].address);
            });


          }
        },mOption
      );

    }, function(err) {
      $ToastUtils.showToast("请开启定位功能");
    });

    //返回
    $scope.gobackmsg=function () {
///:id/:ssid/:grouptype
      $state.go('messageDetail', {
        id: $scope.userId,
        ssid:$scope.userName,
        grouptype:$scope.groupType,
      });
    }

    //发送
    $scope.sendgeloction=function () {
      // alert("有没有进来发送方法"+$scope.topic+$scope.grouptype);
      // var path;
      // $mqtt.getIconDir(function (data) {
      //   path=data;
      //   alert("存储截图路径"+path);
      // },function (err) {
      //
      // });
      var url = new Date().getTime()+"";
      navigator.screenshot.save(function(error,res){
        // alert("进不进截屏");
        if(error){
          console.error(error);
        }else{
          // alert('ok'+res.filePath); //should be path/to/myScreenshot.jpg
          $scope.screenpath=res.filePath;
          $mqtt.getMqtt().getTopic($scope.topic, $scope.grouptype, function (userTopic) {
            // alert("单聊topic"+userTopic+$scope.grouptype);
            $scope.content=long+","+lat+","+$scope.screenpath;
            // alert("1231321"+userTopic+$scope.grouptype+$scope.content);
            $scope.suc = $mqtt.sendMsg(userTopic, $scope.content, $scope.userId,$scope.localuser,$scope.localuserId,$scope.sqlid,$scope.messagetype,'');
            $scope.send_content = "";
            keepKeyboardOpen();
          }, function (msg) {
          });
        }
      },'jpg',100,url);
      $state.go('messageDetail', {
        id: $scope.userId,
        ssid:$scope.userName,
        grouptype:$scope.groupType,
        longitude:long,
        latitude:lat
      });
    }

  })

  .controller('mapdetailCtrl',function ($scope,$state,$ToastUtils,$cordovaGeolocation,$stateParams) {
    $scope.latitude=$stateParams.latitude;
    $scope.longitude=$stateParams.longitude;
    $scope.userId=$stateParams.id;//对方用户id
    $scope.userName=$stateParams.ssid;//对方用户名
    $scope.grouptype=$stateParams.grouptype;//grouptype
    // alert("取到经纬度"+$scope.latitude+"==="+$scope.longitude);
    // var lat="";
    // var long="";
    //获取定位的经纬度
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    // alert("进来了")
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
      // lat  = position.coords.latitude+0.006954;//   39.952728
      // long = position.coords.longitude+0.012647;//  116.329102
      // $ToastUtils.showToast("经度"+lat+"纬度"+long);
      var map = new BMap.Map("container"); // 创建地图实例
      var point = new BMap.Point($scope.longitude, $scope.latitude); // 创建点坐标
      map.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别
      map.addControl(new BMap.NavigationControl());
      map.addControl(new BMap.NavigationControl());
      map.addControl(new BMap.ScaleControl());
      map.addControl(new BMap.OverviewMapControl());
      map.addControl(new BMap.MapTypeControl());
      var marker = new BMap.Marker(point); // 创建标注
      map.addOverlay(marker); // 将标注添加到地图中
      marker.enableDragging();
      marker.addEventListener("dragend", function(e){           //116.341749   39.959682
        // alert("当前位置：" + e.point.lng + ", " + e.point.lat);// 116.341951   39.959632
        lat=e.point.lat;
        long=e.point.lng;
      })

      // // 创建地理编码实例
      // var myGeo = new BMap.Geocoder();
      // // 根据坐标得到地址描述
      // myGeo.getLocation(new BMap.Point(long, lat), function(result){
      //   if (result){
      //     alert(result.address);
      //   }
      // });

    }, function(err) {
      $ToastUtils.showToast("请开启定位功能");
    });

    //返回
    $scope.gobackmsg=function () {
      $state.go('messageDetail', {
        id: $scope.userId,
        ssid:$scope.userName,
        grouptype:$scope.groupType
      });
    }

  })

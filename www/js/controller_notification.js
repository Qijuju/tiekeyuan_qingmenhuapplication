/**
 * Created by Administrator on 2016/9/8.
 */
angular.module('notification.controllers', ['ionic', 'ionic-datepicker'])


  .controller('notificationCtrl', function ($scope,$state,$mqtt,$ToastUtils,$mqtt,$notifyarr,$greendao,$rootScope,$chatarr) {
    //如果不是监听未读通知，就查询数据库展示通知列表
    $greendao.queryByConditions('NotifyListService',function (data) {
      // alert("通知列表的长度"+data.length);
      $notifyarr.setNotifyData(data);
      $scope.syslist=$notifyarr.getAllNotifyData();
    },function (err) {
      $ToastUtils.showToast("查询系统通知列表"+err);
    });

    //监听系统通知和报警信息、、还要继续操作
    $scope.$on('notify.update', function (event) {
      $scope.$apply(function () {
        $scope.syscount=$mqtt.getSyscount();
        $scope.id=$mqtt.getFirstReceiverSsid();
        $scope.alarmname=$mqtt.getFirstReceiverChatName();
        $scope.type=$mqtt.getMessageType();
        /**
         * 先判断有没有该会话，没有就创建
         */
        if($scope.syscount >0){
          // alert("收到系统通知并且保存成功"+$scope.syscount+"消息类型"+$scope.type+$scope.id);
          $greendao.queryData('NotifyListService','where id =?',$scope.id,function (data) {
            // alert("系统通知会话列表长度"+data.length);
            if(data.length === 0){
              // alert("没有系统通知会话");
              $notifyarr.getNotifyIdChatName($scope.id, $scope.alarmname);
              $rootScope.isNotifySend ='true';
              if($rootScope.isNotifySend === 'true'){
                // alert("进入创建会话段");
                $notifyarr.createNotifyData($rootScope.isNotifySend, $scope.type);
                $scope.$on('notifyarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.syslist=$notifyarr.getAllNotifyData();
                    // alert("监听以后的长度"+$scope.syslist.length);
                  });
                });
                $rootScope.isNotifySend = 'false';
              }
            }
          },function (err) {

          });

          //取出与‘ppp’的聊天记录最后一条
          $greendao.queryData('SystemMsgService', 'where sessionid =? order by "when" desc limit 0,1', $scope.id, function (data) {
            // alert("未读消息时取出消息表中最后一条数据"+data.length);
            $scope.lastText = data[0].message;//最后一条消息内容
            // alert("最后一条消息"+$scope.lastText);
            $scope.lastDate = data[0].when;//最后一条消息的时间id
            $scope.srcName = data[0].username;//消息来源人名字
            $scope.srcId = data[0].senderid;//消息来源人id
            // alert($scope.srcName + "用户名1"+$scope.srcId);
            $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
            //取出‘ppp’聊天对话的列表数据并进行数据库更新
            $greendao.queryData('NotifyListService', 'where id=?', $scope.id, function (data) {
              $scope.unread = $scope.syscount;
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
              chatitem.senderName =$scope.srcName;
              $greendao.saveObj('NotifyListService', chatitem, function (data) {
                // alert("保存成功方法"+data.length);
                $notifyarr.updatelastData(chatitem);
                $rootScope.$broadcast('lastsyscount.update');
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
        //加滑动底部
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      });
    });
    $scope.gonotificationDetail = function (id,chatName,chatType) {
      $state.go("notificationDetail",{
        "id":id,
        "name":chatName,
        "type":chatType
      });
    }


    /**
     * 通知最后一条信息展示完成以后在列表界面进行刷新
     */
    $scope.$on('lastsyscount.update', function (event) {
      $scope.$apply(function () {
        // alert("进来数据刷新");
        $scope.syslist=$notifyarr.getAllNotifyData();
      });

    });


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
                      $scope.savenotifylastmsg();
                    });
                  });
                  $rootScope.isPersonSend = 'false';
                }, function (err) {
                  // $ToastUtils.showToast(err + "查询群组对应关系");
                });
              }
            }else{
              $scope.savenotifylastmsg();
            }
          }, function (err) {
            // $ToastUtils.showToast("收到群组未读消息时，查询chat列表" + err);
          });
          $scope.savenotifylastmsg=function () {
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
  })


  //单个系统通知详情界面控制器
.controller('notificationDetailCtrl', function ($scope,$state,$greendao,$mqtt,$notifyarr,$rootScope,$stateParams) {
  /**
   * 从通知会话列表跳转带参
   */
  $scope.id=$stateParams.id;
  $scope.chatName=$stateParams.name;
  $scope.chatType=$stateParams.type;
  // alert("跳转界面"+$scope.id+$scope.chatName);
  $greendao.queryData('SystemMsgService','where sessionid =? limit 0,10',$scope.id,function (data) {
    // alert("进来通知详情界面"+data.length);
    $scope.sysmsglist=data;
  },function (err) {
    $ToastUtils.showToast(err+"查询报警信息失败");
  });
  //监听系统通知和报警信息
  $scope.$on('notify.update', function (event) {
    $scope.$apply(function () {
      $scope.syscount=$mqtt.getSyscount();
      $scope.fisrtid=$mqtt.getFirstReceiverSsid();
      $scope.alarmname=$mqtt.getFirstReceiverChatName();
      // alert("msg界面"+$scope.fisrtid+$scope.alarmname);
      $scope.type=$mqtt.getMessageType();
      /**
       * 先判断有没有该会话，没有就创建
       */
      if($scope.syscount >0){
        $greendao.queryData('NotifyListService','where id =?',$scope.fisrtid,function (data) {
          // alert("系统通知会话列表长度"+data.length);
          if(data.length === 0){
            $notifyarr.getNotifyIdChatName($scope.fisrtid, $scope.alarmname);
            $rootScope.isNotifySend ='true';
            if($rootScope.isNotifySend === 'true'){
              $notifyarr.createNotifyData($rootScope.isNotifySend, $scope.type);
              // $ToastUtils.showToast($scope.items.length + "长度");
              $scope.$on('notifyarr.update', function (event) {
                $scope.$apply(function () {
                  $scope.syslist=$notifyarr.getAllNotifyData();
                });
              });
              $rootScope.isNotifySend = 'false';
            }
          }
        },function (err) {

        });

        //取出与‘ppp’的聊天记录最后一条
        $greendao.queryData('SystemMsgService', 'where sessionid =? order by "when" desc limit 0,1', $scope.fisrtid, function (data) {
          // $ToastUtils.showToast("未读消息时取出消息表中最后一条数据"+data.length);
          $scope.lastText = data[0].message;//最后一条消息内容
          $scope.lastDate = data[0].when;//最后一条消息的时间id
          $scope.srcName = data[0].username;//消息来源人名字
          $scope.srcId = data[0].senderid;//消息来源人id
          // alert($scope.srcName + "用户名1"+$scope.srcId);
          $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
          //取出‘ppp’聊天对话的列表数据并进行数据库更新
          $greendao.queryData('NotifyListService', 'where id=?', $scope.fisrtid, function (data) {
            $scope.unread = $scope.syscount;
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
            chatitem.senderName =$scope.srcName;
            $greendao.saveObj('NotifyListService', chatitem, function (data) {
              // $greendao.queryByConditions('NotifyListService', function (data) {
                $notifyarr.updatelastData(chatitem);
                $rootScope.$broadcast('lastsyscount.update');
              // }, function (err) {
              //
              // });
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
      //加滑动底部
      $timeout(function () {
        viewScroll.scrollBottom();
      }, 100);
    });
  });
  $scope.goback = function () {
    $mqtt.clearSysCount();
    // $ToastUtils.showToast("无参进来的userid"+$scope.userId);
    // alert("id-======="+$scope.id);
    $greendao.queryData('SystemMsgService', 'where sessionid =? order by "when" desc limit 0,1', $scope.id, function (data) {
      if (data.length === 0) {
        // alert("无数据返回主界面1");
        $scope.lastText = '';//最后一条消息内容
        $scope.lastDate = 0;//最后一条消息的时间
        $scope.chatName = $scope.chatName;//对话框名称
        $scope.imgSrc = '';//最后一条消息的头像
        $scope.srcId='';//若没有最后一条消息，则将senderid=‘’
        $scope.srcName ='';//若没有最后一条数据，则将senderName=‘’
      } else {
        // alert("有数据返回通知界面1");
        $scope.lastText = data[0].message;//最后一条消息内容
        $scope.lastDate = data[0].when;//最后一条消息的时间
        $scope.chatName = data[0].chatName;//对话框名称
        $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
        $scope.srcName = data[0].username;//消息来源人名字
        $scope.srcId = data[0].senderid;//消息来源人id
      }
      // $ToastUtils.showToast("无参跳转用户名"+$scope.userId);
      $greendao.queryData('NotifyListService', 'where id=?', $scope.id, function (data) {
        // alert("跳转查询消息列表"+data.length);
        var chatitem = {};
        chatitem.id = data[0].id;
        chatitem.chatName = data[0].chatName;
        chatitem.imgSrc = $scope.imgSrc;
        chatitem.lastText = $scope.lastText;
        chatitem.count = $mqtt.getSyscount();
        chatitem.isDelete = data[0].isDelete;
        chatitem.lastDate = $scope.lastDate;
        chatitem.chatType = data[0].chatType;
        chatitem.senderId = $scope.srcId;
        chatitem.senderName = $scope.srcName;
        $greendao.saveObj('NotifyListService', chatitem, function (data) {
          // alert("save success");
          $greendao.queryByConditions('NotifyListService', function (data) {
            // alert("加载成功");
            $state.go("tab.notification", {
              "id": $scope.id,
              "name": $scope.chatName,
              "type":$scope.chatType
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

})

  .controller('notificationsCtrl', function ($scope,$state,$ToastUtils,$ionicSlideBoxDelegate,ionicDatePicker,$mqtt,$greendao,$notifyarr,$rootScope,$slowarr) {
    $scope.index = 0;
    $scope.go = function(index){
      $ionicSlideBoxDelegate.slide(index);
    }
    $scope.go_changed=function(index){
      //第一个页面index=0,第二个页面index=0，第三个页面index=0
      if (index==1){//当选择第二个页面也就是时间页面的时候调用时间选择器
        $scope.index =1;
        $scope.openDatePicker();
        document.getElementById("button1").style.backgroundColor="#ffffff";
        document.getElementById("button2").style.backgroundColor="#6c9aff";
        document.getElementById("button3").style.backgroundColor="#ffffff"
      }
      if(index==0){
        $scope.index =0;
        document.getElementById("button1").style.backgroundColor="#6c9aff";
        document.getElementById("button2").style.backgroundColor="#ffffff";
        document.getElementById("button3").style.backgroundColor="#ffffff"
      }
      if(index==2){
        $scope.index =2;
        document.getElementById("button1").style.backgroundColor="#ffffff";
        document.getElementById("button2").style.backgroundColor="#ffffff";
        document.getElementById("button3").style.backgroundColor="#6c9aff"
      }
    }
    $scope.timeaa = "";
   //日期选择器
    var ipObj1 = {
      callback: function (val) {  //Mandatory
       // alert(val)//点击set返回的日期 1439676000000这个格式的
        //根据时间划分
        $greendao.queryDataByDate(val,'Level_1',function (data) {
          // alert("紧急通知列表的长度"+data.length);
          $notifyarr.setNotifyData(data);
          $scope.fastlist=$notifyarr.getAllNotifyData();
        },function (err) {
          $ToastUtils.showToast("查询系统通知列表"+err);
        });

        /**
         * 没有未读时从数据库取数据（一般通知）
         */
        $greendao.querySlowDataByDate(val,'Common',function (data) {
          // alert("一般通知列表的长度"+data.length);
          $slowarr.setNotifyData(data);
          $scope.slowlist=$slowarr.getAllNotifyData();
        },function (err) {
          $ToastUtils.showToast("查询系统通知列表"+err);
        });
        $scope.timeaa=val;
        $scope.go(0);
      },
      disabledDates: [            //Optional
        new Date(2016, 2, 16),
        new Date(2015, 3, 16),
        new Date(2015, 4, 16),
        new Date(2015, 5, 16),
        new Date('Wednesday, August 12, 2015'),
        new Date("08-16-2016"),
        new Date(1439676000000)
      ],
      from: new Date(2012, 1, 1), //日期的范围从什么什么时候开始
      to: new Date(2020, 10, 30), //日期的范围从什么什么时候结束
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      disableWeekdays: [0],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };

    $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(ipObj1);
    };

    /**
     * 1.收到通知时判断类型，然后根据紧急程度划分2个数组(类似群组和单聊、用两个count监听)service
     * 2.根据时间判断，从紧急里面取时间数组，一般里面取时间数组(用两个count监听)
     * 3.根据模块划分，从紧急里面取模块数组，一般里面取模块数组(用两个count监听)
     * 4.从数据库取出紧急和一般的通知消息
     */
    /**
     * 没有未读时从数据库取数据（紧急通知）
     */
      //根据紧急程度划分
      $greendao.queryData('NotifyListService','where CHAT_TYPE =? ','Level_1',function (data) {
        // alert("紧急通知列表的长度"+data.length);
        $notifyarr.setNotifyData(data);
        $scope.fastlist=$notifyarr.getAllNotifyData();
      },function (err) {
        $ToastUtils.showToast("查询系统通知列表"+err);
      });

      /**
       * 没有未读时从数据库取数据（一般通知）
       */
      $greendao.queryData('SlowNotifyListService','where CHAT_TYPE =? ','Common',function (data) {
        // alert("一般通知列表的长度"+data.length);
        $slowarr.setNotifyData(data);
        $scope.slowlist=$slowarr.getAllNotifyData();
      },function (err) {
        $ToastUtils.showToast("查询系统通知列表"+err);
      });

      /**
       * 根据应用划分
       */
      $greendao.loadAllData('ModuleCountService',function (data) {
        // alert("模块应用列表的长度"+data.length);
        $scope.applist=data;
      },function (err) {

      });

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
                      $scope.savenotifylastmsg();
                    });
                  });
                  $rootScope.isPersonSend = 'false';
                }, function (err) {
                  // $ToastUtils.showToast(err + "查询群组对应关系");
                });
              }
            }else{
              $scope.savenotifylastmsg();
            }
          }, function (err) {
            // $ToastUtils.showToast("收到群组未读消息时，查询chat列表" + err);
          });
          $scope.savenotifylastmsg=function () {
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


      /**
       * 从数据库取出当前应用的紧急和一般通知未读数量
       * @param id
       */
      // $scope.getCountByDao=function (id) {
      //   $greendao.queryData('NotifyListService', 'where id=?',$scope.id,function (data) {
      //     if(data.length>0){
      //       $scope.fastcount=data[0].count;
      //       alert("公文处理紧急count随机测试紧急"+$scope.fastcount);
      //     }
      //     $greendao.queryData('SlowNotifyListService', 'where id=?',$scope.id,function (data) {
      //       if(data.length>0){
      //         $scope.slowcount=data[0].count;
      //         alert("公文处理一般count随机测试一般"+$scope.slowcount);
      //       }
      //       $scope.oacount=parseInt($scope.fastcount)+parseInt($scope.slowcount);
      //       $mqtt.setOaCount($scope.oacount);
      //       alert("0000000公文处理count"+$scope.oacount);
      //       $rootScope.$broadcast('appnotify.update');
      //     },function (err) {
      //     });
      //   },function (err) {
      //   });
      // }
    //从数据库取当前应用的count值
    $scope.sendAPPCount=function (id) {
      switch (id){
        case '1':
          // alert("进来了");
          $greendao.queryData('NotifyListService', 'where id=?',$scope.id,function (data) {
            if(data.length>0){
              $scope.fastcount=data[0].count;
              // alert("公文处理紧急count随机测试紧急"+$scope.fastcount);
            }else{
              $scope.fastcount =0;
            }
            $greendao.queryData('SlowNotifyListService', 'where id=?',$scope.id,function (data) {
              if(data.length>0){
                $scope.slowcount=data[0].count;
                // alert("公文处理一般count随机测试一般"+$scope.slowcount);
              }else{
                $scope.slowcount =0;
              }
              $scope.oacount=parseInt($scope.fastcount)+parseInt($scope.slowcount);
              $mqtt.setOaCount($scope.oacount);
              // alert("0000000公文处理count"+$scope.oacount);
              $rootScope.$broadcast('appnotify.update');
            },function (err) {
            });
          },function (err) {
          });
          break;
        case '15':
          $greendao.queryData('NotifyListService', 'where id=?',$scope.id,function (data) {
            if(data.length>0){
              $scope.fastcount=data[0].count;
              // alert("拌合站紧急count随机测试紧急"+$scope.fastcount);
            }else{
              $scope.fastcount =0;
            }
            $greendao.queryData('SlowNotifyListService', 'where id=?',$scope.id,function (data) {
              if(data.length>0){
                $scope.slowcount=data[0].count;
                // alert("拌合站一般count随机测试一般"+$scope.slowcount);
              }else{
                $scope.slowcount =0;
              }
              $scope.bhzcount=parseInt($scope.fastcount)+parseInt($scope.slowcount);
              $mqtt.setBhzCount($scope.bhzcount);
              // alert("拌合站count"+$scope.bhzcount);
              $rootScope.$broadcast('appnotify.update');
            },function (err) {
            });
          },function (err) {
          });
          break;
        case '16':
          $greendao.queryData('NotifyListService', 'where id=?',$scope.id,function (data) {
            if(data.length>0){
              $scope.fastcount=data[0].count;
              // alert("试验室紧急count随机测试紧急"+$scope.fastcount);
            }else{
              $scope.fastcount =0;
            }
            $greendao.queryData('SlowNotifyListService', 'where id=?',$scope.id,function (data) {
              if(data.length>0){
                $scope.slowcount=data[0].count;
                // alert("试验室一般count随机测试一般"+$scope.slowcount);
              }else{
                $scope.slowcount =0;
              }
              $scope.sycount=parseInt($scope.fastcount)+parseInt($scope.slowcount);
              $mqtt.setSyCount($scope.sycount);
              // alert("试验室count"+$scope.sycount);
              $rootScope.$broadcast('appnotify.update');
            },function (err) {
            });
          },function (err) {
          });
          break;
        case '17':
          $greendao.queryData('NotifyListService', 'where id=?',$scope.id,function (data) {
            if(data.length>0){
              $scope.fastcount=data[0].count;
              // alert("沉降观测紧急count随机测试紧急"+$scope.fastcount);
            }else{
              $scope.fastcount =0;
            }
            $greendao.queryData('SlowNotifyListService', 'where id=?',$scope.id,function (data) {
              if(data.length>0){
                $scope.slowcount=data[0].count;
                // alert("沉降观测一般count随机测试一般"+$scope.slowcount);
              }else{
                $scope.slowcount =0;
              }
              $scope.cjgccount=parseInt($scope.fastcount)+parseInt($scope.slowcount);
              $mqtt.setCjgcCount($scope.cjgccount);
              // alert("沉降观测count"+$scope.cjgccount);
              $rootScope.$broadcast('appnotify.update');
            },function (err) {
            });
          },function (err) {
          });
          break;
      }
    }


    //先监听未读通知消息
    $scope.$on('newnotify.update', function (event) {
      $scope.$apply(function () {
        $scope.fastcount=$mqtt.getFastcount();
        $scope.slowcount=$mqtt.getSlowcount();
        $scope.id=$mqtt.getFirstReceiverSsid();
        $scope.alarmname=$mqtt.getFirstReceiverChatName();
        $scope.type=$mqtt.getMessageType();
        if($scope.fastcount >0 && $scope.type === 'Level_1'){
          // alert("收到紧急系统通知并且保存成功"+$scope.fastcount+"消息类型"+$scope.type+$scope.id);
          $greendao.queryData('NotifyListService','where id =?',$scope.id,function (data) {
            // alert("系统通知会话列表长度"+data.length);
            if(data.length === 0){
              // alert("没有系统通知会话");
              $notifyarr.getNotifyIdChatName($scope.id, $scope.alarmname);
              $rootScope.isNotifySend ='true';
              if($rootScope.isNotifySend === 'true'){
                // alert("进入创建会话段");
                $notifyarr.createNotifyData($rootScope.isNotifySend, $scope.type);
                $scope.$on('notifyarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.fastlist=$notifyarr.getAllNotifyData();
                    // alert("监听以后的长度"+$scope.fastlist.length);
                  });
                });
                $rootScope.isNotifySend = 'false';
              }
            }
          },function (err) {

          });

          //取出与‘ppp’的聊天记录最后一条
          $greendao.queryData('SystemMsgService', 'where sessionid =? order by "when" desc limit 0,1', $scope.id, function (data) {
            // alert("未读消息时取出消息表中最后一条数据"+data.length);
            $scope.lastText = data[0].message;//最后一条消息内容
            // alert("最后一条消息"+$scope.lastText);
            $scope.lastDate = data[0].when;//最后一条消息的时间id
            $scope.srcName = data[0].username;//消息来源人名字
            $scope.srcId = data[0].senderid;//消息来源人id
            // alert($scope.srcName + "用户名1"+$scope.srcId);
            $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
            $scope.msglevel=data[0].msglevel;//紧急程度
            //取出‘ppp’聊天对话的列表数据并进行数据库更新
            $greendao.queryData('NotifyListService', 'where id=?', $scope.id, function (data) {
              $scope.unread = $scope.fastcount;
              // $ToastUtils.showToast("未读消息时取出消息表中最后一条数据" + data.length + $scope.unread);
              var chatitem = {};
              chatitem.id = data[0].id;
              chatitem.chatName = data[0].chatName;
              chatitem.imgSrc = $scope.imgSrc;
              chatitem.lastText = $scope.lastText;
              chatitem.count = $scope.unread;
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = $scope.lastDate;
              chatitem.chatType = $scope.msglevel;
              chatitem.senderId = $scope.srcId;
              chatitem.senderName =$scope.srcName;
              $greendao.saveObj('NotifyListService', chatitem, function (data) {
                // alert("保存成功方法"+data.length);
                $notifyarr.updatelastData(chatitem);
                $rootScope.$broadcast('lastfastcount.update');
                $scope.sendAPPCount($scope.id);
              }, function (err) {
                // $ToastUtils.showToast(err + "数据保存失败");
              });
            }, function (err) {
              // $ToastUtils.showToast(err);
            });
          }, function (err) {
            // $ToastUtils.showToast(err);
          });
        }else if($scope.slowcount >0 && $scope.type === 'Common'){
          // alert("收到一般系统通知并且保存成功"+$scope.slowcount+"消息类型"+$scope.type+$scope.id);
          $greendao.queryData('SlowNotifyListService','where id =?',$scope.id,function (data) {
            // alert("系统通知会话列表长度"+data.length);
            if(data.length === 0){
              // alert("没有一般通知会话");
              $slowarr.getNotifyIdChatName($scope.id, $scope.alarmname);
              $rootScope.isNotifySend ='true';
              if($rootScope.isNotifySend === 'true'){
                // alert("进入创建会话段");
                $slowarr.createNotifyData($rootScope.isNotifySend, $scope.type);
                $scope.$on('slowarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.slowlist=$slowarr.getAllNotifyData();
                    // alert("监听以后的长度"+$scope.slowlist.length);
                  });
                });
                $rootScope.isNotifySend = 'false';
              }
            }
          },function (err) {

          });

          //取出与‘ppp’的聊天记录最后一条
          $greendao.queryData('SystemMsgService', 'where sessionid =? order by "when" desc limit 0,1', $scope.id, function (data) {
            // alert("yiban未读消息时取出消息表中最后一条数据"+data.length);
            $scope.lastText = data[0].message;//最后一条消息内容
            // alert("最后一条消息"+$scope.lastText);
            $scope.lastDate = data[0].when;//最后一条消息的时间id
            $scope.srcName = data[0].username;//消息来源人名字
            $scope.srcId = data[0].senderid;//消息来源人id
            // alert($scope.srcName + "用户名1"+$scope.srcId);
            $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
            $scope.msglevel=data[0].msglevel;//紧急程度
            //取出‘ppp’聊天对话的列表数据并进行数据库更新
            $greendao.queryData('SlowNotifyListService', 'where id=?', $scope.id, function (data) {
              $scope.unread = $scope.slowcount;
             // alert("未读消息时取出消息表中最后一条数据" + data.length + $scope.unread);
              var chatitem = {};
              chatitem.id = data[0].id;
              chatitem.chatName = data[0].chatName;
              chatitem.imgSrc = $scope.imgSrc;
              chatitem.lastText = $scope.lastText;
              chatitem.count = $scope.unread;
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = $scope.lastDate;
              chatitem.chatType = $scope.msglevel;
              chatitem.senderId = $scope.srcId;
              chatitem.senderName =$scope.srcName;
              $greendao.saveObj('SlowNotifyListService', chatitem, function (data) {
                // alert("保存成功方法"+data.length);
                $slowarr.updatelastData(chatitem);
                $rootScope.$broadcast('lastslowcount.update');
                $scope.sendAPPCount($scope.id);
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
        //滑动到底部
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    })


    /**
     * 通知最后一条信息展示完成以后在列表界面进行刷新
     */
    $scope.$on('lastfastcount.update', function (event) {
      $scope.$apply(function () {
        // alert("进来数据刷新");
        $scope.fastlist=$notifyarr.getAllNotifyData();

      });

    });

    /**
     * 通知最后一条信息展示完成以后在列表界面进行刷新
     */
    $scope.$on('lastslowcount.update', function (event) {
      $scope.$apply(function () {
        // alert("一般进来数据刷新");
        $scope.slowlist=$slowarr.getAllNotifyData();
      });

    });

    /**
     * 更新应用名称表===通知主界面
     */
    $scope.publicNotifyModuleCount=function (id,unread) {
      // alert("进来展示框了吗"+id+unread);
      $greendao.queryData('ModuleCountService','where id =?','1',function (data) {
        var appitem={};
        $scope.getCount=function (id) {
          if(id === '1'){
            appitem.count1=unread;
          }else if (id === '15'){
            appitem.count2=unread;
          }else if(id === '16'){
            appitem.count3=unread;
          }else if(id === '17'){
            appitem.count4=unread;
          }
        }
        if(data.length ===0){
          appitem.id='1';
          appitem.name=$scope.alarmname;
          appitem.count2='0';
          appitem.count3='0';
          appitem.count1='0';
          appitem.count4='0';
          $scope.getCount(id);
          appitem.type=$scope.type;
        }else{
          appitem.id='1';
          appitem.count1=data[0].count1;
          appitem.count2=data[0].count2;
          appitem.count3=data[0].count3;
          appitem.count4=data[0].count4;
          $scope.getCount(id);
          // alert("测试改变后的count值"+appitem.count1+appitem.count2+appitem.count3+appitem.count4);
          appitem.name=data[0].name;
          appitem.type=data[0].type;
        }
        $greendao.saveObj('ModuleCountService',appitem,function (data) {
          $rootScope.$broadcast('newAPP.update');
        },function (err) {

        });
      },function (err) {

      });
    }


    /**
     * 应用模块数据监听
     */
    $scope.$on('appnotify.update',function (event) {
      // alert("进来新的监听啦啥地方");
      $scope.$apply(function () {
        // alert("进来新的监听啦");
        $scope.oacount=$mqtt.getOaCount();
        $scope.bhzcount=$mqtt.getBhzCount();
        $scope.sycount=$mqtt.getSyCount();
        $scope.cjgccount=$mqtt.getCjgcCount();
        $scope.id=$mqtt.getFirstReceiverSsid();
        $scope.alarmname=$mqtt.getFirstReceiverChatName();
        $scope.type=$mqtt.getMessageType();
        if($scope.oacount >0 && $scope.id === '1'){
          // alert("公文处理通知数量》0");
          $scope.unread=$scope.oacount;
          $scope.publicNotifyModuleCount($scope.id,$scope.unread);
        }else if($scope.bhzcount>0 && $scope.id === '15'){
          // alert("拌合站通知数量》0");
          $scope.unread=$scope.bhzcount;
          $scope.publicNotifyModuleCount($scope.id,$scope.unread);
        }else if($scope.sycount>0 && $scope.id === '16'){
          // alert("试验室通知数量》0");
          $scope.unread=$scope.sycount;
          $scope.publicNotifyModuleCount($scope.id,$scope.unread);
        }else if($scope.cjgccount>0 && $scope.id === '17'){
          // alert("沉降观测通知数量》0");
          $scope.unread=$scope.cjgccount;
          $scope.publicNotifyModuleCount($scope.id,$scope.unread);
        }
      });
    });

    /**
     * 应用模块数据改变后实现监听
     **/
    $scope.$on('newAPP.update', function (event) {
      $scope.$apply(function () {
        // alert("一般进来数据刷新");
        $greendao.loadAllData('ModuleCountService',function (data) {
          // alert("模块应用列表的长度"+data.length);
          $scope.applist=data;
        },function (err) {

        });
      });

    });

    //紧急通知进详情
    $scope.gonewDetail = function (id,chatName,chatType) {
      $state.go("notificationDetail",{
        "id":id,
        "name":chatName,
        "type":chatType
      });
    }

    //一般通知进详情
    $scope.gocommonDetail = function (id,chatName,chatType) {
      // alert("一般进了吗？");
      $state.go("notificationDetail",{
        "id":id,
        "name":chatName,
        "type":chatType
      });
    }

      /**
       * 应用模块点击应用图标跳转程度模块展示数据
       */
    $scope.gotozero=function (id) {
      switch (id){
        case '1':
          // alert("jinlai跳转");
          $scope.isOaNotified='true';
          $scope.pubilcChoice();
          break;
        case '15':
          $scope.isBhzNotified='true';
          $scope.pubilcChoice();
          break;
        case '16':
          $scope.isSyNotified='true';
          $scope.pubilcChoice();
          break;
        case '17':
          $scope.isCjgcNotified='true';
          $scope.pubilcChoice();
          break;
      }
    }

    $scope.pubilcChoice=function () {
      /**
       * 根据应用id查询通知列表
       */
      $scope.queryById=function (id) {
        // alert("进来查询了吗");
        switch (id){
          case '1':
            $mqtt.clearOaCount();
            $scope.count=$mqtt.getOaCount();
            $scope.publicNotifyModuleCount('1',$scope.count);
            break;
          case '15':
            $mqtt.clearBhzCount();
            $scope.count=$mqtt.getBhzCount();
            $scope.publicNotifyModuleCount('15',$scope.count);
            break;
          case '16':
            $mqtt.clearSyCount();
            $scope.count=$mqtt.getSyCount();
            $scope.publicNotifyModuleCount('16',$scope.count);
            break;
          case '17':
            $mqtt.clearCjgcCount();
            $scope.count=$mqtt.getCjgcCount();
            $scope.publicNotifyModuleCount('17',$scope.count);
            break;
        }
        $scope.go(0);
        //根据紧急程度划分
        $greendao.queryData('NotifyListService','where id =? ',id,function (data) {
          // alert("紧急通知列表的长度"+data.length);
          $notifyarr.setNotifyData(data);
          $scope.fastlist=$notifyarr.getAllNotifyData();
        },function (err) {
          $ToastUtils.showToast("查询系统通知列表"+err);
        });

        /**
         * 没有未读时从数据库取数据（一般通知）
         */
        $greendao.queryData('SlowNotifyListService','where id =? ',id,function (data) {
          // alert("一般通知列表的长度"+data.length);
          $slowarr.setNotifyData(data);
          $scope.slowlist=$slowarr.getAllNotifyData();
        },function (err) {
          $ToastUtils.showToast("查询系统通知列表"+err);
        });
        // $greendao.queryNotifyChat('Level_1',id,function (data) {
        //   alert("跳转紧急通知列表的长度"+data.length);
        //   $notifyarr.setNotifyData(data);
        //   $scope.fastlist=$notifyarr.getAllNotifyData();
        // },function (err) {
        //   $ToastUtils.showToast("查询系统通知列表"+err);
        // });
        //
        // /**
        //  * 没有未读时从数据库取数据（一般通知）
        //  */
        // $greendao.queryNotifyChat('Common',id,function (data) {
        //   alert("跳转一般通知列表的长度"+data.length);
        //   $slowarr.setNotifyData(data);
        //   $scope.slowlist=$slowarr.getAllNotifyData();
        // },function (err) {
        //   $ToastUtils.showToast("查询系统通知列表"+err);
        // });
      }


      if($scope.isOaNotified === 'true'){
        // alert("进来公共方法");
        $scope.queryid='1';
        $scope.queryById($scope.queryid);
        $scope.isOaNotified = 'false';
      }else if($scope.isBhzNotified==='true'){
        $scope.queryid='15';
        $scope.queryById($scope.queryid);
        $scope.isBhzNotified='false';
        // $scope.go(0);
      }else if($scope.isSyNotified==='true'){
        $scope.queryid='16';
        $scope.queryById($scope.queryid);
        $scope.isSyNotified='false';
        // $scope.go(0);
      }else if($scope.isCjgcNotified==='true'){
        $scope.queryid='17';
        $scope.queryById($scope.queryid);
        $scope.isCjgcNotified='false';
        // $scope.go(0);
      }
    }
  })

  //单个系统通知详情界面控制器
  .controller('newnotificationDetailCtrl', function ($scope,$state,$greendao,$mqtt,$notifyarr,$rootScope,$stateParams,$ToastUtils,$timeout,$slowarr) {
    /**
     * 从通知会话列表跳转带参
     */
    $scope.id=$stateParams.id;
    $scope.chatName=$stateParams.name;
    $scope.chatType=$stateParams.type;
    // alert("跳转界面"+$scope.id+$scope.chatName+$scope.chatType);

    if($scope.chatType === 'Common'){

    }else if($scope.chatType === 'Level_1'){

    }
    $greendao.queryNewNotifyChat($scope.chatType,$scope.id,function (data) {
      // alert("进来通知详情界面"+data.length);
      $scope.sysmsglist=data;
    },function (err) {
      $ToastUtils.showToast(err+"查询报警信息失败");
    });


      /**
       * 监听未读消息
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
                        $scope.savenotifylastmsg();
                      });
                    });
                    $rootScope.isPersonSend = 'false';
                  }, function (err) {
                    // $ToastUtils.showToast(err + "查询群组对应关系");
                  });
                }
              }else{
                $scope.savenotifylastmsg();
              }
            }, function (err) {
              // $ToastUtils.showToast("收到群组未读消息时，查询chat列表" + err);
            });
            $scope.savenotifylastmsg=function () {
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

    //从数据库取当前应用的count值
    $scope.sendAPPDetailCount=function (id) {
      switch (id){
        case '1':
          // alert("进来了");
          $greendao.queryData('NotifyListService', 'where id=?',$scope.id,function (data) {
            if(data.length>0){
              $scope.fastcount=data[0].count;
              // alert("公文处理紧急count随机测试紧急"+$scope.fastcount);
            }else{
              $scope.fastcount =0;
            }
            $greendao.queryData('SlowNotifyListService', 'where id=?',$scope.id,function (data) {
              if(data.length>0){
                $scope.slowcount=data[0].count;
                // alert("公文处理一般count随机测试一般"+$scope.slowcount);
              }else{
                $scope.slowcount =0;
              }
              $scope.oacount=parseInt($scope.fastcount)+parseInt($scope.slowcount);
              $mqtt.setOaCount($scope.oacount);
              // alert("0000000公文处理count"+$scope.oacount);
              $rootScope.$broadcast('appnotify.update');
            },function (err) {
            });
          },function (err) {
          });
          break;
        case '15':
          $greendao.queryData('NotifyListService', 'where id=?',$scope.id,function (data) {
            if(data.length>0){
              $scope.fastcount=data[0].count;
              // alert("拌合站紧急count随机测试紧急"+$scope.fastcount);
            }else{
              $scope.fastcount =0;
            }
            $greendao.queryData('SlowNotifyListService', 'where id=?',$scope.id,function (data) {
              if(data.length>0){
                $scope.slowcount=data[0].count;
                // alert("拌合站一般count随机测试一般"+$scope.slowcount);
              }else{
                $scope.slowcount =0;
              }
              $scope.bhzcount=parseInt($scope.fastcount)+parseInt($scope.slowcount);
              $mqtt.setBhzCount($scope.bhzcount);
              // alert("拌合站count"+$scope.bhzcount);
              $rootScope.$broadcast('appnotify.update');
            },function (err) {
            });
          },function (err) {
          });
          break;
        case '16':
          $greendao.queryData('NotifyListService', 'where id=?',$scope.id,function (data) {
            if(data.length>0){
              $scope.fastcount=data[0].count;
              // alert("试验室紧急count随机测试紧急"+$scope.fastcount);
            }else{
              $scope.fastcount =0;
            }
            $greendao.queryData('SlowNotifyListService', 'where id=?',$scope.id,function (data) {
              if(data.length>0){
                $scope.slowcount=data[0].count;
                // alert("试验室一般count随机测试一般"+$scope.slowcount);
              }else{
                $scope.slowcount =0;
              }
              $scope.sycount=parseInt($scope.fastcount)+parseInt($scope.slowcount);
              $mqtt.setSyCount($scope.sycount);
              // alert("试验室count"+$scope.sycount);
              $rootScope.$broadcast('appnotify.update');
            },function (err) {
            });
          },function (err) {
          });
          break;
        case '17':
          $greendao.queryData('NotifyListService', 'where id=?',$scope.id,function (data) {
            if(data.length>0){
              $scope.fastcount=data[0].count;
              // alert("沉降观测紧急count随机测试紧急"+$scope.fastcount);
            }else{
              $scope.fastcount =0;
            }
            $greendao.queryData('SlowNotifyListService', 'where id=?',$scope.id,function (data) {
              if(data.length>0){
                $scope.slowcount=data[0].count;
                // alert("沉降观测一般count随机测试一般"+$scope.slowcount);
              }else{
                $scope.slowcount =0;
              }
              $scope.cjgccount=parseInt($scope.fastcount)+parseInt($scope.slowcount);
              $mqtt.setCjgcCount($scope.cjgccount);
              // alert("沉降观测count"+$scope.cjgccount);
              $rootScope.$broadcast('appnotify.update');
            },function (err) {
            });
          },function (err) {
          });
          break;
      }
    }



    //先监听未读通知消息
    $scope.$on('newnotify.update', function (event) {
      $scope.$apply(function () {
        $scope.fastcount=$mqtt.getFastcount();
        $scope.slowcount=$mqtt.getSlowcount();
        $scope.id=$mqtt.getFirstReceiverSsid();
        $scope.alarmname=$mqtt.getFirstReceiverChatName();
        $scope.type=$mqtt.getMessageType();
        if($scope.fastcount >0  && $scope.type === 'Level_1' ){
          // alert("收到紧急系统通知并且保存成功"+$scope.fastcount+"消息类型"+$scope.type+$scope.id);
          $greendao.queryData('NotifyListService','where id =?',$scope.id,function (data) {
            // alert("系统通知会话列表长度"+data.length);
            if(data.length === 0){
              // alert("没有系统通知会话");
              $notifyarr.getNotifyIdChatName($scope.id, $scope.alarmname);
              $rootScope.isNotifySend ='true';
              if($rootScope.isNotifySend === 'true'){
                // alert("进入创建会话段");
                $notifyarr.createNotifyData($rootScope.isNotifySend, $scope.type);
                $scope.$on('notifyarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.fastlist=$notifyarr.getAllNotifyData();
                    // alert("监听以后的长度"+$scope.fastlist.length);
                  });
                });
                $rootScope.isNotifySend = 'false';
              }
            }
          },function (err) {

          });

          //取出与‘ppp’的聊天记录最后一条
          $greendao.queryData('SystemMsgService', 'where sessionid =? order by "when" desc limit 0,1', $scope.id, function (data) {
            // alert("未读消息时取出消息表中最后一条数据"+data.length);
            $scope.lastText = data[0].message;//最后一条消息内容
            // alert("最后一条消息"+$scope.lastText);
            $scope.lastDate = data[0].when;//最后一条消息的时间id
            $scope.srcName = data[0].username;//消息来源人名字
            $scope.srcId = data[0].senderid;//消息来源人id
            // alert($scope.srcName + "用户名1"+$scope.srcId);
            $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
            $scope.msglevel=data[0].msglevel;//紧急程度
            //取出‘ppp’聊天对话的列表数据并进行数据库更新
            $greendao.queryData('NotifyListService', 'where id=?', $scope.id, function (data) {
              $scope.unread = $scope.fastcount;
              // $ToastUtils.showToast("未读消息时取出消息表中最后一条数据" + data.length + $scope.unread);
              var chatitem = {};
              chatitem.id = data[0].id;
              chatitem.chatName = data[0].chatName;
              chatitem.imgSrc = $scope.imgSrc;
              chatitem.lastText = $scope.lastText;
              chatitem.count = $scope.unread;
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = $scope.lastDate;
              chatitem.chatType = $scope.msglevel;
              chatitem.senderId = $scope.srcId;
              chatitem.senderName =$scope.srcName;
              $greendao.saveObj('NotifyListService', chatitem, function (data) {
                // alert("保存成功方法"+data.length);
                $notifyarr.updatelastData(chatitem);
                $rootScope.$broadcast('lastfastcount.update');
                $scope.sendAPPDetailCount($scope.id);
              }, function (err) {
                // $ToastUtils.showToast(err + "数据保存失败");
              });
            }, function (err) {
              // $ToastUtils.showToast(err);
            });
          }, function (err) {
            // $ToastUtils.showToast(err);
          });
        }else if($scope.slowcount >0  && $scope.type === 'Common' ){
          // alert("收到一般系统通知并且保存成功"+$scope.slowcount+"消息类型"+$scope.type+$scope.id);
          $greendao.queryData('SlowNotifyListService','where id =?',$scope.id,function (data) {
            // alert("系统通知会话列表长度"+data.length);
            if(data.length === 0){
              // alert("没有一般通知会话");
              $slowarr.getNotifyIdChatName($scope.id, $scope.alarmname);
              $rootScope.isNotifySend ='true';
              if($rootScope.isNotifySend === 'true'){
                // alert("进入创建会话段");
                $slowarr.createNotifyData($rootScope.isNotifySend, $scope.type);
                $scope.$on('slowarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.slowlist=$slowarr.getAllNotifyData();
                    // alert("监听以后的长度"+$scope.slowlist.length);
                  });
                });
                $rootScope.isNotifySend = 'false';
              }
            }
          },function (err) {

          });

          //取出与‘ppp’的聊天记录最后一条
          $greendao.queryData('SystemMsgService', 'where sessionid =? order by "when" desc limit 0,1', $scope.id, function (data) {
            // alert("yiban未读消息时取出消息表中最后一条数据"+data.length);
            $scope.lastText = data[0].message;//最后一条消息内容
            // alert("最后一条消息"+$scope.lastText);
            $scope.lastDate = data[0].when;//最后一条消息的时间id
            $scope.srcName = data[0].username;//消息来源人名字
            $scope.srcId = data[0].senderid;//消息来源人id
            // alert($scope.srcName + "用户名1"+$scope.srcId);
            $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
            $scope.msglevel=data[0].msglevel;//紧急程度
            //取出‘ppp’聊天对话的列表数据并进行数据库更新
            $greendao.queryData('SlowNotifyListService', 'where id=?', $scope.id, function (data) {
              $scope.unread = $scope.slowcount;
              // alert("未读消息时取出消息表中最后一条数据" + data.length + $scope.unread);
              var chatitem = {};
              chatitem.id = data[0].id;
              chatitem.chatName = data[0].chatName;
              chatitem.imgSrc = $scope.imgSrc;
              chatitem.lastText = $scope.lastText;
              chatitem.count = $scope.unread;
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = $scope.lastDate;
              chatitem.chatType = $scope.msglevel;
              chatitem.senderId = $scope.srcId;
              chatitem.senderName =$scope.srcName;
              $greendao.saveObj('SlowNotifyListService', chatitem, function (data) {
                // alert("保存成功方法"+data.length);
                $slowarr.updatelastData(chatitem);
                $rootScope.$broadcast('lastslowcount.update');
                $scope.sendAPPDetailCount($scope.id);
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
        //滑动到底部
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

    /**
     * 更新应用名称表===详情界面
     */
    $scope.publicModuleCount=function (id,unread) {
      // alert("进来展示框了吗"+id+unread);
      $greendao.queryData('ModuleCountService','where id =?','1',function (data) {
        var appitem={};
        $scope.getCount=function (id) {
          if(id === '1'){
            appitem.count1=unread;
          }else if (id === '15'){
            appitem.count2=unread;
          }else if(id === '16'){
            appitem.count3=unread;
          }else if(id === '17'){
            appitem.count4=unread;
          }
        }
        if(data.length ===0){
          appitem.id='1';
          appitem.name=$scope.alarmname;
          appitem.count2='0';
          appitem.count3='0';
          appitem.count1='0';
          appitem.count4='0';
          $scope.getCount(id);
          appitem.type=$scope.type;
        }else{
          appitem.id='1';
          appitem.count1=data[0].count1;
          appitem.count2=data[0].count2;
          appitem.count3=data[0].count3;
          appitem.count4=data[0].count4;
          $scope.getCount(id);
          // alert("测试改变后的count值"+appitem.count1+appitem.count2+appitem.count3+appitem.count4);
          appitem.name=data[0].name;
          appitem.type=data[0].type;
        }
        $greendao.saveObj('ModuleCountService',appitem,function (data) {
          $rootScope.$broadcast('newAPP.update');
        },function (err) {

        });
      },function (err) {

      });
    }

    /**
     * 应用模块数据监听
     */
    $scope.$on('appnotify.update',function (event) {
      $scope.$apply(function () {
        // alert("进来新的监听啦");
        $scope.oacount=$mqtt.getOaCount();
        $scope.bhzcount=$mqtt.getBhzCount();
        $scope.sycount=$mqtt.getSyCount();
        $scope.cjgccount=$mqtt.getCjgcCount();
        $scope.id=$mqtt.getFirstReceiverSsid();
        $scope.alarmname=$mqtt.getFirstReceiverChatName();
        $scope.type=$mqtt.getMessageType();
        if($scope.oacount >=0 && $scope.id === '1'){
          // alert("公文处理通知数量》0");
          $scope.unread=$scope.oacount;
          $scope.publicModuleCount($scope.id,$scope.unread);
        }else if($scope.bhzcount>=0 && $scope.id === '15'){
          // alert("拌合站通知数量》0");
          $scope.unread=$scope.bhzcount;
          $scope.publicModuleCount($scope.id,$scope.unread);
        }else if($scope.sycount>=0 && $scope.id === '16'){
          // alert("试验室通知数量》0");
          $scope.unread=$scope.sycount;
          $scope.publicModuleCount($scope.id,$scope.unread);
        }else if($scope.cjgccount>=0 && $scope.id === '17'){
          // alert("沉降观测通知数量》0");
          $scope.unread=$scope.cjgccount;
          $scope.publicModuleCount($scope.id,$scope.unread);
        }
      });
    });


    $scope.gonewback = function (chatType,id) {
      if(chatType === 'Level_1'){
        $mqtt.clearFastcount();
        $scope.count=$mqtt.getFastcount();
      }else if(chatType === 'Common'){
        $mqtt.clearSlowcount();
        $scope.count=$mqtt.getSlowcount();
      }
      // $ToastUtils.showToast("无参进来的userid"+$scope.userId);
      // alert("id-======="+id+"type====="+chatType);
      $greendao.queryData('SystemMsgService', 'where sessionid =? order by "when" desc limit 0,1',id, function (data) {
        if (data.length === 0) {
          // alert("无数据返回主界面1");
          $scope.lastText = '';//最后一条消息内容
          $scope.lastDate = 0;//最后一条消息的时间
          $scope.chatName = $scope.chatName;//对话框名称
          $scope.imgSrc = '';//最后一条消息的头像
          $scope.srcId='';//若没有最后一条消息，则将senderid=‘’
          $scope.srcName ='';//若没有最后一条数据，则将senderName=‘’
        } else {
          // alert("有数据返回通知界面1");
          $scope.lastText = data[0].message;//最后一条消息内容
          $scope.lastDate = data[0].when;//最后一条消息的时间
          $scope.chatName = data[0].chatName;//对话框名称
          $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
          $scope.srcName = data[0].username;//消息来源人名字
          $scope.srcId = data[0].senderid;//消息来源人id
        }
        // $ToastUtils.showToast("无参跳转用户名"+$scope.userId);
        if(chatType === 'Level_1'){
          $greendao.queryNotifyChat(chatType,id,function (data)  {
            // alert("跳转查询消息列表"+data.length);
            var chatitem = {};
            chatitem.id = id;
            chatitem.chatName = data[0].chatName;
            chatitem.imgSrc = $scope.imgSrc;
            chatitem.lastText = $scope.lastText;
            chatitem.count = $scope.count;
            chatitem.isDelete = data[0].isDelete;
            chatitem.lastDate = $scope.lastDate;
            chatitem.chatType = chatType;
            chatitem.senderId = $scope.srcId;
            chatitem.senderName = $scope.srcName;
            $greendao.saveObj('NotifyListService', chatitem, function (data) {
              // alert("save success");
              $scope.sendAPPDetailCount(id);
              // alert("紧急改变后的count"+$scope.count);
              $greendao.queryByConditions('NotifyListService', function (data) {
                // alert("加载成功");
                // $state.go("tab.notification", {
                //   "id": $scope.id,
                //   "name": $scope.chatName,
                //   "type":$scope.chatType
                // });
                $state.go("tab.notifications");
              }, function (err) {
                // $ToastUtils.showToast(err + "加载全部数据失败");
              });
            }, function (err) {
              // $ToastUtils.showToast(err + "数据保存失败");
            });
          }, function (err) {
            // $ToastUtils.showToast(err + "查询聊天列表失败");
          });
        }else if(chatType === 'Common'){
          $greendao.querySlowNotifyChat(chatType,id,function (data)  {
            // alert("跳转查询消息列表"+data.length);
            var chatitem = {};
            chatitem.id = id;
            chatitem.chatName = data[0].chatName;
            chatitem.imgSrc = $scope.imgSrc;
            chatitem.lastText = $scope.lastText;
            chatitem.count = $scope.count;
            chatitem.isDelete = data[0].isDelete;
            chatitem.lastDate = $scope.lastDate;
            chatitem.chatType = chatType;
            chatitem.senderId = $scope.srcId;
            chatitem.senderName = $scope.srcName;
            $greendao.saveObj('SlowNotifyListService', chatitem, function (data) {
              // alert("save success");
              $scope.sendAPPDetailCount(id);
              // alert("一般改变后的count"+$scope.count);
              $greendao.queryByConditions('SlowNotifyListService', function (data) {
                // alert("加载成功");
                // $state.go("tab.notification", {
                //   "id": $scope.id,
                //   "name": $scope.chatName,
                //   "type":$scope.chatType
                // });
                $state.go("tab.notifications");
              }, function (err) {
                // $ToastUtils.showToast(err + "加载全部数据失败");
              });
            }, function (err) {
              // $ToastUtils.showToast(err + "数据保存失败");
            });
          }, function (err) {
            // $ToastUtils.showToast(err + "查询聊天列表失败");
          });
        }

      }, function (err) {
        // $ToastUtils.showToast(err + "数据离开失败");
      });
    }

  })





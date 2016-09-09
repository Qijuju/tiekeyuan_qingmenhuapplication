/**
 * Created by Administrator on 2016/9/8.
 */
angular.module('notification.controllers', [])


  .controller('notificationCtrl', function ($scope,$state,$mqtt,$ToastUtils,$mqtt,$chatarr,$greendao,$rootScope) {
    //如果不是监听未读通知，就查询数据库展示通知列表
    $greendao.queryByType('System','Alarm',function (data) {
      // alert("通知列表的长度"+data.length);
      $chatarr.setData(data);
      $scope.syslist=$chatarr.getAllData();
    },function (err) {
      $ToastUtils.showToast("查询系统通知列表"+err);
    } );
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
          $greendao.queryData('ChatListService','where id =?',$scope.id,function (data) {
            // alert("系统通知会话列表长度"+data.length);
            if(data.length === 0){
              // alert("没有系统通知会话");
              $chatarr.getIdChatName($scope.id, $scope.alarmname);
              $rootScope.isPersonSend ='true';
              if($rootScope.isPersonSend === 'true'){
                // alert("进入创建会话段");
                $chatarr.getAll($rootScope.isPersonSend, $scope.type);
                // alert($scope.syslist.length + "长度");
                $scope.$on('chatarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.syslist=$chatarr.getAllData();
                    // alert("监听以后的长度"+$scope.syslist.length);
                  });
                });
                $rootScope.isPersonSend === 'false';
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
            $greendao.queryData('ChatListService', 'where id=?', $scope.id, function (data) {
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
              $greendao.saveObj('ChatListService', chatitem, function (data) {
                $greendao.queryByConditions('ChatListService', function (data) {
                  $chatarr.setData(data);
                  $rootScope.$broadcast('lastcount.update');
                }, function (err) {

                });
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
    $scope.$on('lastcount.update', function (event) {
      $scope.$apply(function () {
        $scope.items = $chatarr.getData();
      });

    });
  })


  //单个系统通知详情界面控制器
.controller('notificationDetailCtrl', function ($scope,$state,$greendao,$mqtt,$chatarr,$rootScope,$stateParams) {
  /**
   * 从通知会话列表跳转带参
   */
  $scope.id=$stateParams.id;
  $scope.chatName=$stateParams.name;
  $scope.chatType=$stateParams.type;

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
      $scope.id=$mqtt.getFirstReceiverSsid();
      $scope.alarmname=$mqtt.getFirstReceiverChatName();
      $scope.type=$mqtt.getMessageType();
      /**
       * 先判断有没有该会话，没有就创建
       */
      if($scope.syscount >0){
        $greendao.queryData('ChatListService','where chatType =?',$scope.id,function (data) {
          // alert("系统通知会话列表长度"+data.length);
          if(data.length === 0){
            $chatarr.getIdChatName($scope.id, $scope.alarmname);
            $rootScope.isPersonSend ='true';
            if($rootScope.isPersonSend === 'true'){
              $scope.items = $chatarr.getAll($rootScope.isPersonSend, $scope.type);
              // $ToastUtils.showToast($scope.items.length + "长度");
              $scope.$on('chatarr.update', function (event) {
                $scope.$apply(function () {
                  $chatarr.getAllData();
                });
              });
              $rootScope.isPersonSend === 'false';
            }
          }
        },function (err) {

        });

        //取出与‘ppp’的聊天记录最后一条
        $greendao.queryData('SystemMsgService', 'where sessionid =? order by "when" desc limit 0,1', $scope.id, function (data) {
          // $ToastUtils.showToast("未读消息时取出消息表中最后一条数据"+data.length);
          $scope.lastText = data[0].message;//最后一条消息内容
          $scope.lastDate = data[0].when;//最后一条消息的时间id
          $scope.srcName = data[0].username;//消息来源人名字
          $scope.srcId = data[0].senderid;//消息来源人id
          // alert($scope.srcName + "用户名1"+$scope.srcId);
          $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
          //取出‘ppp’聊天对话的列表数据并进行数据库更新
          $greendao.queryData('ChatListService', 'where id=?', $scope.id, function (data) {
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
            $greendao.saveObj('ChatListService', chatitem, function (data) {
              $greendao.queryByConditions('ChatListService', function (data) {
                $chatarr.setData(data);
                $rootScope.$broadcast('lastcount.update');
              }, function (err) {

              });
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
      $greendao.queryData('ChatListService', 'where id=?', $scope.id, function (data) {
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
        $greendao.saveObj('ChatListService', chatitem, function (data) {
          // alert("save success");
          $greendao.queryByConditions('ChatListService', function (data) {
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



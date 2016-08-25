/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('application.controllers', [])
  .controller('ChatsCtrl', function ($scope,$timeout,$mqtt,$greendao,$rootScope,$chatarr,$grouparr) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // /*$scope.chats = Chats.all();
    // $scope.remove = function (chat) {
    //   Chats.remove(chat);
    // };*/
    // 一个提示对话框
    $scope.showAlert = function(msg) {
      alert(msg);
    }

    //在联系人界面时进行消息监听，确保人员收到消息
    //收到消息时，创建对话聊天(cahtitem)
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        $scope.danliaomsg = $mqtt.getDanliao();
        $scope.qunliaomsg = $mqtt.getQunliao();
        //当lastcount值变化的时候，进行数据库更新：将更改后的count的值赋值与unread，并将该条对象插入数据库并更新
        $scope.lastCount = $mqtt.getMsgCount();
        // 当群未读消息lastGroupCount数变化的时候
        $scope.lastGroupCount = $mqtt.getMsgGroupCount();

        //获取登录进来就有会话窗口的，监听到未读消息时，取出当前消息的来源
        $scope.firstUserId = $mqtt.getFirstReceiverSsid();
        $scope.receiverssid = $scope.firstUserId;
        $scope.chatName = $mqtt.getFirstReceiverChatName();
        $scope.firstmessageType = $mqtt.getMessageType();
        alert("未读消息singlecount值"+$scope.lastCount+"未读群聊count"+$scope.lastGroupCount+$scope.firstUserId+$scope.chatName+$scope.firstmessageType);
        // if ($scope.userId === '') {

        // alert("first login"+$scope.receiverssid+$scope.firstmessageType);
        // } else if ($scope.userId != $scope.firstUserId) {
        /**
         *  如果其他用户给当前用户发信息，则在会话列表添加item
         *  判断信息过来的接收者id是否跟本机用户相等
         */
        // $scope.receiverssid = $scope.firstUserId;
        // $scope.chatName = $mqtt.getFirstReceiverChatName();
        //   alert("有正常的用户名后" + $scope.receiverssid + $scope.chatName);
        // } else {
        //   $scope.receiverssid = $scope.userId;
        // }


        /**
         * 判断是单聊未读还是群聊未读
         */
        if ($scope.lastCount > 0) {
          //当监听到有消息接收的时候，去判断会话列表有无这条记录，有就将消息直接展示在界面上；无就创建会话列表
          // 接收者id
          // $scope.receiverssid=$mqtt.getFirstReceiverSsid();
          //收到消息时先判断会话列表有没有这个用户
          $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
            alert(data.length + "收到geren消息时，查询chat表有无当前用户");
            if (data.length === 0) {
              alert("没有该danren会话");
              $rootScope.isPersonSend = 'true';
              if ($rootScope.isPersonSend === 'true') {
                $scope.messageType = $mqtt.getMessageType();
                alert("会话列表聊天类型" + $scope.messageType);
                //往service里面传值，为了创建会话
                $chatarr.getIdChatName($scope.receiverssid, $scope.chatName);
                $scope.items = $chatarr.getAll($rootScope.isPersonSend, $scope.messageType);
                alert($scope.items.length + "长度");
                $scope.$on('chatarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.items = $chatarr.getAll($rootScope.isPersonSend, $scope.messageType);
                  });
                });
                $rootScope.isPersonSend = 'false';
              }
            }
          }, function (err) {
            alert("收到未读消息时，查询chat列表" + err);
          });
          //取出与‘ppp’的聊天记录最后一条
          $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.receiverssid, function (data) {
            // alert("未读消息时取出消息表中最后一条数据"+data.length);
            $scope.lastText = data[0].message;//最后一条消息内容
            $scope.lastDate = data[0].when;//最后一条消息的时间
            $scope.chatName = data[0].username;//对话框名称
            alert($scope.chatName + "用户名1");
            $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
            //取出‘ppp’聊天对话的列表数据并进行数据库更新
            $greendao.queryData('ChatListService', 'where id=?', $scope.receiverssid, function (data) {
              $scope.unread = $scope.lastCount;
              alert("未读消息时取出消息表中最后一条数据" + data.length + $scope.unread);
              var chatitem = {};
              chatitem.id = data[0].id;
              chatitem.chatName = data[0].chatName;
              chatitem.imgSrc = $scope.imgSrc;
              chatitem.lastText = $scope.lastText;
              chatitem.count = $scope.unread;
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = $scope.lastDate;
              chatitem.chatType = data[0].chatType;
              chatitem.senderId = '',
                chatitem.senderName = '';
              $greendao.saveObj('ChatListService', chatitem, function (data) {
                $greendao.queryByConditions('ChatListService', function (data) {
                  $chatarr.setData(data);
                  $rootScope.$broadcast('lastcount.update');
                }, function (err) {

                });
              }, function (err) {
                alert(err + "数据保存失败");
              });
            }, function (err) {
              alert(err);
            });
          }, function (err) {
            alert(err);
          });
        } else if ($scope.lastGroupCount > 0) {
          // alert("监听群未读消息数量"+$scope.lastGroupCount+$scope.receiverssid);
          /**
           * 1.首先查询会话列表是否有该会话(chatListService)，若无，创建会话；若有进行第2步
           * 2.查出当前群聊的最后一条聊天记录(messageService)
           * 3.查出会话列表的该条会话，将取出的数据进行赋值(chatListService)
           * 4.保存数据(chatListService)
           * 5.数据刷新(chatListService)按时间降序排列展示
           */
          $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
            alert(data.length+"收到qunzu消息时，查询chat表有无当前用户");
            if (data.length === 0) {
              alert("没有该会话");
              $rootScope.isGroupSend = 'true';
              if ($rootScope.isGroupSend === 'true') {
                $scope.messageType = $mqtt.getMessageType();
                //获取消息来源人
                $scope.chatName = $mqtt.getFirstReceiverChatName();//取到消息来源人，准备赋值，保存chat表
                alert("群组会话列表聊天类型"+$scope.messageType+$scope.chatName);
                //根据群组id获取群名称
                $greendao.queryData('GroupChatsService', 'where id =?', $scope.receiverssid, function (data) {
                  // alert(data[0].groupName);
                  $rootScope.groupName = data[0].groupName;
                  //往service里面传值，为了创建会话
                  $grouparr.getGroupIdChatName($scope.receiverssid, $scope.groupName);
                  $scope.items = $grouparr.getAllGroupList($rootScope.isGroupSend, $scope.messageType);
                  // alert($scope.items.length + "长度");
                  $scope.$on('groupchatarr.update', function (event) {
                    $scope.$apply(function () {
                      alert("contact group监听");
                      /**
                       *  若会话列表有该群聊，取出该会话最后一条消息，并显示在会话列表上
                       *
                       */
                      $scope.saveapplymsg();
                    });
                  });
                  $rootScope.isGroupSend = 'false';
                }, function (err) {
                  alert(err + "查询群组对应关系");
                });
              }
            }else{
              alert("有会话的时候");
              $scope.saveapplymsg();
            }
          }, function (err) {
            alert("收到群组未读消息时，查询chat列表" + err);
          });

          $scope.saveapplymsg=function () {
            /**
             *  若会话列表有该群聊，取出该会话最后一条消息，并显示在会话列表上
             *
             */
            alert("群组长度" +$scope.receiverssid);
            $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.receiverssid, function (data) {
              $scope.lastText = data[0].message;//最后一条消息内容
              $scope.lastDate = data[0].when;//最后一条消息的时间
              $scope.srcName = data[0].username;//消息来源人名字
              $scope.srcId = data[0].senderid;//消息来源人id
              alert($scope.srcName + "群组消息来源人" + $scope.srcId + $scope.lastText);
              $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
              //取出id聊天对话的列表数据并进行数据库更新
              $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
                $scope.unread = $scope.lastGroupCount;
                alert("未读群组消息时取出消息表中最后一条数据" + data.length + $scope.unread);
                var chatitem = {};
                chatitem.id = data[0].id;
                if($rootScope.groupName === '' || $rootScope.groupName === undefined){
                  chatitem.chatName =data[0].chatName ;
                }else{
                  chatitem.chatName =$rootScope.groupName;
                }
                alert("第一次创建会话时保存的群聊名称"+chatitem.chatName);
                chatitem.imgSrc = data[0].imgSrc;
                chatitem.lastText = $scope.lastText;
                chatitem.count = $scope.unread;
                chatitem.isDelete = data[0].isDelete;
                chatitem.lastDate = $scope.lastDate;
                chatitem.chatType = data[0].chatType;
                chatitem.senderId = $scope.srcId;
                chatitem.senderName = $scope.srcName;
                $greendao.saveObj('ChatListService', chatitem, function (data) {
                  $greendao.queryByConditions('ChatListService', function (data) {
                    $grouparr.setData(data);
                    $rootScope.$broadcast('lastgroupcount.update');
                  }, function (err) {
                    alert(err);
                  });
                }, function (err) {
                  alert(err + "数据保存失败");
                });
              }, function (err) {
                alert(err);
              });
            }, function (err) {
              alert(err);
            });
          }
        }
      })

    });
  })


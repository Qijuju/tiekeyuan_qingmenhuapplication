/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('message.controllers', [])
  .controller('MessageDetailCtrl', function ($scope, $state, $http, $ionicScrollDelegate, $mqtt, $ionicActionSheet, $greendao, $timeout, $rootScope, $stateParams,$chatarr,$ToastUtils) {
    //清表数据
    // $greendao.deleteAllData('MessagesService',function (data) {
    //   $ToastUtils.showToast(data);
    // },function (err) {
    //   $ToastUtils.showToast(err);
    // });
    $scope.userId = $stateParams.id;
    $scope.viewtitle = $stateParams.ssid;//接收方姓名
    $scope.groupType = $stateParams.grouptype;//聊天类型
    //对话框名称
    $scope._id='';
    $scope.myUserID = $rootScope.rootUserId;
    $scope.localusr=$rootScope.userName;
    // $ToastUtils.showToast("当前用户名"+$scope.myUserID+$scope.localusr);
    //在个人详情界面点击创建聊天时，在聊天详情界面，创建chatitem
    if ($rootScope.isPersonSend === 'true') {
      // $ToastUtils.showToast("长度");
      $scope.items = $chatarr.getAll($rootScope.isPersonSend,$scope.groupType);
      // $ToastUtils.showToast($scope.items.length + "长度");
      $scope.$on('chatarr.update', function (event) {
        $scope.$apply(function () {
          $scope.items = $chatarr.getAll($rootScope.isPersonSend,$scope.groupType);
        });
      });
      $rootScope.isPersonSend = 'false';
    }
    // $ToastUtils.showToast($scope.viewtitle+"抬头"+$scope.myUserID);
    $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,10', $scope.userId, function (data) {
      //根据不同用户，显示聊天记录，查询数据库以后，不论有没有数据，都要清楚之前数组里面的数据
      for (var j = 0; j <= $mqtt.getDanliao().length-1; j++) {
        $mqtt.getDanliao().splice(j, $mqtt.getDanliao().length);//清除之前数组里存的数据
      }
      for (var i = 1; i <= data.length; i++) {
        $mqtt.getDanliao().push(data[data.length - i]);
      }
      $scope.msgs = $mqtt.getDanliao();
      //$ToastUtils.showToast($scope.msgs[$scope.msgs.length - 1]._id+"asdgf" + $scope.msgs[$scope.msgs.length - 1].message);
    }, function (err) {
      $ToastUtils.showToast(err);
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
          for (var j = 0; j <= $mqtt.getDanliao().length-1; j++) {
            $mqtt.getDanliao().splice(j, $mqtt.getDanliao().length);//清除之前数组里存的数据
          }
          for (var i = 1; i <= data.length; i++) {
            $mqtt.getDanliao().push(data[data.length - i]);
          }
          $scope.msgs = $mqtt.getDanliao();
        } else if ($scope.msgs.length >= 50) {
          $scope.nomore = "true";
        }
        $scope.$broadcast("scroll.refreshComplete");
      }, function (err) {
        $ToastUtils.showToast(err);
      });
    }

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
        // $ToastUtils.showToast("未读消息singlecount值"+$scope.lastCount+"未读群聊count"+$scope.lastGroupCount+$scope.firstUserId+$scope.chatName+$scope.firstmessageType);
        // if ($scope.userId === '') {

        // $ToastUtils.showToast("first login"+$scope.receiverssid+$scope.firstmessageType);
        // } else if ($scope.userId != $scope.firstUserId) {
        /**
         *  如果其他用户给当前用户发信息，则在会话列表添加item
         *  判断信息过来的接收者id是否跟本机用户相等
         */
        // $scope.receiverssid = $scope.firstUserId;
        // $scope.chatName = $mqtt.getFirstReceiverChatName();
        //   $ToastUtils.showToast("有正常的用户名后" + $scope.receiverssid + $scope.chatName);
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
            // $ToastUtils.showToast(data.length + "收到geren消息时，查询chat表有无当前用户");
            if (data.length === 0) {
              // $ToastUtils.showToast("没有该danren会话");
              $rootScope.isPersonSend = 'true';
              if ($rootScope.isPersonSend === 'true') {
                $scope.messageType = $mqtt.getMessageType();
                // $ToastUtils.showToast("会话列表聊天类型" + $scope.messageType);
                //往service里面传值，为了创建会话
                $chatarr.getIdChatName($scope.receiverssid, $scope.chatName);
                $scope.items = $chatarr.getAll($rootScope.isPersonSend, $scope.messageType);
                // $ToastUtils.showToast($scope.items.length + "长度");
                $scope.$on('chatarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.items = $chatarr.getAll($rootScope.isPersonSend, $scope.messageType);
                  });
                });
                $rootScope.isPersonSend = 'false';
              }
            }
          }, function (err) {
            $ToastUtils.showToast("收到未读消息时，查询chat列表" + err);
          });
          //取出与‘ppp’的聊天记录最后一条
          $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.receiverssid, function (data) {
            // $ToastUtils.showToast("未读消息时取出消息表中最后一条数据"+data.length);
            $scope.lastText = data[0].message;//最后一条消息内容
            $scope.lastDate = data[0].when;//最后一条消息的时间
            $scope.chatName = data[0].username;//对话框名称
            // $ToastUtils.showToast($scope.chatName + "用户名1");
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
              chatitem.senderId = '',
                chatitem.senderName = '';
              $greendao.saveObj('ChatListService', chatitem, function (data) {
                $greendao.queryByConditions('ChatListService', function (data) {
                  $chatarr.setData(data);
                  $rootScope.$broadcast('lastcount.update');
                }, function (err) {

                });
              }, function (err) {
                $ToastUtils.showToast(err + "数据保存失败");
              });
            }, function (err) {
              $ToastUtils.showToast(err);
            });
          }, function (err) {
            $ToastUtils.showToast(err);
          });
        } else if ($scope.lastGroupCount > 0) {
          // $ToastUtils.showToast("监听群未读消息数量"+$scope.lastGroupCount+$scope.receiverssid);
          /**
           * 1.首先查询会话列表是否有该会话(chatListService)，若无，创建会话；若有进行第2步
           * 2.查出当前群聊的最后一条聊天记录(messageService)
           * 3.查出会话列表的该条会话，将取出的数据进行赋值(chatListService)
           * 4.保存数据(chatListService)
           * 5.数据刷新(chatListService)按时间降序排列展示
           */
          $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
            // $ToastUtils.showToast(data.length+"收到qunzu消息时，查询chat表有无当前用户");
            if (data.length === 0) {
              // $ToastUtils.showToast("没有该会话");
              $rootScope.isGroupSend = 'true';
              if ($rootScope.isGroupSend === 'true') {
                $scope.messageType = $mqtt.getMessageType();
                //获取消息来源人
                $scope.chatName = $mqtt.getFirstReceiverChatName();//取到消息来源人，准备赋值，保存chat表
                // $ToastUtils.showToast("群组会话列表聊天类型"+$scope.messageType+$scope.chatName);
                //根据群组id获取群名称
                $greendao.queryData('GroupChatsService', 'where id =?', $scope.receiverssid, function (data) {
                  // $ToastUtils.showToast(data[0].groupName);
                  $rootScope.groupName = data[0].groupName;
                  //往service里面传值，为了创建会话
                  $grouparr.getGroupIdChatName($scope.receiverssid, $scope.groupName);
                  $scope.items = $grouparr.getAllGroupList($rootScope.isGroupSend, $scope.messageType);
                  // $ToastUtils.showToast($scope.items.length + "长度");
                  $scope.$on('groupchatarr.update', function (event) {
                    $scope.$apply(function () {
                      // $ToastUtils.showToast("contact group监听");
                      /**
                       *  若会话列表有该群聊，取出该会话最后一条消息，并显示在会话列表上
                       *
                       */
                      $scope.saveapplymsg();
                    });
                  });
                  $rootScope.isGroupSend = 'false';
                }, function (err) {
                  $ToastUtils.showToast(err + "查询群组对应关系");
                });
              }
            }else{
              // $ToastUtils.showToast("有会话的时候");
              $scope.saveapplymsg();
            }
          }, function (err) {
            $ToastUtils.showToast("收到群组未读消息时，查询chat列表" + err);
          });

          $scope.saveapplymsg=function () {
            /**
             *  若会话列表有该群聊，取出该会话最后一条消息，并显示在会话列表上
             *
             */
            // $ToastUtils.showToast("群组长度" +$scope.receiverssid);
            $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.receiverssid, function (data) {
              $scope.lastText = data[0].message;//最后一条消息内容
              $scope.lastDate = data[0].when;//最后一条消息的时间
              $scope.srcName = data[0].username;//消息来源人名字
              $scope.srcId = data[0].senderid;//消息来源人id
              // $ToastUtils.showToast($scope.srcName + "群组消息来源人" + $scope.srcId + $scope.lastText);
              $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
              //取出id聊天对话的列表数据并进行数据库更新
              $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
                $scope.unread = $scope.lastGroupCount;
                // $ToastUtils.showToast("未读群组消息时取出消息表中最后一条数据" + data.length + $scope.unread);
                var chatitem = {};
                chatitem.id = data[0].id;
                if($rootScope.groupName === '' || $rootScope.groupName === undefined){
                  chatitem.chatName =data[0].chatName ;
                }else{
                  chatitem.chatName =$rootScope.groupName;
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
                  $greendao.queryByConditions('ChatListService', function (data) {
                    $grouparr.setData(data);
                    $rootScope.$broadcast('lastgroupcount.update');
                  }, function (err) {
                    $ToastUtils.showToast(err);
                  });
                }, function (err) {
                  $ToastUtils.showToast(err + "数据保存失败");
                });
              }, function (err) {
                $ToastUtils.showToast(err);
              });
            }, function (err) {
              $ToastUtils.showToast(err);
            });
          }
        }
      })
      //加滑动底部
      $timeout(function () {
        viewScroll.scrollBottom();
      }, 100);
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
<<<<<<< HEAD
            // alert($mqtt.getDanliao().length);
            // for(var i=0;i<$mqtt.getDanliao().length;i++){
            //   alert(sqlid+i+"来了"+$scope.msgs);
=======
            // $ToastUtils.showToast($mqtt.getDanliao().length);
            // for(var i=0;i<$mqtt.getDanliao().length;i++){
            //   $ToastUtils.showToast(sqlid+i+"来了"+$scope.msgs);
>>>>>>> 4a2514664bb2627f32e95dab556c1091c53f597b
            //   // if($scope.msgs[i]._id === sql_id){
            //   //   // $mqtt.getDanliao().splice(i, 1);
            //   //   // break;
            //   // }
            // }
<<<<<<< HEAD
            $scope.sendSingleMsg(topic,content,id,account,sqlid);
=======
            $scope.sendSingleMsg(topic, content, id,localuser,localuserId,sqlid);
>>>>>>> 4a2514664bb2627f32e95dab556c1091c53f597b
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
        $ToastUtils.showToast("收到未读消息时，查询chat列表"+err);
      });
      $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.userId, function (data) {
        if (data.length === 0) {
          // $ToastUtils.showToast("无数据返回主界面1");
          $scope.lastText = '';//最后一条消息内容
          $scope.lastDate = 0;//最后一条消息的时间
          $scope.chatName = $scope.viewtitle;//对话框名称
          $scope.imgSrc = '';//最后一条消息的头像
          $scope.senderId='';//若没有最后一条消息，则将senderid=‘’
          $scope.senderName ='';//若没有最后一条数据，则将senderName=‘’
        } else {
          $scope.lastText = data[0].message;//最后一条消息内容
          $scope.lastDate = data[0].when;//最后一条消息的时间
          $scope.chatName = data[0].username;//对话框名称
          $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
          $scope.senderId = data[0];
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
            chatitem.senderId ='',
            chatitem.senderName ='';
          $greendao.saveObj('ChatListService', chatitem, function (data) {
            // $ToastUtils.showToast("save success");
            $greendao.queryByConditions('ChatListService', function (data) {
              // $ToastUtils.showToast("加载成功");
              $state.go("tab.message", {
                "id": $scope.userId,
                "sessionid": $scope.chatName
              });
            }, function (err) {
              $ToastUtils.showToast(err + "加载全部数据失败");
            });
          }, function (err) {
            $ToastUtils.showToast(err + "数据保存失败");
          });
        }, function (err) {
          $ToastUtils.showToast(err + "查询聊天列表失败");
        });
      }, function (err) {
        $ToastUtils.showToast(err + "数据离开失败");
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
        ssid: $scope.viewtitle
      });
    };
  })


  .controller('MessageGroupCtrl', function ($scope, $state, $http, $ionicScrollDelegate, $mqtt, $ionicActionSheet, $greendao, $timeout,$stateParams,$rootScope,$grouparr,$ToastUtils) {
    /**
     * 从其他应用界面跳转带参赋值
     */
    $scope.groupid=$stateParams.id;
    $scope.chatname=$stateParams.chatName;
    $scope.grouptype=$stateParams.grouptype;

    /**
     * 全局的当前用户和id进行赋值，并且将发送消息的id置为‘’
     * @type {string}
     * @private
       */
    $scope._id='';
    $scope.localusr = $rootScope.userName;
    $scope.myUserID = $rootScope.rootUserId;
    // $ToastUtils.showToast("跳进群组详聊"+$scope.groupid+$scope.chatname+$scope.grouptype);

    if ($rootScope.isGroupSend === 'true') {
      $grouparr.getGroupIdChatName($scope.groupid,$scope.chatname);
      $scope.items = $grouparr.getAllGroupList($rootScope.isGroupSend,$scope.grouptype);
      // $ToastUtils.showToast($scope.items.length + "群聊长度");
      $scope.$on('groupchatarr.update', function (event) {
        $scope.$apply(function () {
          $scope.items = $grouparr.getAllGroupList($rootScope.isPersonSend,$scope.grouptype);
        });
      });
      $rootScope.isGroupSend = 'false';
      // $ToastUtils.showToast("走这吗？"+$rootScope.isGroupSend);
    }


    /**
     * 从数据库根据时间降序查询10条数据进行展示
     *
     */
    $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,10', $scope.groupid, function (data) {
      // $ToastUtils.showToast("进入群聊界面，查询数据库长度"+data.length);
      for (var j = 0; j <= $mqtt.getQunliao().length-1; j++) {
        $mqtt.getQunliao().splice(j, $mqtt.getQunliao().length);//清除之前数组里存的数据
      }
      for (var i = 1; i <= data.length; i++) {
        $mqtt.getQunliao().push(data[data.length - i]);
      }
      $scope.groupmsgs = $mqtt.getQunliao();
    }, function (err) {
      $ToastUtils.showToast(err);
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
          for (var j = 0; j <= $mqtt.getQunliao().length-1; j++) {
            $mqtt.getQunliao().splice(j, $mqtt.getQunliao().length);//清除之前数组里存的数据
          }
          for (var i =1; i <=data.length; i++) {
            $mqtt.getQunliao().push(data[data.length - i]);
          }
          $scope.groupmsgs = $mqtt.getQunliao();
        } else if ($scope.groupmsgs.length >= 50) {
          $scope.nomore = "true";
        }
        $scope.$broadcast("scroll.refreshComplete");
      }, function (err) {
        $ToastUtils.showToast(err);
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

    $mqtt.arriveMsg("cll");
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
        // $ToastUtils.showToast("未读消息singlecount值"+$scope.lastCount+"未读群聊count"+$scope.lastGroupCount+$scope.firstUserId+$scope.chatName+$scope.firstmessageType);
        // if ($scope.userId === '') {

        // $ToastUtils.showToast("first login"+$scope.receiverssid+$scope.firstmessageType);
        // } else if ($scope.userId != $scope.firstUserId) {
        /**
         *  如果其他用户给当前用户发信息，则在会话列表添加item
         *  判断信息过来的接收者id是否跟本机用户相等
         */
        // $scope.receiverssid = $scope.firstUserId;
        // $scope.chatName = $mqtt.getFirstReceiverChatName();
        //   $ToastUtils.showToast("有正常的用户名后" + $scope.receiverssid + $scope.chatName);
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
            // $ToastUtils.showToast(data.length + "收到geren消息时，查询chat表有无当前用户");
            if (data.length === 0) {
              // $ToastUtils.showToast("没有该danren会话");
              $rootScope.isPersonSend = 'true';
              if ($rootScope.isPersonSend === 'true') {
                $scope.messageType = $mqtt.getMessageType();
                // $ToastUtils.showToast("会话列表聊天类型" + $scope.messageType);
                //往service里面传值，为了创建会话
                $chatarr.getIdChatName($scope.receiverssid, $scope.chatName);
                $scope.items = $chatarr.getAll($rootScope.isPersonSend, $scope.messageType);
                // $ToastUtils.showToast($scope.items.length + "长度");
                $scope.$on('chatarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.items = $chatarr.getAll($rootScope.isPersonSend, $scope.messageType);
                  });
                });
                $rootScope.isPersonSend = 'false';
              }
            }
          }, function (err) {
            $ToastUtils.showToast("收到未读消息时，查询chat列表" + err);
          });
          //取出与‘ppp’的聊天记录最后一条
          $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.receiverssid, function (data) {
            // $ToastUtils.showToast("未读消息时取出消息表中最后一条数据"+data.length);
            $scope.lastText = data[0].message;//最后一条消息内容
            $scope.lastDate = data[0].when;//最后一条消息的时间
            $scope.chatName = data[0].username;//对话框名称
            // $ToastUtils.showToast($scope.chatName + "用户名1");
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
              chatitem.senderId = '',
                chatitem.senderName = '';
              $greendao.saveObj('ChatListService', chatitem, function (data) {
                $greendao.queryByConditions('ChatListService', function (data) {
                  $chatarr.setData(data);
                  $rootScope.$broadcast('lastcount.update');
                }, function (err) {

                });
              }, function (err) {
                $ToastUtils.showToast(err + "数据保存失败");
              });
            }, function (err) {
              $ToastUtils.showToast(err);
            });
          }, function (err) {
            $ToastUtils.showToast(err);
          });
        } else if ($scope.lastGroupCount > 0) {
          // $ToastUtils.showToast("监听群未读消息数量"+$scope.lastGroupCount+$scope.receiverssid);
          /**
           * 1.首先查询会话列表是否有该会话(chatListService)，若无，创建会话；若有进行第2步
           * 2.查出当前群聊的最后一条聊天记录(messageService)
           * 3.查出会话列表的该条会话，将取出的数据进行赋值(chatListService)
           * 4.保存数据(chatListService)
           * 5.数据刷新(chatListService)按时间降序排列展示
           */
          $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
            // $ToastUtils.showToast(data.length+"收到qunzu消息时，查询chat表有无当前用户");
            if (data.length === 0) {
              // $ToastUtils.showToast("没有该会话");
              $rootScope.isGroupSend = 'true';
              if ($rootScope.isGroupSend === 'true') {
                $scope.messageType = $mqtt.getMessageType();
                //获取消息来源人
                $scope.chatName = $mqtt.getFirstReceiverChatName();//取到消息来源人，准备赋值，保存chat表
                // $ToastUtils.showToast("群组会话列表聊天类型"+$scope.messageType+$scope.chatName);
                //根据群组id获取群名称
                $greendao.queryData('GroupChatsService', 'where id =?', $scope.receiverssid, function (data) {
                  // $ToastUtils.showToast(data[0].groupName);
                  $rootScope.groupName = data[0].groupName;
                  //往service里面传值，为了创建会话
                  $grouparr.getGroupIdChatName($scope.receiverssid, $scope.groupName);
                  $scope.items = $grouparr.getAllGroupList($rootScope.isGroupSend, $scope.messageType);
                  // $ToastUtils.showToast($scope.items.length + "长度");
                  $scope.$on('groupchatarr.update', function (event) {
                    $scope.$apply(function () {
                      // $ToastUtils.showToast("contact group监听");
                      /**
                       *  若会话列表有该群聊，取出该会话最后一条消息，并显示在会话列表上
                       *
                       */
                      $scope.saveapplymsg();
                    });
                  });
                  $rootScope.isGroupSend = 'false';
                }, function (err) {
                  $ToastUtils.showToast(err + "查询群组对应关系");
                });
              }
            }else{
              // $ToastUtils.showToast("有会话的时候");
              $scope.saveapplymsg();
            }
          }, function (err) {
            $ToastUtils.showToast("收到群组未读消息时，查询chat列表" + err);
          });

          $scope.saveapplymsg=function () {
            /**
             *  若会话列表有该群聊，取出该会话最后一条消息，并显示在会话列表上
             *
             */
            // $ToastUtils.showToast("群组长度" +$scope.receiverssid);
            $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.receiverssid, function (data) {
              $scope.lastText = data[0].message;//最后一条消息内容
              $scope.lastDate = data[0].when;//最后一条消息的时间
              $scope.srcName = data[0].username;//消息来源人名字
              $scope.srcId = data[0].senderid;//消息来源人id
              // $ToastUtils.showToast($scope.srcName + "群组消息来源人" + $scope.srcId + $scope.lastText);
              $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
              //取出id聊天对话的列表数据并进行数据库更新
              $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
                $scope.unread = $scope.lastGroupCount;
                // $ToastUtils.showToast("未读群组消息时取出消息表中最后一条数据" + data.length + $scope.unread);
                var chatitem = {};
                chatitem.id = data[0].id;
                if($rootScope.groupName === '' || $rootScope.groupName === undefined){
                  chatitem.chatName =data[0].chatName ;
                }else{
                  chatitem.chatName =$rootScope.groupName;
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
                  $greendao.queryByConditions('ChatListService', function (data) {
                    $grouparr.setData(data);
                    $rootScope.$broadcast('lastgroupcount.update');
                  }, function (err) {
                    $ToastUtils.showToast(err);
                  });
                }, function (err) {
                  $ToastUtils.showToast(err + "数据保存失败");
                });
              }, function (err) {
                $ToastUtils.showToast(err);
              });
            }, function (err) {
              $ToastUtils.showToast(err);
            });
          }
        }
      })
      //加滑动底部
      $timeout(function () {
        viewScroll.scrollBottom();
      }, 100);
    });

    $scope.$on('groupMsgs.error', function (event) {
      $scope.$apply(function () {
        $scope.groupmsgs = $mqtt.getQunliao();
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
        // $greendao.queryData('MessagesService','where type =?','Group',function (data) {
        //   $scope.msgs=data;
        //   $timeout(function() {
        //     viewScroll.scrollBottom();
        //   }, 100);
        // },function (err) {
        //   $ToastUtils.showToast(err);
        // });
        // $greendao.loadAllData('MessagesService',function (data) {
        //   // $ToastUtils.showToast(data+"update");
        //   $scope.msgs=data;
        //   $timeout(function() {
        //     viewScroll.scrollBottom();
        //   }, 100);
        // },function (err) {
        //   $ToastUtils.showToast(err);
        // });
        // $scope.groupMsgs=$mqtt.getAllGroupMsg();
        // $mqtt.getAllGroupMsg($scope);
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
          // $ToastUtils.showToast("单聊没有该会话");
          $rootScope.isGroupSend='true';
          if ($rootScope.isGroupSend === 'true') {
            $grouparr.getGroupIdChatName($scope.groupid,$scope.chatname);
            $scope.items = $grouparr.getAllGroupList($rootScope.isGroupSend,$scope.grouptype);
            // $ToastUtils.showToast($scope.items.length + "群聊长度");
            $scope.$on('groupchatarr.update', function (event) {
              $scope.$apply(function () {
                $scope.items = $chatarr.getAllGroupList($rootScope.isPersonSend,$scope.grouptype);
              });
            });
            $rootScope.isGroupSend = 'false';
            // $ToastUtils.showToast("走这吗？"+$rootScope.isGroupSend);
          }
        }
      },function (err) {
        $ToastUtils.showToast("收到未读消息时，查询chat列表"+err);
      });
      $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.groupid, function (data) {
        if (data.length === 0) {
          // $ToastUtils.showToast("无数据返回主界面1");
          $scope.lastText = '';//最后一条消息内容
          $scope.lastDate = 0;//最后一条消息的时间
          $scope.chatName = $scope.chatname;//对话框名称
          $scope.imgSrc = '';//最后一条消息的头像
          $scope.senderId='';//若没有最后一条消息，则将senderid=‘’
          $scope.senderName ='';//若没有最后一条数据，则将senderName=‘’
        } else {
          $scope.lastText = data[0].message;//最后一条消息内容
          $scope.lastDate = data[0].when;//最后一条消息的时间
          $scope.chatName = data[0].username;//对话框名称
          $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
          $scope.senderId = data[0].senderid;
        }
        // $ToastUtils.showToast("无参跳转用户名"+$scope.groupid);
        $greendao.queryData('ChatListService', 'where id=?',$scope.groupid, function (data) {
          $scope.groupCount=$mqtt.getMsgGroupCount();
          // $ToastUtils.showToast("无参跳转查询消息列表"+data.length);
          var chatitem = {};
          chatitem.id = data[0].id;
          chatitem.chatName = data[0].chatName;
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
              // $ToastUtils.showToast("加载成功");
              $state.go("tab.message", {
                "id": $scope.groupid,
                "sessionid": $scope.chatName,
                "grouptype":$scope.grouptype
              });
            }, function (err) {
              $ToastUtils.showToast(err + "加载全部数据失败");
            });
          }, function (err) {
            $ToastUtils.showToast(err + "数据保存失败");
          });
        }, function (err) {
          $ToastUtils.showToast(err + "查询聊天列表失败");
        });
      }, function (err) {
        $ToastUtils.showToast(err + "数据离开失败");
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
            $scope.sendSingleGroupMsg(topic, content, id,grouptype,localuser,localuserId,sqlid);
          } else if (index === 1) {

          }
          return true;
        }
      });

    };
    //:groupid/:chatname/:grouptype
    $scope.goGroupDetail=function (id,name,type) {
      $state.go('groupSetting',{
        'groupid':id,
        'chatname':name,
        'grouptype':type
      });
    }


  })


  .controller('MessageCtrl', function ($scope, $http, $state, $mqtt, $chatarr, $stateParams, $rootScope, $greendao,$grouparr,$timeout,$contacts,$ToastUtils) {
    //清表数据
    // $greendao.deleteAllData('ChatListService',function (data) {
    //   $ToastUtils.showToast(data);
    // },function (err) {
    //   $ToastUtils.showToast(err);
    // });
    $scope.userId = $stateParams.id;
    $scope.userName = $stateParams.sessionid;
    $scope.messageType = $stateParams.grouptype;
    // $ToastUtils.showToast($scope.userId+"messageC"+$scope.userName+$scope.messageType);
    if($rootScope.isGroupSend === 'true'){
      //若是从群聊那边传过来的，就调用service存储
      $grouparr.getGroupIdChatName($scope.userId,$scope.userName);
      $scope.items = $grouparr.getAllGroupList($rootScope.isGroupSend,$scope.messageType);
      // $ToastUtils.showToast($scope.items.length + "群聊长度");
      $scope.$on('groupchatarr.update', function (event) {
        $scope.$apply(function () {
          $scope.items = $chatarr.getAllGroupList($rootScope.isPersonSend,$scope.messageType);
        });
      });
      $rootScope.isGroupSend = 'false';
      // $ToastUtils.showToast("走这吗？"+$rootScope.isGroupSend);
    }else if($rootScope.isPersonSend === 'true'){
      //若是从单聊那边创建聊天过来的，就调用service存储
      //获取单聊的对方的userid和username
      $chatarr.getIdChatName($scope.userId,$scope.userName);
      $scope.items = $chatarr.getAll($rootScope.isPersonSend,$scope.messageType);
      // $ToastUtils.showToast($scope.items.length + "danliao长度");
      $scope.$on('chatarr.update', function (event) {
        $scope.$apply(function () {
          $scope.items = $chatarr.getAll($rootScope.isPersonSend,$scope.messageType);
        });
      });
      $rootScope.isPersonSend = 'false';
    }

    //如果不是创建聊天，就直接从数据库里取列表数据
    $greendao.queryByConditions('ChatListService',function (data) {
      $scope.items=data;
      // $ToastUtils.showToast($scope.items.length+"聊天列表长度");
    },function (err) {
      $ToastUtils.showToast("按时间查询失败"+err);
    });
    $mqtt.arriveMsg("");

      /**
       * 监听消息
       */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        //加滑动底部
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
        $scope.danliaomsg = $mqtt.getDanliao();
        $scope.qunliaomsg = $mqtt.getQunliao();
        //当lastcount值变化的时候，进行数据库更新：将更改后的count的值赋值与unread，并将该条对象插入数据库并更新
        $scope.lastCount = $mqtt.getMsgCount();
        // 当群未读消息lastGroupCount数变化的时候
        $scope.lastGroupCount = $mqtt.getMsgGroupCount();

        //获取登录进来就有会话窗口的，监听到未读消息时，取出当前消息的来源
        $scope.firstUserId = $mqtt.getFirstReceiverSsid();
        // $ToastUtils.showToast("未读消息count值"+$scope.lastCount+$scope.userId);
        if ($scope.userId === '') {
          $scope.receiverssid = $scope.firstUserId;
          $scope.chatName = $mqtt.getFirstReceiverChatName();
          $scope.firstmessageType = $mqtt.getMessageType();
          // $ToastUtils.showToast("first login"+$scope.receiverssid+$scope.firstmessageType);
        } else if ($scope.userId != $scope.firstUserId) {
          /**
           *  如果其他用户给当前用户发信息，则在会话列表添加item
           *  判断信息过来的接收者id是否跟本机用户相等
           */
          $scope.receiverssid = $scope.firstUserId;
          $scope.chatName = $mqtt.getFirstReceiverChatName();
          // $ToastUtils.showToast("有正常的用户名后" + $scope.receiverssid + $scope.chatName);
        } else {
          $scope.receiverssid = $scope.userId;
        }


        /**
         * 判断是单聊未读还是群聊未读
         */
        if ($scope.lastCount > 0) {
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
                // $ToastUtils.showToast("会话列表聊天类型" + $scope.messageType);
                //往service里面传值，为了创建会话
                $chatarr.getIdChatName($scope.receiverssid, $scope.chatName);
                $scope.items = $chatarr.getAll($rootScope.isPersonSend, $scope.messageType);
                // $ToastUtils.showToast($scope.items.length + "长度");
                $scope.$on('chatarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.items = $chatarr.getAll($rootScope.isPersonSend, $scope.messageType);
                  });
                });
                $rootScope.isPersonSend = 'false';
              }
            }
          }, function (err) {
            $ToastUtils.showToast("收到未读消息时，查询chat列表" + err);
          });
          //取出与‘ppp’的聊天记录最后一条
          $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.receiverssid, function (data) {
            // $ToastUtils.showToast("未读消息时取出消息表中最后一条数据"+data.length);
            $scope.lastText = data[0].message;//最后一条消息内容
            $scope.lastDate = data[0].when;//最后一条消息的时间
            $scope.chatName = data[0].username;//对话框名称
            // $ToastUtils.showToast($scope.chatName + "用户名1");
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
              chatitem.senderId = '',
                chatitem.senderName = '';
              $greendao.saveObj('ChatListService', chatitem, function (data) {
                $greendao.queryByConditions('ChatListService', function (data) {
                  $chatarr.setData(data);
                  $rootScope.$broadcast('lastcount.update');
                }, function (err) {

                });
              }, function (err) {
                $ToastUtils.showToast(err + "数据保存失败");
              });
            }, function (err) {
              $ToastUtils.showToast(err);
            });
          }, function (err) {
            $ToastUtils.showToast(err);
          });
        } else if ($scope.lastGroupCount > 0) {
          // $ToastUtils.showToast("监听群未读消息数量"+$scope.lastGroupCount+$scope.receiverssid);
          /**
           * 1.首先查询会话列表是否有该会话(chatListService)，若无，创建会话；若有进行第2步
           * 2.查出当前群聊的最后一条聊天记录(messageService)
           * 3.查出会话列表的该条会话，将取出的数据进行赋值(chatListService)
           * 4.保存数据(chatListService)
           * 5.数据刷新(chatListService)按时间降序排列展示
           */
          $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
            // $ToastUtils.showToast(data.length+"收到消息时，查询chat表有无当前用户");
            if (data.length === 0) {
              // $ToastUtils.showToast("没有主界面该会话");
              $rootScope.isGroupSend = 'true';
              if ($rootScope.isGroupSend === 'true') {
                $scope.messageType = $mqtt.getMessageType();
                //获取消息来源人
                $scope.chatName = $mqtt.getFirstReceiverChatName();//取到消息来源人，准备赋值，保存chat表
                // $ToastUtils.showToast("群组会话列表聊天类型"+$scope.messageType+$scope.chatName);
                //根据群组id获取群名称
                $greendao.queryData('GroupChatsService', 'where id =?', $scope.receiverssid, function (data) {
                  // $ToastUtils.showToast(data[0].groupName);
                  $rootScope.groupName = data[0].groupName;
                  //往service里面传值，为了创建会话
                  $grouparr.getGroupIdChatName($scope.receiverssid, $scope.groupName);
                  $scope.items = $grouparr.getAllGroupList($rootScope.isGroupSend, $scope.messageType);
                  // $ToastUtils.showToast($scope.items.length + "长度");
                  $scope.$on('groupchatarr.update', function (event) {
                    $scope.$apply(function () {
                      // $scope.items = $grouparr.getAllGroupList($rootScope.isGroupSend, $scope.messageType);
                      // $grouparr.setData(data);
                      // $ToastUtils.showToast("group监听");
                      /**
                       *  若会话列表有该群聊，取出该会话最后一条消息，并显示在会话列表上
                       *
                       */
                      // $ToastUtils.showToast("群组长度" + $scope.items.length);
                      $scope.savelastmsg();
                    });
                  });
                  $rootScope.isGroupSend = 'false';
                }, function (err) {
                  $ToastUtils.showToast(err + "查询群组对应关系");
                });
              }
            }else{
              $scope.savelastmsg();
            }
          }, function (err) {
            $ToastUtils.showToast("收到群组未读消息时，查询chat列表" + err);
          });
          $scope.savelastmsg=function () {
            $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.receiverssid, function (data) {
              $scope.lastText = data[0].message;//最后一条消息内容
              $scope.lastDate = data[0].when;//最后一条消息的时间
              $scope.srcName = data[0].username;//消息来源人名字
              $scope.srcId = data[0].senderid;//消息来源人id
              // $ToastUtils.showToast($scope.srcName + "消息来源人" + $scope.srcId + $scope.lastText);
              $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
              //取出id聊天对话的列表数据并进行数据库更新
              $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
                $scope.unread = $scope.lastGroupCount;
                // $ToastUtils.showToast("未读消息时取出消息表中最后一条数据" + data.length + $scope.unread);
                var chatitem = {};
                chatitem.id = data[0].id;
                if($rootScope.groupName === '' || $rootScope.groupName === undefined){
                  chatitem.chatName =data[0].chatName ;
                }else{
                  chatitem.chatName =$rootScope.groupName;
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
                  $greendao.queryByConditions('ChatListService', function (data) {
                    $grouparr.setData(data);
                    $rootScope.$broadcast('lastgroupcount.update');
                  }, function (err) {
                    $ToastUtils.showToast(err);
                  });
                }, function (err) {
                  $ToastUtils.showToast(err + "数据保存失败");
                });
              }, function (err) {
                $ToastUtils.showToast(err);
              });
            }, function (err) {
              $ToastUtils.showToast(err);
            });
          }

        }
      })
    });

    $scope.$on('lastcount.update', function (event) {
      $scope.$apply(function () {
        $scope.items = $chatarr.getData();
      });

    });

    $scope.$on('lastgroupcount.update', function (event) {
      $scope.$apply(function () {
        // $ToastUtils.showToast("响应数据刷新监听");
        $scope.items = $grouparr.getData();
    });

    });
    //进入单聊界面
    $scope.goDetailMessage = function (id, ssid,chatType) {

      // $ToastUtils.showToast("单聊界面"+id+ssid+chatType);
      $mqtt.clearMsgCount();
      $mqtt.clearMsgGroupCount();
      //将变化的count赋值给unread对象
      // $scope.unread = $mqtt.getMsgCount();
      // //取出最后一条消息记录的数据
      // $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', id, function (data) {
      //   $ToastUtils.showToast(data.length+"单聊界面最后一条数据"+id);
      //   $scope.lastText = data[0].message;//最后一条消息内容
      //   $scope.lastDate = data[0].when;//最后一条消息的时间
      //   $scope.chatName = data[0].username;//对话框名称
      //   $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
      //   //如果count为0，就不用做数据更新；如果count不为0并且chatname为‘PPP’，则将更改后的unread值插入数据库更新
      //   $greendao.queryData('ChatListService', 'where CHAT_NAME=? and count !=0', $scope.chatName, function (data) {
      //     var chatitem = {};
      //     chatitem.id = data[0].id;
      //     chatitem.chatName = data[0].chatName;
      //     chatitem.imgSrc = $scope.imgSrc;
      //     chatitem.lastText = $scope.lastText;
      //     chatitem.count = $scope.unread;
      //     chatitem.isDelete = data[0].isDelete;
      //     chatitem.lastDate = $scope.lastDate;
      //     chatitem.chatType =data[0].chatType;
      //     chatitem.senderId ='',
      //     chatitem.senderName ='';
      //     $greendao.saveObj('ChatListService', chatitem, function (data) {
      //     }, function (err) {
      //       $ToastUtils.showToast(err);
      //     });
      //   }, function (err) {
      //     $ToastUtils.showToast(err);
      //   });
      // }, function (err) {
      //   $ToastUtils.showToast(err);
      // });

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
          "grouptype":chatType
        });
      }else if(chatType === "Group"){
        // $ToastUtils.showToast("进入群聊界面");
        // $mqtt.clearMsgGroupCount();
        // $scope.lastGroupCount = $mqtt.getMsgGroupCount();
        $state.go('messageGroup',{
          "id":id,
          "chatName":ssid,
          "grouptype":chatType
        });
      }

    };

    //
    //
    // $scope.goGroupMessage = function (id,chatName) {
    //
    //
    // }


    $scope.goSearch = function () {
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
          $scope.depid=$contacts.getLoignInfo();
          $contacts.loginDeptInfo($scope.depid);
        })
      });

      $scope.$on('logindept.update', function (event) {
        $scope.$apply(function () {
          //部门id
          $scope.deptinfo = $contacts.getloginDeptInfo();
          //部门群的信息会被放入
          var deptobj={};
          deptobj.id=$scope.depid;
          deptobj.groupName=$scope.deptinfo;
          deptobj.groupType='Dept';
          $greendao.saveObj("GroupChatsService",deptobj,function (msg) {
          },function (err) {
            $ToastUtils.showToast(err);
          })
        })
      });
    });

  })


  .controller('SettingAccountCtrl',function ($scope,$state,$stateParams,$greendao,$ToastUtils) {
    //取出聊天界面带过来的id和ssid
    $scope.userId=$stateParams.id;
    $scope.userName=$stateParams.ssid;
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
            $ToastUtils.showToast(err+清空消息记录失败);
          });
        }
      },function (err) {
        $ToastUtils.showToast(err+"查询所有记录失败");
      });

    };

    $scope.meizuo=function () {
      //$ToastUtils.showToast("此功能暂未开发");
      //跳到添加人员聊天界面
      $state.go('addnewpersonfirst');
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

  .controller('groupSettingCtrl', function ($scope, $state, $stateParams,$ionicHistory,$ToastUtils,$api,$greendao,$group) {


    $scope.groupId = $stateParams.groupid;
    $scope.groupType = $stateParams.grouptype;

    $scope.listM=[];
    $scope.listM.push('GN');
    $scope.listM.push('GT');
    $group.groupDetail($scope.groupType,$scope.groupId,$scope.listM);
    $scope.$on('groupdetail.update', function (event) {
      $scope.$apply(function () {
        $scope.groupName=$group.getGroupDetail().groupName;

      })
    });


    $scope.goGroupPerson=function (id,name,type) {

      if(type=='Group'){
        $state.go('groupMember',{
          "groupid":id,
          "chatname":name,
          "grouptype":type
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
    $scope.dissolveGroup=function () {
      $api.removeGroup($scope.groupId,function (msg) {

        $greendao.deleteDataByArg('ChatListService',$scope.groupId,function (msg) {

          $state.go('tab.message',{
            "id":$scope.groupId,
            "sessionid":$scope.groupName,
            "grouptype":"Group"
          });

        },function (err) {
          $ToastUtils.showToast(err)
        })

      },function (err) {
        $ToastUtils.showToast(err)

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

      $ionicHistory.goBack();

    };

    $scope.gohistoryMessage = function () {
      $state.go("historyMessage");
    }

    $scope.meizuo=function () {
      $ToastUtils.showToast("此功能暂未开发");
    }
  })


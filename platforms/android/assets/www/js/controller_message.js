/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('message.controllers', [])
  .controller('MessageDetailCtrl', function ($scope, $state, $http, $ionicScrollDelegate, $mqtt, $ionicActionSheet, $greendao, $timeout, $rootScope, $stateParams,$chatarr) {
    //清表数据
    // $greendao.deleteAllData('MessagesService',function (data) {
    //   alert(data);
    // },function (err) {
    //   alert(err);
    // });
    //对话框名称
    $scope._id='';
    $scope.myUserID = $rootScope.rootUserId;
    $scope.userId = $stateParams.id;
    $scope.viewtitle = $stateParams.ssid;//接收方姓名
    $scope.localusr=$rootScope.userName;
    //在个人详情界面点击创建聊天时，在聊天详情界面，创建chatitem
    if ($rootScope.isPersonSend === 'true') {
      // alert("长度");
      $scope.items = $chatarr.getAll($rootScope.isPersonSend);
      // alert($scope.items.length + "长度");
      $scope.$on('chatarr.update', function (event) {
        $scope.$apply(function () {
          $scope.items = $chatarr.getAll($rootScope.isPersonSend);
        });
      });
      $rootScope.isPersonSend = 'false';
    }
    // alert($scope.viewtitle+"抬头"+$scope.myUserID);
    $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,10', $scope.userId, function (data) {
      //根据不同用户，显示聊天记录，查询数据库以后，不论有没有数据，都要清楚之前数组里面的数据
      for (var j = 0; j <= $mqtt.getDanliao().length; j++) {
        $mqtt.getDanliao().splice(j, $mqtt.getDanliao().length);//清除之前数组里存的数据
      }
      for (var i = 0; i <= data.length; i++) {
        $mqtt.getDanliao().push(data[data.length - i]);
      }
      $scope.msgs = $mqtt.getDanliao();
      //alert($scope.msgs[$scope.msgs.length - 1]._id+"asdgf" + $scope.msgs[$scope.msgs.length - 1].message);
    }, function (err) {
      alert(err);
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
          for (var j = 0; j <= $mqtt.getDanliao().length; j++) {
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
        alert(err);
      });
    }

    window.addEventListener("native.keyboardshow", function (e) {
      viewScroll.scrollBottom();
    });

    $scope.sendSingleMsg = function (topic, content, id, account,sqlid) {
      $mqtt.getMqtt().getTopic(topic, 'U', function (userTopic) {
        $scope.suc = $mqtt.sendMsg(userTopic, content, id, account,sqlid);
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

    // $mqtt.arriveMsg("");
    //收到消息时，创建对话聊天(cahtitem)
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        $scope.danliaomsg = $mqtt.getDanliao();
        $scope.qunliaomsg = $mqtt.getQunliao();
        //当lastcount值变化的时候，进行数据库更新：将更改后的count的值赋值与unread，并将该条对象插入数据库并更新
        $scope.lastCount = $mqtt.getMsgCount();
        $scope.firstUserId=$mqtt.getFirstReceiverSsid();
        // alert("未读消息count值"+$scope.lastCount+$scope.userId);
        if($scope.userId === ''){
          $scope.receiverssid=$scope.firstUserId;
          $scope.chatName=$mqtt.getFirstReceiverChatName();
          // alert("first login"+$scope.receiverssid);
        }else if($scope.userId != $scope.firstUserId){
          /**
           *  如果其他用户给当前用户发信息，则在会话列表添加item
           *  判断信息过来的接收者id是否跟本机用户相等
           */
          $scope.receiverssid=$scope.firstUserId;
          $scope.chatName=$mqtt.getFirstReceiverChatName();
          // alert("有正常的用户名后"+$scope.receiverssid+$scope.chatName);
        }else{
          $scope.receiverssid=$scope.userId;
        }
        //当监听到有消息接收的时候，去判断会话列表有无这条记录，有就将消息直接展示在界面上；无就创建会话列表
        // 接收者id
        // $scope.receiverssid=$mqtt.getFirstReceiverSsid();
        //收到消息时先判断会话列表有没有这个用户
        $greendao.queryData('ChatListService','where id =?',$scope.receiverssid,function (data) {
          // alert(data.length+"收到消息时，查询chat表有无当前用户");
          if(data.length ===0){
            // alert("没有该会话");
            $rootScope.isPersonSend='true';
            if ($rootScope.isPersonSend === 'true') {
              // alert("长度");
              //往service里面传值，为了创建会话
              $chatarr.getIdChatName($scope.receiverssid,$scope.chatName);
              $scope.items = $chatarr.getAll($rootScope.isPersonSend);
              // alert($scope.items.length + "长度");
              $scope.$on('chatarr.update', function (event) {
                $scope.$apply(function () {
                  $scope.items = $chatarr.getAll($rootScope.isPersonSend);
                });
              });
              $rootScope.isPersonSend = 'false';
            }
          }
        },function (err) {
          alert("收到未读消息时，查询chat列表"+err);
        });
        //取出与‘ppp’的聊天记录最后一条
        $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.receiverssid, function (data) {
          // alert("未读消息时取出消息表中最后一条数据"+data.length);
          $scope.lastText = data[0].message;//最后一条消息内容
          $scope.lastDate = data[0].when;//最后一条消息的时间
          $scope.chatName = data[0].username;//对话框名称
          // alert($scope.chatName + "用户名1");
          $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
          //取出‘ppp’聊天对话的列表数据并进行数据库更新
          $greendao.queryData('ChatListService', 'where id=?',$scope.receiverssid, function (data) {
            $scope.unread = $scope.lastCount;
            var chatitem = {};
            chatitem.id = data[0].id;
            chatitem.chatName = data[0].chatName;
            chatitem.imgSrc = $scope.imgSrc;
            chatitem.lastText = $scope.lastText;
            chatitem.count = $scope.unread;
            chatitem.isDelete = data[0].isDelete;
            chatitem.lastDate = $scope.lastDate;
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
        $scope.lastGroupCount = $mqtt.getMsgGroupCount();
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
    $scope.resendshow = function (topic,content,id,account,sqlid,msgSingle) {
      // $scope.msgs.remove(msgSingle);
      // alert(msgSingle);
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
            // alert($mqtt.getDanliao().length);
            // for(var i=0;i<$mqtt.getDanliao().length;i++){
            //   alert(sqlid+i+"来了"+$scope.msgs);
            //   // if($scope.msgs[i]._id === sql_id){
            //   //   // $mqtt.getDanliao().splice(i, 1);
            //   //   // break;
            //   // }
            // }
            $scope.sendSingleMsg(topic,content,id,account,sqlid);
          } else if (index === 1) {

          }
          return true;
        }
      });

    };

    $scope.backFirstMenu = function () {
      $mqtt.clearMsgCount();
      // alert("无参进来的userid"+$scope.userId);
      //收到消息时先判断会话列表有没有这个用户
      //如果直接创建聊天到聊天详情界面，继续返回到主界面，而会话列表还没有该条会话，进行会话列表的item添加
      $greendao.queryData('ChatListService','where id =?',$scope.userId,function (data) {
        // alert(data.length+"收到消息时，查询chat表有无当前用户");
        if(data.length ===0){
          // alert("没有该会话");
          $rootScope.isPersonSend='true';
          if ($rootScope.isPersonSend === 'true') {
            // alert("长度");
            //往service里面传值，为了创建会话
            $chatarr.getIdChatName($scope.userId,$scope.viewtitle);
            $scope.items = $chatarr.getAll($rootScope.isPersonSend);
            // alert($scope.items.length + "长度");
            $scope.$on('chatarr.update', function (event) {
              $scope.$apply(function () {
                $scope.items = $chatarr.getAll($rootScope.isPersonSend);
              });
            });
            $rootScope.isPersonSend = 'false';
          }
        }
      },function (err) {
        alert("收到未读消息时，查询chat列表"+err);
      });
      $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.userId, function (data) {
        if (data.length === 0) {
          // alert("无数据返回主界面1");
          $scope.lastText = '';//最后一条消息内容
          $scope.lastDate = 0;//最后一条消息的时间
          $scope.chatName = $scope.viewtitle;//对话框名称
          $scope.imgSrc = '';//最后一条消息的头像
        } else {
          $scope.lastText = data[0].message;//最后一条消息内容
          $scope.lastDate = data[0].when;//最后一条消息的时间
          $scope.chatName = data[0].username;//对话框名称
          $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
        }
        // alert("无参跳转用户名"+$scope.userId);
        $greendao.queryData('ChatListService', 'where id=?', $scope.userId, function (data) {
          // alert("无参跳转查询消息列表"+data.length);
            var chatitem = {};
            chatitem.id = data[0].id;
            chatitem.chatName = data[0].chatName;
            chatitem.imgSrc = $scope.imgSrc;
            chatitem.lastText = $scope.lastText;
            chatitem.count = '0';
            chatitem.isDelete = data[0].isDelete;
            chatitem.lastDate = $scope.lastDate;

          $greendao.saveObj('ChatListService', chatitem, function (data) {
            // alert("save success");
            $greendao.queryByConditions('ChatListService', function (data) {
              // alert("加载成功");
              $state.go("tab.message", {
                "id": $scope.userId,
                "sessionid": $scope.chatName
              });
            }, function (err) {
              alert(err + "加载全部数据失败");
            });
          }, function (err) {
            alert(err + "数据保存失败");
          });
        }, function (err) {
          alert(err + "查询聊天列表失败");
        });
      }, function (err) {
        alert(err + "数据离开失败");
      });
    }

    //当前聊天记录超过50条时，跳转到历史消息记录页面
    $scope.skipmessagebox = function () {
      // alert("正确进入聊天方法"+$scope.viewtitle+$scope.userId);
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


  .controller('MessageGroupCtrl', function ($scope, $state, $http, $ionicScrollDelegate, $mqtt, $ionicActionSheet, $greendao, $timeout) {
    $greendao.queryData('MessagesService', 'where type =? order by "when" desc limit 0,10', 'Group', function (data) {
      for (var i = 1; i <= data.length; i++) {
        $mqtt.getQunliao().push(data[data.length - i]);
        $scope.groupmsgs = $mqtt.getQunliao();
      }
    }, function (err) {
      alert(err);
    });
    var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
    var footerBar = document.body.querySelector('#messageGroupDetail .bar-footer');
    var txtInput = angular.element(footerBar.querySelector('textarea'));

    //获取更多数据
    $scope.doRefresh = function () {

      $scope.$broadcast("scroll.refreshComplete")
    }

    window.addEventListener("native.keyboardshow", function (e) {
      viewScroll.scrollBottom();
    });

    $scope.sendSingleGroupMsg = function (topic, content, id) {
      $mqtt.sendGroupMsg(topic, content, id);
      $scope.send_content = ""
      keepKeyboardOpen();
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
    $scope.$on('groupMsgs.update', function (event) {
      $scope.$apply(function () {
        $scope.groupmsgs = $mqtt.getQunliao();
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
        //   $greendao.queryData('MessagesService','where type =?','Group',function (data) {
        //     $scope.msgs=data;
        //     $timeout(function() {
        //     viewScroll.scrollBottom();
        //   }, 100);
        // },function (err) {
        //   alert(err);
        // });
        // $greendao.loadAllData('MessagesService',function (data) {
        //   // alert(data+"update");
        //   $scope.msgs=data;
        //   $timeout(function() {
        //     viewScroll.scrollBottom();
        //   }, 100);
        // },function (err) {
        //   alert(err);
        // });
        // $scope.groupMsgs=$mqtt.getAllGroupMsg();
        // $mqtt.getAllGroupMsg($scope);
        // alert($scope.groupMsgs.length)
        // viewScroll.scrollBottom();
      })

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
        //   alert(err);
        // });
        // $greendao.loadAllData('MessagesService',function (data) {
        //   // alert(data+"update");
        //   $scope.msgs=data;
        //   $timeout(function() {
        //     viewScroll.scrollBottom();
        //   }, 100);
        // },function (err) {
        //   alert(err);
        // });
        // $scope.groupMsgs=$mqtt.getAllGroupMsg();
        // $mqtt.getAllGroupMsg($scope);
      })
    });

    $scope.backSecondMenu = function () {
      $mqtt.clearMsgGroupCount();
      $state.go("tab.message");
    }


    // 点击按钮触发，或一些其他的触发条件
    $scope.resendgroupshow = function (topic, content, id) {

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
          alert(index);
          if (index === 0) {
            $scope.sendSingleGroupMsg(topic, content, id);
          } else if (index === 1) {

          }
          return true;
        }
      });

    };

    $scope.goGroupDetail=function () {
      $state.go('groupSetting');
    }


  })


  .controller('MessageCtrl', function ($scope, $http, $state, $mqtt, $chatarr, $stateParams, $rootScope, $greendao) {
    //清表数据
    // $greendao.deleteAllData('ChatListService',function (data) {
    //   alert(data);
    // },function (err) {
    //   alert(err);
    // });

    $scope.userId = $stateParams.id;
    $scope.userName = $stateParams.sessionid;
    // alert($scope.userId+"messageC"+$scope.userName);
    if ($rootScope.isPersonSend === 'true') {
      $scope.items = $chatarr.getAll($rootScope.isPersonSend);
      // alert($scope.items.length + "长度");
      $scope.$on('chatarr.update', function (event) {
        $scope.$apply(function () {
          $scope.items = $chatarr.getAll($rootScope.isPersonSend);
        });
      });
      $rootScope.isPersonSend = 'false';
    }
    //如果不是创建聊天，就直接从数据库里取列表数据
    $greendao.queryByConditions('ChatListService',function (data) {
      $scope.items=data;
      // alert($scope.items.length+"聊天列表长度");
    },function (err) {
      alert("按时间查询失败"+err);
    });
    // $greendao.loadAllData('ChatListService', function (data) {
    //   $scope.items = data;
    //   //当登陆成功以后进入主界面，从数据库取值：聊天对话框名称
    //   // $scope.ssid=
    //   // alert($scope.items.length+"聊天列表长度");
    // }, function (err) {
    //   alert(err);
    // });
    $mqtt.arriveMsg("");

    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        $scope.danliaomsg = $mqtt.getDanliao();
        $scope.qunliaomsg = $mqtt.getQunliao();
        //当lastcount值变化的时候，进行数据库更新：将更改后的count的值赋值与unread，并将该条对象插入数据库并更新
        $scope.lastCount = $mqtt.getMsgCount();
        $scope.firstUserId=$mqtt.getFirstReceiverSsid();
        // alert("未读消息count值"+$scope.lastCount+$scope.userId);
        if($scope.userId === ''){
          $scope.receiverssid=$scope.firstUserId;
          $scope.chatName=$mqtt.getFirstReceiverChatName();
          // alert("first login"+$scope.receiverssid);
        }else if($scope.userId != $scope.firstUserId){
          /**
           *  如果其他用户给当前用户发信息，则在会话列表添加item
           *  判断信息过来的接收者id是否跟本机用户相等
           */
          $scope.receiverssid=$scope.firstUserId;
          $scope.chatName=$mqtt.getFirstReceiverChatName();
          // alert("有正常的用户名后"+$scope.receiverssid+$scope.chatName);
        }else{
          $scope.receiverssid=$scope.userId;
        }
        //当监听到有消息接收的时候，去判断会话列表有无这条记录，有就将消息直接展示在界面上；无就创建会话列表
        // 接收者id
        // $scope.receiverssid=$mqtt.getFirstReceiverSsid();
        //收到消息时先判断会话列表有没有这个用户
        $greendao.queryData('ChatListService','where id =?',$scope.receiverssid,function (data) {
          // alert(data.length+"收到消息时，查询chat表有无当前用户");
          if(data.length ===0){
            // alert("没有该会话");
            $rootScope.isPersonSend='true';
            if ($rootScope.isPersonSend === 'true') {
              // alert("长度");
              //往service里面传值，为了创建会话
              $chatarr.getIdChatName($scope.receiverssid,$scope.chatName);
              $scope.items = $chatarr.getAll($rootScope.isPersonSend);
              // alert($scope.items.length + "长度");
              $scope.$on('chatarr.update', function (event) {
                $scope.$apply(function () {
                  $scope.items = $chatarr.getAll($rootScope.isPersonSend);
                });
              });
              $rootScope.isPersonSend = 'false';
            }
          }
        },function (err) {
          alert("收到未读消息时，查询chat列表"+err);
        });
        //取出与‘ppp’的聊天记录最后一条
        $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.receiverssid, function (data) {
          // alert("未读消息时取出消息表中最后一条数据"+data.length);
          $scope.lastText = data[0].message;//最后一条消息内容
          $scope.lastDate = data[0].when;//最后一条消息的时间
          $scope.chatName = data[0].username;//对话框名称
          // alert($scope.chatName + "用户名1");
          $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
          //取出‘ppp’聊天对话的列表数据并进行数据库更新
          $greendao.queryData('ChatListService', 'where id=?',$scope.receiverssid, function (data) {
            $scope.unread = $scope.lastCount;
            var chatitem = {};
            chatitem.id = data[0].id;
            chatitem.chatName = data[0].chatName;
            chatitem.imgSrc = $scope.imgSrc;
            chatitem.lastText = $scope.lastText;
            chatitem.count = $scope.unread;
            chatitem.isDelete = data[0].isDelete;
            chatitem.lastDate = $scope.lastDate;
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
        $scope.lastGroupCount = $mqtt.getMsgGroupCount();
      })

    });

    $scope.$on('lastcount.update', function (event) {
      $scope.$apply(function () {
        $scope.items = $chatarr.getData();
      });

    });

    //进入单聊界面
    $scope.goDetailMessage = function (id, ssid) {
      // alert("单聊界面"+id+ssid);
      $mqtt.clearMsgCount();
      //将变化的count赋值给unread对象
      $scope.unread = $mqtt.getMsgCount();
      //取出最后一条消息记录的数据
      $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.receiverssid, function (data) {
        // alert(data.length+"最后一条数据");
        $scope.lastText = data[0].message;//最后一条消息内容
        $scope.lastDate = data[0].when;//最后一条消息的时间
        $scope.chatName = data[0].username;//对话框名称
        $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
        //如果count为0，就不用做数据更新；如果count不为0并且chatname为‘PPP’，则将更改后的unread值插入数据库更新
        $greendao.queryData('ChatListService', 'where CHAT_NAME=? and count !=0', $scope.chatName, function (data) {
          var chatitem = {};
          chatitem.id = data[0].id;
          chatitem.chatName = data[0].chatName;
          chatitem.imgSrc = $scope.imgSrc;
          chatitem.lastText = $scope.lastText;
          chatitem.count = $scope.unread;
          chatitem.isDelete = data[0].isDelete;
          chatitem.lastDate = $scope.lastDate;
          $greendao.saveObj('ChatListService', chatitem, function (data) {
          }, function (err) {
            alert(err);
          });
        }, function (err) {
          alert(err);
        });
      }, function (err) {
        alert(err);
      });

      //进入聊天详情界面
      $state.go('messageDetail',
        {
          "id": id,
          "ssid": ssid
        });


    };


    //进入群聊界面
    $scope.goGroupMessage = function () {
      $mqtt.clearMsgGroupCount();
      $scope.lastGroupCount = $mqtt.getMsgGroupCount();
      $state.go("messageGroup");
    }


    $scope.goSearch = function () {
      $state.go("searchmessage",{
        "UserIDSM":$scope.userId,
        "UserNameSM":$scope.userName
      });
    }

  })


  .controller('SettingAccountCtrl',function ($scope,$state,$stateParams,$greendao,$ToastUtils) {
    //取出聊天界面带过来的id和ssid
    $scope.userId=$stateParams.id;
    $scope.userName=$stateParams.ssid;
    $scope.gohistoryMessage = function () {
      // alert("要跳了")
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

    // alert($scope.userId+"daiguolai"+$scope.userName);
    $scope.addFriend1=function () {
      $state.go("myAttention1");
    }
    //返回到聊天记录界面
    $scope.gobackmsgdetail=function (id,ssid) {
      // alert("返回聊天界面"+id+ssid);
      $state.go('messageDetail',{
        id:id,
        ssid:ssid
      });
    };

    //清空聊天记录
    $scope.clearMsg=function (id,ssid) {
      //查询消息记录list
      // $greendao.deleteAllData('MessagesService',function (data) {
      //   alert(data);
      // },function (err) {
      //   alert(err);
      // });
      $greendao.queryData('MessagesService','where sessionid =?',$scope.userId,function (data) {
        $ToastUtils.showToast("删除成功");
        // alert(data.length+"查询消息记录长度");
        for(var i=0;i<data.length;i++){
          var key=data[i]._id;
          // alert("消息对象"+key);
          $greendao.deleteDataByArg('MessagesService',key,function (data) {
          },function (err) {
            alert(err+清空消息记录失败);
          });
        }
      },function (err) {
        alert(err+"查询所有记录失败");
      });

    };

    $scope.meizuo=function () {
      //$ToastUtils.showToast("此功能暂未开发");
      //跳到添加人员聊天界面
      $state.go('addnewpersonfirst');
    }
  })

  .controller('historyMessageCtrl',function ($scope, $http, $state, $stateParams,$api,$historyduifang,$mqtt,$ToastUtils) {
    $scope.id = $stateParams.id;
    $scope.ssid = $stateParams.ssid;
    $mqtt.getUserInfo(function (msg) {
      $scope.UserID= msg.userID
    },function (msg) {

    });
    $scope.goSetting = function () {
      $state.go('personalSetting',{
        id:$scope.id,
        ssid:$scope.ssid
      });
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
      // alert($scope.totalpage)
    },function (msg) {
      alert("失败");
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

  .controller('groupSettingCtrl', function ($scope, $state, $stateParams,$ionicHistory,$ToastUtils,$group) {

    $scope.listM=[];
    $scope.listM.push('GM');
    $scope.listM.push('GA');
    $scope.listM.push('GN');
    $scope.listM.push('GC');
    $scope.listM.push('GS');
    $scope.listM.push('GT');



    $group.groupDetail('P','11',$scope.listM);
    $scope.$on('groupdetail.update', function (event) {
      $scope.$apply(function () {

      $scope.groupDetail=$group.getGroupDetail();
        alert($scope.groupDetail.groupName+"dfasdfjaskldjflkasdjfklasdjflkasdjfklasjdfkasjdflkasdjfklasd");

      })
    });




    $scope.backAny = function () {

      $ionicHistory.goBack();

    };
    $scope.gohistoryMessage = function () {
      // alert("要跳了")
      $state.go("historyMessage");
    }
    $scope.meizuo=function () {
      $ToastUtils.showToast("此功能暂未开发");
    }
  })


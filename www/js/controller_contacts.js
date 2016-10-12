/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('contacts.controllers', [])
  //常用联系人
  .controller('TopContactsCtrl', function ($scope, $state, $contacts, $ionicActionSheet, $phonepluin, $rootScope,$saveMessageContacts,$ToastUtils,$greendao) {

    $contacts.topContactsInfo();
    $scope.$on('topcontacts.update', function (event) {
      $scope.$apply(function () {
        $scope.topall = $contacts.getTopContactsInfo();
      })
    });

    $scope.topContactGoDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });
    };

    //点击头像发送消息
    $scope.createchat = function (id, phone,name) {
      // $saveMessageContacts.saveMessageContacts(id,phone,name);
      // $ToastUtils.showToast("进来创建聊天");
      $rootScope.isPersonSend = 'true';
      // $state.go('tab.message', {
      //   "id": id,
      //   "sessionid": name
      // });
      if(id ===null || name ===null || id === '' ||name ===''){
        // $ToastUtils.showToast("当前用户信息不全");
      }else{
        $state.go('messageDetail',{
          "id":id,
          "ssid":name,
          "grouptype":'User'
        });
      }
    };

    //快速打开的入口  传入类型的原因的 当type等于1 的时候才存入数据库  不等于的时候走的本地通讯录
    $scope.sheetShow = function (id, phone, name, type) {

      // 显示操作表
      $ionicActionSheet.show({
        buttons: [
          {text: '发消息'},
          {text: '打电话'},
          {text: '发短信'}
        ],
        titleText: name,
        cancelText: '取消',
        buttonClicked: function (index) {
          if (index == 0) {
            $scope.createchat(id,phone, name);
          } else if (index == 1) {
            if(phone!=""){
              $phonepluin.call(id, phone, name, type);
            }else {
              $ToastUtils.showToast("电话为空")
            }
          } else {
            if(phone!=""){
              $phonepluin.sms(id, phone, name, type)
            }else {
              $ToastUtils.showToast("电话为空")

            }
          }
          return true;
        }

      });
    };


    $scope.deleteTopCotacts=function (id) {
      $greendao.deleteDataByArg('TopContactsService',id,function (data) {

        $contacts.topContactsInfo();
      },function (err) {

      })
    }


  })

  .controller('ContactsCtrl', function ($scope, $state, $stateParams, $contacts, $greendao, $ionicActionSheet, $phonepluin,$mqtt, $rootScope,$saveMessageContacts,$ToastUtils,$timeout,$chatarr,$ionicLoading) {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });

    $contacts.topContactsInfo();
    $mqtt.getUserInfo(function (msg) {
      $scope.myid=msg.userID;
    },function (msg) {
    })
    $scope.$on('topcontacts.update', function (event) {
      $scope.$apply(function () {
        $scope.topContactLists = $contacts.getTopContactsInfo();
      })
    });

    $contacts.loginInfo();
    $scope.$on('login.update', function (event) {
      $scope.$apply(function () {
        $scope.logId = $contacts.getLoignInfo();

        $scope.loginid=$contacts.getLoignInfo().deptID;

      })
    });


    $contacts.rootDept();
    $scope.$on('first.update', function (event) {
      $scope.$apply(function () {
        $timeout(function () {
          $ionicLoading.hide();
          $scope.depts = $contacts.getRootDept();
        });
      })
    });

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
            }else if(data[0].messagetype === "File"){
              $scope.lastText = "[文件]";//最后一条消息内容
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
                      $scope.savecontactlastmsg();
                    });
                  });
                  $rootScope.isPersonSend = 'false';
                }, function (err) {
                  // $ToastUtils.showToast(err + "查询群组对应关系");
                });
              }
            }else{
              $scope.savecontactlastmsg();
            }
          }, function (err) {
            // $ToastUtils.showToast("收到群组未读消息时，查询chat列表" + err);
          });
          $scope.savecontactlastmsg=function () {
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

    $scope.topGoDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });
    };

    //快速打开的入口  传入类型的原因的 当type等于1 的时候才存入数据库  不等于的时候走的本地通讯录
    $scope.simpleSheetShow = function (id, phone, name, type) {

      // 显示操作表
      $ionicActionSheet.show({
        buttons: [
          {text: '发消息'},
          {text: '打电话'},
          {text: '发短信'}
        ],
        titleText: name,
        cancelText: '取消',
        buttonClicked: function (index) {
          if (index == 0) {
            $scope.createchat(id, phone,name);
          } else if (index == 1) {
            if(phone!=""){
              $phonepluin.call(id, phone, name, type);
            }else if($scope.myid==id) {
              $ToastUtils.showToast("无法对自己进行该项操作");
            }else {
              $ToastUtils.showToast("电话为空")
            }
          } else {
            if(phone!=""){
              $phonepluin.sms(id, phone, name, type)
            }else if($scope.myid==id) {
              $ToastUtils.showToast("无法对自己进行该项操作");
            }else {
              $ToastUtils.showToast("电话为空")

            }
          }
          return true;
        }

      });
    };

    $scope.createchat = function (id, phone,name) {
      // $saveMessageContacts.saveMessageContacts(id,phone,name);
      // $ToastUtils.showToast("进来创建聊天");
      $rootScope.isPersonSend = 'true';
      // $state.go('tab.message', {
      //   "id": id,
      //   "sessionid": name
      // });
      if(id ===null || name ===null || id === '' ||name ===''){
        $ToastUtils.showToast("当前用户信息不全");
      }else if($scope.myid==id) {
        $ToastUtils.showToast("无法对自己进行该项操作");
      }else{
        $state.go('messageDetail',{
          "id":id,
          "ssid":name,
          "grouptype":'User'
        });
      }
    };

    $scope.goSearch = function () {
      var keyboard = cordova.require('ionic-plugin-keyboard.keyboard');
      keyboard.close();
      $state.go("search");
    }


    /*$greendao.deleteAllData('TopContactsService',function (data) {
     $ToastUtils.showToast('清除数据成功');
     },function (err) {
     $ToastUtils.showToast(err);
     });*/


  })

  .controller('ContactSecondCtrl', function ($scope, $state, $stateParams, $contacts,$ionicHistory,$ToastUtils,$ionicLoading,$timeout) {

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });

    $scope.departlist = [];
    $scope.userlist = [];
    $scope.secondStatus;

    $scope.contactId = $stateParams.contactId;//传过来的id；
    //根据id获取子部门和人员信息
    $contacts.deptInfo($scope.contactId);
    $scope.$on('second.update', function (event) {
      $scope.$apply(function () {

        $timeout(function () {
          $ionicLoading.hide();

          $scope.deptinfo = $contacts.getFirstDeptName().DeptName;

          $scope.activeSecondDeptCount = $contacts.getCount1();

          $scope.activeSecondUserCount = $contacts.getCount2();


          if ($scope.activeSecondDeptCount > 0) {
            var olddepts = $contacts.getDeptInfo().deptList;
            for (var i = 0; i < olddepts.length; i++) {

              $scope.departlist.push(olddepts[i]);
            }
          }


          if ($scope.activeSecondUserCount) {
            var oldusers = $contacts.getDeptInfo().userList;
            for (var i = 0; i < oldusers.length; i++) {

              $scope.userlist.push(oldusers[i]);
            }
          }


          if (($scope.activeSecondDeptCount + $scope.activeSecondUserCount) === 10) {
            $scope.secondStatus = true;
          } else if (($scope.activeSecondDeptCount + $scope.activeSecondUserCount) < 10) {
            $scope.secondStatus = false;

          }


          $scope.parentID = $contacts.getDeptInfo().deptID;


          $scope.$broadcast('scroll.infiniteScrollComplete');



        });


      })

    });
    $scope.$on('$ionicView.leave', function () {
      $contacts.clearSecondCount();
    });


    $scope.loadMoreSecond = function () {
      $contacts.deptInfo($scope.contactId);
    };


    //在二级目录跳转到联系人界面
    $scope.backFirst = function () {
      //$state.go("tab.contacts");
      $ionicHistory.goBack();
    }

    //在二级目录跳转到三级目录
    $scope.jumpThird = function (id, pname) {
      $state.go("third", {
        "contactId": id,
        "secondname": pname
      });
    };

    //点击人员进入人员详情
    $scope.goSecondDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });

    };


  })


  .controller('ContactThirdCtrl', function ($scope, $http, $state, $stateParams, $contacts,$ionicHistory,$ToastUtils,$ionicLoading,$timeout) {

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });

    $scope.departthirdlist = [];
    $scope.userthirdlist = [];
    $scope.thirdStatus;

    //点击当前点击部门的id
    $scope.contactId = $stateParams.contactId;
    //一级的名字
    $scope.pppid = $stateParams.secondname;

    //根据id获取子部门的数据
    $contacts.deptThirdInfo($scope.contactId);


    $scope.$on('third.update', function (event) {

      $scope.$apply(function () {

        $timeout(function () {
          $ionicLoading.hide();
          $scope.parentID = $contacts.getDeptThirdInfo().deptID;
          $scope.deptinfo2 = $contacts.getSecondDeptName().DeptName;


          $scope.count1 = $contacts.getCount3();
          if ($scope.count1 > 0) {
            var olddepts = $contacts.getDeptThirdInfo().deptList;
            for (var i = 0; i < olddepts.length; i++) {

              $scope.departthirdlist.push(olddepts[i]);
            }
          }
          $scope.count2 = $contacts.getCount4();

          if ($scope.count2 > 0) {
            var oldusers = $contacts.getDeptThirdInfo().userList;

            for (var i = 0; i < oldusers.length; i++) {

              $scope.userthirdlist.push(oldusers[i]);
            }
          }



          $scope.thirdlength = (document.getElementById('a1').innerText.length + $scope.pppid.length + $scope.deptinfo2.length) * 15 + 80;
          var thirddiv = document.getElementById("thirdscroll");
          thirddiv.style.width = $scope.thirdlength + "px";

          if (($scope.count1 + $scope.count2) === 10) {
            $scope.thirdStatus = true;
          } else if (($scope.count1 + $scope.count2) < 10) {
            $scope.thirdStatus = false;

          }
          $scope.$broadcast('scroll.infiniteScrollComplete');

        })

        });



    });


    $scope.loadThirdMore = function () {

      $contacts.deptThirdInfo($scope.contactId);

    };


    $scope.$on('$ionicView.leave', function () {
      $contacts.clearThirdCount();
    });

    //在三级目录返回第二级
    $scope.idddd = $contacts.getFirstID();

    /*$scope.backSecond = function (sd) {
      $state.go("second", {
        "contactId": sd
      });
    }*/
    $scope.backSecond = function () {
      $ionicHistory.goBack();
    }


    //在第二级目录跳转到第四级目录
    $scope.jumpForth = function (id, sname, tname) {
      $state.go("forth", {
        "contactId": id,
        "secondname": sname,
        "thirdname": tname
      });
    }


    //点击人员进入人员详情
    $scope.goThirdDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });

    };


  })

  .controller('ContactForthCtrl', function ($scope, $http, $state, $stateParams,$contacts,$ionicHistory,$ToastUtils,$ionicLoading,$timeout) {

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });

    $scope.departlist = [];
    $scope.userlist = [];

    $scope.forthStatus;


    $scope.contactId = $stateParams.contactId;
    $scope.secondName = $stateParams.secondname;
    $scope.thirdName = $stateParams.thirdname;

    //根据id获取子部门和人员信息
    $contacts.deptForthInfo($scope.contactId);
    $scope.$on('forth.update', function (event) {
      $scope.$apply(function () {

        $timeout(function () {
          $ionicLoading.hide();
          $scope.count1 = $contacts.getCount5();
          if ($scope.count1 > 0) {
            var olddepts = $contacts.getDeptForthInfo().deptList;
            for (var i = 0; i < olddepts.length; i++) {

              $scope.departlist.push(olddepts[i]);
            }
          }
          $scope.count2 = $contacts.getCount6();

          if ($scope.count2 > 0) {
            var oldusers = $contacts.getDeptForthInfo().userList;

            for (var i = 0; i < oldusers.length; i++) {

              $scope.userlist.push(oldusers[i]);
            }
          }

          $scope.parentID = $contacts.getDeptForthInfo().deptID;
          $scope.deptinfo4 = $contacts.getThirdDeptName().DeptName;


          $scope.forthlength = (document.getElementById('a1').innerText.length + $scope.secondName.length + $scope.thirdName.length + $scope.deptinfo4.length) * 15 + 120;

          var forthdiv = document.getElementById("forthscroll");
          forthdiv.style.width = $scope.forthlength + "px";

          if (($scope.count1 + $scope.count2) === 10) {
            $scope.forthStatus = true;
          } else if (($scope.count1 + $scope.count2) < 10) {
            $scope.forthStatus = false;

          }

          $scope.$broadcast('scroll.infiniteScrollComplete');

        });



      })

    });

    $scope.loadForthMore = function () {
      $contacts.deptForthInfo($scope.contactId);

    }

    $scope.$on('$ionicView.leave', function () {
      $contacts.clearForthCount();
    });


    //在四级目录需要返回三级目录  （ 三级目录进来需要两个参数 一个是 二级目录id一个是二级目录的名字 ）

    $scope.idididi = $contacts.getSecondID();
    $scope.firstid = $contacts.getFirstID();


    /*$scope.backThird = function (sd, named) {

      $state.go("third", {
        "contactId": sd,
        "secondname": named
      });

    };*/

    $scope.backThird = function () {

      $ionicHistory.goBack();

    };


    // 在四级目录返回二级目录  （二级目录只需要一个id就行）
    $scope.fromForthToSecond = function (sd) {
      $state.go("second", {
        "contactId": sd
      });
    };

    //从四级目录跳入五级目录
    $scope.jumpFifth = function (id, sname, tname, fname) {
      $state.go("fifth", {
        "contactId": id,
        "secondname": sname,
        "thirdname": tname,
        "forthname": fname,
      });
    };

    //从四级目录跳入详情界面

    $scope.goForthDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });
    }

  })


  .controller('ContactFifthCtrl', function ($scope, $state, $stateParams, $contacts,$ionicHistory,$ToastUtils,$ionicLoading,$timeout) {

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });

    $scope.departfifthlist = [];
    $scope.userfifthlist = [];
    $scope.fifthStatus;

    $scope.contactId = $stateParams.contactId;
    $scope.secondName = $stateParams.secondname;
    $scope.thirdName = $stateParams.thirdname;
    $scope.forthName = $stateParams.forthname;

    //根据id获取子部门和人员信息
    $contacts.deptFifthInfo($scope.contactId);
    $scope.$on('fifth.update', function (event) {
      $scope.$apply(function () {

        $timeout(function () {
          $ionicLoading.hide();
          $scope.count1 = $contacts.getCount7();
          if ($scope.count1 > 0) {
            var olddepts = $contacts.getDeptFifthInfo().deptList;
            for (var i = 0; i < olddepts.length; i++) {

              $scope.departfifthlist.push(olddepts[i]);
            }
          }
          $scope.count2 = $contacts.getCount8();

          if ($scope.count2 > 0) {
            var oldusers = $contacts.getDeptFifthInfo().userList;

            for (var i = 0; i < oldusers.length; i++) {

              $scope.userfifthlist.push(oldusers[i]);
            }
          }


          if (($scope.count1 + $scope.count2) === 10) {
            $scope.fifthStatus = true;
          } else if (($scope.count1 + $scope.count2) < 10) {
            $scope.fifthStatus = false;

          }

          $scope.parentID = $contacts.getDeptFifthInfo().deptID;
          $scope.deptinfo5 = $contacts.getForthDeptName().DeptName;

          $scope.fifthlength = (document.getElementById('a1').innerText.length + $scope.secondName.length + $scope.thirdName.length + $scope.forthName.length + $scope.deptinfo5.length) * 15 + 140;


          var fifthdiv = document.getElementById("fifthscroll");
          fifthdiv.style.width = $scope.fifthlength + "px";

          $scope.$broadcast('scroll.infiniteScrollComplete');

        });






      })

    });

    $scope.loadFifthMore = function () {
      $contacts.deptFifthInfo($scope.contactId);

    }


    $scope.$on('$ionicView.leave', function () {
      $contacts.clearFifthCount();
    });

    //返回二级部门 需要一个id；
    $scope.firstid = $contacts.getFirstID();
    $scope.secondid = $contacts.getSecondID();
    $scope.thirdid = $contacts.getThirdID();

    $scope.fromFifthToSecond = function (sd) {
      $state.go("second", {
        "contactId": sd
      });

    };


    //返回三级部门需要一个Id和一个名字；
    $scope.fromFifthToThird = function (sd, sname) {
      $state.go("third", {
        "contactId": sd,
        "secondname": sname,
      });
    };


    //返回四级部门 需要一个id 和 两个名字
    /*$scope.backForth = function (sd, sname, tname) {
      $state.go("forth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
      });
    };*/
    $scope.backForth = function () {
      $ionicHistory.goBack();
     };

    //从五级部门跳转到六级部门
    $scope.jumpSixth = function (id, sname, tname, fname, dd) {
      $state.go("sixth", {
        "contactId": id,
        "secondname": sname,
        "thirdname": tname,
        "forthname": fname,
        "fifthname": dd
      });
    };


    //从五级部门跳转到详情界面
    $scope.goFifthDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });
    }


  })


  .controller('ContactSixthCtrl', function ($scope, $http, $state, $stateParams, $contacts,$ionicHistory,$ToastUtils,$ionicLoading,$timeout) {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });

    $scope.departsixthlist = [];
    $scope.usersixthlist = [];
    $scope.sixthStatus;

    $scope.contactId = $stateParams.contactId;
    $scope.secondName = $stateParams.secondname;
    $scope.thirdName = $stateParams.thirdname;
    $scope.forthName = $stateParams.forthname;
    $scope.fifthName = $stateParams.fifthname;


    //根据id获取子部门和人员信息

    //根据id获取子部门和人员信息
    $contacts.deptSixthInfo($scope.contactId);
    $scope.$on('sixth.update', function (event) {
      $scope.$apply(function () {


        $timeout(function () {
          $ionicLoading.hide();
          $scope.count1 = $contacts.getCount9();
          if ($scope.count1 > 0) {
            var olddepts = $contacts.getDeptSixthInfo().deptList;
            for (var i = 0; i < olddepts.length; i++) {

              $scope.departsixthlist.push(olddepts[i]);
            }
          }
          $scope.count2 = $contacts.getCount10();

          if ($scope.count2 > 0) {
            var oldusers = $contacts.getDeptSixthInfo().userList;

            for (var i = 0; i < oldusers.length; i++) {

              $scope.usersixthlist.push(oldusers[i]);
            }
          }


          if (($scope.count1 + $scope.count2) === 10) {
            $scope.sixthStatus = true;
          } else if (($scope.count1 + $scope.count2) < 10) {
            $scope.sixthStatus = false;

          }


          $scope.parentID = $contacts.getDeptSixthInfo().deptID;
          $scope.deptinfo6 = $contacts.getFifthDeptName().DeptName;


          $scope.sixthlength = (document.getElementById('a1').innerText.length + $scope.secondName.length + $scope.thirdName.length +
            $scope.forthName.length + $scope.fifthName.length + $scope.deptinfo6.length) * 15 + 180;

          var sixthdiv = document.getElementById("sixthscroll");
          sixthdiv.style.width = $scope.sixthlength + "px";

          $scope.$broadcast('scroll.infiniteScrollComplete');

        });


      })

    });


    $scope.loadSixthMore = function () {
      $contacts.deptSixthInfo($scope.contactId);

    }

    $scope.$on('$ionicView.leave', function () {
      $contacts.clearSixthCount();
    });


    //返回二级部门 需要一个id；
    $scope.firstidInSix = $contacts.getFirstID();
    $scope.secondidInSix = $contacts.getSecondID();
    $scope.thirdidInSix = $contacts.getThirdID();
    $scope.forthidInSix = $contacts.getForthID();


    //从六级部门跳转到七级部门
    $scope.jumpSeventh = function (id, sname, tname, fname, sixname, ddd) {
      $state.go("seventh", {
        "contactId": id,
        "secondname": sname,
        "thirdname": tname,
        "forthname": fname,
        "fifthname": sixname,
        "sixthname": ddd
      });
    };

    //从六级界面跳转到2级界面 只需要一个参数
    $scope.fromSixthToSecond = function (sd) {
      $state.go("second", {
        "contactId": sd
      });
    };

    //从六级跳转到3级界面 需要两个参数
    $scope.fromSixthToThird = function (sd, sname) {
      $state.go("third", {
        "contactId": sd,
        "secondname": sname,
      });
    };

    //从六级跳转到4级界面  需要三个参数

    $scope.fromSixthToForth = function (sd, sname, tname) {
      $state.go("forth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
      });
    };

    //从六级返回五级  需要四个参数

    /*$scope.backFifth = function (sd, sname, tname, ttname) {
      $state.go("fifth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
        "forthname": ttname
      });
    };*/

    $scope.backFifth = function () {
      $ionicHistory.goBack();
    };


    //从六级部门跳转到详情界面
    $scope.goSixthDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });
    };

  })


  .controller('ContactSeventhCtrl', function ($scope, $state, $stateParams, $contacts, $ionicHistory,$ToastUtils,$ionicLoading,$timeout) {

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });

    $scope.nihao = [];
    $scope.buhao = [];
    $scope.seventhStatus;

    $scope.contactId = $stateParams.contactId;
    $scope.secondName = $stateParams.secondname;
    $scope.thirdName = $stateParams.thirdname;
    $scope.forthName = $stateParams.forthname;
    $scope.fifthName = $stateParams.fifthname;
    $scope.sixthName = $stateParams.sixthname;

    //根据id获取子部门和人员信息

    $contacts.deptSeventhInfo($scope.contactId);
    $scope.$on('seventh.update', function (event) {
      $scope.$apply(function () {

        $timeout(function () {
          $ionicLoading.hide();
          $scope.count1 = $contacts.getCount11();
          if ($scope.count1 > 0) {
            var olddepts = $contacts.getDeptSeventhInfo().deptList;
            for (var i = 0; i < olddepts.length; i++) {

              $scope.nihao.push(olddepts[i]);
            }
          }
          $scope.count2 = $contacts.getCount12();
          if ($scope.count2 > 0) {
            var oldusers = $contacts.getDeptSeventhInfo().userList;

            for (var i = 0; i < oldusers.length; i++) {

              $scope.buhao.push(oldusers[i]);
            }
          }


          if (($scope.count1 + $scope.count2) === 10) {
            $scope.seventhStatus = true;
          } else if (($scope.count1 + $scope.count2) < 10) {
            $scope.seventhStatus = false;

          }


          $scope.parentID = $contacts.getDeptSeventhInfo().deptID;
          $scope.deptinfo7 = $contacts.getSixthDeptName().DeptName;


          $scope.seventhlength = (document.getElementById('a1').innerText.length + $scope.secondName.length + $scope.thirdName.length + $scope.forthName.length
            + $scope.fifthName.length + $scope.sixthName.length + $scope.deptinfo7.length) * 15 + 200;

          var seventhdiv = document.getElementById("seventhscroll");
          seventhdiv.style.width = $scope.seventhlength + "px";

          $scope.$broadcast('scroll.infiniteScrollComplete');
        });

      })

    });

    $scope.loadSeventhMore = function () {
      $contacts.deptSeventhInfo($scope.contactId);

    }

    $scope.$on('$ionicView.leave', function () {
      $contacts.clearSeventhCount();
    });

    $scope.firstidInSeven = $contacts.getFirstID();
    $scope.secondidInSeven = $contacts.getSecondID();
    $scope.thirdidInSeven = $contacts.getThirdID();
    $scope.forthidInSeven = $contacts.getForthID();
    $scope.fifthidInSeven = $contacts.getFifthID();

    $scope.jumpEighth=function (id, sname, tname, fname, sixname, ddd,zuihou) {
      $state.go("eighth", {
        "contactId": id,
        "secondname": sname,
        "thirdname": tname,
        "forthname": fname,
        "fifthname": sixname,
        "sixthname": ddd,
        "seventhname":zuihou
      });
    }


    //返回六级列表

    $scope.backSixth = function () {
      $ionicHistory.goBack();

    }


    //从七级目录到五级目录  五级目录需要四个参数
    $scope.formSeventhToFifth = function (sd, sname, tname, ttname) {
      $state.go("fifth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
        "forthname": ttname
      });
    }

    //从七级目录到四级目录  四级目录需要四个参数
    $scope.fromSeventhToForth = function (sd, sname, tname) {
      $state.go("forth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
      });
    };

    //从七级目录到三级目录  三级目录需要两个个参数


    $scope.fromSeventhToThird = function (sd, sname) {
      $state.go("third", {
        "contactId": sd,
        "secondname": sname,
      });
    };

    //从七级目录到二级目录  二级目录需要1个参数

    $scope.fromSeventhToSecond = function (sd) {
      $state.go("second", {
        "contactId": sd
      });
    };


    //从七级界面跳入到详情界面
    $scope.goSeventhDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });
    };

  })


  .controller('ContactEighthCtrl', function ($scope, $state, $stateParams, $contacts,$ionicHistory,$ToastUtils,$ionicLoading,$timeout) {

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });


    $scope.eightDept = [];
    $scope.eightUser = [];
    $scope.eighthStatus;


    $scope.contactId = $stateParams.contactId;
    $scope.secondName = $stateParams.secondname;
    $scope.thirdName = $stateParams.thirdname;
    $scope.forthName = $stateParams.forthname;
    $scope.fifthName = $stateParams.fifthname;
    $scope.sixthName = $stateParams.sixthname;
    $scope.seventhName = $stateParams.seventhname;


    //根据id获取子部门和人员信息
    $contacts.deptEighthInfo($scope.contactId);
    $scope.$on('eighth.update', function (event) {
      $scope.$apply(function () {

        $timeout(function () {
          $ionicLoading.hide();
          $scope.count1 = $contacts.getCount13();
          if ($scope.count1 > 0) {
            var olddepts = $contacts.getDeptEighthInfo().deptList;
            for (var i = 0; i < olddepts.length; i++) {

              $scope.eightDept.push(olddepts[i]);
            }
          }
          $scope.count2 = $contacts.getCount14();
          if ($scope.count2 > 0) {
            var oldusers = $contacts.getDeptEighthInfo().userList;

            for (var i = 0; i < oldusers.length; i++) {

              $scope.eightUser.push(oldusers[i]);
            }
          }


          if (($scope.count1 + $scope.count2) === 10) {
            $scope.eighthStatus = true;
          } else if (($scope.count1 + $scope.count2) < 10) {
            $scope.eighthStatus = false;

          }


          $scope.parentID = $contacts.getDeptEighthInfo().deptID;
          $scope.deptinfo8 = $contacts.getSeventhDeptName().DeptName;


          $scope.eighthlength = (document.getElementById('a1').innerText.length + $scope.secondName.length + $scope.thirdName.length + $scope.forthName.length
            + $scope.fifthName.length + $scope.sixthName.length+$scope.seventhName.length + $scope.deptinfo8.length) * 15 + 220;

          var eighthdiv = document.getElementById("eighthscroll");
          eighthdiv.style.width = $scope.eighthlength + "px";

          $scope.$broadcast('scroll.infiniteScrollComplete');

        });




      })

    });

    $scope.loadEighthMore = function () {
      $contacts.deptEighthInfo($scope.contactId);

    }

    $scope.$on('$ionicView.leave', function () {
      $contacts.clearEngithCount();
    });



    $scope.goEighthDetail=function (id) {
      $state.go("person", {
        "userId": id,
      });
    }

    $scope.firstidInEighth = $contacts.getFirstID();
    $scope.secondidInEighth = $contacts.getSecondID();
    $scope.thirdidInEighth= $contacts.getThirdID();
    $scope.forthidInEighth = $contacts.getForthID();
    $scope.fifthidInEighth = $contacts.getFifthID();
    $scope.sixthidInEighth = $contacts.getSixthID();


    //八级到六级目录 五个参数
    $scope.fromEighthToSixth=function (sd, sname, tname, ttname,tttname) {
      $state.go("sixth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
        "forthname": ttname,
        "fifthname":tttname
      });
    }


    //从八级目录到五级目录  五级目录需要四个参数
    $scope.fromEighthToFifth = function (sd, sname, tname, ttname) {
      $state.go("fifth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
        "forthname": ttname
      });
    }

    //从八级目录到四级目录  四级目录需要三个参数
    $scope.fromEighthToForth = function (sd, sname, tname) {
      $state.go("forth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
      });
    };

    //从七级目录到三级目录  三级目录需要两个个参数


    $scope.fromEighthToThird = function (sd, sname) {
      $state.go("third", {
        "contactId": sd,
        "secondname": sname,
      });
    };

    //从七级目录到二级目录  二级目录需要1个参数

    $scope.fromEighthToSecond = function (sd) {
      $state.go("second", {
        "contactId": sd
      });
    };

    $scope.backSeventh=function () {
      $ionicHistory.goBack();

    }


  })


  .controller('PersonCtrl', function ($scope, $stateParams, $state, $phonepluin, $savaLocalPlugin, $contacts, $ionicHistory, $rootScope, $addattentionser,$saveMessageContacts,$ToastUtils,$mqtt,$timeout,$ionicLoading) {

    // Setup the loader
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });

    // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.


    $scope.userId = $stateParams.userId;
    $mqtt.getUserInfo(function (msg) {
      $scope.myid=msg.userID;
    },function (msg) {
    })

    $contacts.personDetail($scope.userId,$timeout,$ToastUtils);
    $scope.$on('personDetail.update', function (event) {
      $scope.$apply(function () {
          $timeout(function () {
            $ionicLoading.hide();
            $scope.persondsfs = $contacts.getPersonDetail();
            if ($scope.persondsfs.UserName.length > 2) {
              $scope.simpleName = $scope.persondsfs.UserName.substr(($scope.persondsfs.UserName.length-2), $scope.persondsfs.UserName.length);
            } else {
              $scope.simpleName = $scope.persondsfs.UserName;
            }
          });
      })
    });

    $scope.backAny = function () {

      $ionicHistory.goBack();

    };

    //调用打电话功能，并且会存到数据库里面
    $scope.detailCall = function (id, phone, name, type) {
      if ($scope.myid==$scope.userId){
        $ToastUtils.showToast("无法对自己进行该项操作")
      }else {
        if (phone != "") {
          $phonepluin.call(id, phone, name, type);
        } else {
          $ToastUtils.showToast("电话为空")
        }
      }
    }


    //发短信 也会把存入数据库  传入类型的原因是 type 只是存 通过组织架构拨打出去的电话和人
    $scope.detailSendSms = function (id, phone, name, type) {
      if ($scope.myid==$scope.userId){
        $ToastUtils.showToast("无法对自己进行该项操作")
      }else {
        if (phone != "") {
          $phonepluin.sms(id, phone, name, type);
        } else {
          $ToastUtils.showToast("电话为空")
        }
      }

    };


    //把联系人存入本地
    $scope.insertPhone = function (name, phone) {
      if ($scope.myid==$scope.userId){
        $ToastUtils.showToast("无法对自己进行该项操作")
      }else {
        if (name != null && phone != null) {
          $savaLocalPlugin.insert(name, phone);
        } else {
          $ToastUtils.showToast("姓名或者电话为空")
        }
      }

    };

    //点击头像发送消息
    $scope.createchat = function (id, phone,name) {
      if (id==""||id==null||name==""||name==null){
        $ToastUtils.showToast("当前用户信息不全")
      }else {
        // $saveMessageContacts.saveMessageContacts(id,phone,name);
        // $ToastUtils.showToast("进来创建聊天");
        $rootScope.isPersonSend = 'true';
        // $state.go('tab.message', {
        //   "id": id,
        //   "sessionid": name
        // });
        if ($scope.myid == $scope.userId) {
          $ToastUtils.showToast("无法对自己进行该项操作")
        } else if (id === null || name === null || id === '' || name === '') {
          $ToastUtils.showToast("当前用户信息不全")
        } else {
          $saveMessageContacts.saveMessageContacts(id, phone, name);
          $state.go('messageDetail', {
            "id": id,
            "ssid": name,
            "grouptype":'User'
          });
        }
      }
    }
    //取消关注
    $scope.removeattention = function (id) {
      if ($scope.myid==$scope.userId){
        $ToastUtils.showToast("无法对自己进行该项操作")
      }else {
        var membersAerr = [];
        membersAerr.push(id);
        $addattentionser.removeAttention111(membersAerr);
      }
    }
    $scope.$on('attention.delete', function (event) {
      $scope.$apply(function () {
        $scope.persondsfs.IsAttention = $addattentionser.getaddAttention111();
      })
    });

    //添加关注
    $scope.addattentiondetail = function (id) {
      if ($scope.myid==$scope.userId){
        $ToastUtils.showToast("无法对自己进行该项操作")
      }else {
        var membersAerr = [];
        membersAerr.push(id);
        $addattentionser.addAttention111(membersAerr);
      }
    };
    $scope.$on('attention.add', function (event) {
      $scope.$apply(function () {
        $scope.persondsfs.IsAttention = $addattentionser.getaddAttention111();

      })
    });
  })

  .controller('GroupCtrl', function ($scope,$state,$contacts,$ToastUtils,$group,$rootScope,$greendao,$ionicLoading,$timeout) {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });



    $contacts.loginInfo();
    $scope.$on('login.update', function (event) {
      $scope.$apply(function () {
        $contacts.clearSecondCount();
        //登录人员的id
        $scope.loginId=$contacts.getLoignInfo().userID;
        //部门id
        $scope.depid=$contacts.getLoignInfo().deptID;
        $contacts.loginDeptInfo($scope.depid);
        $group.allGroup();
      })
    });

    $scope.$on('logindept.update', function (event) {
      $scope.$apply(function () {
        //部门id
        $scope.deptinfo = $contacts.getloginDeptInfo();

      })
    });



    $scope.$on('group.update', function (event) {
      $scope.$apply(function () {

        $timeout(function () {
          $ionicLoading.hide();
          $scope.grouplist=$group.getAllGroup();
          $scope.ismycreat=0;

          for(var i=0; i<$scope.grouplist.length;i++){
            if($scope.grouplist[i].isMyGroup==true){
              $scope.ismycreat++;
            }
          }

        });

      })
    });

    //我创建的
    $scope.goCreateGroup=function (id,name,ismygrop) {
      $rootScope.isPersonSend === 'true'
      $state.go('messageGroup',{
        "id":id,
        "chatName":name,
        "grouptype":"Group",
        "ismygroup":ismygrop
      });
    }

    //我加入的
    $scope.goJoinGroup=function (id,name,ismygrop) {
      $rootScope.isPersonSend === 'true'
      $state.go('messageGroup',{
        "id":id,
        "chatName":name,
        "grouptype":"Group",
        "ismygroup":ismygrop
      });
    }

    //部门的群
    $scope.goDepartmentGroup=function (id,name,ismygrop) {
      $rootScope.isPersonSend === 'true'

      $state.go('messageGroup',{
        "id":id,
        "chatName":name,
        "grouptype":"Dept",
        "ismygroup":ismygrop
      });
    }
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




  })


  .controller('myattentionaaaSelectCtrl',function ($scope,$state,$myattentionser,$api,$ionicLoading,$mqtt,$timeout,$phonepluin,$ionicActionSheet,$searchdata,$searchdatadianji,$ToastUtils,$rootScope,$saveMessageContacts,$addattentionser) {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });

    $mqtt.getUserInfo(function (msg) {
      $scope.myid=msg.userID;
    },function (msg) {
    })
    //点击人员进入人员详情
    $scope.jumpattenDetial = function (id) {
      $state.go("person", {
        "userId": id,
      });

    };


    $scope.$on('person.update',function (event) {
      $scope.$apply(function () {
        $scope.phoneattention=$searchdata.getPersonDetail().user.Mobile;
        $scope.nameattention=$searchdata.getPersonDetail().user.UserName;
        $scope.idattention=$searchdata.getPersonDetail().user.UserID;

        $scope.createchat = function (id, phone,name) {
          $saveMessageContacts.saveMessageContacts(id,phone,name)
          $rootScope.isPersonSend = 'true';
          if(id ===null || name ===null || id === '' ||name ===''){
            $ToastUtils.showToast("当前用户信息不全");
          }else if($scope.myid==id){
            $ToastUtils.showToast("无法对自己进行该项操作");
          }
          else{
            $state.go('messageDetail',{
              "id":id,
              "ssid":name,
              "grouptype":'User'
            });
          }
        };
        // 显示操作表
        $ionicActionSheet.show({
          buttons: [
            { text: '打电话' },
            { text: '发消息' },
            { text: '发短信'}
          ],
          titleText: $scope.nameattention,
          cancelText: '取消',
          buttonClicked: function(index) {
            if(index==0){
              if ($scope.phoneattention!=""){
                $phonepluin.call($scope.idattention, $scope.phoneattention, $scope.nameattention,1);
              }else if($scope.myid==$scope.idattention){
                $ToastUtils.showToast("无法对自己进行该项操作");
              }else {
                $ToastUtils.showToast("电话号码为空");
              }
            }else if(index==1){
              $scope.createchat($scope.idattention,$scope.phoneattention,$scope.nameattention);
            }else {
              if ($scope.phoneattention!=""){
                $phonepluin.sms($scope.idattention,$scope.phoneattention, $scope.nameattention, 1);
              }else if($scope.myid==$scope.idattention){
                $ToastUtils.showToast("无法对自己进行该项操作");
              }else {
                $ToastUtils.showToast("电话号码为空");
              }
            }
            return true;
          }

        });

      })
    });
    // 点击按钮触发，或一些其他的触发条件
    $scope.tanchuangattention = function(id) {
      //获取人员详细信息
      $searchdata.personDetail(id);

    };


    $myattentionser.getAttentionList();
    $scope.$on('attention.update',function (event) {
      $scope.$apply(function () {
        $timeout(function () {
          $ionicLoading.hide();
          $scope.contactsListatten=$myattentionser.getAttentionaaList();
        });
      })
    });


    //取消关注
    $scope.removeattention = function (id) {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 100,
        showDelay: 0
      });
      if ($scope.myid==id){
        $ToastUtils.showToast("无法对自己进行该项操作")
      }else {
        var membersAerr = [];
        membersAerr.push(id);
        $addattentionser.removeAttention111(membersAerr);
      }
    }
    $scope.$on('attention.delete', function (event) {
      $scope.$apply(function () {
        $myattentionser.getAttentionList();
      })
    });


  })
  .controller('attentionDetailCtrl',function ($scope,$state,$stateParams,$savaLocalPlugin,$phonepluin,$searchdata,$api,$searchlocal,$addattentionser,$ToastUtils) {
    //返回关注列表界面
    $scope.backAttention = function () {
      $state.go("myAttention");
    }
    //拿上一个页面传的参数
    $scope.UserIDattention = $stateParams.UserIDatten;



    //获取人员详细信息
    $searchdata.personDetail($scope.UserIDattention);
    $scope.$on('person.update',function (event) {
      $scope.$apply(function () {
        $scope.personsdetail111=$searchdata.getPersonDetail().user;

      })
    });




    //存本地
    $scope.insertPhoneSearch = function(name,phonenumber) {

      $savaLocalPlugin.insert(name,phonenumber);
    };

    //打电话
    $scope.callSearch = function(phonenumber,name) {
      $phonepluin.call(phonenumber,name);
    };
    //发短信
    $scope.smsSearch = function(phonenumber) {
      $phonepluin.sms(phonenumber);
    };


    //取消关注
    $scope.removeattention=function (id) {
      var membersAerr=[];
      membersAerr.push(id);
      $addattentionser.removeAttention111(membersAerr);
    }
    $scope.$on('attention.delete',function (event) {
      $scope.$apply(function () {
        $scope.personsdetail111.IsAttention=$addattentionser.getaddAttention111();

      })
    });

    //添加关注
    $scope.addattentiondetail = function(id) {
      var membersAerr=[];
      membersAerr.push(id);
      $addattentionser.addAttention111(membersAerr);
    };
    $scope.$on('attention.add',function (event) {
      $scope.$apply(function () {
        $scope.personsdetail111.IsAttention=$addattentionser.getaddAttention111();
      })
    });

  })

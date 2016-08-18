/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('application.controllers', [])
  .controller('ChatsCtrl', function ($scope,$timeout,$mqtt,$greendao,$rootScope,$chatarr) {
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

    //确保在应用模块能收到消息，实现消息监听
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
  })


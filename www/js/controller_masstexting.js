/**
 * Created by Administrator on 2017/5/11.
 */
angular.module('sendfile.controllers', [])
  .controller('masstextingCtrl', function ($mqtt, $scope, $ToastUtils, $greendao, $stateParams, $cordovaDevice, $chatarr, $pubionicloading, $state,$timeout,$location,$ionicPlatform,$ionicHistory) {
    $pubionicloading.showloading('','Loading...');
    $scope.topicids = [];
    $scope.userIds = [];//接受者ID
    $scope.users = [];//接收者信息
    var count = 0;
    $scope.topicids = $stateParams.topicids.split(',');

    $mqtt.getUserInfo(function (msg) {
      $scope.myUserID = msg.userID;
      $scope.myUserName = msg.userName;

      for (var i = 0; i < $scope.topicids.length; i++) {
        if ($scope.topicids[i].split('##')[0] != $scope.myUserID) {
          $scope.users.push({"id": $scope.topicids[i].split('##')[0], "name": $scope.topicids[i].split('##')[1]});
          $scope.userIds.push($scope.topicids[i].split('##')[0]);
        }
      }

    }, function (msg) {
      // $ToastUtils.showToast(msg)
    });
    $pubionicloading.hide();

    //自己id 211586
    //type *  topic： 他人id  id：他人id  localuser:我的姓名  localuserID:我的 id  sqlid:重发为空
    $scope.openDocumentWindow = function (type, topic, content, id, localuser, localuserId, sqlid) {
      $mqtt.openDocWindow(type, function (fileData) {
        $pubionicloading.showloading('','Loading...');
        $mqtt.getMqtt().getTopic(topic, "User", function (userTopic) {

          for (var i = 0; i < userTopic.length; i++) {
            $scope.suc = $mqtt.sendDocFileMsg(userTopic[i], fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], topic[i], localuser, localuserId, Date.now(), 'File', fileData[0], $mqtt);
            $scope.send_content = "";
          }
        });

      }, function (err) {
      });
    };

    $scope.$on('msgs.error', function (event) {
      $ToastUtils.showToast("发送失败,请检查网络！")
      $state.go('tab.message');
      $pubionicloading.hide();
    });
    /**
     * 文件发送成功监听
     */

    $scope.$on('sendFilesuccess.update', function (event, sessionid) {
      $scope.$apply(function () {
        count++;

        for (var i = 0; i < $scope.users.length; i++) {
          if (sessionid == $scope.users[i].id) {
            $scope.userName = $scope.users[i].name;
          }
        }


        $scope.insertSql(sessionid, $scope.userName);


      })
    });


    $scope.insertSql = function (id, sessionName) {
            $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', id, function (data) {
              if (data[0].messagetype === "Image") {
                // alert("返回即时通");
                $scope.lastText = "[图片]";//最后一条消息内容
              } else if (data[0].messagetype === "LOCATION") {
                $scope.lastText = "[位置]";//最后一条消息内容
              } else if (data[0].messagetype === "File") {
                $scope.lastText = "[文件]";//最后一条消息内容
              } else if (data[0].messagetype === 'Audio') {
                $scope.lastText = "[语音]";//最后一条消息内容
              } else if (data[0].messagetype === 'Vedio') {
                $scope.lastText = "[小视频]";//最后一条消息内容
              } else {
                $scope.lastText = data[0].message;//最后一条消息内容
              }
              $scope.lastDate = data[0].when;//最后一条消息的时间
              $scope.chatName = data[0].chatName;//对话框名称
              $scope.imgSrc = '';//最后一条消息的头像
              $scope.srcName = data[0].username;//消息来源人名字
              $scope.srcId = data[0].senderid;//消息来源人id
              $scope.daytype = data[0].daytype;//最后一条消息的日期类型
              $scope.isSuccess = data[0].isSuccess;//最后一条消息的成功与否状态
              $scope.isFailure = data[0].isFailure;//最后一条消息的失败与否状态
              $scope.isRead = data[0].isread;//最后一条消息的已读未读状态
              $scope.messagetype = data[0].messagetype;//最后一条消息的类型

              var chatitem = {};
              chatitem.id = id;
              chatitem.chatName = sessionName;
              chatitem.imgSrc = '1';
              chatitem.lastText = $scope.lastText;
              chatitem.count = '0';
              chatitem.isDelete = 'false';
              chatitem.lastDate = $scope.lastDate;
              chatitem.chatType = 'User';
              chatitem.senderId = $scope.srcId;//发送者id
              chatitem.senderName = $scope.srcName;//发送者名字
              chatitem.daytype = $scope.daytype;
              chatitem.isSuccess = $scope.isSuccess;
              chatitem.isFailure = $scope.isFailure;
              chatitem.messagetype = $scope.messagetype;
              chatitem.isRead = $scope.isRead;
              $greendao.saveObj('ChatListService', chatitem, function (data) {

                if ($scope.users.length == count) {
                  $pubionicloading.hide();
                  $ToastUtils.showToast("发送成功！")
                  $state.go('tab.message');
                }

              }, function (err) {
                // alert("chat保存失败");
              });
        },function (err) {
        });
    }


    $ionicPlatform.registerBackButtonAction(function(e) {
      if ($location.path() == '/masstexting/'+$stateParams.topicids){
        $state.go('tab.message');
      } else {
        $ionicHistory.goBack();
      }
      e.preventDefault();
      return false;
    }, 501);


  })

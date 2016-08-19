/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('my.controllers', [])
  .controller('AccountCtrl', function ($scope, $state, $ionicPopup, $ionicLoading, $http, $contacts, $cordovaCamera, $ionicActionSheet, $phonepluin, $api,$searchdata,$ToastUtils,$rootScope,$timeout,$mqtt,$chatarr,$greendao) {
    $scope.name = "";
    $mqtt.getUserInfo(function (msg) {
      $scope.UserID = msg.userID
      $scope.mymypersonname=msg.userName
      if ($scope.mymypersonname.length>2){
        $scope.jiename=$scope.mymypersonname.substring(($scope.mymypersonname.length-2),$scope.mymypersonname.length);
      }else {
        $scope.jiename=$scope.mymypersonname
      }
    }, function (msg) {
      $ToastUtils.showToast(msg)
    });

    // $searchdata.personDetail($rootScope.rootUserId);
    // $scope.$on('person.update', function (event) {
    //   $scope.$apply(function () {
    //     $scope.mymypersonname = $searchdata.getPersonDetail().user.UserName;
    //
    //   })
    // });



    // $api.getUser($rootScope.rootUserId,function (msg) {
    //   $scope.mymypersonname=msg.user.UserName;
    //   alert( $scope.mymypersonname)
    //   if ($scope.mymypersonname.length>2){
    //     $scope.jiename=$scope.mymypersonname.substring(($scope.mymypersonname.length-2),$scope.mymypersonname.length);
    //   }else {
    //     $scope.jiename=$scope.mymypersonname
    //   }
    //   alert($scope.jiename)
    // },function (msg) {
    //   $ToastUtils.showToast(msg)
    // });



    $scope.gomyinformation = function () {
      $state.go("myinformation", {
        "UserIDfor": $scope.UserID
        // "youmeiyou":$scope.youmeiyou,
      });
    }

    $scope.goacountsettion = function () {
      $state.go("accountsettion", {
        "UserIDset": $scope.UserID
        // "youmeiyou":$scope.youmeiyou,
      });
    }
    $scope.goaboutus = function () {
      $state.go("aboutours", {
        "UserIDabout": $scope.UserID
        // "youmeiyou":$scope.youmeiyou,
      });
    }
    $scope.setpic = function (name) {
      // 显示操作表
      $ionicActionSheet.show({
        buttons: [
          {text: '拍照上传'},
          {text: '选择相册'}
        ],
        titleText: '上传头像',
        cancelText: '取消',
        buttonClicked: function (index) {
          if (index == 0) {
            $scope.takePhoto();
          } else {
            $scope.selectphoto();
          }
          return true;
        }

      });
    }
    $scope.getpictur=function () {
      // alert("劲了");
      Camera.getPicture(PictureSourceType.CAMERA).then(

        //返回一个imageURI，记录了照片的路径
        function (imageURI) {
          alert(imageURI)
        },
        function (err) {
        });
    }

    //拍照片
    $scope.takePhoto = function () {
      var options = {
        //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
        quality: 100,                                            //相片质量0-100
        destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
        sourceType: Camera.PictureSourceType.CAMERA,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库  sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,                                        //在选择之前允许修改截图
        encodingType: Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
        // targetWidth: 200,                                        //照片宽度
        // targetHeight: 200,                                       //照片高度
        mediaType: 0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
        cameraDirection: 0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true                                   //保存进手机相册
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        alert(imageData);
        // var image = document.getElementById('myImage');
        // image.src=imageData;
        //image.src = "data:image/jpeg;base64," + imageData;
        $api.setHeadPic(imageData, function (msg) {
          alert("成功")
        }, function (msg) {
          alert("失败")
        });
      }, function (err) {
        // error
        alert(err);
      });

    };
    //选相册
    $scope.selectphoto = function () {
      var options = {
        //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
        quality: 100,                                            //相片质量0-100
        destinationType: Camera.DestinationType.NATIVE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
        sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库  sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,                                        //在选择之前允许修改截图
        encodingType: Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
        // targetWidth: 200,                                        //照片宽度
        // targetHeight: 200,                                       //照片高度
        mediaType: 0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
        cameraDirection: 0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true                                   //保存进手机相册
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        alert(imageData);
        $api.setHeadPic(imageData, function (msg) {
          alert("成功")
        }, function (msg) {
          alert("失败")
        });
        // var image = document.getElementById('myImage');
        // image.src=imageData;
        //image.src = "data:image/jpeg;base64," + imageData;
      }, function (err) {
        // error
        alert(err);
      });

    };


    // document.addEventListener('deviceready', function () {
    //   $mqtt.getMqtt().getString('name', function (message) {
    //     if (message != null && message != '') {
    //       $scope.name = message;
    //
    //
    //     }
    //   }, function (message) {
    //     alert(message);
    //   });
    // });
    // $scope.name="";
    /*$scope.fetch = function() {
     $cordovaPreferences.fetch('name')
     .success(function(value) {
     if(value != null && value != ''){
     $scope.name=value;
     }
     })
     .error(function(error) {
     })
     };*/
    // $scope.fetch();
    // 一个确认对话框
    $scope.showConfirm = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: '<strong>注销用户?</strong>',
        template: '你确定要退出当前用户吗?',
        okText: '确定',
        cancelText: '取消'
      });
      confirmPopup.then(function (res) {
        if (res) {

          $mqtt.getMqtt().save('name', '', function (message) {
            $mqtt.disconnect(function (message) {
              $state.go("login");
            }, function (message) {
            });
          }, function (message) {
            alert(message);
          });
        } else {
          // alert('不确定');
          $ToastUtils.showToast("退出登录失败")
        }
      });
    };

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

  .controller('myinformationCtrl', function ($scope, $http, $state, $stateParams, $searchdatadianji,$ionicPopup,$api,$ToastUtils) {
    $scope.UserIDforhou = $stateParams.UserIDfor;
    $scope.goAcount = function () {
      $state.go("tab.account");
    }
    $searchdatadianji.personDetaildianji($scope.UserIDforhou)

    $scope.$on('person.dianji', function (event) {
      $scope.$apply(function () {
        $scope.mypersons = $searchdatadianji.getPersonDetaildianji();
      })
    });
    // 修改个人资料
    $scope.updateinformation = function () {
      $scope.data = {};
      var myPopup = $ionicPopup.show({
        template: ' <label class="item item-input"><i class="icon  ion-ios-unlocked-outline positive positive"></i><input type="password" placeholder="修改手机号" ng-model="data.phonea"></label> <label class="item item-input"><i class="icon  ion-ios-unlocked-outline positive positive"></i><input type="password" placeholder="修改办公电话" ng-model="data.phoneb"></label> <label class="item item-input"><i class="icon  ion-ios-unlocked-outline positive positive"></i><input type="password" placeholder="修改邮箱" ng-model="data.email"></label>',
        title: '修改个人资料',
        subTitle: '请至少修改一项内容，否则无法提交',
        scope: $scope,
        buttons: [
          {text: '取消'},
          {
            text: '<b>确定</b>',
            type: 'button-positive',
            onTap: function (e) {
             // alert("老密码:"+$scope.data.phonea+"新密码:"+$scope.data.phoneb+"确认密码:"+$scope.data.email);

              var arr={};
              /*var arr={
                'Mobile':$scope.data.phonea,
                'FixPhone':$scope.data.phoneb,
                'Email':$scope.data.email
              };*/
              var string1="";
              var string2="";
              var string3="";
              if ($scope.data.phonea!=""){
                string1=$scope.data.phonea;
                arr.MB = string1;
              }
              if($scope.data.phoneb!=""){
                string2=$scope.data.phoneb;
                arr.FP = string2;
              }
              if($scope.data.email!=""){
                string3=$scope.data.email;
                arr.EM = string3;
              }
              $api.updateUserInfo(arr,function (msg) {
                $ToastUtils.showToast("修改个人资料成功")
                $searchdatadianji.personDetaildianji($scope.UserIDforhou);
              },function (msg) {
                $ToastUtils.showToast(msg)
              })
            }
          },
        ]
      });
      myPopup.then(function (res) {

      });
      // myPopup.close(); //关闭
    };
  })
  .controller('accountsettionCtrl', function ($scope, $http, $state, $stateParams, $api, $ionicPopup, $ionicLoading, $cordovaFileOpener2, $mqtt,$ToastUtils) {
    $scope.meizuo=function () {
      $ToastUtils.showToast("此功能暂未开发");
    }
    $scope.UserIDsethou = $stateParams.UserIDset;
    $scope.goAcount = function () {
      $state.go("tab.account");
    }
    // 修改密码
    $scope.showPopup = function () {
      $scope.data = {}
      var myPopup = $ionicPopup.show({
        template: ' <label class="item item-input"><i class="icon  ion-ios-unlocked-outline positive positive"></i><input type="password" placeholder="请输入原密码" ng-model="data.oldpassword"></label> <label class="item item-input"><i class="icon  ion-ios-unlocked-outline positive positive"></i><input type="password" placeholder="请输入新密码" ng-model="data.newpassword"></label> <label class="item item-input"><i class="icon  ion-ios-unlocked-outline positive positive"></i><input type="password" placeholder="请确认新密码" ng-model="data.enterpassword"></label>',
        title: '修改密码',
        subTitle: '区分大小写，请认真填写',
        scope: $scope,
        buttons: [
          {text: '取消'},
          {
            text: '<b>确定</b>',
            type: 'button-positive',
            onTap: function (e) {
              //       alert("老密码:"+$scope.data.oldpassword+"新密码:"+$scope.data.newpassword+"确认密码:"+$scope.data.enterpassword);
              $api.updatePwd($scope.data.oldpassword, $scope.data.newpassword, $scope.data.enterpassword, function (msg) {
                $ToastUtils.showToast("修改密码成功")
              }, function (msg) {
                $ToastUtils.showToast(msg)
              })
            }
          },
        ]
      });
      myPopup.then(function (res) {

      });
      // myPopup.close(); //关闭
    };
    //在线升级
    $scope.zaixianshengji = function () {
      $api.checkUpdate($ionicPopup, $ionicLoading, $cordovaFileOpener2, $mqtt);
    }

  })
  .controller('aboutoursCtrl', function ($scope, $http, $state, $stateParams) {
    $scope.UserIDabouthou = $stateParams.UserIDabout;
    $scope.goAcount = function () {
      $state.go("tab.account");
    }

  })


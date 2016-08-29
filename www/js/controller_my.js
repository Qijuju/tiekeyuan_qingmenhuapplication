/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('my.controllers', [])
  .controller('AccountCtrl', function ($scope, $state, $ionicPopup, $ionicLoading, $http, $contacts, $cordovaCamera, $ionicActionSheet, $phonepluin, $api,$searchdata,$ToastUtils,$rootScope,$timeout,$mqtt,$chatarr,$greendao,$cordovaImagePicker,$grouparr) {
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
    // $scope.setpic=function () {
    //   // alert("劲了");
    //   Camera.getPicture(PictureSourceType.CAMERA).then(
    //
    //     //返回一个imageURI，记录了照片的路径
    //     function (imageURI) {
    //       alert(imageURI)
    //     },
    //     function (err) {
    //     });
    //
    // }

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
    //image picker
    $scope.selectphoto = function() {
      var options = {
        maximumImagesCount: 1,
        // width: 800,
        // height: 800,
        quality: 100
      };

      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          // $scope.images_list.push(results[0]);
          $api.setHeadPic(results[0], function (msg) {
                  alert("成功")
                }, function (msg) {
                  alert("失败")
                });
        }, function (error) {
          // error getting photos
        });
    }
    // //选相册
    // $scope.selectphoto = function () {
    //   var options = {
    //     //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
    //     quality: 100,                                            //相片质量0-100
    //     destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
    //     sourceType: Camera.PictureSourceType.PHOTOLIBRARY,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库  sourceType: Camera.PictureSourceType.CAMERA,
    //     allowEdit: false,                                       //在选择之前允许修改截图
    //     encodingType: Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
    //     // targetWidth: 200,                                        //照片宽度
    //     // targetHeight: 200,                                       //照片高度
    //     mediaType: 0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
    //     cameraDirection: 0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
    //     popoverOptions: CameraPopoverOptions,
    //     saveToPhotoAlbum: true                                   //保存进手机相册
    //   };
    //   $cordovaCamera.getPicture(options).then(function (imageData) {
    //     alert(imageData);
    //     $api.setHeadPic(imageData, function (msg) {
    //       alert("成功")
    //     }, function (msg) {
    //       alert("失败")
    //     });
    //     // var image = document.getElementById('myImage');
    //     // image.src=imageData;
    //     //image.src = "data:image/jpeg;base64," + imageData;
    //   }, function (err) {
    //     // error
    //     alert(err);
    //   });
    //
    // };


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
                      alert("my group监听");
                      /**
                       *  若会话列表有该群聊，取出该会话最后一条消息，并显示在会话列表上
                       *
                       */
                      $scope.savemymsg();
                    });
                  });
                  $rootScope.isGroupSend = 'false';
                }, function (err) {
                  alert(err + "查询群组对应关系");
                });
              }
            }else{
              alert("有会话的时候");
              $scope.savemymsg();
            }
          }, function (err) {
            alert("收到群组未读消息时，查询chat列表" + err);
          });

          $scope.savemymsg=function () {
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
  .controller('accountsettionCtrl', function ($scope, $http, $state, $stateParams, $api, $ionicPopup, $ionicLoading, $cordovaFileOpener2, $mqtt,$ToastUtils,$cordovaBarcodeScanner) {
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
    //扫一扫
    $scope.scanCode = function () {
      $cordovaBarcodeScanner.scan().then(function(imageData) {
        alert(imageData.text);
        // console.log("Barcode Format -> " + imageData.format);
        // console.log("Cancelled -> " + imageData.cancelled);
      }, function(error) {
        alert( error);
      });
    };
    $scope.goGesturepassword = function () {
      $state.go("gesturepassword");
    }

  })
  .controller('aboutoursCtrl', function ($scope, $http, $state, $stateParams) {
    $scope.UserIDabouthou = $stateParams.UserIDabout;
    $scope.goAcount = function () {
      $state.go("tab.account");
    }

  })
  .controller('gesturepasswordCtrl', function ($scope, $http, $state, $stateParams,$mqtt) {
    $mqtt.getUserInfo(function (msg) {
      $scope.UserID = msg.userID
    }, function (msg) {
    });
    $scope.goSetting = function () {
      $state.go("accountsettion", {
        "UserIDset": $scope.UserID
      });
    }
    var opt = {
      chooseType: 3, // 3 , 4 , 5,
      width: 350, // lock wrap width
      height: 350, // lock wrap height
      container: 'element', // the id attribute of element
      inputEnd: function(psw){} // when draw end param is password string
    }
    var lock = new H5lock(opt);
    lock.init();

    $scope.resetpassword = function () {
      lock.reset() // reset the lock
    }
    // lock.drawStatusPoint('notright') // draw the last notright circle
    //
    // lock.drawStatusPoint('right') // draw the last right circle
    //


  })


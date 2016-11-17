/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('message.controllers', [])
  .controller('MessageDetailCtrl', function ($scope, $state, $http, $ionicScrollDelegate, $mqtt, $ionicActionSheet, $greendao, $timeout, $rootScope, $stateParams,$chatarr,$ToastUtils, $cordovaCamera,$api,$searchdata,$phonepluin,$ScalePhoto,$ionicHistory,$ionicLoading,$ionicPlatform,$location) {
    $scope.$on('sendprogress.update', function (event) {
      $scope.$apply(function () {
        // $ToastUtils.showToast("进度进行中~~~",null,null);
        $scope.msgs=$mqtt.getDanliao();
      });
    });
    var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
    $scope.a=0;
    $scope.gengduo=function () {

      if ($scope.a==0){
        //加滑动底部
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
        document.getElementById("contentaa").style.marginBottom='165px';
        $scope.a=1;
      }else {
        document.getElementById("contentaa").style.marginBottom='0px';
        $scope.a=0;
      }
    };
    $scope.zhiling=function () {
      document.getElementById("contentaa").style.marginBottom='0px';
      $scope.a=0;
    };

    //清表数据
    // $greendao.deleteAllData('MessagesService',function (data) {
    //   $ToastUtils.showToast(data);
    // },function (err) {
    //   $ToastUtils.showToast(err);
    // });
    $scope.userId = $stateParams.id; //对方id
    // alert("单聊对方id"+$scope.userId);
    $scope.viewtitle = $stateParams.ssid;//接收方姓名
    $scope.groupType = $stateParams.grouptype;//聊天类型
    //对话框名称
    $scope._id='';
    $scope.myUserID = $rootScope.rootUserId;//当前用户id
    $scope.localusr=$rootScope.userName;//当前用户名
    $scope.longitude = $stateParams.longitude;//当前用户id
    $scope.latitude=$stateParams.latitude;//当前用户名
    // alert("经度"+$scope.longitude)
    // alert("纬度"+$scope.latitude)
    var isAndroid = ionic.Platform.isAndroid();
    // $ToastUtils.showToast("当前用户名"+$scope.myUserID+$scope.localusr);


    $ionicPlatform.registerBackButtonAction(function (e) {
      if($location.path()==('/messageDetail/'+$scope.userId+'/'+$scope.viewtitle+'/'+$scope.groupType+'/'+$scope.longitude+'/'+$scope.latitude)){
        $greendao.queryData('ChatListService','where id =?',$scope.userId,function (data) {
          if(data.length === 0){  //如果没有该会话，则先判断message表有无数据，有保存返回，没有直接返回
            $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.userId,function (data) {
              //保存最后一条消息(公有方法)，先初始化
              $scope.saveUsrLastMsg=function () {
                // alert("进来最后一条消息保存");
                //没有会话，但是该聊天列表有消息，则创建会话列表，并保存最后一条消息

                if(data[0].messagetype === "Image"){
                  // alert("返回即时通");
                  $scope.lastText = "[图片]";//最后一条消息内容
                }else if(data[0].messagetype === "LOCATION"){
                  $scope.lastText = "[位置]";//最后一条消息内容
                }else if(data[0].messagetype === "File"){
                  $scope.lastText = "[文件]";//最后一条消息内容
                }else {
                  $scope.lastText = data[0].message;//最后一条消息内容
                }
                $scope.lastDate = data[0].when;//最后一条消息的时间
                $scope.chatName = data[0].username;//对话框名称
                $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
                $scope.srcName = data[0].username;//消息来源人名字
                $scope.srcId = data[0].senderid;//消息来源人id
                $scope.daytype=data[0].daytype;//最后一条消息的日期类型
                $scope.isSuccess=data[0].isSuccess;//最后一条消息的成功与否状态
                // alert("最后一条消息的日期类型+成功状态"+$scope.daytype+$scope.isSuccess);
                //保存最后一条数据到chat表
                $greendao.queryData('ChatListService','where id =?',$scope.userId,function (data) {
                  //赋值chat对象
                  var chatitem = {};
                  chatitem.id = data[0].id;
                  chatitem.chatName = data[0].chatName;
                  chatitem.imgSrc = $scope.imgSrc;
                  chatitem.lastText = $scope.lastText;
                  chatitem.count = '0';
                  chatitem.isDelete = data[0].isDelete;
                  chatitem.lastDate = $scope.lastDate;
                  chatitem.chatType = data[0].chatType;
                  chatitem.senderId = $scope.srcId;//发送者id
                  chatitem.senderName = $scope.srcName;//发送者名字
                  chatitem.daytype=$scope.daytype;
                  chatitem.isSuccess=$scope.isSuccess;
                  $chatarr.updatedatanosort(chatitem);
                  // alert("chatype"+chatitem.chatType+"发送者id"+chatitem.senderId+"发送者名字"+chatitem.senderName);
                  // //保存到数据库chat表
                  $greendao.saveObj('ChatListService',chatitem,function (data) {
                    // alert("进来最后一条数据chat表保存啦");
                    $greendao.queryDataByIdAndIsread($scope.userId,'0',function (data) {
                      if(data.length>0){
                        for(var i=0;i<data.length;i++){
                          // alert("进入for循环的长度"+data.length);
                          var messaegeitem={};
                          messaegeitem._id=data[i]._id;
                          messaegeitem.sessionid=data[i].sessionid;
                          messaegeitem.type=data[i].type;
                          // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
                          messaegeitem.from=data[i].from;
                          messaegeitem.message=data[i].message;
                          messaegeitem.messagetype=data[i].messagetype;
                          messaegeitem.platform=data[i].platform;
                          messaegeitem.when=data[i].when;
                          messaegeitem.isFailure=data[i].isFailure;
                          messaegeitem.isDelete=data[i].isDelete;
                          messaegeitem.imgSrc=data[i].imgSrc;
                          messaegeitem.username=data[i].username;
                          messaegeitem.senderid=data[i].senderid;
                          messaegeitem.isSuccess=data[i].isSuccess;
                          messaegeitem.daytype=data[i].daytype;
                          messaegeitem.istime=data[i].istime;
                          if(data[i].isread ==='0'){
                            // alert("拿到库里的消息阅读状态"+data[i].isread);
                            data[i].isread ='1';
                            messaegeitem.isread=data[i].isread;
                            // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                            $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                              // alert("保存成功");
                              $state.go("tab.message", {
                                "id": $scope.userId,
                                "sessionid": $scope.chatName,
                                "grouptype":"User"
                              });
                            },function (err) {
                            });
                          }
                        }
                      }else{
                        //chat表count值改变过后并且message表消息状态全部改变以后，返回主界面
                        $state.go("tab.message", {
                          "id": $scope.userId,
                          "sessionid": $scope.chatName,
                          "grouptype":"User"
                        });
                      }
                    },function (err) {
                    });
                  },function (err) {
                  });

                },function (err) {
                });
              }

              if(data.length >0){
                $rootScope.isPersonSend='true';
                if ($rootScope.isPersonSend === 'true') {
                  // $ToastUtils.showToast("长度");
                  //往service里面传值，为了创建会话
                  $chatarr.getIdChatName($scope.userId,$scope.viewtitle);
                  $scope.items = $chatarr.getAll($rootScope.isPersonSend,'User');
                  // alert($scope.items.length + "单聊长度");
                  $scope.$on('chatarr.update', function (event) {
                    $scope.$apply(function () {
                      $scope.items = $chatarr.getAll($rootScope.isPersonSend,'User');
                      // alert("入完数据库了吗？");
                      $scope.saveUsrLastMsg();
                    });
                  });
                  $rootScope.isPersonSend = 'false';
                }
              }else{
                $state.go("tab.message", {
                  "id": $scope.userId,
                  "sessionid": $scope.chatName,
                  "grouptype":"User"
                });
              }
            },function (err) {
            });
          }else{ //如果有该会话，取出message表最后一条数据并保存
            $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.userId,function (data) {

              if(data[0].messagetype === "Image"){
                // alert("返回即时通");
                $scope.lastText = "[图片]";//最后一条消息内容
              }else if(data[0].messagetype === "LOCATION"){
                $scope.lastText = "[位置]";//最后一条消息内容
              }else if(data[0].messagetype === "File"){
                $scope.lastText = "[文件]";//最后一条消息内容
              }else {
                $scope.lastText = data[0].message;//最后一条消息内容
              }
              $scope.lastDate = data[0].when;//最后一条消息的时间
              $scope.chatName = data[0].username;//对话框名称
              $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
              $scope.srcName = data[0].username;//消息来源人名字
              $scope.srcId = data[0].senderid;//消息来源人id
              $scope.daytype=data[0].daytype;//最后一条消息的日期类型
              $scope.isSuccess=data[0].isSuccess;//最后一条消息的成功与否状态
              // alert("最后一条消息的日期类型+成功状态"+$scope.daytype+$scope.isSuccess);

              //保存最后一条数据到chat表
              $greendao.queryData('ChatListService','where id =?',$scope.userId,function (data) {
                //赋值chat对象
                var chatitem = {};
                chatitem.id = data[0].id;
                chatitem.chatName = data[0].chatName;
                chatitem.imgSrc = $scope.imgSrc;
                chatitem.lastText = $scope.lastText;
                chatitem.count = '0';
                chatitem.isDelete = data[0].isDelete;
                chatitem.lastDate = $scope.lastDate;
                chatitem.chatType = data[0].chatType;
                chatitem.senderId = $scope.srcId;//发送者id
                chatitem.senderName = $scope.srcName;//发送者名字
                chatitem.daytype=$scope.daytype;
                chatitem.isSuccess=$scope.isSuccess;
                $chatarr.updatedatanosort(chatitem);
                // alert("chatype"+chatitem.chatType+"发送者id"+chatitem.senderId+"发送者名字"+chatitem.senderName);
                //保存到数据库chat表
                $greendao.saveObj('ChatListService',chatitem,function (data) {
                  // alert("进来最后一条数据chat表保存啦");
                  $greendao.queryDataByIdAndIsread($scope.userId,'0',function (data) {
                    if(data.length>0){
                      for(var i=0;i<data.length;i++){
                        // alert("进入for循环的长度"+data.length);
                        var messaegeitem={};
                        messaegeitem._id=data[i]._id;
                        messaegeitem.sessionid=data[i].sessionid;
                        messaegeitem.type=data[i].type;
                        // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
                        messaegeitem.from=data[i].from;
                        messaegeitem.message=data[i].message;
                        messaegeitem.messagetype=data[i].messagetype;
                        messaegeitem.platform=data[i].platform;
                        messaegeitem.when=data[i].when;
                        messaegeitem.isFailure=data[i].isFailure;
                        messaegeitem.isDelete=data[i].isDelete;
                        messaegeitem.imgSrc=data[i].imgSrc;
                        messaegeitem.username=data[i].username;
                        messaegeitem.senderid=data[i].senderid;
                        messaegeitem.isSuccess=data[i].isSuccess;
                        messaegeitem.daytype=data[i].daytype;
                        messaegeitem.istime=data[i].istime;
                        if(data[i].isread ==='0'){
                          // alert("拿到库里的消息阅读状态"+data[i].isread);
                          data[i].isread ='1';
                          messaegeitem.isread=data[i].isread;
                          // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                          $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                            // alert("保存成功");
                            //chat表count值改变过后并且message表消息状态全部改变以后，返回主界面
                            $state.go("tab.message", {
                              "id": $scope.userId,
                              "sessionid": $scope.chatName,
                              "grouptype":"User"
                            });
                          },function (err) {
                          });
                        }
                      }
                    }else {
                      //chat表count值改变过后并且message表消息状态全部改变以后，返回主界面
                      $state.go("tab.message", {
                        "id": $scope.userId,
                        "sessionid": $scope.chatName,
                        "grouptype":"User"
                      });
                    }
                  },function (err) {
                  });

                },function (err) {
                });

              },function (err) {
              });
            },function (err) {
            });
          }
        },function (err) {
        });
      }else {
        $ionicHistory.goBack();
        $ionicLoading.hide();
      }
      e.preventDefault();
      return false;


    },501)



    //一进来就检查网络是否连接
    $mqtt.setOnNetStatusChangeListener(function (succ) {
      $rootScope.netStatus = 'true';
    },function (err) {
      $rootScope.netStatus='false';
      // alert("切换网络失败时");
      // $greendao.queryData('MessagesService','where sessionid =?',$scope.userId,function (data) {
      //   alert("切换网络时"+data.length);
      //   for(var i=0;i<data.length;i++){
      //     var messaegeitem={};
      //     messaegeitem._id=data[i]._id;
      //     messaegeitem.sessionid=data[i].sessionid;
      //     messaegeitem.type=data[i].type;
      //     // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
      //     messaegeitem.from=data[i].from;
      //     messaegeitem.message=data[i].message;
      //     messaegeitem.messagetype=data[i].messagetype;
      //     messaegeitem.platform=data[i].platform;
      //     messaegeitem.when=data[i].when;
      //     messaegeitem.isDelete=data[i].isDelete;
      //     messaegeitem.imgSrc=data[i].imgSrc;
      //     messaegeitem.username=data[i].username;
      //     messaegeitem.senderid=data[i].senderid;
      //     messaegeitem.isSuccess=data[i].isSuccess;
      //     messaegeitem.isread='1';
      //     if(data[i].isSuccess === 'false'){
      //       alert("发送失败的状态有数据啦");
      //       messaegeitem.isFailure='true';
      //       $greendao.saveObj('MessagesService',messaegeitem,function (success) {
      //         alert("状态改变成功");
      //         $mqtt.detaildanliaoupdate();
      //         $rootScope.$broadcast('msgs.error');
      //       },function (err) {
      //       });
      //     }
      //   }
      // },function (err) {
      // });
    });

    $scope.$on('$ionicView.enter', function () {
      $timeout(function () {
        viewScroll.scrollBottom();
      }, 100);
    });

    //在个人详情界面点击创建聊天时，在聊天详情界面，创建chatitem
    if ($rootScope.isPersonSend === 'true') {
      // alert("长度");
      $greendao.queryData('MessagesService','where sessionid =?',$scope.userId,function (data) {
        if(data.length>0){
            $chatarr.getIdChatName($scope.userId,$scope.viewtitle);
            $chatarr.getAll($rootScope.isPersonSend,$scope.groupType);
            // $ToastUtils.showToast($scope.items.length + "长度");
            $scope.$on('chatarr.update', function (event) {
              $scope.$apply(function () {
                // alert("进入单聊会话列表监听");
                $scope.items=$chatarr.getAllData();
                // alert($scope.items.length);
              });
            });
            $rootScope.isPersonSend = 'false';
          }
        }, function (err) {
        });
    }



      //触发函数
      $scope.bindbadge= function () {
        // alert("jinlaima");
        //弹出缓冲提示
        $scope.showLoadingToast();
        //这里使用定时器是为了缓存一下加载过程，防止加载过快
        $timeout(function () {
          //停止缓冲提示
          $scope.hideLoadingToast();
        }, 1500);
      };

      $scope.showLoadingToast = function () {
        // Setup the loader
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: false,
          maxWidth: 10,
          showDelay: 0
        });
      }
      $scope.hideLoadingToast = function () {
        $ionicLoading.hide();
      }




    // $ToastUtils.showToast($scope.viewtitle+"抬头"+$scope.myUserID);
    $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,10', $scope.userId, function (data) {
      //根据不同用户，显示聊天记录，查询数据库以后，不论有没有数据，都要清楚之前数组里面的数据
      // for (var j = 0; j <= $mqtt.getDanliao().length-1; j++) {
      //   $mqtt.getDanliao().splice(j, $mqtt.getDanliao().length);//清除之前数组里存的数据
      // }
      // for (var i = 0; i <= data.length; i++) {
      //   alert("进入聊天界面看消息"+data[i].message);
      // }
      // 获取当天日期
      var myDate = new Date();
      myDate.toLocaleDateString();//可以获取当前日期
      // alert("获取当前日期"+myDate.toLocaleDateString());
      myDate.toLocaleTimeString(); //可以获取当前时间
      // alert("获取当前时间"+myDate.toLocaleTimeString());

      var year=myDate.getFullYear();//获取年份
      var month=myDate.getMonth()+1;//获取月份
      var day=myDate.getDate();//获取日期
      // alert("获取当前年月日"+year+month+day);

      var millions=new Date(year+"/"+month+"/"+day+" "+"00:00:00").getTime();
      // alert("最低毫秒值"+millions);

      var maxmillions=new Date(year+"/"+month+"/"+day+" "+"23:59:59").getTime();
      // alert("最高毫秒值"+millions);
      $mqtt.setDanliao(data);
      $scope.msgs = $mqtt.getDanliao();
      // alert("看时间"+$mqtt.getDanliao()[$scope.msgs.length-1].when);
      if($scope.msgs.length>0 && $mqtt.getDanliao()[$scope.msgs.length-1].when< millions){
        // alert("改昨天单聊进来了吗");
        for(var i=0;i<data.length;i++){
          if(data[i].istime  === 'true'){
            var messaegeitem={};
            messaegeitem._id=data[i]._id;
            messaegeitem.sessionid=data[i].sessionid;
            messaegeitem.type=data[i].type;
            messaegeitem.from=data[i].from;
            messaegeitem.message=data[i].message;
            messaegeitem.messagetype=data[i].messagetype;
            messaegeitem.platform=data[i].platform;
            messaegeitem.when=data[i].when;
            messaegeitem.isFailure=data[i].isFailure;
            messaegeitem.isDelete=data[i].isDelete;
            messaegeitem.imgSrc=data[i].imgSrc;
            messaegeitem.username=data[i].username;
            messaegeitem.senderid=data[i].senderid;
            messaegeitem.isSuccess=data[i].isSuccess;
            messaegeitem.istime=data[i].istime;
            messaegeitem.daytype='0';
            messaegeitem.isread=data[i].isread;
            $mqtt.updateDanliao(messaegeitem);
            $greendao.saveObj('MessagesService',messaegeitem,function (data) {
            },function (err) {
            });
          }
        }
      }
      //$ToastUtils.showToast($scope.msgs[$scope.msgs.length - 1]._id+"asdgf" + $scope.msgs[$scope.msgs.length - 1].message);
    }, function (err) {
      // $ToastUtils.showToast(err);
    });


    var footerBar = document.body.querySelector('#messageDetail .bar-footer');
    var txtInput = angular.element(footerBar.querySelector('textarea'));
    $scope.doRefresh = function () {
      $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,' + ($mqtt.getDanliao().length + 10), $scope.userId, function (data) {
        if ($scope.msgs.length < 50) {
          // for (var j = 0; j <= $mqtt.getDanliao().length-1; j++) {
          //   $mqtt.getDanliao().splice(j, $mqtt.getDanliao().length);//清除之前数组里存的数据
          // }
          // for (var i = 1; i <= data.length; i++) {
          //   $mqtt.getDanliao().push(data[data.length - i]);
          // }
          $mqtt.setDanliao(data);
          $scope.msgs = $mqtt.getDanliao();
        } else if ($scope.msgs.length >= 50) {
          $scope.nomore = "true";
        }
        $scope.$broadcast("scroll.refreshComplete");
      }, function (err) {
        // $ToastUtils.showToast(err);
      });
    }
    $scope.getPhoto = function(sourceTypeStr,topic, content, id,localuser,localuserId,sqlid) {
      var sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
      if (sourceTypeStr === 'PHOTOLIBRARY') {
        sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
      } else if(sourceTypeStr === 'CAMERA') {
        sourceType = Camera.PictureSourceType.CAMERA;
      }
      var options = {
        quality: 100,
        targetWidth: 1080,
        targetHeight: 1920,
        saveToPhotoAlbum: true,
        sourceType: sourceType,
        // destinationType: Camera.DestinationType.DATA_URL
        destinationType: Camera.DestinationType.FILE_URI,
        correctOrientation: true,
      };

      $cordovaCamera.getPicture(options).then(function(imageURI) {
        // console.log($stateParams.conversationType + '--' + imageURI);
        // alert(imageURI)
        var picPath = imageURI;
        console.log("getPicture:" + picPath);
        // if(isIOS){
        //   picPath = imageURI.replace('file://','');
        // }
        if(isAndroid){
          picPath = imageURI.substring(0, (imageURI.indexOf('?') != -1 ? imageURI.indexOf('?') : imageURI.length));
        }

        $mqtt.getMqtt().getTopic(topic, "User", function (userTopic) {
          $mqtt.getFileContent(picPath, function (fileData) {
            $greendao.getUUID(function (data) {
              sqlid=data;
              // alert("图片传进去的id"+sqlid);
              $scope.suc = $mqtt.sendDocFileMsg(userTopic, fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], id, localuser, localuserId, sqlid, 'Image', fileData[0],$mqtt);
              $scope.send_content = "";
              $timeout(function () {
                viewScroll.scrollBottom();
              }, 100);
              keepKeyboardOpen();
            });
          },function (err) {
          });
        }, function (msg) {
        });
      }, function(err) {
        console.error(err);
      });
    };

    $scope.openDocumentWindow = function (type, topic, content, id,localuser,localuserId,sqlid) {
      $mqtt.openDocWindow(type, function (fileData) {
        /*$mqtt.getMqtt().getTopic(topic, "User", function (userTopic) {
          $scope.suc = $mqtt.sendDocFileMsg(userTopic, 'none' + "###" + fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], id, localuser, localuserId, sqlid, "File", fileData[0], '0');
          $scope.send_content = "";
          keepKeyboardOpen();
        });*/
        // alert(fileData[0]);
        $mqtt.getMqtt().getTopic(topic, "User", function (userTopic) {
          // $ToastUtils.showToast("单聊topic"+userTopic+$scope.groupType);
          //alert(fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3] + '===' + fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3] + '===' + id + '===' + localuser + '===' + localuserId);
          var fileType = 'File';
          if (type === 'image') {
            fileType = 'Image';
          }
          $greendao.getUUID(function (data) {
            sqlid=data;
            // alert("图片传进去的id"+sqlid);
            $scope.suc = $mqtt.sendDocFileMsg(userTopic, fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], id, localuser, localuserId, sqlid, fileType, fileData[0],$mqtt);
            $scope.send_content = "";
            $timeout(function () {
              viewScroll.scrollBottom();
            }, 100);
            keepKeyboardOpen();
          })
          // alert(fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3]);
        });
        /*$api.sendDocFile('F', null, fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], function (data) {
          // alert(filePath);
          // alert(filePath);
          $scope.filePath=data[0];
          $scope.fileObjID=data[1];

          $mqtt.getMqtt().getTopic(topic, "User", function (userTopic) {
            // $ToastUtils.showToast("单聊topic"+userTopic+$scope.groupType);
            alert(fileData[3]);
            $scope.suc = $mqtt.sendDocFileMsg(userTopic, fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], $scope.fileObjID + "###" + fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], id, localuser, localuserId, sqlid, "File", fileData[0]);
            $scope.send_content = "";
            keepKeyboardOpen();
          });


        });*/
      }, function (err) {
      });
    };

    $scope.takePhoto = function (topic, content, id,localuser,localuserId,sqlid) {
      $mqtt.takePhoto(function (fileData) {
        $mqtt.getMqtt().getTopic(topic, "User", function (userTopic) {
          // $ToastUtils.showToast("单聊topic"+userTopic+$scope.groupType);
          //alert(fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3] + '===' + fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3] + '===' + id + '===' + localuser + '===' + localuserId);
          var fileType = 'Image';
          /*if (type === 'image') {
           fileType = 'Image';
           }*/
          // alert(fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3]);
          $greendao.getUUID(function (data) {
            sqlid=data;
            // alert("图片传进去的id"+sqlid);
            $scope.suc = $mqtt.sendDocFileMsg(userTopic, fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], id, localuser, localuserId, sqlid, fileType, fileData[0],$mqtt);
            $scope.send_content = "";
            $timeout(function () {
              viewScroll.scrollBottom();
            }, 100);
            keepKeyboardOpen();
          });
        });
      }, function (err) {

      });
    };

    //判断文件是否是图片
    $scope.getFileType = function (message) {
      var msg = message.split('###')[1];
      var suffix = msg.lastIndexOf("\.");
      var lastIndex = msg.substr(suffix, msg.length);
      return lastIndex === '.jpg' || lastIndex === '.jpeg' || lastIndex === '.png' || lastIndex === '.bmp' || lastIndex === '.gif' || lastIndex === 'tif';
    };

    //获取文件类型对应的图片路径
    $scope.getFileTypeImg = function (message) {
      if (message === 'location') {
        return 'img/location.png';
      }
      var msg = message.split('###')[1];
      if (message === undefined || message === null || message === '' || msg === undefined || msg === null || msg === '') {
          return 'img/ems_file.png';
      }

      // var fileSplit = message.split('###');
      // alert(fileSplit[0] + ";;" + message);
      var suffix = msg.lastIndexOf("\.");
      var lastIndex = msg.substr(suffix, msg.length);
      if (lastIndex === undefined || lastIndex === null || lastIndex === '') {
        return 'img/ems_file.png';
      }
      return $scope.getFileTypeImgByFileName(msg);
    };

    //根据相关文件类型对应的类型图片（根据文件名）
    $scope.getFileTypeImgByFileName = function (msg) {
      var suffix = msg.lastIndexOf("\.");
      var lastIndex = msg.substr(suffix, msg.length);
      if (lastIndex === undefined || lastIndex === null || lastIndex === '') {
        return 'img/ems_file.png';
      }
      if (lastIndex === '.m4a' || lastIndex === '.mp3' || lastIndex === '.mid' || lastIndex === '.xmf' || lastIndex === '.ogg' || lastIndex === '.wav' || lastIndex === '.flac' || lastIndex === '.amr') {
        return 'img/ems_audio.png';
      } else if (lastIndex === '.3gp' || lastIndex === '.mp4' || lastIndex === 'rm' || lastIndex === 'rmvb' || lastIndex === 'avi') {
        return 'img/ems_video.png';
      } else if (lastIndex === '.jpg' || lastIndex === '.gif' || lastIndex === '.png' || lastIndex === '.jpeg' || lastIndex === '.bmp') {
        return 'img/ems_photo.png';
      } else if (lastIndex === '.apk') {
        return 'img/ems_apk.png';
      } else if (lastIndex === '.ppt' || lastIndex === '.pptx' || lastIndex === '.ppsx') {
        return 'img/explorer_ppt.png';
      } else if (lastIndex === '.xls' || lastIndex === '.xlsx') {
        return 'img/explorer_xls.png';
      } else if (lastIndex === '.doc' || lastIndex === '.docx') {
        return 'img/explorer_file_doc.png';
      } else if (lastIndex === '.pdf') {
        return 'img/explorer_pdf.png';
      } else if (lastIndex === '.chm') {
        return 'img/explorer_file_archive.png';
      } else if (lastIndex === '.txt') {
        return 'img/explorer_txt.png';
      } else if (lastIndex === '.htm' || lastIndex === '.html') {
        return 'img/explorer_html.png';
      } else if (lastIndex === '.xml') {
        return 'img/explorer_xml.png';
      } else {
        return 'img/ems_file.png';
      }
    };

    //获取文件名
    $scope.getFileName = function (message) {
      var msg = message.split('###')[1];
      var lastindex = msg.lastIndexOf("\/");
      return lastindex <= 0 ? msg : msg.substr(lastindex + 1, msg.length);
    };

    $scope.getFilePath = function (message) {
      var filePath = message.split("###")[1];
      return filePath;
    };

    //打开文件
    $scope.openAllFile = function (path, imageID) {
      $api.openFileByPath(path,imageID, function (suc) {
      },function (err) {
      });
    };
    //弹出测试
    $scope.alertMsg = function (message) {
      alert(message);
    };

    /*$("#butAlbum").bind('click', function() {
     window.alert("asdfadg");
     getPhoto(Camera.PictureSourceType.PHOTOLIBRARY);
     return false;
     });*/

    window.addEventListener("native.keyboardshow", function (e) {
      viewScroll.scrollBottom();
    });

    $scope.sendSingleMsg = function (topic, content, id,localuser,localuserId,sqlid) {
      if(content === undefined || content === null || content.trim() === ''){
        $scope.send_content = "";
        return;
      }
      $mqtt.getMqtt().getTopic(topic, $scope.groupType, function (userTopic) {
        if (sqlid != undefined && sqlid != null && sqlid != '') {
          $scope.suc = $mqtt.sendMsg(userTopic, content, id, localuser, localuserId, sqlid, '', '', $mqtt);
          $scope.send_content = "";
          $timeout(function () {
            viewScroll.scrollBottom();
          }, 100);
          keepKeyboardOpen();
        } else {
          $greendao.getUUID(function (data) {
            sqlid = data;
            // alert("改造时拿到的id"+data);
            $scope.suc = $mqtt.sendMsg(userTopic, content, id, localuser, localuserId, sqlid, '', '', $mqtt);
            $scope.send_content = "";
            $timeout(function () {
              viewScroll.scrollBottom();
            }, 100);
            keepKeyboardOpen();
          });
        }
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

    $scope.i=0;
    //在联系人界面时进行消息监听，确保人员收到消息
    //收到消息时，创建对话聊天(cahtitem)
    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
          /**
           * 当在当前界面收到消息时，及时将count=0，并且将该条数据未读状态置为已读，并保存
           */
          // alert("用户id"+$scope.userId);
          $scope.msgs=$mqtt.getDanliao();
          $timeout(function () {
            viewScroll.scrollBottom();
          }, 100);
          // 获取当天日期
          var myDate = new Date();//
          myDate.toLocaleDateString();//可以获取当前日期
          // alert("获取当前日期"+myDate.toLocaleDateString());
          myDate.toLocaleTimeString(); //可以获取当前时间
          // alert("获取当前时间"+myDate.toLocaleTimeString());

          var year=myDate.getFullYear();//获取年份
          var month=myDate.getMonth()+1;//获取月份
          var day=myDate.getDate();//获取日期
          // alert("获取当前年月日"+year+month+day);

          var millions=new Date(year+"/"+month+"/"+day+" "+"00:00:00").getTime();
          // alert("最低毫秒值"+millions);

          var maxmillions=new Date(year+"/"+month+"/"+day+" "+"23:59:59").getTime();
          // alert("最高毫秒值"+maxmillions);
          $scope.timegap=$mqtt.getDanliao()[$scope.msgs.length-1].when-$mqtt.getDanliao()[$scope.msgs.length-2].when;
          var lastmsg= $mqtt.getDanliao()[$scope.msgs.length-1];
          // alert("最后一条数据："+lastmsg.message+$mqtt.getDanliao()[$scope.msgs.length-1].when);
          //如果发送前后消息间有间隔，则改变该条数据的两个状态并保存
          if($mqtt.getDanliao()[$scope.msgs.length-1].when > millions && $mqtt.getDanliao()[$scope.msgs.length-1].from === 'true'&& $scope.timegap > 900000 && $scope.timegap < maxmillions){
            $scope.i=$scope.i+1;
            // alert("进来间隔吗？"+$scope.timegap);
            var messaegeitem={};
            messaegeitem._id=lastmsg._id;
            messaegeitem.sessionid=lastmsg.sessionid;
            messaegeitem.type=lastmsg.type;
            messaegeitem.from=lastmsg.from;
            messaegeitem.message=lastmsg.message;
            messaegeitem.messagetype=lastmsg.messagetype;
            messaegeitem.platform=lastmsg.platform;
            messaegeitem.when=lastmsg.when;
            messaegeitem.isFailure=lastmsg.isFailure;
            messaegeitem.isDelete=lastmsg.isDelete;
            messaegeitem.imgSrc=lastmsg.imgSrc;
            messaegeitem.username=lastmsg.username;
            messaegeitem.senderid=lastmsg.senderid;
            messaegeitem.daytype=lastmsg.daytype;
            messaegeitem.istime=lastmsg.istime;
            //alert("走么"+$scope.i);
            if($scope.i === 2){
              messaegeitem.isSuccess='true';
              $scope.i=0;
            }else{
              //alert("走么2222"+i);
              messaegeitem.isSuccess=lastmsg.isSuccess;
            }
            messaegeitem.istime='true';
            messaegeitem.daytype=lastmsg.daytype;
            messaegeitem.isread='1';
            $greendao.saveObj('MessagesService',messaegeitem,function (data) {
              $mqtt.updateDanliao(messaegeitem);
              // alert("存储成功");
            },function (err) {
            });
          }
          // alert("时间戳"+$scope.timegap);
          $greendao.queryData('ChatListService','where id =?',$scope.userId,function (data) {
            if(data[0].count>0){
              // alert("进来查询了吗？"+data.length);
              var chatitem = {};
              chatitem.id = data[0].id;
              chatitem.chatName = data[0].chatName;
              chatitem.imgSrc = data[0].imgSrc;
              chatitem.lastText = data[0].lastText;
              chatitem.count = '0';
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = data[0].lastDate;
              chatitem.chatType = data[0].chatType;
              // alert("chatype"+chatitem.chatType);
              chatitem.senderId = data[0].senderId;//发送者id
              chatitem.senderName = data[0].senderName;//发送者名字
              chatitem.daytype=data[0].daytype;
              chatitem.isSuccess=data[0].isSuccess;
              $greendao.saveObj('ChatListService',chatitem,function (data) {
                $greendao.queryDataByIdAndIsread($scope.userId,'0',function (data) {
                  for(var i=0;i<data.length;i++){
                    // alert("进入for循环的长度"+data.length);
                    var messaegeitem={};
                    messaegeitem._id=data[i]._id;
                    messaegeitem.sessionid=data[i].sessionid;
                    messaegeitem.type=data[i].type;
                    // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
                    messaegeitem.from=data[i].from;
                    messaegeitem.message=data[i].message;
                    messaegeitem.messagetype=data[i].messagetype;
                    messaegeitem.platform=data[i].platform;
                    messaegeitem.when=data[i].when;
                    messaegeitem.isFailure=data[i].isFailure;
                    messaegeitem.isDelete=data[i].isDelete;
                    messaegeitem.imgSrc=data[i].imgSrc;
                    messaegeitem.username=data[i].username;
                    messaegeitem.senderid=data[i].senderid;
                    messaegeitem.isSuccess=data[i].isSuccess;
                    messaegeitem.istime=data[i].istime;
                    messaegeitem.daytype=data[i].daytype;
                    if(data[i].isread ==='0'){
                      // alert("拿到库里的消息阅读状态"+data[i].isread);
                      data[i].isread ='1';
                      messaegeitem.isread=data[i].isread;
                      // alert('hellonihaozhoujielun' + messaegeitem._id);
                      // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                      $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                        // alert("保存成功");
                      },function (err) {
                      });
                    }
                  }
                },function (err) {
                });
              },function (err) {

              });
            }
          },function (err) {

          });
      })
    });

    //文字或者图片发送失败
    $scope.$on('msgs.error', function (event) {
      $scope.$apply(function () {
        $scope.msgs = $mqtt.getDanliao();
        // alert("切网发送失败"+$scope.msgs.length);
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

    // 点击按钮触发，或一些其他的触发条件
    $scope.resendshow = function (topic, content, id,localuser,localuserId,sqlid,msgSingle) {
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
          if (index === 1) {
            //消息发送失败重新发送成功时，页面上找出那条带叹号的message并删除，未能正确取值。
            /*for(var i=0;i<$mqtt.getDanliao().length;i++){
              // alert(sqlid+i+"来了" );
              if($mqtt.getDanliao()[i]._id === sqlid){
                // alert("后"+$mqtt.getDanliao()[i]._id);
                $mqtt.getDanliao().splice(i, 1);
                $rootScope.$broadcast('msgs.update');
                break;
              }
            }*/
          }
          if (index === 0 && (msgSingle.messagetype === 'normal' || msgSingle.messagetype === 'Text')) {
            $scope.sendSingleMsg(topic, content, id,localuser,localuserId,sqlid);
          } else if (index === 0 && (msgSingle.messagetype === 'Image' || msgSingle.messagetype === 'File')) {
            for(var i=0;i<$mqtt.getDanliao().length;i++){
              // alert(sqlid+i+"来了" );
              if($mqtt.getDanliao()[i]._id === sqlid){
                // alert("后"+$mqtt.getDanliao()[i]._id);
                $mqtt.getDanliao().splice(i, 1);
                $rootScope.$broadcast('msgs.update');
                break;
              }
            }
            $mqtt.getMqtt().getTopic(topic, "User", function (userTopic) {
              $mqtt.getFileContent(msgSingle.message.split('###')[1], function (fileData) {
                $scope.suc = $mqtt.sendDocFileMsg(userTopic, fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], id, localuser, localuserId, sqlid, msgSingle.messagetype, fileData[0],$mqtt);
                $scope.send_content = "";
                keepKeyboardOpen();
              },function (err) {
              });
            }, function (msg) {
            });
          } else if (index === 0 && (msgSingle.messagetype === 'LOCATION')) {
            $scope.suc = $mqtt.sendMsg(userTopic, msgSingle.message, id,localuser,localuserId,sqlid,msgSingle.messagetype,'');
          } else if (index === 1) {
            for(var i=0;i<$mqtt.getDanliao().length;i++){
              // alert(sqlid+i+"来了" );
              if($mqtt.getDanliao()[i]._id === sqlid){
                // alert("后"+$mqtt.getDanliao()[i]._id);
                $greendao.deleteObj('MessagesService',msgSingle,function (data) {
                  $mqtt.getDanliao().splice(i, 1);
                  $rootScope.$broadcast('msgs.update');
                },function (err) {
                  // alert(err+"sendmistake");
                });
                break;
              }
            }
            //$rootScope.$broadcast('msgs.update');
          }
          return true;
        }
      });

    };

    $scope.backFirstMenu = function (groupType) {
      $ionicHistory.nextViewOptions({
       disableBack: true
       });

      // alert("没有该人的会话11111"+$scope.userId+groupType);
      $greendao.queryData('ChatListService','where id =?',$scope.userId,function (data) {
        if(data.length === 0){  //如果没有该会话，则先判断message表有无数据，有保存返回，没有直接返回
          $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.userId,function (data) {
            //保存最后一条消息(公有方法)，先初始化
            $scope.saveUsrLastMsg=function () {
              // alert("进来最后一条消息保存");
              //没有会话，但是该聊天列表有消息，则创建会话列表，并保存最后一条消息

              if(data[0].messagetype === "Image"){
                // alert("返回即时通");
                $scope.lastText = "[图片]";//最后一条消息内容
              }else if(data[0].messagetype === "LOCATION"){
                $scope.lastText = "[位置]";//最后一条消息内容
              }else if(data[0].messagetype === "File"){
                $scope.lastText = "[文件]";//最后一条消息内容
              }else {
                $scope.lastText = data[0].message;//最后一条消息内容
              }
              $scope.lastDate = data[0].when;//最后一条消息的时间
              $scope.chatName = data[0].username;//对话框名称
              $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
              $scope.srcName = data[0].username;//消息来源人名字
              $scope.srcId = data[0].senderid;//消息来源人id
              $scope.daytype=data[0].daytype;//最后一条消息的日期类型
              $scope.isSuccess=data[0].isSuccess;//最后一条消息的成功与否状态
              // alert("最后一条消息的日期类型+成功状态"+$scope.daytype+$scope.isSuccess);
              //保存最后一条数据到chat表
              $greendao.queryData('ChatListService','where id =?',$scope.userId,function (data) {
                //赋值chat对象
                var chatitem = {};
                chatitem.id = data[0].id;
                chatitem.chatName = data[0].chatName;
                chatitem.imgSrc = $scope.imgSrc;
                chatitem.lastText = $scope.lastText;
                chatitem.count = '0';
                chatitem.isDelete = data[0].isDelete;
                chatitem.lastDate = $scope.lastDate;
                chatitem.chatType = data[0].chatType;
                chatitem.senderId = $scope.srcId;//发送者id
                chatitem.senderName = $scope.srcName;//发送者名字
                chatitem.daytype=$scope.daytype;
                chatitem.isSuccess=$scope.isSuccess;
                // alert("chatype"+chatitem.chatType+"发送者id"+chatitem.senderId+"发送者名字"+chatitem.senderName);
                // //保存到数据库chat表
                $greendao.saveObj('ChatListService',chatitem,function (data) {
                  // alert("进来最后一条数据chat表保存啦");
                  $greendao.queryDataByIdAndIsread($scope.userId,'0',function (data) {
                    if(data.length>0){
                      for(var i=0;i<data.length;i++){
                        // alert("进入for循环的长度"+data.length);
                        var messaegeitem={};
                        messaegeitem._id=data[i]._id;
                        messaegeitem.sessionid=data[i].sessionid;
                        messaegeitem.type=data[i].type;
                        // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
                        messaegeitem.from=data[i].from;
                        messaegeitem.message=data[i].message;
                        messaegeitem.messagetype=data[i].messagetype;
                        messaegeitem.platform=data[i].platform;
                        messaegeitem.when=data[i].when;
                        messaegeitem.isFailure=data[i].isFailure;
                        messaegeitem.isDelete=data[i].isDelete;
                        messaegeitem.imgSrc=data[i].imgSrc;
                        messaegeitem.username=data[i].username;
                        messaegeitem.senderid=data[i].senderid;
                        messaegeitem.isSuccess=data[i].isSuccess;
                        messaegeitem.daytype=data[i].daytype;
                        messaegeitem.istime=data[i].istime;
                        if(data[i].isread ==='0'){
                          // alert("拿到库里的消息阅读状态"+data[i].isread);
                          data[i].isread ='1';
                          messaegeitem.isread=data[i].isread;
                          // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                          $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                            // alert("保存成功");
                            $state.go("tab.message", {
                              "id": $scope.userId,
                              "sessionid": $scope.chatName,
                              "grouptype":"User"
                            });
                          },function (err) {
                          });
                        }
                      }
                    }else{
                      //chat表count值改变过后并且message表消息状态全部改变以后，返回主界面
                      $state.go("tab.message", {
                        "id": $scope.userId,
                        "sessionid": $scope.chatName,
                        "grouptype":"User"
                      });
                    }
                  },function (err) {
                  });
                },function (err) {
                });

              },function (err) {
              });
            }

            if(data.length >0){
              $rootScope.isPersonSend='true';
              if ($rootScope.isPersonSend === 'true') {
                // $ToastUtils.showToast("长度");
                //往service里面传值，为了创建会话
                $chatarr.getIdChatName($scope.userId,$scope.viewtitle);
                $scope.items = $chatarr.getAll($rootScope.isPersonSend,'User');
                // alert($scope.items.length + "单聊长度");
                $scope.$on('chatarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.items = $chatarr.getAll($rootScope.isPersonSend,'User');
                    // alert("入完数据库了吗？");
                    $scope.saveUsrLastMsg();
                  });
                });
                $rootScope.isPersonSend = 'false';
              }
            }else{
              $state.go("tab.message", {
                "id": $scope.userId,
                "sessionid": $scope.chatName,
                "grouptype":"User"
              });
            }
          },function (err) {
          });
        }else{ //如果有该会话，取出message表最后一条数据并保存
          $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.userId,function (data) {

            if(data[0].messagetype === "Image"){
              // alert("返回即时通");
              $scope.lastText = "[图片]";//最后一条消息内容
            }else if(data[0].messagetype === "LOCATION"){
              $scope.lastText = "[位置]";//最后一条消息内容
            }else if(data[0].messagetype === "File"){
              $scope.lastText = "[文件]";//最后一条消息内容
            }else {
              $scope.lastText = data[0].message;//最后一条消息内容
            }
            $scope.lastDate = data[0].when;//最后一条消息的时间
            $scope.chatName = data[0].username;//对话框名称
            $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
            $scope.srcName = data[0].username;//消息来源人名字
            $scope.srcId = data[0].senderid;//消息来源人id
            $scope.daytype=data[0].daytype;//最后一条消息的日期类型
            $scope.isSuccess=data[0].isSuccess;//最后一条消息的成功与否状态
            // alert("最后一条消息的日期类型+成功状态"+$scope.daytype+$scope.isSuccess);

            //保存最后一条数据到chat表
            $greendao.queryData('ChatListService','where id =?',$scope.userId,function (data) {
              //赋值chat对象
              var chatitem = {};
              chatitem.id = data[0].id;
              chatitem.chatName = data[0].chatName;
              chatitem.imgSrc = $scope.imgSrc;
              chatitem.lastText = $scope.lastText;
              chatitem.count = '0';
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = $scope.lastDate;
              chatitem.chatType = data[0].chatType;
              chatitem.senderId = $scope.srcId;//发送者id
              chatitem.senderName = $scope.srcName;//发送者名字
              chatitem.daytype=$scope.daytype;
              chatitem.isSuccess=$scope.isSuccess;
              // alert("chatype"+chatitem.chatType+"发送者id"+chatitem.senderId+"发送者名字"+chatitem.senderName);
              //保存到数据库chat表
              $greendao.saveObj('ChatListService',chatitem,function (data) {
                // alert("进来最后一条数据chat表保存啦");
                $greendao.queryDataByIdAndIsread($scope.userId,'0',function (data) {
                  if(data.length>0){
                    for(var i=0;i<data.length;i++){
                      // alert("进入for循环的长度"+data.length);
                      var messaegeitem={};
                      messaegeitem._id=data[i]._id;
                      messaegeitem.sessionid=data[i].sessionid;
                      messaegeitem.type=data[i].type;
                      // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
                      messaegeitem.from=data[i].from;
                      messaegeitem.message=data[i].message;
                      messaegeitem.messagetype=data[i].messagetype;
                      messaegeitem.platform=data[i].platform;
                      messaegeitem.when=data[i].when;
                      messaegeitem.isFailure=data[i].isFailure;
                      messaegeitem.isDelete=data[i].isDelete;
                      messaegeitem.imgSrc=data[i].imgSrc;
                      messaegeitem.username=data[i].username;
                      messaegeitem.senderid=data[i].senderid;
                      messaegeitem.isSuccess=data[i].isSuccess;
                      messaegeitem.daytype=data[i].daytype;
                      messaegeitem.istime=data[i].istime;
                      if(data[i].isread ==='0'){
                        // alert("拿到库里的消息阅读状态"+data[i].isread);
                        data[i].isread ='1';
                        messaegeitem.isread=data[i].isread;
                        // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                        $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                          // alert("保存成功");
                          //chat表count值改变过后并且message表消息状态全部改变以后，返回主界面
                          $state.go("tab.message", {
                            "id": $scope.userId,
                            "sessionid": $scope.chatName,
                            "grouptype":"User"
                          });
                        },function (err) {
                        });
                      }
                    }
                  }else {
                    //chat表count值改变过后并且message表消息状态全部改变以后，返回主界面
                    $state.go("tab.message", {
                      "id": $scope.userId,
                      "sessionid": $scope.chatName,
                      "grouptype":"User"
                    });
                  }
                },function (err) {
                });

              },function (err) {
              });

            },function (err) {
            });
          },function (err) {
          });
        }
      },function (err) {
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
      // alert("十大疯狂豪斯达克沙地"+$scope.userId+$scope.viewtitle);
      $state.go('personalSetting', {
        id: $scope.userId,
        ssid:$scope.viewtitle,
        sessionid:$scope.userId
      });
    };

    //点击定位，跳转查询位置界面
    $scope.gogelocation = function (messagetype,topic, content, id,localuser,localuserId,sqlid,groupType) {
      $state.go('sendGelocation', {
        topic:topic,
        id: id,
        ssid:$scope.viewtitle,
        localuser:localuser,
        localuserId:localuserId,
        sqlid:sqlid,
        grouptype:groupType,
        messagetype:messagetype
      });
    };
    var map ="";
    var point ="";
    // $scope.changelocation =function (content) {
    //   alert("jinlaisddfsdsdf===");
    //   var long=content.substring(0,(content).indexOf(','));
    //   var lat=content.substring((content).indexOf(',')+1,content.length);
    //   alert("long"+long);
    //   alert("lat"+lat);
    //   map = new BMap.Map("container"); // 创建地图实例
    //   point = new BMap.Point(long, lat); // 创建点坐标
    //   map.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别
    //   // var marker = new BMap.Marker(point); // 创建标注
    //   // map.addOverlay(marker); // 将标注添加到地图中
    // }

    $scope.godetail=function (userid) {
      $state.go('person',{
        'userId':userid
      });
    }

    $scope.entermap=function (content) {
      $scope.longitude=content.split(",")[0];//content.substring(0,(content).indexOf(','));
      $scope.latitude=content.split(",")[1];//content.substring((content).indexOf(',')+1,content.length);
      // alert("发送经纬度"+content+"sdfs"+$scope.longitude+"-----------"+$scope.latitude);
      $state.go('mapdetail', {
        id: $scope.userId,
        ssid:$scope.viewtitle,
        grouptype:$scope.groupType,
        ismygroup:'false',
        longitude:$scope.longitude,
        latitude:$scope.latitude
      });
    }
    //发送图片的时候打开图片查看大图
    $scope.boostImage=function (filepath) {
      $ScalePhoto.scale(filepath,function (msg) {

      },function (error) {

      })
    }
    $scope.netScaleImage=function (fileid,filename,samllfilepath) {
      $ScalePhoto.netScale(fileid,filename,samllfilepath,function (msg) {

      },function (err) {

      })

    }

    $scope.callperson=function () {
      $searchdata.personDetail($scope.userId);
    }
    $scope.$on('person.update', function (event) {
      $scope.$apply(function () {
        var phone=$searchdata.getPersonDetail().user.Mobile;
        if(phone.length==0||phone==null||phone==""){
          $ToastUtils.showToast("电话号码为空")
        }else {
          $phonepluin.call($scope.userId, phone, $scope.chatName,1);
        }
      })
    });

    $scope.$on('$ionicView.afterLeave', function () {
      // alert("单聊after离开");
      $rootScope.$broadcast('noread.update');
      /**
       * 离开界面时，将数据库里该界面聊天记录的isFailure===‘false’并且isSuccess===‘false’的记录改正为
       * isFailure===‘true’
       */
      $rootScope.$broadcast('netstatus.update');
      // $scope.leavechange();
      $chatarr.setIdToMc($scope.userId);
    });


    $scope.leavechange=function () {
      // alert("准备离开单聊详情界面");
      $greendao.queryData('ChatListService','where id =?',$scope.userId,function (data) {
        if(data.length === 0){  //如果没有该会话，则先判断message表有无数据，有保存返回，没有直接返回
          $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.userId,function (data) {
            //保存最后一条消息(公有方法)，先初始化
            $scope.saveUsrLastMsg=function () {
              // alert("进来最后一条消息保存");
              //没有会话，但是该聊天列表有消息，则创建会话列表，并保存最后一条消息

              if(data[0].messagetype === "Image"){
                // alert("返回即时通");
                $scope.lastText = "[图片]";//最后一条消息内容
              }else if(data[0].messagetype === "LOCATION"){
                $scope.lastText = "[位置]";//最后一条消息内容
              }else if(data[0].messagetype === "File"){
                $scope.lastText = "[文件]";//最后一条消息内容
              }else {
                $scope.lastText = data[0].message;//最后一条消息内容
              }
              $scope.lastDate = data[0].when;//最后一条消息的时间
              $scope.chatName = data[0].username;//对话框名称
              $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
              $scope.srcName = data[0].username;//消息来源人名字
              $scope.srcId = data[0].senderid;//消息来源人id
              $scope.daytype=data[0].daytype;//最后一条消息的日期类型
              $scope.isSuccess=data[0].isSuccess;//最后一条消息的成功与否状态
              // alert("最后一条消息的日期类型+成功状态"+$scope.daytype+$scope.isSuccess);
              //保存最后一条数据到chat表
              $greendao.queryData('ChatListService','where id =?',$scope.userId,function (data) {
                //赋值chat对象
                var chatitem = {};
                chatitem.id = data[0].id;
                chatitem.chatName = data[0].chatName;
                chatitem.imgSrc = $scope.imgSrc;
                chatitem.lastText = $scope.lastText;
                chatitem.count = '0';
                chatitem.isDelete = data[0].isDelete;
                chatitem.lastDate = $scope.lastDate;
                chatitem.chatType = data[0].chatType;
                chatitem.senderId = $scope.srcId;//发送者id
                chatitem.senderName = $scope.srcName;//发送者名字
                chatitem.daytype=$scope.daytype;
                chatitem.isSuccess=$scope.isSuccess;
                $chatarr.updatedatanosort(chatitem);
                // alert("chatype"+chatitem.chatType+"发送者id"+chatitem.senderId+"发送者名字"+chatitem.senderName);
                // //保存到数据库chat表
                $greendao.saveObj('ChatListService',chatitem,function (data) {
                  // alert("进来最后一条数据chat表保存啦");
                  $greendao.queryDataByIdAndIsread($scope.userId,'0',function (data) {
                    if(data.length>0){
                      for(var i=0;i<data.length;i++){
                        // alert("进入for循环的长度"+data.length);
                        var messaegeitem={};
                        messaegeitem._id=data[i]._id;
                        messaegeitem.sessionid=data[i].sessionid;
                        messaegeitem.type=data[i].type;
                        // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
                        messaegeitem.from=data[i].from;
                        messaegeitem.message=data[i].message;
                        messaegeitem.messagetype=data[i].messagetype;
                        messaegeitem.platform=data[i].platform;
                        messaegeitem.when=data[i].when;
                        messaegeitem.isFailure=data[i].isFailure;
                        messaegeitem.isDelete=data[i].isDelete;
                        messaegeitem.imgSrc=data[i].imgSrc;
                        messaegeitem.username=data[i].username;
                        messaegeitem.senderid=data[i].senderid;
                        messaegeitem.isSuccess=data[i].isSuccess;
                        messaegeitem.daytype=data[i].daytype;
                        messaegeitem.istime=data[i].istime;
                        if(data[i].isread ==='0'){
                          // alert("拿到库里的消息阅读状态"+data[i].isread);
                          data[i].isread ='1';
                          messaegeitem.isread=data[i].isread;
                          // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                          $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                            // alert("保存成功");
                            // $state.go("tab.message", {
                            //   "id": $scope.userId,
                            //   "sessionid": $scope.chatName,
                            //   "grouptype":"User"
                            // });
                          },function (err) {
                          });
                        }
                      }
                    }else{
                      //chat表count值改变过后并且message表消息状态全部改变以后，返回主界面
                      // $state.go("tab.message", {
                      //   "id": $scope.userId,
                      //   "sessionid": $scope.chatName,
                      //   "grouptype":"User"
                      // });
                    }
                  },function (err) {
                  });
                },function (err) {
                });

              },function (err) {
              });
            }

            if(data.length >0){
              $rootScope.isPersonSend='true';
              if ($rootScope.isPersonSend === 'true') {
                // $ToastUtils.showToast("长度");
                //往service里面传值，为了创建会话
                $chatarr.getIdChatName($scope.userId,$scope.viewtitle);
                $scope.items = $chatarr.getAll($rootScope.isPersonSend,'User');
                // alert($scope.items.length + "单聊长度");
                $scope.$on('chatarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.items = $chatarr.getAll($rootScope.isPersonSend,'User');
                    // alert("入完数据库了吗？");
                    $scope.saveUsrLastMsg();
                  });
                });
                $rootScope.isPersonSend = 'false';
              }
            }else{
              // $state.go("tab.message", {
              //   "id": $scope.userId,
              //   "sessionid": $scope.chatName,
              //   "grouptype":"User"
              // });
            }
          },function (err) {
          });
        }else{ //如果有该会话，取出message表最后一条数据并保存
          $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.userId,function (data) {

            if(data[0].messagetype === "Image"){
              // alert("返回即时通");
              $scope.lastText = "[图片]";//最后一条消息内容
            }else if(data[0].messagetype === "LOCATION"){
              $scope.lastText = "[位置]";//最后一条消息内容
            }else if(data[0].messagetype === "File"){
              $scope.lastText = "[文件]";//最后一条消息内容
            }else {
              $scope.lastText = data[0].message;//最后一条消息内容
            }
            $scope.lastDate = data[0].when;//最后一条消息的时间
            $scope.chatName = data[0].username;//对话框名称
            $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
            $scope.srcName = data[0].username;//消息来源人名字
            $scope.srcId = data[0].senderid;//消息来源人id
            $scope.daytype=data[0].daytype;//最后一条消息的日期类型
            $scope.isSuccess=data[0].isSuccess;//最后一条消息的成功与否状态
            // alert("最后一条消息的日期类型+成功状态"+$scope.daytype+$scope.isSuccess);

            //保存最后一条数据到chat表
            $greendao.queryData('ChatListService','where id =?',$scope.userId,function (data) {
              //赋值chat对象
              var chatitem = {};
              chatitem.id = data[0].id;
              chatitem.chatName = data[0].chatName;
              chatitem.imgSrc = $scope.imgSrc;
              chatitem.lastText = $scope.lastText;
              chatitem.count = '0';
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = $scope.lastDate;
              chatitem.chatType = data[0].chatType;
              chatitem.senderId = $scope.srcId;//发送者id
              chatitem.senderName = $scope.srcName;//发送者名字
              chatitem.daytype=$scope.daytype;
              chatitem.isSuccess=$scope.isSuccess;
              $chatarr.updatedatanosort(chatitem);
              // alert("chatype"+chatitem.chatType+"发送者id"+chatitem.senderId+"发送者名字"+chatitem.senderName);
              //保存到数据库chat表
              $greendao.saveObj('ChatListService',chatitem,function (data) {
                // alert("进来最后一条数据chat表保存啦");
                $greendao.queryDataByIdAndIsread($scope.userId,'0',function (data) {
                  if(data.length>0){
                    for(var i=0;i<data.length;i++){
                      // alert("进入for循环的长度"+data.length);
                      var messaegeitem={};
                      messaegeitem._id=data[i]._id;
                      messaegeitem.sessionid=data[i].sessionid;
                      messaegeitem.type=data[i].type;
                      // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
                      messaegeitem.from=data[i].from;
                      messaegeitem.message=data[i].message;
                      messaegeitem.messagetype=data[i].messagetype;
                      messaegeitem.platform=data[i].platform;
                      messaegeitem.when=data[i].when;
                      messaegeitem.isFailure=data[i].isFailure;
                      messaegeitem.isDelete=data[i].isDelete;
                      messaegeitem.imgSrc=data[i].imgSrc;
                      messaegeitem.username=data[i].username;
                      messaegeitem.senderid=data[i].senderid;
                      messaegeitem.isSuccess=data[i].isSuccess;
                      messaegeitem.daytype=data[i].daytype;
                      messaegeitem.istime=data[i].istime;
                      if(data[i].isread ==='0'){
                        // alert("拿到库里的消息阅读状态"+data[i].isread);
                        data[i].isread ='1';
                        messaegeitem.isread=data[i].isread;
                        // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                        $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                          // alert("保存成功");
                          //chat表count值改变过后并且message表消息状态全部改变以后，返回主界面
                          // $state.go("tab.message", {
                          //   "id": $scope.userId,
                          //   "sessionid": $scope.chatName,
                          //   "grouptype":"User"
                          // });
                        },function (err) {
                        });
                      }
                    }
                  }else {
                    //chat表count值改变过后并且message表消息状态全部改变以后，返回主界面
                    // $state.go("tab.message", {
                    //   "id": $scope.userId,
                    //   "sessionid": $scope.chatName,
                    //   "grouptype":"User"
                    // });
                  }
                },function (err) {
                });

              },function (err) {
              });

            },function (err) {
            });
          },function (err) {
          });
        }
      },function (err) {
      });
    }


  })






  .controller('MessageGroupCtrl', function ($scope, $state, $http, $ionicScrollDelegate, $mqtt, $ionicActionSheet, $greendao, $timeout,$stateParams,$rootScope,$chatarr,$ToastUtils,$ionicHistory,$ScalePhoto,$api,$location,$ionicPlatform,$ionicLoading) {
    var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
    $scope.bgroup=0;
    $scope.gengduogropu=function () {

      if ($scope.bgroup==0){
        //加滑动底部
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
        document.getElementById("contentbb").style.marginBottom='165px';
        $scope.bgroup=1;
      }else {
        document.getElementById("contentbb").style.marginBottom='0px';
        $scope.bgroup=0;
      }
    };
    $scope.zhilinggroup=function () {
      document.getElementById("contentbb").style.marginBottom='0px';
      $scope.bgroup=0;
    };
    /**
     * 从其他应用界面跳转带参赋值
     */
    $scope.groupid=$stateParams.id;
    $scope.chatname=$stateParams.chatName;
    // alert("chatName"+$scope.chatname + 'ccccc' + ($scope.chatname != undefined));
    if($scope.chatname != undefined && $scope.chatname != null && $scope.chatname !=''){
      $scope.grouptype=$stateParams.grouptype;
      $scope.ismygroup=$stateParams.ismygroup;
    }else if($scope.chatname ===''){
      $greendao.queryData('GroupChatsService','where id =?',$scope.groupid,function (data) {
        $scope.chatname = data[0].groupName;
        // alert("进来吗？00000"+$scope.chatname);
        $scope.grouptype=data[0].groupType;
        $scope.ismygroup=data[0].ismygroup;
      },function (err) {
      });
    }
    // alert("新建群时"+$scope.groupid+$scope.chatname+$scope.ismygroup);
    /**
     * 全局的当前用户和id进行赋值，并且将发送消息的id置为‘’
     * @type {string}
     * @private
     */
    $scope._id='';
    $scope.localusr = $rootScope.userName;
    $scope.myUserID = $rootScope.rootUserId;


    $ionicPlatform.registerBackButtonAction(function (e) {
      if($location.path()==('/messageGroup/'+$scope.groupid+'/'+$scope.chatname+'/'+$scope.grouptype+'/'+$scope.ismygroup)){
        // alert("准备离开qun聊详情界面");
        $greendao.queryData('ChatListService','where id =?',$scope.groupid,function (data) {
          if(data.length === 0){  //如果没有该会话，则先判断message表有无数据，有保存返回，没有直接返回
            $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.groupid,function (data) {
              //保存最后一条消息(公有方法)，先初始化
              $scope.saveGroupLastMsg=function () {
                // alert("进来最后一条消息保存");
                //没有会话，但是该聊天列表有消息，则创建会话列表，并保存最后一条消息

                if(data[0].messagetype === "Image"){
                  // alert("返回即时通");
                  $scope.lastText = "[图片]";//最后一条消息内容
                }else if(data[0].messagetype === "LOCATION"){
                  $scope.lastText = "[位置]";//最后一条消息内容
                }else if(data[0].messagetype === "File"){
                  $scope.lastText = "[文件]";//最后一条消息内容
                }else {
                  $scope.lastText = data[0].message;//最后一条消息内容
                }
                $scope.lastDate = data[0].when;//最后一条消息的时间
                $scope.chatName = data[0].username;//对话框名称
                $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
                $scope.srcName = data[0].username;//消息来源人名字
                $scope.srcId = data[0].senderid;//消息来源人id
                $scope.daytype=data[0].daytype;//最后一条消息的日期类型
                $scope.isSuccess=data[0].isSuccess;//最后一条消息的成功与否状态
                // alert("部门聊中返回的类型+成功与否状态"+$scope.daytype+$scope.isSuccess);
                //保存最后一条数据到chat表
                $greendao.queryData('ChatListService','where id =?',$scope.groupid,function (data) {
                  //赋值chat对象
                  var chatitem = {};
                  chatitem.id = data[0].id;
                  chatitem.chatName = data[0].chatName;
                  chatitem.imgSrc = $scope.imgSrc;
                  chatitem.lastText = $scope.lastText;
                  chatitem.count = '0';
                  chatitem.isDelete = data[0].isDelete;
                  chatitem.lastDate = $scope.lastDate;
                  chatitem.chatType = data[0].chatType;
                  chatitem.senderId = $scope.srcId;//发送者id
                  chatitem.senderName = $scope.srcName;//发送者名字
                  chatitem.daytype=$scope.daytype;
                  chatitem.isSuccess=$scope.isSuccess;
                  // alert("chatype"+chatitem.chatType+"发送者id"+chatitem.senderId+"发送者名字"+chatitem.senderName);
                  $chatarr.updatedatanosort(chatitem);
                  //保存到数据库chat表
                  $greendao.saveObj('ChatListService',chatitem,function (data) {
                    // alert("进来最后一条数据chat表保存啦");
                    $greendao.queryDataByIdAndIsread($scope.userId,'0',function (data) {
                      for(var i=0;i<data.length;i++){
                        // alert("进入for循环的长度"+data.length);
                        var messaegeitem={};
                        messaegeitem._id=data[i]._id;
                        messaegeitem.sessionid=data[i].sessionid;
                        messaegeitem.type=data[i].type;
                        // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
                        messaegeitem.from=data[i].from;
                        messaegeitem.message=data[i].message;
                        messaegeitem.messagetype=data[i].messagetype;
                        messaegeitem.platform=data[i].platform;
                        messaegeitem.when=data[i].when;
                        messaegeitem.isFailure=data[i].isFailure;
                        messaegeitem.isDelete=data[i].isDelete;
                        messaegeitem.imgSrc=data[i].imgSrc;
                        messaegeitem.username=data[i].username;
                        messaegeitem.senderid=data[i].senderid;
                        messaegeitem.isSuccess=data[i].isSuccess;
                        messaegeitem.daytype=data[i].daytype;
                        messaegeitem.istime=data[i].istime;
                        if(data[i].isread ==='0'){
                          // alert("拿到库里的消息阅读状态"+data[i].isread);
                          data[i].isread ='1';
                          messaegeitem.isread=data[i].isread;
                          // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                          $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                            // alert("保存成功");
                          },function (err) {
                          });
                        }
                      }
                    },function (err) {
                    });
                    //chat表count值改变过后并且message表消息状态全部改变以后，返回主界面
                    $state.go("tab.message", {
                      "id": $scope.groupid,
                      "sessionid": $scope.chatname,
                      "grouptype":$scope.grouptype
                    });
                  },function (err) {
                  });

                },function (err) {
                });
              }

              if(data.length >0){
                // alert("有没有数据？？？？");
                $rootScope.isPersonSend='true';
                if ($rootScope.isPersonSend === 'true') {
                  $chatarr.getIdChatName($scope.groupid,$scope.chatname);
                  $scope.items = $chatarr.getAll($rootScope.isPersonSend,$scope.grouptype);
                  $scope.$on('chatarr.update', function (event) {
                    $scope.$apply(function () {
                      $scope.items = $chatarr.getAll($rootScope.isPersonSend,$scope.grouptype);
                      // alert("入完数据库了吗？");
                      $scope.saveGroupLastMsg();
                    });
                  });
                  $rootScope.isPersonSend = 'false';
                }
              }else{
                $state.go("tab.message", {
                  "id": $scope.groupid,
                  "sessionid":$scope.chatname,
                  "grouptype":$scope.grouptype
                });
              }
            },function (err) {
            });
          }else{ //如果有该会话，取出message表最后一条数据并保存
            $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.groupid,function (data) {

              if(data[0].messagetype === "Image"){
                // alert("返回即时通");
                $scope.lastText = "[图片]";//最后一条消息内容
              }else if(data[0].messagetype === "LOCATION"){
                $scope.lastText = "[位置]";//最后一条消息内容
              }else if(data[0].messagetype === "File"){
                $scope.lastText = "[文件]";//最后一条消息内容
              }else {
                $scope.lastText = data[0].message;//最后一条消息内容
              }
              $scope.lastDate = data[0].when;//最后一条消息的时间
              $scope.chatName = data[0].username;//对话框名称
              $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
              $scope.srcName = data[0].username;//消息来源人名字
              $scope.srcId = data[0].senderid;//消息来源人id
              $scope.daytype=data[0].daytype;//最后一条消息的日期类型
              $scope.isSuccess=data[0].isSuccess;//最后一条消息的成功与否状态
              // alert("部门聊中返回的类型+成功与否状态"+$scope.daytype+$scope.isSuccess);
              //保存最后一条数据到chat表
              $greendao.queryData('ChatListService','where id =?',$scope.groupid,function (data) {
                //赋值chat对象
                var chatitem = {};
                chatitem.id = data[0].id;
                chatitem.chatName = data[0].chatName;
                chatitem.imgSrc = $scope.imgSrc;
                chatitem.lastText = $scope.lastText;
                chatitem.count = '0';
                chatitem.isDelete = data[0].isDelete;
                chatitem.lastDate = $scope.lastDate;
                chatitem.chatType = data[0].chatType;
                chatitem.senderId = $scope.srcId;//发送者id
                chatitem.senderName = $scope.srcName;//发送者名字
                chatitem.daytype=$scope.daytype;
                chatitem.isSuccess=$scope.isSuccess;
                // alert("chatype"+chatitem.chatType+"发送者id"+chatitem.senderId+"发送者名字"+chatitem.senderName);
                $chatarr.updatedatanosort(chatitem);
                //保存到数据库chat表
                $greendao.saveObj('ChatListService',chatitem,function (data) {
                  // alert("进来最后一条数据chat表保存啦");
                  $greendao.queryDataByIdAndIsread($scope.groupid,'0',function (data) {
                    for(var i=0;i<data.length;i++){
                      // alert("进入for循环的长度"+data.length);
                      var messaegeitem={};
                      messaegeitem._id=data[i]._id;
                      messaegeitem.sessionid=data[i].sessionid;
                      messaegeitem.type=data[i].type;
                      // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
                      messaegeitem.from=data[i].from;
                      messaegeitem.message=data[i].message;
                      messaegeitem.messagetype=data[i].messagetype;
                      messaegeitem.platform=data[i].platform;
                      messaegeitem.when=data[i].when;
                      messaegeitem.isFailure=data[i].isFailure;
                      messaegeitem.isDelete=data[i].isDelete;
                      messaegeitem.imgSrc=data[i].imgSrc;
                      messaegeitem.username=data[i].username;
                      messaegeitem.senderid=data[i].senderid;
                      messaegeitem.isSuccess=data[i].isSuccess;
                      messaegeitem.daytype=data[i].daytype;
                      messaegeitem.istime=data[i].istime;
                      if(data[i].isread ==='0'){
                        // alert("拿到库里的消息阅读状态"+data[i].isread);
                        data[i].isread ='1';
                        messaegeitem.isread=data[i].isread;
                        // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                        $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                          // alert("保存成功");
                        },function (err) {
                        });
                      }
                    }
                  },function (err) {
                  });
                  //chat表count值改变过后并且message表消息状态全部改变以后，返回主界面
                  $state.go("tab.message", {
                    "id": $scope.groupid,
                    "sessionid":$scope.chatname,
                    "grouptype":$scope.grouptype
                  });
                },function (err) {
                });

              },function (err) {
              });
            },function (err) {
            });
          }
        },function (err) {
        });
      }else {
        $ionicHistory.goBack();
        $ionicLoading.hide();
      }
      e.preventDefault();
      return false;


    },501)

    // $ToastUtils.showToast("跳进群组详聊"+$scope.groupid+$scope.chatname+$scope.grouptype+$scope.ismygroup);

    //一进来就检查网络是否连接
    $mqtt.setOnNetStatusChangeListener(function (succ) {
      $rootScope.netStatus = 'true';
    },function (err) {
      $rootScope.netStatus='false';
      // alert("切换网络失败时");
      // $greendao.queryData('MessagesService','where sessionid =?',$scope.groupid,function (data) {
      //   // alert("切换网络时"+data.length);
      //
      //   // $rootScope.$broadcast('msgs.error');
      //   for(var i=0;i<data.length;i++){
      //     var messaegeitem={};
      //     messaegeitem._id=data[i]._id;
      //     messaegeitem.sessionid=data[i].sessionid;
      //     messaegeitem.type=data[i].type;
      //     // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
      //     messaegeitem.from=data[i].from;
      //     messaegeitem.message=data[i].message;
      //     messaegeitem.messagetype=data[i].messagetype;
      //     messaegeitem.platform=data[i].platform;
      //     messaegeitem.when=data[i].when;
      //     messaegeitem.isDelete=data[i].isDelete;
      //     messaegeitem.imgSrc=data[i].imgSrc;
      //     messaegeitem.username=data[i].username;
      //     messaegeitem.senderid=data[i].senderid;
      //     messaegeitem.isSuccess=data[i].isSuccess;
      //     messaegeitem.isread='1';
      //     if(data[i].isSuccess === 'false'){
      //       // alert("发送失败的状态有数据啦");
      //       messaegeitem.isFailure='true';
      //       $greendao.saveObj('MessagesService',messaegeitem,function (success) {
      //         // alert("状态改变成功");
      //         $mqtt.detailqunliaoupdate();
      //         $rootScope.$broadcast('msgs.error');
      //       },function (err) {
      //       });
      //     }else{
      //     }
      //   }
      // },function (err) {
      // });
    });


    // var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
    var footerBar = document.body.querySelector('#messageGroupDetail .bar-footer');
    var txtInput = angular.element(footerBar.querySelector('textarea'));

    $scope.$on('$ionicView.enter', function () {

      $timeout(function () {
        viewScroll.scrollBottom();
      }, 100);

    });

    if ($rootScope.isPersonSend === 'true') {
      $greendao.queryData('MessagesService','where sessionid =?',$scope.userId,function (data) {
        if(data.length>0){
          // alert("进群啦");
          $chatarr.getIdChatName($scope.groupid,$scope.chatname);
          $chatarr.getAll($rootScope.isPersonSend,$scope.grouptype);
          // $ToastUtils.showToast($scope.items.length + "群聊长度");
          $scope.$on('chatarr.update', function (event) {
            $scope.$apply(function () {
              $scope.items =$chatarr.getAllData();
            });
          });
          $rootScope.isPersonSend = 'false';
          // $ToastUtils.showToast("走这吗？"+$rootScope.isGroupSend);
        }
      }, function (err) {
      });
    }
    /**
     * 从数据库根据时间降序查询10条数据进行展示
     *
     */
    $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,10', $scope.groupid, function (data) {
      // $ToastUtils.showToast("进入群聊界面，查询数据库长度"+data.length);
      // for (var j = 0; j <= $mqtt.getQunliao().length-1; j++) {
      //   $mqtt.getQunliao().splice(j, $mqtt.getQunliao().length);//清除之前数组里存的数据
      // }
      // for (var i = 1; i <= data.length; i++) {
      //   $mqtt.getQunliao().push(data[data.length - i]);
      // }




      var myDate = new Date();
      myDate.toLocaleDateString();//可以获取当前日期
      // alert("获取当前日期"+myDate.toLocaleDateString());
      myDate.toLocaleTimeString(); //可以获取当前时间
      // alert("获取当前时间"+myDate.toLocaleTimeString());

      var year=myDate.getFullYear();//获取年份
      var month=myDate.getMonth()+1;//获取月份
      var day=myDate.getDate();//获取日期
      // alert("获取当前年月日"+year+month+day);

      var millions=new Date(year+"/"+month+"/"+day+" "+"00:00:00").getTime();
      // alert("最低毫秒值"+millions);

      var maxmillions=new Date(year+"/"+month+"/"+day+" "+"23:59:59").getTime();
      // alert("最高毫秒值"+millions);
      $mqtt.setQunliao(data);
      $scope.groupmsgs = $mqtt.getQunliao();
      // alert("看时间"+$mqtt.getDanliao()[$scope.msgs.length-1].when);
      if($scope.groupmsgs.length>0 && $mqtt.getQunliao()[$scope.groupmsgs.length-1].when< millions){
        // alert("群聊改时间进来了吗");
        for(var i=0;i<data.length;i++){
          if(data[i].istime  === 'true'){
            var messaegeitem={};
            messaegeitem._id=data[i]._id;
            messaegeitem.sessionid=data[i].sessionid;
            messaegeitem.type=data[i].type;
            messaegeitem.from=data[i].from;
            messaegeitem.message=data[i].message;
            messaegeitem.messagetype=data[i].messagetype;
            messaegeitem.platform=data[i].platform;
            messaegeitem.when=data[i].when;
            messaegeitem.isFailure=data[i].isFailure;
            messaegeitem.isDelete=data[i].isDelete;
            messaegeitem.imgSrc=data[i].imgSrc;
            messaegeitem.username=data[i].username;
            messaegeitem.senderid=data[i].senderid;
            messaegeitem.isSuccess=data[i].isSuccess;
            messaegeitem.istime=data[i].istime;
            messaegeitem.daytype='0';
            messaegeitem.isread=data[i].isread;
            $mqtt.updateQunliao(messaegeitem);
            $greendao.saveObj('MessagesService',messaegeitem,function (data) {
            },function (err) {
            });
          }
        }
      }
    }, function (err) {
      // $ToastUtils.showToast(err);
    });


    //获取更多数据
    $scope.doRefresh = function () {
      // $ToastUtils.showToast("群组刷新");
      $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,' + ($mqtt.getQunliao().length + 10), $scope.groupid, function (data) {
        if ($scope.groupmsgs.length < 50) {
          // $ToastUtils.showToast("群组刷新《50");
          // for (var j = 0; j <= $mqtt.getQunliao().length-1; j++) {
          //   $mqtt.getQunliao().splice(j, $mqtt.getQunliao().length);//清除之前数组里存的数据
          // }
          // for (var i =1; i <=data.length; i++) {
          //   $mqtt.getQunliao().push(data[data.length - i]);
          // }
          $mqtt.setQunliao(data);
          $scope.groupmsgs = $mqtt.getQunliao();
        } else if ($scope.groupmsgs.length >= 50) {
          $scope.nomore = "true";
        }
        $scope.$broadcast("scroll.refreshComplete");
      }, function (err) {
        // $ToastUtils.showToast(err);
      });
    }

    window.addEventListener("native.keyboardshow", function (e) {
      viewScroll.scrollBottom();
    });

    $scope.sendSingleGroupMsg = function (topic, content, id,grouptype,localuser,localuserId,sqlid,messagetype) {
      if(content === undefined || content === null || content.trim() === ''){
        $scope.send_content = "";
        return;
      }
      $mqtt.getMqtt().getTopic(topic, $scope.grouptype, function (userTopic) {
        // $ToastUtils.showToast("群聊topic"+userTopic+$scope.grouptype);
        if (sqlid != undefined && sqlid != null && sqlid != '') {
          $scope.msg = $mqtt.sendGroupMsg(userTopic, content, id, grouptype, localuser, localuserId, sqlid,messagetype, $mqtt);
          $scope.send_content = "";
          $timeout(function () {
            viewScroll.scrollBottom();
          }, 100);
          keepKeyboardOpen();
        } else {
          $greendao.getUUID(function (data) {
            sqlid = data;
            $scope.msg = $mqtt.sendGroupMsg(userTopic, content, id, grouptype, localuser, localuserId, sqlid,messagetype, $mqtt);
            $scope.send_content = "";
            $timeout(function () {
              viewScroll.scrollBottom();
            }, 100);
            keepKeyboardOpen();
          });
        }
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


    $scope.i=0;
    //在联系人界面时进行消息监听，确保人员收到消息
    //收到消息时，创建对话聊天(cahtitem)
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来群聊界面吗？");
        // alert("群组id"+$scope.groupid);

        $scope.groupmsgs=$mqtt.getQunliao();
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
        // alert("进来群聊界面吗？长度"+$mqtt.getQunliao()[$scope.groupmsgs.length-1].istime);
        // 获取当天日期
        var myDate = new Date();//
        myDate.toLocaleDateString();//可以获取当前日期
        // alert("获取当前日期"+myDate.toLocaleDateString());
        myDate.toLocaleTimeString(); //可以获取当前时间
        // alert("获取当前时间"+myDate.toLocaleTimeString());

        var year=myDate.getFullYear();//获取年份
        var month=myDate.getMonth()+1;//获取月份
        var day=myDate.getDate();//获取日期
        // alert("获取当前年月日"+year+month+day);

        var millions=new Date(year+"/"+month+"/"+day+" "+"00:00:00").getTime();
        // alert("最低毫秒值"+millions);

        var maxmillions=new Date(year+"/"+month+"/"+day+" "+"23:59:59").getTime();
        // alert("最高毫秒值"+millions);
        $scope.timegap=$mqtt.getQunliao()[$scope.groupmsgs.length-1].when-$mqtt.getQunliao()[$scope.groupmsgs.length-2].when;
        var lastgroupmsg= $mqtt.getQunliao()[$scope.groupmsgs.length-1];
        // alert("最后一条数据："+lastmsg.message+lastmsg.istime+lastmsg.daytype);
        //如果发送前后消息间有间隔，则改变该条数据的两个状态并保存
        if($mqtt.getQunliao()[$scope.groupmsgs.length-1].when> millions && ($mqtt.getQunliao()[$scope.groupmsgs.length-1].from === 'true') && $scope.timegap > 900000 && $scope.timegap < maxmillions){
          $scope.i=$scope.i+1;
          // alert("进来群间隔吗？"+$scope.timegap);
          var messaegeitem={};
          messaegeitem._id=lastgroupmsg._id;
          messaegeitem.sessionid=lastgroupmsg.sessionid;
          messaegeitem.type=lastgroupmsg.type;
          messaegeitem.from=lastgroupmsg.from;
          messaegeitem.message=lastgroupmsg.message;
          messaegeitem.messagetype=lastgroupmsg.messagetype;
          messaegeitem.platform=lastgroupmsg.platform;
          messaegeitem.when=lastgroupmsg.when;
          messaegeitem.isFailure=lastgroupmsg.isFailure;
          messaegeitem.isDelete=lastgroupmsg.isDelete;
          messaegeitem.imgSrc=lastgroupmsg.imgSrc;
          messaegeitem.username=lastgroupmsg.username;
          messaegeitem.senderid=lastgroupmsg.senderid;
          if($scope.i === 2){
            messaegeitem.isSuccess='true';
            $scope.i=0;
          }else{
            messaegeitem.isSuccess=lastgroupmsg.isSuccess;
          }
          messaegeitem.istime='true';
          messaegeitem.daytype=lastgroupmsg.daytype;
          messaegeitem.isread='1';
          $greendao.saveObj('MessagesService',messaegeitem,function (data) {
            $mqtt.updateQunliao(messaegeitem);
            // alert("存储成功");
          },function (err) {
          });
        }
        $greendao.queryData('ChatListService','where id =?',$scope.groupid,function (data) {
          if(data[0].count>0){
            // alert("进来查询了吗？"+data.length);
            var chatitem = {};
            chatitem.id = data[0].id;
            chatitem.chatName = data[0].chatName;
            chatitem.imgSrc = data[0].imgSrc;
            chatitem.lastText = data[0].lastText;
            chatitem.count = '0';
            chatitem.isDelete = data[0].isDelete;
            chatitem.lastDate = data[0].lastDate;
            chatitem.chatType = data[0].chatType;
            // alert("chatype"+chatitem.chatType);
            chatitem.senderId = data[0].senderId;//发送者id
            chatitem.senderName = data[0].senderName;//发送者名字
            chatitem.daytype=data[0].daytype;
            chatitem.isSuccess=data[0].isSuccess;
            $greendao.saveObj('ChatListService',chatitem,function (data) {
              $greendao.queryDataByIdAndIsread($scope.groupid,'0',function (data) {
                for(var i=0;i<data.length;i++){
                  // alert("进入for循环的长度"+data.length);
                  var messaegeitem={};
                  messaegeitem._id=data[i]._id;
                  messaegeitem.sessionid=data[i].sessionid;
                  messaegeitem.type=data[i].type;
                  // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
                  messaegeitem.from=data[i].from;
                  messaegeitem.message=data[i].message;
                  messaegeitem.messagetype=data[i].messagetype;
                  messaegeitem.platform=data[i].platform;
                  messaegeitem.when=data[i].when;
                  messaegeitem.isFailure=data[i].isFailure;
                  messaegeitem.isDelete=data[i].isDelete;
                  messaegeitem.imgSrc=data[i].imgSrc;
                  messaegeitem.username=data[i].username;
                  messaegeitem.senderid=data[i].senderid;
                  messaegeitem.isSuccess=data[i].isSuccess;
                  messaegeitem.daytype=data[i].daytype;
                  messaegeitem.istime=data[i].istime;
                  if(data[i].isread ==='0'){
                    // alert("拿到库里的消息阅读状态"+data[i].isread);
                    data[i].isread ='1';
                    messaegeitem.isread=data[i].isread;
                    // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                    $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                      // alert("保存成功");
                    },function (err) {
                    });
                  }
                }
              },function (err) {

              });
            },function (err) {

            });
          }
        },function (err) {

        });
      })
    });

    $scope.$on('msgs.error', function (event) {
      $scope.$apply(function () {
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
        $scope.groupmsgs = $mqtt.getQunliao();
      })
    });

    $scope.backSecondMenu = function (grouptype) {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });

      // alert("没有该人的会话11111"+$scope.groupid+grouptype);
      $greendao.queryData('ChatListService','where id =?',$scope.groupid,function (data) {
        if(data.length === 0){  //如果没有该会话，则先判断message表有无数据，有保存返回，没有直接返回
          $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.groupid,function (data) {
            //保存最后一条消息(公有方法)，先初始化
            $scope.saveGroupLastMsg=function () {
              // alert("进来最后一条消息保存");
              //没有会话，但是该聊天列表有消息，则创建会话列表，并保存最后一条消息

              if(data[0].messagetype === "Image"){
                // alert("返回即时通");
                $scope.lastText = "[图片]";//最后一条消息内容
              }else if(data[0].messagetype === "LOCATION"){
                $scope.lastText = "[位置]";//最后一条消息内容
              }else if(data[0].messagetype === "File"){
                $scope.lastText = "[文件]";//最后一条消息内容
              }else {
                $scope.lastText = data[0].message;//最后一条消息内容
              }
              $scope.lastDate = data[0].when;//最后一条消息的时间
              $scope.chatName = data[0].username;//对话框名称
              $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
              $scope.srcName = data[0].username;//消息来源人名字
              $scope.srcId = data[0].senderid;//消息来源人id
              $scope.daytype=data[0].daytype;//最后一条消息的日期类型
              $scope.isSuccess=data[0].isSuccess;//最后一条消息的成功与否状态
              // alert("部门聊中返回的类型+成功与否状态"+$scope.daytype+$scope.isSuccess);
              //保存最后一条数据到chat表
              $greendao.queryData('ChatListService','where id =?',$scope.groupid,function (data) {
                //赋值chat对象
                var chatitem = {};
                chatitem.id = data[0].id;
                chatitem.chatName = data[0].chatName;
                chatitem.imgSrc = $scope.imgSrc;
                chatitem.lastText = $scope.lastText;
                chatitem.count = '0';
                chatitem.isDelete = data[0].isDelete;
                chatitem.lastDate = $scope.lastDate;
                chatitem.chatType = data[0].chatType;
                chatitem.senderId = $scope.srcId;//发送者id
                chatitem.senderName = $scope.srcName;//发送者名字
                chatitem.daytype=$scope.daytype;
                chatitem.isSuccess=$scope.isSuccess;
                // alert("chatype"+chatitem.chatType+"发送者id"+chatitem.senderId+"发送者名字"+chatitem.senderName);
                //保存到数据库chat表
                $greendao.saveObj('ChatListService',chatitem,function (data) {
                  // alert("进来最后一条数据chat表保存啦");
                  $greendao.queryDataByIdAndIsread($scope.userId,'0',function (data) {
                    for(var i=0;i<data.length;i++){
                      // alert("进入for循环的长度"+data.length);
                      var messaegeitem={};
                      messaegeitem._id=data[i]._id;
                      messaegeitem.sessionid=data[i].sessionid;
                      messaegeitem.type=data[i].type;
                      // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
                      messaegeitem.from=data[i].from;
                      messaegeitem.message=data[i].message;
                      messaegeitem.messagetype=data[i].messagetype;
                      messaegeitem.platform=data[i].platform;
                      messaegeitem.when=data[i].when;
                      messaegeitem.isFailure=data[i].isFailure;
                      messaegeitem.isDelete=data[i].isDelete;
                      messaegeitem.imgSrc=data[i].imgSrc;
                      messaegeitem.username=data[i].username;
                      messaegeitem.senderid=data[i].senderid;
                      messaegeitem.isSuccess=data[i].isSuccess;
                      messaegeitem.daytype=data[i].daytype;
                      messaegeitem.istime=data[i].istime;
                      if(data[i].isread ==='0'){
                        // alert("拿到库里的消息阅读状态"+data[i].isread);
                        data[i].isread ='1';
                        messaegeitem.isread=data[i].isread;
                        // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                        $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                          // alert("保存成功");
                        },function (err) {
                        });
                      }
                    }
                  },function (err) {
                  });
                  //chat表count值改变过后并且message表消息状态全部改变以后，返回主界面
                  $state.go("tab.message", {
                    "id": $scope.groupid,
                    "sessionid": $scope.chatname,
                    "grouptype":$scope.grouptype
                  });
                },function (err) {
                });

              },function (err) {
              });
            }

            if(data.length >0){
              // alert("有没有数据？？？？");
              $rootScope.isPersonSend='true';
              if ($rootScope.isPersonSend === 'true') {
                $chatarr.getIdChatName($scope.groupid,$scope.chatname);
                $scope.items = $chatarr.getAll($rootScope.isPersonSend,grouptype);
                $scope.$on('chatarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.items = $chatarr.getAll($rootScope.isPersonSend,grouptype);
                    // alert("入完数据库了吗？");
                    $scope.saveGroupLastMsg();
                  });
                });
                $rootScope.isPersonSend = 'false';
              }
            }else{
              $state.go("tab.message", {
                "id": $scope.groupid,
                "sessionid":$scope.chatname,
                "grouptype":$scope.grouptype
              });
            }
          },function (err) {
          });
        }else{ //如果有该会话，取出message表最后一条数据并保存
          $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.groupid,function (data) {

            if(data[0].messagetype === "Image"){
              // alert("返回即时通");
              $scope.lastText = "[图片]";//最后一条消息内容
            }else if(data[0].messagetype === "LOCATION"){
              $scope.lastText = "[位置]";//最后一条消息内容
            }else if(data[0].messagetype === "File"){
              $scope.lastText = "[文件]";//最后一条消息内容
            }else {
              $scope.lastText = data[0].message;//最后一条消息内容
            }
            $scope.lastDate = data[0].when;//最后一条消息的时间
            $scope.chatName = data[0].username;//对话框名称
            $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
            $scope.srcName = data[0].username;//消息来源人名字
            $scope.srcId = data[0].senderid;//消息来源人id
            $scope.daytype=data[0].daytype;//最后一条消息的日期类型
            $scope.isSuccess=data[0].isSuccess;//最后一条消息的成功与否状态
            // alert("部门聊中返回的类型+成功与否状态"+$scope.daytype+$scope.isSuccess);
            //保存最后一条数据到chat表
            $greendao.queryData('ChatListService','where id =?',$scope.groupid,function (data) {
              //赋值chat对象
              var chatitem = {};
              chatitem.id = data[0].id;
              chatitem.chatName = data[0].chatName;
              chatitem.imgSrc = $scope.imgSrc;
              chatitem.lastText = $scope.lastText;
              chatitem.count = '0';
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = $scope.lastDate;
              chatitem.chatType = data[0].chatType;
              chatitem.senderId = $scope.srcId;//发送者id
              chatitem.senderName = $scope.srcName;//发送者名字
              chatitem.daytype=$scope.daytype;
              chatitem.isSuccess=$scope.isSuccess;
              // alert("chatype"+chatitem.chatType+"发送者id"+chatitem.senderId+"发送者名字"+chatitem.senderName);
              //保存到数据库chat表
              $greendao.saveObj('ChatListService',chatitem,function (data) {
                // alert("进来最后一条数据chat表保存啦");
                $greendao.queryDataByIdAndIsread($scope.groupid,'0',function (data) {
                  for(var i=0;i<data.length;i++){
                    // alert("进入for循环的长度"+data.length);
                    var messaegeitem={};
                    messaegeitem._id=data[i]._id;
                    messaegeitem.sessionid=data[i].sessionid;
                    messaegeitem.type=data[i].type;
                    // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
                    messaegeitem.from=data[i].from;
                    messaegeitem.message=data[i].message;
                    messaegeitem.messagetype=data[i].messagetype;
                    messaegeitem.platform=data[i].platform;
                    messaegeitem.when=data[i].when;
                    messaegeitem.isFailure=data[i].isFailure;
                    messaegeitem.isDelete=data[i].isDelete;
                    messaegeitem.imgSrc=data[i].imgSrc;
                    messaegeitem.username=data[i].username;
                    messaegeitem.senderid=data[i].senderid;
                    messaegeitem.isSuccess=data[i].isSuccess;
                    messaegeitem.daytype=data[i].daytype;
                    messaegeitem.istime=data[i].istime;
                    if(data[i].isread ==='0'){
                      // alert("拿到库里的消息阅读状态"+data[i].isread);
                      data[i].isread ='1';
                      messaegeitem.isread=data[i].isread;
                      // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                      $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                        // alert("保存成功");
                      },function (err) {
                      });
                    }
                  }
                },function (err) {
                });
                //chat表count值改变过后并且message表消息状态全部改变以后，返回主界面
                $state.go("tab.message", {
                  "id": $scope.groupid,
                  "sessionid":$scope.chatname,
                  "grouptype":$scope.grouptype
                });
              },function (err) {
              });

            },function (err) {
            });
          },function (err) {
          });
        }
      },function (err) {
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
    $scope.entergroupmap=function (content) {
      $scope.longitude=content.split(",")[0];//content.substring(0,(content).indexOf(','));
      $scope.latitude=content.split(",")[1];//content.substring((content).indexOf(',')+1,content.length);
      // alert("发送经纬度"+content+"sdfs"+$scope.longitude+"-----------"+$scope.latitude+"群信息"+$scope.chatname+$scope.ismygroup+"群类型"+$scope.grouptype+$scope.groupid);
      $state.go('mapdetail', {
        id: $scope.groupid,
        ssid:$scope.chatname,
        grouptype:$scope.grouptype,
        ismygroup:$scope.ismygroup,
        longitude:$scope.longitude,
        latitude:$scope.latitude
      });
    }

    // 点击按钮触发，或一些其他的触发条件
    $scope.resendgroupshow = function (topic, content, id,grouptype,localuser,localuserId,sqlid,msgSingle) {

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
            //消息发送失败重新发送成功时，页面上找出那条带叹号的message并删除，未能正确取值。
            // alert($mqtt.getQunliao().length);
            /*for(var i=0;i<$mqtt.getQunliao().length;i++){
              // alert(sqlid+i+"来了" );
              if($mqtt.getQunliao()[i]._id === sqlid){
                // alert("后"+$mqtt.getQunliao()[i]._id);
                $mqtt.getQunliao().splice(i, 1);
                break;
              }
            }*/
            $scope.sendSingleGroupMsg(topic, content, id,grouptype,localuser,localuserId,sqlid);
          } else if (index === 1) {
            for(var i=0;i<$mqtt.getQunliao().length;i++){
              // alert(sqlid+i+"来了" );
              if($mqtt.getQunliao()[i]._id === sqlid){
                // alert("后"+$mqtt.getDanliao()[i]._id);
                $greendao.deleteObj('MessagesService',msgSingle,function (data) {
                  $mqtt.getQunliao().splice(i, 1);
                  $rootScope.$broadcast('msgs.update');
                },function (err) {
                  // alert(err+"sendmistake");
                });
                break;
              }
            }
            //$rootScope.$broadcast('msgs.update');
          }
          return true;
        }
      });

    };
    //:groupid/:chatname/:grouptype
    $scope.goGroupDetail=function (id,name,type,ismygroup) {
      $state.go('groupSetting',{
        'groupid':id,
        'chatname':name,
        'grouptype':type,
        'ismygroup':ismygroup
      });
    }
    $scope.godetail=function (userid) {
      $state.go('person',{
        'userId':userid
      });
    }

    $scope.$on('$ionicView.afterLeave', function () {
      // alert("群组after离开");
      $rootScope.$broadcast('noread.update');
      // $scope.leavegroupchange();
      $rootScope.$broadcast('netstatus.update');
    });

    $scope.leavegroupchange=function () {
      // alert("准备离开qun聊详情界面");
      $greendao.queryData('ChatListService','where id =?',$scope.groupid,function (data) {
        if(data.length === 0){  //如果没有该会话，则先判断message表有无数据，有保存返回，没有直接返回
          $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.groupid,function (data) {
            //保存最后一条消息(公有方法)，先初始化
            $scope.saveGroupLastMsg=function () {
              // alert("进来最后一条消息保存");
              //没有会话，但是该聊天列表有消息，则创建会话列表，并保存最后一条消息

              if(data[0].messagetype === "Image"){
                // alert("返回即时通");
                $scope.lastText = "[图片]";//最后一条消息内容
              }else if(data[0].messagetype === "LOCATION"){
                $scope.lastText = "[位置]";//最后一条消息内容
              }else if(data[0].messagetype === "File"){
                $scope.lastText = "[文件]";//最后一条消息内容
              }else {
                $scope.lastText = data[0].message;//最后一条消息内容
              }
              $scope.lastDate = data[0].when;//最后一条消息的时间
              $scope.chatName = data[0].username;//对话框名称
              $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
              $scope.srcName = data[0].username;//消息来源人名字
              $scope.srcId = data[0].senderid;//消息来源人id
              $scope.daytype=data[0].daytype;//最后一条消息的日期类型
              $scope.isSuccess=data[0].isSuccess;//最后一条消息的成功与否状态
              // alert("部门聊中返回的类型+成功与否状态"+$scope.daytype+$scope.isSuccess);
              //保存最后一条数据到chat表
              $greendao.queryData('ChatListService','where id =?',$scope.groupid,function (data) {
                //赋值chat对象
                var chatitem = {};
                chatitem.id = data[0].id;
                chatitem.chatName = data[0].chatName;
                chatitem.imgSrc = $scope.imgSrc;
                chatitem.lastText = $scope.lastText;
                chatitem.count = '0';
                chatitem.isDelete = data[0].isDelete;
                chatitem.lastDate = $scope.lastDate;
                chatitem.chatType = data[0].chatType;
                chatitem.senderId = $scope.srcId;//发送者id
                chatitem.senderName = $scope.srcName;//发送者名字
                chatitem.daytype=$scope.daytype;
                chatitem.isSuccess=$scope.isSuccess;
                // alert("chatype"+chatitem.chatType+"发送者id"+chatitem.senderId+"发送者名字"+chatitem.senderName);
                $chatarr.updatedatanosort(chatitem);
                //保存到数据库chat表
                $greendao.saveObj('ChatListService',chatitem,function (data) {
                  // alert("进来最后一条数据chat表保存啦");
                  $greendao.queryDataByIdAndIsread($scope.userId,'0',function (data) {
                    for(var i=0;i<data.length;i++){
                      // alert("进入for循环的长度"+data.length);
                      var messaegeitem={};
                      messaegeitem._id=data[i]._id;
                      messaegeitem.sessionid=data[i].sessionid;
                      messaegeitem.type=data[i].type;
                      // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
                      messaegeitem.from=data[i].from;
                      messaegeitem.message=data[i].message;
                      messaegeitem.messagetype=data[i].messagetype;
                      messaegeitem.platform=data[i].platform;
                      messaegeitem.when=data[i].when;
                      messaegeitem.isFailure=data[i].isFailure;
                      messaegeitem.isDelete=data[i].isDelete;
                      messaegeitem.imgSrc=data[i].imgSrc;
                      messaegeitem.username=data[i].username;
                      messaegeitem.senderid=data[i].senderid;
                      messaegeitem.isSuccess=data[i].isSuccess;
                      messaegeitem.daytype=data[i].daytype;
                      messaegeitem.istime=data[i].istime;
                      if(data[i].isread ==='0'){
                        // alert("拿到库里的消息阅读状态"+data[i].isread);
                        data[i].isread ='1';
                        messaegeitem.isread=data[i].isread;
                        // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                        $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                          // alert("保存成功");
                        },function (err) {
                        });
                      }
                    }
                  },function (err) {
                  });
                  //chat表count值改变过后并且message表消息状态全部改变以后，返回主界面
                  // $state.go("tab.message", {
                  //   "id": $scope.groupid,
                  //   "sessionid": $scope.chatname,
                  //   "grouptype":$scope.grouptype
                  // });
                },function (err) {
                });

              },function (err) {
              });
            }

            if(data.length >0){
              // alert("有没有数据？？？？");
              $rootScope.isPersonSend='true';
              if ($rootScope.isPersonSend === 'true') {
                $chatarr.getIdChatName($scope.groupid,$scope.chatname);
                $scope.items = $chatarr.getAll($rootScope.isPersonSend,grouptype);
                $scope.$on('chatarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.items = $chatarr.getAll($rootScope.isPersonSend,grouptype);
                    // alert("入完数据库了吗？");
                    $scope.saveGroupLastMsg();
                  });
                });
                $rootScope.isPersonSend = 'false';
              }
            }else{
              // $state.go("tab.message", {
              //   "id": $scope.groupid,
              //   "sessionid":$scope.chatname,
              //   "grouptype":$scope.grouptype
              // });
            }
          },function (err) {
          });
        }else{ //如果有该会话，取出message表最后一条数据并保存
          $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.groupid,function (data) {

            if(data[0].messagetype === "Image"){
              // alert("返回即时通");
              $scope.lastText = "[图片]";//最后一条消息内容
            }else if(data[0].messagetype === "LOCATION"){
              $scope.lastText = "[位置]";//最后一条消息内容
            }else if(data[0].messagetype === "File"){
              $scope.lastText = "[文件]";//最后一条消息内容
            }else {
              $scope.lastText = data[0].message;//最后一条消息内容
            }
            $scope.lastDate = data[0].when;//最后一条消息的时间
            $scope.chatName = data[0].username;//对话框名称
            $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
            $scope.srcName = data[0].username;//消息来源人名字
            $scope.srcId = data[0].senderid;//消息来源人id
            $scope.daytype=data[0].daytype;//最后一条消息的日期类型
            $scope.isSuccess=data[0].isSuccess;//最后一条消息的成功与否状态
            // alert("部门聊中返回的类型+成功与否状态"+$scope.daytype+$scope.isSuccess);
            //保存最后一条数据到chat表
            $greendao.queryData('ChatListService','where id =?',$scope.groupid,function (data) {
              //赋值chat对象
              var chatitem = {};
              chatitem.id = data[0].id;
              chatitem.chatName = data[0].chatName;
              chatitem.imgSrc = $scope.imgSrc;
              chatitem.lastText = $scope.lastText;
              chatitem.count = '0';
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = $scope.lastDate;
              chatitem.chatType = data[0].chatType;
              chatitem.senderId = $scope.srcId;//发送者id
              chatitem.senderName = $scope.srcName;//发送者名字
              chatitem.daytype=$scope.daytype;
              chatitem.isSuccess=$scope.isSuccess;
              // alert("chatype"+chatitem.chatType+"发送者id"+chatitem.senderId+"发送者名字"+chatitem.senderName);
              $chatarr.updatedatanosort(chatitem);
              //保存到数据库chat表
              $greendao.saveObj('ChatListService',chatitem,function (data) {
                // alert("进来最后一条数据chat表保存啦");
                $greendao.queryDataByIdAndIsread($scope.groupid,'0',function (data) {
                  for(var i=0;i<data.length;i++){
                    // alert("进入for循环的长度"+data.length);
                    var messaegeitem={};
                    messaegeitem._id=data[i]._id;
                    messaegeitem.sessionid=data[i].sessionid;
                    messaegeitem.type=data[i].type;
                    // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
                    messaegeitem.from=data[i].from;
                    messaegeitem.message=data[i].message;
                    messaegeitem.messagetype=data[i].messagetype;
                    messaegeitem.platform=data[i].platform;
                    messaegeitem.when=data[i].when;
                    messaegeitem.isFailure=data[i].isFailure;
                    messaegeitem.isDelete=data[i].isDelete;
                    messaegeitem.imgSrc=data[i].imgSrc;
                    messaegeitem.username=data[i].username;
                    messaegeitem.senderid=data[i].senderid;
                    messaegeitem.isSuccess=data[i].isSuccess;
                    messaegeitem.daytype=data[i].daytype;
                    messaegeitem.istime=data[i].istime;
                    if(data[i].isread ==='0'){
                      // alert("拿到库里的消息阅读状态"+data[i].isread);
                      data[i].isread ='1';
                      messaegeitem.isread=data[i].isread;
                      // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                      $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                        // alert("保存成功");
                      },function (err) {
                      });
                    }
                  }
                },function (err) {
                });
                //chat表count值改变过后并且message表消息状态全部改变以后，返回主界面
                // $state.go("tab.message", {
                //   "id": $scope.groupid,
                //   "sessionid":$scope.chatname,
                //   "grouptype":$scope.grouptype
                // });
              },function (err) {
              });

            },function (err) {
            });
          },function (err) {
          });
        }
      },function (err) {
      });
    }




    $scope.takeGroupPhoto = function (topic, content, id,localuser,localuserId,sqlid, type) {
      $mqtt.takePhoto(function (fileData) {
        $mqtt.getMqtt().getTopic(topic, type, function (userTopic) {
          // $ToastUtils.showToast("单聊topic"+userTopic+$scope.groupType);
          //alert(fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3] + '===' + fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3] + '===' + id + '===' + localuser + '===' + localuserId);
          var fileType = 'Image';
          /*if (type === 'image') {
           fileType = 'Image';
           }*/
          // alert(fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3]);
          $greendao.getUUID(function (data) {
            sqlid=data;
            // alert("图片传进去的id"+sqlid);
            alert('takeGroupPhoto');
            $scope.suc = $mqtt.sendDocFileMsg(userTopic, fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], id, localuser, localuserId, sqlid, fileType, fileData[0],$mqtt,type);
            $scope.send_content = "";
            $timeout(function () {
              viewScroll.scrollBottom();
            }, 100);
            keepKeyboardOpen();
          });
        });
      }, function (err) {

      });
    };

    $scope.openGroupDocumentWindow = function (type, topic, content, id,localuser,localuserId,sqlid, picType) {
      $mqtt.openDocWindow(type, function (fileData) {
        /*$mqtt.getMqtt().getTopic(topic, "User", function (userTopic) {
         $scope.suc = $mqtt.sendDocFileMsg(userTopic, 'none' + "###" + fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], id, localuser, localuserId, sqlid, "File", fileData[0], '0');
         $scope.send_content = "";
         keepKeyboardOpen();
         });*/
        // alert(fileData[0]);
        $mqtt.getMqtt().getTopic(topic, picType, function (userTopic) {
          // $ToastUtils.showToast("单聊topic"+userTopic+$scope.groupType);
          //alert(fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3] + '===' + fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3] + '===' + id + '===' + localuser + '===' + localuserId);
          var fileType = 'File';
          if (type === 'image') {
            fileType = 'Image';
          }
          $greendao.getUUID(function (data) {
            sqlid=data;
            // alert("图片传进去的id"+sqlid);
            $scope.suc = $mqtt.sendDocFileMsg(userTopic, fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], id, localuser, localuserId, sqlid, fileType, fileData[0],$mqtt, picType);
            $scope.send_content = "";
            $timeout(function () {
              viewScroll.scrollBottom();
            }, 100);
            keepKeyboardOpen();
          })
          // alert(fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3]);
        });
        /*$api.sendDocFile('F', null, fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], function (data) {
         // alert(filePath);
         // alert(filePath);
         $scope.filePath=data[0];
         $scope.fileObjID=data[1];

         $mqtt.getMqtt().getTopic(topic, "User", function (userTopic) {
         // $ToastUtils.showToast("单聊topic"+userTopic+$scope.groupType);
         alert(fileData[3]);
         $scope.suc = $mqtt.sendDocFileMsg(userTopic, fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], $scope.fileObjID + "###" + fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], id, localuser, localuserId, sqlid, "File", fileData[0]);
         $scope.send_content = "";
         keepKeyboardOpen();
         });


         });*/
      }, function (err) {
      });
    };

    //点击定位，跳转查询位置界面
    $scope.gogegrouplocation = function (messagetype,topic, chatname, id,localuser,localuserId,sqlid,groupType,ismygroup) {
      $state.go('sendGelocation', {
        topic:topic,
        id: id,
        ssid:$scope.viewtitle,
        localuser:localuser,
        localuserId:localuserId,
        sqlid:sqlid,
        grouptype:groupType,
        messagetype:messagetype,
        ismygroup:ismygroup,
        chatname:$scope.chatname
      });
    };


    //判断文件是否是图片
    $scope.getFileType = function (message) {
      var msg = message.split('###')[1];
      var suffix = msg.lastIndexOf("\.");
      var lastIndex = msg.substr(suffix, msg.length);
      return lastIndex === '.jpg' || lastIndex === '.jpeg' || lastIndex === '.png' || lastIndex === '.bmp' || lastIndex === '.gif' || lastIndex === 'tif';
    };

    //获取文件类型对应的图片路径
    $scope.getFileTypeImg = function (message) {
      if (message === 'location') {
        return 'img/location.png';
      }
      var msg = message.split('###')[1];
      if (message === undefined || message === null || message === '' || msg === undefined || msg === null || msg === '') {
        return 'img/ems_file.png';
      }

      // var fileSplit = message.split('###');
      // alert(fileSplit[0] + ";;" + message);
      var suffix = msg.lastIndexOf("\.");
      var lastIndex = msg.substr(suffix, msg.length);
      if (lastIndex === undefined || lastIndex === null || lastIndex === '') {
        return 'img/ems_file.png';
      }
      return $scope.getFileTypeImgByFileName(msg);
    };

    //根据相关文件类型对应的类型图片（根据文件名）
    $scope.getFileTypeImgByFileName = function (msg) {
      var suffix = msg.lastIndexOf("\.");
      var lastIndex = msg.substr(suffix, msg.length);
      if (lastIndex === undefined || lastIndex === null || lastIndex === '') {
        return 'img/ems_file.png';
      }
      if (lastIndex === '.m4a' || lastIndex === '.mp3' || lastIndex === '.mid' || lastIndex === '.xmf' || lastIndex === '.ogg' || lastIndex === '.wav' || lastIndex === '.flac' || lastIndex === '.amr') {
        return 'img/ems_audio.png';
      } else if (lastIndex === '.3gp' || lastIndex === '.mp4' || lastIndex === 'rm' || lastIndex === 'rmvb' || lastIndex === 'avi') {
        return 'img/ems_video.png';
      } else if (lastIndex === '.jpg' || lastIndex === '.gif' || lastIndex === '.png' || lastIndex === '.jpeg' || lastIndex === '.bmp') {
        return 'img/ems_photo.png';
      } else if (lastIndex === '.apk') {
        return 'img/ems_apk.png';
      } else if (lastIndex === '.ppt' || lastIndex === '.pptx' || lastIndex === '.ppsx') {
        return 'img/explorer_ppt.png';
      } else if (lastIndex === '.xls' || lastIndex === '.xlsx') {
        return 'img/explorer_xls.png';
      } else if (lastIndex === '.doc' || lastIndex === '.docx') {
        return 'img/explorer_file_doc.png';
      } else if (lastIndex === '.pdf') {
        return 'img/explorer_pdf.png';
      } else if (lastIndex === '.chm') {
        return 'img/explorer_file_archive.png';
      } else if (lastIndex === '.txt') {
        return 'img/explorer_txt.png';
      } else if (lastIndex === '.htm' || lastIndex === '.html') {
        return 'img/explorer_html.png';
      } else if (lastIndex === '.xml') {
        return 'img/explorer_xml.png';
      } else {
        return 'img/ems_file.png';
      }
    };

    //获取文件名
    $scope.getFileName = function (message) {
      var msg = message.split('###')[1];
      var lastindex = msg.lastIndexOf("\/");
      return lastindex <= 0 ? msg : msg.substr(lastindex + 1, msg.length);
    };

    $scope.getFilePath = function (message) {
      var filePath = message.split("###")[1];
      return filePath;
    };

    //打开文件
    $scope.openAllFile = function (path, imageID) {
      $api.openFileByPath(path,imageID, function (suc) {
      },function (err) {
      });
    };

    //发送图片的时候打开图片查看大图
    $scope.boostImage=function (filepath) {
      $ScalePhoto.scale(filepath,function (msg) {

      },function (error) {

      })
    }
    $scope.netScaleImage=function (fileid,filename,samllfilepath) {
      $ScalePhoto.netScale(fileid,filename,samllfilepath,function (msg) {

      },function (err) {

      })

    }

    //打开文件
    $scope.openAllFile = function (path, imageID) {
      $api.openFileByPath(path,imageID, function (suc) {
      },function (err) {
      });
    };


      /**
       * 当离开界面时将最后一条消息显示在chat表上
       */
    // $scope.$on('$ionicView.leave',function () {
    //   // alert("离开界面时");
    //   $scope.backSecondMenu($scope.grouptype);
    // });

  })


  .controller('MessageCtrl', function ($scope, $http, $state, $mqtt, $chatarr, $stateParams, $rootScope, $greendao,$timeout,$contacts,$ToastUtils,$cordovaBarcodeScanner,$location,$api,$ionicPlatform,$ionicHistory,$ionicLoading) {

    $scope.ID=$stateParams.id;
    $scope.SESSIONID=$stateParams.sessionid;
    $scope.GROUP=$stateParams.grouptype;

    var backButtonPressedOnceToExit=false;
    $ionicPlatform.registerBackButtonAction(function (e) {
      if($location.path()==('/tab/message/'+$scope.ID+'/'+$scope.SESSIONID+'/'+$scope.GROUP)||$location.path() == '/tab/chats'||$location.path() == '/tab/notification'||$location.path() == '/tab/account'||$location.path() == '/tab/contacts'){
        if (backButtonPressedOnceToExit) {
          ionic.Platform.exitApp();
        } else {
          backButtonPressedOnceToExit = true;
          $ToastUtils.showToast('再按一次退出系统');
          setTimeout(function () {
            backButtonPressedOnceToExit = false;
          }, 1500);
        }
      }else {
        $ionicHistory.goBack();
        $ionicLoading.hide();
      }
      e.preventDefault();
      return false;


    },501)




    //一进来就检查网络是否连接
    $mqtt.setOnNetStatusChangeListener(function (succ) {
      $rootScope.netStatus = 'true';
      // alert("网成功时"+$rootScope.netStatus);
      $rootScope.$broadcast('netstatus.update');
    },function (err) {
      $rootScope.netStatus='false';
      // alert("网断时"+$rootScope.netStatus);
      $rootScope.$broadcast('netstatus.update');
    });
    //监听网络状态的变化
    $scope.$on('netstatus.update', function (event) {
      // $scope.$apply(function () {
      //   alert("哈哈哈哈哈啊哈哈哈哈");
      //   alert("关网时走不走"+$rootScope.netStatus);
        $rootScope.isConnect=$rootScope.netStatus;
        // alert("切换网络时"+$scope.isConnect);
      // })
    });

    // alert($location.path());
    $scope.a=false
    $scope.popadd=function () {
      if (!$scope.a){
        $scope.a=true
      }else {
        $scope.a=false
      }
    }
    $scope.shefalse=function () {
      $scope.a=false
    }
    //发起群聊
    $scope.createGroupChats=function () {
      var selectInfo={};
      //当创建群聊的时候先把登录的id和信息  存到数据库上面
      selectInfo.id=$scope.loginId;
      selectInfo.grade="0";
      selectInfo.isselected=true;
      selectInfo.type='user';
      selectInfo.parentid=$scope.departmentId;
      $greendao.saveObj('SelectIdService',selectInfo,function (msg) {

      },function (err) {

      })

      $state.go('addnewpersonfirst',{
        "createtype":'single',
        "groupid":'0',
        "groupname":''
      });
    }
    //刚开始进来先拿到部门的id
    $contacts.loginInfo();
    $scope.$on('login.update', function (event) {
      $scope.$apply(function () {

        //部门id
        $scope.loginId=$contacts.getLoignInfo().userID;
        $scope.departmentId=$contacts.getLoignInfo().deptID;
        $greendao.queryData("GroupChatsService",'where id =?',$scope.departmentId,function (msg) {
          if(msg.length==0){
            $contacts.loginDeptInfo($scope.departmentId);
          }

        },function (err) {

        });
      })
    });

    $scope.$on('logindept.update', function (event) {
      $scope.$apply(function () {
        //部门id
        $scope.deptname = $contacts.getloginDeptInfo();
        var deptobj={};
        deptobj.id=$scope.departmentId;
        deptobj.groupName=$scope.deptname;
        deptobj.groupType='Dept';
        deptobj.ismygroup=false;
        $greendao.saveObj("GroupChatsService",deptobj,function (msg) {

        },function (err) {
        });
      })
    });






    //扫一扫
    $scope.saoyisao = function () {
      $scope.a=false
      $cordovaBarcodeScanner.scan().then(function(imageData) {
        // $ToastUtils.showToast(imageData.text);
        $api.qrcodeLogin(imageData.text,function (msg) {
          // $ToastUtils.showToast(msg)
        },function (msg) {
          // $ToastUtils.showToast(msg)
        });
        // console.log("Barcode Format -> " + imageData.format);
        // console.log("Cancelled -> " + imageData.cancelled);
      }, function(error) {
        // $ToastUtils.showToast( error);
        //$ToastUtils.showToast(error)
      });
    };

    // //nfc
    // $scope.nfcaaa = function () {
    //  nfc.showSettings(function (msg) {
    //    alert(msg);
    //  },function (msg) {
    //    alert(msg);
    //  })
    //   $scope.tags=nfcService.tag;
    // }
    //  if (window.nfc) {
    //    nfc.bytesToHexString(input);
    //    alert()
    //  } else {
    //    input;
    //  }
    //  if (window.nfc) {
    //    nfc.bytesToString(input);
    //  } else {
    //    input;
    //  }


    //如果不是创建聊天，就直接从数据库里取列表数据
    $greendao.queryByConditions('ChatListService',function (data) {
      // alert("创建群成功以后，有没有走这个方法"+data.length);
      $chatarr.setData(data);//先存入数组然后再改变单条数据
      // 获取当天日期
      var myDate = new Date();//
      myDate.toLocaleDateString();//可以获取当前日期
      // alert("获取当前日期"+myDate.toLocaleDateString());
      myDate.toLocaleTimeString(); //可以获取当前时间
      // alert("获取当前时间"+myDate.toLocaleTimeString());

      var year=myDate.getFullYear();//获取年份
      var month=myDate.getMonth()+1;//获取月份
      var day=myDate.getDate();//获取日期
      // alert("获取当前年月日"+year+month+day);

      var millions=new Date(year+"/"+month+"/"+day+" "+"00:00:00").getTime();
      // alert("最低毫秒值"+millions);

      var maxmillions=new Date(year+"/"+month+"/"+day+" "+"23:59:59").getTime();
      for(var i=0;i<data.length;i++){
        var chatitem={};
        chatitem.id=data[i].id;
        chatitem.chatName=data[i].chatName;
        chatitem.isDelete=data[i].isDelete;
        chatitem.imgSrc=data[i].imgSrc;
        chatitem.lastText=data[i].lastText;
        chatitem.count=data[i].count;
        chatitem.lastDate=data[i].lastDate;
        chatitem.chatType=data[i].chatType;
        chatitem.senderId=data[i].senderId;
        chatitem.senderName=data[i].senderName;
        chatitem.isSuccess=data[i].isSuccess;
        if(data[i].lastDate<millions){
          chatitem.daytype='0';
          // alert("日期变小了");
        }else{
          chatitem.daytype=data[i].daytype;
        }
        $chatarr.updatedatanosort(chatitem);
      }
      $scope.items=$chatarr.getAllData();
      // $ToastUtils.showToast($scope.items.length+"聊天列表长度");
    },function (err) {
      // $ToastUtils.showToast("按时间查询失败"+err);
    });

    //接收消息调用方法
    $mqtt.arriveMsg('');
    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        //alert("进来主界面吗？");
        $greendao.queryByConditions('ChatListService',function (data) {
          $chatarr.setData(data);
          $scope.items=data;
           // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      //   //当lastcount值变化的时候，进行数据库更新：将更改后的count的值赋值与unread，并将该条对象插入数据库并更新
      //   $scope.lastCount = $mqtt.getMsgCount();
      //   // 当群未读消息lastGroupCount数变化的时候
      //   $scope.lastGroupCount = $mqtt.getMsgGroupCount();
      //   // alert("是不是先拿到这个值"+$scope.lastGroupCount);
      //   $scope.firstUserId = $mqtt.getFirstReceiverSsid();
      //   $scope.receiverssid = $scope.firstUserId;
      //   $scope.chatName = $mqtt.getFirstReceiverChatName();
      //   $scope.firstmessageType = $mqtt.getMessageType();
      //
      //   /**
      //    * 判断是单聊未读还是群聊未读
      //    */
      //   if ($scope.lastCount > 0 && $scope.firstmessageType ==='User') {
      //     // alert("进来单聊");
      //     //当监听到有消息接收的时候，去判断会话列表有无这条记录，有就将消息直接展示在界面上；无就创建会话列表
      //     // 接收者id
      //     // $scope.receiverssid=$mqtt.getFirstReceiverSsid();
      //     //收到消息时先判断会话列表有没有这个用户
      //     $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
      //       // $ToastUtils.showToast(data.length + "收到消息时，查询chat表有无当前用户");
      //       if (data.length === 0) {
      //         // alert("没有该会话");
      //         $rootScope.isPersonSend = 'true';
      //         if ($rootScope.isPersonSend === 'true') {
      //           $scope.messageType = $mqtt.getMessageType();
      //           // alert("会话列表聊天类型" + $scope.messageType);
      //           //往service里面传值，为了创建会话
      //           $chatarr.getIdChatName($scope.receiverssid, $scope.chatName);
      //           $chatarr.getAll($rootScope.isPersonSend, $scope.messageType);
      //           // $ToastUtils.showToast($scope.items.length + "长度");
      //           $scope.$on('chatarr.update', function (event) {
      //             $scope.$apply(function () {
      //               $scope.items = $chatarr.getAllData();
      //             });
      //           });
      //           $rootScope.isPersonSend = 'false';
      //         }
      //       }
      //     }, function (err) {
      //       // $ToastUtils.showToast("收到未读消息时，查询chat列表" + err);
      //     });
      //     //取出与‘ppp’的聊天记录最后一条
      //     $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.receiverssid, function (data) {
      //       // $ToastUtils.showToast("未读消息时取出消息表中最后一条数据"+data.length);
      //       if(data[0].messagetype === "Image"){
      //         $scope.lastText = "[图片]";//最后一条消息内容
      //       }else if(data[0].messagetype === "LOCATION"){
      //         $scope.lastText = "[位置]";//最后一条消息内容
      //       }else if(data[0].messagetype === "File"){
      //         $scope.lastText = "[文件]";//最后一条消息内容
      //       }else {
      //         $scope.lastText = data[0].message;//最后一条消息内容
      //       }
      //       // alert("丧心病狂"+$scope.lastText);
      //       $scope.lastDate = data[0].when;//最后一条消息的时间
      //       // $ToastUtils.showToast($scope.chatName + "用户名1");
      //       $scope.srcName = data[0].username;//消息来源人名字
      //       $scope.srcId = data[0].senderid;//消息来源人id
      //       $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
      //       //取出‘ppp’聊天对话的列表数据并进行数据库更新
      //       $greendao.queryData('ChatListService', 'where id=?', $scope.receiverssid, function (data) {
      //         $scope.unread = $scope.lastCount;
      //         // $ToastUtils.showToast("未读消息时取出消息表中最后一条数据" + data.length + $scope.unread);
      //         var chatitem = {};
      //         chatitem.id = data[0].id;
      //         chatitem.chatName = data[0].chatName;
      //         chatitem.imgSrc = $scope.imgSrc;
      //         chatitem.lastText = $scope.lastText;
      //         chatitem.count = $scope.unread;
      //         chatitem.isDelete = data[0].isDelete;
      //         chatitem.lastDate = $scope.lastDate;
      //         chatitem.chatType = data[0].chatType;
      //         chatitem.senderId = $scope.srcId;
      //         chatitem.senderName = $scope.srcName;
      //         $greendao.saveObj('ChatListService', chatitem, function (data) {
      //           // alert("走不走");
      //           $chatarr.updatechatdata(chatitem);
      //           $rootScope.$broadcast('lastcount.update');
      //         }, function (err) {
      //           // $ToastUtils.showToast(err + "数据保存失败");
      //         });
      //       }, function (err) {
      //         // $ToastUtils.showToast(err);
      //       });
      //     }, function (err) {
      //       // $ToastUtils.showToast(err);
      //     });
      //   } else if ($scope.lastGroupCount > 0) {
      //     // alert("进来群聊id"+$scope.receiverssid);
      //     // $ToastUtils.showToast("监听群未读消息数量"+$scope.lastGroupCount+$scope.receiverssid);
      //     /**
      //      * 1.首先查询会话列表是否有该会话(chatListService)，若无，创建会话；若有进行第2步
      //      * 2.查出当前群聊的最后一条聊天记录(messageService)
      //      * 3.查出会话列表的该条会话，将取出的数据进行赋值(chatListService)
      //      * 4.保存数据(chatListService)
      //      * 5.数据刷新(chatListService)按时间降序排列展示
      //      */
      //     $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
      //       // alert(data.length+"收到消息时，查询chat表有无当前用户");
      //       if (data.length === 0) {
      //         // alert("群聊主界面没有该会话");
      //         $rootScope.isPersonSend = 'true';
      //         if ($rootScope.isPersonSend === 'true') {
      //           $scope.messageType = $mqtt.getMessageType();
      //           //获取消息来源人
      //           $scope.chatName = $mqtt.getFirstReceiverChatName();//取到消息来源人，准备赋值，保存chat表
      //           // alert("群组会话列表聊天类型"+$scope.messageType+$scope.chatName);
      //           //根据群组id获取群名称
      //           $greendao.queryData('GroupChatsService', 'where id =?', $scope.receiverssid, function (data) {
      //             // alert(data[0].groupName);
      //             $rootScope.groupName = data[0].groupName;
      //             //往service里面传值，为了创建会话
      //             $chatarr.getIdChatName($scope.receiverssid, $scope.groupName);
      //             $chatarr.getAll($rootScope.isPersonSend, $scope.messageType);
      //             // alert($scope.items.length + "长度");
      //             $scope.$on('chatarr.update', function (event) {
      //               $scope.$apply(function () {
      //                 // alert("进来了刷新");
      //                 $scope.items=$chatarr.getAllData();
      //                 /**
      //                  *  若会话列表有该群聊，取出该会话最后一条消息，并显示在会话列表上
      //                  *
      //                  */
      //                 // $ToastUtils.showToast("群组长度" + $scope.items.length);
      //                 $scope.savemsglastmsg();
      //               });
      //             });
      //             $rootScope.isPersonSend = 'false';
      //           }, function (err) {
      //             // $ToastUtils.showToast(err + "查询群组对应关系");
      //           });
      //         }
      //       }else{
      //         $scope.savemsglastmsg();
      //       }
      //     }, function (err) {
      //       // $ToastUtils.showToast("收到群组未读消息时，查询chat列表" + err);
      //     });
      //     $scope.savemsglastmsg=function () {
      //       $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,1', $scope.receiverssid, function (data) {
      //         $scope.lastText = data[0].message;//最后一条消息内容
      //         $scope.lastDate = data[0].when;//最后一条消息的时间
      //         $scope.srcName = data[0].username;//消息来源人名字
      //         $scope.srcId = data[0].senderid;//消息来源人id
      //         // alert($scope.srcName + "消息来源人" + $scope.srcId + $scope.lastText);
      //         $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
      //         /**
      //          * 当群已经存在时，必须重新取一次群名称，不然会报错
      //          */
      //         $greendao.queryData('GroupChatsService', 'where id =?', $scope.receiverssid, function (data) {
      //           $rootScope.groupName=data[0].groupName;
      //           // alert("能拿到数据吗?"+$rootScope.groupName);
      //         },function (err) {
      //
      //         });
      //         //取出id聊天对话的列表数据并进行数据库更新
      //         $greendao.queryData('ChatListService', 'where id =?', $scope.receiverssid, function (data) {
      //           $scope.unread = $scope.lastGroupCount;
      //           // alert("未读群消息时取出消息表中最后一条数据" + data.length + $scope.unread);
      //           var chatitem = {};
      //           chatitem.id = data[0].id;
      //           if($rootScope.groupName === '' || $rootScope.groupName === undefined){
      //               chatitem.chatName =$rootScope.groupName;
      //               // alert("群名称："+chatitem.chatName);
      //           }else{
      //             chatitem.chatName =data[0].chatName ;
      //             // alert("群名称2222"+chatitem.chatName);
      //           }
      //           // $ToastUtils.showToast("第一次创建会话时保存的群聊名称"+chatitem.chatName);
      //           chatitem.imgSrc = data[0].imgSrc;
      //           chatitem.lastText = $scope.lastText;
      //           chatitem.count = $scope.unread;
      //           chatitem.isDelete = data[0].isDelete;
      //           chatitem.lastDate = $scope.lastDate;
      //           chatitem.chatType = data[0].chatType;
      //           chatitem.senderId = $scope.srcId;
      //           chatitem.senderName = $scope.srcName;
      //           $greendao.saveObj('ChatListService', chatitem, function (data) {
      //             $chatarr.updatechatdata(chatitem);
      //             $rootScope.$broadcast('lastcount.update');
      //           }, function (err) {
      //             // $ToastUtils.showToast(err + "数据保存失败");
      //           });
      //         }, function (err) {
      //           // $ToastUtils.showToast(err);
      //         });
      //       }, function (err) {
      //         // $ToastUtils.showToast(err);
      //       });
      //     }
      //   }
      //   //加滑动底部
      //   $timeout(function () {
      //     viewScroll.scrollBottom();
      //   }, 100);
      })
    });

    $scope.$on('lastcount.update', function (event) {
      $scope.$apply(function () {
        // alert("进来数据刷新");
        $scope.items = $chatarr.getAllData();
      });
    });


    // $scope.$on('lastgroupcount.update', function (event) {
    //   $scope.$apply(function () {
    //     // $ToastUtils.showToast("响应数据刷新监听");
    //     $scope.items = $grouparr.getAllGroupChatList();
    // });
    //
    // });
    //进入单聊界面
    $scope.goDetailMessage = function (id, ssid,chatType) {
      $scope.a=false;
      // $ToastUtils.showToast("单聊界面"+id+ssid+chatType);
      $mqtt.clearMsgCount();
      $mqtt.clearMsgGroupCount();
      if(chatType === "User"){
        //进入聊天详情界面
        // alert("进入单聊界面");
        $greendao.queryData('ChatListService','where id =?',id,function (data) {
          if(data.length>0){
            // alert("进来查询了吗？"+data.length);
            var chatitem = {};
            chatitem.id = data[0].id;
            chatitem.chatName = data[0].chatName;
            chatitem.imgSrc = data[0].imgSrc;
            chatitem.lastText = data[0].lastText;
            chatitem.count = '0';
            chatitem.isDelete = data[0].isDelete;
            chatitem.lastDate = data[0].lastDate;
            chatitem.chatType = data[0].chatType;
            // alert("chatype"+chatitem.chatType);
            chatitem.senderId = data[0].senderId;//发送者id
            chatitem.senderName = data[0].senderName;//发送者名字
            chatitem.daytype=data[0].daytype;
            chatitem.isSuccess=data[0].isSuccess;
            $greendao.saveObj('ChatListService',chatitem,function (data) {
              $greendao.queryDataByIdAndIsread(id,'0',function (data) {
                for(var i=0;i<data.length;i++){
                  // alert("进入for循环的长度"+data.length);
                  var messaegeitem={};
                  messaegeitem._id=data[i]._id;
                  messaegeitem.sessionid=data[i].sessionid;
                  messaegeitem.type=data[i].type;
                  // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
                  messaegeitem.from=data[i].from;
                  messaegeitem.message=data[i].message;
                  messaegeitem.messagetype=data[i].messagetype;
                  messaegeitem.platform=data[i].platform;
                  messaegeitem.when=data[i].when;
                  messaegeitem.isFailure=data[i].isFailure;
                  messaegeitem.isDelete=data[i].isDelete;
                  messaegeitem.imgSrc=data[i].imgSrc;
                  messaegeitem.username=data[i].username;
                  messaegeitem.senderid=data[i].senderid;
                  messaegeitem.isSuccess=data[i].isSuccess;
                  messaegeitem.daytype=data[i].daytype;
                  messaegeitem.istime=data[i].istime;
                  if(data[i].isread ==='0'){
                    // alert("拿到库里的消息阅读状态"+data[i].isread);
                    data[i].isread ='1';
                    messaegeitem.isread=data[i].isread;
                    // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                    $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                      // alert("保存成功");
                    },function (err) {
                    });
                  }
                }
              },function (err) {

              });
              $state.go('messageDetail',
                {
                  "id": id,
                  "ssid": ssid,
                  "grouptype":chatType,
                });
            },function (err) {

            });
          }else{
            // alert("是不是没有数据");
            $state.go('messageDetail',
              {
                "id": id,
                "ssid": ssid,
                "grouptype":chatType,
              });
          }
        },function (err) {

        });

      }else if(chatType === "Dept"){
        // $ToastUtils.showToast("进入部门界面");
        // $mqtt.clearMsgGroupCount();
        // $scope.lastGroupCount = $mqtt.getMsgGroupCount();
        $greendao.queryData('ChatListService','where id =?',id,function (data) {
          if(data.length>0){
            // alert("进来查询了吗？"+data.length);
            var chatitem = {};
            chatitem.id = data[0].id;
            chatitem.chatName = data[0].chatName;
            chatitem.imgSrc = data[0].imgSrc;
            chatitem.lastText = data[0].lastText;
            chatitem.count = '0';
            chatitem.isDelete = data[0].isDelete;
            chatitem.lastDate = data[0].lastDate;
            chatitem.chatType = data[0].chatType;
            // alert("chatype"+chatitem.chatType);
            chatitem.senderId = data[0].senderId;//发送者id
            chatitem.senderName = data[0].senderName;//发送者名字
            chatitem.daytype=data[0].daytype;
            chatitem.isSuccess=data[0].isSuccess;
            $greendao.saveObj('ChatListService',chatitem,function (data) {
              $greendao.queryDataByIdAndIsread(id,'0',function (data) {
                for(var i=0;i<data.length;i++){
                  // alert("进入for循环的长度"+data.length);
                  var messaegeitem={};
                  messaegeitem._id=data[i]._id;
                  messaegeitem.sessionid=data[i].sessionid;
                  messaegeitem.type=data[i].type;
                  // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
                  messaegeitem.from=data[i].from;
                  messaegeitem.message=data[i].message;
                  messaegeitem.messagetype=data[i].messagetype;
                  messaegeitem.platform=data[i].platform;
                  messaegeitem.when=data[i].when;
                  messaegeitem.isFailure=data[i].isFailure;
                  messaegeitem.isDelete=data[i].isDelete;
                  messaegeitem.imgSrc=data[i].imgSrc;
                  messaegeitem.username=data[i].username;
                  messaegeitem.senderid=data[i].senderid;
                  messaegeitem.isSuccess=data[i].isSuccess;
                  messaegeitem.daytype=data[i].daytype;
                  messaegeitem.istime=data[i].istime;
                  if(data[i].isread ==='0'){
                    // alert("拿到库里的消息阅读状态"+data[i].isread);
                    data[i].isread ='1';
                    messaegeitem.isread=data[i].isread;
                    // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                    $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                      // alert("保存成功");
                    },function (err) {
                    });
                  }
                }
              },function (err) {

              });
              $state.go('messageGroup',{
                "id":id,
                "chatName":ssid,
                "grouptype":chatType,
                "ismygroup":false
              });
            },function (err) {

            });
          }else{
            // alert("是不是没有数据");
            $state.go('messageGroup',{
              "id":id,
              "chatName":ssid,
              "grouptype":chatType,
              "ismygroup":false
            });
          }
        },function (err) {

        });

      }else if(chatType === "Group"){
        // $ToastUtils.showToast("进入群聊界面");
        // $mqtt.clearMsgGroupCount();
        // $scope.lastGroupCount = $mqtt.getMsgGroupCount();
        $greendao.queryData('GroupChatsService','where id =?',id,function (dataa) {
          $greendao.queryData('ChatListService','where id =?',id,function (data) {
            if(data.length>0){
              // alert("进来查询了吗？"+data.length);
              var chatitem = {};
              chatitem.id = data[0].id;
              chatitem.chatName = data[0].chatName;
              chatitem.imgSrc = data[0].imgSrc;
              chatitem.lastText = data[0].lastText;
              chatitem.count = '0';
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = data[0].lastDate;
              chatitem.chatType = data[0].chatType;
              // alert("chatype"+chatitem.chatType);
              chatitem.senderId = data[0].senderId;//发送者id
              chatitem.senderName = data[0].senderName;//发送者名字
              chatitem.daytype=data[0].daytype;
              chatitem.isSuccess=data[0].isSuccess;
              $greendao.saveObj('ChatListService',chatitem,function (data) {
                $greendao.queryDataByIdAndIsread(id,'0',function (data) {
                  for(var i=0;i<data.length;i++){
                    // alert("进入for循环的长度"+data.length);
                    var messaegeitem={};
                    messaegeitem._id=data[i]._id;
                    messaegeitem.sessionid=data[i].sessionid;
                    messaegeitem.type=data[i].type;
                    // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
                    messaegeitem.from=data[i].from;
                    messaegeitem.message=data[i].message;
                    messaegeitem.messagetype=data[i].messagetype;
                    messaegeitem.platform=data[i].platform;
                    messaegeitem.when=data[i].when;
                    messaegeitem.isFailure=data[i].isFailure;
                    messaegeitem.isDelete=data[i].isDelete;
                    messaegeitem.imgSrc=data[i].imgSrc;
                    messaegeitem.username=data[i].username;
                    messaegeitem.senderid=data[i].senderid;
                    messaegeitem.isSuccess=data[i].isSuccess;
                    messaegeitem.daytype=data[i].daytype;
                    messaegeitem.istime=data[i].istime;
                    if(data[i].isread ==='0'){
                      // alert("拿到库里的消息阅读状态"+data[i].isread);
                      data[i].isread ='1';
                      messaegeitem.isread=data[i].isread;
                      // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                      $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                        // alert("保存成功");
                      },function (err) {
                      });
                    }
                  }
                },function (err) {

                });
                $state.go('messageGroup',{
                  "id":id,
                  "chatName":dataa[0].groupName,
                  "grouptype":dataa[0].groupType,
                  "ismygroup":dataa[0].ismygroup,
                });
              },function (err) {

              });
            }else{
              // alert("是不是没有数据");
              $state.go('messageGroup',{
                "id":id,
                "chatName":dataa[0].groupName,
                "grouptype":dataa[0].groupType,
                "ismygroup":dataa[0].ismygroup,
              });
            }
          },function (err) {

          });
        },function (err) {

        });
      }

      $scope.clearAllCount=function () {

      }

    };

    $scope.goSearch = function () {
      $scope.a=false;
      $state.go("searchmessage",{
        "UserIDSM":$scope.userId,
        "UserNameSM":$scope.userName
      });
    }


    $scope.$on('$ionicView.enter', function () {

      //进入界面先清除数据库表
      $greendao.deleteAllData('SelectIdService',function (data) {

      },function (err) {

      })

       /**
         * 滑动删除会话项
         */
      $scope.removechat=function (id,name) {
        $greendao.deleteDataByArg('ChatListService',id,function (data) {
          // alert("删除会话id"+id);
          $chatarr.deletechatdata(id);
          $rootScope.$broadcast('lastcount.update');
        },function (err) {
        });
      }
    });

  })


  .controller('SettingAccountCtrl',function ($scope,$state,$stateParams,$greendao,$ToastUtils,$contacts,$ionicActionSheet,$chatarr,$rootScope,$GridPhoto,$timeout,$ionicHistory) {



    //取出聊天界面带过来的id和ssid
    $scope.userId=$stateParams.id;//对方用户id
    $scope.userName=$stateParams.ssid;//对方名字
 // alert("带过来的数据"+$scope.userId+$scope.userName+$stateParams.sessionid);
    $contacts.personDetail($scope.userId,$timeout,$ToastUtils);
    $scope.$on('personDetail.update', function (event) {
      $scope.$apply(function () {
          $scope.persondsfs = $contacts.getPersonDetail().DeptID;
      })
    });


    $scope.godetailaa=function () {
      $state.go('person',{
        'userId':$scope.userId
      });
    }

    $contacts.loginInfo();
    $scope.$on('login.update', function (event) {
      $scope.$apply(function () {
        //登录人员的id
        $scope.loginId=$contacts.getLoignInfo().userID;
        //部门id
        $scope.depid=$contacts.getLoignInfo().deptID;

      })
    });

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });


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
      /*$ionicHistory.nextViewOptions({
       disableBack: true
       });
       $state.go('messageDetail',{
       id:id,
       ssid:ssid
       });*/

      $ionicHistory.goBack();
    };

    //清空聊天记录
    $scope.clearMsg=function (id,ssid) {
      $ionicActionSheet.show({
        buttons: [
          {text: '清空聊天记录'}
        ],
        // destructiveText: '重新发送',
        // titleText: 'Modify your album',
        cancelText: '取消',
        buttonClicked: function (index) {
          if (index === 0) {
            //消息发送失败重新发送成功时，页面上找出那条带叹号的message并删除，未能正确取值。
            // alert("清空记录");
            $greendao.queryData('MessagesService','where sessionid =?',id,function (data) {
              // $ToastUtils.showToast("删除成功");
              if(data.length>0){
                for(var i=0;i<data.length;i++){
                  var key=data[i]._id;
                  $greendao.deleteDataByArg('MessagesService',key,function (data) {
                    $greendao.queryData('ChatListService','where id =?',id,function (data) {
                      for(var i=0;i<=$chatarr.getAllData().length-1;i++){
                        // alert("找出chat数组"+$chatarr.getAllData()[i].id+"==="+data[0].id);
                        if( $chatarr.getAllData()[i].id === data[0].id){
                          // alert("找出chat数组的要删除的数据"+i);
                          var key=$chatarr.getAllData()[i].id;
                          $greendao.deleteDataByArg('ChatListService',key,function (data) {
                            $state.go('tab.message',{
                              "id":id,
                              "sessionid":ssid,
                              "grouptype":"User"
                            });
                          },function (err) {
                          });
                          break;
                        }
                      }
                    },function (err) {
                    });
                  },function (err) {
                  });
                }
              }else{
                $state.go('tab.message',{
                  "id":id,
                  "sessionid":ssid,
                  "grouptype":"User"
                });
              }
            },function (err) {
              // $ToastUtils.showToast(err+"查询所有记录失败");
            });
          }
          return true;
        }
      });
    };

    //个人图片
    $scope.perosnPicture=function () {
      $GridPhoto.queryPhoto($scope.userId,"image",function (msg) {

      },function (err) {

      })

      //$state.go('personpicture');


    }
    //个人文件
    $scope.personFile=function () {
      $state.go('personfile',{
        "sessionid":$scope.userId
      });

    }

    //添加人员功能
    $scope.addNewPerson=function () {

      //进入界面先清除数据库表
      $greendao.deleteAllData('SelectIdService',function (data) {

      },function (err) {

      })


      $scope.addList=[];
      $scope.addParentid=[];
      $scope.addList.push($scope.loginId);
      $scope.addList.push($scope.userId);
      $scope.addParentid.push($scope.depid);
      $scope.addParentid.push($scope.persondsfs)
      for(var i=0;i<$scope.addList.length;i++){
        //当创建群聊的时候先把登录的id和信息  存到数据库上面
        var selectInfo={};
        selectInfo.id=$scope.addList[i];
        selectInfo.grade="0";
        selectInfo.isselected=true;
        selectInfo.type='user';
        selectInfo.parentid=$scope.addParentid[i]
        $greendao.saveObj('SelectIdService',selectInfo,function (msg) {

        },function (err) {

        })
      }
      $state.go('addnewpersonfirst',{
        "createtype":'single',
        "groupid":'0',
        "groupname":''
      });



    }




  })

  .controller('historyMessageCtrl',function ($scope, $http, $state, $stateParams,$api,$historyduifang,$mqtt,$ToastUtils,$ionicHistory,$timeout,$ionicScrollDelegate) {
    var viewScroll = $ionicScrollDelegate.$getByHandle('historyScroll');
    // var footerBar = document.body.querySelector('#historyMessage .bar-footer');
    // var txtInput = angular.element(footerBar.querySelector('textarea'));
    $scope.id = $stateParams.id;
    $scope.ssid = $stateParams.ssid;
    $scope.grouptype=$stateParams.grouptype;
    // $ToastUtils.showToast("从群聊界面跳转过来的"+$scope.grouptype);
    $mqtt.getUserInfo(function (msg) {
      $scope.UserID= msg.userID
    },function (msg) {

    });
    $timeout(function () {
      viewScroll.scrollBottom();
    }, 100);
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
      $timeout(function () {
        viewScroll.scrollBottom();
      }, 100);
    });

    //下一页
    $scope.nextpage=function () {

      if ($scope.dangqianpage<$scope.totalpage){
        $scope.dangqianpage++;
        $historyduifang.getHistoryduifanga("U",$scope.id,$scope.dangqianpage,"10");
        $scope.$on('historymsg.duifang',function (event) {
          $scope.$apply(function () {
            $scope.historyduifangsss=$historyduifang.getHistoryduifangc();
          })
        });

      }else {
        $ToastUtils.showToast("已经到最后一页了")
      }
      // $timeout(function () {
      //   viewScroll.scrollBottom();
      // }, 100);
    }
    //上一页
    $scope.backpage=function () {

      if($scope.dangqianpage>1){
        $scope.dangqianpage--;
        $historyduifang.getHistoryduifanga("U",$scope.id,$scope.dangqianpage,"10");
        $scope.$on('historymsg.duifang',function (event) {
          $scope.$apply(function () {
            $scope.historyduifangsss=$historyduifang.getHistoryduifangc();
          })
        });


      }else {
        $ToastUtils.showToast("已经到第一页了");
      }
      // $timeout(function () {
      //   viewScroll.scrollBottom();
      // }, 100);
    }

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        // $timeout(function () {
        //   viewScroll.scrollBottom();
        // }, 100);
      })
    });

    //获取更多数据
    $scope.doRefreshhis = function () {
      if ($scope.dangqianpage<$scope.totalpage){
        $scope.dangqianpage++;
        var lengthabc=$scope.dangqianpage*10;
        $historyduifang.getHistoryduifanga("U",$scope.id,"1",lengthabc);
        $scope.$on('historymsg.duifang',function (event) {
          $scope.$apply(function () {
            $scope.historyduifangsss=$historyduifang.getHistoryduifangc();
            $scope.$broadcast('scroll.refreshComplete');
            $timeout(function () {
              viewScroll.scrollTop();
            }, 100);
          })
        });

      }else {
        $ToastUtils.showToast("已经到最后一页了")
      }

    }

  })

  .controller('groupSettingCtrl', function ($scope, $state, $stateParams,$ionicHistory,$ToastUtils,$api,$greendao,$group,$ionicLoading,$timeout,$ionicActionSheet,$chatarr) {

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });

    $scope.groupId = $stateParams.groupid;
    $scope.groupType = $stateParams.grouptype;
    $scope.ismygroup=$stateParams.ismygroup;

    $scope.ismygroupaaa=$stateParams.ismygroup+"";
    $scope.listM=[];
    $scope.listM.push('GN');
    $scope.listM.push('GT');
    $group.groupDetail($scope.groupType,$scope.groupId,$scope.listM);
    $scope.$on('groupdetail.update', function (event) {
      $scope.$apply(function () {
        $timeout(function () {
          $ionicLoading.hide();
          $scope.groupName=$group.getGroupDetail().groupName;

        });

      })
    });



    //
    $scope.goGroupPerson=function (id,name,type) {

      if(type=='Group'){
        $state.go('groupMember',{
          "groupid":id,
          "chatname":name,
          "grouptype":type,
          "ismygroup":$scope.ismygroup
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
    $scope.dissolveGroup=function (aa) {

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 100,
        showDelay: 0
      });

      $api.removeGroup($scope.groupId,function (msg) {

        $ionicLoading.hide();
        $greendao.deleteDataByArg('ChatListService',$scope.groupId,function (msg) {

          $state.go('tab.message',{
            "id":$scope.groupId,
            "sessionid":$scope.groupName,
            "grouptype":"Group"
          });

        },function (err) {
          // $ToastUtils.showToast(err)
        })

      },function (err) {
        $ToastUtils.showToast('解散群失败')
        $ionicLoading.hide();


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
      // alert("返回聊天界面"+$scope.groupName);
      $state.go('messageGroup',{
        "id":$scope.groupId,
        "chatName":$scope.groupName,
        "grouptype":$scope.groupType,
        "ismygroup":$scope.ismygroup,
      });
    };

    $scope.gohistoryMessagea = function () {
      // $ToastUtils.showToast("要跳了")
      $state.go('historymessagegroup',{
        grouptype:$scope.groupType,
        id:$scope.groupId
      });
    }
    //打开群图片界面
    $scope.groupPicture=function () {
      $state.go('personfile');
    }
    //打开群文件界面
    $scope.groupFile=function () {
      $state.go('groupfile');

    }


    //打开群公告界面
    $scope.groupNotice=function () {

      if($scope.groupType=="Group"){
        $state.go('groupNotice',{
          "groupid":$scope.groupId,
          "grouptype":$scope.groupType,
          "groupname":$scope.groupName,
          "ismygroup":$scope.ismygroup,
        });

      }else{
        $ToastUtils.showToast("部门群不支持群公告")
      }
    }


    /**
     * 删除群聊天记录与会话
     */
    $scope.clearGroupRS=function (id,name) {
      // alert("进来群记录删除方法了吗？");
      $ionicActionSheet.show({
        buttons: [
          {text: '清空群聊天记录'}
        ],
        // destructiveText: '重新发送',
        // titleText: 'Modify your album',
        cancelText: '取消',
        buttonClicked: function (index) {
          if (index === 0) {
            //消息发送失败重新发送成功时，页面上找出那条带叹号的message并删除，未能正确取值。
            // alert("清空记录");
            $greendao.queryData('MessagesService','where sessionid =?',id,function (data) {
              // $ToastUtils.showToast("删除成功");
              if(data.length>0){
                for(var i=0;i<data.length;i++){
                  var key=data[i]._id;
                  $greendao.deleteDataByArg('MessagesService',key,function (data) {
                    $greendao.queryData('ChatListService','where id =?',id,function (data) {
                      for(var i=0;i<=$chatarr.getAllData().length-1;i++){
                        // alert("找出chat数组"+$chatarr.getAllData()[i].id+"==="+data[0].id);
                        if( $chatarr.getAllData()[i].id === data[0].id){
                          // alert("找出chat数组的要删除的数据"+i);
                          var key=$chatarr.getAllData()[i].id;
                          $greendao.deleteDataByArg('ChatListService',key,function (data) {
                            $state.go('tab.message',{
                              "id":id,
                              "sessionid":name,
                              "grouptype":"Group"
                            });
                          },function (err) {
                          });
                          break;
                        }
                      }
                    },function (err) {
                    });
                  },function (err) {
                  });
                }
              }else{
                $state.go('tab.message',{
                  "id":id,
                  "sessionid":name,
                  "grouptype":"Group"
                });
              }
            },function (err) {
              // $ToastUtils.showToast(err+"查询所有记录失败");
            });
          }
          return true;
        }
      });
    }

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

  })

  .controller('historymessagegroupCtrl',function ($scope, $http, $state, $stateParams,$api,$historyduifang,$mqtt,$ToastUtils,$ionicHistory) {
    $scope.groupid = $stateParams.id;
    // $scope.ssid = $stateParams.ssid;
    $scope.grouptype=$stateParams.grouptype;
    if($scope.grouptype=="Group"){
      $scope.grouptype="G"
    }
    if($scope.grouptype=="Dept"){
      $scope.grouptype="D"
    }
    // $ToastUtils.showToast("从群聊界面跳转过来的"+$scope.grouptype);
    $scope.totalpage=1
    $scope.dangqianpage=1;
    $mqtt.getUserInfo(function (msg) {
      $scope.UserID= msg.userID
    },function (msg) {

    });

    $scope.goSetting = function () {
      $ionicHistory.goBack();
    }

    $api.getMsgCount($scope.grouptype, $scope.groupid,function (msg) {

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

    $historyduifang.getHistoryduifanga($scope.grouptype,$scope.groupid,1,10);
    $scope.$on('historymsg.duifang',function (event) {
      $scope.$apply(function () {
        $scope.historyduifangsss=$historyduifang.getHistoryduifangc().reverse();
      })
    });

    //下一页
    $scope.nextpage=function () {
      if ($scope.dangqianpage<$scope.totalpage){
        $scope.dangqianpage++;
        $historyduifang.getHistoryduifanga($scope.grouptype,$scope.groupid,$scope.dangqianpage,"10");
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
        $historyduifang.getHistoryduifanga($scope.grouptype,$scope.groupid,$scope.dangqianpage,"10");
        $scope.$on('historymsg.duifang',function (event) {
          $scope.$apply(function () {
            $scope.historyduifangsss=$historyduifang.getHistoryduifangc().reverse();
          })
        });


      }else {
        $ToastUtils.showToast("已经到第一页了");
      }
    }

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

  })

  .controller('sendGelocationCtrl',function ($scope,$state,$ToastUtils,$cordovaGeolocation,$stateParams,$mqtt,$ionicNavBarDelegate,$timeout,$ionicLoading,$greendao) {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });
    document.getElementById("container").style.height=(window.screen.height-140)+'px';
    //取出聊天界面带过来的id和ssid
    $scope.topic=$stateParams.topic;
    $scope.userId=$stateParams.id;//对方用户id
    $scope.userName=$stateParams.ssid;//对方用户名
    $scope.localuser=$stateParams.localuser;//当前用户名
    $scope.localuserId=$stateParams.localuserId;//当前用户id
    $scope.sqlid=$stateParams.sqlid;//itemid
    $scope.grouptype=$stateParams.grouptype;//grouptype
    $scope.messagetype=$stateParams.messagetype;//消息类型
    $scope.ismygroup=$stateParams.ismygroup;//群类型
    $scope.chatname=$stateParams.chatname;
    // alert("拿到的数据"+$scope.userId+$scope.userName+$scope.localuser+$scope.localuserId+$scope.chatname+$scope.grouptype+$scope.messagetype+$scope.ismygroup);

    var lat="";
    var long="";
    //获取定位的经纬度
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    // alert("进来了")
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
      lat  = position.coords.latitude+0.006954;//   当前位置
      long = position.coords.longitude+0.012647;//  当前位置 116.329102
      // lat  = 39.9124;//   铁路总公司位置
      // long = 116.333233;//  铁路总公司位置
      // $ToastUtils.showToast("经度"+lat+"纬度"+long);
      var map = new BMap.Map("container"); // 创建地图实例
      var point = new BMap.Point(long, lat); // 创建点坐标
      map.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别
      // map.addControl(new BMap.NavigationControl());
      // map.addControl(new BMap.NavigationControl());
      // map.addControl(new BMap.ScaleControl());
      map.addControl(new BMap.OverviewMapControl());
      // map.addControl(new BMap.MapTypeControl());
      var marker = new BMap.Marker(point); // 创建标注
      map.addOverlay(marker); // 将标注添加到地图中
      marker.enableDragging();
      var myGeo = new BMap.Geocoder();
      $timeout(function () {
        // $ToastUtils.showToast("网络超时")
        $ionicLoading.hide();
      },7000);
      // // 根据坐标得到地址描述
      myGeo.getLocation(new BMap.Point(long, lat), function(result){
        if (result){
          $scope.$apply(function () {
            $timeout(function () {
              $ionicLoading.hide();
              $scope.weizhiss=result.address;
            });
          });
        }
      });
      marker.addEventListener("dragend", function(e){           //116.341749   39.959682
        // alert("当前位置：" + e.point.lng + ", " + e.point.lat);// 116.341951   39.959632
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: false,
          maxWidth: 100,
          showDelay: 0
        });
        lat=e.point.lat;
        long=e.point.lng;
        // 创建地理编码实例
        var myGeo = new BMap.Geocoder();
        $timeout(function () {
          // $ToastUtils.showToast("网络超时")
          $ionicLoading.hide();
        },7000);
        // // 根据坐标得到地址描述
        myGeo.getLocation(new BMap.Point(long, lat), function(result){
          if (result){
            $scope.$apply(function () {
              $timeout(function () {
                $ionicLoading.hide();
                $scope.weizhiss=result.address;
              });
            });
          }
        });
      })


      //查询功能
      // var local = new BMap.LocalSearch(map, {
      //   renderOptions: {map: map, panel: "results"},
      //   pageCapacity: 10
      // });
      // local.searchInBounds(" ", map.getBounds());
      //多地理位置代码
      // var mOption = {
      //   poiRadius : 100,           //半径为1000米内的POI,默认100米
      //   numPois : 5                //列举出50个POI,默认10个
      // }
      // $scope.weizhis=[];
      // // map.addOverlay(new BMap.Circle(point,500));        //添加一个圆形覆盖物,圆圈，显示不显示都行
      // myGeo.getLocation(point,
      //   function mCallback(rs){
      //     var allPois = rs.surroundingPois;       //获取全部POI（该点半径为100米内有6个POI点）
      //     for(var i=0;i<allPois.length;i++){
      //       // document.getElementById("panel").innerHTML += "<p style='font-size:12px;'>" + (i+1) + "、" + allPois[i].title + ",地址:" + allPois[i].address + "</p>";
      //       map.addOverlay(new BMap.Marker(allPois[i].point));
      //
      //       $scope.$apply(function () {
      //         $scope.weizhis.push(allPois[i].address);
      //       });
      //
      //
      //     }
      //   },mOption
      // );

    }, function(err) {
      $ToastUtils.showToast("请开启定位功能");
    });

    //返回
    $scope.gobackmsg=function () {
///:id/:ssid/:grouptype
      if($scope.grouptype === 'User'){
        $state.go('messageDetail', {
          id: $scope.userId,
          ssid:$scope.userName,
          grouptype:$scope.grouptype,
        });
      }else if($scope.grouptype === 'Dept'){
        $state.go('messageGroup', {
          id: $scope.userId,
          chatName:$scope.chatname,
          grouptype:$scope.grouptype,
          ismygroup:$scope.ismygroup
        });
      }else if($scope.grouptype === 'Group'){
        $state.go('messageGroup', {
          id: $scope.userId,
          chatName:$scope.chatname,
          grouptype:$scope.grouptype,
          ismygroup:$scope.ismygroup
        });
      }
    }

    //发送
    $scope.sendgeloction=function () {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 100,
        showDelay: 0
      });
      // $scope.$apply(function () {
        $ionicNavBarDelegate.showBar(false);
      // });

      // alert("有没有进来发送方法"+$scope.topic+$scope.grouptype);
      // var path;
      // $mqtt.getIconDir(function (data) {
      //   path=data;
      //   alert("存储截图路径"+path);
      // },function (err) {
      //
      // });
      var url = new Date().getTime()+"";
      $timeout(function () {
        $ionicLoading.hide();
        document.getElementById("container").style.height=(window.screen.height-95)+'px';
      },800);

      $timeout(function () {
        navigator.screenshot.save(function(error,res){
          // alert("进不进截屏");
          if(error){
            console.error(error);
          }else{
            // alert('ok'+res.filePath); //should be path/to/myScreenshot.jpg
            $scope.screenpath=res.filePath;
            $mqtt.getMqtt().getTopic($scope.topic, $scope.grouptype, function (userTopic) {
              // alert("单聊topic"+userTopic+$scope.grouptype);
              $greendao.getUUID(function (data) {
                $scope.sqlid=data;
                if($scope.grouptype === 'Dept' || $scope.grouptype === 'Group'){
                  //发送开始
                  var myGeo = new BMap.Geocoder();
                  myGeo.getLocation(new BMap.Point(long, lat), function(result){
                    if (result){
                      $scope.$apply(function () {
                        $timeout(function () {
                          $scope.content=long+","+lat+","+result.address;
                          // $scope.content=long+","+lat+","+$scope.screenpath;
                          // alert("1231321"+userTopic+$scope.grouptype+$scope.content);
                          $scope.suc = $mqtt.sendGroupMsg(userTopic, $scope.content, $scope.userId,$scope.grouptype,$scope.localuser,$scope.localuserId,$scope.sqlid,$scope.messagetype,$mqtt);
                          $scope.send_content = "";
                          // $timeout(function () {
                          //   viewScroll.scrollBottom();
                          // }, 100);
                          keepKeyboardOpen();
                        });
                      });
                    }
                  });
                  //发送结束
                }else if($scope.grouptype === 'User'){
                  //发送开始
                  var myGeo = new BMap.Geocoder();
                  myGeo.getLocation(new BMap.Point(long, lat), function(result){
                    if (result){
                      $scope.$apply(function () {
                        $timeout(function () {
                          $scope.content=long+","+lat+","+result.address;
                          // $scope.content=long+","+lat+","+$scope.screenpath;
                          // alert("1231321"+userTopic+$scope.grouptype+$scope.content);
                          $scope.suc = $mqtt.sendMsg(userTopic, $scope.content, $scope.userId,$scope.localuser,$scope.localuserId,$scope.sqlid,$scope.messagetype,'',$mqtt);
                          $scope.send_content = "";
                          // $timeout(function () {
                          //   viewScroll.scrollBottom();
                          // }, 100);
                          keepKeyboardOpen();
                        });
                      });
                    }
                  });
                  //发送结束
                }
              });

            }, function (msg) {

            });
          }
        },'jpg',100,url);
        $state.go(($scope.grouptype === 'User') ? 'messageDetail' : 'messageGroup', {
          id: $scope.userId,
          ssid:$scope.userName,
          grouptype:$scope.grouptype,
          longitude:long,
          latitude:lat
        });
      },900);

      /**
       * 监听消息
       */
      $scope.$on('msgs.update', function (event) {
        $scope.$apply(function () {
          // alert("进来单聊界面吗？");
          $timeout(function () {
            viewScroll.scrollBottom();
          }, 100);
          $chatarr.setData(data);
          $greendao.queryByConditions('ChatListService',function (data) {
            $scope.items=data;
            // alert("数组的长度"+data.length);
          },function (err) {

          });
        })
      });

    }

  })

  .controller('mapdetailCtrl',function ($scope,$state,$ToastUtils,$cordovaGeolocation,$stateParams,$ionicLoading,$timeout) {
    $scope.latitude=$stateParams.latitude;
    $scope.longitude=$stateParams.longitude;
    $scope.userId=$stateParams.id;//对方用户id
    $scope.userName=$stateParams.ssid;//对方用户名
    $scope.grouptype=$stateParams.grouptype;//grouptype
    $scope.ismygroup=$stateParams.ismygroup;//是否为自建群
    // alert("地图界面详情信息"+$scope.userId+$scope.userName+$scope.grouptype);
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });
    document.getElementById("container").style.height=(window.screen.height-140)+'px';
    //取出聊天界面带过来的id和ssid
    // $scope.topic=$stateParams.topic;
    // $scope.userId=$stateParams.id;//对方用户id
    // $scope.userName=$stateParams.ssid;//对方用户名
    // $scope.localuser=$stateParams.localuser;//当前用户名
    // $scope.localuserId=$stateParams.localuserId;//当前用户id
    // $scope.sqlid=$stateParams.sqlid;//itemid
    // $scope.grouptype=$stateParams.grouptype;//grouptype
    // $scope.messagetype=$stateParams.messagetype;//消息类型
    // alert("拿到的数据"+$scope.userId+$scope.userName+$scope.localuser+$scope.localuserId+$scope.sqlid+$scope.grouptype+$scope.messagetype);

    var lat="";
    var long="";
    //获取定位的经纬度
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    // alert("进来了")
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
      lat  = $scope.latitude;//   39.952728
      long = $scope.longitude;//  116.329102
      // $ToastUtils.showToast("经度"+lat+"纬度"+long);
      var map = new BMap.Map("container"); // 创建地图实例
      var point = new BMap.Point(long, lat); // 创建点坐标
      map.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别
      // map.addControl(new BMap.NavigationControl());
      // map.addControl(new BMap.NavigationControl());
      // map.addControl(new BMap.ScaleControl());
      map.addControl(new BMap.OverviewMapControl());
      // map.addControl(new BMap.MapTypeControl());
      var marker = new BMap.Marker(point); // 创建标注
      map.addOverlay(marker); // 将标注添加到地图中
      marker.enableDragging();
      var myGeo = new BMap.Geocoder();
      $timeout(function () {
        // $ToastUtils.showToast("网络超时")
        $ionicLoading.hide();
      },7000);
      // // 根据坐标得到地址描述
      myGeo.getLocation(new BMap.Point(long, lat), function(result){
        if (result){
          $scope.$apply(function () {
            $timeout(function () {
              $ionicLoading.hide();
              $scope.weizhiss=result.address;
            });
          });
        }
      });
      marker.addEventListener("dragend", function(e){           //116.341749   39.959682
        // alert("当前位置：" + e.point.lng + ", " + e.point.lat);// 116.341951   39.959632
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: false,
          maxWidth: 100,
          showDelay: 0
        });
        lat=e.point.lat;
        long=e.point.lng;
        // 创建地理编码实例
        var myGeo = new BMap.Geocoder();
        $timeout(function () {
          // $ToastUtils.showToast("网络超时")
          $ionicLoading.hide();
        },7000);
        // // 根据坐标得到地址描述
        myGeo.getLocation(new BMap.Point(long, lat), function(result){
          if (result){
            $scope.$apply(function () {
              $timeout(function () {
                $ionicLoading.hide();
                $scope.weizhiss=result.address;
              });
            });
          }
        });
      })


      //查询功能
      // var local = new BMap.LocalSearch(map, {
      //   renderOptions: {map: map, panel: "results"},
      //   pageCapacity: 10
      // });
      // local.searchInBounds(" ", map.getBounds());
      //多地理位置代码
      // var mOption = {
      //   poiRadius : 100,           //半径为1000米内的POI,默认100米
      //   numPois : 5                //列举出50个POI,默认10个
      // }
      // $scope.weizhis=[];
      // // map.addOverlay(new BMap.Circle(point,500));        //添加一个圆形覆盖物,圆圈，显示不显示都行
      // myGeo.getLocation(point,
      //   function mCallback(rs){
      //     var allPois = rs.surroundingPois;       //获取全部POI（该点半径为100米内有6个POI点）
      //     for(var i=0;i<allPois.length;i++){
      //       // document.getElementById("panel").innerHTML += "<p style='font-size:12px;'>" + (i+1) + "、" + allPois[i].title + ",地址:" + allPois[i].address + "</p>";
      //       map.addOverlay(new BMap.Marker(allPois[i].point));
      //
      //       $scope.$apply(function () {
      //         $scope.weizhis.push(allPois[i].address);
      //       });
      //
      //
      //     }
      //   },mOption
      // );

    }, function(err) {
      $ToastUtils.showToast("请开启定位功能");
    });

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

    //返回
    $scope.gobackdetailmsg=function () {
      // alert("进来了吗？11111");
      if($scope.grouptype === 'User'){
          $state.go('messageDetail', {
            id: $scope.userId,
            ssid:$scope.userName,
            grouptype:$scope.groupType
          });
      }else if($scope.grouptype === 'Dept'){
          // alert("进来了吗？");
          $state.go('messageGroup', {
            id: $scope.userId,
            chatName:$scope.userName,
            grouptype:$scope.groupType,
            ismygroup:$scope.ismygroup
          });
      }else if($scope.grouptype === 'Group'){
          $state.go('messageGroup', {
            id: $scope.userId,
            chatName:$scope.userName,
            grouptype:$scope.groupType,
            ismygroup:$scope.ismygroup
          });
      }
    }



  })

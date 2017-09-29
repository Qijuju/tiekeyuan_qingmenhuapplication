/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('message.controllers', [])
  .controller('MessageDetailCtrl', function ($scope, $state, $http, $ionicScrollDelegate, $mqtt, $ionicActionSheet, $greendao, $timeout, $rootScope, $stateParams,$chatarr,$ToastUtils, $cordovaCamera,$api,$searchdata,$phonepluin,$ScalePhoto,$ionicHistory,$pubionicloading,$ionicPlatform,$location,$cordovaClipboard,$okhttp) {

    /**
     * 长按事件
     */
    $scope.longtab = function (msgSingle) {
      $ionicActionSheet.show({
        buttons: [
          {text: '复制'}
        ],
        cancelText: '取消',
        buttonClicked: function (index) {
          if (index == 0) {
            $cordovaClipboard
              .copy(msgSingle.message)
              .then(function () {
                // success
                $ToastUtils.showToast("复制成功", null, null);
              }, function () {
                $ToastUtils.showToast("复制失败", null, null);
                // error
              });
          }
          return true;
        }
      });
    };

    $scope.$on('netstatus.update', function (event) {
      /*$scope.$apply(function () {

      })*/
      //alert("哈哈哈哈哈啊哈哈哈哈1");
      //   alert("关网时走不走"+$rootScope.netStatus);
      $rootScope.isConnect=$rootScope.netStatus;
      //alert("切换网络时"+$scope.isConnect);
    });


    $scope.$on('sendprogress.update', function (event) {
      $scope.$apply(function () {
        //$ToastUtils.showToast("进度进行中~~~",null,null);
        $scope.msgs=$mqtt.getDanliao();
      });
    });
    var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
    $scope.a=0;
    $scope.gengduo=function () {
      // alert("sdfdsdsf");
      //当点击更多按钮时，将语音模式切换成输入法模式(微信、钉钉)
      if($scope.isYuYin === 'true'){
        $scope.isYuYin = 'false';
        // $scope.a =1;
        // alert("单聊a直===="+$scope.a);
        keepKeyboardClose();
      }
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
    $scope.userId = $stateParams.id; //对方id
    $scope.viewtitle = $stateParams.ssid;//接收方姓名
    $scope.groupType = $stateParams.grouptype;//聊天类型
    //对话框名称
    $scope._id='';
    $scope.myUserID = $rootScope.rootUserId;//当前用户id
    $scope.localusr=$rootScope.userName;//当前用户名
    $scope.longitude = $stateParams.longitude;//当前用户id
    $scope.latitude=$stateParams.latitude;//当前用户名
    var isAndroid = ionic.Platform.isAndroid();
    $scope.otherheadpicurl='1';
    $scope.otheryoumeiyou=false;
   //取出头像url
    $greendao.queryData('OtherHeadPicService','where id =?',$scope.userId,function (succ) {
      if(succ[0].picurl==undefined||succ[0].picurl==null||succ[0].picurl.length==0){
        $scope.otheryoumeiyou=false;
        $scope.otherheadpicurl='1';
      }else {

        $scope.otheryoumeiyou=true;
        $scope.otherheadpicurl=succ[0].picurl;
      }

      // alert("id===="+succ[0].id+"picurl===="+succ[0].picurl);
    },function (err) {
      $scope.otherheadpicurl='1';
      $scope.otheryoumeiyou=false;
    });



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
                }else if(data[0].messagetype === 'Audio'){
                  $scope.lastText = "[语音]";//最后一条消息内容
                }else if(data[0].messagetype === 'Vedio'){
                  $scope.lastText = "[小视频]";//最后一条消息内容
                }else {
                  $scope.lastText = data[0].message;//最后一条消息内容
                }
                $scope.lastDate = data[0].when;//最后一条消息的时间
                $scope.chatName = data[0].username;//对话框名称

                $scope.imgSrc = $scope.otherheadpicurl;//最后一条消息的头像z
                $scope.srcName = data[0].username;//消息来源人名字
                $scope.srcId = data[0].senderid;//消息来源人id
                $scope.daytype=data[0].daytype;//最后一条消息的日期类型
                $scope.isSuccess=data[0].isSuccess;//最后一条消息的成功与否状态
                $scope.isFailure=data[0].isFailure;//最后一条消息的失败与否状态
                $scope.isRead=data[0].isread;//最后一条消息的已读未读状态
                $scope.messagetype=data[0].messagetype;//最后一条消息的类型

                //保存最后一条数据到chat表
                $greendao.queryData('ChatListService','where id =?',$scope.userId,function (data) {
                  //赋值chat对象
                  var chatitem = {};
                  chatitem.id = data[0].id;
                  chatitem.chatName = data[0].chatName;
                  if($scope.otherheadpicurl==undefined||$scope.otherheadpicurl==null||$scope.otherheadpicurl.length==0){
                    chatitem.imgSrc =$scope.imgSrc
                  }else {
                    chatitem.imgSrc =$scope.otherheadpicurl
                  }

                  chatitem.lastText = $scope.lastText;
                  chatitem.count = '0';
                  chatitem.isDelete = data[0].isDelete;
                  chatitem.lastDate = $scope.lastDate;
                  chatitem.chatType = data[0].chatType;
                  chatitem.senderId = $scope.srcId;//发送者id
                  chatitem.senderName = $scope.srcName;//发送者名字
                  chatitem.daytype=$scope.daytype;
                  chatitem.isSuccess=$scope.isSuccess;
                  chatitem.isFailure=$scope.isFailure;
                  chatitem.messagetype=$scope.messagetype;
                  chatitem.isRead=$scope.isRead;
                  $chatarr.updatedatanosort(chatitem);
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
                            if(data[i].messagetype != 'Audio'){
                              // alert("拿到库里的消息阅读状态"+data[i].isread);
                              data[i].isread ='1';
                              messaegeitem.isread=data[i].isread;
                              // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                              $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                                //回到主界面时，检测关闭语音
                                $mqtt.stopPlayRecord(function (success) {

                                },function (err) {
                                });
                                // alert("保存成功");
                                $state.go("tab.message", {
                                  "id": $scope.userId,
                                  "sessionid": $scope.chatName,
                                  "grouptype":"User"
                                });
                              },function (err) {
                              });
                            }else{
                              //为语音的时候直接返回到主界面，不改变isRead状态
                              $state.go("tab.message", {
                                "id": $scope.userId,
                                "sessionid": $scope.chatName,
                                "grouptype":"User"
                              });
                            }
                          }
                        }
                      }else{
                        //回到主界面时，检测关闭语音
                        $mqtt.stopPlayRecord(function (success) {
                        },function (err) {
                        });
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
                //回到主界面时，检测关闭语音
                $mqtt.stopPlayRecord(function (success) {
                },function (err) {
                });
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
              }else if(data[0].messagetype === 'Audio'){
                $scope.lastText = "[语音]";//最后一条消息内容
              }else if(data[0].messagetype === 'Vedio'){
                $scope.lastText = "[小视频]";//最后一条消息内容
              }else {
                $scope.lastText = data[0].message;//最后一条消息内容
              }
              $scope.lastDate = data[0].when;//最后一条消息的时间
              $scope.chatName = data[0].username;//对话框名称
              $scope.imgSrc = $scope.otherheadpicurl;//最后一条消息的头像
              $scope.srcName = data[0].username;//消息来源人名字
              $scope.srcId = data[0].senderid;//消息来源人id
              $scope.daytype=data[0].daytype;//最后一条消息的日期类型
              $scope.isSuccess=data[0].isSuccess;//最后一条消息的成功与否状态
              $scope.isFailure=data[0].isFailure;//最后一条消息的失败与否状态
              $scope.isRead=data[0].isread;//最后一条消息的已读未读状态
              $scope.messagetype=data[0].messagetype;//最后一条消息的类型
              // alert("最后一条消息的日期类型+成功状态"+$scope.daytype+$scope.isSuccess);

              //保存最后一条数据到chat表
              $greendao.queryData('ChatListService','where id =?',$scope.userId,function (data) {
                //赋值chat对象
                var chatitem = {};
                chatitem.id = data[0].id;
                chatitem.chatName = data[0].chatName;
                chatitem.lastText = $scope.lastText;
                chatitem.count = '0';
                chatitem.isDelete = data[0].isDelete;
                chatitem.lastDate = $scope.lastDate;
                chatitem.chatType = data[0].chatType;
                chatitem.senderId = $scope.srcId;//发送者id
                if($scope.otherheadpicurl==undefined||$scope.otherheadpicurl==null||$scope.otherheadpicurl.length==0){
                  chatitem.imgSrc =$scope.imgSrc
                }else {
                  chatitem.imgSrc =$scope.otherheadpicurl
                }
                chatitem.senderName = $scope.srcName;//发送者名字
                chatitem.daytype=$scope.daytype;
                chatitem.isSuccess=$scope.isSuccess;
                chatitem.isFailure=$scope.isFailure;
                chatitem.messagetype=$scope.messagetype;
                chatitem.isRead=$scope.isRead;
                $chatarr.updatedatanosort(chatitem);
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
                          if(data[i].messagetype != 'Audio'){
                            // alert("拿到库里的消息阅读状态"+data[i].isread);
                            data[i].isread ='1';
                            messaegeitem.isread=data[i].isread;
                            // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                            $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                              //回到主界面时，检测关闭语音
                              $mqtt.stopPlayRecord(function (success) {

                              },function (err) {
                              });
                              // alert("保存成功");
                              $state.go("tab.message", {
                                "id": $scope.userId,
                                "sessionid": $scope.chatName,
                                "grouptype":"User"
                              });
                            },function (err) {
                            });
                          }else{
                            //为语音的时候直接返回到主界面，不改变isRead状态
                            $state.go("tab.message", {
                              "id": $scope.userId,
                              "sessionid": $scope.chatName,
                              "grouptype":"User"
                            });
                          }
                        }
                      }
                    }else {
                      //回到主界面时，检测关闭语音
                      $mqtt.stopPlayRecord(function (success) {
                      },function (err) {
                      });
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
        $pubionicloading.hide();
      }
      e.preventDefault();
      return false;


    },501);



    //一进来就检查网络是否连接
    $mqtt.setOnNetStatusChangeListener(function (succ) {
      $rootScope.netStatus = 'true';
      $rootScope.$broadcast('netstatus.update');
    },function (err) {
      $rootScope.netStatus='false';
      $rootScope.$broadcast('netstatus.update');
    });

    $scope.$on('$ionicView.enter', function () {
      $timeout(function () {
        viewScroll.scrollBottom();
        //进入聊天界面就将该聊天的count值给减掉
        $greendao.queryData('ChatListService','where id =?',$scope.userId,function (succ) {
          var count=succ[0].count;//取出该对话的count值
          // alert("进入消息界面的count"+count);
          //取出保存的badgecount值并减去
          $mqtt.getInt('badgeCount',function (newcount) {
            var lastcount=newcount-count;
            cordova.plugins.notification.badge.set(lastcount,function (succ) {
              // alert("成功"+succ);
              $mqtt.saveInt('badgeCount',lastcount);
            },function (err) {
              // alert("失败"+err);
            });
            // alert("聊天详情界面取出存储的count值"+lastcount);
          },function (err) {
          });
        },function (err) {
        })
      }, 100);
    });

    //在个人详情界面点击创建聊天时，在聊天详情界面，创建chatitem
    if ($rootScope.isPersonSend === 'true') {
      $greendao.queryData('MessagesService','where sessionid =?',$scope.userId,function (data) {
        if(data.length>0){
            $chatarr.getIdChatName($scope.userId,$scope.viewtitle);
            $chatarr.getAll($rootScope.isPersonSend,$scope.groupType);
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
        $pubionicloading.showloading('','Loading...');
      }
      $scope.hideLoadingToast = function () {
        $pubionicloading.hide();
      }




    // $ToastUtils.showToast($scope.viewtitle+"抬头"+$scope.myUserID);
    $greendao.queryData('MessagesService', 'where sessionid =? order by "when" desc limit 0,10', $scope.userId, function (data) {
      //根据不同用户，显示聊天记录，查询数据库以后，不论有没有数据，都要清楚之前数组里面的数据
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

      var millions=new Date(year+"/"+$mqtt.getMonthOrDay(month)+"/"+$mqtt.getMonthOrDay(day)+" "+"00:00:00").getTime();
      // alert("最低毫秒值"+millions);

      var maxmillions=new Date(year+"/"+$mqtt.getMonthOrDay(month)+"/"+$mqtt.getMonthOrDay(day)+" "+"23:59:59").getTime();
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
            messaegeitem.imgSrc=$scope.otherheadpicurl;
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
        var picPath = imageURI;
        console.log("getPicture:" + picPath);
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
        $mqtt.getMqtt().getTopic(topic, "User", function (userTopic) {
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
        });
      }, function (err) {
      });
    };

    $scope.takePhoto = function (topic, content, id,localuser,localuserId,sqlid) {
      $mqtt.takePhoto(function (fileData) {
        $mqtt.getMqtt().getTopic(topic, "User", function (userTopic) {
          var fileType = 'Image';
          $greendao.getUUID(function (data) {
            sqlid=data;
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

    $scope.takeVideo = function (topic, content, id,localuser,localuserId,sqlid) {
      $mqtt.takeVideo(function (fileData) {
        $mqtt.getMqtt().getTopic(topic, "User", function (userTopic) {
          var fileType = 'Vedio';
          $greendao.getUUID(function (data) {
            sqlid=data;
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
        return 'img/location.jpg';
      }
      var msg = message.split('###')[1];
      if (message === undefined || message === null || message === '' || msg === undefined || msg === null || msg === '') {
          return 'img/ems_file.png';
      }
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
      var msg = message.split('###')[4];
      return msg;//lastindex <= 0 ? msg : msg.substr(lastindex + 1, msg.length);
    };

    $scope.getFilePath = function (message) {
      var filePath = message.split("###")[1];
      return filePath;
    };

    //打开文件
    $scope.openAllFile = function (path, msg) {
      $okhttp.downloadFile(msg,0,path,function (success) {
        msg.message=success;
        $greendao.saveObj('MessagesService',msg,function (data) {
          $mqtt.updateDanliao(msg);
          $rootScope.$broadcast('sendprogress.update');
        },function (err) {
        });
      },function (err) {

      })

    };
    //弹出测试
    $scope.alertMsg = function (message) {
      alert(message);
    };

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

    function keepKeyboardClose() {
      var keyboard = cordova.require('ionic-plugin-keyboard.keyboard');
      keyboard.close();
    }


    $scope.i=0;
    //在联系人界面时进行消息监听，确保人员收到消息
    //收到消息时，创建对话聊天(cahtitem)
    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
          /**
           * 当在当前界面收到消息时，及时将count=0，并且将该条数据未读状态置为已读，并保存
           */
          // alert("用户id"+$scope.userId);
          $scope.msgs=$mqtt.getDanliao();
          // 获取当天日期
          var myDate = new Date();//
          myDate.toLocaleDateString();//可以获取当前日期
          // alert("获取当前日期"+myDate.toLocaleDateString());
          myDate.toLocaleTimeString(); //可以获取当前时间
          // alert("获取当前时间"+myDate.toLocaleTimeString());

          var year=myDate.getFullYear() + 0;//获取年份
          var month=myDate.getMonth()+1;//获取月份
          var day=myDate.getDate() + 0;//获取日期
          // alert("获取当前年月日"+year+month+day);

          var millions=new Date(year+"/"+$mqtt.getMonthOrDay(month)+"/"+$mqtt.getMonthOrDay(day)+" "+"00:00:00").getTime();
          // alert("最低毫秒值"+millions);

          var maxmillions=new Date(year+"/"+$mqtt.getMonthOrDay(month)+"/"+$mqtt.getMonthOrDay(day)+" "+"23:59:59").getTime();
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
              if($scope.otherheadpicurl==undefined||$scope.otherheadpicurl==null||$scope.otherheadpicurl.length==0){
                chatitem.imgSrc =$scope.imgSrc
              }else {
                chatitem.imgSrc =$scope.otherheadpicurl
              }
              chatitem.lastText = data[0].lastText;
              chatitem.count = '0';
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = data[0].lastDate;
              chatitem.chatType = data[0].chatType;
              chatitem.senderId = data[0].senderId;//发送者id
              chatitem.senderName = data[0].senderName;//发送者名字
              chatitem.daytype=data[0].daytype;
              chatitem.isSuccess=data[0].isSuccess;
              chatitem.isFailure=data[0].isFailure;
              chatitem.messagetype=data[0].messagetype;
              chatitem.isRead=data[0].isRead;
              $greendao.saveObj('ChatListService',chatitem,function (data) {
                $greendao.queryDataByIdAndIsread($scope.userId,'0',function (data) {
                  for(var i=0;i<data.length;i++){
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
                    messaegeitem.daytype=data[i].daytype;
                    if(data[i].isread ==='0'){
                      if(data[i].messagetype != 'Audio'){
                        data[i].isread ='1';
                        messaegeitem.isread=data[i].isread;
                        $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                          $timeout(function () {
                            viewScroll.scrollBottom();
                          }, 100);
                        },function (err) {
                        });
                      }else{
                          viewScroll.scrollBottom();
                      }
                    }
                  }
                },function (err) {
                });
              },function (err) {

              });
            }
          },function (err) {

          });


        $greendao.loadAllData('ChatListService',function (msg) {
          // alert("拿到的cunt"+JSON.stringify(msg));
          $scope.allNoRead=0;
          if (msg.length>0){
            for(var i=0;i<msg.length;i++){
              $scope.allNoRead=$scope.allNoRead+parseInt(msg[i].count, 10);
            }
            cordova.plugins.notification.badge.set($scope.allNoRead,function (succ) {
              // alert("刷新监听成功messagedetail"+succ);
              $mqtt.saveInt("badgeCount",$scope.allNoRead);
            },function (err) {
              // alert("失败"+err);
            });
          }
        },function (err) {

        })
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

          }
          if (index === 0 && (msgSingle.messagetype === 'normal' || msgSingle.messagetype === 'Text')) {
            $scope.sendSingleMsg(topic, content, id,localuser,localuserId,sqlid);
          } else if (index === 0 && (msgSingle.messagetype === 'Image' || msgSingle.messagetype === 'File' || msgSingle.messagetype === 'Vedio')) {
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
          } else if(index === 0 && msgSingle.messagetype === 'Audio') {
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
              var mesgs = msgSingle.message.substring(msgSingle.message.indexOf("###") + 3);
              $scope.suc=$mqtt.sendDocFileMsg(userTopic,mesgs,mesgs,id,localuser,localuserId,sqlid,msgSingle.messagetype,$scope.filepath,$mqtt,$scope.groupType);
              $scope.send_content = "";
              keepKeyboardOpen();
            }, function (msg) {
            });
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

    //判断文件是否是视频格式
    $scope.isMsgVideo = function (filePath) {
      if(filePath!=null && filePath!="undefined" && filePath!=""){
        return $mqtt.isVideo(filePath);
      }
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
              }else if(data[0].messagetype === 'Audio'){
                $scope.lastText = "[语音]";//最后一条消息内容
              }else if(data[0].messagetype === 'Vedio'){
                $scope.lastText = "[小视频]";//最后一条消息内容
              }else {
                $scope.lastText = data[0].message;//最后一条消息内容
              }
              $scope.lastDate = data[0].when;//最后一条消息的时间
              $scope.chatName = data[0].username;//对话框名称
              $scope.imgSrc = $scope.otherheadpicurl;//最后一条消息的头像
              $scope.srcName = data[0].username;//消息来源人名字
              $scope.srcId = data[0].senderid;//消息来源人id
              $scope.daytype=data[0].daytype;//最后一条消息的日期类型
              $scope.isSuccess=data[0].isSuccess;//最后一条消息的成功与否状态
              $scope.isFailure=data[0].isFailure;//最后一条消息的失败与否状态
              $scope.isRead=data[0].isread;//最后一条消息的已读未读状态
              $scope.messagetype=data[0].messagetype;//最后一条消息的类型
              // alert("最后一条消息的日期类型+成功状态"+$scope.daytype+$scope.isSuccess);
              //保存最后一条数据到chat表
              $greendao.queryData('ChatListService','where id =?',$scope.userId,function (data) {
                //赋值chat对象
                var chatitem = {};
                chatitem.id = data[0].id;
                chatitem.chatName = data[0].chatName;
                if($scope.otherheadpicurl==undefined||$scope.otherheadpicurl==null||$scope.otherheadpicurl.length==0){
                  chatitem.imgSrc =$scope.imgSrc
                }else {
                  chatitem.imgSrc =$scope.otherheadpicurl
                }
                chatitem.lastText = $scope.lastText;
                chatitem.count = '0';
                chatitem.isDelete = data[0].isDelete;
                chatitem.lastDate = $scope.lastDate;
                chatitem.chatType = data[0].chatType;
                chatitem.senderId = $scope.srcId;//发送者id
                chatitem.senderName = $scope.srcName;//发送者名字
                chatitem.daytype=$scope.daytype;
                chatitem.isSuccess=$scope.isSuccess;
                chatitem.isFailure=$scope.isFailure;
                chatitem.messagetype=$scope.messagetype;
                chatitem.isRead=$scope.isRead;
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
                          if(data[i].messagetype != 'Audio'){
                            // alert("拿到库里的消息阅读状态"+data[i].isread);
                            data[i].isread ='1';
                            messaegeitem.isread=data[i].isread;
                            // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                            $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                              //回到主界面时，检测关闭语音
                              $mqtt.stopPlayRecord(function (success) {

                              },function (err) {
                              });
                              // alert("保存成功");
                              $state.go("tab.message", {
                                "id": $scope.userId,
                                "sessionid": $scope.chatName,
                                "grouptype":"User"
                              });
                            },function (err) {
                            });
                          }else{
                            //为语音的时候直接返回到主界面，不改变isRead状态
                            $state.go("tab.message", {
                              "id": $scope.userId,
                              "sessionid": $scope.chatName,
                              "grouptype":"User"
                            });
                          }

                        }
                      }
                    }else{
                      //回到主界面时，检测关闭语音
                      $mqtt.stopPlayRecord(function (success) {
                      },function (err) {
                      });
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
              //回到主界面时，检测关闭语音
              $mqtt.stopPlayRecord(function (success) {

              },function (err) {
              });
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
            }else if(data[0].messagetype === 'Audio'){
              $scope.lastText = "[语音]";//最后一条消息内容
            }else if(data[0].messagetype === 'Vedio'){
              $scope.lastText = "[小视频]";//最后一条消息内容
            }else {
              $scope.lastText = data[0].message;//最后一条消息内容
            }
            $scope.lastDate = data[0].when;//最后一条消息的时间
            $scope.chatName = data[0].username;//对话框名称
            $scope.imgSrc = $scope.otherheadpicurl;//最后一条消息的头像
            $scope.srcName = data[0].username;//消息来源人名字
            $scope.srcId = data[0].senderid;//消息来源人id
            $scope.daytype=data[0].daytype;//最后一条消息的日期类型
            $scope.isSuccess=data[0].isSuccess;//最后一条消息的成功与否状态
            $scope.isFailure=data[0].isFailure;//最后一条消息的失败与否状态
            $scope.isRead=data[0].isread;//最后一条消息的已读未读状态
            $scope.messagetype=data[0].messagetype;//最后一条消息的类型
            // alert("最后一条消息的日期类型+成功状态"+$scope.daytype+$scope.isSuccess);

            //保存最后一条数据到chat表
            $greendao.queryData('ChatListService','where id =?',$scope.userId,function (data) {
              //赋值chat对象
              var chatitem = {};
              chatitem.id = data[0].id;
              chatitem.chatName = data[0].chatName;
              if($scope.otherheadpicurl==undefined||$scope.otherheadpicurl==null||$scope.otherheadpicurl.length==0){
                chatitem.imgSrc =$scope.imgSrc
              }else {
                chatitem.imgSrc =$scope.otherheadpicurl
              }
              chatitem.lastText = $scope.lastText;
              chatitem.count = '0';
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = $scope.lastDate;
              chatitem.chatType = data[0].chatType;
              chatitem.senderId = $scope.srcId;//发送者id
              chatitem.senderName = $scope.srcName;//发送者名字
              chatitem.daytype=$scope.daytype;
              chatitem.isSuccess=$scope.isSuccess;
              chatitem.isFailure=$scope.isFailure;
              chatitem.messagetype=$scope.messagetype;
              chatitem.isRead=$scope.isRead;
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
                        if(data[i].messagetype != 'Audio'){
                          // alert("拿到库里的消息阅读状态"+data[i].isread);
                          data[i].isread ='1';
                          messaegeitem.isread=data[i].isread;
                          // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                          $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                            //回到主界面时，检测关闭语音
                            $mqtt.stopPlayRecord(function (success) {

                            },function (err) {
                            });
                            // alert("保存成功");
                            //chat表count值改变过后并且message表消息状态全部改变以后，返回主界面
                            $state.go("tab.message", {
                              "id": $scope.userId,
                              "sessionid": $scope.chatName,
                              "grouptype":"User"
                            });
                          },function (err) {
                          });
                        }else{
                          $state.go("tab.message", {
                            "id": $scope.userId,
                            "sessionid": $scope.chatName,
                            "grouptype":"User"
                          });
                        }

                      }
                    }
                  }else {
                    //回到主界面时，检测关闭语音
                    $mqtt.stopPlayRecord(function (success) {

                    },function (err) {
                    });
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



    var MIN_SOUND_TIME = 800;
    var recorder = null;
    var startTimestamp = null;
    var stopTimestamp = null;
    var stopTimer = null;
    var recordCancel = false;

    var soundAlert = document.getElementById("sound-alert");
    var audioTips = document.getElementById("audio-tips");
    // 控制录音弹出框是否播放
    var setSoundAlertVisable=function(show){
      if(show){
        soundAlert.style.display = 'block';
        soundAlert.style.opacity = 1;
      }else{
        soundAlert.style.opacity = 0;
        //  完成再真正隐藏
        setTimeout(function(){
          soundAlert.style.display = 'none';
        },200);
      }
    };



    /**
     * 录音语音文件转base64字符串
     * @param {Object} path
     */
    $scope.Audio2dataURL =function(path) {
      plus.io.resolveLocalFileSystemURL(path, function(entry){
        entry.file(function(file){
          var reader = new plus.io.FileReader();
          reader.onloadend = function (e) {
            console.log(e.target.result);
          };
          reader.readAsDataURL(file);
        },function(e){
          mui.toast("读写出现异常: " + e.message );
        })
      })
    }

    /**
     * base64字符串转成语音文件(参考http://ask.dcloud.net.cn/question/16935)
     * @param {Object} base64Str
     * @param {Object} callback
     */
    $scope.dataURL2Audio =function (base64Str, callback) {
      var base64Str = base64Str.replace('data:audio/amr;base64,','');
      var audioName = (new Date()).valueOf() + '.amr';

      plus.io.requestFileSystem(plus.io.PRIVATE_DOC,function(fs){
        fs.root.getFile(audioName,{create:true},function(entry){
          // 获得平台绝对路径
          var fullPath = entry.fullPath;
          if(mui.os.android){
            // 读取音频
            var Base64 = plus.android.importClass("android.util.Base64");
            var FileOutputStream = plus.android.importClass("java.io.FileOutputStream");
            try{
              var out = new FileOutputStream(fullPath);
              var bytes = Base64.decode(base64Str, Base64.DEFAULT);
              out.write(bytes);
              out.close();
              // 回调
              callback && callback(entry);
            }catch(e){
              console.log(e.message);
            }
          }else if(mui.os.ios){
            var NSData = plus.ios.importClass('NSData');
            var nsData = new NSData();
            nsData = nsData.initWithBase64EncodedStringoptions(base64Str,0);
            if (nsData) {
              nsData.plusCallMethod({writeToFile: fullPath,atomically:true});
              plus.ios.deleteObject(nsData);
            }
            // 回调
            callback && callback(entry);
          }
        })
      })
    }

    // //将是否为点击语音的动作初始化为false(键盘)
    $scope.isYuYin='false';
    //默认不展示语音居中框
    $scope.isShow='false';
    $scope.isshowless ='false';
    $scope.isshowgPng = 'true';
    /**
     * 点击语音按钮触发事件
     */
    $scope.clickOn=function () {
      if($scope.a === 1){
        // alert("进不进");
        $scope.gengduo();
      }
      if($scope.isYuYin=== 'false'){
        $scope.isYuYin="true";
      }
      keepKeyboardClose();
    }

    /**
     * 点击键盘触发事件
     */
    $scope.clickOnChange=function () {
      $scope.isYuYin="false";
      $scope.isShow='false';
    }


      /**
       * 长按语音按钮触发事件
       */
      $scope.showYuyin=function (messagetype,sqlid) {
        $scope.isShow='true';
        $scope.isshowless='false';
        $scope.recordTime = 0;
        $scope.ctime = 0;
        $scope.rate = 0;
        $scope.duration = 0;
        if($scope.isshowgif ==="true"){
          $scope.isshowgPng="true";
          $scope.isshowgif ="false"
          // $ToastUtils.showToast("原本的语音在播放");
        }
        $mqtt.startRecording(function (succ) {
          $scope.$apply(function () {
            $scope.type=succ.type;
            // alert("type--->"+$scope.type);
            if($scope.type === "timeChange"){
              $scope.recordTime=succ.recordTime;
            }else if($scope.type === "timeout"){
              $scope.ctime=succ.time;
              // alert("超过59秒======》"+$scope.ctime);
              $timeout(function () {
                $scope.isShow='false';
                // $scope.isshowless='false';
              }, 100);
              $scope.recordTime = 0;
              $scope.rate = 0;
            }else if($scope.type === "rateChange"){
              $scope.rate=succ.rate;
              // $ToastUtils.showToast("rate=====>"+$scope.rate);
            }else if($scope.type === "error"){
              $scope.error=succ.error;
            }
          });
        },function (err) {

        });

      }

    /**
     * 语音上滑取消
     * @param $event
     */
      $scope.onDragVoiceBtn = function($event) {
      var y=$event.gesture.deltaY;
      if (y < -10) {
        $scope.isshowless = 'back';
      } else {
        $scope.isshowless = 'false';
      }
    };

    /**
     * 松开语音按钮触发事件
     */
    $scope.releaseYuyin=function (messagetype,sqlid) {
      //若录取的时间小于1s
      //当录取的时间大于1s小于60s时，给一个标志符
      $mqtt.stopRecording(function (succ) {
        if ($scope.isshowless === 'back') {
          $scope.$apply(function () {
            $scope.isShow='false';
            $scope.isshowless='false';
            $scope.recordTime = 0;
            $scope.rate = 0;
          });
          return;

        }
        $scope.$apply(function () {
          if (succ.duration  <1000){
            $scope.isshowless='true';
            $scope.recordTime = 0;
            $scope.rate = 0;
          }
          $scope.isshowgPng="true";
          $scope.rate=-1;
          $scope.filepath=succ.filePath;
          $scope.duration=succ.duration;
          if($scope.duration <1000){
            $scope.recordTime = 0;
            $scope.rate = 0;
            $scope.isshowless='true';
            $timeout(function () {
              viewScroll.scrollBottom();
              $scope.isShow='false';
              $scope.isshowless='false';
            }, 1000);
          }else{
            $scope.isShow='false';
            $scope.isshowless='false';
            //发送语音
            $mqtt.getMqtt().getTopic($scope.userId,$scope.groupType,function (userTopic) {
              $greendao.getUUID(function (data) {
                sqlid=data;
                $scope.suc=$mqtt.sendDocFileMsg(userTopic,$scope.filepath+'###' + $scope.duration,$scope.filepath+'###' + $scope.duration,$scope.userId,$scope.localusr,$scope.myUserID,sqlid,messagetype,$scope.filepath,$mqtt,$scope.groupType);
                keepKeyboardOpen();
                $timeout(function () {
                  viewScroll.scrollBottom();
                }, 1000);
              });
            },function (err) {
            });
          }
        });
      },function (err) {

      });
    }

    /**
     * 播放语音
     */
    $scope.islisten='false';
    $scope.audioid='';
    $scope.isshowgif='false';
    $scope.showanimation=function (filepath,sqlid,isRead) {
      if($scope.audioid != sqlid){
        $scope.isshowgif='true';
        $scope.islisten='true';
        $scope.isshowgPng ='false';
      }else{
        if($scope.islisten === 'false'){
          $scope.isshowgif='true';
          $scope.islisten= 'true';
          $scope.isshowgPng ='false';
        }else{
          $scope.isshowgif='false';
          $scope.islisten= 'false';
          $scope.isshowgPng ='true';
        }
      }
      $scope.audioid=sqlid;
      if($scope.islisten === 'true'){
        //alert("播放语音啦");
        $mqtt.playRecord(filepath.substring(filepath.lastIndexOf('/') + 1, filepath.length), function (succ) {
          $scope.$apply(function () {
            $scope.isshowgif = 'false';
            $scope.isshowgPng = 'true';
            $scope.islisten = 'false';
            $scope.audioid = '';
          });
        }, function (err) {
          $scope.$apply(function () {
            $scope.isshowgif = 'false';
            $scope.islisten = 'false';
            $scope.isshowgPng = 'true';
            $scope.audioid = '';
            $ToastUtils.showToast(err);
          });
        });

      }else{
        $mqtt.stopPlayRecord(function (data) {
          $scope.$apply(function () {
            $scope.isshowgif='false';
            $scope.islisten='false';
            $scope.isshowgPng ='true';
            $scope.audioid='';
            $scope.islisten='false';
          });
        },function (err) {
          $scope.$apply(function () {
            $scope.isshowgif = 'false';
            $scope.islisten = 'false';
            $scope.isshowgPng = 'true';
            $scope.audioid = '';
          });
        });
      }

      //修改语音播放未读已读状态
      if(isRead === '0'){
        $greendao.queryData('MessagesService','where _id =?',sqlid,function (data) {
          // alert("进来了吗");
          var messaegeitem={};
          messaegeitem._id=data[0]._id;
          messaegeitem.sessionid=data[0].sessionid;
          messaegeitem.type=data[0].type;
          // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
          messaegeitem.from=data[0].from;
          messaegeitem.message=data[0].message;
          messaegeitem.messagetype=data[0].messagetype;
          messaegeitem.platform=data[0].platform;
          messaegeitem.when=data[0].when;
          messaegeitem.isFailure=data[0].isFailure;
          messaegeitem.isDelete=data[0].isDelete;
          messaegeitem.imgSrc=$scope.otherheadpicurl;
          messaegeitem.username=data[0].username;
          messaegeitem.senderid=data[0].senderid;
          messaegeitem.isSuccess=data[0].isSuccess;
          messaegeitem.daytype=data[0].daytype;
          messaegeitem.istime=data[0].istime;
          messaegeitem.isread='1';
          $greendao.saveObj('MessagesService',messaegeitem,function (succ) {
            $mqtt.updateDanliao(messaegeitem);
          },function (err) {
          });
        },function (err) {

        });
      }

    }



    /**
     * 单聊扬声器和听筒模式切换
     */
    $scope.showsingleTingtong='true';
    $mqtt.getProxyMode(function (suc) {
      if(suc === 1){
        $scope.proxyMode='false';
      }else{
        $scope.proxyMode='true';
      }
      $rootScope.$broadcast('change_proxy_mode.success');
    })
    $scope.openSingleYangshengqiMode=function () {
      $scope.showsingleTingtong='true';
      $mqtt.setProxyMode(0);
    }

    $scope.openSingleTingtongMode=function () {
      $scope.showsingleTingtong ='false';
      $mqtt.setProxyMode(1);
    }

    $scope.$on('change_proxy_mode.success', function (event) {
      $scope.$apply(function () {
        $scope.showsingleTingtong =$scope.proxyMode;
      })
    });

      $scope.$on('$ionicView.afterLeave', function () {
      // alert("单聊after离开");
      $rootScope.$broadcast('noread.update');
      $rootScope.$broadcast('netstatus.update');
      $chatarr.setIdToMc($scope.userId);
    });


    $scope.leavechange=function () {
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
              }else if(data[0].messagetype === 'Audio'){
                $scope.lastText = "[语音]";//最后一条消息内容
              }else if(data[0].messagetype === 'Vedio'){
                $scope.lastText = "[小视频]";//最后一条消息内容
              }else {
                $scope.lastText = data[0].message;//最后一条消息内容
              }
              $scope.lastDate = data[0].when;//最后一条消息的时间
              $scope.chatName = data[0].username;//对话框名称
              $scope.imgSrc = $scope.otherheadpicurl;//最后一条消息的头像
              $scope.srcName = data[0].username;//消息来源人名字
              $scope.srcId = data[0].senderid;//消息来源人id
              $scope.daytype=data[0].daytype;//最后一条消息的日期类型
              $scope.isSuccess=data[0].isSuccess;//最后一条消息的成功与否状态
              $scope.isFailure=data[0].isFailure;//最后一条消息的失败与否状态
              $scope.isRead=data[0].isread;//最后一条消息的已读未读状态
              $scope.messagetype=data[0].messagetype;//最后一条消息的类型
              //保存最后一条数据到chat表
              $greendao.queryData('ChatListService','where id =?',$scope.userId,function (data) {
                //赋值chat对象
                var chatitem = {};
                chatitem.id = data[0].id;
                chatitem.chatName = data[0].chatName;
                if($scope.otherheadpicurl==undefined||$scope.otherheadpicurl==null||$scope.otherheadpicurl.length==0){
                  chatitem.imgSrc =$scope.imgSrc
                }else {
                  chatitem.imgSrc =$scope.otherheadpicurl
                }
                chatitem.lastText = $scope.lastText;
                chatitem.count = '0';
                chatitem.isDelete = data[0].isDelete;
                chatitem.lastDate = $scope.lastDate;
                chatitem.chatType = data[0].chatType;
                chatitem.senderId = $scope.srcId;//发送者id
                chatitem.senderName = $scope.srcName;//发送者名字
                chatitem.daytype=$scope.daytype;
                chatitem.isSuccess=$scope.isSuccess;
                chatitem.isFailure=$scope.isFailure;
                chatitem.messagetype=$scope.messagetype;
                chatitem.isRead=$scope.isRead;
                $chatarr.updatedatanosort(chatitem);
                $greendao.saveObj('ChatListService',chatitem,function (data) {
                  $greendao.queryDataByIdAndIsread($scope.userId,'0',function (data) {
                    if(data.length>0){
                      for(var i=0;i<data.length;i++){
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
                        messaegeitem.daytype=data[i].daytype;
                        messaegeitem.istime=data[i].istime;
                        if(data[i].isread ==='0'){
                          data[i].isread ='1';
                          messaegeitem.isread=data[i].isread;
                          $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                          },function (err) {
                          });
                        }
                      }
                    }else{
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
            }else if(data[0].messagetype === 'Audio'){
              $scope.lastText = "[语音]";//最后一条消息内容
            }else if(data[0].messagetype === 'Vedio'){
              $scope.lastText = "[小视频]";//最后一条消息内容
            }else {
              $scope.lastText = data[0].message;//最后一条消息内容
            }
            $scope.lastDate = data[0].when;//最后一条消息的时间
            $scope.chatName = data[0].username;//对话框名称
            $scope.imgSrc = $scope.otherheadpicurl;//最后一条消息的头像
            $scope.srcName = data[0].username;//消息来源人名字
            $scope.srcId = data[0].senderid;//消息来源人id
            $scope.daytype=data[0].daytype;//最后一条消息的日期类型
            $scope.isSuccess=data[0].isSuccess;//最后一条消息的成功与否状态
            $scope.isFailure=data[0].isFailure;//最后一条消息的失败与否状态
            $scope.isRead=data[0].isread;//最后一条消息的已读未读状态
            $scope.messagetype=data[0].messagetype;//最后一条消息的类型
            // alert("最后一条消息的日期类型+成功状态"+$scope.daytype+$scope.isSuccess);

            //保存最后一条数据到chat表
            $greendao.queryData('ChatListService','where id =?',$scope.userId,function (data) {
              //赋值chat对象
              var chatitem = {};
              chatitem.id = data[0].id;
              chatitem.chatName = data[0].chatName;
              if($scope.otherheadpicurl==undefined||$scope.otherheadpicurl==null||$scope.otherheadpicurl.length==0){
                chatitem.imgSrc =$scope.imgSrc
              }else {
                chatitem.imgSrc =$scope.otherheadpicurl
              }
              chatitem.lastText = $scope.lastText;
              chatitem.count = '0';
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = $scope.lastDate;
              chatitem.chatType = data[0].chatType;
              chatitem.senderId = $scope.srcId;//发送者id
              chatitem.senderName = $scope.srcName;//发送者名字
              chatitem.daytype=$scope.daytype;
              chatitem.isSuccess=$scope.isSuccess;
              chatitem.isFailure=$scope.isFailure;
              chatitem.messagetype=$scope.messagetype;
              chatitem.isRead=$scope.isRead;
              $chatarr.updatedatanosort(chatitem);
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
                        },function (err) {
                        });
                      }
                    }
                  }else {
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






  .controller('MessageGroupCtrl', function ($scope, $state, $http, $ionicScrollDelegate, $mqtt, $ionicActionSheet, $greendao, $timeout,$stateParams,$rootScope,$chatarr,$ToastUtils,$ionicHistory,$ScalePhoto,$api,$location,$ionicPlatform,$pubionicloading,$cordovaClipboard,$okhttp) {

    /**
     * 长按事件
     */
    $scope.longtabGroup = function (msgSingle) {
      $ionicActionSheet.show({
        buttons: [
          {text: '复制'}
        ],
        cancelText: '取消',
        buttonClicked: function (index) {
          if (index == 0) {
            $cordovaClipboard
              .copy(msgSingle.message)
              .then(function () {
                // success
                $ToastUtils.showToast("复制成功");
              }, function () {
                $ToastUtils.showToast("复制失败");
                // error
              });
          }
          return true;
        }
      });
    };

    $scope.$on('netstatus.update', function (event) {
      $scope.$apply(function () {
        $rootScope.isConnect=$rootScope.netStatus;
      })
    });




    //获取用户修改后的头像
    $scope.picyoumeiyoumsg=false;
    $scope.p=$rootScope.securlpicaaa;
    $scope.otheryoumeiyougro=false;
    if($scope.p==null|| $scope.p.length==0|| $scope.p==undefined){
      $scope.picyoumeiyoumsg=false;
    }else {
      $scope.picyoumeiyoumsg=true;
        $scope.securlpicmsg= $scope.p
    }

    //获取对方修改后的头像




    $scope.$on('sendgroupprogress.update', function (event) {
      $scope.$apply(function () {
        $scope.msg=$mqtt.getQunliao();
      });
    });
    var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
    $scope.bgroup=0;
    $scope.gengduogropu=function () {
      if ($scope.bgroup==0){
        //加滑动底部
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
        // alert("管不管");
        document.getElementById("contentbb").style.marginBottom='165px';
        $scope.bgroup=1;
      }else {
        // alert("不管不管");
        document.getElementById("contentbb").style.marginBottom='0px';
        $scope.bgroup=0;
      }

      //当点击更多按钮时，将语音模式切换成输入法模式(微信、钉钉)
      if($scope.isGroupYuYin === 'true'){
        $scope.isGroupYuYin = 'false';
        keepKeyboardClose();
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
    /**
     * 全局的当前用户和id进行赋值，并且将发送消息的id置为‘’
     * @type {string}
     * @private
     */
    $scope._id='';
    $scope.localusr = $rootScope.userName;
    $scope.myUserID = $rootScope.rootUserId;


    // //将是否为点击语音的动作初始化为false(键盘)
    // $scope.isYuYin='false';
    // //默认不展示语音居中框
    // $scope.isShow='false';

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
                }else if(data[0].messagetype === 'Audio'){
                  $scope.lastText = "[语音]";//最后一条消息内容
                }else if(data[0].messagetype === 'Vedio'){
                  $scope.lastText = "[小视频]";//最后一条消息内容
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
                $scope.isFailure=data[0].isFailure;//最后一条消息的失败与否状态
                $scope.isRead=data[0].isread;//最后一条消息的已读未读状态
                $scope.messagetype=data[0].messagetype;//最后一条消息的类型
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
                  chatitem.isFailure=$scope.isFailure;
                  chatitem.messagetype=$scope.messagetype;
                  chatitem.isRead=$scope.isRead;
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
                          if(data[i].messagetype !='Audio'){
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
                      }
                    },function (err) {
                    });
                    //回到主界面时，检测关闭语音
                    $mqtt.stopPlayRecord(function (success) {
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
                //回到主界面时，检测关闭语音
                $mqtt.stopPlayRecord(function (success) {
                },function (err) {
                });
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
              }else if(data[0].messagetype === 'Audio'){
                $scope.lastText = "[语音]";//最后一条消息内容
              }else if(data[0].messagetype === 'Vedio'){
                $scope.lastText = "[小视频]";//最后一条消息内容
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
              $scope.isFailure=data[0].isFailure;//最后一条消息的失败与否状态
              $scope.isRead=data[0].isread;//最后一条消息的已读未读状态
              $scope.messagetype=data[0].messagetype;//最后一条消息的类型
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
                chatitem.isFailure=$scope.isFailure;
                chatitem.messagetype=$scope.messagetype;
                chatitem.isRead=$scope.isRead;
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
                        if(data[i].messagetype !='Audio'){
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
                    }
                  },function (err) {
                  });
                  //回到主界面时，检测关闭语音
                  $mqtt.stopPlayRecord(function (success) {
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
        $pubionicloading.hide();
      }
      e.preventDefault();
      return false;


    },501)

    // $ToastUtils.showToast("跳进群组详聊"+$scope.groupid+$scope.chatname+$scope.grouptype+$scope.ismygroup);

    //一进来就检查网络是否连接
    $mqtt.setOnNetStatusChangeListener(function (succ) {
      $rootScope.netStatus = 'true';
      $rootScope.$broadcast('netstatus.update');

    },function (err) {
      $rootScope.netStatus='false';
      $rootScope.$broadcast('netstatus.update');
    });

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

      var myDate = new Date();
      myDate.toLocaleDateString();//可以获取当前日期
      // alert("获取当前日期"+myDate.toLocaleDateString());
      myDate.toLocaleTimeString(); //可以获取当前时间
      // alert("获取当前时间"+myDate.toLocaleTimeString());

      var year=myDate.getFullYear();//获取年份
      var month=myDate.getMonth()+1;//获取月份
      var day=myDate.getDate();//获取日期
      // alert("获取当前年月日"+year+month+day);

      var millions=new Date(year+"/"+$mqtt.getMonthOrDay(month)+"/"+$mqtt.getMonthOrDay(day)+" "+"00:00:00").getTime();
      // alert("最低毫秒值"+millions);

      var maxmillions=new Date(year+"/"+$mqtt.getMonthOrDay(month)+"/"+$mqtt.getMonthOrDay(day)+" "+"23:59:59").getTime();
      // alert("最高毫秒值"+millions);
      $mqtt.setQunliao(data);
      $scope.groupmsgs = $mqtt.getQunliao();


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
          $mqtt.setQunliao(data);
          $scope.groupmsgs = $mqtt.getQunliao();
        } else if ($scope.groupmsgs.length >= 50) {
          $scope.nomore = "true";
        }
        $scope.$broadcast("scroll.refreshComplete");
      }, function (err) {

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
      $mqtt.getMqtt().getTopic(topic, grouptype, function (userTopic) {
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

        var millions=new Date(year+"/"+$mqtt.getMonthOrDay(month)+"/"+$mqtt.getMonthOrDay(day)+" "+"00:00:00").getTime();
        // alert("最低毫秒值"+millions);

        var maxmillions=new Date(year+"/"+$mqtt.getMonthOrDay(month)+"/"+$mqtt.getMonthOrDay(day)+" "+"23:59:59").getTime();
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
            chatitem.isFailure=data[0].isFailure;
            chatitem.messagetype=data[0].messagetype;
            chatitem.isRead=data[0].isRead;
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
                    if(data[i].messagetype !='Audio'){
                      // alert("拿到库里的消息阅读状态"+data[i].isread);
                      data[i].isread ='1';
                      messaegeitem.isread=data[i].isread;
                      // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                      $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                        // alert("保存成功");
                        $timeout(function () {
                          viewScroll.scrollBottom();
                        }, 100);
                      },function (err) {
                      });
                    }
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
              }else if(data[0].messagetype === 'Audio'){
                $scope.lastText = "[语音]";//最后一条消息内容
              }else if(data[0].messagetype === 'Vedio'){
                $scope.lastText = "[小视频]";//最后一条消息内容
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
              $scope.isFailure=data[0].isFailure;//最后一条消息的失败与否状态
              $scope.isRead=data[0].isread;//最后一条消息的已读未读状态
              $scope.messagetype=data[0].messagetype;//最后一条消息的类型
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
                chatitem.isFailure=$scope.isFailure;
                chatitem.messagetype=$scope.messagetype;
                chatitem.isRead=$scope.isRead;
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
                        if(data[i].messagetype !='Audio'){
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
                    }
                  },function (err) {
                  });
                  //回到主界面时，检测关闭语音
                  $mqtt.stopPlayRecord(function (success) {

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
              //回到主界面时，检测关闭语音
              $mqtt.stopPlayRecord(function (success) {

              },function (err) {
              });
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
            }else if(data[0].messagetype === 'Audio'){
              $scope.lastText = "[语音]";//最后一条消息内容
            }else if(data[0].messagetype === 'Vedio'){
              $scope.lastText = "[小视频]";//最后一条消息内容
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
            $scope.isFailure=data[0].isFailure;//最后一条消息的失败与否状态
            $scope.isRead=data[0].isread;//最后一条消息的已读未读状态
            $scope.messagetype=data[0].messagetype;//最后一条消息的类型
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
              chatitem.isFailure=$scope.isFailure;
              chatitem.messagetype=$scope.messagetype;
              chatitem.isRead=$scope.isRead;
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
                      if(data[i].messagetype != 'Audio'){
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
                  }
                },function (err) {
                });
                //回到主界面时，检测关闭语音
                $mqtt.stopPlayRecord(function (success) {

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
          }
          if (index === 0 && (msgSingle.messagetype === 'normal' || msgSingle.messagetype === 'Text')) {
            $scope.sendSingleGroupMsg(topic, content, id,msgSingle.type,localuser,localuserId,sqlid, msgSingle.messagetype);
          } else if (index === 0 && (msgSingle.messagetype === 'Image' || msgSingle.messagetype === 'File' || msgSingle.messagetype === 'Vedio')) {
            for(var i=0;i<$mqtt.getQunliao().length;i++){
              if($mqtt.getQunliao()[i]._id === sqlid){
                $mqtt.getQunliao().splice(i, 1);
                $rootScope.$broadcast('msgs.update');
                break;
              }
            }
            $mqtt.getMqtt().getTopic(topic, grouptype, function (userTopic) {
              $mqtt.getFileContent(msgSingle.message.split('###')[1], function (fileData) {
                $scope.suc = $mqtt.sendDocFileMsg(userTopic, fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], id, localuser, localuserId, sqlid, msgSingle.messagetype, fileData[0],$mqtt, grouptype);
                $scope.send_content = "";
                keepKeyboardOpen();
              },function (err) {
              });
            }, function (msg) {
            });
          } else if (index === 0 && (msgSingle.messagetype === 'LOCATION')) {
            $scope.sendSingleGroupMsg(userTopic, msgSingle.message, id,msgSingle.type,localuser,localuserId,sqlid, msgSingle.messagetype);
          } else if(index === 0 && msgSingle.messagetype === 'Audio') {
            for(var i=0;i<$mqtt.getQunliao().length;i++){
              if($mqtt.getQunliao()[i]._id === sqlid){
                $mqtt.getQunliao().splice(i, 1);
                $rootScope.$broadcast('msgs.update');
                break;
              }
            }
            $mqtt.getMqtt().getTopic(topic, grouptype, function (userTopic) {
              var mesgs = msgSingle.message.substring(msgSingle.message.indexOf("###") + 3);
              $scope.suc=$mqtt.sendDocFileMsg(userTopic,mesgs,mesgs,id,localuser,localuserId,sqlid,msgSingle.messagetype,$scope.filepath,$mqtt,grouptype);
              $scope.send_content = "";
              keepKeyboardOpen();
            }, function (msg) {
            });
          } else if (index === 1) {
            for(var i=0;i<$mqtt.getQunliao().length;i++){
              if($mqtt.getQunliao()[i]._id === sqlid){
                $greendao.deleteObj('MessagesService',msgSingle,function (data) {
                  $mqtt.getQunliao().splice(i, 1);
                  $rootScope.$broadcast('msgs.update');
                },function (err) {
                });
                break;
              }
            }
          }
          return true;
        }
      });


    };
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
              }else if(data[0].messagetype === 'Audio'){
                $scope.lastText = "[语音]";//最后一条消息内容
              }else if(data[0].messagetype === 'Vedio'){
                $scope.lastText = "[小视频]";//最后一条消息内容
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
              $scope.isFailure=data[0].isFailure;//最后一条消息的失败与否状态
              $scope.isRead=data[0].isread;//最后一条消息的已读未读状态
              $scope.messagetype=data[0].messagetype;//最后一条消息的类型
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
                chatitem.isFailure=$scope.isFailure;
                chatitem.messagetype=$scope.messagetype;
                chatitem.isRead=$scope.isRead;
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
                },function (err) {
                });

              },function (err) {
              });
            }

            if(data.length >0){
              $rootScope.isPersonSend='true';
              if ($rootScope.isPersonSend === 'true') {
                $chatarr.getIdChatName($scope.groupid,$scope.chatname);
                $scope.items = $chatarr.getAll($rootScope.isPersonSend,grouptype);
                $scope.$on('chatarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.items = $chatarr.getAll($rootScope.isPersonSend,grouptype);
                    $scope.saveGroupLastMsg();
                  });
                });
                $rootScope.isPersonSend = 'false';
              }
            }else{

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
            }else if(data[0].messagetype === 'Audio'){
              $scope.lastText = "[语音]";//最后一条消息内容
            }else if(data[0].messagetype === 'Vedio'){
              $scope.lastText = "[小视频]";//最后一条消息内容
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
            $scope.isFailure=data[0].isFailure;//最后一条消息的失败与否状态
            $scope.isRead=data[0].isread;//最后一条消息的已读未读状态
            $scope.messagetype=data[0].messagetype;//最后一条消息的类型
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
              chatitem.isFailure=$scope.isFailure;
              chatitem.messagetype=$scope.messagetype;
              chatitem.isRead=$scope.isRead;
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
            // alert('takeGroupPhoto');
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

    $scope.takeGroupVideo = function (topic, content, id,localuser,localuserId,sqlid, type) {
      $mqtt.takeVideo(function (fileData) {
        $mqtt.getMqtt().getTopic(topic, type, function (userTopic) {
          var fileType = 'Vedio';
          $greendao.getUUID(function (data) {
            sqlid=data;
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
        $mqtt.getMqtt().getTopic(topic, picType, function (userTopic) {
          var fileType = 'File';
          if (type === 'image') {
            fileType = 'Image';
          }
          $greendao.getUUID(function (data) {
            sqlid=data;
            $scope.suc = $mqtt.sendDocFileMsg(userTopic, fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], fileData[0] + "###" + fileData[1] + "###" + fileData[2] + "###" + fileData[3], id, localuser, localuserId, sqlid, fileType, fileData[0],$mqtt, picType);
            $scope.send_content = "";
            $timeout(function () {
              viewScroll.scrollBottom();
            }, 100);
            keepKeyboardOpen();
          })
        });

      }, function (err) {
      });
    };

    //初始化
    //将是否为点击语音的动作初始化为false(键盘)
    $scope.isGroupYuYin='false';
    //默认不展示语音居中框
    $scope.isGroupShow='false';
    $scope.isGroupshowless ='false';
    $scope.isshowgroupPng ='true';

    $scope.groupclickOn=function () {
      if($scope.bgroup === 1){
        // alert("进不进");
        $scope.gengduogropu();
      }
      if($scope.isGroupYuYin=== 'false'){
        $scope.isGroupYuYin="true";
      }
      keepKeyboardClose();
    }

    $scope.groupclickOnChange=function () {
      $scope.isGroupYuYin="false";
      $scope.isGroupShow='false';
    }



    //群聊语音
    $scope.showGroupYuyin=function (messagetype,sqlid) {
      $scope.isGroupShow='true';
      $scope.isGroupshowless='false';
      $scope.grouprecordTime = 0;
      $scope.groupctime = 0;
      $scope.grouprate = 0;
      if($scope.isshowGroupgif ==="true"){
        $scope.isshowgroupPng="true";
        $scope.isshowGroupgif ="false"
        // $ToastUtils.showToast("原本的语音在播放");
      }
      $mqtt.startRecording(function (succ) {
        $scope.type=succ.type;
        // alert("type--->"+$scope.type);
        if($scope.type === "timeChange"){
          $scope.grouprecordTime=succ.recordTime;
        }else if($scope.type === "timeout"){
          $scope.groupctime=succ.time;
          // alert("超过59秒======》"+$scope.ctime);
          $timeout(function () {
            $scope.isGroupShow='false';
            // $scope.isshowless='false';
          }, 100);
          $scope.grouprecordTime = 0;
          $scope.grouprate = 0;
        }else if($scope.type === "rateChange"){
          $scope.grouprate=succ.rate;
          // $ToastUtils.showToast("rate=====>"+$scope.rate);
        }else if($scope.type === "error"){
          $scope.error=succ.error;
        }
      },function (err) {

      });
    }

    /**
     * 语音上滑取消
     * @param $event
     */
    $scope.onDragGroupVoiceBtn = function($event) {
      var y=$event.gesture.deltaY;
      if (y < -10) {
        $scope.isGroupshowless = 'back';
      } else {
        $scope.isGroupshowless = 'false';
      }
      // $ToastUtils.showToast('上滑：' + (position), null, null);
    };



    //释放语音按钮
    $scope.releaseGroupYuyin=function (messagetype,sqlid) {
      //若录取的时间小于1s
      //当录取的时间大于1s小于60s时，给一个标志符
      // $scope.isyuyinshow="true";
      $mqtt.stopRecording(function (succ) {
        if ($scope.isGroupshowless === 'back'){
          $scope.$apply(function () {
            $scope.isGroupShow='false';
            $scope.isGroupshowless='true';
            $scope.grouprecordTime = 0;
            $scope.grouprate = 0;
          });
          return;
        }

        if (succ.duration  <1000){
          $scope.isGroupshowless='true';
          $scope.grouprecordTime = 0;
          $scope.grouprate = 0;
        }
        $scope.isshowgroupPng='true';
        $scope.grouprate=-1;
        $scope.filepath=succ.filePath;
        $scope.duration=succ.duration;
        if($scope.duration <1000){
          $scope.grouprecordTime = 0;
          $scope.grouprate = 0;
          $scope.isGroupshowless='true';
          $timeout(function () {
            viewScroll.scrollBottom();
            $scope.isGroupShow='false';
            $scope.isGroupshowless='false';
          }, 1000);
        }else{
          $scope.isGroupShow='false';
          $scope.isGroupshowless='false';
          // $scope.isGroupshowless='false';
          // alert("秒："+$scope.duration);
          //发送语音
          // function (topic, fileContent, content, id,localuser,localuserId,sqlid,messagetype,picPath,$mqtt, type)
          $mqtt.getMqtt().getTopic($scope.groupid,$scope.grouptype,function (userTopic) {
            $greendao.getUUID(function (data) {
              sqlid=data;
              $scope.suc=$mqtt.sendDocFileMsg(userTopic,$scope.filepath+'###' + $scope.duration,$scope.filepath+'###' + $scope.duration,$scope.groupid,$scope.localusr,$scope.myUserID,sqlid,messagetype,$scope.filepath,$mqtt,$scope.grouptype);
              keepKeyboardOpen();
              $timeout(function () {
                viewScroll.scrollBottom();
              }, 1000);
            });
          },function (err) {
          });
        }
      },function (err) {

      });
    }


    /**
     * 播放语音
     */
    $scope.isGrouplisten='false';
    $scope.groupaudioid='';
    $scope.isshowGroupgif='false';
    $scope.showgroupanimation=function (filepath,sqlid,isRead) {
      //判断id是否一致，若一致则判断标志位；若不一致，则播放
      // alert("拿到的id"+sqlid);
      if($scope.groupaudioid != sqlid){
        $scope.isshowGroupgif='true';
        $scope.isGrouplisten='true';
        $scope.isshowgroupPng='false';
      }else{
        if($scope.isGrouplisten === 'false'){
          $scope.isshowGroupgif='true';
          $scope.isGrouplisten= 'true';
          $scope.isshowgroupPng='false';
        }else{
          $scope.isshowGroupgif='false';
          $scope.isGrouplisten= 'false';
          $scope.isshowgroupPng='true';
        }
      }
      $scope.groupaudioid=sqlid;
      if($scope.isGrouplisten === 'true'){
        // alert("播放语音啦");
        $mqtt.playRecord(filepath.substring(filepath.lastIndexOf('/') + 1, filepath.length), function (succ) {
          $scope.isshowGroupgif='false';
          $scope.isGrouplisten='false';
          $scope.isshowgroupPng='true';
          $scope.groupaudioid='';
        }, function (err) {
          $scope.isshowGroupgif='false';
          $scope.isGrouplisten='false';
          $scope.isshowgroupPng='true';
          $scope.groupaudioid='';
          $ToastUtils.showToast(err);
        });

      }else{
        $mqtt.stopPlayRecord(function (data) {
          $scope.isshowGroupgif='false';
          $scope.groupaudioid='';
          $scope.isGrouplisten='false';
          $scope.isshowgroupPng='true';
        },function (err) {
          $scope.isshowGroupgif='false';
          $scope.isGrouplisten='false';
          $scope.isshowgroupPng='true';
          $scope.groupaudioid='';
        });
      }

      //修改语音播放未读已读状态
      if(isRead === '0'){
        $greendao.queryData('MessagesService','where _id =?',sqlid,function (data) {
          // alert("进来了吗");
          var messaegeitem={};
          messaegeitem._id=data[0]._id;
          messaegeitem.sessionid=data[0].sessionid;
          messaegeitem.type=data[0].type;
          // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
          messaegeitem.from=data[0].from;
          messaegeitem.message=data[0].message;
          messaegeitem.messagetype=data[0].messagetype;
          messaegeitem.platform=data[0].platform;
          messaegeitem.when=data[0].when;
          messaegeitem.isFailure=data[0].isFailure;
          messaegeitem.isDelete=data[0].isDelete;
          messaegeitem.imgSrc=data[0].imgSrc;
          messaegeitem.username=data[0].username;
          messaegeitem.senderid=data[0].senderid;
          messaegeitem.isSuccess=data[0].isSuccess;
          messaegeitem.daytype=data[0].daytype;
          messaegeitem.istime=data[0].istime;
          messaegeitem.isread='1';
          $greendao.saveObj('MessagesService',messaegeitem,function (succ) {
            $mqtt.updateQunliao(messaegeitem);
            // alert("保存成功");
          },function (err) {
          });
        },function (err) {

        });
      }

    }


    $scope.showTingtong='true';
    /**
     * 扬声器与听筒模式切换
     */
    $mqtt.getProxyMode(function (suc) {
      if(suc === 1){
        $scope.groupProxyMode='false';
      }else{
        $scope.groupProxyMode='true';
      }
      $rootScope.$broadcast('change_group_proxy_mode.success');
    })

    $scope.openYangshengqiMode=function () {
      $mqtt.setProxyMode(0);
      $scope.showTingtong='true';
    }


    $scope.openTingtongMode=function () {
      $mqtt.setProxyMode(1);
      $scope.showTingtong ='false';
    }

    $scope.$on('change_group_proxy_mode.success', function (event) {
      $scope.$apply(function () {
        $scope.showTingtong =$scope.groupProxyMode;
      })
    });



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
        return 'img/location.jpg';
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
      var msg = message.split('###')[4];
      // var lastindex = msg.lastIndexOf("\/");
      return msg;//lastindex <= 0 ? msg : msg.substr(lastindex + 1, msg.length);
    };

    $scope.getFilePath = function (message) {
      var filePath = message.split("###")[1];
      return filePath;
    };

    //打开文件
    $scope.openGroupAllFile = function (path, msg) {
      $okhttp.downloadFile(msg,0,path,function (success) {
        msg.message=success;
        $greendao.saveObj('MessagesService',msg,function (data) {
          $mqtt.updateQunliao(msg);
          $rootScope.$broadcast('sendgroupprogress.update');
        },function (err) {
        });
      },function (err) {

      })
    };

    //判断文件是否是视频格式
    $scope.isGroupVideo = function (filePath) {
      if(filePath!=null && filePath!="undefined" && filePath!=""){
        return $mqtt.isVideo(filePath);
      }
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
    $scope.openAllFile = function (path, msg) {
      $api.openFileByPath(path,msg, function (message) {
        $greendao.saveObj('MessagesService',message,function (data) {
          $mqtt.updateDanliao(message);
          $rootScope.$broadcast('sendprogress.update');
        },function (err) {
        });
      },function (err) {
        $ToastUtils.showToast("参数错误！");
      });

    };

  })


  .controller('MessageCtrl', function ($scope, $http, $state, $mqtt, $chatarr, $stateParams, $rootScope, $greendao,$timeout,$contacts,$ToastUtils,$cordovaBarcodeScanner,$location,$api,$ionicPlatform,$ionicHistory,$pubionicloading,$ionicPopup,$cordovaFileOpener2,$ionicPopover,NetData) {

    /*门户页数据请求代码开始。
     * 1.写在此处的原因：
     * 为了解决根据appIcon异步请求拿到的数据，页面不能实现实时刷新的问题。
     *
     * */

    // 门户页面数据请求
    var userID; // userID = 232099
    var imCode; //  imCode = 866469025308438

    $mqtt.getUserInfo(function (succ) {
      userID = succ.userID;
      //获取人员所在部门，点亮图标
      $mqtt.getImcode(function (imcode) {
        NetData.getInfo(userID, imcode);
        imCode = imcode;
        $http({
          method: 'post',
          timeout: 5000,
          url: "http://imtest.crbim.win:8080/apiman-gateway/jishitong/interface/1.0?apikey=b8d7adfb-7f2c-47fb-bac3-eaaa1bdd9d16",//开发环境
          // url: "http://immobile.r93535.com:8088/crbim/imApi/1.0",//正式环境
          data: {"Action": "GetAppList", "id": userID, "mepId": imCode,"platform":"A"}
        }).success(function (data, status) {
          // 门户页面对应的所有的数据源
          $rootScope.portalDataSource = JSON.parse(decodeURIComponent(data)); // 请求回来的数据源 json格式
          $scope.sysmenu =  $rootScope.portalDataSource.sysmenu;

          // 定义一个存放 appIcon 的数组对象
          $scope.appIconArr = [];
          // 遍历数据源,拿到所有图片的appIcon,调插件，获取所有图片的路径。(插件中判断图片是否在本地存储，若本地没有则下载)
          for(var i=0;i<$scope.sysmenu.length;i++){
            var items =  $scope.sysmenu[i].items;
            for(var j=0;j<items.length;j++){
              var flag = items[j].flag;
              var appIcon = items[j].appIcon;
              if(flag){
                $scope.appIconArr.push( appIcon );
              }else {
                $scope.appIconArr.push(appIcon+'_f');
              }
            }
          }

          // 调插件，获取所有的图片路径
          $api.downloadQYYIcon($scope.appIconArr ,function (success) {
            $rootScope.appIconPaths = success;
            console.log("后端拿到的icon路径集合:"+JSON.stringify($rootScope.appIconPaths));
          },function (err) {

          });

        });

      }).error(function (data, status) {
        $ToastUtils.showToast("获取用户权限失败!");
      });
    }, function (err) {
    })
    // 门户代码结束



    $scope.popover = $ionicPopover.fromTemplateUrl('my-popover.html', {
      scope: $scope
    });

    // .fromTemplateUrl() 方法
    $ionicPopover.fromTemplateUrl('my-popover.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.popover = popover;
    });


    $scope.openPopover = function($event) {
      $scope.popover.show($event);
    };
    $scope.closePopover = function() {
      $scope.popover.hide();
    };
    // 清除浮动框
    $scope.$on('$destroy', function() {
      $scope.popover.remove();

    });

    // 在隐藏浮动框后执行
    $scope.$on('popover.hidden', function() {
      // 执行代码
    });
    // 移除浮动框后执行
    $scope.$on('popover.removed', function() {
      // 执行代码

    });


    $scope.isNetConnectNow = $mqtt.getIMStatus();

    //监听MQTT状态的变化
    $scope.$on('netStatusNow.update', function (event) {
      $scope.$apply(function () {
        $scope.isNetConnectNow = $mqtt.getIMStatus();
      })
    });

    $mqtt.getUserInfo(function (msg) {
      $scope.UserID = msg.userID;

      $mqtt.save('zuinewID',  $scope.UserID);
      $scope.mymypersonname = msg.userName;
      $mqtt.save('userNamea', $scope.mymypersonname);
      $greendao.queryData('GesturePwdService','where id=?',$scope.UserID ,function (data) {
        if(data[0].pwd==null||data[0].pwd==undefined||data[0].pwd.length==0){
          var gestureobj={};
          gestureobj.id=$scope.UserID;
          gestureobj.username= $scope.mymypersonname;
          gestureobj.pwd="";
          $greendao.saveObj('GesturePwdService',gestureobj,function (data) {
          },function (err) {
          });
        }
      },function (err) {
      });
    }, function (msg) {
    });

    //登录成功后第一件事：检测升级
    $api.checkUpdate($ionicPopup, $cordovaFileOpener2,$scope.isFromMy);
    $scope.ID=$stateParams.id;
    $scope.SESSIONID=$stateParams.sessionid;

    $scope.GROUP=$stateParams.grouptype;


    //进来消息主界面时，读取当前用户的头像
    $scope.$on('$ionicView.enter', function () {
      //发送通知广播 用来在界面显示未读数
      $rootScope.$broadcast('second.notify');
      $mqtt.getUserInfo(function (msg) {
        $api.getHeadPic(msg.userID,"60",function (srcurl) {
          $rootScope.securlpicaaa = srcurl;
        },function (error) {

        })

      }, function (msg) {
      });

      //进入消息主界面通过调用badge插件重新设置badgeCount(以防万一)
      $greendao.loadAllData('ChatListService',function (msg) {
        $scope.allNoRead=0;
        if (msg.length>0){
          for(var i=0;i<msg.length;i++){
            $scope.allNoRead=$scope.allNoRead+parseInt(msg[i].count, 10);
          }
          cordova.plugins.notification.badge.set($scope.allNoRead,function (succ) {
            // alert("成功主界面"+succ);
            $mqtt.saveInt("badgeCount",$scope.allNoRead);
          },function (err) {
            // alert("失败"+err);
          });
        }
      },function (err) {

      })

    });


    if ($mqtt.isLogin()) {
      $mqtt.getMqtt().getMyTopic(function (msg) {
        $api.getAllGroupIds(function (groups) {
          if (msg != null && msg != '') {
            $mqtt.startMqttChat(msg + ',' + groups);
            $mqtt.setLogin(true);
            return;
          }
        },function (err) {
          $ToastUtils.showToast(err)
        });
      }, function (msg) {
      });
    }
    var backButtonPressedOnceToExit=false;
    $ionicPlatform.registerBackButtonAction(function (e) {
      if($location.path()==('/tab/message/'+$scope.ID+'/'+$scope.SESSIONID+'/'+$scope.GROUP)||$location.path()=='/tab/notification'||$location.path()=='/tab/contacts'||$location.path()=='/tab/account'||$location.path()=='/login'||$location.path()=='/tab/portal'){

        if (backButtonPressedOnceToExit) {
          $mqtt.setExitStartedStatus();
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
        $pubionicloading.hide();
      }
      e.preventDefault();
      return false;
    },501)



    //一进来就检查网络是否连接
    $mqtt.setOnNetChangeListener(function (success) {
      $rootScope.isNetConnect='true';
      // alert("进来了吗？ok");
    },function (err) {
      // alert("进来了吗？no");
      $rootScope.isNetConnect='false';
      $ToastUtils.showToast("当前网络不可用");
    });


    //一进来就检查mqtt是否连接
    $mqtt.setOnNetStatusChangeListener(function (succ) {
      $rootScope.netStatus = 'true';
      $rootScope.$broadcast('netstatus.update');
    },function (err) {
      $rootScope.netStatus='false';

      $rootScope.$broadcast('netstatus.update');
    });
    //监听网络状态的变化
    $scope.$on('netstatus.update', function (event) {
      $scope.$apply(function () {
        $rootScope.isConnect=$rootScope.netStatus;
      })
    });

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


      // 隐藏浮动框
      $scope.popover.hide();

      var selectInfo={};
      //当创建群聊的时候先把登录的id和信息  存到数据库上面
      selectInfo.id=$scope.loginId;
      selectInfo.name=$scope.mymypersonname;
      selectInfo.grade="0";
      selectInfo.isselected=true;
      selectInfo.type='user';
      selectInfo.parentid=$scope.departmentId;
      $greendao.saveObj('SelectIdService',selectInfo,function (msg) {

      },function (err) {

      });

      $state.go('addnewpersonfirst',{
        "createtype":'single',
        "groupid":'0',
        "groupname":'',
        "functiontag":'groupchat'
      });


    }
    //紧急呼叫
    $scope.gozhuan=function () {
      $state.go("emergencycall");
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

    /**
     * 监听聊天界面返回
     */
    $scope.$on('leave.update',function (event) {
      // $scope.$apply(function () {
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
              }else if(data[0].messagetype === 'Audio'){
                $scope.lastText = "[语音]";//最后一条消息内容
              }else if(data[0].messagetype === 'Vedio'){
                $scope.lastText = "[小视频]";//最后一条消息内容
              }else {
                $scope.lastText = data[0].message;//最后一条消息内容
              }
              $scope.lastDate = data[0].when;//最后一条消息的时间
              $scope.chatName = data[0].username;//对话框名称
              $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
              $scope.srcName = data[0].username;//消息来源人名字
              $scope.srcId = data[0].senderid;//消息来源人id
              $scope.daytype=data[0].daytype;
              $scope.isSuccess=data[0].isSuccess;
              $scope.isFailure=data[0].isFailure;//最后一条消息的失败与否状态
              $scope.isRead=data[0].isread;//最后一条消息的已读未读状态
              $scope.messagetype=data[0].messagetype;//最后一条消息的类型
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
                chatitem.isFailure=$scope.isFailure;
                chatitem.messagetype=$scope.messagetype;
                chatitem.isRead=$scope.isRead;
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
            }else if(data[0].messagetype === 'Audio'){
              $scope.lastText = "[语音]";//最后一条消息内容
            }else if(data[0].messagetype === 'Vedio'){
              $scope.lastText = "[小视频]";//最后一条消息内容
            }else {
              $scope.lastText = data[0].message;//最后一条消息内容
            }
            $scope.lastDate = data[0].when;//最后一条消息的时间
            $scope.chatName = data[0].username;//对话框名称
            $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
            $scope.srcName = data[0].username;//消息来源人名字
            $scope.srcId = data[0].senderid;//消息来源人id
            $scope.daytype=data[0].daytype;
            $scope.isSuccess=data[0].isSuccess;
            $scope.isFailure=data[0].isFailure;//最后一条消息的失败与否状态
            $scope.isRead=data[0].isread;//最后一条消息的已读未读状态
            $scope.messagetype=data[0].messagetype;//最后一条消息的类型
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
              chatitem.isFailure=$scope.isFailure;
              chatitem.messagetype=$scope.messagetype;
              chatitem.isRead=$scope.isRead;
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
        // $scope.backFirstMenu('User');
      // })
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


    /**
     * 实现文件、图片、文字、语音发送成功以后的监听
     */
    $scope.$on('sendsuccess.update',function (event) {
      var value=$mqtt.receiveupdate();
      var id=value.split(',')[0];
      var sessionid=value.split(',')[1];
      $greendao.queryData('ChatListService','where id =?',id,function (data) {
        $scope.$apply(function () {
            var chatitem={};
            chatitem.id=data[0].id;
            chatitem.chatName=data[0].chatName;
            chatitem.isDelete=data[0].isDelete;
            chatitem.lastText=data[0].lastText;
            chatitem.count=data[0].count;
            chatitem.lastDate=data[0].lastDate;
            chatitem.chatType=data[0].chatType;
            chatitem.senderId=data[0].senderId;
            chatitem.senderName=data[0].senderName;
            chatitem.daytype=data[0].daytype;
            chatitem.imgSrc=data[0].imgSrc;
            chatitem.isSuccess='true';
            chatitem.isFailure=data[0].isFailure;
            chatitem.messagetype=data[0].messagetype;
            chatitem.isRead=data[0].isRead;
            $greendao.saveObj('ChatListService',chatitem,function (suc) {
              $chatarr.updatedatanosort(chatitem);
            },function (err) {
            });

          },function (err) {
          });
        });
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

      var millions=new Date(year+"/"+$mqtt.getMonthOrDay(month)+"/"+$mqtt.getMonthOrDay(day)+" "+"00:00:00").getTime();
      // alert("最低毫秒值"+millions);

      var maxmillions=new Date(year+"/"+$mqtt.getMonthOrDay(month)+"/"+$mqtt.getMonthOrDay(day)+" "+"23:59:59").getTime();
      for(var i=0;i<data.length;i++){
        var chatitem={};
        chatitem.id=data[i].id;
        chatitem.chatName=data[i].chatName;
        chatitem.isDelete=data[i].isDelete;
        if(chatitem.imgSrc == null && chatitem.imgSrc =='' && chatitem.imgSrc == undefined){
          chatitem.imgSrc=1;
        }else{
          chatitem.imgSrc=data[i].imgSrc;
        }
        // alert("imgsrc++=="+chatitem.imgSrc);
        chatitem.lastText=data[i].lastText;
        chatitem.count=data[i].count;
        chatitem.lastDate=data[i].lastDate;
        chatitem.chatType=data[i].chatType;
        chatitem.senderId=data[i].senderId;
        chatitem.senderName=data[i].senderName;
        chatitem.isSuccess=data[i].isSuccess;
        chatitem.isFailure=data[i].isFailure;
        chatitem.messagetype=data[i].messagetype;
        chatitem.isRead=data[i].isRead;
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
          $scope.$apply(function () {
            $chatarr.setData(data);
            $scope.items=data;
          });
           // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          //当检测到消息时，从数据库取出角标进行设置并展示到桌面应用角标上
          $greendao.loadAllData('ChatListService',function (msg) {
            $scope.allNoRead=0;
            if (msg.length>0){
              for(var i=0;i<msg.length;i++){
                $scope.allNoRead=$scope.allNoRead+parseInt(msg[i].count, 10);
              }
              cordova.plugins.notification.badge.set($scope.allNoRead,function (succ) {
                // alert("主界面消息刷新成功"+succ);
                $mqtt.saveInt("badgeCount",$scope.allNoRead);
              },function (err) {
                // alert("失败"+err);
              });
            }
          },function (err) {

          });
          viewScroll.scrollBottom();
        }, 100);
      })
    });

    $scope.$on('lastcount.update', function (event) {
      $scope.$apply(function () {
        // alert("进来数据刷新");
        $scope.items = $chatarr.getAllData();
      });
    });

    //进入单聊界面
    $scope.goDetailMessage = function (id, ssid,chatType) {
      // alert("进去的数据对不对"+id+"ssid===="+ssid);
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
            // alert("取出的聊天记录"+JSON.stringify(data));
            var count=data[0].count;//取出该对话的count值
            //取出保存的badgecount值并减去
            $mqtt.getInt('badgeCount',function (newcount) {
              var lastcount=newcount-count;
              // alert("老count"+newcount+"新count"+count);
              cordova.plugins.notification.badge.set(lastcount,function (succ) {
                // alert("会话内减值成功"+succ);
                $mqtt.saveInt('badgeCount',lastcount);
              },function (err) {
              });
            },function (err) {
            });
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
            chatitem.isFailure=data[0].isFailure;
            chatitem.messagetype=data[0].messagetype;
            chatitem.isRead=data[0].isRead;
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
                    if(data[i].messagetype != 'Audio'){
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
            chatitem.isFailure=data[0].isFailure;
            chatitem.messagetype=data[0].messagetype;
            chatitem.isRead=data[0].isRead;
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
                    if(data[i].messagetype != 'Audio'){
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
              chatitem.isFailure=data[0].isFailure;
              chatitem.messagetype=data[0].messagetype;
              chatitem.isRead=data[0].isRead;
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
                      if(data[i].messagetype != 'Audio'){
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
        //在删除该条记录时，将该条对话里所有未读消息的状态置为已读
        $greendao.queryDataByIdAndIsread(id,'0',function (data) {
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
                },function (err) {
                });
              }
            }
          }
          //删除记录
          $greendao.deleteDataByArg('ChatListService',id,function (data) {
            // alert("删除会话id"+id);
            $chatarr.deletechatdata(id);
            $rootScope.$broadcast('lastcount.update');
          },function (err) {
          });
        },function (err) {
        });
      }
    });



  })


  .controller('SettingAccountCtrl',function ($scope,$state,$stateParams,$greendao,$ToastUtils,$contacts,$ionicActionSheet,$chatarr,$rootScope,$GridPhoto,$timeout,$ionicHistory,$api) {



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
        $scope.loginName=$contacts.getLoignInfo().userName;
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
          // alert("群发完成数组"+JSON.stringify(data));
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
        'id':$scope.userId,
        'ssid':$scope.userName
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
      $ionicHistory.goBack();
    };

    //清空聊天记录
    $scope.clearMsg=function (id,ssid) {
      //alert("你好"+id+"不会"+ssid)
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

            $greendao.deleteBySessionid(id,function (suc) {
              $greendao.queryData('MessagesService','where sessionid =?',id,function (data) {
                // $ToastUtils.showToast("删除成功");
                if(data.length>0){
                  for(var i=0;i<data.length;i++){
                    var key=data[i]._id;
                    $greendao.deleteDataByArg('MessagesService',key,function (data) {
                      $greendao.queryData('ChatListService','where id =?',id,function (data) {

                        if(data.length==0){
                          $state.go('tab.message',{
                            "id":id,
                            "sessionid":ssid,
                            "grouptype":"User"
                          });
                        }else {
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
            },function (err) {

            })



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
    //定位
    $scope.goLocation=function () {
      $state.go('personlocation',{
        'id':$scope.userId,
        'ssid':$scope.userName
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

    },function (msg) {
      $ToastUtils.showToast("获取总数失败");
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
      })
    })
    ;
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

  .controller('groupSettingCtrl', function ($scope, $state, $stateParams,$ionicHistory,$ToastUtils,$api,$greendao,$group,$pubionicloading,$timeout,$ionicActionSheet,$chatarr,$GridPhoto,$location,$ionicPlatform) {
    //群设置
    $pubionicloading.showloading('','Loading...');

    $scope.groupId = $stateParams.groupid;
    $scope.groupType = $stateParams.grouptype;
    $scope.ismygroup=$stateParams.ismygroup;
    $ionicPlatform.registerBackButtonAction(function (e) {
      if($location.path()==('/groupSetting/'+$scope.groupId+'/'+$scope.groupName+'/'+$scope.groupType+'/'+$scope.ismygroup)){
        $state.go('messageGroup',{
          "id":$scope.groupId,
          "chatName":$scope.groupName,
          "grouptype":$scope.groupType,
          "ismygroup":$scope.ismygroup,
        });
      }else {
        $ionicHistory.goBack();
        $pubionicloading.hide();
      }
      e.preventDefault();
      return false;
    },501)




    $scope.ismygroupaaa=$stateParams.ismygroup+"";
    $scope.listM=[];
    $scope.listM.push('GN');
    $scope.listM.push('GT');
    $group.groupDetail($scope.groupType,$scope.groupId,$scope.listM);
    $scope.$on('groupdetail.update', function (event) {
      $scope.$apply(function () {
        $timeout(function () {
          $pubionicloading.hide();
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

      $pubionicloading.showloading('','Loading...');
      $api.removeGroup($scope.groupId,function (msg) {

        $pubionicloading.hide();
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
        $pubionicloading.hide();


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
    //群定位
    $scope.gogroupLocation=function () {
      $state.go('grouplocation',{
        grouptype:$scope.groupType,
        id:$scope.groupId
      });
    }
    //打开群图片界面
    $scope.groupPicture=function () {
      $GridPhoto.queryPhoto($scope.groupId,"image",function (msg) {

      },function (err) {

      })

    }
    //打开群文件界面
    $scope.groupFile=function () {
      $state.go('personfile',{
        sessionid:$scope.groupId
      });

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

            $greendao.deleteBySessionid(id,function (data) {
              $greendao.queryData('MessagesService','where sessionid =?',id,function (data) {
                // $ToastUtils.showToast("删除成功");
                if(data.length>0){
                  for(var i=0;i<data.length;i++){
                    var key=data[i]._id;
                    $greendao.deleteDataByArg('MessagesService',key,function (data) {
                      $greendao.queryData('ChatListService','where id =?',id,function (data) {
                        if(data.length == 0){
                          $state.go('tab.message',{
                            "id":id,
                            "sessionid":name,
                            "grouptype":"Group"
                          });
                        }else{
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
                        }

                      },function (err) {
                        $state.go('tab.message',{
                          "id":id,
                          "sessionid":name,
                          "grouptype":"Group"
                        });
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
              // $state.go('tab.message',{
              //   "id":id,
              //   "sessionid":name,
              //   "grouptype":"Group"
              // });


            },function (err) {
              $ToastUtils.showToast(err);
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

  .controller('historymessagegroupCtrl',function ($scope, $http, $state, $stateParams,$api,$historyduifang,$mqtt,$ToastUtils,$ionicHistory,$ionicScrollDelegate,$timeout) {
    var viewScroll = $ionicScrollDelegate.$getByHandle('historyScroll');
    $scope.groupid = $stateParams.id;
    // $scope.ssid = $stateParams.ssid;
    $scope.grouptype=$stateParams.grouptype;
    // alert($scope.groupid)
    // alert($scope.grouptype)
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
      // alert($scope.UserID)
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
      $ToastUtils.showToast("获取总数失败");
    });

    $historyduifang.getHistoryduifanga($scope.grouptype,$scope.groupid,1,10);
    $scope.$on('historymsg.duifang',function (event) {
      $scope.$apply(function () {
        $scope.historyduifangsss=$historyduifang.getHistoryduifangc().reverse();
      })
      $timeout(function () {
        viewScroll.scrollBottom();
      }, 100);
    });

    //下一页
    $scope.doRefreshhisGro=function () {
      if ($scope.dangqianpage<$scope.totalpage){
        $scope.dangqianpage++;
        // alert($scope.dangqianpage)
        var lengthabc=$scope.dangqianpage*10;
        $historyduifang.getHistoryduifanga($scope.grouptype,$scope.groupid,"1",lengthabc);
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

  .controller('sendGelocationCtrl',function ($scope,$state,$ToastUtils,$rootScope,$cordovaGeolocation,$stateParams,$mqtt,$ionicNavBarDelegate,$timeout,$pubionicloading,$greendao) {
    $pubionicloading.showloading('','Loading...');
    document.getElementById("container").style.height=(window.screen.height-140)+'px';
    //取出聊天界面带过来的id和ssid
    $scope.topic=$stateParams.topic;
    $scope.userId=$stateParams.id;//对方用户id
    $scope.userName=$stateParams.ssid;//对方用户名
    $scope.localuser=$stateParams.localuser;//当前用户名
    $scope.localuserId=$stateParams.localuserId;//当前用户id
    $scope.sqlid=$stateParams.sqlid;//itemid
    $scope.grouptype=$stateParams.grouptype;//grouptype
    // alert("类型"+$scope.grouptype);
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
        // $ToastUtils.showToast("请检查网！");
        $pubionicloading.hide();
      },7000);

      // // 根据坐标得到地址描述
      myGeo.getLocation(new BMap.Point(long, lat), function(result){

        if (result){
          $scope.$apply(function () {
            $timeout(function () {
              $pubionicloading.hide();
              $scope.weizhiss=result.address;
            });
          });
        }
      });
      marker.addEventListener("dragend", function(e){           //116.341749   39.959682
        // alert("当前位置：" + e.point.lng + ", " + e.point.lat);// 116.341951   39.959632
        $pubionicloading.showloading('','Loading...');
        lat=e.point.lat;
        long=e.point.lng;
        // 创建地理编码实例
        var myGeo = new BMap.Geocoder();

        $timeout(function () {
          // $ToastUtils.showToast("请检查网络！")
          $pubionicloading.hide();
        },7000);

        // // 根据坐标得到地址描述
        myGeo.getLocation(new BMap.Point(long, lat), function(result){

          if (result){
            $scope.$apply(function () {
              $timeout(function () {
                $pubionicloading.hide();
                $scope.weizhiss=result.address;
              });
            });
          }
        });
      })

    }, function(err) {
      $ToastUtils.showToast("定位失败");
    });

    //返回
    $scope.gobackmsg=function () {
///:id/:ssid/:grouptype
      if($scope.grouptype === 'User'){
        $state.go('messageDetail', {
          id: $scope.userId,
          ssid:$scope.userName,
          grouptype:$scope.grouptype,
          longitude:$scope.longitude,
          latitude:$scope.latitude
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
      $pubionicloading.showloading('','Loading...');

        $ionicNavBarDelegate.showBar(false);
      var url = new Date().getTime()+"";
      $timeout(function () {
        $pubionicloading.hide();
        document.getElementById("container").style.height=(window.screen.height-95)+'px';
      },800);

      $timeout(function () {
        //该插件已没用，故注释并删除
        // navigator.screenshot.save(function(error,res){
        //   // alert("进不进截屏");
        //   if(error){
        //     console.error(error);
        //   }else{
            // alert('ok'+res.filePath); //should be path/to/myScreenshot.jpg
            // $scope.screenpath=res.filePath;
            $mqtt.getMqtt().getTopic($scope.topic, $scope.grouptype, function (userTopic) {
              // alert("单聊topic"+userTopic+$scope.grouptype);
              $greendao.getUUID(function (data) {
                $scope.sqlid=data;
                if($scope.grouptype === 'Dept' || $scope.grouptype === 'Group'){
                  //发送开始
                  var myGeo = new BMap.Geocoder();
                  myGeo.getLocation(new BMap.Point(long, lat), function(result){
                      $rootScope.$apply(function () {
                        $timeout(function () {
                          $scope.content=long+","+lat+","+result.address;
                          $scope.suc = $mqtt.sendGroupMsg(userTopic, $scope.content, $scope.userId,$scope.grouptype,$scope.localuser,$scope.localuserId,$scope.sqlid,$scope.messagetype,$mqtt);
                          $scope.send_content = "";
                          keepKeyboardOpen();
                        });
                      });
                    // }
                  });
                  //发送结束
                }else if($scope.grouptype === 'User'){
                  //发送开始
                  var myGeo = new BMap.Geocoder();
                  myGeo.getLocation(new BMap.Point(long, lat), function(result){
                      $rootScope.$apply(function () {
                        // alert("danliaoresult"+result);
                        $timeout(function () {
                          $scope.content=long+","+lat+","+result.address;
                         // alert("地理位置内容"+$scope.content);
                         //  alert("1231321"+userTopic+$scope.grouptype+$scope.content);
                          $scope.suc = $mqtt.sendMsg(userTopic, $scope.content, $scope.userId,$scope.localuser,$scope.localuserId,$scope.sqlid,$scope.messagetype,'',$mqtt);
                          $scope.send_content = "";
                          // $timeout(function () {
                          //   viewScroll.scrollBottom();
                          // }, 100);
                          keepKeyboardOpen();
                        });
                      });
                    // }
                  });
                  //发送结束
                }
              });

            }, function (msg) {

            });
        //   }
        // },'jpg',100,url);
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


    $scope.$on('$ionicView.afterLeave', function () {
      // alert("离开定位");
      $scope.gobackmsg();
    });
  })

  .controller('mapdetailCtrl',function ($scope,$state,$ToastUtils,$cordovaGeolocation,$stateParams,$pubionicloading,$timeout) {
    $scope.latitude=$stateParams.latitude;
    $scope.longitude=$stateParams.longitude;
    $scope.userId=$stateParams.id;//对方用户id
    $scope.userName=$stateParams.ssid;//对方用户名
    $scope.grouptype=$stateParams.grouptype;//grouptype
    // alert("地图详情界面的grouptype"+$stateParams.grouptype);
    $scope.ismygroup=$stateParams.ismygroup;//是否为自建群
    // alert("地图界面详情信息"+$scope.userId+$scope.userName+$scope.grouptype);
    $pubionicloading.showloading('','Loading...');
    document.getElementById("container").style.height=(window.screen.height-140)+'px';
    //取出聊天界面带过来的id和ssid

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
        $pubionicloading.hide();
      },7000);
      // // 根据坐标得到地址描述
      myGeo.getLocation(new BMap.Point(long, lat), function(result){
        if (result){
          $scope.$apply(function () {
            $timeout(function () {
              $pubionicloading.hide();
              $scope.weizhiss=result.address;
            });
          });
        }
      });
      marker.addEventListener("dragend", function(e){           //116.341749   39.959682
        // alert("当前位置：" + e.point.lng + ", " + e.point.lat);// 116.341951   39.959632
        $pubionicloading.showloading('','Loading...');
        lat=e.point.lat;
        long=e.point.lng;
        // 创建地理编码实例
        var myGeo = new BMap.Geocoder();
        $timeout(function () {
          // $ToastUtils.showToast("网络超时")
          $pubionicloading.hide();
        },7000);
        // // 根据坐标得到地址描述
        myGeo.getLocation(new BMap.Point(long, lat), function(result){
          if (result){
            $scope.$apply(function () {
              $timeout(function () {
                $pubionicloading.hide();
                $scope.weizhiss=result.address;
              });
            });
          }
        });
      })


    }, function(err) {
      $ToastUtils.showToast("定位失败");
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
            grouptype:$stateParams.grouptype,
            longitude:$scope.longitude,
            latitude:$scope.latitude
          });
      }else if($scope.grouptype === 'Dept'){
          // alert("进来了吗？");
          $state.go('messageGroup', {
            id: $scope.userId,
            chatName:$scope.userName,
            grouptype:$stateParams.grouptype,
            ismygroup:$scope.ismygroup
          });
      }else if($scope.grouptype === 'Group'){
          $state.go('messageGroup', {
            id: $scope.userId,
            chatName:$scope.userName,
            grouptype:$stateParams.grouptype,
            ismygroup:$scope.ismygroup
          });
      }
    }



  })
  .controller('emergencycallCtrl', function ($scope,$state, $stateParams,$timeout,$ionicScrollDelegate) {
    $scope.topaa=1;
    var viewScroll = $ionicScrollDelegate.$getByHandle('fdsfsdfsd');
    viewScroll.scrollBottom();
    var keyboard = cordova.require('ionic-plugin-keyboard.keyboard');
    window.addEventListener("native.keyboardshow", function (e) {
      viewScroll.scrollBottom();
      document.getElementById("content333").style.marginTop='0px';
    });
    window.addEventListener("native.keyboardhide", function (e) {
      viewScroll.scrollBottom();
      document.getElementById("content333").style.marginTop='70%';
    });
    $scope.toptoptop=function () {
      $scope.topaa=0;
    }
    $scope.botbotbot=function () {
      $scope.topaa=1;
    }
    $scope.goback=function () {
      $state.go('tab.message');
    }

    $scope.aaa=0;
    $scope.bbb=0;
    $scope.ccc=0;
    $scope.ddd=0;
    $scope.eee=0;
    $scope.fff=0;
    $scope.ggg=0;
    $scope.hhh=0;
    $scope.iii=0;
    $scope.jjj=0;
    $scope.kkk=0;
    $scope.lll=0;
    $scope.mmm=0;
    $scope.nnn=0;
    $scope.ooo=0;
    $scope.ppp=0;
    $timeout(function () {
      $scope.aaa=1;
    }, 5000);
    $timeout(function () {
      $scope.bbb=1;
      $scope.nnn=1;
    }, 2000);
    $timeout(function () {
      $scope.ccc=1;
    }, 3500);
    $timeout(function () {
      $scope.ooo=1;
      $scope.ddd=1;
    }, 5555);
    $timeout(function () {
      $scope.eee=1;
    }, 7000);
    $timeout(function () {
      $scope.fff=1;
    }, 10000);
    $timeout(function () {
      $scope.ggg=1;
      $scope.ppp=1;
    }, 20000);
    $timeout(function () {
      $scope.hhh=1;
    }, 12500);
    $timeout(function () {
      $scope.iii=1;
    }, 14000);
    $timeout(function () {
      $scope.jjj=1;
    }, 15000);
    $timeout(function () {
      $scope.kkk=1;
    }, 15000);
    $timeout(function () {
      $scope.lll=1;
    }, 18000);
    $timeout(function () {
      $scope.mmm=1;
    }, 19000);

  })

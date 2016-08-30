/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('application.controllers', ['ionic', 'ngCordova'])
  .controller('ChatsCtrl', function ($scope,$state,$timeout,$mqtt,$greendao,$rootScope,$chatarr,$cordovaFileOpener2,$api,$cordovaBarcodeScanner,$ToastUtils,$grouparr,$ionicActionSheet) {
    $scope.pdfshow=function () {
       // $ToastUtils.showToast($cordovaFileOpener2)
      // /storage/emulated/0/pdf11.pdf
      $api.openFile('pdf11.pdf',function (msg) {
      },function (msg) {
        $ToastUtils.showToast(msg)
      })
      // $cordovaFileOpener2.open('../img/pdf11.pdf','application/pdf').then(function () {
      //   // 成功
      //   $ToastUtils.showToast("成功")
      // }, function (err) {
      //   // 错误
      //   $ToastUtils.showToast("失败")
      // });
    }

    $scope.a=0;
    $scope.dianjiaaa=function () {
      if ($scope.a==0){
        $scope.a=1;
      }else {
        $scope.a=0;
      }
    }

    $scope.b=0;
    $scope.dianjibbb=function () {
      if ($scope.b==0){
        $scope.b=1;
      }else {
        $scope.b=0;
      }
    }
    $scope.c=0;
    $scope.dianjiccc=function () {
      if ($scope.c==0){
        $scope.c=1;
      }else {
        $scope.c=0;
      }
    }
    $scope.duan='郑州至万州铁路河南段';
    $scope.danxuanze=function () {

        // 显示操作表
        $ionicActionSheet.show({
          buttons: [
            {text: '郑州至万州铁路河南段'},
            {text: '郑州至周口至阜阳铁路河南段'}
          ],
          titleText: '请选择',
          cancelText: '取消',
          buttonClicked: function (index) {
            if (index == 0) {
              $scope.duan='郑州至万州铁路河南段'
            } else {
              $scope.duan='郑州至周口至阜阳铁路河南段'
            }
            return true;
          }

        });
    }
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
    $scope.showToast = function(msg) {
      $ToastUtils.showToast(msg);
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
    $scope.goDatapicture = function () {
      $state.go("datapicture");
    };
    $scope.gogroupcall = function () {
      $state.go("groupcall");
    };
    $scope.goTwoDimensionPic = function () {
      $state.go("twoDimensionPic");
    };
  })
  .controller('datapictureCtrl', function ($scope, $state,$ToastUtils) {

    $scope.goApplication = function () {
      $state.go("tab.chats");
    };
      // Set up the chart
      var chart = new Highcharts.Chart({
        chart: {
          renderTo: 'container',
          type: 'column',
          options3d: {
            enabled: true,
            alpha: 15,
            beta: 15,
            depth: 50,
            viewDistance: 25
          }
        },
        title: {
          text: '拌和站demo'
        },
        subtitle: {
          text: '拌和站demo拌和站demo拌和站demo拌和站demo'
        },
        plotOptions: {
          column: {
            depth: 25
          }
        },
        series: [{
          data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
      });
    $scope.showValues = function () {
      $scope.aaa=chart.options.chart.options3d.alpha;
      $scope.bbb=chart.options.chart.options3d.beta;
      $scope.ccc=chart.options.chart.options3d.depth;
    };

    document.getElementById("alpha").addEventListener('input',function(){
      chart.options.chart.options3d.alpha = document.getElementById("alpha").value;
      $scope.showValues();
      chart.redraw(false);
    },false);
    document.getElementById("beta").addEventListener('input',function(){
      chart.options.chart.options3d.beta =  document.getElementById("beta").value;
      $scope.showValues();
      chart.redraw(false);
    },false);

    document.getElementById("depth").addEventListener('input',function(){
      chart.options.chart.options3d.depth = document.getElementById("depth").value;
      $scope.showValues();
      chart.redraw(false);
    },false);
     $scope.showValues();

  })
  .controller('groupcallCtrl', function ($scope, $state,$cordovaGeolocation,$ToastUtils) {

    $scope.goApplication = function () {
      $state.go("tab.chats");
    }
    //获取定位的经纬度
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
        var lat  = position.coords.latitude
        var long = position.coords.longitude
       $ToastUtils.showToast("经度"+lat+"纬度"+long)
      var latlon=position.coords.latitude+","+position.coords.longitude;
      var img_url="http://maps.googleapis.com/maps/api/staticmap?center="
        +latlon+"&zoom=14&size=400x300&sensor=false";
      document.getElementById("mapholder").innerHTML="<img src='"+img_url+"'>";
    }, function(err) {
        // error
      });


    // var watchOptions = {
    //   timeout : 3000,
    //   enableHighAccuracy: false // may cause errors if true
    // };
    //
    // var watch = $cordovaGeolocation.watchPosition(watchOptions);
    // watch.then(
    //   null,
    //   function(err) {
    //     // error
    //   },
    //   function(position) {
    //     var lat  = position.coords.latitude
    //     var long = position.coords.longitude
    //     $ToastUtils.showToast(lat+","+long)
    //   });
    //
    //
    // watch.clearWatch();
    // // OR
    // $cordovaGeolocation.clearWatch(watch)
    //   .then(function(result) {
    //     $ToastUtils.showToast(result)
    //     // success
    //   }, function (error) {
    //     $ToastUtils.showToast(error)
    //     // error
    //   });
    // var x=document.getElementById("demo");
    // function getLocation()
    // {
    //   if (navigator.geolocation)
    //   {
    //     navigator.geolocation.getCurrentPosition(showPosition,showError);
    //   }
    //   else
    //   {
    //     x.innerHTML="该浏览器不支持获取地理位置。";
    //   }
    // }
    //
    // function showPosition(position)
    // {
    //   lat=position.coords.latitude;
    //   lon=position.coords.longitude;
    //   latlon=new google.maps.LatLng(lat, lon)
    //   mapholder=document.getElementById('mapholder')
    //   mapholder.style.height='250px';
    //   mapholder.style.width='500px';
    //
    //   var myOptions={
    //     center:latlon,zoom:14,
    //     mapTypeId:google.maps.MapTypeId.ROADMAP,
    //     mapTypeControl:false,
    //     navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
    //   };
    //   var map=new google.maps.Map(document.getElementById("mapholder"),myOptions);
    //   var marker=new google.maps.Marker({position:latlon,map:map,title:"You are here!"});
    // }
    //
    // function showError(error)
    // {
    //   switch(error.code)
    //   {
    //     case error.PERMISSION_DENIED:
    //       x.innerHTML="用户拒绝对获取地理位置的请求。"
    //       break;
    //     case error.POSITION_UNAVAILABLE:
    //       x.innerHTML="位置信息是不可用的。"
    //       break;
    //     case error.TIMEOUT:
    //       x.innerHTML="请求用户地理位置超时。"
    //       break;
    //     case error.UNKNOWN_ERROR:
    //       x.innerHTML="未知错误。"
    //       break;
    //   }
    // }


  })

  .controller('twoDimensionPicCtrl', function ($scope, $state,$ToastUtils) {
    $scope.goApplication = function () {
      $state.go("tab.chats");
    };
    // //横向二维柱型
    // var option = {};
    // option.chart = {};
    // option.chart.type="bar";
    // option.chart.renderTo="container";
    // option.title={title:"水果的摄入"};
    // option.xAxis={categories:['苹果','香蕉','桔子'],gridLineWidth:1};
    // option.yAxis={title:{text:"吃水果的量"},tickInterval:1};
    // option.series = [];
    // option.series[0] = {};
    // option.series[0].name="张三";
    // option.series[0].data=[1,3,5];
    // option.series[1] = {};
    // option.series[1].name="李四";
    // option.series[1].data=[6,1,5.5];
    // option.series[2] = {};
    // option.series[2].name="刘能";
    // option.series[2].data=[3,1,0.3];
    // var chart = new Highcharts.Chart(option);

    // $('#container').highcharts
    // var container=document.getElementById("container");
    // var containeraa=$(container);
    $('#container').highcharts({
      chart: {
        zoomType: 'xy'
      },
      title: {
        text: 'Average Monthly Temperature and Rainfall in Tokyo'
      },
      subtitle: {
        text: 'Source: WorldClimate.com'
      },
      xAxis: [{
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        crosshair: true
      }],
      yAxis: [{ // Primary yAxis
        labels: {
          format: '{value}°C',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
        title: {
          text: 'Temperature',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        }
      }, { // Secondary yAxis
        title: {
          text: 'Rainfall',
          style: {
            color: Highcharts.getOptions().colors[0]
          }
        },
        labels: {
          format: '{value} mm',
          style: {
            color: Highcharts.getOptions().colors[0]
          }
        },
        opposite: true
      }],
      tooltip: {
        shared: true
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        x: 120,
        verticalAlign: 'top',
        y: 100,
        floating: true,
        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
      },
      series: [{
        name: 'Rainfall',
        type: 'column',
        yAxis: 1,
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        tooltip: {
          valueSuffix: ' mm'
        }
      }, {
        name: 'Temperature',
        type: 'spline',
        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
        tooltip: {
          valueSuffix: '°C'
        }
      }]
    });
  })

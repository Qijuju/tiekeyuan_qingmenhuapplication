/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('application.controllers', ['ionic', 'ngCordova'])
  .controller('ChatsCtrl', function ($scope,$state,$timeout,$mqtt,$greendao,$rootScope,$chatarr,$cordovaFileOpener2,$api,$cordovaBarcodeScanner,$ToastUtils,$ionicActionSheet,$ionicLoading,$ionicPlatform,$location,$ionicHistory) {


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
        // Setup the loader
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: false,
          maxWidth: 100,
          showDelay: 0
        });
        $timeout(function () {
          $ionicLoading.hide();
        },500);
      }else {
        $scope.a=0;
      }


    }

    $scope.b=0;
    $scope.dianjibbb=function () {
      if ($scope.b==0){
        $scope.b=1;
        // Setup the loader
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: false,
          maxWidth: 100,
          showDelay: 0
        });
        $timeout(function () {
          $ionicLoading.hide();
        },500);
      }else {
        $scope.b=0;
      }

    }
    $scope.c=0;
    $scope.dianjiccc=function () {
      if ($scope.c==0){
        $scope.c=1;
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: false,
          maxWidth: 100,
          showDelay: 0
        });
        $timeout(function () {
          $ionicLoading.hide();
        },500);
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
                      $scope.saveapplylastmsg();
                    });
                  });
                  $rootScope.isPersonSend = 'false';
                }, function (err) {
                  // $ToastUtils.showToast(err + "查询群组对应关系");
                });
              }
            }else{
              $scope.saveapplylastmsg();
            }
          }, function (err) {
            // $ToastUtils.showToast("收到群组未读消息时，查询chat列表" + err);
          });
          $scope.saveapplylastmsg=function () {
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

    // alert("进来了")
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
        var lat  = position.coords.latitude+0.006954;//   39.952728
        var long = position.coords.longitude+0.012647;//  116.329102
       // $ToastUtils.showToast("经度"+lat+"纬度"+long);
      var map = new BMap.Map("container"); // 创建地图实例
      var point = new BMap.Point(long, lat); // 创建点坐标
      map.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别
      map.addControl(new BMap.NavigationControl());
      map.addControl(new BMap.NavigationControl());
      map.addControl(new BMap.ScaleControl());
      map.addControl(new BMap.OverviewMapControl());
      map.addControl(new BMap.MapTypeControl());
      var marker = new BMap.Marker(point); // 创建标注
      map.addOverlay(marker); // 将标注添加到地图中
      marker.enableDragging();
      marker.addEventListener("dragend", function(e){           //116.341749   39.959682
        alert("当前位置：" + e.point.lng + ", " + e.point.lat);// 116.341951   39.959632
      })

      // 创建地理编码实例
      var myGeo = new BMap.Geocoder();
      // // 根据坐标得到地址描述
      // myGeo.getLocation(new BMap.Point(long, lat), function(result){
      //   if (result){
      //     alert(result.address);
      //   }
      // });
      //查询功能
      // var local = new BMap.LocalSearch(map, {
      //   renderOptions: {map: map, panel: "results"},
      //   pageCapacity: 10
      // });
      // local.searchInBounds(" ", map.getBounds());
      var mOption = {
        poiRadius : 100,           //半径为1000米内的POI,默认100米
        numPois : 5                //列举出50个POI,默认10个
      }
        $scope.weizhis=[];
        // map.addOverlay(new BMap.Circle(point,500));        //添加一个圆形覆盖物,圆圈，显示不显示都行
        myGeo.getLocation(point,
          function mCallback(rs){
            var allPois = rs.surroundingPois;       //获取全部POI（该点半径为100米内有6个POI点）
            for(var i=0;i<allPois.length;i++){
              // document.getElementById("panel").innerHTML += "<p style='font-size:12px;'>" + (i+1) + "、" + allPois[i].title + ",地址:" + allPois[i].address + "</p>";
              map.addOverlay(new BMap.Marker(allPois[i].point));

              $scope.$apply(function () {
                $scope.weizhis.push(allPois[i].address);
              });


            }
          },mOption
        );


    }, function(err) {
      $ToastUtils.showToast("请开启定位功能");
      });



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

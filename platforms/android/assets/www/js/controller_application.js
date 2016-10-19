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

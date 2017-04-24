/**
 * Created by Administrator on 2017/3/24.
 */
angular.module('portal.controllers', [])
  .controller('portalCtrl', function ($scope,$ToastUtils, $mqtt, $state, $ionicSlideBoxDelegate, $ionicLoading, NetData, $greendao,FinshedApp,$rootScope) {

    $scope.$on('netstatus.update', function (event) {
      $scope.$apply(function () {
        //alert("哈哈哈哈哈啊哈哈哈哈");
        //   alert("关网时走不走"+$rootScope.netStatus);
        $rootScope.isConnect=$rootScope.netStatus;
        // alert("切换网络时"+$scope.isConnect);
      })
    });


    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });

    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $greendao.queryByConditions('ChatListService',function (data) {
          $chatarr.setData(data);
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

      var userID;
      $mqtt.getUserInfo(function (succ) {
        userID = succ.userID;
        // userID=109975;
        //rxy 第一次http得到人员所在的部门
        NetData.getCompanyName(userID);
        //rxy 第二次http得到人员可以查看的应用(点亮图标）
        NetData.getAppMenu(userID);

      }, function (err) {
        $ionicLoading.hide();
        $ToastUtils.showToast("网络错误");
      });


      $scope.$on('companyName.update', function (event) {

        $scope.companyName = NetData.getName();

      });

      $scope.$on('error.update', function () {
        $ionicLoading.hide();
        $ToastUtils.showToast("网络错误");

      });
      $scope.$on('appMenu.update', function () {
        $ionicLoading.hide();
        var lightApps = NetData.getLightApps();
        console.log(NetData.getLightApps());
        // alert(lightApps.length);
        for (var i = 0; i < lightApps.length; i++) {
          document.getElementById("" + lightApps[i].appId).src = lightApps[i].appIcon;
        }
      });
      //rxy 跳转页面详情
      $scope.jumpUrl = function (appId) {
        //userId  用户的id后期动态获取
        if (NetData.get(appId) != null) {
          $state.go("cxtx", {
            "appId": appId,
            "userId": userID,
            "appUrl": FinshedApp.get(appId).appUrl
          });
        } else {
          // alert("该应用尚未上线");
        }
      };
  })




  //rxy 详情的控制器
  .controller('OhterCtrl', function ($scope, $state, $stateParams, $sce, FinshedApp) {
    var str;
    // $scope.userid=$stateParams.userId;    + "?userId=" + $stateParams.userId;
    $scope.appurl = $sce.trustAsResourceUrl($stateParams.appUrl+"?userId="+$stateParams.userId);
    // $scope.appurl = $sce.trustAsResourceUrl($stateParams.appUrl+"?userId=499");
    $scope.appName = FinshedApp.get($stateParams.appId).appName;
    // str=$stateParams.appUrl+"?userId="+$stateParams.userId;
    console.log($scope.appurl);


    $scope.goBack = function () {
      window.history.back();
      // $state.go("tab.dash");
    }

  });

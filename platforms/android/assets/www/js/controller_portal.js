/**
 * Created by Administrator on 2017/3/24.
 */
angular.module('portal.controllers', [])
  .controller('portalCtrl', function ($scope,$ToastUtils, $mqtt, $state, $ionicSlideBoxDelegate, $ionicLoading, NetData, FinshedApp) {

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
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

/**
 * Created by Administrator on 2017/3/24.
 */
angular.module('portal.controllers', [])
  .controller('portalCtrl', function ($scope, $ToastUtils, $mqtt, $state, $ionicSlideBoxDelegate, $ionicLoading, NetData, $greendao, FinshedApp, $rootScope, $http) {

    $scope.$on('netstatus.update', function (event) {
      $scope.$apply(function () {
        //alert("哈哈哈哈哈啊哈哈哈哈");
        //   alert("关网时走不走"+$rootScope.netStatus);
        $rootScope.isConnect = $rootScope.netStatus;
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

    var userID;
    $scope.$on('$ionicView.enter', function () {
      $mqtt.getUserInfo(function (succ) {
        userID = succ.userID;
        // userID=109975;
        // userID = 770;

        //获取人员所在部门，点亮图标
        NetData.getInfo(userID);


      }, function (err) {
        $ionicLoading.hide();
        $ToastUtils.showToast("网络错误");
      });
    })

    $scope.$on('succeed.update', function (event) {

      $scope.companyName = NetData.getName();
      //点亮图标
      var lightApps = NetData.getLightApps();
      for (var i = 0; i < lightApps.length; i++) {
        document.getElementById("" + lightApps[i].appId).src = lightApps[i].appIcon;
      }
      $ionicLoading.hide();
    });


    $scope.$on('error.update', function () {
      $ionicLoading.hide();
      $ToastUtils.showToast("网络错误");
    });


    //rxy 跳转页面详情
    $scope.jumpUrl = function (appId) {

      $http({
        method: 'get',
        timeout: 5000,
        url: "http://61.237.239.152:8080/apiman-gateway/jishitong/getsession/1.0?apikey=b8d7adfb-7f2c-47fb-bac3-eaaa1bdd9d16&id=" + userID
      }).success(function (data, status) {

        if (data.sessionid == null && typeof(data.sessionid) == "undefined") {
          $ToastUtils.showToast("获取用户权限失败!");
          return;
        }

        if (NetData.get(appId) != null) {
          $state.go("cxtx", {
            "appId": appId,
            "userId": userID,
            // "appUrl": "http://61.237.239.105:18190/h5app/DMSAppPage/UI/index.aspx?token=" + data.sessionid
            "appUrl": NetData.get(appId).appUrl + data.sessionid
          });
        }

      }).error(function (data, status) {
        $ToastUtils.showToast("获取用户权限失败!")
      });
    };

  })


  //rxy 详情的控制器
  .controller('OhterCtrl', function ($scope, $state, $stateParams, $sce, FinshedApp) {
    var str;
    // $scope.userid=$stateParams.userId;    + "?userId=" + $stateParams.userId;
    $scope.appurl = $sce.trustAsResourceUrl($stateParams.appUrl);
    // $scope.appurl = $sce.trustAsResourceUrl($stateParams.appUrl+"?userId=499");
    $scope.appName = FinshedApp.get($stateParams.appId).appName;
    // str=$stateParams.appUrl+"?userId="+$stateParams.userId;
    console.log($scope.appurl);


    $scope.goBack = function () {
      // window.history.back();
      $state.go("tab.portal");
    }

  });





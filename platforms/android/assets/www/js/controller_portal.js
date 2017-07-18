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
    var imCode;
    $scope.$on('$ionicView.enter', function () {
      $mqtt.getUserInfo(function (succ) {
        userID = succ.userID;
        // userID=109975;
        // userID = 770;

        //获取人员所在部门，点亮图标

        $mqtt.getImcode(function (imcode) {
          NetData.getInfo(userID,imcode);
          imCode=imcode;

        },function (err) {

        })




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
        method: 'post',
        timeout: 5000,
        //url: "http://imtest.crbim.win:8080/apiman-gateway/jishitong/interface/1.0?apikey=b8d7adfb-7f2c-47fb-bac3-eaaa1bdd9d16",
        url: "http://immobile.r93535.com:8088/crbim/imApi/1.0",
        data:{"Action":"GetSession","id":userID,"mepId":imCode}
      }).success(function (data, status) {

        var data=JSON.parse(decodeURIComponent(data));

        if (data.sessionid == null && typeof(data.sessionid) == "undefined" && data.sessionid == "") {
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





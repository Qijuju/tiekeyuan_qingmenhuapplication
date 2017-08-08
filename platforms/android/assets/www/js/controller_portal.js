/**
 * Created by Administrator on 2017/3/24.
 */
angular.module('portal.controllers', [])
  .controller('portalCtrl', function ($scope, $ToastUtils, $mqtt, $state, $ionicSlideBoxDelegate,$pubionicloading, $pubionicloading, NetData, $greendao, FinshedApp, $rootScope, $http) {

    $scope.$on('netstatus.update', function (event) {
      $scope.$apply(function () {
        //alert("哈哈哈哈哈啊哈哈哈哈");
        //   alert("关网时走不走"+$rootScope.netStatus);
        $rootScope.isConnect = $rootScope.netStatus;
        // alert("切换网络时"+$scope.isConnect);
      })
    });

    $pubionicloading.showloading('','Loading...');

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
        $pubionicloading.hide();
        // $ToastUtils.showToast("网络错误");
      });
    })

    $scope.$on('succeed.update', function (event) {

      $scope.companyName = NetData.getName();
      //点亮图标
      var lightApps = NetData.getLightApps();
      for (var i = 0; i < lightApps.length; i++) {
        document.getElementById("" + lightApps[i].appId).src = lightApps[i].appIcon;
      }
      $pubionicloading.hide();
    });


    $scope.$on('error.update', function () {
      $pubionicloading.hide();
      // $ToastUtils.showToast("网络错误");
    });


    //rxy 跳转页面详情
    $scope.jumpUrl = function (appId) {

      //获取当前用户的session(存储在基础平台)
      $http({
        method: 'post',
        timeout: 5000,
        // url:"http://88.1.1.22:8081",//测试环境
        // url: "http://imtest.crbim.win:8080/apiman-gateway/jishitong/interface/1.0?apikey=b8d7adfb-7f2c-47fb-bac3-eaaa1bdd9d16",//开发环境
        url: "http://immobile.r93535.com:8088/crbim/imApi/1.0",//正式环境
        data:{"Action":"GetSession","id":userID,"mepId":imCode}
      }).success(function (data, status) {

        var data=JSON.parse(decodeURIComponent(data));

        if (data.sessionid == null && typeof(data.sessionid) == "undefined" && data.sessionid == "") {
          $ToastUtils.showToast("获取用户权限失败!");
          return;
        }

        if (NetData.get(appId) != null) {
          // NetData.get(appId).appUrl + data.sessionid
          //信息发布url:http://172.25.28.128:8080/gatewayh/base/security/userinfo!loginForBaseHtml.action?sessionid=f101d7f9-7063-4d13-85a2-75837dc1243f
          /**
           * inappbrowser
           */
          document.addEventListener("deviceready", onDeviceReady, false);
          function onDeviceReady() {
            // alert("window.open works well");
            var ref = cordova.InAppBrowser.open(NetData.get(appId).appUrl + data.sessionid, '_blank', 'location=no,closebuttoncaption=My Button Name');
          }
          /**
           * 原始做法
           */
          // $state.go("cxtx", {
          //   "appId": appId,
          //   "userId": userID,
          //   // "appUrl": "http://61.237.239.105:18190/h5app/DMSAppPage/UI/index.aspx?token=" + data.sessionid
          //   "appUrl": NetData.get(appId).appUrl + data.sessionid
          // });
          /**
           * file transfer
           */
          // var fileURL="file:///storage/emulated/0/Download/123.css";
          // var win = function (r) {
          //   console.log("Code = " + r.responseCode);
          //   console.log("Response = " + r.response);
          //   console.log("Sent = " + r.bytesSent);
          // }
          //
          // var fail = function (error) {
          //   alert("An error has occurred: Code = " + error.code);
          //   console.log("upload error source " + error.source);
          //   console.log("upload error target " + error.target);
          // }
          //
          // var options = new FileUploadOptions();
          // options.fileKey = "file";
          // options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
          // options.mimeType = "text/plain";
          // alert("fileurl===="+fileURL+"===="+options.fileName);
          // var ft = new FileTransfer();
          // ft.download(encodeURI("http://172.25.28.128:8080/gateway/theme/default/css/login.css"),fileURL, win, fail, options);
          // console.log(fileURL+" :   "+fileURL);
          /**
           * custom tabs browser(默认就是选择打开手机内置浏览器)
           */
          // cordova.plugins.browsertab.openUrl('https://www.baidu.com');
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
    $scope.appurl = $sce.trustAsResourceUrl("http://198.25.1.21:8080/gatewayh/base/security/userinfo!loginForBaseHtml.action?sessionid=2d3d3a72-68d0-4a67-9e61-ae195ac9cded");
    // $scope.appurl = $sce.trustAsResourceUrl($stateParams.appUrl+"?userId=499");
    $scope.appName = FinshedApp.get($stateParams.appId).appName;
    // str=$stateParams.appUrl+"?userId="+$stateParams.userId;
    console.log($scope.appurl);


    $scope.goBack = function () {
      // window.history.back();
      $state.go("tab.portal");
    }

  });





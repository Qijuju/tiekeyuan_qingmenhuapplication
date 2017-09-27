/*
 * Created by Administrator on 2017/3/24.
 */
angular.module('portal.controllers', [])
  .controller('portalCtrl2', function ($scope,$mqtt,NetData,$http,$ToastUtils,$api) {
    // $scope, $state, $ionicSlideBoxDelegate, $pubionicloading, $greendao, FinshedApp, $rootScope, $api,$sce

    var userID; // userID = 232099
    var imCode; //  imCode = 866469025308438
    $scope.dataSource = {}; // 请求回来的数据源 json格式
    $scope.name =  "";// 公司名称
    $scope.sysmenu = []; // 豆腐块数据源

    // 数据源请求
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
          // 数据源赋值
          $scope.dataSource = JSON.parse(decodeURIComponent(data)); // 请求回来的数据源 json格式
          $scope.sysmenu =  $scope.dataSource.sysmenu;

          // 从数据源中获取公司名称，当数据源为空时，默认显示门户。
          if ($scope.dataSource.jsdept.name === "" || $scope.dataSource.jsdept.name === null || $scope.dataSource.jsdept.name === undefined) {
            $scope.name = "门户";
          }else {
            $scope.name = $scope.dataSource.jsdept.name;
          }

          // 图片的显示




        }).error(function (data, status) {
          $ToastUtils.showToast("获取用户权限失败!");
        });
      }, function (err) {
      })
    }, function (err) {
    });

    // 图片处理，本地有的话直接获取显示，没有的话下载显示并缓存到本地。
    $api.downloadQYYIcon('hygl',function (success) {
      // success 返回的是图片的绝对路径

      alert( " 进入本地成功11:" +  success);
    },function (err) {
      alert( " 进入本地失败22:" +  err);
    });

    $scope.logoClick = function (obj) {

      // 已经拿到数据源
      //  alert( "接收的数据为appIcon：" + obj.appIcon + "<br>appId: " + obj.appId  + "<br>appName: " +obj.appName + "<br>appNum: " +obj.appNum+ "<br>flag: " +obj.flag+ "<br>type: " +obj.type );

      function CheckImgExists(imgurl) {
        var ImgObj = new Image(); //判断图片是否存在
        ImgObj.src = imgurl;
        //没有图片，则返回-1
        if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
          return true;
        } else {
          return false;
        }
      }


    }


    // // 取出原始数据源信息
    // var finshedAppsArr = FinshedApp.all();
    //
    // // 循环遍历数据源，根据id查找相应的图片信息。有的话，设置为相应的图片信息；没有的话，设置一个默认显示图片的路径。
    // for (var i = 0; i < $scope.notifyNewList.length; i++) {
    //
    //   // 取出一条数据的id
    //   var fromId = $scope.notifyNewList[i].FromID;
    //
    //   // 默认显示的图片
    //   $scope.notifyNewList[i].appIcon = "img/notify.png";
    //
    //   // 查找数据源，设置图片信息
    //   for (var j = 0; j < finshedAppsArr.length; j++) {
    //     if (finshedAppsArr[j].appId == fromId) {
    //       $scope.notifyNewList[i].appIcon = finshedAppsArr[j].appIcon;
    //     }
    //   }
    // }

    // $scope.$on('succeed.update', function (event) {
    //   $pubionicloading.hide();
    //
    //   $scope.companyName = NetData.getName();
    //
    //   console.log("公司名称:" + $scope.companyName );
    //
    //   if($scope.companyName === "" || $scope.companyName === null ||$scope.companyName === undefined){
    //     $scope.companyName="门户";
    //   }
    //   //点亮图标
    //   var lightApps = NetData.getLightApps();
    //   for (var i = 0; i < lightApps.length; i++) {
    //     document.getElementById("" + lightApps[i].appId).src = lightApps[i].appIcon;
    //   }
    // });
    //
    // $scope.$on('error.update', function () {
    //   $pubionicloading.hide();
    //   // $ToastUtils.showToast("网络错误");
    // });
    //
    //
    // //rxy 跳转页面详情
    // $scope.jumpUrl = function (appId) {
    //   //获取当前用户的session(存储在基础平台)
    //   $http({
    //     method: 'post',
    //     timeout: 5000,
    //     // url:"http://88.1.1.22:8081",//测试环境
    //     // url: "http://imtest.crbim.win:8080/apiman-gateway/jishitong/interface/1.0?apikey=b8d7adfb-7f2c-47fb-bac3-eaaa1bdd9d16",//开发环境
    //     url: "http://immobile.r93535.com:8088/crbim/imApi/1.0",//正式环境
    //     data: {"Action": "GetSession", "id": userID, "mepId": imCode}
    //   }).success(function (data, status) {
    //
    //
    //     var data = JSON.parse(decodeURIComponent(data));
    //     if (data.sessionid == null && typeof(data.sessionid) == "undefined" && data.sessionid == "") {
    //       $ToastUtils.showToast("获取用户权限失败!");
    //       return;
    //     }
    //     //
    //     // $scope.appurl = $sce.trustAsResourceUrl("http://www.r93535.com/im_gateway/base/security/userinfo!loginForBaseHtml.action?sessionid="+data.sessionid);
    //     // alert("数据库的appurl ==" + appurl);
    //
    //
    //     if (NetData.get(appId) != null && NetData.get(appId) != "") {
    //       document.addEventListener("deviceready", onDeviceReady, false);
    //       function onDeviceReady() {
    //
    //         //先测oa流程
    //         if (appId === 199) {
    //           //oa包名：com.r93535.oa
    //           //爱加密包名：com.thundersec.encwechat
    //           cordova.plugins.OAIntegration.getApk("com.thundersec.encwechat", "199", "公文处理", function (succ) {
    //             //进行统计埋点
    //             $api.sendOperateLog("AppVisit", new Date().getTime(), appId, function (succ) {
    //               // alert("埋点成功"+succ);
    //             }, function (err) {
    //
    //             })
    //           }, function (err) {
    //           });
    //         }else if( appId === 132){//物资设备
    //           //物资设备包名：com.mengyou.myplatforms
    //           //物资设备action名：hideicon.yy
    //           cordova.plugins.OAIntegration.getApk("com.mengyou.myplatforms", "132", "物资设备", function (succ) {
    //             //进行统计埋点
    //             $api.sendOperateLog("AppVisit", new Date().getTime(), appId, function (succ) {
    //               // alert("埋点成功"+succ);
    //             }, function (err) {
    //
    //             })
    //           }, function (err) {
    //           });
    //         } else {
    //           /**
    //            * 打开浏览器时先判断是否支持browserTab
    //            * 否则采用inappbrowser
    //            * @type {string}
    //            */
    //           var testURL = NetData.get(appId).appUrl + data.sessionid;
    //           // var testURL="http://123.56.187.121:60/interfaceLogin.aspx?UserName=liubolb&RealName=刘博&GUID=c95c77759ba60769d55cf441508ee342";
    //           cordova.plugins.browsertab.isAvailable(function (result) {
    //               if (!result) {
    //
    //                 cordova.InAppBrowser.open(testURL, '_blank', 'location=no,closebuttoncaption=返回');
    //               } else {
    //
    //                 cordova.plugins.browsertab.openUrl(
    //                   testURL,
    //                   function (successResp) {
    //                   },
    //                   function (failureResp) {
    //                     // alert('failed to launch browser tab');
    //                     // error.textContent = 'failed to launch browser tab';
    //                     // error.style.display = '';
    //                   });
    //               }
    //               //进行统计埋点
    //               $api.sendOperateLog("AppVisit", new Date().getTime(), appId, function (succ) {
    //                 // alert("埋点成功"+succ);
    //               }, function (err) {
    //
    //               })
    //             },
    //             function (isAvailableError) {
    //             });
    //         }
    //       }
    //     }
    //   }).error(function (data, status) {
    //     $ToastUtils.showToast("获取用户权限失败!");
    //   });
    // };

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





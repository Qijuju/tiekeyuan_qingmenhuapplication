/**
 * Created by Administrator on 2017/3/24.
 */
angular.module('portal.controllers', [])
  .controller('portalCtrl', function ($scope, $ToastUtils, $mqtt, $state, $ionicSlideBoxDelegate, $pubionicloading, NetData, $greendao, $ionicPopup, FinshedApp, $rootScope, $http, $api) {

    $mqtt.getUserInfo(function (succ) {
      userID = succ.userID;
    }, function (err) {
      $pubionicloading.hide();
    })

    $scope.$on('netstatus.update', function (event) {
      $scope.$apply(function () {
        $rootScope.isConnect = $rootScope.netStatus;
      })
    });

    $pubionicloading.showloading('', '正在加载...');

    var userID;
    var imCode;

    $scope.$on('$ionicView.enter', function () {
      $mqtt.getUserInfo(function (succ) {
        userID = succ.userID;

        //获取人员所在部门，点亮图标
        $mqtt.getImcode(function (imcode) {
          NetData.getInfo(userID, imcode);
          imCode = imcode;
        }, function (err) {

        })
      }, function (err) {
        $pubionicloading.hide();
      });
    })


    $scope.$on('succeed.update', function (event) {
      $pubionicloading.hide();
      $scope.companyName = NetData.getName();
      if ($scope.companyName === "" || $scope.companyName === null || $scope.companyName === undefined) {
        $scope.companyName = "门户";
      }
      //点亮图标
      var lightApps = NetData.getLightApps();
      for (var i = 0; i < lightApps.length; i++) {
        document.getElementById("" + lightApps[i].appId).src = lightApps[i].appIcon;
      }
    });


    $scope.$on('error.update', function () {
      $pubionicloading.hide();
      // $ToastUtils.showToast("网络错误");
    });

    //pubilc：选择调用谷歌还是其他浏览器
    $scope.chooseBrowser = function (testUrl,appId) {
      cordova.plugins.browsertab.isAvailable(function (result) {
        if (!result) {
          // alert("呀呀inAPPbrowser");
          // hardwareback=no
          var ref = cordova.InAppBrowser.open(testUrl, '_blank','hidden = no,location= no');
        } else {
          // alert("呀呀browsertab");
          cordova.plugins.browsertab.openUrl(
            testUrl,
            function (successResp) {
            },
            function (failureResp) {
              // alert('failed to launch browser tab');
              // error.textContent = 'failed to launch browser tab';
              // error.style.display = '';
            });
        }
        //进行统计埋点
        $api.sendOperateLog("AppVisit", new Date().getTime(), appId, function (succ) {
        }, function (err) {
        })
      }, function (isAvailableError) {
      });
    }

    //rxy 跳转页面详情
    $scope.jumpUrl = function (appId) {
      if (appId === 237) {
        cordova.plugins.barcodeScanner.scan(function (success) {
          if(success.text.indexOf("id") >= 0 && success.text.indexOf("name") >= 0 && success.text.indexOf("type") >= 0){
            var result = angular.fromJson(success.text);
            //拿到json对象的所有的key名，然后判断是否为id，name，type
            // var keys=Object.keys(result);
            var id = result.id;
            var type = result.type;
            var testUrl = "http://api.r93535.com/appscan/?id="+id+"&type="+type;
            $scope.chooseBrowser(testUrl,appId);
          }else{
            $ToastUtils.showToast("请扫描工程部位的二维码！");
          }
        }, function (err) {
          $ToastUtils.showToast("请扫描工程部位的二维码！");
        },{
            preferFrontCamera: false, // iOS and Android
            showFlipCameraButton: true, // iOS and Android
            showTorchButton: true, // iOS and Android 显示开起手电筒的按钮
            torchOn: false, // Android, launch with the torch switched on (if available) 启动手电筒开启（如果有）
            saveHistory: false,//保存扫描历史（默认为false）
            prompt: "请将二维码放在扫描框中", // Android 提示信息
            resultDisplayDuration: 500, // Android, 显示X ms的扫描文本。0完全禁止它，默认为1500
            formats: "QR_CODE,PDF_417", // 默认值：除PDF_417和RSS_EXPANDED之外的所有
            orientation: "portrait" // 仅Android（纵向|横向），默认未设置，因此它随设备旋转   portrait|landscape
            // disableAnimations : true // iOS
          }
        );
      }

      //获取当前用户的session(存储在基础平台)
      $http({
        method: 'post',
        timeout: 5000,
        // url:"http://88.1.1.22:8081",//测试环境
        // url: "http://imtest.crbim.win:8080/apiman-gateway/jishitong/interface/1.0?apikey=b8d7adfb-7f2c-47fb-bac3-eaaa1bdd9d16",//开发环境
        // url: "http://immobile.r93535.com:8088/crbim/imApi/1.0",//正式环境
        url: "http://202.137.140.133:6001",//老挝正式环境
        data: {"Action": "GetSession", "id": userID, "mepId": imCode}
      }).success(function (data, status) {
        var data = JSON.parse(decodeURIComponent(data));
        if (data.sessionid == null && typeof(data.sessionid) == "undefined" && data.sessionid == "") {
          $ToastUtils.showToast("获取用户权限失败!");
          return;
        }
        if (NetData.get(appId) != null && NetData.get(appId) != "") {
          document.addEventListener("deviceready", onDeviceReady, false);
          function onDeviceReady() {

            //先测oa流程
            if (appId === 199) {
              //oa包名：com.r93535.oa
              //爱加密包名：com.thundersec.encwechat
              cordova.plugins.OAIntegration.getApk("com.thundersec.encwechat", "199", "公文处理", function (succ) {
                //进行统计埋点
                $api.sendOperateLog("AppVisit", new Date().getTime(), appId, function (succ) {
                  // alert("埋点成功"+succ);
                }, function (err) {

                })
              }, function (err) {
              });
            } else if (appId === 132) {//物资设备
              //物资设备包名：com.mengyou.myplatforms
              //物资设备action名：hideicon.yy
              cordova.plugins.OAIntegration.getApk("com.mengyou.myplatforms", "132", "物资设备", function (succ) {
                //进行统计埋点
                $api.sendOperateLog("AppVisit", new Date().getTime(), appId, function (succ) {
                  // alert("埋点成功"+succ);
                }, function (err) {

                })
              }, function (err) {
              });
            } else if (appId === 82 || appId === 49 || appId === 35 || appId === 16) {
              var appName = NetData.getAppName(appId);
              var confirmPopup = $ionicPopup.confirm({
                title: "友情提示",
                template: appName + "需通过VPN访问，请确认是否安装VPN并连接成功!", //从服务端获取更新的内容
                cancelText: '取消',
                okText: '确定'
              });

              confirmPopup.then(function (res) {
                if (res) {
                  /**
                   * 打开浏览器时先判断是否支持browserTab
                   * 否则采用inappbrowser
                   * @type {string}
                   */
                  var testURL = NetData.get(appId).appUrl + data.sessionid;
                  // var testURL="http://123.56.187.121:60/interfaceLogin.aspx?UserName=liubolb&RealName=刘博&GUID=c95c77759ba60769d55cf441508ee342";
                  $scope.chooseBrowser(testURL,appId);
                }

              });
            }
            // else if( appId === 237){
            //   alert("进来二维码扫描app");
            //   cordova.plugins.barcodeScanner.scan(function (success) {
            //     alert("二维码扫描结果"+JSON.stringify(success));
            //   },function (err) {
            //     alert("二维码扫描失败"+err);
            //   });
            // }
            else {
              /**
               * 打开浏览器时先判断是否支持browserTab
               * 否则采用inappbrowser
               * @type {string}
               */
              var testURL = NetData.get(appId).appUrl + data.sessionid;
              // var testURL="http://123.56.187.121:60/interfaceLogin.aspx?UserName=liubolb&RealName=刘博&GUID=c95c77759ba60769d55cf441508ee342";
              $scope.chooseBrowser(testURL,appId);
            }
          }
        }


        /**
         * 用于所有子应用都测试通过并正式上线再启用
         */
        // if (NetData.get(appId).type === '1') {
        //
        //   $mqtt.getUserInfo(function (userinfo) {
        //     // alert("用户登录信息"+JSON.stringify(userinfo));
        //     var username=userinfo.loginAccount;
        //     var realname=userinfo.userName;
        //     if (username != null || username != '' || username != undefined) {
        //       var ref = cordova.InAppBrowser.open(NetData.get(appId).appUrl + '&UserName=' + username  + '&RealName='
        //         + realname + '&GUID=c95c77759ba60769d55cf441508ee342' + '&DATE=' + new Date().getTime(),
        //         '_blank', 'location=no,closebuttoncaption=返回');
        //     }
        //   });
        //   $SPUtils.getUsername(function (username) {
        //
        //   // }, function (err) {
        //   //
        //   // });
        //
        // }else  if(NetData.get(appId).type==='0'){
        //     alert("哈哈哈哈");
        //     // NetData.get(appId).appUrl + data.sessionid
        //     //信息发布url:http://172.25.28.128:8080/gatewayh/base/security/userinfo!loginForBaseHtml.action?sessionid=f101d7f9-7063-4d13-85a2-75837dc1243f
        //     /**
        //      * inappbrowser
        //      */
        //     // document.addEventListener("deviceready", onDeviceReady, false);
        //     // function onDeviceReady() {
        //     //   // alert("window.open works well");
        //     //   var ref = cordova.InAppBrowser.open(NetData.get(appId).appUrl + data.sessionid, '_blank', 'location=no,closebuttoncaption=My Button Name');
        //     // }
        //     /**
        //      * 原始做法
        //      */
        //     // $state.go("cxtx", {
        //     //   "appId": appId,
        //     //   "userId": userID,
        //     //   // "appUrl": "http://61.237.239.105:18190/h5app/DMSAppPage/UI/index.aspx?token=" + data.sessionid
        //     //   "appUrl": NetData.get(appId).appUrl + data.sessionid
        //     // });
        //     /**
        //      * file transfer
        //      */
        //     // var fileURL="file:///storage/emulated/0/Download/123.css";
        //     // var win = function (r) {
        //     //   console.log("Code = " + r.responseCode);
        //     //   console.log("Response = " + r.response);
        //     //   console.log("Sent = " + r.bytesSent);
        //     // }
        //     //
        //     // var fail = function (error) {
        //     //   alert("An error has occurred: Code = " + error.code);
        //     //   console.log("upload error source " + error.source);
        //     //   console.log("upload error target " + error.target);
        //     // }
        //     //
        //     // var options = new FileUploadOptions();
        //     // options.fileKey = "file";
        //     // options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
        //     // options.mimeType = "text/plain";
        //     // alert("fileurl===="+fileURL+"===="+options.fileName);
        //     // var ft = new FileTransfer();
        //     // ft.download(encodeURI("http://172.25.28.128:8080/gateway/theme/default/css/login.css"),fileURL, win, fail, options);
        //     // console.log(fileURL+" :   "+fileURL);
        //     /**
        //      * custom tabs browser(默认就是选择打开手机内置浏览器)
        //      */
        //     // cordova.plugins.browsertab.openUrl('https://www.baidu.com');
        //   document.addEventListener("deviceready", onDeviceReady, false);
        //   function onDeviceReady() {
        //
        //       /**
        //        * 打开浏览器时先判断是否支持browserTab
        //        * 否则采用inappbrowser
        //        * @type {string}
        //        */
        //       var testURL = NetData.get(appId).appUrl + data.sessionid;
        //       // var testURL="http://123.56.187.121:60/interfaceLogin.aspx?UserName=liubolb&RealName=刘博&GUID=c95c77759ba60769d55cf441508ee342";
        //       cordova.plugins.browsertab.isAvailable(function (result) {
        //           if (!result) {
        //             // alert("1111"+result);
        //             cordova.InAppBrowser.open(testURL, '_blank', 'location=no,closebuttoncaption=返回');
        //           } else {
        //             // alert("2222"+result);
        //             cordova.plugins.browsertab.openUrl(
        //               testURL,
        //               function (successResp) {
        //               },
        //               function (failureResp) {
        //                 // alert('failed to launch browser tab');
        //                 // error.textContent = 'failed to launch browser tab';
        //                 // error.style.display = '';
        //               });
        //           }
        //         },
        //         function (isAvailableError) {
        //           // alert('failed to query availability of in-app browser tab');
        //           // error.textContent = 'failed to query availability of in-app browser tab';
        //           // error.style.display = '';
        //         });
        //   }
        // }
      }).error(function (data, status) {
        $ToastUtils.showToast("获取用户权限失败!");
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





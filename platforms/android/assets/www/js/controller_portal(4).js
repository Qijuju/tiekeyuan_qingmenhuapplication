/*
 * Created by Administrator on 2017/3/24.
 */
angular.module('portal.controllers', [])
angular.module('portal.controllers', [])
    .controller('portalCtrl', function ($scope,$SPUtils,$http,$toastutils,$formalurlapi,$ionicPopup,$publicionicloading,$state) {

      var userID;
      var imCode;
      $scope.dataSource = {}; // 请求回来的数据源 json格式
      $scope.name =  "";// 公司名称
      $scope.sysmenu = []; // 豆腐块数据源
      var loadUrl=$formalurlapi.getBaseUrl();
      // 数据源请求
      $SPUtils.getLoginInfo(function (succ) {
        userID =  succ.user.id;
        imCode = succ.mepId;
        $publicionicloading.showloading();
        $http({
          method: 'post',
          timeout: 5000,
          url: loadUrl,//开发环境
          // 'http://imtest.crbim.win:8080/apiman-gateway/jishitong/newMsgCheck/1.0?apikey=b8d7adfb-7f2c-47fb-bac3-eaaa1bdd9d16';
          data: {
            "Action": "GetAppList",
            "id": userID,
            "mepId": imCode,
            "platform":"I"
          }
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
          // 图片的处理
          angular.element(document).ready(function(){
            // 获取到所有的logo标签img
            var imgObjs = document.getElementsByClassName("portalImg");
            var protalAppsCol12s = document.getElementsByClassName("protalAppsCol12");
            $scope.appIconArr = [];
            $scope.focusIndex;
            $scope.allData =[];
            $scope.clickData =[];
            // 根据数据源的flag标志判断图片是否点亮
            for(var i=0;i<$scope.sysmenu.length;i++){
              // 获取每一组的元素
              var items =  $scope.sysmenu[i].items;
              for(var j=0;j<items.length;j++){
                $scope.allData.push(items[j]);
                var flag = items[j].flag;
                var appIcon = items[j].appIcon;
                if(flag){
                  $scope.clickObj = {};
                  $scope.item = items[j];
                  $scope.focusIndex=0;
                  if (i === 0 ){
                    $scope.focusIndex = j;
                  }else if (  i > 0){
                    for (var k=0;k<i;k++){
                      $scope.focusIndex += $scope.sysmenu[k].items.length ;
                    }
                    $scope.focusIndex = $scope.focusIndex + j;
                  }
                  $scope.appIconArr.push(appIcon);
                  $scope.clickData.push($scope.focusIndex);
                }else {
                  $scope.appIconArr.push(appIcon+'_f');
                }
              }
            }
            for( var num=0;num< $scope.clickData.length;num++){
              var index = $scope.clickData[num];
              getConsole(index);
            }
            function getConsole(index){
              protalAppsCol12s[index].onclick = function() {
                logoClick($scope.allData[index]);
              };
            }
            if($scope.appIconArr.length){
              cordova.plugins.CordovaPluginIMAPI.getAppIcon($scope.appIconArr,function (success) {
                for (var m=0;m<success.length;m++){
                  imgObjs[m].src = success[m];
                }
              },function (error) {
              });
            }
          });
          $publicionicloading.hideloading();
        }).error(function (data, status) {
          $publicionicloading.hideloading();
          $toastutils.showToast('获取用户权限失败！','1');
        });
      }, function (err) {
      });
      //pubilc：选择调用谷歌还是其他浏览器
      $scope.chooseBrowser = function (testUrl,appId) {
        var ref = cordova.InAppBrowser.open(testUrl, '_blank','location=no,closebuttoncaption=返回');
        //进行统计埋点
        cordova.plugins.CordovaPluginIMAPI.POST($formalurlapi.getBaseUrl(),
            {
              'Action':'OperateLog',
              'id':userID,
              'mepId':imCode,
              'type':'AppVisit',
              'platform':'I',
              'appId':appId,
              'when':Date.parse(new Date())
            },
            function (success) {
            },
            function (error) {
            });
      }
      //通过接口得到访问应用的url
      $scope.getQyyUrl=function (appId,params) {
        //点击应用图标时调用getapplink的接口获取跳转的url
        $http({
          method: 'post',
          timeout: 5000,
          url: loadUrl,//开发环境
          // url: "http://immobile.r93535.com:8088/crbim/imApi/1.0",//正式环境
          data: {"Action": "GetAppLink", "id": userID, "mepId": imCode,"platform":"A","appId":appId,"params":params}
        }).success(function (data) {
          var data =JSON.parse(decodeURIComponent(data));
          console.log('----'+data.url+'---'+userID);
          $scope.chooseBrowser(data.url,appId);
        }).error(function (err) {
        });
      }
      function logoClick(item) {
        var params = '';
        switch (item.type) {
            //普通h5应用
          case "0":
            $scope.getQyyUrl(item.appId, params);
            break;
            //特殊外部应用（android原生集成，例：公文处理）
          case "12":
            break;
            //VPN应用
          case "2":
            var confirmPopup = $ionicPopup.confirm({
              title: "友情提示",
              template: item.appName + "需通过VPN访问，请确认是否安装VPN并连接成功!", //从服务端获取更新的内容
              cancelText: '取消',
              okText: '确定'
            });
            confirmPopup.then(function (res) {
              if (res) {
                $scope.getQyyUrl(item.appId, params);
              }
            });
            break;
            //二维码应用
          case "3":
            if (item.appId === "237") {
              $state.go("projectPart",{
                id:item.appId
              });
            }
            break;
          default:
            $scope.getQyyUrl(item.appId, params);
            break;
        }
      }
    })
  //   .controller('portalCtrl', function ($scope,$SPUtils,$http,$toastutils,$formalurlapi,$ionicPopup,$publicionicloading,$state,$rootScope) {
  //
  //     // 门户页原始数据源
  //     $scope.dataSource = $rootScope.portalDataSource;
  //     $scope.sysmenu = $scope.dataSource.sysmenu;
  //     $scope.appIconPaths =  $rootScope.appIconPaths;
  //
  //     // 存放所有的item对象
  //     $scope.allData=[];
  //     var userID;
  //     var imCode;
  //     var loadUrl=$formalurlapi.getBaseUrl();
  //     // // 数据源请求
  //     $SPUtils.getLoginInfo(function (succ) {
  //       userID = succ.user.id;
  //       imCode = succ.mepId;
  //
  //     });
  //     // 从数据源中获取公司名称，当数据源为空时，默认显示门户。
  //     if ($scope.dataSource.jsdept.name === "" || $scope.dataSource.jsdept.name === null || $scope.dataSource.jsdept.name === undefined) {
  //       $scope.name = "门户";
  //     }else {
  //       $scope.name = $scope.dataSource.jsdept.name;
  //     }
  //
  //     angular.element(document).ready(function(){
  //
  //       // 获取所有的图片标签
  //       $scope.protalAppsCol12s  = document.getElementsByClassName("protalAppsCol12");
  //
  //       $scope.imgs = document.getElementsByClassName("portalImg");
  //
  //       for(var i=0;i<$scope.appIconPaths.length;i++){
  //         $scope.imgs[i].src =  $scope.appIconPaths[i];
  //
  //       }
  //
  //       // 存放点亮图标的数组
  //       $scope.clickData=[];
  //
  //       for(var i=0;i<$scope.sysmenu.length;i++){
  //         // 获取每一组的元素
  //         var items =  $scope.sysmenu[i].items;
  //         for(var j=0;j<items.length;j++){
  //           $scope.allData.push(items[j]);
  //         }
  //       }
  //
  //       // 获取点亮图标的下标,并添加点击事件
  //       for(var i=0;i<$scope.sysmenu.length;i++){
  //         // 获取每一组的元素
  //         var items =  $scope.sysmenu[i].items;
  //         for(var j=0;j<items.length;j++){
  //           var flag = items[j].flag;
  //           if(flag){
  //             $scope.focusIndex=0;
  //             if (i === 0 ){
  //               $scope.focusIndex = j;
  //             }else if (  i > 0){
  //               for (var k=0;k<i;k++){
  //                 $scope.focusIndex += $scope.sysmenu[k].items.length ;
  //               }
  //               $scope.focusIndex = $scope.focusIndex + j;
  //             }
  //             $scope.clickData.push( $scope.focusIndex );
  //           }
  //
  //           // /* 将路径添加进数据结构中  start */
  //           // $scope.pathIndex=0;
  //           // if (i === 0 ){
  //           //   $scope.pathIndex = j;
  //           // }else if (  i > 0){
  //           //   for (var m=0;m<i;m++){
  //           //     $scope.pathIndex += $scope.sysmenu[m].items.length ;
  //           //   }
  //           //   $scope.pathIndex = $scope.pathIndex + j;
  //           // }
  //           // $scope.sysmenu[i].items[j].logoPath =  $scope.appIconPaths[$scope.pathIndex];
  //           //
  //           //
  //           // /*** end ***/
  //         }
  //       }
  //
  //       // 给点亮图标添加点击事件
  //       for( var num=0;num< $scope.clickData.length;num++){
  //         lightItemClickE($scope.clickData[num]);
  //       }
  //
  //       // 定义点亮图标的点击事件
  //       function lightItemClickE(index){
  //         $scope.protalAppsCol12s[index].onclick = function() {
  //           logoClick( $scope.allData[index]);
  //         };
  //       }
  //
  //       //pubilc：选择调用谷歌还是其他浏览器
  //       $scope.chooseBrowser = function (testUrl,appId) {
  //
  //         var ref = cordova.InAppBrowser.open(testUrl, '_blank','location=no,closebuttoncaption=返回');
  //
  //         //进行统计埋点
  //         cordova.plugins.CordovaPluginIMAPI.POST($formalurlapi.getBaseUrl(),
  //             {
  //               'Action':'OperateLog',
  //               'id':userID,
  //               'mepId':imCode,
  //               'type':'AppVisit',
  //               'platform':'I',
  //               'appId':appId,
  //               'when':Date.parse(new Date())
  //             },
  //             function (success) {
  //
  //             },
  //             function (error) {
  //
  //             });
  //       };
  //
  //       //通过接口得到访问应用的url
  //       $scope.getQyyUrl=function (appId,params) {
  //
  //         $publicionicloading.showloading();
  //         //点击应用图标时调用getapplink的接口获取跳转的url
  //         $http({
  //           method: 'post',
  //           timeout: 5000,
  //           url: loadUrl,//开发环境
  //           // url: "http://immobile.r93535.com:8088/crbim/imApi/1.0",//正式环境
  //           data: {"Action": "GetAppLink", "id": userID, "mepId": imCode,"platform":"A","appId":appId,"params":params}
  //         }).success(function (data) {
  //
  //           var data =JSON.parse(decodeURIComponent(data));
  //
  //           $publicionicloading.hideloading();
  //           $scope.chooseBrowser(data.url,appId);
  //
  //         }).error(function (err) {
  //           $publicionicloading.hideloading();
  //         });
  //       }
  //
  //       function logoClick(item) {
  //
  //
  //         var params = '';
  //
  //         switch (item.type) {
  //             //普通h5应用
  //           case "0":
  //             $scope.getQyyUrl(item.appId, params);
  //             break;
  //             //特殊外部应用（android原生集成，例：公文处理）
  //           case "12":
  //
  //             break;
  //             //VPN应用
  //           case "2":
  //             var confirmPopup = $ionicPopup.confirm({
  //               title: "友情提示",
  //               template: item.appName + "需通过VPN访问，请确认是否安装VPN并连接成功!", //从服务端获取更新的内容
  //               cancelText: '取消',
  //               okText: '确定'
  //             });
  //
  //             confirmPopup.then(function (res) {
  //               if (res) {
  //                 $scope.getQyyUrl(item.appId, params);
  //               }
  //             });
  //
  //             break;
  //             //二维码应用
  //           case "3":
  //
  //             if (item.appId === "237") {
  //               $state.go("projectPart",{
  //                 id:item.appId
  //               });
  //             }
  //             break;
  //
  //           default:
  //             $scope.getQyyUrl(item.appId, params);
  //             break;
  //
  //         }
  //       }
  //     });
  //
  //
  // })


    .controller('projectPartCtrl', function ($scope, $state,$toastutils,$http,$formalurlapi,$SPUtils,$stateParams) {

      //通过接口得到访问应用的url
      $scope.getQyyUrl=function (appId,params,optionId) {
        //点击应用图标时调用getapplink的接口获取跳转的url
        // 数据源请求
        $SPUtils.getLoginInfo(function (succ) {
          var userID = succ.user.id;
          var imCode = succ.mepId;
          $http({
            method: 'post',
            timeout: 5000,
            url: $formalurlapi.getBaseUrl(),//开发环境
            // url: "http://immobile.r93535.com:8088/crbim/imApi/1.0",//正式环境
            data: {
              "Action": "GetAppLink",
              "id": userID,
              "mepId": imCode,
              "platform": "I",
              "appId": appId,
              "params": params,
              "optionId":optionId
            }
          }).success(function (data) {


            var data = JSON.parse(decodeURIComponent(data));
            $scope.chooseBrowser(data.url, appId);

          }).error(function (err) {

          });
        },function (error) {

        });
      }


      //pubilc：选择调用谷歌还是其他浏览器
      $scope.chooseBrowser = function (url,appId) {

        var ref = cordova.InAppBrowser.open(url, '_blank','location=no,closebuttoncaption=返回');

        //进行统计埋点
        cordova.plugins.CordovaPluginIMAPI.POST($formalurlapi.getBaseUrl(),
            {
              'Action':'OperateLog',
              'id':userID,
              'mepId':imCode,
              'type':'AppVisit',
              'platform':'I',
              'appId':appId,
              'when':Date.parse(new Date())
            },
            function (success) {

            },
            function (error) {

            });
      }
      //搜索
      $scope.searchQRcode=function () {
        $scope.getQyyUrl($stateParams.id, null,'1');
      }

      //扫一扫
      $scope.scanQRcode=function () {

        cordova.plugins.ScanCodeTool.scanAction(function (success) {
          if(success.indexOf('id') < 0 || success.indexOf('name') < 0 || success.indexOf('type') < 0){
            $toastutils.showToast("请扫描工程部位的二维码！","0");
            return;

          }
          var result = JSON.parse(success);
          var resArr=Object.keys(result);
          if(resArr.length===3){
            params=success;
            $scope.getQyyUrl($stateParams.id, params,'0');

          }else {
            $toastutils.showToast("请扫描工程部位的二维码！","0");
          }

        },function (error) {
          $toastutils.showToast("请扫描工程部位的二维码！","0");
        });

      }

      //返回
      $scope.goBackPortal=function () {
        $state.go('tab.portal');
      }

    })


  //rxy 详情的控制器
  .controller('OhterCtrl', function ($scope, $state, $stateParams, $sce, FinshedApp) {
    var str;
    $scope.appurl = $sce.trustAsResourceUrl("http://198.25.1.21:8080/gatewayh/base/security/userinfo!loginForBaseHtml.action?sessionid=2d3d3a72-68d0-4a67-9e61-ae195ac9cded");
    $scope.appName = FinshedApp.get($stateParams.appId).appName;


    $scope.goBack = function () {
      // window.history.back();
      $state.go("tab.portal");
    }

  });





/*
 * Created by Administrator on 2017/3/24.
 */
angular.module('portal.controllers', [])
  .controller('portalCtrl2', function ($scope,$mqtt,NetData,$http,$ToastUtils,$api,$pubionicloading) {
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
          // url: "http://imtest.crbim.win:8080/apiman-gateway/jishitong/interface/1.0?apikey=b8d7adfb-7f2c-47fb-bac3-eaaa1bdd9d16",//开发环境
          url: "http://immobile.r93535.com:8088/crbim/imApi/1.0",//正式环境
          data: {"Action": "GetAppList", "id": userID, "mepId": imCode,"platform":"A"}
        }).success(function (data, status) {
          // 数据源赋值
          $scope.dataSource = JSON.parse(decodeURIComponent(data)); // 请求回来的数据源 json格式
          console.log("所有数据:"+JSON.stringify($scope.dataSource));
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
            $scope.focusIndex ;
            $scope.allData =[] ;
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
                  $scope.appIconArr.push( appIcon );
                  $scope.clickData.push($scope.focusIndex);

                }else {
                  $scope.appIconArr.push(appIcon+'_f');
                }
              }
            }

            // 给点亮图标添加点击事件
            for( var num=0;num< $scope.clickData.length;num++){
              var index = $scope.clickData[num];
              getConsole(index);
            }
            // 定义点亮图标的点击事件
            function getConsole(index){
              protalAppsCol12s[index].onclick = function() {
                logoClick($scope.allData[index]);
              };
            }

            // 调插件，获取所有的图片路径
            $api.downloadQYYIcon($scope.appIconArr ,function (success) {
              for (var i=0;i<success.length;i++){
                imgObjs[i].src = success[i];
                // $scope.allData[i].imgSrc = success[i];
                // 通过便利，修改数据源
                // for(var m=0;m<$scope.sysmenu.length;m++){
                //   var items =  $scope.sysmenu[m].items;
                //   for(var n=0;n<items.length;n++){
                //     // 通过 m  和 n 计算出每个图标在所有图标中的位置
                //     $scope.logoIndex = 0;
                //     if (m === 0 ){
                //       $scope.logoIndex = n;
                //     }else if (  m > 0){
                //       for (var k=0;k<m;k++){
                //         $scope.logoIndex += $scope.sysmenu[k].items.length ;
                //       }
                //       $scope.logoIndex = $scope.logoIndex + n;
                //     }
                //     // alert( "每个图标在所有图标中的位置：" + $scope.logoIndex );
                //
                //   }
                // }
                // alert("数据源的所有的数据item111111: " + JSON.stringify($scope.allData));
              }

            },function (err) {

            });

            // alert("数据源的所有的数据item长度: " + $scope.allData.length);
            // alert("数据源的所有的数据item22222: " + JSON.stringify($scope.allData));

          });
        }).error(function (data, status) {
          $ToastUtils.showToast("获取用户权限失败!");
        });
      }, function (err) {
      })
    }, function (err) {
    });

    //pubilc：选择调用谷歌还是其他浏览器
    $scope.chooseBrowser = function (testUrl,appId) {
      cordova.plugins.browsertab.isAvailable(function (result) {
        if (!result) {
          var ref = cordova.InAppBrowser.open(testUrl, '_blank','hidden = no,location= no');
          ref.addEventListener('loadstart', function () {
            $pubionicloading.showloading('','正在加载...');
          });
          ref.addEventListener('loadstop', function () {
            $pubionicloading.hide();
          });
        } else {
          cordova.plugins.browsertab.openUrl(
            testUrl,
            function (successResp) {
            }, function (failureResp) {
            });
        }
        //进行统计埋点
        $api.sendOperateLog("AppVisit", new Date().getTime(), appId, function (succ) {
        }, function (err) {
        })
      }, function (isAvailableError) {
      });
    }

    //通过接口得到访问应用的url
    $scope.getQyyUrl=function (appId,params) {
      //点击应用图标时调用getapplink的接口获取跳转的url
      $http({
        method: 'post',
        timeout: 5000,
        // url: "http://imtest.crbim.win:8080/apiman-gateway/jishitong/interface/1.0?apikey=b8d7adfb-7f2c-47fb-bac3-eaaa1bdd9d16",//开发环境
        url: "http://immobile.r93535.com:8088/crbim/imApi/1.0",//正式环境
        data: {"Action": "GetAppLink", "id": userID, "mepId": imCode,"platform":"A","appId":appId,"params":params}
      }).success(function (data) {
        var data =JSON.parse(decodeURIComponent(data));
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
        //普通外部应用(url带参数访问,例：物资设备)
        case "11":
          //物资设备包名：com.mengyou.myplatforms
          //物资设备action名：hideicon.yy
          /**
           * 先获取物资设备的访问的url
           * 再调用插件判断该应用是否存在，并进行相应的下载及跳转
           */
          $http({
            method: 'post',
            timeout: 5000,
            // url: "http://imtest.crbim.win:8080/apiman-gateway/jishitong/interface/1.0?apikey=b8d7adfb-7f2c-47fb-bac3-eaaa1bdd9d16",//开发环境
            url: "http://immobile.r93535.com:8088/crbim/imApi/1.0",//正式环境
            data: {
              "Action": "GetAppLink",
              "id": userID,
              "mepId": imCode,
              "platform": "A",
              "appId": item.appId,
              "params": params
            }
          }).success(function (data) {
            var data = JSON.parse(decodeURIComponent(data));
            cordova.plugins.OAIntegration.getApk(item.signId, item.appId, item.appName, data.url, function (succ) {
              //进行统计埋点
              $api.sendOperateLog("AppVisit", new Date().getTime(), item.appId, function (succ) {
              }, function (err) {
              })
            }, function (err) {
            });
          }).error(function (err) {

          });
          break;
        //特殊外部应用（android原生集成，例：公文处理）
        case "12":
          // alert("公文处理");
          //oa包名：com.r93535.oa
          //爱加密包名：com.thundersec.encwechat
          cordova.plugins.OAIntegration.getApk(item.signId, item.appId, item.appName, '', function (succ) {
            //进行统计埋点
            $api.sendOperateLog("AppVisit", new Date().getTime(), item.appId, function (succ) {
              // alert("埋点成功" + succ);
            }, function (err) {
            })
          }, function (err) {
          });
          break;
        //VPN应用
        case "2":
          alert("vpn应用");
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
          //判断该应用图标是否是“工程部位”，若是则通过二维码扫描拿到入参并赋值给params
          if (item.appId === "237") {
            cordova.plugins.barcodeScanner.scan(function (success) {
                if (success.text.indexOf("id") >= 0 && success.text.indexOf("name") >= 0 && success.text.indexOf("type") >= 0) {
                  params = success.text;
                  $scope.getQyyUrl(item.appId, params);
                } else {
                  $ToastUtils.showToast("请扫描工程部位的二维码！");
                }
              }, function (err) {
                $ToastUtils.showToast("请扫描工程部位的二维码！");
              }, {
                preferFrontCamera: false, // iOS and Android
                showFlipCameraButton: true, // iOS and Android
                showTorchButton: true, // iOS and Android 显示开起手电筒的按钮
                torchOn: false, // Android, launch with the torch switched on (if available) 启动手电筒开启（如果有）
                saveHistory: false,//保存扫描历史（默认为false）
                prompt: "请将二维码放在扫描框中", // Android 提示信息
                resultDisplayDuration: 500, // Android, 显示X ms的扫描文本。0完全禁止它，默认为1500
                formats: "QR_CODE,PDF_417", // 默认值：除PDF_417和RSS_EXPANDED之外的所有
                orientation: "portrait" // 仅Android（纵向|横向），默认未设置，因此它随设备旋转   portrait|landscape
              }
            );
          }
          break;
      }
    }
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





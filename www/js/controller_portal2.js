/*
 * Created by Administrator on 2017/3/24.
 */
angular.module('portal.controllers', [])
  .controller('portalCtrl2', function ($scope,$state,$mqtt,NetData,$http,$ToastUtils,$api,$pubionicloading,$rootScope,$ionicPopup,$greendao,$timeout,$formalurlapi) {

    // 门户页原始数据源
    $scope.dataSource = $rootScope.portalDataSource;
    $scope.sysmenu = $scope.dataSource.sysmenu;
    $scope.imgs =new Array();

    // 存放所有的item对象
    $scope.allData=[];
    // 轻应用logo图片地址数组

    $scope.appIcon = $rootScope.appIconPaths;
    $scope.logoLength = $scope.appIcon.length;


    // 门户页面数据请求
    var userID; // userID = 232099
    var imCode; //  imCode = 866469025308438
    $mqtt.getUserInfo(function (succ) {
      userID = succ.userID;
      //获取人员所在部门，点亮图标
      $mqtt.getImcode(function (imcode) {
        NetData.getInfo(userID, imcode);
        imCode = imcode;
      })
    })

    // 公司名称显示。没有数据时,默认显示门户
    if ($scope.dataSource.jsdept.name === "" || $scope.dataSource.jsdept.name === null || $scope.dataSource.jsdept.name === undefined) {
      $scope.name = "门户";
    }else {
      $scope.name = $scope.dataSource.jsdept.name;
    }
    angular.element(document).ready(function(){
      // 获取所有的图片标签

      $scope.imgs = document.getElementsByClassName("portalImg");

      $scope.protalAppsCol12s = document.getElementsByClassName("protalAppsCol12");
      // 存放点亮图标的数组
      $scope.clickData=[];
      // 给 src 赋值
      for (var i=0;i<$scope.appIcon.length;i++){
        if (  $scope.imgs.length > $scope.logoLength) {

          $scope.imgs[ $scope.logoLength + i].src = $scope.appIcon[i];
        }else {
          $scope.imgs[i].src =  $scope.appIcon[i];
        }
      }
      for(var i=0;i<$scope.sysmenu.length;i++){
        // 获取每一组的元素
        var items =  $scope.sysmenu[i].items;
        for(var j=0;j<items.length;j++){
          $scope.allData.push(items[j]);
        }
      }
      // 获取点亮图标的下标,并添加点击事件
      for(var i=0;i<$scope.sysmenu.length;i++){
        // 获取每一组的元素
        var items =  $scope.sysmenu[i].items;
        for(var j=0;j<items.length;j++){
          var flag = items[j].flag;
          if(flag){
            $scope.focusIndex=0;
            if (i === 0 ){
              $scope.focusIndex = j;
            }else if (  i > 0){
              for (var k=0;k<i;k++){
                $scope.focusIndex += $scope.sysmenu[k].items.length ;
              }
              $scope.focusIndex = $scope.focusIndex + j;
            }
            $scope.clickData.push( $scope.focusIndex );
          }
        }
      }

      // 给点亮图标添加点击事件
      for( var num=0;num< $scope.clickData.length;num++){

        lightItemClickE($scope.clickData[num]);
      }
      // 定义点亮图标的点击事件
      function lightItemClickE(index){

        if($scope.protalAppsCol12s.length >  $scope.logoLength){

          $scope.protalAppsCol12s[ $scope.logoLength+index].onclick = function() {

            logoClick( $scope.allData[index]);
          };
        }else {
          $scope.protalAppsCol12s[index].onclick = function() {

            logoClick( $scope.allData[index]);
          };
        }

      }
    });
    //pubilc：选择调用谷歌还是其他浏览器
    $scope.chooseBrowser = function (testUrl,appId) {
      cordova.plugins.browsertab.isAvailable(function (result) {
        if (!result) {
          var ref = cordova.InAppBrowser.open(testUrl, '_blank','hardwareback=yes,clearsessioncache=yes,clearcache=yse');
          var index = 0;
          ref.addEventListener('loadstart', function () {
            if (index > 0) {
              return;
            }
            index = 1;
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
        // url:"http://88.1.1.22:8081",//测试环境
        // url: "http://imtest.crbim.win:8080/apiman-gateway/jishitong/interface/1.0?apikey=b8d7adfb-7f2c-47fb-bac3-eaaa1bdd9d16",//开发环境
        // url: "http://immobile.r93535.com:8088/crbim/imApi/1.0",//正式环境
        url:$formalurlapi.getBaseUrl(),
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
          console.log("点击的item"+item.appName+item.appId);
          $http({
            method: 'post',
            timeout: 5000,
            // url:"http://88.1.1.22:8081",//测试环境
            // url: "http://imtest.crbim.win:8080/apiman-gateway/jishitong/interface/1.0?apikey=b8d7adfb-7f2c-47fb-bac3-eaaa1bdd9d16",//开发环境
            // url: "http://immobile.r93535.com:8088/crbim/imApi/1.0",//正式环境
            url:$formalurlapi.getBaseUrl(),
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
          //oa包名：com.r93535.oa
          //爱加密包名：com.thundersec.encwechat
          cordova.plugins.OAIntegration.getApk(item.signId, item.appId, item.appName, '', function (succ) {
            //进行统计埋点
            $api.sendOperateLog("AppVisit", new Date().getTime(), item.appId, function (succ) {
            }, function (err) {
            })
          }, function (err) {
          });
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
          //判断该应用图标是否是“工程部位”，若是则通过二维码扫描拿到入参并赋值给params
          if (item.appId === "237") {
            $state.go('projectPart',{
              "appId":item.appId,
              "imCode":imCode,
              "userId":userID
            });
          }
          break;
      }
    }


    /**
     * 监听通知消息
     */
    $scope.$on('allnotify.update', function (event, data) {
      $scope.$apply(function () {
        $greendao.queryData('NewNotifyListService', 'where IS_READ =?', "0", function (msg) {
          $scope.NotifyNoRead = 0;
          if (msg.length > 0) {
            $scope.NotifyNoRead = $scope.NotifyNoRead + msg.length;
            $mqtt.saveInt("badgeNotifyCount",$scope.NotifyNoRead);
          }
        }, function (err) {
        });
        $timeout(function () {
        }, 100);
      });
    })

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        $greendao.queryByConditions('ChatListService', function (data) {
          $chatarr.setData(data);
          $scope.items = data;
        }, function (err) {

        });
        $timeout(function () {
        }, 100);
      })
    });
  })

  .controller('projectPartCtrl', function ($scope,$api,$formalurlapi,$pubionicloading,$state,$ToastUtils,$http,$stateParams) {

    angular.element(document).ready(function () {
      var imCode = $stateParams.imCode;
      var userID = $stateParams.userId;

      //通过接口得到访问应用的url
      $scope.getSingleQyyUrl=function (appId,params,optionId) {
        //点击应用图标时调用getapplink的接口获取跳转的url
          $http({
            method: 'post',
            timeout: 5000,
            // url:"http://88.1.1.22:8081",//测试环境
            // url: "http://imtest.crbim.win:8080/apiman-gateway/jishitong/interface/1.0?apikey=b8d7adfb-7f2c-47fb-bac3-eaaa1bdd9d16",//开发环境
            // url: "http://immobile.r93535.com:8088/crbim/imApi/1.0",//正式环境
            url:$formalurlapi.getBaseUrl(),
            data: {
              "Action": "GetAppLink",
              "id": userID,
              "mepId": imCode,
              "platform": "A",
              "appId": appId,
              "params": params,
              "optionId":optionId
            }
          }).success(function (data) {
            var data = JSON.parse(decodeURIComponent(data));
            $scope.chooseSingleBrowser(data.url, appId);

          }).error(function (err) {

          });
      }

      //pubilc：选择调用谷歌还是其他浏览器
      $scope.chooseSingleBrowser = function (testUrl,appId) {
        cordova.plugins.browsertab.isAvailable(function (result) {
          if (!result) {
            var ref = cordova.InAppBrowser.open(testUrl, '_blank','hardwareback=yes,clearsessioncache=yes,clearcache=yse');
            var index = 0;
            ref.addEventListener('loadstart', function () {
              if (index > 0) {
                return;
              }
              index = 1;
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
      };

      //搜索
      $scope.searchQRcode=function () {
        searchQRcode();
      };

      //扫一扫
      $scope.scanQRcode=function () {

        scanQRcode();
        // // $scope.getSingleQyyUrl($stateParams.appId, null,'1');
        // cordova.plugins.barcodeScanner.scan(function (success) {
        //     if (success.text.indexOf("id") >= 0 && success.text.indexOf("name") >= 0 && success.text.indexOf("type") >= 0) {
        //       params = success.text;
        //       $scope.getSingleQyyUrl($stateParams.appId, params,'0');
        //     } else {
        //       $ToastUtils.showToast("请扫描工程部位的二维码！");
        //     }
        //   }, function (err) {
        //     $ToastUtils.showToast("请扫描工程部位的二维码！");
        //   }, {
        //     preferFrontCamera: false, // iOS and Android
        //     showFlipCameraButton: true, // iOS and Android
        //     showTorchButton: true, // iOS and Android 显示开起手电筒的按钮
        //     torchOn: false, // Android, launch with the torch switched on (if available) 启动手电筒开启（如果有）
        //     saveHistory: false,//保存扫描历史（默认为false）
        //     prompt: "请将二维码放在扫描框中", // Android 提示信息
        //     resultDisplayDuration: 500, // Android, 显示X ms的扫描文本。0完全禁止它，默认为1500
        //     formats: "QR_CODE,PDF_417", // 默认值：除PDF_417和RSS_EXPANDED之外的所有
        //     orientation: "portrait" // 仅Android（纵向|横向），默认未设置，因此它随设备旋转   portrait|landscape
        //   }
        // );
      };

      //返回
      $scope.goBackPortal=function () {
        $state.go('tab.portal');
      };

      // 获取操作对象
      var oWrap = document.getElementsByClassName("projectPartWrap")[0];
      var oBox = document.getElementsByClassName("projectPartBox")[0];

      var x;
      var y;

      // 绑定点击事件
      $scope.click1 =  function (e) {
        // 点击效果
        eeee(oWrap,e);

        //  跳转搜索页
        var time = window.setTimeout(function(){
          searchQRcode();
          $(oBox).empty();
        },300);

      };


      $scope.click2 =  function (e) {
        // 点击效果
        eeee(oBox,e);

        // 1s后清空当前对象的span标签
        var time = window.setTimeout(function(){
          scanQRcode();
          $(oBox).empty();
        },300);
      };

      function eeee(obj,e) {
        var e=e||event;
        $(obj).empty();
        var spanEle = document.createElement("span");
        spanEle.setAttribute("class","animateSpan");
        obj.appendChild(spanEle);
        x= e.pageX-obj.offsetLeft-parseInt($(obj).find("span").css("width"))/2;
        y= e.pageY-obj.offsetTop-parseInt($(obj).find("span").css("height"))/2-180;

        $(obj).find("span").css("left",x+"px");
        $(obj).find("span").css("top",y+"px");
        $(obj).find("span").addClass("animate");

        // 300ms后清空当前对象的span标签
        var time = window.setTimeout(function(){
          $(obj).empty();
        },300);
      }

      // 扫一扫跳转
      function scanQRcode() {
        cordova.plugins.barcodeScanner.scan(function (success) {
            if (success.text.indexOf("id") >= 0 && success.text.indexOf("name") >= 0 && success.text.indexOf("type") >= 0) {
              params = success.text;
              $scope.getSingleQyyUrl($stateParams.appId, params,'0');
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

      function searchQRcode() {
        $scope.getSingleQyyUrl($stateParams.appId, null,'1');
      }

    });
  });


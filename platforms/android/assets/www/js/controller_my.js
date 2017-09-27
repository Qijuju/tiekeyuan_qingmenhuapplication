/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('my.controllers', ['angular-openweathermap', 'ngSanitize', 'ui.bootstrap', 'ngCordova'])

  .controller('AccountCtrl', function ($scope, $state, $ionicPopup,$pubionicloading, $http, $contacts, $cordovaCamera, $ionicActionSheet, $phonepluin, $api, $searchdata, $ToastUtils, $rootScope, $timeout, $mqtt, $chatarr, $greendao) {

    /*// alert("我的页面");
    alert("$rootScope.rootUserId ---- " + $rootScope.rootUserId  );
    $mqtt.getUserInfo(function (msg) {

      // alert( " 我的页面 - 获取用户信息 -- " + msg ) ;

      $scope.UserID = msg.userID;
      $scope.DeptID=msg.deptID;

      $scope.mymypersonname = msg.userName;

      if ($scope.mymypersonname.length > 2) {
        $scope.jiename = $scope.mymypersonname.substring(($scope.mymypersonname.length - 2), $scope.mymypersonname.length);

      } else {
        $scope.jiename = $scope.mymypersonname;
      }

      // 获取用户头像信息
      $api.getHeadPic($scope.UserID, "60", function (srcurl) {
        $scope.picyoumeiyou = true;
        $scope.$apply(function () {
          $scope.securlpic = srcurl;
          $rootScope.securlpicaaa = srcurl;
        })
      }, function (error) {
        $scope.picyoumeiyou = false;
      })

    }, function (msg) {
    });*/

    // “我的”页面

    $scope.$on('$ionicView.enter', function () {

      $mqtt.getUserInfo(function (msg) {

        $scope.UserID = msg.userID;
        $scope.DeptID=msg.deptID;

        $scope.mymypersonname = msg.userName;

        if ($scope.mymypersonname.length > 2) {
          $scope.jiename = $scope.mymypersonname.substring(($scope.mymypersonname.length - 2), $scope.mymypersonname.length);

        } else {
          $scope.jiename = $scope.mymypersonname;
        }

        // 获取用户头像信息
        $api.getHeadPic($scope.UserID, "60", function (srcurl) {
          $scope.picyoumeiyou = true;
          $scope.$apply(function () {
            $scope.securlpic = srcurl;
            $rootScope.securlpicaaa = srcurl;
          })
        }, function (error) {
          $scope.picyoumeiyou = false;
        })

      }, function (msg) {
      });

    })


    var isAndroid = ionic.Platform.isAndroid();
    $scope.name = "";


    var lat = "";
    var long = "";
    var locationaaa = "";
    //获取定位的经纬度
    var posOptions = {timeout: 10000, enableHighAccuracy: false};

    document.addEventListener('deviceready', function () {
      //判断是否有兼职账号
      $mqtt.hasParttimeAccount(function (msg) {//有兼职账号，显示按钮
        $scope.hasParttimeAccount = true;
      }, function (err) {                       //没有兼职账号，不显示按钮
        $scope.hasParttimeAccount = false;
      });

      //查看用户的当前所在地理位置及pm值及天气
      navigator.geolocation.getCurrentPosition(function (position) {
        lat = position.coords.latitude + 0.006954;//   116.329102,39.952728,
        long = position.coords.longitude + 0.012647;//  116.329102
        locationaaa = long + "," + lat;
        $http.get("http://api.map.baidu.com/telematics/v3/weather?location=" + locationaaa + "&output=json&ak=MLNi9vTMbPzdVrgBGXPVOd91lW05QmBY&mcode=E9:68:71:4C:B1:A4:DA:23:CD:2E:C2:1B:0E:19:A0:54:6F:C7:5E:D0;com.ionicframework.im366077")
          .success(function (response) {
            // alert("天气预报"+JSON.stringify(response));
            $scope.pm25aa = "pm2.5:" + response.results[0].pm25;
            $scope.currentcity = response.results[0].currentCity;
            $scope.weathdate = response.results[0].weather_data[0].date.substring(response.results[0].weather_data[0].date.length - 4, response.results[0].weather_data[0].date.length - 1);
            $scope.weatherzhen = response.results[0].weather_data[0].weather;

          });
      }, function (err) {
        // $ToastUtils.showToast("请开启定位功能");
      });


    });


    $scope.gomyinformation = function () {
      $state.go("myinformation", {
        "UserIDfor": $scope.UserID
      });
    }

    $scope.goSwitchAccount = function () {
      $state.go("switch_account");
    }

    $scope.goacountsettion = function () {
      $state.go("accountsettion", {
        "UserIDset": $scope.UserID
      });
    }

    $scope.goFounction = function () {
      $state.go("founction");
    }



    //文件群发
    $scope.goMessFile=function () {
      $greendao.deleteAllData('SelectIdService',function (data) {
        // alert('数据被清空了')
      },function (err) {

      });
      var selectInfo={};
      //当创建群聊的时候先把登录的id和信息  存到数据库上面
      selectInfo.id=$scope.UserID;
      selectInfo.name=$scope.mymypersonname;
      selectInfo.grade="0";
      selectInfo.isselected=true;
      selectInfo.type='user';
      selectInfo.parentid=$scope.DeptID;
      $greendao.saveObj('SelectIdService',selectInfo,function (msg) {

      },function (err) {

      })

      $state.go('addnewpersonfirst',{
        "createtype":'single',
        "groupid":'0',
        "groupname":'',
        "functiontag":'file'
      });
    }


    $scope.goaboutus = function () {
      $state.go("aboutours", {
        "UserIDabout": $scope.UserID
      });
    }
    $scope.setpic = function (name) {
      // 显示操作表
      $ionicActionSheet.show({
        buttons: [
          {text: '拍照上传'},
          {text: '选择相册'}
        ],
        titleText: '上传头像',
        cancelText: '取消',
        buttonClicked: function (index) {
          if (index == 0) {
            $scope.takePhoto();
          } else {
            $scope.selectphoto();
          }
          return true;
        }

      });
    }

    //拍照片
    $scope.takePhoto = function () {
      var options = {
        //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
        quality: 100,                                            //相片质量0-100
        destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
        sourceType: Camera.PictureSourceType.CAMERA,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库  sourceType: Camera.PictureSourceType.CAMERA,
        // allowEdit: true,                                        //在选择之前允许修改截图
        // encodingType: Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
        targetWidth: 1080,                                        //照片宽度
        targetHeight: 1920,                                       //照片高度
        // mediaType: 0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
        // cameraDirection: 0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
        // popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,                                   //保存进手机相册
        correctOrientation: true
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        $pubionicloading.showloading('','Loading...');
        var picPath = imageData;
        if (isAndroid) {
          picPath = imageData.substring(0, (imageData.indexOf('?') != -1 ? imageData.indexOf('?') : imageData.length));
        }
        $api.setHeadPic(picPath, function (msg) {
          $timeout(function () {
            $scope.$apply(function () {
              $scope.picyoumeiyou = true;
              $scope.securlpic = msg;
              // alert($scope.picyoumeiyou)
            })
            $pubionicloading.hide();
          });

        }, function (msg) {
          $ToastUtils.showToast("设置头像失败")
        });
      }, function (err) {
        // error
        $ToastUtils.showToast("取消");
      });

    };
    //选相册
    $scope.selectphoto = function () {
      var options = {
        quality: 100,
        // targetWidth: 320,
        // targetHeight: 320,
        // saveToPhotoAlbum: false,
        // //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
        // quality: 100,                                            //相片质量0-100
        destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库  sourceType: Camera.PictureSourceType.CAMERA,
        // allowEdit: false,                                       //在选择之前允许修改截图
        // encodingType: Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
        targetWidth: 1080,                                        //照片宽度
        targetHeight: 1920,                                       //照片高度
        // mediaType: 0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
        // cameraDirection: 0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
        // popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,                                   //保存进手机相册
        correctOrientation: true
      };
      $cordovaCamera.getPicture(options).then(function (imageData) {

        $pubionicloading.showloading('','Loading...');
        var picPath = imageData;
        if (isAndroid) {
          picPath = imageData.substring(0, (imageData.indexOf('?') != -1 ? imageData.indexOf('?') : imageData.length));
        }

        $api.setHeadPic(picPath, function (msg) {
          // alert(msg)

          $timeout(function () {

            $scope.$apply(function () {
              $scope.picyoumeiyou = true;
              $scope.securlpic = msg;

            })
            $pubionicloading.hide();
          });
        }, function (msg) {
          $ToastUtils.showToast("设置头像失败")
        });
      }, function (err) {
        // error
        $ToastUtils.showToast("取消");
      });

    };
    // 一个确认对话框
    $scope.showConfirm = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: '<strong>注销用户?</strong>',
        template: '你确定要退出当前用户吗?',
        okText: '确定',
        cancelText: '取消'
      });
      confirmPopup.then(function (res) {
        if (res) {

          $mqtt.getMqtt().save('name', '', function (message) {
            $mqtt.disconnect(function (message) {
              $mqtt.save('passlogin', "0");
              $state.go("login");
            }, function (message) {
              $ToastUtils.showToast(message);
            });
          }, function (message) {
            $ToastUtils.showToast(message);
          });
        } else {
        }
      });
    };

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        //alert("进来单聊界面吗？我是那个啥最后一个模块");
        $greendao.queryByConditions('ChatListService', function (data) {
          $chatarr.setData(data);
          $scope.items = data;
          // alert("数组的长度"+data.length);
        }, function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

    //监听网络状态的变化
    $scope.$on('netstatus.update', function (event) {
      $scope.$apply(function () {
        $rootScope.isConnect=$rootScope.netStatus;
      })
    });


  })

  .controller('myinformationCtrl', function ($scope, $http, $state, $stateParams, $searchdatadianji, $ionicPopup, $api, $ToastUtils, $cordovaGeolocation, $location, $ionicPlatform, $ionicHistory, $pubionicloading, $mqtt, $ionicActionSheet, $timeout, $cordovaCamera, $ionicScrollDelegate,$formalurlapi) {


    var viewScroll = $ionicScrollDelegate.$getByHandle('myinformationScroll');
    $scope.$on('$ionicView.enter', function () {
      viewScroll.scrollBottom();
    });
    var isAndroid = ionic.Platform.isAndroid();
    $scope.UserIDforhou = $stateParams.UserIDfor;
    $api.getHeadPic($scope.UserIDforhou, "60", function (srcurl) {
      $scope.picyoumeiyou = true;
      $scope.$apply(function () {
        $scope.securlpic = srcurl;
      })
    }, function (error) {
      $scope.picyoumeiyou = false;
    })


    $scope.setpic = function (name) {
      // 显示操作表
      $ionicActionSheet.show({
        buttons: [
          {text: '拍照上传'},
          {text: '选择相册'}
        ],
        titleText: '上传头像',
        cancelText: '取消',
        buttonClicked: function (index) {
          if (index == 0) {
            $scope.takePhoto();
          } else {
            $scope.selectphoto();
          }
          return true;
        }

      });
    }
    //拍照片
    $scope.takePhoto = function () {
      var options = {
        //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
        quality: 100,                                            //相片质量0-100
        destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
        sourceType: Camera.PictureSourceType.CAMERA,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库  sourceType: Camera.PictureSourceType.CAMERA,
        // allowEdit: true,                                        //在选择之前允许修改截图
        // encodingType: Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
        targetWidth: 1080,                                        //照片宽度
        targetHeight: 1920,                                       //照片高度
        // mediaType: 0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
        // cameraDirection: 0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
        // popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,                                   //保存进手机相册
        correctOrientation: true
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        $pubionicloading.showloading('','Loading...');

        var picPath = imageData;
        if (isAndroid) {
          picPath = imageData.substring(0, (imageData.indexOf('?') != -1 ? imageData.indexOf('?') : imageData.length));
        }

        $api.setHeadPic(picPath, function (msg) {
          $timeout(function () {
            $scope.$apply(function () {
              $scope.picyoumeiyou = true;
              $scope.securlpic = msg;
              // alert($scope.picyoumeiyou)
            })
            $pubionicloading.hide();
          });

        }, function (msg) {
          $ToastUtils.showToast("设置头像失败")
        });
      }, function (err) {
        // error
        $ToastUtils.showToast("取消");
      });

    };
//选相册
    $scope.selectphoto = function () {
      var options = {
        quality: 100,
        // targetWidth: 320,
        // targetHeight: 320,
        // saveToPhotoAlbum: false,
        // //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
        // quality: 100,                                            //相片质量0-100
        destinationType: Camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库  sourceType: Camera.PictureSourceType.CAMERA,
        // allowEdit: false,                                       //在选择之前允许修改截图
        // encodingType: Camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
        targetWidth: 1080,                                        //照片宽度
        targetHeight: 1920,                                       //照片高度
        // mediaType: 0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
        // cameraDirection: 0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
        // popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,                                   //保存进手机相册
        correctOrientation: true
      };
      $cordovaCamera.getPicture(options).then(function (imageData) {
        $pubionicloading.showloading('','Loading...');

        var picPath = imageData;
        if (isAndroid) {
          picPath = imageData.substring(0, (imageData.indexOf('?') != -1 ? imageData.indexOf('?') : imageData.length));
        }

        $api.setHeadPic(picPath, function (msg) {
          // alert(msg)
          $timeout(function () {
            $scope.$apply(function () {
              $scope.picyoumeiyou = true;
              $scope.securlpic = msg;
            })
            $pubionicloading.hide();
          });
        }, function (msg) {
          $ToastUtils.showToast("设置头像失败")
        });
      }, function (err) {
        $ToastUtils.showToast("取消");
      });

    };

    var backButtonPressedOnceToExit = false;

    $ionicPlatform.registerBackButtonAction(function (e) {
      if ($location.path() == ('/myinformation/' + $scope.UserIDforhou)) {
        if (isopen) {
          myPopup.close();
          isopen = false;
        } else {
          $state.go("tab.account");
        }
      } else if ($location.path() == '/tab/account' || $location.path() == '/tab/notification' || $location.path() == '/tab/contacts' || $location.path() == '/login' || $location.path() == '/tab/webpage') {
        if (backButtonPressedOnceToExit) {
          $mqtt.setExitStartedStatus();
          ionic.Platform.exitApp();
        } else {
          backButtonPressedOnceToExit = true;
          $ToastUtils.showToast('再按一次退出系统');
          setTimeout(function () {
            backButtonPressedOnceToExit = false;
          }, 1500);
        }
      } else {
        $ionicHistory.goBack();
        $pubionicloading.hide();
      }
      e.preventDefault();
      return false;


    }, 501)

    $scope.goAcount = function () {
      $state.go("tab.account");
    }
    $searchdatadianji.personDetaildianji($scope.UserIDforhou)

    $scope.$on('person.dianji', function (event) {
      $scope.$apply(function () {
        $scope.mypersons = $searchdatadianji.getPersonDetaildianji();
      })
    });

    // 修改个人资料
    var myPopup;
    var isopen = false;

    //验证格式是否正确
    function isMB(str) {
      var re = /^1\d{10}$/
      if (re.test(str)) {
        return true;
      } else {
        return false;
      }
    }

    function isFP(str){
      var re = /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/;
      if(re.test(str)){
        return true;
      } else {
        return false;
      }
    }

    function isEM(str){
      var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
      if(re.test(str)){
        return true;
      } else {
        return false;
      }
    }


    $scope.updateinformation = function () {
      isopen = true;
      $scope.data = {};
      myPopup = $ionicPopup.show({
        template: ' <label class="item item-input">&nbsp;&nbsp;<i class="icon  ion-ios-unlocked-outline positive positive"></i><input type="number" placeholder="修改手机号" ng-model="data.phonea"></label> <label class="item item-input">&nbsp;&nbsp;<i class="icon  ion-ios-unlocked-outline positive positive"></i><input type="number" placeholder="修改办公电话" ng-model="data.phoneb"></label> <label class="item item-input">&nbsp;&nbsp;<i class="icon  ion-ios-unlocked-outline positive positive"></i><input type="email" placeholder="修改邮箱" ng-model="data.email"></label>',
        title: '修改个人资料',
        subTitle: '请至少修改一项内容，否则无法提交',
        scope: $scope,
        buttons: [
          {text: '取消'},
          {
            text: '<b>确定</b>',
            type: 'button-positive',
            onTap: function (e) {

              var arr = {};
              var string1 = "";
              var string2 = "";
              var string3 = "";
              var phoneflag='false';

              if ($scope.data.phonea != ""&&$scope.data.phonea!=null) {
                string1 = $scope.data.phonea;
                if(isMB(string1)){
                  arr.MB = string1;
                  phoneflag='true';
                }else{
                  $ToastUtils.showToast("请输入正确的手机号！");
                  return;
                }
              }
              if ($scope.data.phoneb != ""&&$scope.data.phoneb!=null) {
                string2 = $scope.data.phoneb;
                if(isFP(string2)){
                  arr.FP = string2;
                }else{
                  $ToastUtils.showToast("请输入正确的电话！");
                  return;
                }
              }
              if ($scope.data.email != "" && $scope.data.email!=null) {
                string3 = $scope.data.email;
                if(isEM(string3)){
                  arr.EM = string3;
                }else{
                  $ToastUtils.showToast("请输入正确的Email！");
                  return;
                }

              }

              if(phoneflag === 'true'){
                $mqtt.getUserInfo(function (userinfo) {
                  $http({
                    method: 'post',
                    url: $formalurlapi.getBaseUrl(),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: {
                      Action: 'SendSecretText',
                      id:userinfo.userID,
                      mepId:window.device.uuid,
                      funcCode: "ModifyMobile",
                      mobile:arr
                    }
                  }).success(function (succ) {
                    $searchdatadianji.personDetaildianji($scope.UserIDforhou);
                  }).error(function (err) {
                  });
                },function (err) {
                });
              }else{
                $api.updateUserInfo(arr, function (msg) {
                  // $ToastUtils.showToast("修改个人资料成功");
                  $searchdatadianji.personDetaildianji($scope.UserIDforhou);
                }, function (msg) {
                  $ToastUtils.showToast(msg)
                })
              }
            }
          }
        ]
      });
      myPopup.then(function (res) {
        isopen = false;
      });

    };
    //地理位置
    //获取定位的经纬度
    navigator.geolocation.getCurrentPosition(function (position) {
     var lat = position.coords.latitude + 0.006954;//   116.329102,39.952728,
     var long = position.coords.longitude + 0.012647;//  116.329102
     var locationaaa = lat + "," +long;
      $http.get("http://api.map.baidu.com/geocoder/v2/?location=" + locationaaa + "&output=json&ak=MLNi9vTMbPzdVrgBGXPVOd91lW05QmBY&mcode=E9:68:71:4C:B1:A4:DA:23:CD:2E:C2:1B:0E:19:A0:54:6F:C7:5E:D0;com.ionicframework.im366077")
        .success(function (response) {
          // console.log("天气预报"+JSON.stringify(response));
          $scope.geolocation = response.result.formatted_address;
        });
    }, function (err) {
      // $ToastUtils.showToast("请开启定位功能");
    });

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService', function (data) {
          $scope.items = data;
          // alert("数组的长度"+data.length);
        }, function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });
  })

  .controller('switchAccountCtrl', function ($scope, $state, $mqtt,$pubionicloading,$ToastUtils, $api) {

    $scope.accountItems = [];

    $mqtt.getUserInfo(function (succuess) {
      // alert(succuess.userID + "----" + succuess.deptName + "----" + succuess.rootName);
      $scope.accountItems[0] = {
        userID:succuess.userID,
        deptName:succuess.deptName,
        rootName:succuess.rootName
      };
      var subUserInfo = succuess.viceUser;
      // alert(JSON.stringify(succuess));
      var count = 1;
      for (var i = 0; i < subUserInfo.length; i++) {
        var key = subUserInfo[i];
        $scope.accountItems[count++] = {
          userID:key.userID,
          deptName:key.deptName,
          rootName:key.rootName
        };
      }
    }, function (err) {

    });

    /**
     * 切换账号（切换为兼职账号或主账号，本次切换只对当前登录有效，一旦重新登录，重新登录主账号）
     * @param userID
     */
    $scope.switchAccount = function (userID) {
      $pubionicloading.showloading('','Loading...');
      //切换账号开始
      $mqtt.switchAccount(userID, function (msg) {
        if (msg === "-1") {
          $ToastUtils.showToast("无需切换当前账号！", null, null)
          $pubionicloading.hide();
          return;
        }
        //切换账号成功，启动MQTT
        $mqtt.getMqtt().getMyTopic(function (msg) {
          $api.getAllGroupIds(function (groups) {
            if (msg != null && msg != '') {
              $mqtt.startMqttChat(msg + ',' + groups);
              $mqtt.setLogin(true);
              $state.go('tab.message');
              $pubionicloading.hide();
              return;
            }
          },function (err) {
            $ToastUtils.showToast(err)
          });
        }, function (msg) {
          $pubionicloading.hide();
          $ToastUtils.showToast("切换账号出现异常！")
        });
      }, function (err) {//切换账号失败
        $pubionicloading.hide();
        $ToastUtils.showToast(err)
      });

    };
    $scope.goAcount = function () {
      $state.go("tab.account");
    }
  })


  .controller('accountsettionCtrl', function ($scope, $http, $state, $stateParams, $api, $ionicPopup, $mqtt, $ToastUtils, $cordovaBarcodeScanner, $location, $ionicPlatform, $ionicHistory, $pubionicloading,$greendao) {


    $scope.UserIDsethou = $stateParams.UserIDset;

    var backButtonPressedOnceToExit = false;

    $ionicPlatform.registerBackButtonAction(function (e) {
      if ($location.path() == ('/accountsettion/' + $scope.UserIDsethou)) {
        if (isopen) {
          myPopup.close();
          isopen = false;
        } else {
          $state.go("tab.account");
        }
      } else if ($location.path() == '/tab/account' || $location.path() == '/tab/notification' || $location.path() == '/tab/contacts' || $location.path() == '/login' || $location.path() == '/tab/webpage') {
        if (backButtonPressedOnceToExit) {
          $mqtt.setExitStartedStatus();
          ionic.Platform.exitApp();
        } else {
          backButtonPressedOnceToExit = true;
          $ToastUtils.showToast('再按一次退出系统');
          setTimeout(function () {
            backButtonPressedOnceToExit = false;
          }, 1500);
        }
      } else {
        $ionicHistory.goBack();
        $pubionicloading.hide();
      }
      e.preventDefault();
      return false;


    }, 501)


    $scope.cunzai = 0;
    //初始化页面，第一次输入旧密码
    $mqtt.getUserInfo(function (msg) {

      $scope.UserID = msg.userID;
      $greendao.queryData('GesturePwdService','where id=?',$scope.UserID ,function (data) {
        if (data[0].pwd == "" || data[0].pwd == null || data[0].pwd == 0 || data[0].pwd == undefined) {
          $scope.cunzai = 0;
        } else {
          $scope.cunzai = 1;
        }

      },function (err) {
        $scope.cunzai = 0;
      });
    }, function (msg) {
    });

    $scope.meizuo = function () {
      $ToastUtils.showToast("此功能暂未开发");
    }
    $scope.goAcount = function () {
      $state.go("tab.account");
    }
    // 修改密码
    var myPopup;
    var isopen = false;
    $scope.showPopup = function () {
      isopen = true;
      $scope.data = {}
      myPopup = $ionicPopup.show({
        template: ' <label class="item item-input"><i class="icon  ion-ios-unlocked-outline positive positive"></i><input type="password" placeholder="请输入原密码" ng-model="data.oldpassword"></label> <label class="item item-input"><i class="icon  ion-ios-unlocked-outline positive positive"></i><input type="password" placeholder="请输入新密码" ng-model="data.newpassword"></label> <label class="item item-input"><i class="icon  ion-ios-unlocked-outline positive positive"></i><input type="password" placeholder="请确认新密码" ng-model="data.enterpassword"></label>',
        title: '修改密码',
        subTitle: '区分大小写，请认真填写',
        scope: $scope,
        buttons: [
          {text: '取消'},
          {
            text: '<b>确定</b>',
            type: 'button-positive',
            onTap: function (e) {
              //       $ToastUtils.showToast("老密码:"+$scope.data.oldpassword+"新密码:"+$scope.data.newpassword+"确认密码:"+$scope.data.enterpassword);
              if ($scope.data.newpassword == "" || $scope.data.newpassword == undefined || $scope.data.newpassword.length == 0) {
                $ToastUtils.showToast("密码不能为空")
              } else {
                $api.updatePwd($scope.data.oldpassword, $scope.data.newpassword, $scope.data.enterpassword, function (msg) {
                  $ToastUtils.showToast("修改密码成功")
                  $mqtt.save('passlogin', "2");
                  $mqtt.save('pwdgesture', $scope.data.newpassword);
                  $mqtt.save('remPwd', $scope.data.newpassword);
                  $mqtt.save('pwd', $scope.data.newpassword);
                }, function (msg) {
                  // $ToastUtils.showToast("222")
                  $ToastUtils.showToast(msg);
                })
              }
            }
          },
        ]
      });
      myPopup.then(function (res) {
        isopen = false;

      });

    };
    //扫一扫
    $scope.scanCode = function () {
      $cordovaBarcodeScanner.scan().then(function (imageData) {
      }, function (error) {
      });
    };
    $scope.goGesturepassword = function () {
      $state.go("gesturepassword");
    }
    $scope.goSetGesturepassword = function () {
      $state.go("updategespassword");
    }

  })

  // 关于
  .controller('aboutoursCtrl', function ($scope, $http, $state, $stateParams, $ToastUtils, $mqtt, $api, $ionicPopup, $pubionicloading, $cordovaFileOpener2, $rootScope) {
    $scope.UserIDabouthou = $stateParams.UserIDabout;
    $scope.goAcount = function () {
      $state.go("tab.account");
    }

    //关于我们
    $scope.goAboutOur = function () {
      $state.go("aboutOur");
    }

    //关于平台
    $scope.goAboutPlatform = function () {
      $state.go("aboutPlatform");
    }

    //关于推荐
    $scope.goAboutRecommend = function () {
      $state.go("aboutRecommend");
    }

    //在线升级
    $scope.zaixianshengji = function () {
      $mqtt.save('local_versionname', '');
      $scope.isFromMy=true;
      $api.checkUpdate($ionicPopup, $cordovaFileOpener2,$scope.isFromMy);
    }

  })

  .controller('gesturepasswordCtrl', function ($scope, $http, $state, $stateParams, $mqtt, $ToastUtils, $timeout, $rootScope,$greendao) {

    mqtt.getString('name', function (loginpagea) {
      $scope.yonghuming=loginpagea;
    }, function (msg) {
      // $ToastUtils.showToast("还未设置手势密码");
    });

    $mqtt.getUserInfo(function (msg) {
      $scope.UserID = msg.userID;
      $scope.mymypersonname = msg.userName
    }, function (msg) {
    });
    $scope.goSetting = function () {
      $state.go("accountsettion", {
        "UserIDset": $scope.UserID
      });
    }
    //设置密码
    var method = function () {
      $scope.$apply(function () {
        $scope.a = 1
      });
      var setopt = {
        chooseType: 3, // 3 , 4 , 5,
        width: 350, // lock wrap width
        height: 350, // lock wrap height
        container: 'element', // the id attribute of element
        inputEnd: function (psw) {
          // alert(psw)
          password = psw;
          $scope.$apply(function () {
            $scope.a = 2
          })
          // $ToastUtils.showToast("请再输入一次")
          setlock.reset();
          var checkopt = {
            chooseType: 3, // 3 , 4 , 5,
            width: 350, // lock wrap width
            height: 350, // lock wrap height
            container: 'element', // the id attribute of element
            inputEnd: function (psw) {
              // alert(psw)
              if (psw == password) {
                checklock.drawStatusPoint('right')
                // $mqtt.save('gesturePwd', psw);//存
                $mqtt.save('userNamea', $scope.mymypersonname);
                $mqtt.save('loginpage', "gesturelogin");
                $mqtt.save('securlpicaa', $rootScope.securlpicaaa);
                $mqtt.save('UserIDaaa', $scope.UserID);//存
                // $mqtt.getMqtt().getString();//取
                //存库
                var gestureobj={};
                gestureobj.id=$scope.UserID;
                gestureobj.username= $scope.yonghuming;
                gestureobj.pwd=psw;
                $greendao.saveObj('GesturePwdService',gestureobj,function (data) {

                  $ToastUtils.showToast("密码设置成功")
                },function (err) {
                  alert(err)
                });






                $state.go("accountsettion", {
                  "UserIDset": $scope.UserID
                });
                $scope.$apply(function () {
                  $scope.a = 3
                })
                $timeout(function () {
                  checklock.reset()

                }, 300);
              } else {
                checklock.drawStatusPoint('notright')
                $ToastUtils.showToast("两次输入不一样,密码设置失败,请重新输入")
                $timeout(function () {
                  checklock.reset();
                  method();
                }, 300);

              }
            }
          };
          var checklock = new H5lock(checkopt);
          checklock.init();
        }
      }
      var setlock = new H5lock(setopt);
      setlock.init();
    }
    $scope.a = 1;
    var setopt = {
      chooseType: 3, // 3 , 4 , 5,
      width: 350, // lock wrap width
      height: 350, // lock wrap height
      container: 'element', // the id attribute of element
      inputEnd: function (psw) {

        // alert(psw)
        password = psw;
        $scope.$apply(function () {
          $scope.a = 2
        })
        // $ToastUtils.showToast("请再输入一次")
        setlock.reset();
        var checkopt = {
          chooseType: 3, // 3 , 4 , 5,
          width: 350, // lock wrap width
          height: 350, // lock wrap height
          container: 'element', // the id attribute of element
          inputEnd: function (psw) {
            // alert(psw)
            if (psw == password) {
              checklock.drawStatusPoint('right')
              // $mqtt.save('gesturePwd', psw);//存
              $mqtt.save('userNamea', $scope.mymypersonname);
              $mqtt.save('loginpage', "gesturelogin");
              $mqtt.save('securlpicaa', $rootScope.securlpicaaa);
              $mqtt.save('UserIDaaa', $scope.UserID);//存
              //存库
              var gestureobj={};
              gestureobj.id=$scope.UserID;
              gestureobj.username= $scope.yonghuming;
              gestureobj.pwd=psw;


              $greendao.saveObj('GesturePwdService',gestureobj,function (data) {
                $ToastUtils.showToast("密码设置成功")
              },function (err) {
              });


              $state.go("accountsettion", {
                "UserIDset": $scope.UserID
              });
              $scope.$apply(function () {
                $scope.a = 3
              })
              $timeout(function () {
                checklock.reset()
              }, 300);
            } else {
              checklock.drawStatusPoint('notright')
              $ToastUtils.showToast("两次输入不一样,密码设置失败,请重新输入")
              $timeout(function () {
                checklock.reset();
                method();
              }, 300);
            }
          }
        };
        var checklock = new H5lock(checkopt);
        checklock.init();
      }
    }
    var setlock = new H5lock(setopt);
    setlock.init();


    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService', function (data) {
          $scope.items = data;
          // alert("数组的长度"+data.length);
        }, function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });


  })

  .controller('updategespasswordCtrl', function ($scope, $http, $state, $stateParams, $mqtt, $ToastUtils, $timeout, $rootScope,$greendao) {

    mqtt.getString('name', function (loginpagea) {
      // alert(loginpagea)
      $scope.yonghuming=loginpagea;
    }, function (msg) {
      // $ToastUtils.showToast("还未设置手势密码");
    });
    $mqtt.getUserInfo(function (msg) {
      $scope.UserID = msg.userID;
      $scope.mymypersonname = msg.userName
       // alert($scope.UserID)
      $greendao.queryData('GesturePwdService','where id=?',$scope.UserID ,function (data) {
        password=data[0].pwd
      },function (err) {
      });
    }, function (msg) {
    });

    $scope.a = 1;
    var password = "";
    $scope.count = 6;
    $scope.goSetting = function () {
      $state.go("accountsettion", {
        "UserIDset": $scope.UserID
      });
    }



    var firstopt2 = {
      chooseType: 3,
      width: 400,
      height: 400,
      container: 'element',
      inputEnd: function (psw) {
        if (psw == password) {
          firstlock2.drawStatusPoint('right');
          $ToastUtils.showToast("输入密码正确,请输入新密码");
          $timeout(function () {
            firstlock2.reset();
          }, 300);
          $scope.$apply(function () {
            $scope.a = 2
          });
          newmethod()
        } else {
          firstlock2.drawStatusPoint('notright');
          $ToastUtils.showToast("输入错误，请再输入一次,还能输入" + (--$scope.count) + "次");
          method();
          $timeout(function () {
            firstlock2.reset();
            method();
          }, 300);
        }
      }
    }
    var firstlock2 = new H5lock(firstopt2);
    firstlock2.init();
    //旧密码输入错误情况跳入的方法
    var method = function () {
      if ($scope.count == 0) {
        var gestureobj={};
        gestureobj.id=$scope.UserID;
        gestureobj.username= $scope.mymypersonname;
        gestureobj.pwd="";
        $greendao.saveObj('GesturePwdService',gestureobj,function (data) {
          // $ToastUtils.showToast("密码修改成功")
        },function (err) {
        });
        $state.go("login");
      } else {
        $scope.$apply(function () {
          $scope.a = 0
        });
        var checkoldopt = {
          chooseType: 3,
          width: 400,
          height: 400,
          container: 'element',
          inputEnd: function (psw) {
            if (psw == password) {
              checkoldlock.drawStatusPoint('right');
              $ToastUtils.showToast("输入密码正确,请输入新密码");
              $timeout(function () {
                checkoldlock.reset();
              }, 300);
              $scope.$apply(function () {
                $scope.a = 2
              });
              newmethod()
            } else {
              checkoldlock.drawStatusPoint('notright');
              $ToastUtils.showToast("输入错误，请再输入一次,还能输入" + (--$scope.count) + "次");
              method();
              $timeout(function () {
                checkoldlock.reset();
                method();
              }, 300);
            }
          }
        }
        var checkoldlock = new H5lock(checkoldopt);
        checkoldlock.init();
      }
    }


    var newmethod = function () {
      var setopt = {
        chooseType: 3, // 3 , 4 , 5,
        width: 400, // lock wrap width
        height: 400, // lock wrap height
        container: 'element', // the id attribute of element
        inputEnd: function (psw) {
          // alert(psw)
          password = psw;
          $scope.$apply(function () {
            $scope.a = 3
          })
          $ToastUtils.showToast("请再输入一次")
          setlock.reset();

          var checkopt = {
            chooseType: 3, // 3 , 4 , 5,
            width: 400, // lock wrap width
            height: 400, // lock wrap height
            container: 'element', // the id attribute of element
            inputEnd: function (psw) {
              // alert(psw)
              if (psw == password) {
                checklock.drawStatusPoint('right')
                // $mqtt.save('gesturePwd', psw);//存
                $mqtt.save('userNamea', $scope.mymypersonname);
                // $mqtt.save('securlpicaa', $rootScope.securlpicaaa);
                $mqtt.save('UserIDaaa', $scope.UserID);//存

                //存库
                var gestureobj={};
                gestureobj.id=$scope.UserID;
                gestureobj.username= $scope.yonghuming;
                gestureobj.pwd=psw;
                $greendao.saveObj('GesturePwdService',gestureobj,function (data) {
                  $ToastUtils.showToast("密码修改成功")
                },function (err) {
                });
                $state.go("accountsettion", {
                  "UserIDset": $scope.UserID
                });
                $scope.$apply(function () {
                  $scope.a = 4
                })
                $timeout(function () {
                  checklock.reset()
                }, 300);
              } else {
                checklock.drawStatusPoint('notright')
                $ToastUtils.showToast("两次输入不一样,密码设置失败,请重新输入")
                $scope.$apply(function () {
                  $scope.a = 2
                })
                $timeout(function () {
                  checklock.reset();
                  newmethod();
                }, 300);
              }
            }
          };
          var checklock = new H5lock(checkopt);
          checklock.init();
        }
      }
      var setlock = new H5lock(setopt);
      setlock.init();
    }

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService', function (data) {
          $scope.items = data;
          // alert("数组的长度"+data.length);
        }, function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

  })

  .controller('webpageCtrl', function ($scope, $stateParams, Indicators, Projects, Count, $location, $ionicPlatform, $pubionicloading, $ionicHistory, $ToastUtils, $mqtt, $timeout, $http) {
    $ionicPlatform.registerBackButtonAction(function (e) {
      if ($location.path() == ('/tab/webpage')) {
        window.close();
      } else if ($location.path() == '/tab/account' || $location.path() == '/tab/notification' || $location.path() == '/tab/contacts' || $location.path() == '/login') {
        if (backButtonPressedOnceToExit) {
          $mqtt.setExitStartedStatus();
          ionic.Platform.exitApp();
        } else {
          backButtonPressedOnceToExit = true;
          $ToastUtils.showToast('再按一次退出系统');
          setTimeout(function () {
            backButtonPressedOnceToExit = false;
          }, 1500);
        }
      } else {
        $ionicHistory.goBack();
        $pubionicloading.hide();
      }
      e.preventDefault();
      return false;
    }, 501)

    $scope.indicators = Indicators.all();

    $scope.indicatorId = Indicators.getId($stateParams.indicatorId);


    $scope.projects = Projects.all();

    $scope.counts = Count.all();


    $scope.openUrl = function () {
      window.open('http://61.237.239.152:8080/html5/src/gouzhuwu.html', 'newwindow', 'height=200,width=200,top=100,left=50,toolbar=no,menubar=no,scrollbars=no,location=no,status=no')
      window.resizeTo(200, 200)
      window.moveTo(50, 50)
      alert(window.outerHeight)
    }
    $scope.openUrlchenjiang = function () {
      window.open("http://immobile.r93535.com:8081/ddzh/index.html", "_self", "location=no")

    }
    $scope.openUrlbanchang = function () {
      window.open("http://immobile.r93535.com:8081/sgtsh/index.html", "_self", "location=no")

    }
  })

  // 关于我们
  .controller('aboutOurCtrl',function ($scope,$state) {

    // 返回操作调取函数
    $scope.goAboutOurs = function () {
      $state.go("aboutours");
    }
  })

  // 关于平台
  .controller('aboutPlatformCtrl',function ($scope,$state) {
    // 返回操作调取函数
    $scope.goAboutOurs = function () {
      $state.go("aboutours");
    }
  })

  // 关于推荐
  .controller('aboutRecommendCtrl',function ($scope,$state) {
    // 返回操作调取函数
    $scope.goAboutOurs = function () {
      $state.go("aboutours");
    }
  })

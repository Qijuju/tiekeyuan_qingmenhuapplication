/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('my.controllers', ['angular-openweathermap', 'ngSanitize', 'ui.bootstrap','ngCordova'])
  .controller('AccountCtrl', function ($scope, $state, $ionicPopup, $ionicLoading, $http, $contacts, $cordovaCamera, $ionicActionSheet, $phonepluin, $api,$searchdata,$ToastUtils,$rootScope,$timeout,$mqtt,$chatarr,$greendao,$cordovaImagePicker,$ionicPlatform,$location,$cordovaGeolocation,$stateParams) {
    var isAndroid = ionic.Platform.isAndroid();
    $scope.name = "";
    $mqtt.getUserInfo(function (msg) {
      $scope.UserID = msg.userID
      $scope.mymypersonname=msg.userName
      if ($scope.mymypersonname.length>2){
        $scope.jiename=$scope.mymypersonname.substring(($scope.mymypersonname.length-2),$scope.mymypersonname.length);
      }else {
        $scope.jiename=$scope.mymypersonname;
      }

      $api.getHeadPic($scope.UserID,"60",function (srcurl) {
        $scope.picyoumeiyou=true;
        // alert(srcurl)
        $scope.$apply(function () {
          $scope.securlpic=srcurl;
        })
        // $scope.$apply(function () {
        //   document.getElementById('myImage').src=srcurl;
        // })
      },function (error) {
        $scope.picyoumeiyou=false;
        // alert("没有")
      })

    }, function (msg) {
      // $ToastUtils.showToast(msg)
    });

    var lat="";
    var long="";
    var locationaaa="";
    //获取定位的经纬度
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    // alert("进来了")
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
      lat  = position.coords.latitude+0.006954;//   39.952728
      long = position.coords.longitude+0.012647;//  116.329102
      locationaaa=long+","+lat;
      $http.get("http://api.map.baidu.com/telematics/v3/weather?location="+locationaaa+"&output=json&ak=MLNi9vTMbPzdVrgBGXPVOd91lW05QmBY&mcode=E9:68:71:4C:B1:A4:DA:23:CD:2E:C2:1B:0E:19:A0:54:6F:C7:5E:D0;com.ionicframework.im366077")
        .success(function(response) {
          $scope.pm25aa="pm2.5 : "+response.results[0].pm25;
          $scope.currentcity=response.results[0].currentCity;
          $scope.weathdate=response.results[0].weather_data[0].date.substring(11,response.results[0].weather_data[0].date.length-1);
          $scope.weatherzhen=response.results[0].weather_data[0].weather;

        });
    }, function(err) {
      $ToastUtils.showToast("请开启定位功能");
    });



    // $ionicPlatform.registerBackButtonAction(function(e) {
    //   if ($location.path() == '/account'){
    //     showConfirm();
    //   }
    // }, 501);

    // $searchdata.personDetail($rootScope.rootUserId);
    // $scope.$on('person.update', function (event) {
    //   $scope.$apply(function () {
    //     $scope.mymypersonname = $searchdata.getPersonDetail().user.UserName;
    //
    //   })
    // });



    // $api.getUser($rootScope.rootUserId,function (msg) {
    //   $scope.mymypersonname=msg.user.UserName;
    //   $ToastUtils.showToast( $scope.mymypersonname)
    //   if ($scope.mymypersonname.length>2){
    //     $scope.jiename=$scope.mymypersonname.substring(($scope.mymypersonname.length-2),$scope.mymypersonname.length);
    //   }else {
    //     $scope.jiename=$scope.mymypersonname
    //   }
    //   $ToastUtils.showToast($scope.jiename)
    // },function (msg) {
    //   $ToastUtils.showToast(msg)
    // });



    $scope.gomyinformation = function () {
      $state.go("myinformation", {
        "UserIDfor": $scope.UserID
        // "youmeiyou":$scope.youmeiyou,
      });
    }

    $scope.goacountsettion = function () {
      $state.go("accountsettion", {
        "UserIDset": $scope.UserID
        // "youmeiyou":$scope.youmeiyou,
      });
    }
    $scope.goaboutus = function () {
      $state.go("aboutours", {
        "UserIDabout": $scope.UserID
        // "youmeiyou":$scope.youmeiyou,
      });
    }
    // var isAndroid = ionic.Platform.isAndroid();
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
    // $scope.setpic=function () {
    //   // $ToastUtils.showToast("劲了");
    //   Camera.getPicture(PictureSourceType.CAMERA).then(
    //
    //     //返回一个imageURI，记录了照片的路径
    //     function (imageURI) {
    //       $ToastUtils.showToast(imageURI)
    //     },
    //     function (err) {
    //     });
    //
    // }

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

        // alert(imageData)
        // alert(imageData);
        // $ToastUtils.showToast(imageData);
        // var image = document.getElementById('myImage');
        // image.src=imageData;
        //image.src = "data:image/jpeg;base64," + imageData;
        // if(isAndroid){
        var picPath = imageData;
        if(isAndroid){
          picPath = imageData.substring(0, (imageData.indexOf('?') != -1 ? imageData.indexOf('?') : imageData.length));
        }
        // if(picPath.indexOf("file:///")==0){
        //   picPath=picPath.substring(7,picPath.length)
        // }
        // alert(picPath)
        //
        // alert(picPath);
        // }
        $api.setHeadPic(picPath, function (msg) {

          // alert(msg)
          $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 100,
            showDelay: 0
          });
          $timeout(function () {
            $scope.$apply(function () {
              $scope.picyoumeiyou=true;
              $scope.securlpic=msg;
              // alert($scope.picyoumeiyou)
            })
            $ionicLoading.hide();
          });

          // $ToastUtils.showToast("成功")
          // $api.getHeadPic($scope.UserID,"60",function (srcurl) {
          //   alert(srcurl)
          //   $scope.$apply(function () {
          //     $scope.securlpic=srcurl;
          //   })
          // },function (error) {
          //   alert("没拿到")
          // })
        }, function (msg) {
          $ToastUtils.showToast("设置头像失败")
        });
      }, function (err) {
        // error
        $ToastUtils.showToast(err);
      });

    };
    // //image picker
    // $scope.selectphoto = function() {
    //   var options = {
    //     maximumImagesCount: 1,
    //     // width: 800,
    //     // height: 800,
    //     quality: 100
    //   };
    //
    //   $cordovaImagePicker.getPictures(options)
    //     .then(function (results) {
    //       // $scope.images_list.push(results[0]);
    //       $api.setHeadPic(results[0], function (msg) {
    //               // $ToastUtils.showToast("成功")
    //             }, function (msg) {
    //               $ToastUtils.showToast("失败")
    //             });
    //     }, function (error) {
    //       // error getting photos
    //     });
    // }
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



        // image.src = "data:image/jpeg;base64," + imageData;
        // alert(imageData);

        // if(isAndroid){
        var picPath = imageData;
        if(isAndroid){
          picPath = imageData.substring(0, (imageData.indexOf('?') != -1 ? imageData.indexOf('?') : imageData.length));
        }

        // if(picPath.indexOf("file:///")==0){
        //   picPath=picPath.substring(7,picPath.length)
        // }
        // alert(picPath)
        // $scope.$apply(function () {
        //   $scope.securlpic=picPath;
        // })
        // alert(picPath)
        // }
        $api.setHeadPic(picPath, function (msg) {
          // alert(msg)
          $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 100,
            showDelay: 0
          });
          $timeout(function () {

            $scope.$apply(function () {
              $scope.picyoumeiyou=true;
              $scope.securlpic=msg;

            })
            $ionicLoading.hide();
          });
          // $scope.$apply(function () {
          //
          // })
          // $api.getHeadPic($scope.UserID,"60",function (srcurl) {
          //   alert(srcurl)
          //
          //   $scope.$apply(function () {
          //     $scope.securlpic=srcurl;
          //   })
          // },function (error) {
          //   alert("没拿到")
          // })
          // $ToastUtils.showToast("成功")
        }, function (msg) {
          $ToastUtils.showToast("设置头像失败")
        });
        // var image = document.getElementById('myImage');
        // image.src=imageData;
        //image.src = "data:image/jpeg;base64," + imageData;
      }, function (err) {
        // error
        $ToastUtils.showToast(err);
      });

    };


    // document.addEventListener('deviceready', function () {
    //   $mqtt.getMqtt().getString('name', function (message) {
    //     if (message != null && message != '') {
    //       $scope.name = message;
    //
    //
    //     }
    //   }, function (message) {
    //     $ToastUtils.showToast(message);
    //   });
    // });
    // $scope.name="";
    /*$scope.fetch = function() {
     $cordovaPreferences.fetch('name')
     .success(function(value) {
     if(value != null && value != ''){
     $scope.name=value;
     }
     })
     .error(function(error) {
     })
     };*/
    // $scope.fetch();
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
          // $ToastUtils.showToast('不确定');
          // $ToastUtils.showToast("退出登录失败")
        }
      });
    };

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });


  })

  .controller('myinformationCtrl', function ($scope, $http, $state, $stateParams, $searchdatadianji,$ionicPopup,$api,$ToastUtils,$cordovaGeolocation) {

    // $scope.$on('$ionicView.leave', function () {
    //   if(isopen){
    //     myPopup.close();
    //   }
    //
    // });

    $scope.UserIDforhou = $stateParams.UserIDfor;
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
    // var isopen=false;
    var myPopup;
    $scope.updateinformation = function () {
      // isopen=true;
      $scope.data = {};
       myPopup = $ionicPopup.show({
        template: ' <label class="item item-input"><i class="icon  ion-ios-unlocked-outline positive positive"></i><input type="number" placeholder="修改手机号" ng-model="data.phonea"></label> <label class="item item-input"><i class="icon  ion-ios-unlocked-outline positive positive"></i><input type="number" placeholder="修改办公电话" ng-model="data.phoneb"></label> <label class="item item-input"><i class="icon  ion-ios-unlocked-outline positive positive"></i><input type="email" placeholder="修改邮箱" ng-model="data.email"></label>',
        title: '修改个人资料',
        subTitle: '请至少修改一项内容，否则无法提交',
        scope: $scope,
        buttons: [
          {text: '取消'},
          {
            text: '<b>确定</b>',
            type: 'button-positive',
            onTap: function (e) {
             // $ToastUtils.showToast("老密码:"+$scope.data.phonea+"新密码:"+$scope.data.phoneb+"确认密码:"+$scope.data.email);

              var arr={};
              /*var arr={
                'Mobile':$scope.data.phonea,
                'FixPhone':$scope.data.phoneb,
                'Email':$scope.data.email
              };*/
              var string1="";
              var string2="";
              var string3="";
              if ($scope.data.phonea!=""){
                string1=$scope.data.phonea;
                arr.MB = string1;
              }
              if($scope.data.phoneb!=""){
                string2=$scope.data.phoneb;
                arr.FP = string2;
              }
              if($scope.data.email!=""){
                string3=$scope.data.email;
                arr.EM = string3;
              }
              $api.updateUserInfo(arr,function (msg) {
                $ToastUtils.showToast("修改个人资料成功");
                $searchdatadianji.personDetaildianji($scope.UserIDforhou);
              },function (msg) {
                $ToastUtils.showToast(msg)
              })
            }
          }
        ]
      });
      myPopup.then(function (res) {
          // isopen=false;
      });

      // myPopup.close(); //关闭
    };
    //地理位置
    //获取定位的经纬度
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
      var lat  = position.coords.latitude+0.006954;//   39.952728
      var long = position.coords.longitude+0.012647;//  116.329102
      // $ToastUtils.showToast("经度"+lat+"纬度"+long);
      // var map = new BMap.Map("container"); // 创建地图实例
      // var point = new BMap.Point(long, lat); // 创建点坐标
      // map.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别
      // map.addControl(new BMap.NavigationControl());
      // map.addControl(new BMap.NavigationControl());
      // map.addControl(new BMap.ScaleControl());
      // map.addControl(new BMap.OverviewMapControl());
      // map.addControl(new BMap.MapTypeControl());
      // var marker = new BMap.Marker(point); // 创建标注
      // map.addOverlay(marker); // 将标注添加到地图中
      // marker.enableDragging();
      // marker.addEventListener("dragend", function(e){
      //   alert("当前位置：" + e.point.lng + ", " + e.point.lat);// 116.341951   39.959632
      // })

      // 创建地理编码实例
      var myGeo = new BMap.Geocoder();
      // 根据坐标得到地址描述
      myGeo.getLocation(new BMap.Point(long, lat), function(result){
        if (result){
          // alert(result.address);
          $scope.$apply(function () {
            $scope.geolocation=result.address;
          });
        }
      });

    }, function(err) {
      $ToastUtils.showToast("请开启定位功能");
      // error
    });


    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });
  })


  .controller('accountsettionCtrl', function ($scope, $http, $state, $stateParams, $api, $ionicPopup, $mqtt,$ToastUtils,$cordovaBarcodeScanner) {
    $scope.cunzai=0;
    //初始化页面，第一次输入旧密码
    $mqtt.getMqtt().getString('gesturePwd', function (pwd) {
      // alert(pwd);
      if(pwd==""||pwd==null||pwd.length==0||pwd==undefined){
        $scope.cunzai=0;
      }else {
        $scope.cunzai=1;
      }
      // $ToastUtils.showToast("旧手势密码:"+pwd);
    }, function (msg) {
      // $ToastUtils.showToast("旧手势密码获取失败"+msg);
      $scope.cunzai=0;
    });
    $scope.meizuo=function () {
      $ToastUtils.showToast("此功能暂未开发");
    }
    $scope.UserIDsethou = $stateParams.UserIDset;
    $scope.goAcount = function () {
      $state.go("tab.account");
    }
    // 修改密码
    $scope.showPopup = function () {
      $scope.data = {}
      var myPopup = $ionicPopup.show({
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
              if($scope.data.newpassword==""||$scope.data.newpassword==undefined||$scope.data.newpassword.length==0){
                $ToastUtils.showToast("密码不能为空")
              }else {
                $api.updatePwd($scope.data.oldpassword, $scope.data.newpassword, $scope.data.enterpassword, function (msg) {
                  $ToastUtils.showToast("修改密码成功")
                  $mqtt.save('passlogin', "2");
                  $mqtt.save('pwdgesture', $scope.data.newpassword);
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

      });
      // myPopup.close(); //关闭
    };
    // //在线升级
    // $scope.zaixianshengji = function () {
    //   $mqtt.save('install_cancel', 'false');
    //   $api.checkUpdate($ionicPopup, $ionicLoading, $cordovaFileOpener2, $mqtt);
    // }
    //扫一扫
    $scope.scanCode = function () {
      $cordovaBarcodeScanner.scan().then(function(imageData) {
        // $ToastUtils.showToast(imageData.text);
        // console.log("Barcode Format -> " + imageData.format);
        // console.log("Cancelled -> " + imageData.cancelled);
      }, function(error) {
        // $ToastUtils.showToast( error);
      });
    };
    $scope.goGesturepassword = function () {
      $state.go("gesturepassword");
    }
    $scope.goSetGesturepassword = function () {
      $state.go("updategespassword");
    }

  })
  .controller('aboutoursCtrl', function ($scope, $http, $state, $stateParams,$ToastUtils,$mqtt,$api,$ionicPopup,$ionicLoading,$cordovaFileOpener2) {
    $scope.UserIDabouthou = $stateParams.UserIDabout;
    $scope.goAcount = function () {
      $state.go("tab.account");
    }
    //在线升级
    $scope.zaixianshengji = function () {
      $mqtt.save('install_cancel', 'false');
      $api.checkUpdate($ionicPopup, $ionicLoading, $cordovaFileOpener2, $mqtt);
    }
  })
  .controller('gesturepasswordCtrl', function ($scope, $http, $state, $stateParams,$mqtt,$ToastUtils,$timeout,$rootScope) {
    $mqtt.getUserInfo(function (msg) {
      $scope.UserID = msg.userID;
      $scope.mymypersonname=msg.userName
    }, function (msg) {
    });
    $scope.goSetting = function () {
      $state.go("accountsettion", {
        "UserIDset": $scope.UserID
      });
    }
   // $scope.a=0;
    //初始化
    // var password="";
    // var opt = {
    //   chooseType: 3, // 3 , 4 , 5,
    //   width: 350, // lock wrap width
    //   height: 350, // lock wrap height
    //   container: 'element', // the id attribute of element
    //   inputEnd: function(psw){
    //   } // when draw end param is password string
    // }
    // var lock = new H5lock(opt);
    // lock.init();
    //设置密码
    // $scope.setpassword = function () {
    var method=function () {
      $scope.$apply(function () {
        $scope.a=1
      });
      var setopt = {
        chooseType: 3, // 3 , 4 , 5,
        width: 350, // lock wrap width
        height: 350, // lock wrap height
        container: 'element', // the id attribute of element
        inputEnd: function(psw){
          // alert(psw)
          password=psw;
          $scope.$apply(function () {
            $scope.a=2
          })
          $ToastUtils.showToast("请再输入一次")
          setlock.reset();
          var checkopt = {
            chooseType: 3, // 3 , 4 , 5,
            width: 350, // lock wrap width
            height: 350, // lock wrap height
            container: 'element', // the id attribute of element
            inputEnd: function(psw){
              // alert(psw)
              if (psw==password){
                checklock.drawStatusPoint('right')
                $mqtt.save('gesturePwd', psw);//存
                $mqtt.save('userNamea',  $scope.mymypersonname);
                $mqtt.save('loginpage', "gesturelogin");
                // $mqtt.getMqtt().getString();//取
                $ToastUtils.showToast("密码设置成功")
                $state.go("accountsettion", {
                  "UserIDset": $scope.UserID
                });
                $scope.$apply(function () {
                  $scope.a=3
                })
                $timeout(function () {
                  checklock.reset()

                },300);
              }else {
                checklock.drawStatusPoint('notright')
                $ToastUtils.showToast("两次输入不一样,密码设置失败,请重新输入")
                $timeout(function () {
                  checklock.reset();
                  method();
                },300);

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
      $scope.a=1;
      var setopt = {
        chooseType: 3, // 3 , 4 , 5,
        width: 350, // lock wrap width
        height: 350, // lock wrap height
        container: 'element', // the id attribute of element
        inputEnd: function(psw){

          // alert(psw)
          password=psw;
          $scope.$apply(function () {
            $scope.a=2
          })
          $ToastUtils.showToast("请再输入一次")
          setlock.reset();
          var checkopt = {
            chooseType: 3, // 3 , 4 , 5,
            width: 350, // lock wrap width
            height: 350, // lock wrap height
            container: 'element', // the id attribute of element
            inputEnd: function(psw){
              // alert(psw)
              if (psw==password){
                checklock.drawStatusPoint('right')
                $mqtt.save('gesturePwd', psw);//存
                $mqtt.save('userNamea',  $scope.mymypersonname);
                $mqtt.save('loginpage', "gesturelogin");
                $ToastUtils.showToast("密码设置成功")
                $state.go("accountsettion", {
                  "UserIDset": $scope.UserID
                });
                $scope.$apply(function () {
                  $scope.a=3
                })
                $timeout(function () {
                  checklock.reset()
                },300);
              }else {
                checklock.drawStatusPoint('notright')
                $ToastUtils.showToast("两次输入不一样,密码设置失败,请重新输入")
                $timeout(function () {
                  checklock.reset();
                  method();
                },300);
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
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });


  })

  .controller('updategespasswordCtrl', function ($scope, $http, $state, $stateParams,$mqtt,$ToastUtils,$timeout,$rootScope) {
    $scope.a=1;
    var password="";
    $scope.count=6;
    $mqtt.getUserInfo(function (msg) {
      $scope.UserID = msg.userID;
      $scope.mymypersonname=msg.userName
    }, function (msg) {
    });
    $scope.goSetting = function () {
      $state.go("accountsettion", {
        "UserIDset": $scope.UserID
      });
    }
    //初始化页面，第一次输入旧密码
    $mqtt.getMqtt().getString('gesturePwd', function (pwd) {
      password=pwd;
      // $ToastUtils.showToast("旧手势密码:"+pwd);
    }, function (msg) {
      // $ToastUtils.showToast("旧手势密码获取失败"+msg);
    });
    var firstopt2 = {
      chooseType: 3,
      width: 400,
      height: 400,
      container: 'element',
      inputEnd: function(psw){
        if(psw==password){
          firstlock2.drawStatusPoint('right');
          $ToastUtils.showToast("输入密码正确,请输入新密码");
          $timeout(function () {
            firstlock2.reset();
          },300);
          $scope.$apply(function () {
            $scope.a=2
          });
          newmethod()
        }else {
          firstlock2.drawStatusPoint('notright');
          $ToastUtils.showToast("输入错误，请再输入一次,还能输入"+(--$scope.count)+"次");
          method();
          $timeout(function () {
            firstlock2.reset();
            method();
          },300);
        }
      }
    }
    var firstlock2 = new H5lock(firstopt2);
    firstlock2.init();
    //旧密码输入错误情况跳入的方法
    var method=function () {
      if($scope.count==0){
        $mqtt.save('gesturePwd', "");//存
        $state.go("login");
      }else {
        $scope.$apply(function () {
          $scope.a=0
        });
        var checkoldopt = {
          chooseType: 3,
          width: 400,
          height: 400,
          container: 'element',
          inputEnd: function(psw){
            if(psw==password){
              checkoldlock.drawStatusPoint('right');
              $ToastUtils.showToast("输入密码正确,请输入新密码");
              $timeout(function () {
                checkoldlock.reset();
              },300);
              $scope.$apply(function () {
                $scope.a=2
              });
              newmethod()
            }else {
              checkoldlock.drawStatusPoint('notright');
              $ToastUtils.showToast("输入错误，请再输入一次,还能输入"+(--$scope.count)+"次");
              method();
              $timeout(function () {
                checkoldlock.reset();
                method();
              },300);
            }
          }
        }
        var checkoldlock = new H5lock(checkoldopt);
        checkoldlock.init();
      }
    }




    var newmethod=function () {
    var setopt = {
      chooseType: 3, // 3 , 4 , 5,
      width: 400, // lock wrap width
      height: 400, // lock wrap height
      container: 'element', // the id attribute of element
      inputEnd: function(psw){
        // alert(psw)
        password=psw;
        $scope.$apply(function () {
          $scope.a=3
        })
        $ToastUtils.showToast("请再输入一次")
        setlock.reset();

        var checkopt = {
          chooseType: 3, // 3 , 4 , 5,
          width: 400, // lock wrap width
          height: 400, // lock wrap height
          container: 'element', // the id attribute of element
          inputEnd: function(psw){
            // alert(psw)
            if (psw==password){
              checklock.drawStatusPoint('right')
              $mqtt.save('gesturePwd', psw);//存
              $mqtt.save('userNamea',  $scope.mymypersonname);
              $ToastUtils.showToast("密码修改成功")
              $state.go("accountsettion", {
                "UserIDset": $scope.UserID
              });
              $scope.$apply(function () {
                $scope.a=4
              })
              $timeout(function () {
                checklock.reset()
              },300);
            }else {
              checklock.drawStatusPoint('notright')
              $ToastUtils.showToast("两次输入不一样,密码设置失败,请重新输入")
              $scope.$apply(function () {
                $scope.a=2
              })
              $timeout(function () {
                checklock.reset();
                newmethod();
              },300);
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
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

  })

  .controller('webpageCtrl', function ($scope, $stateParams, Indicators, Projects, Count) {
    $scope.indicators = Indicators.all();

    $scope.indicatorId = Indicators.getId($stateParams.indicatorId);


    $scope.projects = Projects.all();

    $scope.counts = Count.all();



    $scope.openUrl=function(){
      //   if (!cordova.InAppBrowser) {
      //     return;
      //   }
      //   cordova.InAppBrowser.open('http://www.baidu.com', '_blank', 'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=关闭');
      window.open("http://172.25.26.77:8080/html5/src/gouzhuwu.html","_self","location=no")
    }

  })

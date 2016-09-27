/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('login.controllers', [])

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('LoginCtrl', function ($scope, $state, $ionicPopup, $ionicLoading, $cordovaFileOpener2, $http, $mqtt, $cordovaPreferences, $api, $rootScope,$ToastUtils) {


    $mqtt.setLogin(false);
    $scope.name = "";
    $scope.password = "";
    document.addEventListener('deviceready', function () {
      $mqtt.getMqtt().getString('historyusername', function (message) {
        $scope.name = message;
      });
      $mqtt.getMqtt().getString('remPwd', function (pwd) {
        $scope.remPwd = pwd;
        if (pwd === 'true') {
          $mqtt.getMqtt().getString('pwd', function (pwd) {
            $scope.password = pwd;
          }, function (msg) {
          });
        }
      }, function (msg) {
      });
      if ($mqtt.isLogin()) {
        alert($mqtt.isLogin());
        $mqtt.getMqtt().getMyTopic(function (msg) {
          $api.getAllGroupIds(function (groups) {
            if (msg != null && msg != '') {
              $mqtt.startMqttChat(msg + ',' + groups);
              $mqtt.setLogin(true);
              $state.go('tab.message');
              return;
            }
          },function (err) {
            $ToastUtils.showToast(err, function (success) {
            },function (err) {
            })
          });
        }, function (msg) {
        });
      }
      /*$cordovaPreferences.fetch('name')
       .success(function(value) {
       if(value != null && value != ''){
       $mqtt.startMqttChat(value + ',zhuanjiazu');
       $state.go('tab.message');
       return;
       }
       })
       .error(function(error) {
       })*/
    });


    //保存用户名(注：value==$scope.name)
    /*$scope.store = function() {
     $cordovaPreferences.store('name', $scope.name)
     .success(function(value) {
     })
     .error(function(error) {
     })
     };*/

    //保存密码的方法
    $scope.rememberPwd = function () {
      $mqtt.getMqtt().getString('remPwd', function (pwd) {
        if (pwd === '' || pwd === 'false') {
          $scope.remPwd = 'true';
        } else {
          $scope.remPwd = 'false';
        }
      }, function (msg) {
      });
    };

    $scope.login = function (name, password) {
      if (name == '' || password == '') {
        alert('用户名或密码不能为空！');
        return;
      }
      $scope.name = name;
      $scope.password = password;
      // alert(name);
      // alert(password);
      $ionicLoading.show({
        template: '登录中...'
      });
      $api.login($scope.name, $scope.password, function (message) {
        $mqtt.save('pwdgesture', $scope.password);
        $mqtt.save('namegesture', $scope.name);
        //alert(message.toJSONString());
        if (message.isActive === false) {
          $api.activeUser(message.userID, function (message) {
            loginM();
          }, function (message) {
            alert(message);
          });
        } else {
          loginM();
        }
      }, function (message) {
        alert(message);
        $ionicLoading.hide();
        // $state.go('tab.message');
      });

    };
    //获取当前用户的id
    var loginM = function () {
      $mqtt.getMqtt().getUserId(function (userID) {
        $rootScope.rootUserId = userID;
        // alert("当前用户的id"+userID);
      }, function (err) {

      });
      // alert(message.toString());
      $api.checkUpdate($ionicPopup, $ionicLoading, $cordovaFileOpener2, $mqtt);
      $scope.names = [];
      $ionicLoading.hide();
      //调用保存用户名方法
      $mqtt.getMqtt().saveLogin('name', $scope.name, function (message) {
      }, function (message) {
        alert(message);
      });
      $mqtt.getMqtt().getMyTopic(function (msg) {
        $api.getAllGroupIds(function (groups) {
          //是否保存密码
          $mqtt.save('remPwd', $scope.remPwd);
          if ($scope.remPwd === 'true') {//如果需要保存密码，将密码保存到SP中
            $mqtt.save('pwd', $scope.password);
          } else {
            $mqtt.save('pwd', '');
          }
          $mqtt.startMqttChat(msg + ',' + groups);
          $mqtt.setLogin(true);
          $scope.getUserName();
          $state.go('tab.message');
        }, function (err) {
          $ToastUtils.showToast(err,function (success) {
          },function (err) {
          });
        });
      }, function (err) {
        alert(message);
        $ionicLoading.hide();
      });
    }

    //登录成功之后获取用户姓名（昵称）
    $scope.getUserName = function () {
      $mqtt.getUserInfo(function (userInfo) {
        $rootScope.userName = userInfo.userName;
      },function (err) {
      });
    };
    $scope.meizuo = function() {
      $ToastUtils.showToast("此功能暂未开发");
    };
    $scope.goGestureLogin = function() {
      $mqtt.getMqtt().getString('gesturePwd', function (pwd) {
        if(pwd==null||pwd==""||pwd.length==0){
          $ToastUtils.showToast("还未设置手势密码");
        }else {
          $state.go('gesturelogin');
        }
      }, function (msg) {
        $ToastUtils.showToast("还未设置手势密码");
      });

    };
  })
  .controller('welcomeCtrl', function ($scope, $http, $state, $stateParams,$ionicSlideBoxDelegate,$timeout) {
    $scope.startApp = function() {
      $state.go('newspage');
    };
    // $scope.next = function() {
    //   $ionicSlideBoxDelegate.next();
    // };
    // $scope.previous = function() {
    //   $ionicSlideBoxDelegate.previous();
    // };

    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
      if (index==4){
        $timeout(function () {
          $state.go('newspage');
        }, 1500);
      }
    };
    // //倒计时
    // $scope.time = 5;
    // var timer = null;
    // timer = $interval(function(){
    //   $scope.time = $scope.time - 1;
    //   $scope.codetime = $scope.time+"秒后跳转";
    //   if($scope.time === 0) {
    //     $state.go('login');
    //   }
    // }, 1000);
  })

  .controller('newspageCtrl', function ($scope, $http, $state, $stateParams,$ionicSlideBoxDelegate,$timeout,$interval,$mqtt) {
    $mqtt.getMqtt().getString('pwdgesture', function (message) {
      $scope.pwdgesturea = message;
    });
    $mqtt.getMqtt().getString('namegesture', function (message) {
      $scope.namegesturea = message;
    });
    $scope.goLogin = function() {
      $mqtt.getMqtt().getString('gesturePwd', function (pwd) {
        if(pwd==null||pwd==""||pwd.length==0|| $scope.pwdgesturea==""|| $scope.pwdgesturea.length==0|| $scope.pwdgesturea==null|| $scope.namegesturea==""|| $scope.namegesturea.length==0|| $scope.namegesturea==null){
          $state.go('login');
        }else {
          $state.go('gesturelogin');
        }
        $ToastUtils.showToast("手势密码:"+pwd);
      }, function (msg) {
        $state.go('login');
        $ToastUtils.showToast("手势密码获取失败"+msg);
      });

    };

    $scope.myActiveSlide = 0;
  })
  .controller('gestureloginCtrl', function ($scope, $state, $ionicPopup, $ionicLoading, $cordovaFileOpener2, $http, $mqtt, $cordovaPreferences, $api, $rootScope,$ToastUtils,$timeout) {
    $mqtt.setLogin(false);
    $mqtt.getMqtt().getString('pwdgesture', function (message) {
      $scope.pwdgesturea = message;
    });
    $mqtt.getMqtt().getString('namegesture', function (message) {
      $scope.namegesturea = message;
    });
    $mqtt.getMqtt().getString('historyusername', function (message) {
      $scope.username = message;
    });

    $mqtt.getMqtt().getString('userNamea', function (message) {
      $scope.userNamea = message;
    });
    $scope.goLogin = function() {
      $state.go('login');
    };
    $scope.meizuo = function() {
      $ToastUtils.showToast("此功能暂未开发");
    };
    var password="";
    var count=6;
    // $scope.$apply(function () {
    //   $scope.a=2
    // })
    $mqtt.getMqtt().getString('gesturePwd', function (pwd) {
      password=pwd;
      $ToastUtils.showToast("手势密码:"+pwd);
    }, function (msg) {
      $ToastUtils.showToast("手势密码获取失败"+msg);
    });


    //登录成功之后获取用户姓名（昵称）
    $scope.getUserName = function () {
      $mqtt.getUserInfo(function (userInfo) {
        $rootScope.userName = userInfo.userName;
      },function (err) {
      });
    };

    var method=function () {
      var secondopt = {
        chooseType: 3,
        width: 400,
        height: 400,
        container: 'element',
        inputEnd: function(psw){
          if(psw==password){
            $api.login($scope.namegesturea, $scope.pwdgesturea, function (message) {
              $mqtt.save('pwdgesture', $scope.pwdgesturea);
              $mqtt.save('namegesture', $scope.namegesturea);
              if (message.isActive === false) {
                $api.activeUser(message.userID, function (message) {
                  loginM();
                }, function (message) {
                  $ToastUtils.showToast(message);
                });
              } else {
                loginM();
              }
            }, function (message) {
              $ToastUtils.showToast(message);
            });

            secondlock.drawStatusPoint('right')
            $ionicLoading.show({
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: false,
              maxWidth: 100,
              showDelay: 0
            });
            $timeout(function () {
              $ionicLoading.hide();
              $state.go('tab.message');
            });
            $timeout(function () {
              secondlock.reset();
            },300);

          }else {
            secondlock.drawStatusPoint('notright')
            $ToastUtils.showToast("输入错误，请再输入一次,还能输入"+(--count)+"次")
            if (count==0){
              $mqtt.save('gesturePwd', "");//存
              $state.go('login');
            }
            $timeout(function () {
              secondlock.reset();
              method();
            },300);
          }
        }
      }
      var secondlock = new H5lock(secondopt);
      secondlock.init();
    }


    var firstopt = {
      chooseType: 3,
      width: 400,
      height: 400,
      container: 'element',
      inputEnd: function(psw){
        if(psw==password){
          $api.login($scope.namegesturea, $scope.pwdgesturea, function (message) {
            $mqtt.save('pwdgesture', $scope.pwdgesturea);
            $mqtt.save('namegesture', $scope.namegesturea);
            if (message.isActive === false) {
              $api.activeUser(message.userID, function (message) {
                loginM();
              }, function (message) {
                $ToastUtils.showToast(message);
              });
            } else {
              loginM();
            }
          }, function (message) {
            $ToastUtils.showToast(message);
          });

          firstlock.drawStatusPoint('right')
          $ToastUtils.showToast("输入密码正确,logining...")
          $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 100,
            showDelay: 0
          });
          $timeout(function () {
            $ionicLoading.hide();
            $state.go('tab.message');
          });
          $timeout(function () {
            firstlock.reset();
          },300);

        }else {
          firstlock.drawStatusPoint('notright')
          $ToastUtils.showToast("输入错误，请再输入一次,还能输入"+(--count)+"次")
          $timeout(function () {
            firstlock.reset();
            method();
          },300);
        }
      }
    }
    var firstlock = new H5lock(firstopt);
    firstlock.init();
//获取当前用户的id
    var loginM = function () {
      $mqtt.getMqtt().getUserId(function (userID) {
        $rootScope.rootUserId = userID;
        // alert("当前用户的id"+userID);
      }, function (err) {

      });
      // alert(message.toString());
      $api.checkUpdate($ionicPopup, $ionicLoading, $cordovaFileOpener2, $mqtt);
      //调用保存用户名方法
      $mqtt.getMqtt().saveLogin('name', $scope.namegesturea, function (message) {
      }, function (message) {
        $ToastUtils.showToast(message);
      });
      $mqtt.getMqtt().getMyTopic(function (msg) {
        $api.getAllGroupIds(function (groups) {
          $mqtt.startMqttChat(msg + ',' + groups);
          $mqtt.setLogin(true);
          $scope.getUserName();
        }, function (err) {
          $ToastUtils.showToast(err,function (success) {
          },function (err) {
          });
        });
      }, function (err) {
        $ToastUtils.showToast(err);
      });
    }

  })

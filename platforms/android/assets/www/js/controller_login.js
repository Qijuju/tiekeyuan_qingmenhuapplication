/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('login.controllers', [])

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('LoginCtrl', function ($scope, $state, $ionicPopup, $ionicLoading, $cordovaFileOpener2, $http, $mqtt, $cordovaPreferences, $api, $rootScope,$ToastUtils) {
    document.getElementById("loginpic").style.height=(window.screen.height)+'px';
    document.getElementById("loginpic").style.width=(window.screen.width)+'px';
    $mqtt.save('loginpage', "passwordlogin");

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
        // alert($mqtt.isLogin());
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
          $scope.$apply(function () {
            $scope.remPwd = 'true';
          })

        } else {
          $scope.$apply(function () {
            $scope.remPwd = 'false';
          })
        }
      }, function (msg) {
      });
    };

    $scope.login = function (name, password) {
      if (name == '' || password == '') {
        $ToastUtils.showToast('用户名或密码不能为空！');
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

        //alert(message.toJSONString());
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
        $ionicLoading.hide();
        // $state.go('tab.message');
      });

    };
    //获取当前用户的id
    var loginM = function () {
      $api.SetDeptInfo(function (msg) {
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
          $ToastUtils.showToast(message);
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
            $mqtt.save('passlogin', "1");
            $mqtt.save('pwdgesture', $scope.password);
            $mqtt.save('namegesture', $scope.name);
            $state.go('tab.message');
          }, function (err) {
            $ToastUtils.showToast(err,function (success) {
            },function (err) {
            });
          });
        }, function (err) {
          $ToastUtils.showToast(message);
          $ionicLoading.hide();
        });
      }, function (err) {
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
        if(pwd==null||pwd==""||pwd.length==0||pwd==undefined){
          $ToastUtils.showToast("还未设置手势密码");
        }else {
          $state.go('gesturelogin');
        }
      }, function (msg) {
        $ToastUtils.showToast("还未设置手势密码");
      });

    };

    $scope.chaname = function() {
      document.getElementById("nameabc").value="";
      $scope.name="";
    };
    $scope.chapassword = function() {
      document.getElementById("passwordabc").value="";
      $scope.password="";
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

  .controller('newsPageCtrl', function ($scope, $state, $ionicPopup, $ionicLoading, $cordovaFileOpener2, $http, $mqtt, $cordovaPreferences, $api, $rootScope,$ToastUtils,$timeout,$interval) {
    document.getElementById("imgaaab").style.height=(window.screen.height)+'px';
    document.getElementById("imgaaab").style.width=(window.screen.width)+'px';
    var passworda="";
    var loginpageaa=""
    var passlogin=""
    var pwdgesturea=""
    var namegesturea=""


    document.addEventListener('deviceready',function () {
      mqtt = cordova.require('MqttChat.mqtt_chat');
      mqtt.getString('gesturePwd', function (pwd) {
        passworda=pwd;
      }, function (msg) {
        // $ToastUtils.showToast("还未设置手势密码");
      });

      mqtt.getString('welcomePic', function (picurl) {
        if(picurl==""||picurl==null||picurl.length==0){
          $scope.$apply(function () {
            $scope.securlpic="img/im1.png";
          })
        }else {
          $scope.$apply(function () {
            $scope.securlpic=picurl;
          })
        }
      }, function (msg) {
        // $ToastUtils.showToast("还未设置手势密码");
      });

      mqtt.getString('loginpage', function (loginpagea) {
        loginpageaa=loginpagea;
      }, function (msg) {
        // $ToastUtils.showToast("还未设置手势密码");
      });
      mqtt.getString('passlogin', function (passlogina) {
        passlogin=passlogina;
      }, function (msg) {
        // $ToastUtils.showToast("还未设置手势密码");
      });
      mqtt.getString('namegesture', function (namegesture) {
        namegesturea=namegesture;
        mqtt.getString('pwdgesture', function (pwdgesture) {
          pwdgesturea=pwdgesture;
          //倒计时
          $scope.timea = 3;
          var timer = null;
          timer = $interval(function(){
            if($scope.timea>0&&$scope.timea<4){
              $scope.timea = $scope.timea - 1;
            }
            // $scope.codetime = $scope.timea+"秒后跳转";
            if($scope.timea == 1) {
              ifyuju();
            }
          }, 1000);
        }, function (msg) {
          // $ToastUtils.showToast("还未设置手势密码");
        });
      }, function (msg) {
        // $ToastUtils.showToast("还未设置手势密码");
      });
      if ($mqtt.isLogin()) {
        // alert($mqtt.isLogin());
        $mqtt.getMqtt().getMyTopic(function (msg) {
          $api.getAllGroupIds(function (groups) {
            if (msg != null && msg != '') {
              $mqtt.startMqttChat(msg + ',' + groups);
              $mqtt.setLogin(true);
              // $state.go('tab.message');
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
    });
    $scope.startgogogo = function() {
      ifyuju();
    };

    var ifyuju =function () {
      if(passlogin=="1"){
        $api.login(namegesturea, pwdgesturea, function (message) {
          $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 100,
            showDelay: 0
          });
          if (message.isActive === false) {
            $api.activeUser(message.userID, function (message) {
              loginM();
            }, function (message) {
              $ToastUtils.showToast(message);
              $state.go('login');
            });
          } else {
            loginM();
          }
        }, function (message) {
          $ToastUtils.showToast(message);
          $state.go('login');
        });
      }else if((passworda==null||passworda==""||passworda.length==0)&&passlogin=="2"){
        // alert("1")
        $ToastUtils.showToast("密码已修改,请重新登陆");
        $state.go('login');
      }else if((passworda==null||passworda==""||passworda.length==0)&&loginpageaa=="passwordlogin"){
        $state.go('login');
      }else if(passworda.length>0&&loginpageaa=="gesturelogin"){
        $state.go('gesturelogin');
      }else {
        $state.go('login');
      }
    }

    //获取当前用户的id
    var loginM = function () {

      $api.SetDeptInfo(function (msg) {

        mqtt.getUserId(function (userID) {

          $rootScope.rootUserId = userID;

          // alert("当前用户的id"+userID);
        }, function (err) {

        });
        // alert(message.toString());
        $api.checkUpdate($ionicPopup, $ionicLoading, $cordovaFileOpener2, $mqtt);

        //调用保存用户名方法
        mqtt.saveLogin('name', namegesturea, function (message) {
        }, function (message) {
          $ToastUtils.showToast(message);
        });
        mqtt.getMyTopic(function (msg) {

          $api.getAllGroupIds(function (groups) {
            $timeout(function () {
              $mqtt.startMqttChat(msg + ',' + groups);
              $mqtt.setLogin(true);
              $scope.getUserName();
              $mqtt.save('passlogin', "1");
              $mqtt.save('pwdgesture', pwdgesturea);
              $mqtt.save('namegesture',namegesturea);
              $state.go('tab.message');
              $ionicLoading.hide();
            });

          }, function (err) {
            $ionicLoading.hide()
            $ToastUtils.showToast(err,function (success) {
              $ionicLoading.hide()
              $state.go('login');
            },function (err) {
              $ionicLoading.hide()
              $state.go('login');
            });
          });
        }, function (err) {
          $ToastUtils.showToast(err);
          $ionicLoading.hide();
          $state.go('login');
        });
      }, function (err) {
        $ionicLoading.hide()
        $state.go('login');
      });
    }
    //登录成功之后获取用户姓名（昵称）
    $scope.getUserName = function () {
      $mqtt.getUserInfo(function (userInfo) {
        $rootScope.userName = userInfo.userName;
      },function (err) {
      });
    };
  })
  .controller('gestureloginCtrl', function ($scope, $state, $ionicPopup, $ionicLoading, $cordovaFileOpener2, $http, $mqtt, $cordovaPreferences, $api, $rootScope,$ToastUtils,$timeout) {
    $scope.picyoumeiyoua=false;
    document.getElementById("loginpica").style.height=(window.screen.height)+'px';
    document.getElementById("loginpica").style.width=(window.screen.width)+'px';
    $mqtt.save('loginpage', "gesturelogin");

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
    $mqtt.getMqtt().getString('securlpicaa', function (message) {
      if(message==null||message.length==0||message==undefined){
        $scope.picyoumeiyoua=false;
      }else {
        $scope.picyoumeiyoua=true;
        $scope.$apply(function () {
          $scope.securlpica=message;
        })
      }
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
      // $ToastUtils.showToast("手势密码:"+pwd);
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
          // $ToastUtils.showToast("输入密码正确,logining...")
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
            metho
            d();
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


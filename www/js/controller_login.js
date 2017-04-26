/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('login.controllers', [])

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('LoginCtrl', function ($scope, $state, $ionicPopup, $ionicLoading, $cordovaFileOpener2, $http, $mqtt, $cordovaPreferences, $api, $rootScope, $ToastUtils, $greendao) {
    /*document.getElementById("loginpic").style.height=(window.screen.height)+'px';
     document.getElementById("loginpic").style.width=(window.screen.width)+'px';*/
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
          }, function (err) {
            $ToastUtils.showToast(err, function (success) {
            }, function (err) {
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
      $api.login($scope.name, $scope.password, function (message) {

        if (message.resultCode === '105') {
          var confirmPopup = $ionicPopup.confirm({
            title: '强制登录提示',
            template: "您的账号在其他终端已登录，是否切换到该设备？",
            cancelText: '不登录',
            okText: '登录'
          });
          confirmPopup.then(function (isConfirm) {
            if (isConfirm) {
              $ionicLoading.show({
                template: '登录中...'
              });
              if (message.isActive === false || message.resultCode === '105' || message.resultCode === '107') {
                $api.activeUser(message.userID, function (message) {
                  loginM();
                }, function (message) {
                  $ToastUtils.showToast(message);
                });
              } else {
                loginM();
              }
            } else {
              $state.go('login');
            }
          });
        } else {
          $ionicLoading.show({
            template: '登录中...'
          });
          if (message.isActive === false || message.resultCode === '105' || message.resultCode === '107') {
            $api.activeUser(message.userID, function (message) {
              loginM();
            }, function (message) {
              $ToastUtils.showToast(message);
            });
          } else {
            loginM();
          }
        }

      }, function (message) {
        $ToastUtils.showToast(message);
        $ionicLoading.hide();
        // $state.go('tab.message');
      });

    };
    //获取当前用户的id
    var loginM = function () {
      //登录成功以后根据部门id将部门信息入库
      $api.SetDeptInfo(function (msg) {
        $mqtt.getMqtt().getUserId(function (userID) {
          $rootScope.rootUserId = userID;
          // alert("当前用户的id"+userID);
        }, function (err) {

        });
        // alert(message.toString());
        // $api.checkUpdate($ionicPopup, $ionicLoading, $cordovaFileOpener2, $mqtt);
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
            $ToastUtils.showToast(err, function (success) {
            }, function (err) {
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
        $scope.UserID = userInfo.userID
      }, function (err) {
      });
    };
    $scope.meizuo = function () {
      $ToastUtils.showToast("此功能暂未开发");
    };

    $scope.goGestureLogin = function () {

      $mqtt.getMqtt().getString('zuinewID', function (message) {

        if (message == null || message == "" || message == 0) {
          alert("无ID无法跳转手势密码界面")
        } else {
          $greendao.queryData('GesturePwdService', 'where id=?', message, function (data) {
            if (data[0].pwd == null || data[0].pwd == "" || data[0].pwd.length == 0) {
              $ToastUtils.showToast("还未设置手势密码");
            } else {
              $state.go('gesturelogin');
            }
          }, function (err) {
            $ToastUtils.showToast("还未设置手势密码");
          });
        }
      }, function (err) {
        $ToastUtils.showToast("还未设置手势密码");
      });
    };




    $scope.chaname = function () {
      document.getElementById("nameabc").value = "";
      $scope.name = "";
    };
    $scope.chapassword = function () {
      document.getElementById("passwordabc").value = "";
      $scope.password = "";
    };

  })
  .controller('welcomeCtrl', function ($scope, $http, $state, $stateParams, $ionicSlideBoxDelegate, $timeout, $greendao) {
    $scope.startApp = function () {
      $state.go('newspage');
    };
    // $scope.next = function() {
    //   $ionicSlideBoxDelegate.next();
    // };
    // $scope.previous = function() {
    //   $ionicSlideBoxDelegate.previous();
    // };

    $scope.slideChanged = function (index) {
      $scope.slideIndex = index;
      if (index == 4) {
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

  .controller('newsPageCtrl', function ($scope, $state, $ionicPopup, $ionicLoading, $cordovaFileOpener2, $http, $mqtt, $cordovaPreferences, $api, $rootScope, $ToastUtils, $timeout, $interval, $greendao,$http) {
    document.getElementById("imgaaab").style.height = (window.screen.height) + 'px';
    document.getElementById("imgaaab").style.width = (window.screen.width) + 'px';
    var passworda = "";
    var loginpageaa = ""
    var passlogin = ""
    var pwdgesturea = ""
    var namegesturea = ""
    //是否点击了立即进入（倒计时）
    var isClickGo = false;

    var timer = null;

    document.addEventListener('deviceready', function () {
      mqtt = cordova.require('MqttChat.mqtt_chat');

      $mqtt.getMqtt().getString('zuinewID', function (message) {
        // alert(message)
        $greendao.queryData('GesturePwdService', 'where id=?', message, function (data) {
          passworda = data[0].pwd;
        }, function (err) {
        });
      });
      // $greendao.queryData('GesturePwdService','where id=?',$scope.UserID ,function (data) {
      //   // alert(data[0].pwd)
      //
      // },function (err) {
      // });

      // mqtt.getString('gesturePwd', function (pwd) {
      //   passworda=pwd;
      // }, function (msg) {
      //   // $ToastUtils.showToast("还未设置手势密码");
      // });

      mqtt.getString('welcomePic', function (picurl) {
        //欢迎界面图片
        if (picurl == "" || picurl == null || picurl.length == 0) {
          $scope.$apply(function () {
            $scope.securlpic = "img/im1.png";
          })
        } else {
          // 查询到的图片不为空

          $scope.$apply(function () {
            //先设置好值再去判断
            $scope.securlpic = picurl;

            /*//从网络上拿下来图片的基本信息
            $http({
              method: 'get',
              url: url,
            }).success(function(data, status) {

              mqtt.getString('')


            }).error(function(data, status) {

            });*/
          })
        }
      }, function (msg) {

      });

      mqtt.getString('loginpage', function (loginpagea) {
        loginpageaa = loginpagea;
      }, function (msg) {
        // $ToastUtils.showToast("还未设置手势密码");
      });
      mqtt.getString('passlogin', function (passlogina) {
        passlogin = passlogina;
      }, function (msg) {
        // $ToastUtils.showToast("还未设置手势密码");
      });
      mqtt.getString('namegesture', function (namegesture) {
        namegesturea = namegesture;
        mqtt.getString('pwdgesture', function (pwdgesture) {
          pwdgesturea = pwdgesture;
          //倒计时
          $scope.timea = 4;

          timer = $interval(function () {
            if ($scope.timea > 0 && $scope.timea < 5) {
              $scope.timea = $scope.timea - 1;
            }
            // $scope.codetime = $scope.timea+"秒后跳转";
            if ($scope.timea == 1 && !isClickGo) {//此处需要判断是否已经走了登录的方法
              $scope.timea = 1;
              //取消定时器
              $interval.cancel(timer);
              isClickGo = true;
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
          }, function (err) {
            $ToastUtils.showToast(err, function (success) {
            }, function (err) {
            })
          });
        }, function (msg) {
        });
      }
    });

    // 倒计时点击跳过
    $scope.startgogogo = function () {
      //判断是否点击过倒计时，如果已经点击过，则不重复点击
      if (isClickGo) {
        return;
      }
      // alert("dianjile");
      //防止重复点击
      isClickGo = true;
      $interval.cancel(timer);
      ifyuju();
    };

    var ifyuju = function () {
      //测试自动登录
      // passlogin = 1;
      if (passlogin == "1") {
        // $ToastUtils.showToast("网路异常！");

        // namegesturea = 'chenglilicll';
        // pwdgesturea = 'password';
        $api.login(namegesturea, pwdgesturea, function (message) {
          if (message.resultCode === '105') {
            var confirmPopup = $ionicPopup.confirm({
              title: '强制登录提示',
              template: "您的账号在其他终端已登录，是否切换到该设备？",
              cancelText: '不登录',
              okText: '登录'
            });
            confirmPopup.then(function (isConfirm) {
              if (isConfirm) {
                $ionicLoading.show({
                  content: 'Loading',
                  animation: 'fade-in',
                  showBackdrop: false,
                  maxWidth: 100,
                  showDelay: 0
                });
                if (message.isActive === false || message.resultCode === '105' || message.resultCode === '107') {
                  $api.activeUser(message.userID, function (message) {
                    loginM();
                  }, function (message) {
                    $ToastUtils.showToast(message);
                    $state.go('login');
                  });
                } else {
                  loginM();
                }
              } else {
                $state.go('login');
              }
            });
          } else {
            $ionicLoading.show({
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: false,
              maxWidth: 100,
              showDelay: 0
            });
            if (message.isActive === false || message.resultCode === '105' || message.resultCode === '107') {
              $api.activeUser(message.userID, function (message) {
                loginM();
              }, function (message) {
                $ToastUtils.showToast(message);
                $state.go('login');
              });
            } else {
              loginM();
            }
          }
        }, function (message) {
          $ToastUtils.showToast(message);
          $state.go('login');
        });
      }
      else if ((passworda == null || passworda == "" || passworda.length == 0) && passlogin == "2") {
        // alert("1")
        $ToastUtils.showToast("密码已修改,请重新登陆");
        $state.go('login');
      } else if ((passworda == null || passworda == "" || passworda.length == 0) && loginpageaa == "passwordlogin") {
        $state.go('login');
      } else if (passworda.length > 0 && loginpageaa == "gesturelogin") {
        $state.go('gesturelogin');
      }
      else {
        // $ToastUtils.showToast("网路异常！");
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
        // $api.checkUpdate($ionicPopup, $ionicLoading, $cordovaFileOpener2, $mqtt);
        //调用保存用户名方法
        mqtt.saveLogin('name', namegesturea, function (message) {
        }, function (message) {
          $ToastUtils.showToast(message);
        });
        mqtt.getMyTopic(function (msg) {

          $api.getAllGroupIds(function (groups) {
            $timeout(function () {
              $mqtt.startMqttChat(msg + ',' + groups, function (msg) {
              }, function (err) {
                $state.go('login');
              });
              $mqtt.setLogin(true);
              $scope.getUserName();
              $mqtt.save('passlogin', "1");
              $mqtt.save('pwdgesture', pwdgesturea);
              $mqtt.save('namegesture', namegesturea);
              $state.go('tab.message');
              $ionicLoading.hide();
            });

          }, function (err) {
            $ionicLoading.hide()
            $ToastUtils.showToast(err, function (success) {
              $ionicLoading.hide()
              $state.go('login');
            }, function (err) {
              $ToastUtils.showToast(err);
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
        $ToastUtils.showToast(err);
        $ionicLoading.hide()
        $state.go('login');
      });
    }
    //登录成功之后获取用户姓名（昵称）
    $scope.getUserName = function () {
      $mqtt.getUserInfo(function (userInfo) {
        $rootScope.userName = userInfo.userName;
      }, function (err) {
        $ToastUtils.showToast(err);
      });
    };
  })
  .controller('gestureloginCtrl', function ($scope, $state, $ionicPopup, $ionicLoading, $cordovaFileOpener2, $http, $mqtt, $cordovaPreferences, $api, $rootScope, $ToastUtils, $timeout, $greendao) {

    var password = "";
    var count = 6;


    $scope.picyoumeiyoua = false;
    document.getElementById("loginpica").style.height = (window.screen.height) + 'px';
    document.getElementById("loginpica").style.width = (window.screen.width) + 'px';
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
    $mqtt.getMqtt().getString('zuinewID', function (message) {
      // alert(message)
      $greendao.queryData('GesturePwdService', 'where id=?', message, function (data) {
        password = data[0].pwd;
      }, function (err) {
      });
    });

    $mqtt.getMqtt().getString('userNamea', function (message) {
      $scope.userNameabc = message;
      $scope.userNamea = $scope.userNameabc.substring(($scope.userNameabc.length - 2), $scope.userNameabc.length);
    });
    // getHeadPic: function (picUserID, picSize, success, error) {
    //   api.getHeadPic(picUserID, picSize, success, error);
    // },
    // $mqtt.getMqtt().getString('securlpicaa', function (message) {
    //   if(message==null||message.length==0||message==undefined){
    //     $scope.picyoumeiyoua=false;
    //   }else {
    //     $scope.picyoumeiyoua=true;
    //     $scope.$apply(function () {
    //       $scope.securlpica=message;
    //     })
    //   }
    // });

    $api.getHeadPic($scope.UserID, "60", function (srcurl) {
      // alert(srcurl)
      if (message == null || message.length == 0 || message == undefined) {
        $scope.picyoumeiyoua = false;
      } else {
        $scope.picyoumeiyoua = true;
        $scope.$apply(function () {
          $scope.securlpica = srcurl;
        })
      }
    }, function (error) {
      // alert(error)
      $scope.picyoumeiyoua = false;
      // alert("没有")
    })

    $scope.goLogin = function () {
      $state.go('login');
    };
    $scope.meizuo = function () {
      $ToastUtils.showToast("此功能暂未开发");
    };

    // $scope.$apply(function () {
    //   $scope.a=2
    // })
    // $mqtt.getMqtt().getString('gesturePwd', function (pwd) {
    //   password=pwd;
    //   // $ToastUtils.showToast("手势密码:"+pwd);
    // }, function (msg) {
    //   $ToastUtils.showToast("手势密码获取失败"+msg);
    // });


    //登录成功之后获取用户姓名（昵称）
    $scope.getUserName = function () {
      $mqtt.getUserInfo(function (userInfo) {
        $rootScope.userName = userInfo.userName;
      }, function (err) {
      });
    };

    var method = function () {
      var secondopt = {
        chooseType: 3,
        width: 400,
        height: 400,
        container: 'element',
        inputEnd: function (psw) {
          if (psw == password) {
            $api.login($scope.namegesturea, $scope.pwdgesturea, function (message) {
              if (message.resultCode === '105') {
                var confirmPopup = $ionicPopup.confirm({
                  title: '强制登录提示',
                  template: "您的账号在其他终端已登录，是否切换到该设备？",
                  cancelText: '不登录',
                  okText: '登录'
                });
                confirmPopup.then(function (isConfirm) {
                  if (isConfirm) {
                    $mqtt.save('pwdgesture', $scope.pwdgesturea);
                    $mqtt.save('namegesture', $scope.namegesturea);
                    if (message.isActive === false || message.resultCode === '105' || message.resultCode === '107') {
                      $api.activeUser(message.userID, function (message) {
                        loginM();
                      }, function (message) {
                        $ToastUtils.showToast(message);
                      });
                    } else {
                      loginM();
                    }
                  } else {
                    $state.go('login');
                  }
                });
              } else {
                $mqtt.save('pwdgesture', $scope.pwdgesturea);
                $mqtt.save('namegesture', $scope.namegesturea);
                if (message.isActive === false || message.resultCode === '105' || message.resultCode === '107') {
                  $api.activeUser(message.userID, function (message) {
                    loginM();
                  }, function (message) {
                    $ToastUtils.showToast(message);
                  });
                } else {
                  loginM();
                }
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
            }, 300);

          } else {
            secondlock.drawStatusPoint('notright')
            $ToastUtils.showToast("输入错误，请再输入一次,还能输入" + (--count) + "次")
            if (count == 0) {
              // $mqtt.save('gesturePwd', "");//存
              $mqtt.getUserInfo(function (msg) {
                $scope.UserID = msg.userID;
                $scope.mymypersonname = msg.userName
                var gestureobj = {};
                gestureobj.id = $scope.UserID;
                gestureobj.username = $scope.mymypersonname;
                gestureobj.pwd = "";
                $greendao.saveObj('GesturePwdService', gestureobj, function (data) {
                  // $ToastUtils.showToast("密码修改成功")
                }, function (err) {
                });
              }, function (msg) {
              });
              $state.go('login');
            }
            $timeout(function () {
              secondlock.reset();
              method();
            }, 300);
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
      inputEnd: function (psw) {
        if (psw == password) {
          $api.login($scope.namegesturea, $scope.pwdgesturea, function (message) {
            $mqtt.save('pwdgesture', $scope.pwdgesturea);
            $mqtt.save('namegesture', $scope.namegesturea);
            if (message.resultCode === '105') {
              var confirmPopup = $ionicPopup.confirm({
                title: '强制登录提示',
                template: "您的账号在其他终端已登录，是否切换到该设备？",
                cancelText: '不登录',
                okText: '登录'
              });
              confirmPopup.then(function (isConfirm) {
                if (isConfirm) {
                  if (message.isActive === false || message.resultCode === '105' || message.resultCode === '107') {
                    $api.activeUser(message.userID, function (message) {
                      loginM();
                      $ionicLoading.hide();
                      $state.go('tab.message');
                    }, function (message) {
                      $ToastUtils.showToast(message);
                    });
                  } else {
                    loginM();
                    $ionicLoading.hide();
                    $state.go('tab.message');
                  }
                } else {
                  $state.go('login');
                }
              });
            } else {
              if (message.isActive === false || message.resultCode === '105' || message.resultCode === '107') {
                $api.activeUser(message.userID, function (message) {
                  loginM();
                  $ionicLoading.hide();
                  $state.go('tab.message');
                }, function (message) {
                  $ToastUtils.showToast(message);
                });
              } else {
                loginM();
                $ionicLoading.hide();
                $state.go('tab.message');
              }
            }
          }, function (message) {
            $ionicLoading.hide();
            $state.go('login');
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
            firstlock.reset();
          }, 300);

        } else {
          firstlock.drawStatusPoint('notright')
          if (count != 0) {
            $ToastUtils.showToast("输入错误，请再输入一次,还能输入" + (--count) + "次")
          } else {
            $ToastUtils.showToast("请重新设置手势密码！")
            // $mqtt.save('gesturePwd', "");//存 手势密码清空
            $mqtt.getUserInfo(function (msg) {
              $scope.UserID = msg.userID;
              $scope.mymypersonname = msg.userName
              var gestureobj = {};
              gestureobj.id = $scope.UserID;
              gestureobj.username = $scope.mymypersonname;
              gestureobj.pwd = "";
              $greendao.saveObj('GesturePwdService', gestureobj, function (data) {
                // $ToastUtils.showToast("密码修改成功")
              }, function (err) {
              });
            }, function (msg) {
            });


            $state.go('login');
          }
          // alert("bbbbbb:"+count);
          $timeout(function () {
            firstlock.reset();
            metho
            d();
          }, 300);
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
      // $api.checkUpdate($ionicPopup, $ionicLoading, $cordovaFileOpener2, $mqtt);
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
          $ToastUtils.showToast(err, function (success) {
          }, function (err) {
          });
        });
      }, function (err) {
        $ToastUtils.showToast(err);
      });
    }
  })


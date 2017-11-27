/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('login.controllers', [])

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('LoginCtrl', function ($scope, $state, $ionicPopup,$pubionicloading,$timeout, $cordovaFileOpener2, $http, $mqtt, $cordovaPreferences, $api, $rootScope, $ToastUtils, $greendao,$window) {
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

              // 函数调用，获取门户页数据源
              // getMenHuData();

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
    });
    //监听键盘弹起事件，将整体布局上移
    // var tKeyH = $window.innerHeight;;
    // window.addEventListener('native.keyboardshow',function (e){
    //   $scope.intervalH=(tKeyH - 305 -e.keyboardHeight);//弹出的bottom=(屏幕的高度-键盘的高度-div的高度:高度为累加和banner+用户名高度+密码高度)/2
    //   // alert("屏幕的高度"+$scope.intervalH);
    //   if($scope.intervalH <0){
    //     document.getElementById("tHeight").style.bottom = 41 +'px';
    //   }
    //   return ;
    // });


    //监听键盘关闭事件，将bottom设置为0
    // window.addEventListener('native.keyboardhide',function (e){
    //   document.getElementById("tHeight").style.bottom = 0 +'px';
    // });
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
              $pubionicloading.showloading('','登录中...');
              if (message.isActive === false || message.resultCode === '105' || message.resultCode === '107') {
                $api.activeUser(message.userID, function (message) {
                  loginM();
                }, function (message) {
                  $pubionicloading.hide();
                  $ToastUtils.showToast(message);
                });
              } else {
                loginM();
              }
            } else {
              $pubionicloading.hide();
              $state.go('login');
            }
          });
        }else {
          $pubionicloading.showloading('','登录中...');
          if (message.isActive === false || message.resultCode === '105' || message.resultCode === '107') {
            $api.activeUser(message.userID, function (message) {
              loginM();
            }, function (message) {
              $pubionicloading.hide();
              $ToastUtils.showToast(message);
            });
          } else {
            loginM();
          }
        }

      }, function (message) {
        $pubionicloading.hide();
        var errorArr=message.split('#');
        var errCode=errorArr[0];
        /**
         * 若登陆时发现该用户第一次注册111
         * 若登陆时发现该用户在不同设备登陆112
         * 若登陆时发现该用户长时间未登录113
         * 若登陆时发现该用户未绑定手机号114
         */
        if(errCode === '111' || errCode === '112' || errCode === '113' || errCode === '114'){
          var userId=errorArr[1];
          var mobile=errorArr[2];
          var mepId= errorArr[3];
          // alert("短信验证first界面"+JSON.stringify(message)+"1111"+errCode+"2222"+userId+"3333"+mobile+"==="+mepId);
          $state.go('msgCheck',{
            "errCode":errCode,
            "mobile":mobile,
            "userId":userId,
            "mepId":mepId,
            "remPwd":$scope.remPwd
          });
        }else{//先跑通流程
          $state.go('login');
          $ToastUtils.showToast(message);
        }
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
        $scope.names = [];
        $pubionicloading.hide();
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
            //
            // 函数调用，获取门户页数据源
            // getMenHuData();

          }, function (err) {
            $pubionicloading.hide();
            $ToastUtils.showToast(err, function (success) {
            }, function (err) {
            });
          });
        }, function (err) {
          $ToastUtils.showToast(message);
          $pubionicloading.hide();
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

    $scope.slideChanged = function (index) {
      $scope.slideIndex = index;
      if (index == 4) {
        $timeout(function () {
          $state.go('newspage');
        }, 1500);
      }
    };
  })

  .controller('newsPageCtrl', function ($scope, $state, $ionicPopup,$pubionicloading, $cordovaFileOpener2, $http, $mqtt, $cordovaPreferences, $api, $rootScope, $ToastUtils, $timeout, $interval, $greendao,$http) {
    document.getElementById("imgaaab").style.height = (window.screen.height) + 'px';
    document.getElementById("imgaaab").style.width = (window.screen.width) + 'px';
    var passworda = "";
    var loginpageaa = "";
    var passlogin = "";
    var pwdgesturea = "";
    var namegesturea = "";
    //是否点击了立即进入（倒计时）
    var isClickGo = false;

    var timer = null;

    document.addEventListener('deviceready', function () {
      mqtt = cordova.require('MqttChat.mqtt_chat');

      $mqtt.getMqtt().getString('zuinewID', function (message) {
        $greendao.queryData('GesturePwdService', 'where id=?', message, function (data) {
          passworda = data[0].pwd;
        }, function (err) {
        });
      });

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
          })
        }

        mqtt.getString('varyName',function (varyname) {

          //调用下载的接口
          $api.getWelcomePic("",varyname,function (suc) {

            //图片下载成功
            //$ToastUtils.showToast("欢迎页面下载成功")


          },function (error) {

            //图片下载失败
            $ToastUtils.showToast("欢迎页面下载失败")

          })


        },function () {

        });
      }, function (msg) {

      });





      mqtt.getString('loginpage', function (loginpagea) {
        loginpageaa = loginpagea;
      }, function (msg) {
      });
      mqtt.getString('passlogin', function (passlogina) {
        passlogin = passlogina;
      }, function (msg) {
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
            if ($scope.timea < 1 ) {//此处需要判断是否已经走了登录的方法
              $scope.timea = 1;
              //取消定时器
              $interval.cancel(timer);
              isClickGo = true;
              ifyuju();
            }
          }, 1000);
        }, function (msg) {
        });
      }, function (msg) {
      });
      if ($mqtt.isLogin()) {
        $mqtt.getMqtt().getMyTopic(function (msg) {
          $api.getAllGroupIds(function (groups) {
            if (msg != null && msg != '') {
              $mqtt.startMqttChat(msg + ',' + groups);
              $mqtt.setLogin(true);
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
      //防止重复点击
      isClickGo = false;
      $interval.cancel(timer);
      ifyuju();
    };

    var ifyuju = function () {
      //测试自动登录
      if (passlogin == "1") {
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
                $pubionicloading.showloading('','正在加载...');
                if (message.isActive === false || message.resultCode === '105' || message.resultCode === '107') {
                  $api.activeUser(message.userID, function (message) {
                    loginM();
                  }, function (message) {
                    $pubionicloading.hide();
                    $ToastUtils.showToast(message);
                    $state.go('login');
                  });
                } else {
                  loginM();
                }
              } else {
                $pubionicloading.hide();
                $state.go('login');
              }
            });
          } else {
            $pubionicloading.showloading('','正在加载...');
            if (message.isActive === false || message.resultCode === '105' || message.resultCode === '107') {
              $api.activeUser(message.userID, function (message) {
                loginM();
              }, function (message) {
                $pubionicloading.hide();
                $ToastUtils.showToast(message);
                $state.go('login');
              });
            } else {
              loginM();
            }
          }
        }, function (message) {
          $pubionicloading.hide();
          var errorArr=message.split('#');
          /**
           * 若登陆时发现该用户第一次注册111
           * 若登陆时发现该用户在不同设备登陆112
           * 若登陆时发现该用户长时间未登录113
           * 若登陆时发现该用户未绑定手机号114
           */
          if(errCode === '111' || errCode === '112' || errCode === '113' || errCode === '114'){
            var errCode= errorArr[0];
            var userId= errorArr[1];
            var mobile= errorArr[2];
            var mepId= errorArr[3];
            // alert("短信验证first界面"+JSON.stringify(message)+"1111"+errCode+"2222"+userId+"3333"+mobile+"==="+mepId);
            $state.go('msgCheck',{
              "errCode":errCode,
              "mobile":mobile,
              "userId":userId,
              "mepId":mepId
            });
          }else{//先跑通流程
            $state.go('login');
            $ToastUtils.showToast(message.Message);
          }
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
        $state.go('login');
      }
    }

    //获取当前用户的id
    var loginM = function () {

      $api.SetDeptInfo(function (msg) {

        mqtt.getUserId(function (userID) {
          $rootScope.rootUserId = userID;
        }, function (err) {
        });
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

              // 函数调用，获取门户页数据源
              // getMenHuData();

              $state.go('tab.message');

              $pubionicloading.hide();
            });

          }, function (err) {
            $pubionicloading.hide();
            $ToastUtils.showToast(err, function (success) {
              $pubionicloading.hide();
              $state.go('login');
            }, function (err) {
              $ToastUtils.showToast(err);
              $pubionicloading.hide();
              $state.go('login');
            });
          });
        }, function (err) {
          $ToastUtils.showToast(err);
          $pubionicloading.hide();
          $state.go('login');
        });
      }, function (err) {
        $ToastUtils.showToast(err);
        $pubionicloading.hide();
        $state.go('login');
      });
    };

    //登录成功之后获取用户姓名（昵称）
    $scope.getUserName = function () {
      $mqtt.getUserInfo(function (userInfo) {
        $rootScope.userName = userInfo.userName;
      }, function (err) {
        $ToastUtils.showToast(err);
      });
    };

    // 登陆成功之后获取门户页面数据源
    function getMenHuData() {
      /*门户页数据请求代码开始。
       * 1.写在此处的原因：
       * 为了解决根据appIcon异步请求拿到的数据，页面不能实现实时刷新的问题。
       *
       * */
      // 门户页面数据请求
      var userID; // userID = 232099
      var imCode; //  imCode = 866469025308438
      var qyyobject = {};// 一条logo数据
      $mqtt.getUserInfo(function (succ) {
        userID = succ.userID;
        //获取人员所在部门，点亮图标
        $mqtt.getImcode(function (imcode) {
          NetData.getInfo(userID, imcode);
          imCode = imcode;
          $http({
            method: 'post',
            timeout: 5000,
            // url:"http://88.1.1.22:8081",
            // url: "htƒtp://imtest.crbim.win:8080/apiman-gateway/jishitong/interface/1.0?apikey=b8d7adfb-7f2c-47fb-bac3-eaaa1bdd9d16",//开发环境
            // url: "http://immobile.r93535.com:8088/crbim/imApi/1.0",//正式环境
            url:$formalurlapi.getBaseUrl(),
            data: {"Action": "GetAppList", "id": userID, "mepId": imCode,"platform":"A"}
          }).success(function (data, status) {

            // 成功之后页面跳转
            $state.go('tab.message');

            // 门户页面对应的所有的数据源
            $rootScope.portalDataSource = JSON.parse(decodeURIComponent(data));
            console.log("applist所有数据源"+JSON.stringify($rootScope.portalDataSource));
            $scope.sysmenu =  $rootScope.portalDataSource.sysmenu;


            $scope.appIconArr = [];// 定义一个存放门户页需要的 appIcon 的数组对象
            $scope.appIconArr2 = []; // 定义一个存放门户不需要的 appIcon 的数据对象

            // 遍历数据源,拿到所有图片的appIcon,调插件，获取所有图片的路径。(插件中判断图片是否在本地存储，若本地没有则下载)
            if($scope.sysmenu != null || $scope.sysmenu != "" || $scope.sysmenu != undefined){
              for(var i=0;i<$scope.sysmenu.length;i++){
                var items =  $scope.sysmenu[i].items;
                for(var j=0;j<items.length;j++){
                  var flag = items[j].flag;
                  var appIcon = items[j].appIcon;
                  qyyobject.path = "/storage/emulated/0/tkyjst/download/icon/"+appIcon+".png";
                  qyyobject.appId = items[j].appId;
                  $greendao.saveObj('QYYIconPathService',qyyobject,function (succ) {

                  },function (err) {
                  });

                  if(flag){
                    $scope.appIconArr.push( appIcon );
                    $scope.appIconArr2.push(appIcon+'_f')
                  }else {
                    $scope.appIconArr.push(appIcon+'_f');
                    $scope.appIconArr2.push(appIcon)
                  }
                }
              }
            }


            // 调插件，获取门户页需要的所有的图片路径
            $api.downloadQYYIcon($scope.appIconArr,function (success) {
              $rootScope.appIconPaths = success;
              console.log("图片路径 1 数据源：" + JSON.stringify(success));
            },function (err) {
            });

            // 调插件，获取门户页不需要的所有的图片路径--下载所有的图片到本地，解决通知页logo找不到的问题
            $api.downloadQYYIcon($scope.appIconArr2,function (success) {
              $rootScope.appIconPaths2 = success;
              console.log("图片路径 2 数据源：" + JSON.stringify(success));
            },function (err) {
            });


          });
        }).error(function (data, status) {
          $ToastUtils.showToast("获取用户权限失败!");
        });
      }, function (err) {
      });
      // 门户代码结束

    }




  })
 /* .controller('gestureloginCtrl', function ($scope, $state, $ionicPopup,$pubionicloading, $cordovaFileOpener2, $http, $mqtt, $cordovaPreferences, $api, $rootScope, $ToastUtils, $timeout, $greendao) {

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
                        $pubionicloading.hide();
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
                    $pubionicloading.hide();
                    $ToastUtils.showToast(message);
                  });
                } else {
                  loginM();
                }
              }
            }, function (message) {
              $pubionicloading.hide();
              $state.go('login');
              $ToastUtils.showToast(message);
            });

            secondlock.drawStatusPoint('right')
            $pubionicloading.showloading('','正在加载...');
            $timeout(function () {
              $pubionicloading.hide();
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
                      $pubionicloading.hide();
                      $state.go('tab.message');
                    }, function (message) {
                      $pubionicloading.hide();
                      $ToastUtils.showToast(message);
                    });
                  } else {
                    loginM();
                    $pubionicloading.hide();
                    $state.go('tab.message');
                  }
                } else {
                  $pubionicloading.hide();
                  $state.go('login');
                }
              });
            } else {
              if (message.isActive === false || message.resultCode === '105' || message.resultCode === '107') {
                $api.activeUser(message.userID, function (message) {
                  loginM();
                  $pubionicloading.hide();
                  $state.go('tab.message');
                }, function (message) {
                  $pubionicloading.hide();
                  $ToastUtils.showToast(message);
                });
              } else {
                loginM();
                $pubionicloading.hide();
                $state.go('tab.message');
              }
            }
          }, function (message) {
            $pubionicloading.hide();
            $state.go('login');
            $ToastUtils.showToast(message);

          });

          firstlock.drawStatusPoint('right')
          // $ToastUtils.showToast("输入密码正确,logining...")
          $pubionicloading.showloading('','正在加载...');

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
            method();
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
*/

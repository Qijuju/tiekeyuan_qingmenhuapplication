  angular.module('newlogin.controllers',[])

    .controller('loginCtrl',function ($scope,$mqtt,$ToastUtils,pubLogin) {
      $scope.pwdStatus = 'false';//初始化选中状态

      //根据是否记住密码的状态，读取保存的密码
      $scope.remPwd=function () {
        if ($scope.pwdStatus === '' || $scope.pwdStatus === 'false') {
            $scope.pwdStatus = 'true';
        } else {
            $scope.pwdStatus = 'false';
        }
      }

      document.addEventListener('deviceready',function () {
        //取出保存的是否记住密码的状态在页面上显示
        $mqtt.getString('remPwd',function (oldPwdSta) {
          $scope.pwdStatus = oldPwdSta;
          if($scope.pwdStatus === 'true'){
            //取出登陆成功保存的密码
            $mqtt.getString('password',function (succ) {
              $scope.password = succ;
            },function (err) {
            });
          }
        },function (err) {
        });

        //获取登陆成功保存的用户名
        $mqtt.getString('username',function (msg) {
          $scope.username = msg;
        },function (err) {
        })
        /**
         * 点击x，清空用户名和密码
         */
        $scope.chaname = function () {
          document.getElementById("nameabc").value = "";
          $scope.username = "";
        };
        $scope.chapassword = function () {
          document.getElementById("passwordabc").value = "";
          $scope.password = "";
        };

        /**
         * 编写登陆方法
         */
        $scope.login=function (username,password) {
          //根据用户输入的用户名和密码判断是否为空
          if (username == '' || password == '') {
            $ToastUtils.showToast('用户名或密码不能为空！');
            return;
          }
          //将实时的用户名进行赋值
          $scope.username = username;
          $scope.password = password;
          //调用service的登陆方法
          pubLogin.newlogin($scope.username,$scope.password,$scope.pwdStatus,pubLogin);
        }

      })

    })

    .controller('newsPageCtrl',function ($scope,$ToastUtils,$api,$interval,$state,pubLogin) {
      //设置背景图片的宽跟高
      document.getElementById("imgaaab").style.height = document.documentElement.clientHeight + 'px';
      document.getElementById("imgaaab").style.width = document.documentElement.clientWidth + 'px';





      var passlogin;//跳过登陆标志符
      var timer = null;//定义一个定时器
      var isClickGo = 'false';
      var passname,password;

      //加载欢迎图片
      document.addEventListener('deviceready',function () {
        mqtt = cordova.require('MqttChat.mqtt_chat');

        //取出保存的欢迎图片路径
        mqtt.getString('welcomePic', function (picurl) {
          //若是为空，则使用默认图片
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

          mqtt.getString('varyName', function (varyname) {
            //调用下载的接口
            $api.getWelcomePic("", varyname, function (suc) {//图片下载成功
            }, function (error) {
              //图片下载失败
              $ToastUtils.showToast("欢迎页面下载失败")
            })
          }, function () {
          });
        });


        //取出跳过登陆标志符
        mqtt.getString('passlogin', function (succ) {
          passlogin = succ;
          if(passlogin == '1'){
            //取出登陆成功保存的用户名和密码
            mqtt.getString('username',function (name) {
              passname = name;
              mqtt.getString('password',function (word) {
                password = word;
                //定义一个变量为3，表示定时器的时长
                $scope.timelong = 4;

                //跳过(倒计时)
                timer = $interval(function () {
                  if ($scope.timelong > 0 && $scope.timelong < 5) {
                    $scope.timelong = $scope.timelong - 1;
                  }
                  if ($scope.timelong < 1 ) {//此处需要判断是否已经走了登录的方法
                    $scope.timelong = 1;
                    //取消定时器
                    $interval.cancel(timer);
                    if(passname != "" && password != ""){
                      isClickGo = 'true';//设置跳转状态为true
                      passLogin();
                    }else{
                      $state.go('login');
                    }
                  }
                },1000);
              },function (err) {
              });
            },function (err) {
            })
          }else{
            //定义一个变量为3，表示定时器的时长
            $scope.timelong = 4;

            //跳过(倒计时)
            timer = $interval(function () {
              if ($scope.timelong > 0 && $scope.timelong < 5) {
                $scope.timelong = $scope.timelong - 1;
              }
              if ($scope.timelong < 1 ) {//此处需要判断是否已经走了登录的方法
                $scope.timelong = 1;
                //取消定时器
                $interval.cancel(timer);
                $state.go('login');
              }
            },1000);
          }
        }, function (err) {
        });


        //点击'跳过'，越过登陆
        $scope.startGo = function () {
          //只有当跳过状态为false时，点击"跳过"改变状态，取消定时器
          if(isClickGo === 'false'){
            isClickGo = 'true';
            $interval.cancel(timer);
            passLogin();
          }
        };


        //跳过登陆的方法
        var passLogin = function () {

          //先取出登陆成功保存的用户名和密码
          if(isClickGo == 'true'){//当满足该条件时，直接跳过登陆
            pubLogin.newlogin(passname,password,'true',pubLogin);
          }
        }

      });

    })

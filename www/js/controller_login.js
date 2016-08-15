/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('login.controllers', [])

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('LoginCtrl', function ($scope, $state, $ionicPopup, $ionicLoading, $cordovaFileOpener2, $http, $mqtt, $cordovaPreferences, $api, $rootScope) {
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
          if (msg != null && msg != '') {
            $mqtt.startMqttChat(msg);
            $mqtt.setLogin(true);
            $state.go('tab.message');
            return;
          }
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
        // alert(message.isActive + "nh");
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
    var loginM = function () {
      //获取当前用户的id
      $mqtt.getMqtt().getUserId(function (userID) {
        $rootScope.rootUserId = userID;
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
        //是否保存密码
        $mqtt.save('remPwd', $scope.remPwd);
        if ($scope.remPwd === 'true') {//如果需要保存密码，将密码保存到SP中
          $mqtt.save('pwd', $scope.password);
        } else {
          $mqtt.save('pwd', '');
        }
        $mqtt.startMqttChat(msg);
        $mqtt.setLogin(true);
        $state.go('tab.message');
      }, function (err) {
        alert(message);
        $ionicLoading.hide();
      });
    }
  })

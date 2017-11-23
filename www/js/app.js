// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'im.routes','im.directives','monospaced.elastic',
  'ngCordova','application.controllers','contacts.controllers','login.controllers','message.controllers',
  'my.controllers','search.controllers','selectgroup.controllers','notification.controllers','common.services','contacts.services',
  'message.services','my.services','group.services','selectothergroup.controllers','localphone.controllers','localphone.services','fileandpicture.controllers','badge.controllers'
  ,'newnotification.controllers','work.controllers','portal.services','portal.controllers','sendfile.controllers','fountion.controllers','msgcheck.controllers'])

/*'im.controllers', 'starter.services',*/
  .run(function($ionicPlatform,$ionicPopup, $rootScope, $location,$mqtt,$state,$ionicHistory,$api,$pubionicloading,$ToastUtils,$greendao) {
    $ionicPlatform.ready(function() {
      $api.init();
      // $greendao.loadAllData('ChatListService',function (msg) {
      //   var allNoRead=0;
      //   if (msg.length>0){
      //     for(var i=0;i<msg.length;i++){
      //       allNoRead=allNoRead+parseInt(msg[i].count, 10);
      //     }
      //
      //     // $ToastUtils.showToast($scope.allNoRead)
      //   }
      //   cordova.plugins.notification.badge.hasPermission(function (granted) {
      //     alert("granted"+granted);
      //   });
      //   cordova.plugins.notification.badge.set(allNoRead,function (succ) {
      //     alert("成功"+succ);
      //   },function (err) {
      //     alert("失败"+err);
      //   });
      //
      // },function (err) {
      //
      // })
        // cordova.plugins.notification.badge.increase(1, function (badge) {
        //   // badge is now 11 (10 + 1)
        //   alert("成功"+badge);
        // });
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

    });
    var backButtonPressedOnceToExit=false;
    //登陆界面直接退出


    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        cordova.plugins.Keyboard.disableScroll(true);

        //延迟splash screnn 隐藏时间,不然会有短暂的白屏出现
        setTimeout(function () {
          navigator.splashscreen.hide();
        }, 1000);
      }
    });

    $ionicPlatform.registerBackButtonAction(function(e) {
      if ($location.path() == '/login'||$location.path() == '/welcome'||$location.path() == '/newsPage'||$location.path() == '/gesturelogin'){
        if (backButtonPressedOnceToExit) {
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
    }, 501);


  });




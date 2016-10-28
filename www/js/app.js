// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'im.routes','im.directives','monospaced.elastic',
  'ngCordova','application.controllers','contacts.controllers','login.controllers','message.controllers',
  'my.controllers','search.controllers','selectgroup.controllers','notification.controllers','common.services','contacts.services',
  'message.services','my.services','group.services','selectothergroup.controllers','localphone.controllers','localphone.services','fileandpicture.controllers','badge.controllers','newnotification.controllers'])

/*'im.controllers', 'starter.services',*/
  .run(function($ionicPlatform,$ionicPopup, $rootScope, $location,$mqtt,$state,$ionicHistory,$api,$ionicLoading,$ToastUtils) {
    $ionicPlatform.ready(function() {
      $api.init();
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

    $ionicPlatform.registerBackButtonAction(function(e) {
      if ($location.path() == '/login'||$location.path() == '/tab/chats'||$location.path() == '/tab/notifications'||$location.path() == '/tab/message///'||$location.path() == '/tab/account'||$location.path() == '/tab/contacts'||$location.path() == '/welcome'||$location.path() == '/newsPage'||$location.path() == '/gesturelogin'){
        if (backButtonPressedOnceToExit) {
          ionic.Platform.exitApp();
        } else {
          backButtonPressedOnceToExit = true;
          $ToastUtils.showToast('再按一次退出系统');
          setTimeout(function () {
            backButtonPressedOnceToExit = false;
          }, 1500);
        }
      }else {
        $ionicHistory.goBack();
        $ionicLoading.hide();
      }
      e.preventDefault();
      return false;
    }, 501);


  });

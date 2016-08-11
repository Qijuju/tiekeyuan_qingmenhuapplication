/**
 * Created by yy on 2016/5/30.
 */
angular.module('im.routes', [])
  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('left');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.message', {
        url: '/message/:id/:sessionid/:account',
        cache:false,
        views: {
          'tab-message': {
            templateUrl: 'templates/tab-message.html',
            controller: 'MessageCtrl'
          }
        }
      })

      .state('messageDetail', {
        url: '/messageDetail',
        templateUrl: 'templates/message-detail.html',
        controller: 'MessageDetailCtrl'


      })


      .state('messageGroup', {
        url: '/messageGroup',
        templateUrl: 'templates/message-group.html',
        controller: 'MessageGroupCtrl'


      })

      .state('topContacts', {
        url: '/topContacts',
        templateUrl: 'templates/top_contacts.html',


      })
      .state('myAttention', {
        url: '/myAttention',
        templateUrl: 'templates/my_attention.html',


      })


      .state('myAttention1', {

        url: '/myAttentionSelect',
        cache: false,
        templateUrl: 'templates/my_attention_select.html',
        controller: 'myAttentionSelectCtrl'

      })


      .state('personalSetting', {
        url: '/personalSetting',
        templateUrl: 'templates/personal-setting.html',
        controller: 'SettingAccountCtrl'
      })

      .state('groupSetting', {
        url: '/groupSetting',
        templateUrl: 'templates/group-setting.html',
      })


      .state('tab.contacts', {
        url: '/contacts',
        views: {
          'tab-contacts': {
            templateUrl: 'templates/tab-contacts.html',
            controller: 'ContactsCtrl'
          }
        },
        cache:false
      })

      .state('second', {
        url: '/second',
        templateUrl: 'templates/contact-second.html',
        controller: 'ContactSecondCtrl'
      })
      .state('third', {
        url: '/third/:contactId',
        templateUrl: 'templates/contact-third.html',
        controller: 'ContactThirdCtrl',

      })
      .state('forth', {
        url: '/forth/:contactId',
        templateUrl: 'templates/contact-forth.html',
        controller: 'ContactForthCtrl'

      })
      .state('fifth', {
        url: '/fifth/:contactId',
        templateUrl: 'templates/contact-fifth.html',
        controller: 'ContactFifthCtrl'

      })
      .state('sixth', {
        url: '/sixth/:contactId',
        templateUrl: 'templates/contact-sixth.html',
        controller: 'ContactSixthCtrl'

      })
      .state('seventh', {
        url: '/seventh/:contactId',
        templateUrl: 'templates/contact-seventh.html',
        controller: 'ContactSeventhCtrl'

      })

      .state('mydepartment', {
        url: '/mydepartment',
        templateUrl: 'templates/my_department.html',
        controller: 'MyDepartmentCtrl'

      })

      .state('person', {
        url: '/person',
        templateUrl: 'templates/person-detail.html',
        controller: 'PersonCtrl',
        params: {
          obj: null
        }

      })

      .state('group', {
        url: '/group',
        templateUrl: 'templates/contact-group.html',
        controller: 'GroupCtrl'

      })

      .state('localContacts', {
        url: '/localContacts',
        templateUrl: 'templates/contact-local.html',
        controller: 'LocalContactCtrl'

      })

      .state('tab.chats', {
        url: '/chats',
        views: {
          'tab-chats': {
            templateUrl: 'templates/tab-chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })
      .state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
          'tab-chats': {
            templateUrl: 'templates/chat-detail.html',
            controller: 'ChatDetailCtrl'
          }
        }
      })

      .state('login', {
        url: '/login',
        cache: false,
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl',
      })

      .state('tab.account', {
        url: '/account',
        cache: false,
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'AccountCtrl',
          }
        }
      })

      .state('historymessage',{
        url:'/historymessage',
        cache:false,
        templateUrl: 'templates/historymessage.html',
        controller: 'HistoryCtrl'
      })
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

  });

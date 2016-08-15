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
        url: '/message/:id/:sessionid',
        cache:false,
        views: {
          'tab-message': {
            templateUrl: 'templates/tab-message.html',
            controller: 'MessageCtrl'
          }
        }
      })

      .state('messageDetail', {
        url: '/messageDetail/:id/:ssid',
        templateUrl: 'templates/message-detail.html',
        cache:false,
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
        controller: 'TopContactsCtrl'


      })
      .state('myAttention', {
        url: '/myAttention',
        templateUrl: 'templates/my_attention.html',
        controller: 'myattentionaaaSelectCtrl',
        cache: false
      })


      .state('myAttention1', {

        url: '/myAttentionSelect',
        cache: false,
        templateUrl: 'templates/my_attention_select.html',
        controller: 'myAttentionSelectCtrl'

      })


      .state('personalSetting', {
        url: '/personalSetting/:id/:ssid',
        templateUrl: 'templates/personal-setting.html',
        controller: 'SettingAccountCtrl'
      })

      .state('groupSetting', {
        url: '/groupSetting',
        templateUrl: 'templates/group-setting.html',
        controller: 'groupSettingCtrl'
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
        url: '/second/:contactId',
        templateUrl: 'templates/contact-second.html',
        controller: 'ContactSecondCtrl',
        cache:false

      })
      .state('third', {
        url: '/third/:contactId/:secondname',
        templateUrl: 'templates/contact-third.html',
        controller: 'ContactThirdCtrl',
        cache:false

      })
      .state('forth', {
        url: '/forth/:contactId/:secondname/:thirdname',
        templateUrl: 'templates/contact-forth.html',
        controller: 'ContactForthCtrl',
        cache:false

      })
      .state('fifth', {
        url: '/fifth/:contactId/:secondname/:thirdname/:forthname',
        templateUrl: 'templates/contact-fifth.html',
        controller: 'ContactFifthCtrl',
        cache:false

      })
      .state('sixth', {
        url: '/sixth/:contactId/:secondname/:thirdname/:forthname/:fifthname',
        templateUrl: 'templates/contact-sixth.html',
        controller: 'ContactSixthCtrl',
        cache:false

      })
      .state('seventh', {
        url: '/seventh/:contactId/:secondname/:thirdname/:forthname/:fifthname/:sixthname',
        templateUrl: 'templates/contact-seventh.html',
        controller: 'ContactSeventhCtrl',
        cache:false

      })

      .state('mydepartment', {
        url: '/mydepartment',
        templateUrl: 'templates/my_department.html',
        controller: 'MyDepartmentCtrl'

      })

      .state('person', {
        url: '/person/:userId',
        templateUrl: 'templates/person-detail.html',
        controller: 'PersonCtrl',
        cache:false
      })

      .state('group', {
        url: '/group',
        templateUrl: 'templates/contact-group.html',
        controller: 'GroupCtrl',
        cache:false

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

      .state('search', {
        url: '/search',
        templateUrl: 'templates/search.html',
        controller: 'searchCtrl',
        cache:false
      })

      .state('searchdetail', {
        url: '/searchdetail/:UserID',
        templateUrl: 'templates/searchDetail.html',
        controller: 'searchDetailCtrl',
        cache:false
      })

      .state('addnewpersonfirst', {
        url: '/addnewpersonfirst',
        templateUrl: 'templates/addNewPerson-first.html',
        controller: 'addNewPersonfirstCtrl'
      })
      .state('addnewpersonsecond', {
        url: '/addnewpersonsecond/:contactId',
        templateUrl: 'templates/addNewPerson-second.html',
        controller: 'addNewPersonsecondCtrl'
      })
      .state('addnewpersonthird', {
        url: '/addnewpersonthird/:contactId',
        templateUrl: 'templates/addNewPerson-third.html',
        controller: 'addNewPersonthirdCtrl'
      })
      .state('addnewpersonforth', {
        url: '/addnewpersonforth/:contactId',
        templateUrl: 'templates/addNewPerson-forth.html',
        controller: 'addNewPersonforthCtrl'
      })
      .state('addnewpersonfifth', {
        url: '/addnewpersonfifth/:contactId',
        templateUrl: 'templates/addNewPerson-fifth.html',
        controller: 'addNewPersonfifthCtrl'
      })
      .state('addnewpersonsixth', {
        url: '/addnewpersonsixth/:contactId',
        templateUrl: 'templates/addNewPerson-sixth.html',
        controller: 'addNewPersonsixthCtrl'
      })
      .state('searchlocal', {
        url: '/searchlocal',
        templateUrl: 'templates/searchLocal.html',
        controller: 'searchLocalCtrl'
      })

      .state('attentionDetail', {
        url: '/attentionDetail/:UserIDatten',
        templateUrl: 'templates/attentionDetail.html',
        controller: 'attentionDetailCtrl',
        cache:false
      })

      .state('historyMessage', {
        url: '/historyMessage/:id/:ssid',
        templateUrl: 'templates/historymessage.html',
        controller: 'historyMessageCtrl',
        cache:false
      })
      .state('myinformation', {
        url: '/myinformation/:UserIDfor',
        templateUrl: 'templates/myinfomation.html',
        controller: 'myinformationCtrl',
        cache:false
      })
      .state('accountsettion', {
        url: '/accountsettion/:UserIDset',
        templateUrl: 'templates/acount-setting.html',
        controller: 'accountsettionCtrl',
        cache:false
      })
      .state('aboutours', {
        url: '/aboutours/:UserIDabout',
        templateUrl: 'templates/aboutours.html',
        controller: 'aboutoursCtrl',
        cache:false
      })
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

  });

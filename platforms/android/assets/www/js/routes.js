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
      .state('welcome', {
        url: '/welcome',
        templateUrl: 'templates/welcome.html',
        controller: 'welcomeCtrl'
      })
      .state('newspage', {
        url: '/newspage',
        templateUrl: 'templates/newsPage.html',
        controller: 'newspageCtrl'
      })
      .state('datapicture', {
        url: '/datapicture',
        templateUrl: 'templates/datapicture.html',
        controller: 'datapictureCtrl',
        cache:false
      })
      .state('twoDimensionPic', {
        url: '/twoDimensionPic',
        templateUrl: 'templates/twoDimensionPic.html',
        controller: 'twoDimensionPicCtrl',
        cache:false
      })
      .state('groupcall', {
        url: '/groupcall',
        templateUrl: 'templates/groupcall.html',
        controller: 'groupcallCtrl',
        cache:false
      })
      .state('gesturepassword', {
        url: '/gesturepassword',
        templateUrl: 'templates/gesturepassword.html',
        controller: 'gesturepasswordCtrl',
        cache:false
      })
      .state('updategespassword', {
        url: '/updategespassword',
        templateUrl: 'templates/updategespassword.html',
        controller: 'updategespasswordCtrl',
        cache:false
      })
      // Each tab has its own nav history stack:

      .state('tab.message', {
        url: '/message/:id/:sessionid/:grouptype',
        cache:false,
        views: {
          'tab-message': {
            templateUrl: 'templates/tab-message.html',
            controller: 'MessageCtrl'
          }
        }
      })

      .state('tab.notification', {
        url: '/notification',
        cache:false,
        views: {
          'tab-notification': {
            templateUrl: 'templates/tab-notification.html',
            controller: 'notificationCtrl'
          }
        }
      })

      .state('tab.notifications', {
        url: '/notifications',
        cache:false,
        views: {
          'tab-notifications': {
            templateUrl: 'templates/tab-notifications.html',
            controller: 'notificationsCtrl'
          }
        }
      })

      .state('notificationDetail', {
        url: '/notificationDetail/:id/:name/:type',
        templateUrl: 'templates/notificationDetail.html',
        cache:false,
        controller: 'notificationDetailCtrl'
      })


      .state('messageDetail', {
        url: '/messageDetail/:id/:ssid/:grouptype/:longitude/:latitude',
        templateUrl: 'templates/message-detail.html',
        cache:false,
        controller: 'MessageDetailCtrl'


      })


      .state('messageGroup', {
        url: '/messageGroup/:id/:chatName/:grouptype/:ismygroup',
        templateUrl: 'templates/message-group.html',
        cache:false,
        controller: 'MessageGroupCtrl'


      })

      .state('topContacts', {
        url: '/topContacts',
        templateUrl: 'templates/top_contacts.html',
        controller: 'TopContactsCtrl',
        cache:false


      })
      .state('myAttention', {
        url: '/myAttention',
        templateUrl: 'templates/my_attention.html',
        controller: 'myattentionaaaSelectCtrl',
        cache: false
      })




      .state('personalSetting', {
        url: '/personalSetting/:id/:ssid',
        templateUrl: 'templates/personal-setting.html',
        controller: 'SettingAccountCtrl'
      })

      .state('groupSetting', {
        url: '/groupSetting/:groupid/:chatname/:grouptype/:ismygroup',
        templateUrl: 'templates/group-setting.html',
        controller: 'groupSettingCtrl',
        cache:false
      })
      .state('groupModifyName', {
        url: '/groupModifyName/:groupid/:groupname',
        templateUrl: 'templates/group-modifyname.html',
        controller: 'groupModifyNameCtrl',
        cache:false

      })
      .state('groupNotice', {
        url: '/groupNotice/:groupid/:grouptype/:groupname/:ismygroup',
        templateUrl: 'templates/group-notice.html',
        controller: 'groupNoticeCtrl',
        cache:false

      })
      .state('groupCreateNotice', {
        url: '/groupCreateNotice/:groupid/:grouptype/:groupname/:grouptext',
        templateUrl: 'templates/group-createNotice.html',
        controller: 'groupCreateNoticeCtrl',
        cache:false

      })

      .state('groupMember', {
        url: '/groupMember/:groupid/:chatname/:grouptype/:ismygroup',
        templateUrl: 'templates/group-member.html',
        controller: 'groupMemberCtrl',
        cache:false

      })

      .state('groupDeptMember', {
        url: '/groupDeptMember/:groupid/:chatname/:grouptype',
        templateUrl: 'templates/group-deptmember.html',
        controller: 'groupDeptMemberCtrl',
        cache:false

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
      .state('eighth', {
        url: '/eighth/:contactId/:secondname/:thirdname/:forthname/:fifthname/:sixthname/:seventhname',
        templateUrl: 'templates/contact-eighth.html',
        controller: 'ContactEighthCtrl',
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
        controller: 'LocalContactCtrl',
        cache:false

      })

      .state('tab.chats', {
        url: '/chats',
        cache: false,
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
      .state('gesturelogin', {
        url: '/gesturelogin',
        cache: false,
        templateUrl: 'templates/gesturelogin.html',
        controller: 'gestureloginCtrl'
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

      .state('searchmessage', {
        url: '/searchmessage/:UserIDSM/:UserNameSM',
        templateUrl: 'templates/searchmessage.html',
        controller: 'searchmessageCtrl',
        cache:false
      })
      .state('searchmessage22', {
        url: '/searchmessage22/:UserIDSM/:UserNameSM/:Username2/:Usermessage2',
        templateUrl: 'templates/searchmessage2.html',
        controller: 'searchmessage22Ctrl',
        cache:false
      })

      .state('searchdetail', {
        url: '/searchdetail/:UserID',
        templateUrl: 'templates/searchDetail.html',
        controller: 'searchDetailCtrl',
        cache:false
      })

      .state('addnewpersonfirst', {
        url: '/addnewpersonfirst/:createtype/:groupid/:groupname',
        templateUrl: 'templates/addNewPerson-first.html',
        controller: 'addNewPersonfirstCtrl',
        cache:false,
      })
      .state('addnewpersonsecond', {
        url: '/addnewpersonsecond/:contactId:/:createtype/:groupid/:groupname',
        templateUrl: 'templates/addNewPerson-second.html',
        controller: 'addNewPersonsecondCtrl',
        cache:false,
      })
      .state('addnewpersonthird', {
        url: '/addnewpersonthird/:contactId/:secondname/:createtype/:groupid/:groupname',
        templateUrl: 'templates/addNewPerson-third.html',
        controller: 'addNewPersonthirdCtrl',
        cache:false,
      })
      .state('addnewpersonforth', {
        url: '/addnewpersonforth/:contactId/:secondname/:thirdname/:createtype/:groupid/:groupname',
        templateUrl: 'templates/addNewPerson-forth.html',
        controller: 'addNewPersonforthCtrl',
        cache:false

      })
      .state('addnewpersonfifth', {
        url: '/addnewpersonfifth/:contactId/:secondname/:thirdname/:forthname/:createtype/:groupid/:groupname',
        templateUrl: 'templates/addNewPerson-fifth.html',
        controller: 'addNewPersonfifthCtrl',
        cache:false

      })
      .state('addnewpersonsixth', {
        url: '/addnewpersonsixth/:contactId/:secondname/:thirdname/:forthname/:fifthname/:createtype/:groupid/:groupname',
        templateUrl: 'templates/addNewPerson-sixth.html',
        controller: 'addNewPersonsixthCtrl',
        cache:false

      })
      .state('addnewpersonseventh', {
        url: '/addnewpersonseventh/:contactId/:secondname/:thirdname/:forthname/:fifthname/:sixthname/:createtype/:groupid/:groupname',
        templateUrl: 'templates/addNewPerson-seventh.html',
        controller: 'addNewPersonseventhCtrl',
        cache:false

      })

      .state('addnewpersoneighth', {
        url: '/addnewpersoneighth/:contactId/:secondname/:thirdname/:forthname/:fifthname/:sixthname/:seventhname/:createtype/:groupid/:groupname',
        templateUrl: 'templates/addNewPerson-eighth.html',
        controller: 'addNewPersoneighthCtrl',
        cache:false

      })



      .state('searchlocal', {
        url: '/searchlocal',
        templateUrl: 'templates/searchLocal.html',
        controller: 'searchLocalCtrl',
      })

      .state('attentionDetail', {
        url: '/attentionDetail/:UserIDatten',
        templateUrl: 'templates/attentionDetail.html',
        controller: 'attentionDetailCtrl',
        cache:false
      })

      .state('historyMessage', {
        url: '/historyMessage/:id/:ssid/:grouptype',
        templateUrl: 'templates/historymessage.html',
        controller: 'historyMessageCtrl',
        cache:false
      })
      .state('historymessagegroup', {
        url: '/historymessagegroup/:id/:ssid/:grouptype',
        templateUrl: 'templates/historymessagegroup.html',
        controller: 'historymessagegroupCtrl',
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
      .state('sendGelocation', {
        url: '/sendGelocation/:topic/:id/:ssid/:localuser/:localuserId/:sqlid/:grouptype/:messagetype',
        templateUrl: 'templates/sendGelocation.html',
        controller: 'sendGelocationCtrl',
        cache:false
      })
      .state('mapdetail', {
        url: '/mapdetail/:id/:ssid/:grouptype/:longitude/:latitude',
        templateUrl: 'templates/mapdetail.html',
        controller: 'mapdetailCtrl',
        cache:false
      })

      .state('personpicture', {
        url: '/personpicture',
        templateUrl: 'templates/person-picture.html',
        controller: 'personpictureCtrl',
        cache:false
      })

      .state('personfile', {
        url: '/personfile',
        templateUrl: 'templates/person-file.html',
        controller: 'personfileCtrl',
        cache:false
      })

      .state('grouppicture', {
        url: '/grouppicture',
        templateUrl: 'templates/group-picture.html',
        controller: 'grouppictureCtrl',
        cache:false
      })
      
      .state('groupfile', {
        url: '/groupfile',
        templateUrl: 'templates/group-file.html',
        controller: 'groupfileCtrl',
        cache:false
      })









    // if none of the above states are matched, use this as the fallback
    //入口
    // $urlRouterProvider.otherwise('/welcome');
    $urlRouterProvider.otherwise('/login');

  });

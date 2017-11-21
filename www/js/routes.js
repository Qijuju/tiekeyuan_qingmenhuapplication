/**
 * Created by yy on 2016/5/30.
 */
angular.module('im.routes', [])
  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // 根据不同设备，tabs位置、样式不同设置
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


    // if none of the above states are matched, use this as the fallback
    //入口默认路径
    // $urlRouterProvider.otherwise('/welcome');
    // $urlRouterProvider.otherwise('/login');
    $urlRouterProvider.otherwise('/newsPage');

    $stateProvider

      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'tabsCtrl'

      })
      .state('welcome', {
        url: '/welcome',
        templateUrl: 'templates/welcome.html',
        controller: 'welcomeCtrl',
        cache:false
      })
      .state('newsPage', {
        url: '/newsPage',
        cache: false,
        templateUrl: 'templates/newsPage.html',
        controller: 'newsPageCtrl'
      })
      .state('login', {
        url: '/login',
        cache: false,
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })
        //暂时关闭手势密码登陆的功能
      // .state('gesturelogin', {
      //   url: '/gesturelogin',
      //   cache: false,
      //   templateUrl: 'templates/gesturelogin.html',
      //   controller: 'gestureloginCtrl'
      // })
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
            controller: 'newnotificationCtrl'
          }
        },
        reload:true
      })
      .state('tab.webpage', {
        url: '/webpage',
        cache:false,
        views: {
          'tab-webpage': {
            templateUrl: 'templates/tab-webpage.html',
            controller: 'webpageCtrl'
          }
        }
      })

      .state('tab.work', {
        url: '/work',
        cache:false,
        views: {
          'tab-work': {
            templateUrl: 'templates/tab-work.html',
            controller:'WorkCtrl'
          }
        }
      })
      .state('tab.portal', {
        url: '/portal',
        cache:false,
        views: {
          'tab-portal': {
            templateUrl: 'templates/tab-portal.html',
            controller: 'portalCtrl2'
          }
        },
        reload:true
      })
      //rxy 页面详情路由
      .state('cxtx', {
        url: '/cxtx/:appId/:userId/:appUrl',
        templateUrl: 'templates/cxtx.html',
        controller: 'OhterCtrl',
        cache:false
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
        controller: 'newnotificationDetailCtrl'
      })

      .state('notifyDetail', {
        url: '/notifyDetail',
        templateUrl: 'templates/notifyDetail.html',
        cache:false,
        controller: 'notifyDetailCtrl',
        params:{
          obj:null
        }
      })

      .state('notifyApplication', {
        url: '/notifyApplication/:id/:isfirm',
        templateUrl: 'templates/notifyApplication.html',
        cache:false,
        controller: 'notifyApplicationCtrl'
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
        url: '/personalSetting/:id/:ssid/:sessionid',
        templateUrl: 'templates/personal-setting.html',
        controller: 'SettingAccountCtrl',
        cache:false
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
        cache:false,
        views: {
          'tab-contacts': {
            templateUrl: 'templates/tab-contacts.html',
            controller: 'ContactsCtrl'
          }
        }
      })

      .state('second', {
        url: '/second/:contactId/:childcount',
        templateUrl: 'templates/contact-second.html',
        controller: 'ContactSecondCtrl',
        cache:false

      })
      .state('third', {
        url: '/third/:contactId/:secondname/:childcount',
        templateUrl: 'templates/contact-third.html',
        controller: 'ContactThirdCtrl',
        cache:false

      })
      .state('forth', {
        url: '/forth/:contactId/:secondname/:thirdname/:childcount',
        templateUrl: 'templates/contact-forth.html',
        controller: 'ContactForthCtrl',
        cache:false

      })
      .state('fifth', {
        url: '/fifth/:contactId/:secondname/:thirdname/:forthname/:childcount',
        templateUrl: 'templates/contact-fifth.html',
        controller: 'ContactFifthCtrl',
        cache:false

      })
      .state('sixth', {
        url: '/sixth/:contactId/:secondname/:thirdname/:forthname/:fifthname/:childcount',
        templateUrl: 'templates/contact-sixth.html',
        controller: 'ContactSixthCtrl',
        cache:false

      })
      .state('seventh', {
        url: '/seventh/:contactId/:secondname/:thirdname/:forthname/:fifthname/:sixthname/:childcount',
        templateUrl: 'templates/contact-seventh.html',
        controller: 'ContactSeventhCtrl',
        cache:false

      })
      .state('eighth', {
        url: '/eighth/:contactId/:secondname/:thirdname/:forthname/:fifthname/:sixthname/:seventhname/:childcount',
        templateUrl: 'templates/contact-eighth.html',
        controller: 'ContactEighthCtrl',
        cache:false

      })

      .state("masstexting",{
        url:'/masstexting/:topicids',
        templateUrl:'templates/mass_texting.html',
        controller:'masstextingCtrl',
        cache:false
      })

      .state("founction",{
        url:'/founction',
        templateUrl:'templates/founction.html',
        controller:'founctionCtrl',
        cache:false
      })


      .state('mydepartment', {
        url: '/mydepartment',
        templateUrl: 'templates/my_department.html',
        controller: 'MyDepartmentCtrl',
        cache:false
      })

      .state('person', {
        url: '/person/:userId',
        templateUrl: 'templates/person-detail.html',
        controller: 'PersonCtrl',
        cache:false
      })

      // 我的群组
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
        cache:false,
        views: {
          'tab-chats': {
            templateUrl: 'templates/chat-detail.html',
            controller: 'ChatDetailCtrl'
          }
        }
      })



      .state('tab.account', {
        url: '/account',
        cache: false,
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'AccountCtrl'
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
        controller: 'searchCtrl',
        cache:false
      })
      .state('searchmessage22', {
        url: '/searchmessage22/:UserIDSM/:UserNameSM/:Username2/:Usermessage2',
        templateUrl: 'templates/searchmessage2.html',
        controller: 'searchmessage22Ctrl',
        cache:false
      })

      //functiontag:用来区分群聊还是群发文件
      .state('addnewpersonfirst', {
        url: '/addnewpersonfirst/:createtype/:groupid/:groupname/:functiontag',
        templateUrl: 'templates/addNewPerson-first.html',
        controller: 'addNewPersonfirstCtrl',
        cache:false
      })
      .state('addnewpersonsecond', {
        url: '/addnewpersonsecond/:contactId:/:createtype/:groupid/:groupname/:functiontag',
        templateUrl: 'templates/addNewPerson-second.html',
        controller: 'addNewPersonsecondCtrl',
        cache:false
      })
      .state('addnewpersonthird', {
        url: '/addnewpersonthird/:contactId/:secondname/:createtype/:groupid/:groupname/:functiontag',
        templateUrl: 'templates/addNewPerson-third.html',
        controller: 'addNewPersonthirdCtrl',
        cache:false
      })
      .state('addnewpersonforth', {
        url: '/addnewpersonforth/:contactId/:secondname/:thirdname/:createtype/:groupid/:groupname/:functiontag',
        templateUrl: 'templates/addNewPerson-forth.html',
        controller: 'addNewPersonforthCtrl',
        cache:false

      })
      .state('addnewpersonfifth', {
        url: '/addnewpersonfifth/:contactId/:secondname/:thirdname/:forthname/:createtype/:groupid/:groupname/:functiontag',
        templateUrl: 'templates/addNewPerson-fifth.html',
        controller: 'addNewPersonfifthCtrl',
        cache:false

      })
      .state('addnewpersonsixth', {
        url: '/addnewpersonsixth/:contactId/:secondname/:thirdname/:forthname/:fifthname/:createtype/:groupid/:groupname/:functiontag',
        templateUrl: 'templates/addNewPerson-sixth.html',
        controller: 'addNewPersonsixthCtrl',
        cache:false

      })
      .state('addnewpersonseventh', {
        url: '/addnewpersonseventh/:contactId/:secondname/:thirdname/:forthname/:fifthname/:sixthname/:createtype/:groupid/:groupname/:functiontag',
        templateUrl: 'templates/addNewPerson-seventh.html',
        controller: 'addNewPersonseventhCtrl',
        cache:false

      })

      .state('addnewpersoneighth', {
        url: '/addnewpersoneighth/:contactId/:secondname/:thirdname/:forthname/:fifthname/:sixthname/:seventhname/:createtype/:groupid/:groupname/:functiontag',
        templateUrl: 'templates/addNewPerson-eighth.html',
        controller: 'addNewPersoneighthCtrl',
        cache:false

      })



      .state('searchlocal', {
        url: '/searchlocal',
        templateUrl: 'templates/searchLocal.html',
        controller: 'searchLocalCtrl',
        cache:false
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
      .state('switch_account', {
        url: '/switch_account',
        templateUrl: 'templates/switch_account.html',
        controller: 'switchAccountCtrl',
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
        url: '/sendGelocation/:topic/:id/:ssid/:localuser/:localuserId/:sqlid/:grouptype/:messagetype/:ismygroup/:chatname',
        templateUrl: 'templates/sendGelocation.html',
        controller: 'sendGelocationCtrl',
        cache:false
      })
      .state('mapdetail', {
        url: '/mapdetail/:id/:ssid/:grouptype/:longitude/:latitude/:ismygroup',
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
        url: '/personfile/:sessionid',
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
        url: '/groupfile/:sessionid',
        templateUrl: 'templates/group-file.html',
        controller: 'groupfileCtrl',
        cache:false
      })


      .state('personlocation', {
        url: '/personlocation/:id/:ssid',
        templateUrl: 'templates/person-location.html',
        controller: 'historyMessageCtrl',
        cache:false
      })

      .state('grouplocation', {
        url: '/grouplocation/:id/:grouptype',
        templateUrl: 'templates/group-location.html',
        controller: 'historymessagegroupCtrl',
        cache:false
      })
      .state('emergencycall', {
        url: '/emergencycall',
        templateUrl: 'templates/emergencycall.html',
        controller: 'emergencycallCtrl',
        cache:false
      })

      .state('confirmornot', {
        url: '/confirmornot/:id',
        templateUrl: 'templates/notify-confirm.html',
        controller: 'confirmornotCtrl',
      })
      .state('netconfirm', {
        url: '/netconfirm/:url',
        templateUrl: 'templates/net-confirm.html',
        controller: 'netconfirmCtrl',
        cache:false

      })

      // 关于我们
      .state('aboutOur', {
        templateUrl: 'templates/aboutour.html',
        controller: 'aboutOurCtrl'
      })
      // 关于平台
      .state('aboutPlatform', {
        templateUrl: 'templates/aboutPlatform.html',
        controller: 'aboutPlatformCtrl'
      })
      // 关于推荐
      .state('aboutRecommend', {
        templateUrl: 'templates/aboutRecommend.html',
        controller: 'aboutPlatformCtrl'
      })

      //短信验证界面
      .state('msgCheck',{
        url: '/msgCheck/:errCode/:mobile/:userId/:mepId/:remPwd',
        templateUrl: 'templates/verify.html',
        controller: 'msgcheckCtrl'
      })

      //轻门户--工程部位应用选择功能模块
      .state('projectPart', {
        url: '/projectPart/:appId/:imCode/:userId',
        templateUrl: 'templates/projectPart.html',
        controller: 'projectPartCtrl'
      })

  });

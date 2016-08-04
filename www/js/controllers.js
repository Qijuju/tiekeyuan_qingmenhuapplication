angular.module('im.controllers', [])


  .controller('DashCtrl', function ($scope) {
  })

  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // /*$scope.chats = Chats.all();
    // $scope.remove = function (chat) {
    //   Chats.remove(chat);
    // };*/

    // 一个提示对话框
    $scope.showAlert = function(msg) {
      alert(msg);
    }
  })

  .controller('ContactsCtrl',  function ($scope, $http, $state,$stateParams,$greendao) {
    alert("laile");






    $greendao.loadAllData('TopContactsService',function (msg) {

      $scope.tops=msg;
      alert($scope.tops.length);
    },function (err) {

    })



    $scope.goto = function () {
      $state.go("second");
    }


  })

  .controller('ContactSecondCtrl', ['$scope', '$http', '$state', '$stateParams', 'contactService', function ($scope, $http, $state, $stateParams, contactService) {

    $scope.secondlength=(document.getElementById('a1').innerText.length+document.getElementById('a2').innerText.length)*15+50;

    var seconddiv=document.getElementById("secondscroll");
    seconddiv.style.width=$scope.secondlength+"px";

    contactService.getContacts().then(function (response) {
      $scope.names = response;

    });

    $scope.contactId = $stateParams.contactId;
    $scope.contactsInfo = contactService.getContactById($stateParams.contactId);



  }])


  .controller('ContactThirdCtrl', ['$scope', '$http', '$state', '$stateParams', 'contactService', function ($scope, $http, $state, $stateParams, contactService) {
    contactService.getContacts().then(function (response) {
      $scope.names = response;

    });

    $scope.contactId = $stateParams.contactId;
    $scope.contactsInfo = contactService.getContactById($stateParams.contactId)
    $scope.namelength3=$scope.contactsInfo.deptname.length



    $scope.backsecond = function (contactinfo) {
      $state.go("second", {
        "contactId": contactinfo.parentdeptid
      });
    }

    $scope.thirdlength=(document.getElementById('a1').innerText.length+document.getElementById('a2').innerText.length+$scope.namelength3)*15+100;

    var thirddiv=document.getElementById("thirdscroll");
    thirddiv.style.width=$scope.thirdlength+"px";

  }])

  .controller('ContactForthCtrl', ['$scope', '$http', '$state', '$stateParams', 'contactService', function ($scope, $http, $state, $stateParams, contactService) {


    $scope.contactId = $stateParams.contactId;


    contactService.getContactThirdById($scope.contactId).then(function (response) {
      $scope.thirdNames = response;

    });


    $scope.contactsInfo = contactService.getContactById($stateParams.contactId)
    $scope.namelength43=$scope.contactsInfo.deptname.length

    $scope.parent = contactService.getParentById($scope.contactsInfo)
    $scope.namelength44=$scope.parent.deptname.length

    $scope.backToThird = function (contactinfo) {
      $state.go("third", {
        "contactId": contactinfo.parentdeptid
      });
    }


    $scope.detailPerson = function (item) {
      $state.go("person", {
        obj: item
      })
    }

    $scope.forthlength=(document.getElementById('a1').innerText.length+document.getElementById('a2').innerText.length+$scope.namelength43+ $scope.namelength44)*15+150;

    var forthdiv=document.getElementById("forthscroll");
    forthdiv.style.width=$scope.forthlength+"px";
  }])


  .controller('ContactFifthCtrl', ['$scope', '$http', '$state', '$stateParams', 'contactService', function ($scope, $http, $state, $stateParams, contactService) {


    contactService.getContacts().then(function (response) {
      $scope.names = response;

    });

    $scope.contactId = $stateParams.contactId;
    $scope.contactsInfo = contactService.getContactById($stateParams.contactId)


    $scope.goSixth = function () {
      $state.go("sixth");
    }

  }])

  .controller('ContactSixthCtrl', ['$scope', '$http', '$state', '$stateParams', 'contactService', function ($scope, $http, $state, $stateParams, contactService) {


    contactService.getContacts().then(function (response) {
      $scope.names = response;

    });

    $scope.contactId = $stateParams.contactId;
    $scope.contactsInfo = contactService.getContactById($stateParams.contactId)


    $scope.goSeventh = function () {
      $state.go("seventh");
    }

  }])

  .controller('ContactSeventhCtrl', ['$scope', '$http', '$state', '$stateParams', 'contactService', function ($scope, $http, $state, $stateParams, contactService) {


    contactService.getContacts().then(function (response) {
      $scope.names = response;

    });

    $scope.contactId = $stateParams.contactId;
    $scope.contactsInfo = contactService.getContactById($stateParams.contactId)


    // $scope.goSixth = function () {
    //   $state.go("sixth");
    // }

  }])


  .controller('MyDepartmentCtrl', ['$scope', '$http', '$state', '$stateParams', 'contactService', function ($scope, $http, $state, $stateParams, contactService) {

    $scope.contactId = $stateParams.contactId;


    contactService.getContactThirdById($scope.contactId).then(function (response) {
      $scope.thirdNames = response;

    });


    $scope.contactsInfo = contactService.getContactById($stateParams.contactId)

    $scope.parent = contactService.getParentById($scope.contactsInfo)

    $scope.backsecond = function (contactinfo) {
      $state.go("second", {
        "contactId": contactinfo.parentdeptid
      });
    }


    $scope.detailPerson = function (item) {
      $state.go("person", {
        obj: item
      })
    }
    $scope.goForth = function () {
      $state.go("forth");
    }

  }])


  .controller('PersonCtrl', ['$scope', '$http', 'contactService', '$stateParams', '$state','$phonepluin','$savaLocalPlugin', function ($scope, $http, contactService, $stateParams, $state, $phonepluin,$savaLocalPlugin) {

    $scope.detailPerson = $stateParams.obj;
    if ($scope.detailPerson.name.length === 3) {
      $scope.simpleName = $scope.detailPerson.name.substr(1, 2);
    } else {
      $scope.simpleName = $scope.detailPerson.name;

    }

    $scope.backForth = function (contactId) {
      $state.go("forth", {
        "contactId": contactId
      });
    }

    //存本地
    $scope.insertPhone = function(name,phonenumber) {
      $savaLocalPlugin.insert(name,phonenumber);
    };

    //打电话
    $scope.call = function(phonenumber,name) {
      alert(name)
      $phonepluin.call(phonenumber,name);
    };
    //发短信
    $scope.sms = function(phonenumber) {
      $phonepluin.sms(phonenumber);
    };

  }])


  .controller('MessageDetailCtrl', function ($scope, $state,$http, $ionicScrollDelegate,$mqtt,$ionicActionSheet,$greendao,$timeout) {
    // document.addEventListener('deviceready',function () {
    //   messages.getMsgsBySingle(function (data) {
    //     alert("调用single");
    //     console.log(data);    //还没保存数据目前打印的是空数组
    //     alert(data);
    //     $scope.msgs = data;
    //   });
    // });
    //清表数据
    // $greendao.deleteAllData('MessagesService',function (data) {
    //   alert(data);
    // },function (err) {
    //   alert(err);
    // });
    $greendao.queryData('MessagesService','where type =?','User',function (data) {
      $scope.msgs=data;
    },function (err) {
      alert(err);
    });

    // $greendao.loadAllData('MessagesService',function (data) {
    //   // alert('success');
    //   // alert(data);
    //   $scope.msgs=data;
    // },function (err) {
    //   alert(err);
    // });
    var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
    var footerBar = document.body.querySelector('#messageDetail .bar-footer');
    var txtInput = angular.element(footerBar.querySelector('textarea'));

    $scope.$on('$ionicView.enter', function() {

      viewScroll.scrollBottom();

    });
    $scope.doRefresh = function () {

      $scope.$broadcast("scroll.refreshComplete")
    }

    window.addEventListener("native.keyboardshow", function (e) {
      viewScroll.scrollBottom();
    });

    $scope.sendSingleMsg = function (topic, content, id) {
      $scope.suc=$mqtt.sendMsg(topic, content, id);
      $scope.send_content="";
      keepKeyboardOpen();
    };
    function keepKeyboardOpen() {
      console.log('keepKeyboardOpen');
      txtInput.one('blur', function() {
        txtInput[0].focus();
      });

      $scope.onDrag=function () {
        var keyboard = cordova.require('ionic-plugin-keyboard.keyboard');
        keyboard.close();
      };

    }
    $mqtt.arriveMsg("");
    $scope.$on('msgs.update',function (event) {
      $scope.$apply(function () {
        $greendao.queryData('MessagesService','where type =?','User',function (data) {
          // alert("查询方法成功");
          $scope.msgs=data;
          $timeout(function() {
            viewScroll.scrollBottom();
          }, 100);
        },function (err) {
          alert(err);
        });
        // $greendao.loadAllData('MessagesService',function (data) {
        //   // alert(data+"update");
        //   $scope.msgs=data;
        // },function (err) {
        //   alert(err);
        // });

        // $scope.msgs=$mqtt.getAllMsg();
        //alert($scope.msgs.length);
        // $mqtt.getAllMsg($scope);

      })

    });


    $scope.$on('msgs.error',function (event) {
      //alert("发送失败");
      $scope.$apply(function () {
        $greendao.queryData('MessagesService','where type =?','User',function (data) {
          // alert("查询方法成功");
          $scope.msgs=data;
          $timeout(function() {
            viewScroll.scrollBottom();
          }, 100);
        },function (err) {
          alert(err);
        });
        // $greendao.loadAllData('MessagesService',function (data) {
        //   //alert(data+"senderrlist");
        //   $scope.msgs=data;
        //   viewScroll.scrollBottom();
        // },function (err) {
        //   alert(err);
        // });
        // $scope.msgs=$mqtt.getAllMsg();
        // $mqtt.getAllMsg($scope);
      })
    });

    // 点击按钮触发，或一些其他的触发条件
    $scope.resendshow = function(topic, content, id) {

      // 显示操作表
      $ionicActionSheet.show({
        buttons: [
          { text: '重新发送' },
          { text: '删除' },
        ],
        // destructiveText: '重新发送',
        // titleText: 'Modify your album',
        cancelText: '取消',
        buttonClicked: function(index) {
          if(index === 0){
            $scope.sendSingleMsg(topic, content, id);
          }else if(index === 1){

          }
          return true;
        }
      });

    };

    $scope.backFirstMenu=function () {
      $mqtt.clearMsgCount();
      $state.go("tab.message");
    }


  })


  .controller('MessageGroupCtrl',function ($scope,$state, $http, $ionicScrollDelegate,$mqtt,$ionicActionSheet,$greendao,$timeout) {
    // messages.getAllMsgs(function (data) {
    //   console.log(data);    //还没保存数据目前打印的是空数组
    //   alert(data);
    //   $scope.groupMsgs = data;
    // });
    $greendao.queryData('MessagesService','where type =?','Group',function (data) {
      // alert("查询方法成功");
      $scope.msgs=data;
    },function (err) {
      alert(err);
    });
    // $greendao.loadAllData('MessagesService',function (data) {
    //   // alert('success');
    //   // alert(data);
    //   $scope.msgs=data;
    // },function (err) {
    //   alert(err);
    // });
    // $scope.groupMsgs=$mqtt.getAllGroupMsg();

    var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
    var footerBar = document.body.querySelector('#messageGroupDetail .bar-footer');
    var txtInput = angular.element(footerBar.querySelector('textarea'));

    $scope.doRefresh = function () {

      $scope.$broadcast("scroll.refreshComplete")
    }

    window.addEventListener("native.keyboardshow", function (e) {
      viewScroll.scrollBottom();
    });

    $scope.sendSingleGroupMsg = function (topic, content,id) {
      $mqtt.sendGroupMsg(topic, content,id);
      $scope.send_content=""
      keepKeyboardOpen();
    };
    function keepKeyboardOpen() {
      console.log('keepKeyboardOpen');
      txtInput.one('blur', function() {
        txtInput[0].focus();
      });

      $scope.onDrag=function () {
        var keyboard = cordova.require('ionic-plugin-keyboard.keyboard');
        keyboard.close();
      };

    }
    $mqtt.rececivGroupMsg("cll");
    $scope.$on('groupMsgs.update',function (event) {

      $scope.$apply(function () {
        $greendao.queryData('MessagesService','where type =?','Group',function (data) {
          $scope.msgs=data;
          $timeout(function() {
            viewScroll.scrollBottom();
          }, 100);
        },function (err) {
          alert(err);
        });
        // $greendao.loadAllData('MessagesService',function (data) {
        //   // alert(data+"update");
        //   $scope.msgs=data;
        //   $timeout(function() {
        //     viewScroll.scrollBottom();
        //   }, 100);
        // },function (err) {
        //   alert(err);
        // });
        // $scope.groupMsgs=$mqtt.getAllGroupMsg();
        // $mqtt.getAllGroupMsg($scope);
        // alert($scope.groupMsgs.length)
        viewScroll.scrollBottom();
      })

    });

    $scope.$on('groupMsgs.error',function (event) {
      $scope.$apply(function () {
        $greendao.queryData('MessagesService','where type =?','Group',function (data) {
          $scope.msgs=data;
          $timeout(function() {
            viewScroll.scrollBottom();
          }, 100);
        },function (err) {
          alert(err);
        });
        // $greendao.loadAllData('MessagesService',function (data) {
        //   // alert(data+"update");
        //   $scope.msgs=data;
        //   $timeout(function() {
        //     viewScroll.scrollBottom();
        //   }, 100);
        // },function (err) {
        //   alert(err);
        // });
        // $scope.groupMsgs=$mqtt.getAllGroupMsg();
        // $mqtt.getAllGroupMsg($scope);
        viewScroll.scrollBottom();
      })
    });

    $scope.backSecondMenu=function () {
      $mqtt.clearMsgGroupCount();
      $state.go("tab.message");
    }


    // 点击按钮触发，或一些其他的触发条件
    $scope.resendgroupshow = function(topic, content, id) {

      // 显示操作表
      $ionicActionSheet.show({
        buttons: [
          { text: '重新发送' },
          { text: '删除' },
        ],
        // destructiveText: '重新发送',
        // titleText: 'Modify your album',
        cancelText: '取消',
        buttonClicked: function(index) {
          alert(index);
          if(index === 0){
            $scope.sendSingleGroupMsg(topic, content, id);
          }else if(index === 1){

          }
          return true;
        }
      });

    };
  })




  .controller('MessageCtrl', ['$scope', '$http', '$state','$mqtt', function ($scope, $http, $state) {

    // $mqtt.arriveMsg("");
    //
    // $scope.$on('msgs.update',function (event) {
    //
    //   $scope.$apply(function () {
    //     $scope.recentMsgs=$mqtt.getAllMsg();
    //     $scope.lastCount=$mqtt.getMsgCount();
    //     alert('放入单聊页面');
    //   })
    //
    // });

    $scope.goDetailMessage=function () {

      // $mqtt.clearMsgCount();
      // $scope.lastCount=$mqtt.getMsgCount();
      $state.go("messageDetail");

    };



    // $mqtt.rececivGroupMsg("sy");
    //
    // $scope.$on('groupMsgs.update',function (event) {
    //
    //   $scope.$apply(function () {
    //     $scope.recentGroupMsgs=$mqtt.getAllGroupMsg();
    //     $scope.lastGroupCount=$mqtt.getGroupMsgCount();
    //     alert('放入群组');
    //
    //   })
    //
    // });

    $scope.goGroupMessage=function () {
      // $mqtt.clearGroupMsgCount();
      // $scope.lastGroupCount=$mqtt.getGroupMsgCount();

      $state.go("messageGroup");
    }




  }])






  .controller('GroupCtrl', function ($scope, $state, contactService) {
    contactService.getContacts().then(function (response) {
      $scope.names = response;

    });

    $scope.chatsMesssage=function () {
      $state.go("messageGroup");
    }



  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('LoginCtrl', ['$scope', '$state', '$ionicLoading', '$http','$mqtt','$cordovaPreferences','$api',function ($scope, $state, $ionicLoading, $http,$mqtt,$cordovaPreferences,$api) {
    $scope.name="";
    $scope.password="";

    document.addEventListener('deviceready',function () {
      $mqtt.getMqtt().getString('historyusername',function(message){
        $scope.name = message;
      });
      if(!$mqtt.isLogin()) {
        $mqtt.getMqtt().getString('name', function (message) {
          if (message != null && message != '') {
            $mqtt.startMqttChat(message + ',zhuanjiazu');
            $mqtt.setLogin(true);
            $state.go('tab.message');
            return;
          }
        }, function (message) {
          alert(message);
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

    $scope.login = function (name, password) {
      if(name == '' || password == '') {
        alert('用户名或密码不能为空！');
        return;
      }
      $scope.name=name;
      $scope.password=password;
      // alert(name);
      // alert(password);
      $ionicLoading.show({
        template: '登录中...'
      });
      $api.login($scope.name,$scope.password,'321', function (message) {
        //alert(message.toJSONString());
        /*if (message.isActive === false) {
          $api.activeUser(message.userID, '321', function (message) {
          },function (message) {
            alert(message);
          });
        }*/
        $scope.names = [];
        $ionicLoading.hide();
        //调用保存用户名方法
        $mqtt.getMqtt().save('name', $scope.name, function (message) {
        },function (message) {
          alert(message);
        });
        $mqtt.startMqttChat($scope.name + ',zhuanjiazu');
        $mqtt.setLogin(true);
        $state.go('tab.message');
      }, function (message) {
        //alert(message);
        $scope.name = response;
        $ionicLoading.hide();
        $state.go('tab.message');
      });

    };
  }])
  .controller('TabMessageCtrl',function ($scope) {
    /*document.addEventListener('deviceready',function () {
      $mqtt.getMqtt().getChats('sls',function(message){
        alert(message);
      },function(message){
        alert(message);
      });
    });*/
  })

  .controller('SettingAccountCtrl',function ($scope,$state) {
    /*document.addEventListener('deviceready',function () {
     $mqtt.getMqtt().getChats('sls',function(message){
     alert(message);
     },function(message){
     alert(message);
     });
     });*/
    $scope.addFriend1=function () {
      $state.go("myAttention1");
    }
  })

  .controller('AccountCtrl',function ($scope, $state,$ionicPopup, $ionicLoading, $http,$mqtt,$cordovaPreferences) {
    $scope.name="";
    /*$scope.fetch = function() {
     $mqtt.getMqtt().getString('name',function (message) {
     alert(message+"sdsfsdg");
     if(message != null && message != ''){
     $scope.name=message;
     }
     },function (message) {
     alert(message);
     });
     /!*$cordovaPreferences.fetch('name')
     .success(function(value) {
     if(value != null && value != ''){
     $scope.name=value;
     }
     })
     .error(function(error) {
     })*!/
     };*/
    // $scope.fetch();
    document.addEventListener('deviceready',function () {
      $mqtt.getMqtt().getString('name',function (message) {
        if(message != null && message != ''){
          $scope.name=message;
        }
      },function (message) {
        alert(message);
      });
    });
    // $scope.name="";
    /*$scope.fetch = function() {
      $cordovaPreferences.fetch('name')
        .success(function(value) {
          if(value != null && value != ''){
            $scope.name=value;
          }
        })
        .error(function(error) {
        })
    };*/
    // $scope.fetch();
    // 一个确认对话框
    $scope.showConfirm = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: '<strong>注销用户?</strong>',
        template: '你确定要退出当前用户吗?',
        okText: '确定',
        cancelText: '取消'
      });
      confirmPopup.then(function(res) {
        if(res) {
          // $http.get('http://61.237.239.144/baseservice/rest/login/getdepartmentlist1?nodetype=2&nodeparentid=279').success(function (response) {
          //   $scope.names = response;
          //   $ionicLoading.hide();
          //   //调用保存用户名方法
          //   $scope.store();
          //   //连接MQTT
          //
          //   $scope.fetch = function() {
          //     $cordovaPreferences.fetch('name')
          //       .success(function(value) {
          //         if(value != null && value != ''){
          //           $mqtt.startMqttChat(value + ',zhuanjiazu');
          //         }
          //       })
          //       .error(function(error) {
          //       })
          //   };
          //   $scope.fetch();
          //
          //
          //   $state.go('tab.message');
          // }).error(function (response) {
          //   $scope.name = response;
          //   $ionicLoading.hide();
          //   $state.go('tab.message');
          // })
          // ionic.Platform.exitApp();
          $mqtt.getMqtt().save('name', '', function (message) {
            $mqtt.disconnect(function (message) {
              $state.go("login");
            },function (message) {
            });
          },function (message) {
            alert(message);
          });
        } else {
          // alert('不确定');
          alert("退出登录失败！");
        }
      });
    };
  })

 /* .controller('AccountCtrl',function ($scope,$cordovaPreferences,$mqtt) {
    $scope.name="";
    /!*$scope.fetch = function() {
      $mqtt.getMqtt().getString('name',function (message) {
        alert(message+"sdsfsdg");
        if(message != null && message != ''){
          $scope.name=message;
        }
      },function (message) {
        alert(message);
      });
      /!*$cordovaPreferences.fetch('name')
        .success(function(value) {
          if(value != null && value != ''){
            $scope.name=value;
          }
        })
        .error(function(error) {
        })*!/
    };*!/
    // $scope.fetch();
    document.addEventListener('deviceready',function () {
      $mqtt.getMqtt().getString('name',function (message) {
        if(message != null && message != ''){
          $scope.name=message;
        }
      },function (message) {
        alert(message);
      });
    });
  })*/
  .controller('myAttentionSelectCtrl',function ($scope,$state) {

    $scope.goBackChat=function () {
      $state.go("messageGroup");
    }
  })




  .controller('LocalContactCtrl',function ($scope,localContact,$ionicActionSheet,$phonepluin) {

    localContact.getContact();
    $scope.$on('im.back',function (event) {

      $scope.$apply(function () {

        $scope.contacts=localContact.getAllContacts();

        $scope.contactsA=localContact.getA();
        $scope.contactsB=localContact.getB();
        $scope.contactsC=localContact.getC();
        $scope.contactsD=localContact.getD();
        $scope.contactsE=localContact.getE();
        $scope.contactsF=localContact.getF();
        $scope.contactsG=localContact.getG();
        $scope.contactsH=localContact.getH();
        $scope.contactsI=localContact.getI();
        $scope.contactsJ=localContact.getJ();
        $scope.contactsK=localContact.getK();
        $scope.contactsL=localContact.getL();
        $scope.contactsM=localContact.getM();
        $scope.contactsN=localContact.getN();
        $scope.contactsO=localContact.getO();
        $scope.contactsP=localContact.getP();
        $scope.contactsQ=localContact.getQ();
        $scope.contactsR=localContact.getR();
        $scope.contactsS=localContact.getS();
        $scope.contactsT=localContact.getT();
        $scope.contactsU=localContact.getU();
        $scope.contactsV=localContact.getV();
        $scope.contactsW=localContact.getW();
        $scope.contactsX=localContact.getX();
        $scope.contactsY=localContact.getY();
        $scope.contactsZ=localContact.getZ();
        $scope.contactsNoSuch=localContact.getNoSuch();
        init();
      })

    });
    function init(){
      var startY = 0;
      var lastY =  0;
      var indicator =document.getElementById("indicator");
      indicator.addEventListener('touchstart', function(e) {
        lastY = startY = e.touches[0].pageY;
        console.log(lastY+"start");
      });
      indicator.addEventListener('touchmove', function(e) {
        var nowY = e.touches[0].pageY;
        var moveY = nowY - lastY;
        var contentTop = content.style.top.replace('px', '');
        content.style.top = (parseInt(contentTop) + moveY) + 'px';
        lastY = nowY;
        console.log(lastY+"move");
      });
      indicator.addEventListener('touchend', function(e) {
        // do touchend
        var nowY = e.touches[0].pageY;
        var moveY = nowY - lastY;
        var contentTop = content.style.top.replace('px', '');
        content.style.top = (parseInt(contentTop) + moveY) + 'px';
        lastY = nowY+30;
        console.log(lastY+"end");
      });
    }


// 点击按钮触发，或一些其他的触发条件
    $scope.tanchuang = function(phonenumber,name) {
      //打电话
      $scope.call = function(phonenumber1,name) {
        $phonepluin.call(phonenumber1,name);
      };
      $scope.sms = function(phonenumber1) {
        $phonepluin.sms(phonenumber1);
      };
      // 显示操作表
      $ionicActionSheet.show({
        buttons: [
          { text: '打电话' },
          { text: '发短信'}
        ],
        titleText: name,
        cancelText: '取消',
        buttonClicked: function(index) {
          if(index==0){
            $scope.call(phonenumber);
          }else {
            $scope.sms(phonenumber);
          }
          return true;
        }

      });

    };
  });




;

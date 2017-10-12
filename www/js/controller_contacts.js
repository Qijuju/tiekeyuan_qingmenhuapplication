/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('contacts.controllers', [])
  //常用联系人
  .controller('TopContactsCtrl', function ($scope, $state, $contacts, $ionicActionSheet, $phonepluin, $rootScope,$saveMessageContacts,$ToastUtils,$greendao) {

    $contacts.topContactsInfo();
    $scope.$on('topcontacts.update', function (event) {
      $scope.$apply(function () {
        $scope.topall = $contacts.getTopContactsInfo();
      })
    });

    $scope.topContactGoDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });
    };

    //点击头像发送消息
    $scope.createchat = function (id, phone,name) {
      // $saveMessageContacts.saveMessageContacts(id,phone,name);
      // $ToastUtils.showToast("进来创建聊天");
      $rootScope.isPersonSend = 'true';
      // $state.go('tab.message', {
      //   "id": id,
      //   "sessionid": name
      // });
      if(id ===null || name ===null || id === '' ||name ===''){
        // $ToastUtils.showToast("当前用户信息不全");
      }else{
        $state.go('messageDetail',{
          "id":id,
          "ssid":name,
          "grouptype":'User'
        });
      }
    };

    //快速打开的入口  传入类型的原因的 当type等于1 的时候才存入数据库  不等于的时候走的本地通讯录
    $scope.sheetShow = function (id, phone, name, type) {

      // 显示操作表
      $ionicActionSheet.show({
        buttons: [
          {text: '发消息'},
          {text: '打电话'},
          {text: '发短信'}
        ],
        titleText: name,
        cancelText: '取消',
        buttonClicked: function (index) {
          if (index == 0) {
            $scope.createchat(id,phone, name);
          } else if (index == 1) {
            if(phone!=""){
              $phonepluin.call(id, phone, name, type);
            }else {
              $ToastUtils.showToast("电话为空")
            }
          } else {
            if(phone!=""){
              $phonepluin.sms(id, phone, name, type)
            }else {
              $ToastUtils.showToast("电话为空")

            }
          }
          return true;
        }

      });
    };


    $scope.deleteTopCotacts=function (id) {
      $greendao.deleteDataByArg('TopContactsService',id,function (data) {

        $contacts.topContactsInfo();
      },function (err) {

      })
    }


    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

  })

  .controller('ContactsCtrl', function ($scope, $state, $stateParams, $contacts, $greendao, $ionicActionSheet, $phonepluin,$mqtt, $rootScope,$saveMessageContacts,$ToastUtils,$timeout,$chatarr,$pubionicloading,$ionicPlatform,$ionicHistory,$location,localContact) {
    // alert("网络状态"+$rootScope.isNetConnect);

    $scope.$on('netstatus.update', function (event) {
      $scope.$apply(function () {
        //alert("哈哈哈哈哈啊哈哈哈哈");
        //   alert("关网时走不走"+$rootScope.netStatus);
        $rootScope.isConnect=$rootScope.netStatus;
        // alert("切换网络时"+$scope.isConnect);
      })
    });




    var backButtonPressedOnceToExit=false;
    $ionicPlatform.registerBackButtonAction(function (e) {
      if($location.path()=='/tab/notification'||$location.path()=='/tab/contacts'||$location.path()=='/tab/account'||$location.path()=='/tab/portal'){
        if (backButtonPressedOnceToExit) {
          $mqtt.setExitStartedStatus();
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
        $pubionicloading.hide();
      }
      e.preventDefault();
      return false;


    },501)

    $scope.goLocalContact=function () {

      $pubionicloading.showloading('','正在加载...');

      $greendao.loadAllData('LocalPhoneService',function (msg) {

        if(msg.length>0){
          $pubionicloading.hide();
          $state.go('localContacts');
        }else {
          localContact.getContact();
        }

      },function (err) {

      });

    }

    $scope.$on('im.back',function (event) {

      $scope.$apply(function () {
        $timeout(function () {
          $pubionicloading.hide();
          $state.go('localContacts');
        });
      })

    });

    $scope.$on('im.wrong',function (event) {

      $scope.$apply(function () {
        $timeout(function () {
          $pubionicloading.hide();
          $ToastUtils.showToast("请求数据异常")
          $greendao.deleteAllData('LocalPhoneService',function () {

          },function () {

          });

        });
      })

    });

    $pubionicloading.showloading('','正在加载...');

    $contacts.topContactsInfo();
    $mqtt.getUserInfo(function (msg) {
      $scope.myid=msg.userID;
    },function (msg) {
    })
    $scope.$on('topcontacts.update', function (event) {
      $scope.$apply(function () {
        $scope.topContactLists = $contacts.getTopContactsInfo();



      })
    });

    $contacts.loginInfo();
    $scope.$on('login.update', function (event) {
      $scope.$apply(function () {
        $scope.logId = $contacts.getLoignInfo();

        $scope.loginid=$contacts.getLoignInfo().deptID;

      })
    });

    $scope.$on('$ionicView.enter', function () {
      $contacts.rootDept();

    });





    $scope.$on('first.update', function (event) {
      $scope.$apply(function () {
        $pubionicloading.hide();
        $timeout(function () {
          $scope.depts = $contacts.getRootDept();
        });
      })
    });


    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $greendao.queryByConditions('ChatListService',function (data) {
          $chatarr.setData(data);
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

    $scope.topGoDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });
    };

    //快速打开的入口  传入类型的原因的 当type等于1 的时候才存入数据库  不等于的时候走的本地通讯录
    $scope.simpleSheetShow = function (id, phone, name, type) {

      // 显示操作表
      $ionicActionSheet.show({
        buttons: [
          {text: '发消息'},
          {text: '打电话'},
          {text: '发短信'}
        ],
        titleText: name,
        cancelText: '取消',
        buttonClicked: function (index) {
          if (index == 0) {
            $scope.createchat(id, phone,name);
          } else if (index == 1) {
            if(phone!=""){
              $phonepluin.call(id, phone, name, type);
            }else if($scope.myid==id) {
              $ToastUtils.showToast("无法对自己进行该项操作");
            }else {
              $ToastUtils.showToast("电话为空")
            }
          } else {
            if(phone!=""){
              $phonepluin.sms(id, phone, name, type)
            }else if($scope.myid==id) {
              $ToastUtils.showToast("无法对自己进行该项操作");
            }else {
              $ToastUtils.showToast("电话为空")

            }
          }
          return true;
        }

      });
    };

    $scope.createchat = function (id, phone,name) {
      // $saveMessageContacts.saveMessageContacts(id,phone,name);
      // $ToastUtils.showToast("进来创建聊天");
      $rootScope.isPersonSend = 'true';
      // $state.go('tab.message', {
      //   "id": id,
      //   "sessionid": name
      // });
      if(id ===null || name ===null || id === '' ||name ===''){
        $ToastUtils.showToast("当前用户信息不全");
      }else if($scope.myid==id) {
        $ToastUtils.showToast("无法对自己进行该项操作");
      }else{
        $state.go('messageDetail',{
          "id":id,
          "ssid":name,
          "grouptype":'User'
        });
      }
    };

    $scope.goSearch = function () {
      var keyboard = cordova.require('ionic-plugin-keyboard.keyboard');
      keyboard.close();
      $state.go("search");
    }


    /*$greendao.deleteAllData('TopContactsService',function (data) {
     $ToastUtils.showToast('清除数据成功');
     },function (err) {
     $ToastUtils.showToast(err);
     });*/

    $scope.gogosecond=function (id,childcount) {
      $state.go("second", {
        "contactId": id,
        "childcount":childcount,
      });
    }


  })

  .controller('ContactSecondCtrl', function ($scope, $state,$chatarr, $stateParams, $contacts,$greendao,$ionicHistory,$ToastUtils,$pubionicloading,$timeout,$ionicPlatform,$location,$rootScope) {

    $rootScope.totalSecondCount = $stateParams.childcount;//当前目录的数据总条数
    $scope.contactId = $stateParams.contactId;//传过来的id；

    $ionicPlatform.registerBackButtonAction(function (e) {
      if($location.path()==('/second/'+$scope.contactId)){
        $state.go("tab.contacts");
      }else {
        $ionicHistory.goBack();
        $pubionicloading.hide();
      }
      e.preventDefault();
      return false;

    },501)

    $pubionicloading.showloading('','正在加载...');

    $scope.departlist = [];
    $scope.userlist = [];
    $scope.secondStatus;


    $scope.loadMoreSecond = function () {
      $contacts.deptInfo($scope.contactId);
    };

    //根据id获取子部门和人员信息
    $contacts.deptInfo($scope.contactId);
    $scope.$on('second.update', function (event,data) {
      $scope.$apply(function () {

        $timeout(function () {
          $pubionicloading.hide();

          $scope.deptinfo = $contacts.getFirstDeptName().DeptName;

          $scope.activeSecondDeptCount = $contacts.getCount1();

          $scope.activeSecondUserCount = $contacts.getCount2();


          if ($scope.activeSecondDeptCount > 0) {
            var olddepts = $contacts.getDeptInfo().deptList;
            for (var i = 0; i < olddepts.length; i++) {

              $scope.departlist.push(olddepts[i]);
            }
          }


          if ($scope.activeSecondUserCount) {
            var oldusers = $contacts.getDeptInfo().userList;
            for (var i = 0; i < oldusers.length; i++) {

              $scope.userlist.push(oldusers[i]);
            }
          }

          $scope.parentID = $contacts.getDeptInfo().deptID;

          if (($rootScope.totalSecondCount - (data.pageNo*data.pageSize)) >0 ) {
            $scope.secondStatus = true;
          } else if (($rootScope.totalSecondCount - (data.pageNo*data.pageSize)) <=0 ) {
            $scope.secondStatus = false;

          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });


      })

    });

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });


    $scope.$on('$ionicView.leave', function () {
      $contacts.clearSecondCount();
    });





    //在二级目录跳转到联系人界面
    $scope.backFirst = function () {
      $state.go("tab.contacts");
    }

    //在二级目录跳转到三级目录
    $scope.jumpThird = function (id, pname,childcount) {
      $state.go("third", {
        "contactId": id,
        "secondname": pname,
        "childcount":childcount
      });
    };

    //点击人员进入人员详情
    $scope.goSecondDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });

    };


  })


  .controller('ContactThirdCtrl', function ($scope, $http, $state, $stateParams, $contacts,$ionicHistory,$ToastUtils,$pubionicloading,$timeout,$ionicPlatform,$location,$rootScope) {

    $pubionicloading.showloading('','正在加载...');

    $scope.departthirdlist = [];
    $scope.userthirdlist = [];
    $scope.thirdStatus;

    $rootScope.totalThirdCount = $stateParams.childcount;//当前目录的数据总条数
    // alert("三级目录总条数"+$rootScope.totalThirdCount);
    //点击当前点击部门的id
    $scope.contactId = $stateParams.contactId;
    //一级的名字
    $scope.pppid = $stateParams.secondname;

    $ionicPlatform.registerBackButtonAction(function (e) {
      if($location.path()==('/third/'+$scope.contactId+'/'+$scope.pppid)){
        $state.go("tab.contacts");
      }else {
        $ionicHistory.goBack();
        $pubionicloading.hide();
      }
      e.preventDefault();
      return false;

    },501)



    $scope.loadThirdMore = function () {

      $contacts.deptThirdInfo($scope.contactId);

    };

    //根据id获取子部门的数据
    $contacts.deptThirdInfo($scope.contactId);


    $scope.$on('third.update', function (event,data) {

      $scope.$apply(function () {

        $timeout(function () {
          $pubionicloading.hide();
          $scope.parentID = $contacts.getDeptThirdInfo().deptID;
          $scope.deptinfo2 = $contacts.getSecondDeptName().DeptName;


          $scope.count1 = $contacts.getCount3();
          if ($scope.count1 > 0) {
            var olddepts = $contacts.getDeptThirdInfo().deptList;
            for (var i = 0; i < olddepts.length; i++) {

              $scope.departthirdlist.push(olddepts[i]);
            }
          }
          $scope.count2 = $contacts.getCount4();

          if ($scope.count2 > 0) {
            var oldusers = $contacts.getDeptThirdInfo().userList;

            for (var i = 0; i < oldusers.length; i++) {

              $scope.userthirdlist.push(oldusers[i]);
            }
          }

          if (($rootScope.totalThirdCount - (data.pageNo*data.pageSize)) >0 ) {
            $scope.thirdStatus = true;
          } else if (($rootScope.totalThirdCount - (data.pageNo*data.pageSize)) <=0 ) {
            $scope.thirdStatus = false;

          }
          $scope.$broadcast('scroll.infiniteScrollComplete');


          // $scope.thirdlength = (document.getElementById('a1').innerText.length + $scope.pppid.length + $scope.deptinfo2.length) * 15 + 80;
          // var thirddiv = document.getElementById("thirdscroll");
          // thirddiv.style.width = $scope.thirdlength + "px";


        })

        });



    });


    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });





    $scope.$on('$ionicView.leave', function () {
      $contacts.clearThirdCount();
    });

    //在三级目录返回第二级
    $scope.idddd = $contacts.getFirstID();

    $scope.backSecond = function () {
      $state.go("second", {
        "contactId": $scope.idddd,
        "childcount":$rootScope.totalSecondCount
      });
    }
    /*$scope.backSecond = function () {
      $ionicHistory.goBack();
    }*/


    //在第二级目录跳转到第四级目录
    $scope.jumpForth = function (id, sname, tname,childcount) {
      $state.go("forth", {
        "contactId": id,
        "secondname": sname,
        "thirdname": tname,
        "childcount":childcount
      });
    }


    //点击人员进入人员详情
    $scope.goThirdDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });

    };


  })

  .controller('ContactForthCtrl', function ($scope, $http, $state, $stateParams,$contacts,$ionicHistory,$ToastUtils,$pubionicloading,$timeout,$ionicPlatform,$location,$rootScope) {

    $pubionicloading.showloading('','正在加载...');

    $scope.departlist = [];
    $scope.userlist = [];

    $scope.forthStatus;

    $rootScope.totalForthCount = $stateParams.childcount;//当前目录的数据总条数
    // alert("第四级目录的总长度"+$rootScope.totalForthCount);
    $scope.contactId = $stateParams.contactId;
    // alert("三级进四级"+$scope.contactId);
    $scope.secondName = $stateParams.secondname;
    $scope.thirdName = $stateParams.thirdname;

    $ionicPlatform.registerBackButtonAction(function (e) {
      if($location.path()==('/forth/'+$scope.contactId+'/'+$scope.secondName+'/'+$scope.thirdName)){
        $state.go("tab.contacts");
      }else {
        $ionicHistory.goBack();
        $pubionicloading.hide();
      }
      e.preventDefault();
      return false;

    },501)

    $scope.loadForthMore = function () {
      $contacts.deptForthInfo($scope.contactId);

    }

    //根据id获取子部门和人员信息
    $contacts.deptForthInfo($scope.contactId);
    $scope.$on('forth.update', function (event,data) {
      $scope.$apply(function () {
        $timeout(function () {
          $pubionicloading.hide();
          $scope.count1 = $contacts.getCount5();
          if ($scope.count1 > 0) {
            var olddepts = $contacts.getDeptForthInfo().deptList;
            for (var i = 0; i < olddepts.length; i++) {

              $scope.departlist.push(olddepts[i]);
            }
          }
          $scope.count2 = $contacts.getCount6();

          if ($scope.count2 > 0) {
            var oldusers = $contacts.getDeptForthInfo().userList;

            for (var i = 0; i < oldusers.length; i++) {

              $scope.userlist.push(oldusers[i]);
            }
          }

          if (($rootScope.totalForthCount - (data.pageNo*data.pageSize)) >0 ) {
            // alert("能不能继续点");
            $scope.forthStatus = true;
          } else if (($rootScope.totalForthCount - (data.pageNo*data.pageSize)) <=0 ) {
            // alert("不能继续点");
            $scope.forthStatus = false;

          }
          $scope.$broadcast('scroll.infiniteScrollComplete');

          $scope.parentID = $contacts.getDeptForthInfo().deptID;
          $scope.deptinfo4 = $contacts.getThirdDeptName().DeptName;


          // $scope.forthlength = (document.getElementById('a1').innerText.length + $scope.secondName.length + $scope.thirdName.length + $scope.deptinfo4.length) * 15 + 120;
          //
          // var forthdiv = document.getElementById("forthscroll");
          // forthdiv.style.width = $scope.forthlength + "px";


        });



      })

    });



    $scope.$on('$ionicView.leave', function () {
      $contacts.clearForthCount();
    });

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });


    //在四级目录需要返回三级目录  （ 三级目录进来需要两个参数 一个是 二级目录id一个是二级目录的名字 ）

    $scope.idididi = $contacts.getSecondID();
    $scope.firstid = $contacts.getFirstID();


    $scope.backThird = function () {

      $state.go("third", {
        "contactId": $scope.idididi,
        "secondname": $scope.secondName,
        "childcount":$rootScope.totalThirdCount
      });

    };

    /*$scope.backThird = function () {

      $ionicHistory.goBack();

    };*/


    // 在四级目录返回二级目录  （二级目录只需要一个id就行）
    $scope.fromForthToSecond = function (sd) {
      $state.go("second", {
        "contactId": sd,
        "childcount":$rootScope.totalSecondCount
      });
    };

    //从四级目录跳入五级目录
    $scope.jumpFifth = function (id, sname, tname, fname,childcount) {
      $state.go("fifth", {
        "contactId": id,
        "secondname": sname,
        "thirdname": tname,
        "forthname": fname,
        "childcount":childcount
      });
    };

    //从四级目录跳入详情界面

    $scope.goForthDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });
    }

  })


  .controller('ContactFifthCtrl', function ($scope, $state, $stateParams, $contacts,$ionicHistory,$ToastUtils,$pubionicloading,$timeout,$ionicPlatform,$location,$rootScope) {

    $pubionicloading.showloading('','正在加载...');

    $scope.departfifthlist = [];
    $scope.userfifthlist = [];
    $scope.fifthStatus;

    $scope.contactId = $stateParams.contactId;
    $scope.secondName = $stateParams.secondname;
    $scope.thirdName = $stateParams.thirdname;
    $scope.forthName = $stateParams.forthname;
    $rootScope.totalFifthCount =$stateParams.childcount;//当前目录的数据总条数
    // alert("第五级目录的总长度"+$rootScope.totalFifthCount);

    $ionicPlatform.registerBackButtonAction(function (e) {
      if($location.path()==('/fifth/'+$scope.contactId+'/'+$scope.secondName+'/'+$scope.thirdName+'/'+$scope.forthName)){
        $state.go("tab.contacts");
      }else {
        $ionicHistory.goBack();
        $pubionicloading.hide();
      }
      e.preventDefault();
      return false;

    },501)


    $scope.loadFifthMore = function () {
      $contacts.deptFifthInfo($scope.contactId);
    }

    //根据id获取子部门和人员信息
    $contacts.deptFifthInfo($scope.contactId);
    $scope.$on('fifth.update',function (event,data) {
      $scope.$apply(function () {
        $timeout(function () {
          $pubionicloading.hide();
          // var pageNo = data.pageNo;
          // var pageSize =data.pageSize;
          // var num= pageNo * pageSize;
          $scope.count1 = $contacts.getCount7();
          if ($scope.count1 > 0) {
            var olddepts = $contacts.getDeptFifthInfo().deptList;
            for (var i = 0; i < olddepts.length; i++) {

              $scope.departfifthlist.push(olddepts[i]);
            }
          }
          $scope.count2 = $contacts.getCount8();

          if ($scope.count2 > 0) {
            var oldusers = $contacts.getDeptFifthInfo().userList;

            for (var i = 0; i < oldusers.length; i++) {

              $scope.userfifthlist.push(oldusers[i]);
            }
          }
          $scope.parentID = $contacts.getDeptFifthInfo().deptID;
          $scope.deptinfo5 = $contacts.getForthDeptName();
          if (($rootScope.totalFifthCount - (data.pageNo*data.pageSize)) >0 ) {
            // alert("能不能继续点");
            $scope.fifthStatus = true;
          } else if (($rootScope.totalFifthCount - (data.pageNo*data.pageSize)) <=0) {
            $scope.fifthStatus = false;
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');


          // $scope.fifthlength = (document.getElementById('a1').innerText.length + $scope.secondName.length + $scope.thirdName.length + $scope.forthName.length + $scope.deptinfo5.length) * 15 + 140;
          //
          //
          // var fifthdiv = document.getElementById("fifthscroll");
          // fifthdiv.style.width = $scope.fifthlength + "px";


        });
      })

    });

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });


    $scope.$on('$ionicView.leave', function () {
      $contacts.clearFifthCount();
    });

    //返回二级部门 需要一个id；
    $scope.firstid = $contacts.getFirstID();
    $scope.secondid = $contacts.getSecondID();
    $scope.thirdid = $contacts.getThirdID();

    $scope.fromFifthToSecond = function (sd) {
      $state.go("second", {
        "contactId": sd,
        "childcount":$rootScope.totalSecondCount
      });

    };


    //返回三级部门需要一个Id和一个名字；
    $scope.fromFifthToThird = function (sd, sname) {
      $state.go("third", {
        "contactId": sd,
        "secondname": sname,
        "childcount":$rootScope.totalThirdCount
      });
    };


    //返回四级部门 需要一个id 和 两个名字
    $scope.backForth = function () {
      $state.go("forth", {
        "contactId": $scope.thirdid,
        "secondname": $scope.secondName,
        "thirdname": $scope.thirdName,
        "childcount":$rootScope.totalForthCount
      });
    };
    /*$scope.backForth = function () {
      $ionicHistory.goBack();
     };*/

    //从五级部门跳转到六级部门
    $scope.jumpSixth = function (id, sname, tname, fname, dd,childcount) {
      $state.go("sixth", {
        "contactId": id,
        "secondname": sname,
        "thirdname": tname,
        "forthname": fname,
        "fifthname": dd,
        "childcount":childcount
      });
    };


    //从五级部门跳转到详情界面
    $scope.goFifthDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });
    }


  })


  .controller('ContactSixthCtrl', function ($scope, $http, $state, $stateParams, $contacts,$ionicHistory,$ToastUtils,$pubionicloading,$timeout,$ionicPlatform,$location,$rootScope) {
    $pubionicloading.showloading('','正在加载...');

    $scope.departsixthlist = [];
    $scope.usersixthlist = [];
    $scope.sixthStatus;

    $rootScope.totalSixthCount = $stateParams.childcount;//当前目录的数据总条数
    $scope.contactId = $stateParams.contactId;
    $scope.secondName = $stateParams.secondname;
    $scope.thirdName = $stateParams.thirdname;
    $scope.forthName = $stateParams.forthname;
    $scope.fifthName = $stateParams.fifthname;

    $ionicPlatform.registerBackButtonAction(function (e) {
      if($location.path()==('/sixth/'+$scope.contactId+'/'+$scope.secondName+'/'+$scope.thirdName+'/'+$scope.forthName+'/'+$scope.fifthName)){
        $state.go("tab.contacts");
      }else {
        $ionicHistory.goBack();
        $pubionicloading.hide();
      }
      e.preventDefault();
      return false;

    },501)

    $scope.loadSixthMore = function () {
      $contacts.deptSixthInfo($scope.contactId);
    }

    //根据id获取子部门和人员信息
    $contacts.deptSixthInfo($scope.contactId);
    $scope.$on('sixth.update', function (event,data) {
      $scope.$apply(function () {


        $timeout(function () {
          $pubionicloading.hide();
          $scope.count1 = $contacts.getCount9();
          if ($scope.count1 > 0) {
            var olddepts = $contacts.getDeptSixthInfo().deptList;
            for (var i = 0; i < olddepts.length; i++) {

              $scope.departsixthlist.push(olddepts[i]);
            }
          }
          $scope.count2 = $contacts.getCount10();

          if ($scope.count2 > 0) {
            var oldusers = $contacts.getDeptSixthInfo().userList;

            for (var i = 0; i < oldusers.length; i++) {

              $scope.usersixthlist.push(oldusers[i]);
            }
          }

          if (($rootScope.totalSixthCount - (data.pageNo*data.pageSize)) >0 ) {
            // alert("能不能继续点");
            $scope.sixthStatus = true;
          } else if (($rootScope.totalSixthCount - (data.pageNo*data.pageSize)) <=0) {
            $scope.sixthStatus = false;
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');

          $scope.parentID = $contacts.getDeptSixthInfo().deptID;
          $scope.deptinfo6 = $contacts.getFifthDeptName();

          // $scope.sixthlength = (document.getElementById('a1').innerText.length + $scope.secondName.length + $scope.thirdName.length +
          //   $scope.forthName.length + $scope.fifthName.length + $scope.deptinfo6.length) * 15 + 180;
          //
          // var sixthdiv = document.getElementById("sixthscroll");
          // sixthdiv.style.width = $scope.sixthlength + "px";



        });


      })

    });


    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });


    $scope.$on('$ionicView.leave', function () {
      $contacts.clearSixthCount();
    });


    //返回二级部门 需要一个id；
    $scope.firstidInSix = $contacts.getFirstID();
    $scope.secondidInSix = $contacts.getSecondID();
    $scope.thirdidInSix = $contacts.getThirdID();
    $scope.forthidInSix = $contacts.getForthID();


    //从六级部门跳转到七级部门
    $scope.jumpSeventh = function (id, sname, tname, fname, sixname, ddd,childcount) {
      $state.go("seventh", {
        "contactId": id,
        "secondname": sname,
        "thirdname": tname,
        "forthname": fname,
        "fifthname": sixname,
        "sixthname": ddd,
        "childcount":childcount
      });
    };

    //从六级界面跳转到2级界面 只需要一个参数
    $scope.fromSixthToSecond = function (sd) {
      $state.go("second", {
        "contactId": sd,
        "childcount":$rootScope.totalSecondCount
      });
    };

    //从六级跳转到3级界面 需要两个参数
    $scope.fromSixthToThird = function (sd, sname) {
      $state.go("third", {
        "contactId": sd,
        "secondname": sname,
        "childcount":$rootScope.totalThirdCount
      });
    };

    //从六级跳转到4级界面  需要三个参数

    $scope.fromSixthToForth = function (sd, sname, tname) {
      $state.go("forth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
        "childcount":$rootScope.totalForthCount
      });
    };

    //从六级返回五级  需要四个参数

    $scope.backFifth = function () {
      $state.go("fifth", {
        "contactId": $scope.forthidInSix,
        "secondname": $scope.secondName,
        "thirdname": $scope.thirdName,
        "forthname": $scope.forthName,
        "childcount":$rootScope.totalFifthCount
      });
    };

    /*$scope.backFifth = function () {
      $ionicHistory.goBack();
    };*/


    //从六级部门跳转到详情界面
    $scope.goSixthDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });
    };

  })


  .controller('ContactSeventhCtrl', function ($scope, $state, $stateParams, $contacts, $ionicHistory,$ToastUtils,$pubionicloading,$timeout,$ionicPlatform,$location,$rootScope) {

    $pubionicloading.showloading('','正在加载...');

    $scope.nihao = [];
    $scope.buhao = [];
    $scope.seventhStatus;

    $rootScope.totalSeventhCount = $stateParams.childcount;//当前目录的数据总条数
    $scope.contactId = $stateParams.contactId;
    $scope.secondName = $stateParams.secondname;
    $scope.thirdName = $stateParams.thirdname;
    $scope.forthName = $stateParams.forthname;
    $scope.fifthName = $stateParams.fifthname;
    $scope.sixthName = $stateParams.sixthname;

    $ionicPlatform.registerBackButtonAction(function (e) {
      if($location.path()==('/seventh/'+$scope.contactId+'/'+$scope.secondName+'/'+$scope.thirdName+'/'+$scope.forthName+'/'+$scope.fifthName+'/'+$scope.sixthName)){
        $state.go("tab.contacts");
      }else {
        $ionicHistory.goBack();
        $pubionicloading.hide();
      }
      e.preventDefault();
      return false;

    },501)


    $scope.loadSeventhMore = function () {
      $contacts.deptSeventhInfo($scope.contactId);
    }



    //根据id获取子部门和人员信息

    $contacts.deptSeventhInfo($scope.contactId);
    $scope.$on('seventh.update', function (event,data) {
      $scope.$apply(function () {

        $timeout(function () {
          $pubionicloading.hide();
          $scope.count1 = $contacts.getCount11();
          if ($scope.count1 > 0) {
            var olddepts = $contacts.getDeptSeventhInfo().deptList;
            for (var i = 0; i < olddepts.length; i++) {

              $scope.nihao.push(olddepts[i]);
            }
          }
          $scope.count2 = $contacts.getCount12();
          if ($scope.count2 > 0) {
            var oldusers = $contacts.getDeptSeventhInfo().userList;

            for (var i = 0; i < oldusers.length; i++) {

              $scope.buhao.push(oldusers[i]);
            }
          }
          if (($rootScope.totalSeventhCount - (data.pageNo*data.pageSize)) >0 ) {
            // alert("能不能继续点");
            $scope.seventhStatus = true;
          } else if (($rootScope.totalSeventhCount - (data.pageNo*data.pageSize)) <=0) {
            $scope.seventhStatus = false;
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');

          $scope.parentID = $contacts.getDeptSeventhInfo().deptID;
          $scope.deptinfo7 = $contacts.getSixthDeptName();

          // $scope.seventhlength = (document.getElementById('a1').innerText.length + $scope.secondName.length + $scope.thirdName.length + $scope.forthName.length
          //   + $scope.fifthName.length + $scope.sixthName.length + $scope.deptinfo7.length) * 15 + 200;
          //
          // var seventhdiv = document.getElementById("seventhscroll");
          // seventhdiv.style.width = $scope.seventhlength + "px";

        });

      })

    });

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

    $scope.$on('$ionicView.leave', function () {
      $contacts.clearSeventhCount();
    });

    $scope.firstidInSeven = $contacts.getFirstID();
    $scope.secondidInSeven = $contacts.getSecondID();
    $scope.thirdidInSeven = $contacts.getThirdID();
    $scope.forthidInSeven = $contacts.getForthID();
    $scope.fifthidInSeven = $contacts.getFifthID();

    $scope.jumpEighth=function (id, sname, tname, fname, sixname, ddd,zuihou,childcount) {
      $state.go("eighth", {
        "contactId": id,
        "secondname": sname,
        "thirdname": tname,
        "forthname": fname,
        "fifthname": sixname,
        "sixthname": ddd,
        "seventhname":zuihou,
        "childcount":childcount
      });
    }


    //返回六级列表

    $scope.backSixth = function () {
      $state.go("sixth", {
        "contactId": $scope.fifthidInSeven,
        "secondname": $scope.secondName,
        "thirdname": $scope.thirdName,
        "forthname": $scope.forthName,
        "fifthname":$scope.fifthName,
        "childcount":$rootScope.totalSixthCount
      });

    }


    //从七级目录到五级目录  五级目录需要四个参数
    $scope.formSeventhToFifth = function (sd, sname, tname, ttname) {
      $state.go("fifth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
        "forthname": ttname,
        "childcount":$rootScope.totalFifthCount
      });
    }

    //从七级目录到四级目录  四级目录需要四个参数
    $scope.fromSeventhToForth = function (sd, sname, tname) {
      $state.go("forth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
        "childcount":$rootScope.totalForthCount
      });
    };

    //从七级目录到三级目录  三级目录需要两个个参数


    $scope.fromSeventhToThird = function (sd, sname) {
      $state.go("third", {
        "contactId": sd,
        "secondname": sname,
        "childcount":$rootScope.totalThirdCount
      });
    };

    //从七级目录到二级目录  二级目录需要1个参数

    $scope.fromSeventhToSecond = function (sd) {
      $state.go("second", {
        "contactId": sd,
        "childcount":$rootScope.totalSecondCount
      });
    };


    //从七级界面跳入到详情界面
    $scope.goSeventhDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });
    };

  })


  .controller('ContactEighthCtrl', function ($scope, $state, $stateParams, $contacts,$ionicHistory,$ToastUtils,$pubionicloading,$timeout,$location,$ionicPlatform,$rootScope) {

    $pubionicloading.showloading('','正在加载...');


    $scope.eightDept = [];
    $scope.eightUser = [];
    $scope.eighthStatus;


    $rootScope.totalEighthCount = $stateParams.childcount;//当前目录的数据总条数
    $scope.contactId = $stateParams.contactId;
    $scope.secondName = $stateParams.secondname;
    $scope.thirdName = $stateParams.thirdname;
    $scope.forthName = $stateParams.forthname;
    $scope.fifthName = $stateParams.fifthname;
    $scope.sixthName = $stateParams.sixthname;
    $scope.seventhName = $stateParams.seventhname;

    $ionicPlatform.registerBackButtonAction(function (e) {
      if($location.path()==('/eighth/'+$scope.contactId+'/'+$scope.secondName+'/'+$scope.thirdName+'/'+$scope.forthName+'/'+$scope.fifthName+'/'+$scope.sixthName+'/'+$scope.seventhName)){
        $state.go("tab.contacts");
      }else {
        $ionicHistory.goBack();
        $pubionicloading.hide();
      }
      e.preventDefault();
      return false;

    },501)


    $scope.loadEighthMore = function () {
      $contacts.deptEighthInfo($scope.contactId);
    }

    //根据id获取子部门和人员信息
    $contacts.deptEighthInfo($scope.contactId);
    $scope.$on('eighth.update', function (event,data) {
      $scope.$apply(function () {

        $timeout(function () {
          $pubionicloading.hide();
          $scope.count1 = $contacts.getCount13();
          if ($scope.count1 > 0) {
            var olddepts = $contacts.getDeptEighthInfo().deptList;
            for (var i = 0; i < olddepts.length; i++) {

              $scope.eightDept.push(olddepts[i]);
            }
          }
          $scope.count2 = $contacts.getCount14();
          if ($scope.count2 > 0) {
            var oldusers = $contacts.getDeptEighthInfo().userList;

            for (var i = 0; i < oldusers.length; i++) {

              $scope.eightUser.push(oldusers[i]);
            }
          }

          if (($rootScope.totalEighthCount - (data.pageNo*data.pageSize)) >0 ) {
            // alert("能不能继续点");
            $scope.eighthStatus = true;
          } else if (($rootScope.totalEighthCount - (data.pageNo*data.pageSize)) <=0) {
            $scope.eighthStatus = false;
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');

          $scope.parentID = $contacts.getDeptEighthInfo().deptID;
          $scope.deptinfo8 = $contacts.getSeventhDeptName();

          // $scope.eighthlength = (document.getElementById('a1').innerText.length + $scope.secondName.length + $scope.thirdName.length + $scope.forthName.length
          //   + $scope.fifthName.length + $scope.sixthName.length+$scope.seventhName.length + $scope.deptinfo8.length) * 15 + 220;
          //
          // var eighthdiv = document.getElementById("eighthscroll");
          // eighthdiv.style.width = $scope.eighthlength + "px";


        });
      })

    });

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

    $scope.$on('$ionicView.leave', function () {
      $contacts.clearEngithCount();
    });



    $scope.goEighthDetail=function (id) {
      $state.go("person", {
        "userId": id,
      });
    }

    $scope.firstidInEighth = $contacts.getFirstID();
    $scope.secondidInEighth = $contacts.getSecondID();
    $scope.thirdidInEighth= $contacts.getThirdID();
    $scope.forthidInEighth = $contacts.getForthID();
    $scope.fifthidInEighth = $contacts.getFifthID();
    $scope.sixthidInEighth = $contacts.getSixthID();


    //八级到六级目录 五个参数
    $scope.fromEighthToSixth=function (sd, sname, tname, ttname,tttname) {
      $state.go("sixth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
        "forthname": ttname,
        "fifthname":tttname,
        "childcount":$rootScope.totalSixthCount
      });
    }


    //从八级目录到五级目录  五级目录需要四个参数
    $scope.fromEighthToFifth = function (sd, sname, tname, ttname) {
      $state.go("fifth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
        "forthname": ttname,
        "childcount":$rootScope.totalFifthCount
      });
    }

    //从八级目录到四级目录  四级目录需要三个参数
    $scope.fromEighthToForth = function (sd, sname, tname) {
      $state.go("forth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
        "childcount":$rootScope.totalForthCount
      });
    };

    //从七级目录到三级目录  三级目录需要两个个参数


    $scope.fromEighthToThird = function (sd, sname) {
      $state.go("third", {
        "contactId": sd,
        "secondname": sname,
        "childcount":$rootScope.totalThirdCount
      });
    };

    //从七级目录到二级目录  二级目录需要1个参数

    $scope.fromEighthToSecond = function (sd) {
      $state.go("second", {
        "contactId": sd,
        "childcount":$rootScope.totalSecondCount
      });
    };

    $scope.backSeventh=function () {
      $state.go("seventh", {
        "contactId": $scope.sixthidInEighth,
        "secondname": $scope.secondName,
        "thirdname": $scope.thirdName,
        "forthname": $scope.forthName,
        "fifthname":$scope.fifthName,
        "sixthname":$scope.sixthName,
        "childcount":$rootScope.totalSeventhCount
      });



    }


  })


  .controller('PersonCtrl', function ($scope, $stateParams, $state, $phonepluin, $savaLocalPlugin, $contacts, $ionicHistory, $rootScope, $addattentionser,$saveMessageContacts,$ToastUtils,$mqtt,$timeout,$pubionicloading,$api,$greendao,$ionicPlatform) {

    // Setup the loader
    $pubionicloading.showloading('','正在加载...');
    // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.


    $scope.userId = $stateParams.userId;
    $scope.picyoumeiyoudet=false;

    $api.getOtherHeadPic($scope.userId,"60",function (srcurl) {
      $scope.picyoumeiyoudet=true;

      $scope.securlpicdet=srcurl;

      $greendao.queryData('ChatListService','where id =?',$scope.userId,function (data) {
        if(data[0].count>0){
          var chatitem = {};
          chatitem.id = data[0].id;
          chatitem.chatName = data[0].chatName;
          chatitem.imgSrc = data[0].imgSrc;
          chatitem.lastText = data[0].lastText;
          chatitem.count = '0';
          chatitem.isDelete = data[0].isDelete;
          chatitem.lastDate = data[0].lastDate;
          chatitem.chatType = data[0].chatType;
          // alert("chatype"+chatitem.chatType);
          chatitem.senderId = data[0].senderId;//发送者id
          chatitem.senderName = data[0].senderName;//发送者名字
          chatitem.daytype=data[0].daytype;
          chatitem.isSuccess=data[0].isSuccess;
          chatitem.isFailure=data[0].isFailure;
          chatitem.messagetype=data[0].messagetype;
          chatitem.isRead=data[0].isRead;
          $greendao.saveObj('ChatListService',chatitem,function (data) {
            $greendao.queryDataByIdAndIsread($scope.userId,'0',function (data) {
              for(var i=0;i<data.length;i++){
                // alert("进入for循环的长度"+data.length);
                var messaegeitem={};
                messaegeitem._id=data[i]._id;
                messaegeitem.sessionid=data[i].sessionid;
                messaegeitem.type=data[i].type;
                // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
                messaegeitem.from=data[i].from;
                messaegeitem.message=data[i].message;
                messaegeitem.messagetype=data[i].messagetype;
                messaegeitem.platform=data[i].platform;
                messaegeitem.when=data[i].when;
                messaegeitem.isFailure=data[i].isFailure;
                messaegeitem.isDelete=data[i].isDelete;
                messaegeitem.imgSrc=srcurl;
                messaegeitem.username=data[i].username;
                messaegeitem.senderid=data[i].senderid;
                messaegeitem.isSuccess=data[i].isSuccess;
                messaegeitem.istime=data[i].istime;
                messaegeitem.daytype=data[i].daytype;
                if(data[i].isread ==='0'){
                  if(data[i].messagetype != 'Audio'){
                    // alert("拿到库里的消息阅读状态"+data[i].isread);
                    data[i].isread ='1';
                    messaegeitem.isread=data[i].isread;
                    // alert('hellonihaozhoujielun' + messaegeitem._id);
                    // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                    $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                      // alert("保存成功");

                    },function (err) {
                    });
                  }
                }
              }
            },function (err) {
            });
          },function (err) {

          });
        }
      },function (err) {

      });

      var otherHeadPicItem={};
      otherHeadPicItem.id=$scope.userId;
      otherHeadPicItem.picurl=$scope.securlpicdet;
      $greendao.saveObj('OtherHeadPicService',otherHeadPicItem,function (succ) {
        $greendao.queryData('MessagesService','where senderid =?',$scope.userId,function (data) {
          // alert("取出数据得长度"+data.length);
          for(var i=0;i<data.length;i++){
            var messageitem={};
            messageitem._id=data[i]._id;
            messageitem.sessionid=data[i].sessionid;
            messageitem.type=data[i].type;
            messageitem.from=data[i].from;
            messageitem.message=data[i].message;
            messageitem.messagetype=data[i].messagetype;
            messageitem.platform=data[i].platform;
            messageitem.isFailure=data[i].isFailure;
            messageitem.when=data[i].when;
            messageitem.isDelete=data[i].isDelete;
            // $scope.securlpicdet= $scope.securlpicdet.replace("//","/");
            messageitem.imgSrc=$scope.securlpicdet;
            messageitem.username=data[i].username;
            messageitem.senderid=data[i].senderid;
            messageitem.isread=data[i].isread;
            messageitem.isSuccess=data[i].isSuccess;
            messageitem.daytype=data[i].daytype;
            messageitem.istime=data[i].istime;
            $greendao.saveObj('MessagesService',messageitem,function (success) {
            },function (err) {
            });
          }

        },function (err) {
        });
        // alert(succ.length);
      },function (err) {
      });
      // alert(srcurl)
      // alert( $rootScope.securlpicaaa)
    },function (error) {
      $scope.picyoumeiyoudet=false;
      // alert(error)
    })

    $mqtt.getUserInfo(function (msg) {
      $scope.myid=msg.userID;
    },function (msg) {
    })

    $contacts.personDetail($scope.userId,$timeout,$ToastUtils);
    $scope.$on('personDetail.update', function (event) {
      $scope.$apply(function () {
          $timeout(function () {
            $pubionicloading.hide();
            $scope.persondsfs = $contacts.getPersonDetail();
            if ($scope.persondsfs.UserName.length > 2) {
              $scope.simpleName = $scope.persondsfs.UserName.substr(($scope.persondsfs.UserName.length-2), $scope.persondsfs.UserName.length);
            } else {
              $scope.simpleName = $scope.persondsfs.UserName;
            }
          });
      })
    });

    $scope.backAny = function () {

      $ionicHistory.goBack();
    };


    $ionicPlatform.registerBackButtonAction(function (e) {

        $ionicHistory.goBack();
      $pubionicloading.hide();
        e.preventDefault();
      return false;
    },501)


    //调用打电话功能，并且会存到数据库里面
    $scope.detailCall = function (id, phone, name, type) {
      if ($scope.myid==$scope.userId){
        $ToastUtils.showToast("无法对自己进行该项操作")
      }else {
        if (phone != "") {
          $phonepluin.call(id, phone, name, type);
        } else {
          $ToastUtils.showToast("电话为空")
        }
      }
    }


    //发短信 也会把存入数据库  传入类型的原因是 type 只是存 通过组织架构拨打出去的电话和人
    $scope.detailSendSms = function (id, phone, name, type) {
      if ($scope.myid==$scope.userId){
        $ToastUtils.showToast("无法对自己进行该项操作")
      }else {
        if (phone != "") {
          $phonepluin.sms(id, phone, name, type);
        } else {
          $ToastUtils.showToast("电话为空")
        }
      }

    };


    //把联系人存入本地
    $scope.insertPhone = function (name, phone) {
      if ($scope.myid==$scope.userId){
        $ToastUtils.showToast("无法对自己进行该项操作")
      }else {
        if (name != null && phone != null) {
          $savaLocalPlugin.insert(name, phone);
        } else {
          $ToastUtils.showToast("姓名或者电话为空")
        }
      }

    };

    //点击头像发送消息
    $scope.createchat = function (id, phone,name) {
      if (id==""||id==null||name==""||name==null){
        $ToastUtils.showToast("当前用户信息不全")
      }else {
        // $saveMessageContacts.saveMessageContacts(id,phone,name);
        // $ToastUtils.showToast("进来创建聊天");
        $rootScope.isPersonSend = 'true';
        // $state.go('tab.message', {
        //   "id": id,
        //   "sessionid": name
        // });
        if ($scope.myid == $scope.userId) {
          $ToastUtils.showToast("无法对自己进行该项操作")
        } else if (id === null || name === null || id === '' || name === '') {
          $ToastUtils.showToast("当前用户信息不全")
        } else {
          $saveMessageContacts.saveMessageContacts(id, phone, name);
          //$ionicHistory.clearHistory();
          $state.go('messageDetail', {
            "id": id,
            "ssid": name,
            "grouptype":'User'
          });
        }
      }

    }
    //取消关注
    $scope.removeattention = function (id) {
      if ($scope.myid==$scope.userId){
        $ToastUtils.showToast("无法对自己进行该项操作")
      }else {
        var membersAerr = [];
        membersAerr.push(id);
        $addattentionser.removeAttention111(membersAerr);
      }
    }
    $scope.$on('attention.delete', function (event) {
      $scope.$apply(function () {
        $scope.persondsfs.IsAttention = $addattentionser.getaddAttention111();
      })
    });

    //添加关注
    $scope.addattentiondetail = function (id) {
      if ($scope.myid==$scope.userId){
        $ToastUtils.showToast("无法对自己进行该项操作")
      }else {
        var membersAerr = [];
        membersAerr.push(id);
        $addattentionser.addAttention111(membersAerr);
      }
    };
    $scope.$on('attention.add', function (event) {
      $scope.$apply(function () {
        $scope.persondsfs.IsAttention = $addattentionser.getaddAttention111();

      })
    });

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });



    $scope.showalert=function () {
      $ToastUtils.showToast("此用户还未激活")
    }


  })

  .controller('GroupCtrl', function ($scope,$state,$contacts,$ToastUtils,$group,$rootScope,$greendao,$pubionicloading,$timeout) {
    $pubionicloading.showloading('','正在加载...');



    $contacts.loginInfo();
    $scope.$on('login.update', function (event) {
      $scope.$apply(function () {
        $contacts.clearSecondCount();
        //登录人员的id
        $scope.loginId=$contacts.getLoignInfo().userID;
        $scope.loginName=$contacts.getLoignInfo().userName;
        //部门id
        $scope.depid=$contacts.getLoignInfo().deptID;
        $contacts.loginDeptInfo($scope.depid);
        $group.allGroup();
      })
    });

    $scope.$on('logindept.update', function (event) {
      $scope.$apply(function () {
        //部门id
        $scope.deptinfo = $contacts.getloginDeptInfo();

      })
    });



    $scope.$on('group.update', function (event) {
      $scope.$apply(function () {

        $timeout(function () {
          $pubionicloading.hide();
          $scope.grouplist=$group.getAllGroup();
          $scope.ismycreat=0;

          for(var i=0; i<$scope.grouplist.length;i++){
            if($scope.grouplist[i].isMyGroup==true){
              $scope.ismycreat++;
            }
          }

        });

      })
    });

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });


    //我创建的
    $scope.goCreateGroup=function (id,name,ismygrop) {
      $rootScope.isPersonSend === 'true'
      $state.go('messageGroup',{
        "id":id,
        "chatName":name,
        "grouptype":"Group",
        "ismygroup":ismygrop
      });
    }

    //我加入的
    $scope.goJoinGroup=function (id,name,ismygrop) {
      $rootScope.isPersonSend === 'true'
      $state.go('messageGroup',{
        "id":id,
        "chatName":name,
        "grouptype":"Group",
        "ismygroup":ismygrop
      });
    }

    //部门的群
    $scope.goDepartmentGroup=function (id,name,ismygrop) {
      $rootScope.isPersonSend === 'true'

      $state.go('messageGroup',{
        "id":id,
        "chatName":name,
        "grouptype":"Dept",
        "ismygroup":ismygrop
      });
    }
    $scope.createGroupChats=function () {

      $greendao.deleteAllData("SelectIdService",function (msg) {

      },function (err) {

      })

      var selectInfo={};
      //当创建群聊的时候先把登录的id和信息  存到数据库上面
      selectInfo.id=$scope.loginId;
      selectInfo.name=$scope.loginName;
      selectInfo.grade="0";
      selectInfo.isselected=true;
      selectInfo.type='user';
      selectInfo.parentid=$scope.depid;
      $greendao.saveObj('SelectIdService',selectInfo,function (msg) {

      },function (err) {

      })

      $state.go('addnewpersonfirst',{
        "createtype":'single',
        "groupid":'0',
        "groupname":'',
        "functiontag":"groupchat"
      });

    }




  })


  .controller('myattentionaaaSelectCtrl',function ($scope,$state,$myattentionser,$api,$pubionicloading,$mqtt,$timeout,$phonepluin,$ionicActionSheet,$searchdata,$searchdatadianji,$ToastUtils,$rootScope,$saveMessageContacts,$addattentionser) {
    $pubionicloading.showloading('','正在加载...');

    $mqtt.getUserInfo(function (msg) {
      $scope.myid=msg.userID;
    },function (msg) {
    })
    //点击人员进入人员详情
    $scope.jumpattenDetial = function (id) {
      $state.go("person", {
        "userId": id,
      });

    };

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

    $scope.$on('person.update',function (event) {
      $scope.$apply(function () {
        $scope.phoneattention=$searchdata.getPersonDetail().user.Mobile;
        $scope.nameattention=$searchdata.getPersonDetail().user.UserName;
        $scope.idattention=$searchdata.getPersonDetail().user.UserID;

        $scope.createchat = function (id, phone,name) {
          $saveMessageContacts.saveMessageContacts(id,phone,name)
          $rootScope.isPersonSend = 'true';
          if(id ===null || name ===null || id === '' ||name ===''){
            $ToastUtils.showToast("当前用户信息不全");
          }else if($scope.myid==id){
            $ToastUtils.showToast("无法对自己进行该项操作");
          }else{
            $state.go('messageDetail',{
              "id":id,
              "ssid":name,
              "grouptype":'User'
            });
          }
        };
        // 显示操作表
        $ionicActionSheet.show({
          buttons: [
            { text: '打电话' },
            { text: '发消息' },
            { text: '发短信'}
          ],
          titleText: $scope.nameattention,
          cancelText: '取消',
          buttonClicked: function(index) {
            if(index==0){
              if ($scope.phoneattention!=""){
                $phonepluin.call($scope.idattention, $scope.phoneattention, $scope.nameattention,1);
              }else if($scope.myid==$scope.idattention){
                $ToastUtils.showToast("无法对自己进行该项操作");
              }else {
                $ToastUtils.showToast("电话号码为空");
              }
            }else if(index==1){
              $scope.createchat($scope.idattention,$scope.phoneattention,$scope.nameattention);
            }else {
              if ($scope.phoneattention!=""){
                $phonepluin.sms($scope.idattention,$scope.phoneattention, $scope.nameattention, 1);
              }else if($scope.myid==$scope.idattention){
                $ToastUtils.showToast("无法对自己进行该项操作");
              }else {
                $ToastUtils.showToast("电话号码为空");
              }
            }
            return true;
          }

        });

      })
    });
    // 点击按钮触发，或一些其他的触发条件
    $scope.tanchuangattention = function(id) {
      //获取人员详细信息
      $searchdata.personDetail(id);

    };


    $myattentionser.getAttentionList();
    $scope.$on('attention.update',function (event) {
      $scope.$apply(function () {
        $timeout(function () {
          $pubionicloading.hide();
          $scope.contactsListatten=$myattentionser.getAttentionaaList();
        });
      })
    });


    //取消关注
    $scope.removeattention = function (id) {
      $pubionicloading.showloading('','正在加载...');
      if ($scope.myid==id){
        $ToastUtils.showToast("无法对自己进行该项操作")
      }else {
        var membersAerr = [];
        membersAerr.push(id);
        $addattentionser.removeAttention111(membersAerr);
      }
    }
    $scope.$on('attention.delete', function (event) {
      $scope.$apply(function () {
        $myattentionser.getAttentionList();
      })
    });


  })
  .controller('attentionDetailCtrl',function ($scope,$state,$stateParams,$savaLocalPlugin,$phonepluin,$searchdata,$api,$searchlocal,$addattentionser,$ToastUtils) {
    //返回关注列表界面
    $scope.backAttention = function () {
      $state.go("myAttention");
    }
    //拿上一个页面传的参数
    $scope.UserIDattention = $stateParams.UserIDatten;


    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
      })
    });


    //获取人员详细信息
    $searchdata.personDetail($scope.UserIDattention);
    $scope.$on('person.update',function (event) {
      $scope.$apply(function () {
        $scope.personsdetail111=$searchdata.getPersonDetail().user;

      })
    });




    //存本地
    $scope.insertPhoneSearch = function(name,phonenumber) {

      $savaLocalPlugin.insert(name,phonenumber);
    };

    //打电话
    $scope.callSearch = function(phonenumber,name) {
      $phonepluin.call(phonenumber,name);
    };
    //发短信
    $scope.smsSearch = function(phonenumber) {
      $phonepluin.sms(phonenumber);
    };


    //取消关注
    $scope.removeattention=function (id) {
      var membersAerr=[];
      membersAerr.push(id);
      $addattentionser.removeAttention111(membersAerr);
    }
    $scope.$on('attention.delete',function (event) {
      $scope.$apply(function () {
        $scope.personsdetail111.IsAttention=$addattentionser.getaddAttention111();

      })
    });

    //添加关注
    $scope.addattentiondetail = function(id) {
      var membersAerr=[];
      membersAerr.push(id);
      $addattentionser.addAttention111(membersAerr);
    };
    $scope.$on('attention.add',function (event) {
      $scope.$apply(function () {
        $scope.personsdetail111.IsAttention=$addattentionser.getaddAttention111();
      })
    });

  })

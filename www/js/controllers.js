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

  .controller('ContactsCtrl',  function ($scope, $http, $state,$stateParams,$greendao,$mqtt,$api,$contacts) {

    $contacts.rootDept();
    $scope.$on('first.update',function (event) {
      $scope.$apply(function () {
        $scope.depts=$contacts.getRootDept();
      })

    });
  })

  .controller('ContactSecondCtrl',  function ($scope, $state, $stateParams, contactService,$contacts) {

    $scope.departlist=[];
    $scope.userlist=[];
    $scope.secondStatus;

    $scope.contactId = $stateParams.contactId;//传过来的id；
    //根据id获取子部门和人员信息
    $contacts.deptInfo($scope.contactId);
    $scope.$on('second.update',function (event) {
      $scope.$apply(function () {

        $scope.deptinfo=$contacts.getFirstDeptName().DeptName;

        $scope.activeSecondDeptCount= $contacts.getCount1();

        $scope.activeSecondUserCount=$contacts.getCount2();


        if ($scope.activeSecondDeptCount>0){
          var olddepts=$contacts.getDeptInfo().deptList;
          for (var i=0; i<olddepts.length;i++){

            $scope.departlist.push(olddepts[i]);
          }
        }



        if($scope.activeSecondUserCount){
          var oldusers=$contacts.getDeptInfo().userList;
          for (var i=0; i<oldusers.length;i++){

            $scope.userlist.push(oldusers[i]);
          }
        }


        if (($scope.activeSecondDeptCount+$scope.activeSecondUserCount)===10){
          $scope.secondStatus=true;
        }else if (($scope.activeSecondDeptCount+$scope.activeSecondUserCount)<10){
          $scope.secondStatus=false;

        }


        $scope.parentID=$contacts.getDeptInfo().deptID;


        $scope.$broadcast('scroll.infiniteScrollComplete');


      })

    });
    $scope.$on('$ionicView.leave', function() {
      $contacts.clearSecondCount();
    });




    $scope.loadMoreSecond=function () {
      $contacts.deptInfo($scope.contactId);
    };


    //在二级目录跳转到联系人界面
    $scope.backFirst = function () {
      $state.go("tab.contacts");
    }

    //在二级目录跳转到三级目录
    $scope.jumpThird=function (id,pname) {
      $state.go("third",{
        "contactId": id,
        "secondname":pname
      });
    };

    //点击人员进入人员详情
    $scope.goSecondDetail=function (id) {
      $state.go("person",{
        "userId":id,
      });

    };




  })


  .controller('ContactThirdCtrl', function ($scope, $http, $state, $stateParams,$contacts) {

    $scope.departthirdlist=[];
    $scope.userthirdlist=[];
    $scope.thirdStatus;

    //点击当前点击部门的id
    $scope.contactId = $stateParams.contactId;
    //一级的名字
    $scope.pppid=$stateParams.secondname;

    //根据id获取子部门的数据
    $contacts.deptThirdInfo($scope.contactId);


    $scope.$on('third.update',function (event) {

      $scope.$apply(function () {
        $scope.count1=$contacts.getCount3();
        if ($scope.count1>0){
          var olddepts=$contacts.getDeptThirdInfo().deptList;
          for (var i=0; i<olddepts.length;i++){

            $scope.departthirdlist.push(olddepts[i]);
          }
        }
        $scope.count2=$contacts.getCount4();

        if ($scope.count2>0){
          var oldusers=$contacts.getDeptThirdInfo().userList;

          for (var i=0; i<oldusers.length;i++){

            $scope.userthirdlist.push(oldusers[i]);
          }
        }

        $scope.parentID=$contacts.getDeptThirdInfo().deptID;
        $scope.deptinfo2=$contacts.getSecondDeptName().DeptName;

        $scope.thirdlength=(document.getElementById('a1').innerText.length+$scope.pppid.length+$scope.deptinfo2.length)*15+80;
        var thirddiv=document.getElementById("thirdscroll");
        thirddiv.style.width=$scope.thirdlength+"px";

        if (($scope.count1+$scope.count2)===10){
          $scope.thirdStatus=true;
        }else if (($scope.count1+$scope.count2)<10){
          $scope.thirdStatus=false;

        }
      })
      $scope.$broadcast('scroll.infiniteScrollComplete');

    });


    $scope.loadThirdMore=function () {

      $contacts.deptThirdInfo($scope.contactId);

    };


    $scope.$on('$ionicView.leave', function() {
      $contacts.clearThirdCount();
    });

    //在三级目录返回第二级
    $scope.idddd=$contacts.getFirstID();

    $scope.backSecond = function (sd) {
      $state.go("second", {
        "contactId": sd
      });
    }


    //在第二级目录跳转到第四级目录
    $scope.jumpForth=function (id,sname,tname) {
      $state.go("forth",{
        "contactId": id,
        "secondname":sname,
        "thirdname":tname
      });
    }


    //点击人员进入人员详情
    $scope.goThirdDetail=function (id) {
      $state.go("person",{
        "userId":id,
      });

    };



  })

  .controller('ContactForthCtrl', function ($scope, $http, $state, $stateParams, contactService,$contacts) {

    $scope.departlist=[];
    $scope.userlist=[];

    $scope.forthStatus;


    $scope.contactId = $stateParams.contactId;
    $scope.secondName=$stateParams.secondname;
    $scope.thirdName=$stateParams.thirdname;

    //根据id获取子部门和人员信息
    $contacts.deptForthInfo($scope.contactId);
    $scope.$on('forth.update',function (event) {
      $scope.$apply(function () {


        $scope.count1=$contacts.getCount5();
        if ($scope.count1>0){
          var olddepts=$contacts.getDeptForthInfo().deptList;
          for (var i=0; i<olddepts.length;i++){

            $scope.departlist.push(olddepts[i]);
          }
        }
        $scope.count2=$contacts.getCount6();

        if ($scope.count2>0){
          var oldusers=$contacts.getDeptForthInfo().userList;

          for (var i=0; i<oldusers.length;i++){

            $scope.userlist.push(oldusers[i]);
          }
        }

        $scope.parentID=$contacts.getDeptForthInfo().deptID;
        $scope.deptinfo4=$contacts.getThirdDeptName().DeptName;




        $scope.forthlength=(document.getElementById('a1').innerText.length+$scope.secondName.length+$scope.thirdName.length+ $scope.deptinfo4.length)*15+120;

        var forthdiv=document.getElementById("forthscroll");
        forthdiv.style.width=$scope.forthlength+"px";

        if (($scope.count1+$scope.count2)===10){
          $scope.forthStatus=true;
        }else if (($scope.count1+$scope.count2)<10){
          $scope.forthStatus=false;

        }

        $scope.$broadcast('scroll.infiniteScrollComplete');


      })

    });

    $scope.loadForthMore=function () {
      $contacts.deptForthInfo($scope.contactId);

    }

    $scope.$on('$ionicView.leave', function() {
      $contacts.clearForthCount();
    });



    //在四级目录需要返回三级目录  （ 三级目录进来需要两个参数 一个是 二级目录id一个是二级目录的名字 ）

    $scope.idididi=$contacts.getSecondID();
    $scope.firstid=$contacts.getFirstID();


    $scope.backThird=function (sd,named) {

      $state.go("third", {
        "contactId": sd,
        "secondname":named
      });

    };

    // 在四级目录返回二级目录  （二级目录只需要一个id就行）
    $scope.fromForthToSecond=function (sd) {
      $state.go("second", {
        "contactId": sd
      });
    };

    //从四级目录跳入五级目录
    $scope.jumpFifth=function (id,sname,tname,fname) {
      $state.go("fifth",{
        "contactId":id,
        "secondname":sname,
        "thirdname":tname,
        "forthname":fname,
      });
    };

    //从四级目录跳入详情界面

    $scope.goForthDetail=function (id) {
      $state.go("person",{
        "userId":id,
      });
    }

  })





  .controller('ContactFifthCtrl', function ($scope, $state, $stateParams,$contacts) {

    $scope.departfifthlist=[];
    $scope.userfifthlist=[];
    $scope.fifthStatus;

    $scope.contactId = $stateParams.contactId;
    $scope.secondName=$stateParams.secondname;
    $scope.thirdName=$stateParams.thirdname;
    $scope.forthName=$stateParams.forthname;

    //根据id获取子部门和人员信息
    $contacts.deptFifthInfo($scope.contactId);
    $scope.$on('fifth.update',function (event) {
      $scope.$apply(function () {

        $scope.count1=$contacts.getCount7();
        if ($scope.count1>0){
          var olddepts=$contacts.getDeptFifthInfo().deptList;
          for (var i=0; i<olddepts.length;i++){

            $scope.departfifthlist.push(olddepts[i]);
          }
        }
        $scope.count2=$contacts.getCount8();

        if ($scope.count2>0){
          var oldusers=$contacts.getDeptFifthInfo().userList;

          for (var i=0; i<oldusers.length;i++){

            $scope.userfifthlist.push(oldusers[i]);
          }
        }


        if (($scope.count1+$scope.count2)===10){
          $scope.fifthStatus=true;
        }else if (($scope.count1+$scope.count2)<10){
          $scope.fifthStatus=false;

        }

        $scope.parentID=$contacts.getDeptFifthInfo().deptID;
        $scope.deptinfo5=$contacts.getForthDeptName().DeptName;

        $scope.fifthlength=(document.getElementById('a1').innerText.length+$scope.secondName.length+$scope.thirdName.length+$scope.forthName.length +$scope.deptinfo5.length)*15+140;




        var fifthdiv=document.getElementById("fifthscroll");
        fifthdiv.style.width=$scope.fifthlength+"px";

        $scope.$broadcast('scroll.infiniteScrollComplete');


      })

    });

    $scope.loadFifthMore=function () {
      $contacts.deptFifthInfo($scope.contactId);

    }


    $scope.$on('$ionicView.leave', function() {
      $contacts.clearFifthCount();
    });

    //返回二级部门 需要一个id；
    $scope.firstid=$contacts.getFirstID();
    $scope.secondid=$contacts.getSecondID();
    $scope.thirdid=$contacts.getThirdID();

    $scope.fromFifthToSecond=function (sd) {
      $state.go("second", {
        "contactId": sd
      });

    };



    //返回三级部门需要一个Id和一个名字；
    $scope.fromFifthToThird=function (sd,sname) {
      $state.go("third",{
        "contactId": sd,
        "secondname":sname,
      });
    };




    //返回四级部门 需要一个id 和 两个名字
    $scope.backForth=function (sd,sname,tname) {
      $state.go("forth",{
        "contactId": sd,
        "secondname":sname,
        "thirdname":tname,
      });
    };

    //从五级部门跳转到六级部门
    $scope.jumpSixth=function (id,sname,tname,fname,dd) {
      $state.go("sixth",{
        "contactId":id,
        "secondname":sname,
        "thirdname":tname,
        "forthname":fname,
        "fifthname":dd
      });
    };




    //从五级部门跳转到详情界面
    $scope.goFifthDetail=function(id){
      $state.go("person",{
        "userId":id,
      });
    }




  })







  .controller('ContactSixthCtrl' ,function ($scope, $http, $state, $stateParams,$contacts) {

    $scope.departsixthlist=[];
    $scope.usersixthlist=[];
    $scope.sixthStatus;

    $scope.contactId = $stateParams.contactId;
    $scope.secondName=$stateParams.secondname;
    $scope.thirdName=$stateParams.thirdname;
    $scope.forthName=$stateParams.forthname;
    $scope.fifthName=$stateParams.fifthname;


    //根据id获取子部门和人员信息

    //根据id获取子部门和人员信息
    $contacts.deptSixthInfo($scope.contactId);
    $scope.$on('sixth.update',function (event) {
      $scope.$apply(function () {

        $scope.count1=$contacts.getCount9();
        if ($scope.count1>0){
          var olddepts=$contacts.getDeptSixthInfo().deptList;
          for (var i=0; i<olddepts.length;i++){

            $scope.departsixthlist.push(olddepts[i]);
          }
        }
        $scope.count2=$contacts.getCount10();

        if ($scope.count2>0){
          var oldusers=$contacts.getDeptSixthInfo().userList;

          for (var i=0; i<oldusers.length;i++){

            $scope.usersixthlist.push(oldusers[i]);
          }
        }


        if (($scope.count1+$scope.count2)===10){
          $scope.sixthStatus=true;
        }else if (($scope.count1+$scope.count2)<10){
          $scope.sixthStatus=false;

        }



        $scope.parentID=$contacts.getDeptSixthInfo().deptID;
        $scope.deptinfo6=$contacts.getFifthDeptName().DeptName;



        $scope.sixthlength=(document.getElementById('a1').innerText.length+$scope.secondName.length+$scope.thirdName.length+
          $scope.forthName.length +$scope.fifthName.length+$scope.deptinfo6.length)*15+180;

        var sixthdiv=document.getElementById("sixthscroll");
        sixthdiv.style.width=$scope.sixthlength+"px";

        $scope.$broadcast('scroll.infiniteScrollComplete');


      })

    });



    $scope.loadSixthMore=function () {
      $contacts.deptSixthInfo($scope.contactId);

    }

    $scope.$on('$ionicView.leave', function() {
      $contacts.clearSixthCount();
    });




    //返回二级部门 需要一个id；
    $scope.firstidInSix=$contacts.getFirstID();
    $scope.secondidInSix=$contacts.getSecondID();
    $scope.thirdidInSix=$contacts.getThirdID();
    $scope.forthidInSix=$contacts.getForthID();



    //从六级部门跳转到七级部门
    $scope.jumpSeventh=function (id,sname,tname,fname,sixname,ddd) {
      $state.go("seventh",{
        "contactId":id,
        "secondname":sname,
        "thirdname":tname,
        "forthname":fname,
        "fifthname":sixname,
        "sixthname":ddd
      });
    };

    //从六级界面跳转到2级界面 只需要一个参数
    $scope.fromSixthToSecond=function (sd) {
      $state.go("second", {
        "contactId": sd
      });
    };

    //从六级跳转到3级界面 需要两个参数
    $scope.fromSixthToThird=function (sd,sname) {
      $state.go("third",{
        "contactId": sd,
        "secondname":sname,
      });
    };

    //从六级跳转到4级界面  需要三个参数

    $scope.fromSixthToForth=function (sd,sname,tname) {
      $state.go("forth",{
        "contactId": sd,
        "secondname":sname,
        "thirdname":tname,
      });
    };

    //从六级返回五级  需要四个参数

    $scope.backFifth=function (sd,sname,tname,ttname) {
      $state.go("fifth",{
        "contactId": sd,
        "secondname":sname,
        "thirdname":tname,
        "forthname":ttname
      });
    };


    //从六级部门跳转到详情界面
    $scope.goSixthDetail=function(id){
      $state.go("person",{
        "userId":id,
      });
    };

  })


  .controller('ContactSeventhCtrl', function ($scope, $state, $stateParams, $contacts,$ionicHistory) {

    $scope.nihao=[];
    $scope.buhao=[];
    $scope.seventhStatus;

    $scope.contactId = $stateParams.contactId;
    $scope.secondName=$stateParams.secondname;
    $scope.thirdName=$stateParams.thirdname;
    $scope.forthName=$stateParams.forthname;
    $scope.fifthName=$stateParams.fifthname;
    $scope.sixthName=$stateParams.sixthname;

    //根据id获取子部门和人员信息

    $contacts.deptSeventhInfo($scope.contactId);
    $scope.$on('seventh.update',function (event) {
      $scope.$apply(function () {
        $scope.count1=$contacts.getCount11();
        if ($scope.count1>0){
          var olddepts=$contacts.getDeptSeventhInfo().deptList;
          for (var i=0; i<olddepts.length;i++){

            $scope.nihao.push(olddepts[i]);
          }
        }
        $scope.count2=$contacts.getCount12();
        alert("七级的数字"+$scope.count2);
        if ($scope.count2>0){
          var oldusers=$contacts.getDeptSeventhInfo().userList;

          for (var i=0; i<oldusers.length;i++){

            $scope.buhao.push(oldusers[i]);
          }
        }


        if (($scope.count1+$scope.count2)===10){
          $scope.seventhStatus=true;
        }else if (($scope.count1+$scope.count2)<10){
          $scope.seventhStatus=false;

        }


        $scope.parentID=$contacts.getDeptSeventhInfo().deptID;
        $scope.deptinfo7=$contacts.getSixthDeptName().DeptName;


        $scope.seventhlength=(document.getElementById('a1').innerText.length+$scope.secondName.length+$scope.thirdName.length+$scope.forthName.length
          +$scope.fifthName.length+$scope.sixthName.length+$scope.deptinfo7.length)*15+200;

        var seventhdiv=document.getElementById("seventhscroll");
        seventhdiv.style.width=$scope.seventhlength+"px";

        $scope.$broadcast('scroll.infiniteScrollComplete');

      })

    });

    $scope.loadSeventhMore=function () {
      $contacts.deptSeventhInfo($scope.contactId);

    }

    $scope.$on('$ionicView.leave', function() {
      $contacts.clearSeventhCount();
    });

    $scope.firstidInSeven=$contacts.getFirstID();
    $scope.secondidInSeven=$contacts.getSecondID();
    $scope.thirdidInSeven=$contacts.getThirdID();
    $scope.forthidInSeven=$contacts.getForthID();
    $scope.fifthidInSeven=$contacts.getFifthID();





    //返回六级列表

    $scope.backSixth=function () {
      $ionicHistory.goBack();

    }


    //从七级目录到五级目录  五级目录需要四个参数
    $scope.formSeventhToFifth=function (sd,sname,tname,ttname) {
      $state.go("fifth",{
        "contactId": sd,
        "secondname":sname,
        "thirdname":tname,
        "forthname":ttname
      });
    }

    //从七级目录到四级目录  四级目录需要四个参数
    $scope.fromSeventhToForth=function (sd,sname,tname) {
      $state.go("forth",{
        "contactId": sd,
        "secondname":sname,
        "thirdname":tname,
      });
    };

    //从七级目录到三级目录  三级目录需要两个个参数


    $scope.fromSeventhToThird=function (sd,sname) {
      $state.go("third",{
        "contactId": sd,
        "secondname":sname,
      });
    };

    //从七级目录到二级目录  二级目录需要1个参数

    $scope.fromSeventhToSecond=function (sd) {
      $state.go("second", {
        "contactId": sd
      });
    };


    //从七级界面跳入到详情界面
    $scope.goSeventhDetail=function(id){
      $state.go("person",{
        "userId":id,
      });
    };

  })


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


  .controller('PersonCtrl', function ($scope,$stateParams, $state, $phonepluin,$savaLocalPlugin,$contacts,$ionicHistory,$rootScope) {

    $scope.userId = $stateParams.userId;


    $contacts.personDetail($scope.userId);
    $scope.$on('personDetail.update',function (event) {
      $scope.$apply(function () {
        $scope.persondsfs=$contacts.getPersonDetail();
        if ($scope.persondsfs.UserName.length > 3) {
          $scope.simpleName = $scope.persondsfs.UserName.substr(1, 2);
        } else {
          $scope.simpleName = $scope.persondsfs.UserName;

        }

      })

    });

    $scope.backAny=function () {

      $ionicHistory.goBack();

    };

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

    //创建聊天
    $scope.createchat=function (id,sessionid) {
      $rootScope.isPersonSend='true';
      alert(id+sessionid);
      $state.go('tab.message',{
        "id":id,
        "sessionid":sessionid
      });
    };

  })


  .controller('MessageDetailCtrl', function ($scope, $state,$http, $ionicScrollDelegate,$mqtt,$ionicActionSheet,$greendao,$timeout,$rootScope,$stateParams) {
    //清表数据
    // $greendao.deleteAllData('MessagesService',function (data) {
    //   alert(data);
    // },function (err) {
    //   alert(err);
    // });
    //对话框名称
    $scope.myUserID = $rootScope.rootUserId;
    $scope.userId=$stateParams.id;
    $scope.viewtitle=$stateParams.ssid;
    // alert($scope.viewtitle+"抬头"+$scope.myUserID);
    $greendao.queryData('MessagesService','where sessionid =? order by "when" desc limit 0,10',$scope.userId,function (data) {
      //根据不同用户，显示聊天记录，查询数据库以后，不论有没有数据，都要清楚之前数组里面的数据
      for(var j=0;j<=$mqtt.getDanliao().length;j++){
        $mqtt.getDanliao().splice(j,$mqtt.getDanliao().length);//清除之前数组里存的数据
      }
      for(var i = 0; i <= data.length; i++) {
        $mqtt.getDanliao().push(data[data.length-i]);
      }
      $scope.msgs=$mqtt.getDanliao();
    },function (err) {
      alert(err);
    });

    var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
    var footerBar = document.body.querySelector('#messageDetail .bar-footer');
    var txtInput = angular.element(footerBar.querySelector('textarea'));

    $scope.$on('$ionicView.enter', function() {

      viewScroll.scrollBottom();

    });
    $scope.doRefresh = function () {
      $greendao.queryData('MessagesService','where sessionid =? order by "when" desc limit 0,'+($mqtt.getDanliao().length+10),$scope.userId,function (data) {
        if($scope.msgs.length <50){
          for(var j=0;j<=$mqtt.getDanliao().length;j++){
            $mqtt.getDanliao().splice(j,$mqtt.getDanliao().length);//清除之前数组里存的数据
          }
          for(var i = 1; i <= data.length; i++) {
            $mqtt.getDanliao().push(data[data.length-i]);
          }
          $scope.msgs=$mqtt.getDanliao();
        }else if($scope.msgs.length >= 50){
          $scope.nomore="true";
        }
        $scope.$broadcast("scroll.refreshComplete");
      },function (err) {
        alert(err);
      });
    }

    window.addEventListener("native.keyboardshow", function (e) {
      viewScroll.scrollBottom();
    });

    $scope.sendSingleMsg = function (topic, content, id,account) {
      $mqtt.getMqtt().getTopic(topic,'U',function (userTopic) {
        $scope.suc=$mqtt.sendMsg(userTopic, content, id,account);
        $scope.send_content="";
        keepKeyboardOpen();
      }, function (msg) {
      });
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
    // $mqtt.arriveMsg("");
    $scope.$on('msgs.update',function (event) {
      $scope.$apply(function () {
        $scope.msgs=$mqtt.getDanliao();
        $timeout(function() {
          viewScroll.scrollBottom();
        }, 100);
      })

    });


    $scope.$on('msgs.error',function (event) {
      $scope.$apply(function () {
        $scope.msgs=$mqtt.getDanliao();
        $timeout(function() {
          viewScroll.scrollBottom();
        }, 100);
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
      $greendao.queryData('MessagesService','where sessionid =? order by "when" desc limit 0,1',$scope.userId,function (data) {
        if(data.length ===0){
          $scope.lastText='';//最后一条消息内容
          $scope.lastDate=0;//最后一条消息的时间
          $scope.chatName=$scope.viewtitle;//对话框名称
          $scope.imgSrc='';//最后一条消息的头像
        }else {
          $scope.lastText = data[0].message;//最后一条消息内容
          $scope.lastDate = data[0].when;//最后一条消息的时间
          $scope.chatName = data[0].username;//对话框名称
          $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
        }
        $greendao.queryData('ChatListService','where id=?',$scope.userId,function (data) {
            var chatitem={};
            chatitem.id=data[0].id;
            chatitem.chatName=$scope.chatName;
            chatitem.imgSrc=$scope.imgSrc;
            chatitem.lastText=$scope.lastText;
            chatitem.count='0';
            chatitem.isDelete=data[0].isDelete;
            chatitem.lastDate=$scope.lastDate;
            $greendao.saveObj('ChatListService',chatitem,function (data) {
              // alert("save success");
              $greendao.loadAllData('ChatListService',function (data) {
                // alert("加载成功");
                $state.go("tab.message",{
                  "id":$scope.userId,
                  "sessionid":$scope.chatName
                });
              },function (err) {
                alert(err+"加载全部数据失败");
              });
            },function (err) {
              alert(err+"数据保存失败");
            });
          },function (err) {
            alert(err+"查询聊天列表失败");
          });
      },function (err) {
        alert(err+"数据离开失败");
      });
    }

    //当前聊天记录超过50条时，跳转到历史消息记录页面
    $scope.skipmessagebox=function () {
      // alert("正确进入聊天方法"+$scope.viewtitle+$scope.userId);
      $state.go("historyMessage",{
        id:$scope.userId,
        ssid:$scope.viewtitle
      });

    };

    //点击小头像，跳转到聊天设置界面
    $scope.personalSetting=function () {
      $state.go('personalSetting',{
        id:$scope.userId,
        ssid:$scope.viewtitle
      });
    };
  })


  .controller('MessageGroupCtrl',function ($scope,$state, $http, $ionicScrollDelegate,$mqtt,$ionicActionSheet,$greendao,$timeout) {
    $greendao.queryData('MessagesService','where type =? order by "when" desc limit 0,10','Group',function (data) {
      for(var i = 1; i <= data.length; i++) {
        $mqtt.getQunliao().push(data[data.length-i]);
        $scope.groupmsgs=$mqtt.getQunliao();
      }
    },function (err) {
      alert(err);
    });
    var viewScroll = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
    var footerBar = document.body.querySelector('#messageGroupDetail .bar-footer');
    var txtInput = angular.element(footerBar.querySelector('textarea'));

    //获取更多数据
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
    $mqtt.arriveMsg("cll");
    $scope.$on('groupMsgs.update',function (event) {
      $scope.$apply(function () {
        $scope.groupmsgs=$mqtt.getQunliao();
        $timeout(function() {
          viewScroll.scrollBottom();
        }, 100);
      //   $greendao.queryData('MessagesService','where type =?','Group',function (data) {
      //     $scope.msgs=data;
      //     $timeout(function() {
      //     viewScroll.scrollBottom();
      //   }, 100);
      // },function (err) {
      //   alert(err);
      // });
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
        // viewScroll.scrollBottom();
      })

    });

    $scope.$on('groupMsgs.error',function (event) {
      $scope.$apply(function () {
        $scope.groupmsgs=$mqtt.getQunliao();
        $timeout(function() {
          viewScroll.scrollBottom();
        }, 100);
        // $greendao.queryData('MessagesService','where type =?','Group',function (data) {
        //   $scope.msgs=data;
        //   $timeout(function() {
        //     viewScroll.scrollBottom();
        //   }, 100);
        // },function (err) {
        //   alert(err);
        // });
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




  .controller('MessageCtrl', function ($scope, $http, $state,$mqtt,$chatarr,$stateParams,$rootScope,$greendao) {
    //清表数据
    // $greendao.deleteAllData('ChatListService',function (data) {
    //   alert(data);
    // },function (err) {
    //   alert(err);
    // });
    $scope.userId=$stateParams.id;
    $scope.userName=$stateParams.sessionid;
    // alert($scope.userId+"messageC"+$scope.userName);
    if($rootScope.isPersonSend === 'true'){
      $scope.items=$chatarr.getAll($rootScope.isPersonSend);
      $scope.$on('chatarr.update',function (event) {
        $scope.$apply(function () {
          $scope.items=$chatarr.getAll($rootScope.isPersonSend);
        });
      });
      $rootScope.isPersonSend = 'false';
    }
    //如果不是创建聊天，就直接从数据库里取列表数据
    $greendao.loadAllData('ChatListService',function (data) {
      $scope.items=data;
      //当登陆成功以后进入主界面，从数据库取值：聊天对话框名称
      // $scope.ssid=
      // alert($scope.items.length+"聊天列表长度");
    },function (err) {
      alert(err);
    });
    $mqtt.arriveMsg("");

    $scope.$on('msgs.update',function (event) {

      $scope.$apply(function () {
        $scope.danliaomsg=$mqtt.getDanliao();
        $scope.qunliaomsg=$mqtt.getQunliao();
        //当lastcount值变化的时候，进行数据库更新：将更改后的count的值赋值与unread，并将该条对象插入数据库并更新
        $scope.lastCount=$mqtt.getMsgCount();
        //取出与‘ppp’的聊天记录最后一条
        $greendao.queryData('MessagesService','where sessionid =? order by "when" desc limit 0,1',$scope.userId,function (data) {
          $scope.lastText=data[0].message;//最后一条消息内容
          $scope.lastDate=data[0].when;//最后一条消息的时间
          $scope.chatName=data[0].username;//对话框名称
          $scope.imgSrc=data[0].imgSrc;//最后一条消息的头像
          //取出‘ppp’聊天对话的列表数据并进行数据库更新
          $greendao.queryData('ChatListService','where CHAT_NAME =?',$scope.chatName,function (data) {
            $scope.unread=$scope.lastCount;
            var chatitem={};
            chatitem.id=data[0].id;
            chatitem.chatName=$scope.chatName;
            chatitem.imgSrc=$scope.imgSrc;
            chatitem.lastText=$scope.lastText;
            chatitem.count=$scope.unread;
            chatitem.isDelete=data[0].isDelete;
            chatitem.lastDate=$scope.lastDate;
            $greendao.saveObj('ChatListService',chatitem,function (data) {
              $greendao.loadAllData('ChatListService',function (data) {
                $chatarr.setData(data);
                $rootScope.$broadcast('lastcount.update');
              },function (err) {

              });
            },function (err) {
              alert(err+"数据保存失败");
            });
          },function (err) {
            alert(err);
          });
        },function (err) {
          alert(err);
        });
        $scope.lastGroupCount=$mqtt.getMsgGroupCount();
      })

    });

    $scope.$on('lastcount.update',function (event) {
      $scope.$apply(function () {
        $scope.items=$chatarr.getData();
      });

    });

    //进入单聊界面
    $scope.goDetailMessage=function (id,ssid) {
      $mqtt.clearMsgCount();
      //将变化的count赋值给unread对象
      $scope.unread =$mqtt.getMsgCount();
      //取出最后一条消息记录的数据
      $greendao.queryData('MessagesService','where sessionid =? order by "when" desc limit 0,1',$scope.userId,function (data) {
        // alert(data.length+"最后一条数据");
        $scope.lastText=data[0].message;//最后一条消息内容
        $scope.lastDate=data[0].when;//最后一条消息的时间
        $scope.chatName=data[0].username;//对话框名称
        $scope.imgSrc=data[0].imgSrc;//最后一条消息的头像
        //如果count为0，就不用做数据更新；如果count不为0并且chatname为‘PPP’，则将更改后的unread值插入数据库更新
        $greendao.queryData('ChatListService','where CHAT_NAME=? and count !=0',$scope.chatName,function (data) {
          var chatitem={};
          chatitem.id=data[0].id;
          chatitem.chatName=$scope.chatName;
          chatitem.imgSrc=$scope.imgSrc;
          chatitem.lastText=$scope.lastText;
          chatitem.count=$scope.unread;
          chatitem.isDelete=data[0].isDelete;
          chatitem.lastDate=$scope.lastDate;
          $greendao.saveObj('ChatListService',chatitem,function (data) {
          },function (err) {
            alert(err);
          });
        },function (err) {
          alert(err);
        });
      },function (err) {
        alert(err);
      });

      //进入聊天详情界面
      $state.go('messageDetail',
        {
          "id":id,
          "ssid":ssid
        });




    };



    //进入群聊界面
    $scope.goGroupMessage=function () {
      $mqtt.clearMsgGroupCount();
      $scope.lastGroupCount=$mqtt.getMsgGroupCount();
      $state.go("messageGroup");
    }


    $scope.goSearch= function () {
      $state.go("search");
    }

    //

  })






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

  .controller('LoginCtrl',function ($scope, $state, $ionicPopup, $ionicLoading, $cordovaFileOpener2, $http,$mqtt,$cordovaPreferences,$api,$rootScope) {
    $scope.name="";
    $scope.password="";

    document.addEventListener('deviceready',function () {
        $mqtt.getMqtt().getString('historyusername',function(message){
        $scope.name = message;
      });
      if(!$mqtt.isLogin()) {
        $mqtt.getMqtt().getMyTopic(function (msg) {
          if (msg != null && msg != '') {
            $mqtt.startMqttChat(msg);
            $mqtt.setLogin(true);
            $state.go('tab.message');
            return;
          }
        },function (msg) {
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
      $api.login($scope.name,$scope.password, function (message) {
        // alert(message.isActive + "nh");
        //alert(message.toJSONString());
        if (message.isActive === false) {
          $api.activeUser(message.userID, function (message) {
            loginM();
          },function (message) {
            alert(message);
          });
        } else {
          loginM();
        }
      }, function (message) {
        //alert(message);
        $scope.name = response;
        $ionicLoading.hide();
        $state.go('tab.message');
      });

    };
    var loginM = function () {
      //获取当前用户的id
      $mqtt.getMqtt().getUserId(function (userID) {
        $rootScope.rootUserId=userID;
      },function (err) {

      });
      // alert(message.toString());
      $api.checkUpdate($ionicPopup, $ionicLoading, $cordovaFileOpener2, $mqtt);
      $scope.names = [];
      $ionicLoading.hide();
      //调用保存用户名方法
      $mqtt.getMqtt().saveLogin('name', $scope.name, function (message) {
      },function (message) {
        alert(message);
      });
      $mqtt.getMqtt().getMyTopic(function (msg) {
        $mqtt.startMqttChat(msg);
        $mqtt.setLogin(true);
        $state.go('tab.message');
      },function (msg) {
      });
    }
  })
  .controller('TabMessageCtrl',function ($scope) {
    /*document.addEventListener('deviceready',function () {
      $mqtt.getMqtt().getChats('sls',function(message){
        alert(message);
      },function(message){
        alert(message);
      });
    });*/
  })

  .controller('SettingAccountCtrl',function ($scope,$state,$stateParams,$greendao) {
    //取出聊天界面带过来的id和ssid
    $scope.userId=$stateParams.id;
    $scope.userName=$stateParams.ssid;
    // alert($scope.userId+"daiguolai"+$scope.userName);
    $scope.addFriend1=function () {
      $state.go("myAttention1");
    }
    //返回到聊天记录界面
    $scope.gobackmsgdetail=function (id,ssid) {
      // alert("返回聊天界面"+id+ssid);
      $state.go('messageDetail',{
        id:id,
        ssid:ssid
      });
    };

    //清空聊天记录
    $scope.clearMsg=function (id,ssid) {
      //查询消息记录list
      // $greendao.deleteAllData('MessagesService',function (data) {
      //   alert(data);
      // },function (err) {
      //   alert(err);
      // });
      $greendao.queryData('MessagesService','where sessionid =?',$scope.userId,function (data) {
        // alert(data.length+"查询消息记录长度");
        for(var i=0;i<data.length;i++){
          var key=data[i]._id;
          // alert("消息对象"+key);
          $greendao.deleteDataByArg('MessagesService',key,function (data) {
            alert("删除成功");
          },function (err) {
            alert(err+清空消息记录失败);
          });
        }
      },function (err) {
        alert(err+"查询所有记录失败");
      });

    };
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

  //历史消息controller
  .controller('HistoryCtrl',function ($scope,$state) {

    alert("come 正确的页面了");
  })


  .controller('LocalContactCtrl',function ($scope,$state,localContact,$ionicActionSheet,$phonepluin,$ionicPopover,$ionicBackdrop,$mqtt) {

  //  var searchdata1=document.getElementById("searchdata1").innerText;

    // window.addEventListener("native.keyboardshow", function (e) {
    //   $ionicBackdrop.retain();
    //   document.getElementById("searchbutton").addEventListener('input',function(){
    //
    //     $state.go("search");
    //   });
    // });
    //
    // window.addEventListener("native.keyboardhide", function (e) {
    //   $ionicBackdrop.release();
    // });

    $scope.goLocalSearch= function () {
      $state.go("searchlocal");
    }


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
  })
  .controller('addNewPersonfirstCtrl', ['$scope', '$http', '$state', '$stateParams', 'contactService', function ($scope, $http, $state, $stateParams, contactService) {


    contactService.getContacts().then(function (response) {
      $scope.names = response;

    });

    $scope.contactId = $stateParams.contactId;
    $scope.contactsInfo = contactService.getContactById($stateParams.contactId)


    $scope.goGroupMessage = function () {
      $state.go("messageGroup");
    }

  }])
  .controller('addNewPersonsecondCtrl', ['$scope', '$http', '$state', '$stateParams', 'contactService', function ($scope, $http, $state, $stateParams, contactService){
    $scope.secondlength=(document.getElementById('a1').innerText.length+document.getElementById('a2').innerText.length)*15+50;

    var seconddiv=document.getElementById("secondscroll");
    seconddiv.style.width=$scope.secondlength+"px";
    $scope.contactId = $stateParams.contactId;
    $scope.contactsInfo = contactService.getContactById($stateParams.contactId);
    contactService.getContacts().then(function (response) {
      $scope.names = response;

    });

    $scope.backsecond = function (contactinfo) {
      $state.go("second", {
        "contactId": contactinfo.parentdeptid
      });
    }

  }])
  .controller('addNewPersonthirdCtrl', ['$scope', '$http', '$state', '$stateParams', 'contactService', function ($scope, $http, $state, $stateParams, contactService) {

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
  .controller('addNewPersonforthCtrl', ['$scope', '$http', '$state', '$stateParams', 'contactService', function ($scope, $http, $state, $stateParams, contactService) {
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
  .controller('addNewPersonfifthCtrl', ['$scope', '$http', '$state', '$stateParams', 'contactService', function ($scope, $http, $state, $stateParams, contactService) {
    contactService.getContacts().then(function (response) {
      $scope.names = response;

    });

    $scope.contactId = $stateParams.contactId;
    $scope.contactsInfo = contactService.getContactById($stateParams.contactId)


    $scope.goSixth = function () {
      $state.go("sixth");
    }

  }])
  .controller('addNewPersonsixthCtrl', ['$scope', '$http', '$state', '$stateParams', 'contactService', function ($scope, $http, $state, $stateParams, contactService) {

    contactService.getContacts().then(function (response) {
      $scope.names = response;

    });

    $scope.contactId = $stateParams.contactId;
    $scope.contactsInfo = contactService.getContactById($stateParams.contactId)


    $scope.goSeventh = function () {
      $state.go("seventh");
    }
  }])
  .controller('localDetailsCtrl',function ($scope,$state) {


  })
  .controller('searchCtrl',function ($scope, $http, $state, $stateParams, contactService,$timeout,$ionicBackdrop,$rootScope,$mqtt,$search111,$ionicPopup,$search222,$searchdata,$api,$ionicActionSheet,$phonepluin,$searchdatadianji) {

    $scope.query = "";
    $mqtt.getUserInfo(function (msg) {
      $scope.id=msg.userID;

    },function (msg) {
      alert(msg);
    });
    //搜索功能
    $scope.hasmore=true;
    $scope.page =1;
    $scope.count=15;
    $scope.persons=[];
    $scope.query1=""
    $scope.dosearch = function(query) {
      $scope.hasmore=true;
      $scope.page =1;
      $scope.persons=[];
      $scope.query1 =query;
      $search111.search1111($scope.id,$scope.page,$scope.count,query);
      $scope.$on('persons.update',function (event) {
        $scope.$apply(function () {
          $scope.hasmore=true;
          $scope.page =1;
          $scope.persons=[];
          $scope.query1 =query;
          $scope.persons=$search111.getPersons().searchResult;
          $scope.$broadcast('scroll.infiniteScrollComplete');
          if ($scope.persons.length>=15){
            $scope.hasmore=true
            $scope.page++
          }else {
            $scope.hasmore=false
          }
        })

      });
    }

//上拉加载
    $scope.loadMore = function(){
      if ($scope.page<2||!$scope.hasmore){
        $scope.$broadcast('scroll.infiniteScrollComplete');
        return;
      }
      // alert("id="+$scope.id+",page="+$scope.page+",count="+$scope.count+",query1="+$scope.query1)
      $search222.search2222($scope.id,$scope.page,$scope.count,$scope.query1);
    };
    $scope.$on('persons2.update2',function (event) {
      $scope.$apply(function () {
        if ($search222.getPersons2()===null){
          alert("没有更多数据")
          $scope.hasmore=false
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }else {
          var person=$search222.getPersons2().searchResult;
        }

        for (var i = 0; i < person.length; i++) {
          $scope.persons.push(person[i]);
        }
        if (person.length>=15){
          $scope.hasmore=true
          $scope.page++
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }else {
          alert("没有更多数据")
          $scope.hasmore=false
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
    });

    //点击头像弹窗
    $scope.$on('person.dianji',function (event) {
      $scope.$apply(function () {
        $scope.phoneattention=$searchdatadianji.getPersonDetaildianji().user.Mobile;
        $scope.nameattention=$searchdatadianji.getPersonDetaildianji().user.UserName;
//打电话
        $scope.call = function(phonenumber,name) {
          $phonepluin.call(phonenumber,name);
        };
        //发短信
        $scope.sms = function(phonenumber) {
          $phonepluin.sms(phonenumber);
        };
        // 显示操作表
        $ionicActionSheet.show({
          buttons: [
            { text: '打电话' },
            { text: '发短信'}
          ],
          titleText: $scope.nameattention,
          cancelText: '取消',
          buttonClicked: function(index) {
            if(index==0){
              $scope.call($scope.phoneattention,$scope.nameattention);
            }else {
              $scope.sms($scope.phoneattention);
            }
            return true;
          }

        });
        // $scope.youmeiyou= $searchdata.getyesorno($scope.personsdetail111.Mobile)
      })
    });

    $scope.tanchuangsearch = function(idsearch) {
      //获取人员详细信息
      $searchdatadianji.personDetaildianji(idsearch);

    };

    //跳到详情界面
    $scope.jumpSearch=function (id) {
      $state.go("searchdetail",{
        "UserID":id,
      });
    }


  })


  .controller('searchDetailCtrl',function ($scope,$state,$stateParams,$savaLocalPlugin,$phonepluin,$searchdata,$api,$addattentionser) {

    $scope.backSearch = function () {
      $state.go("search");
    }
    $scope.UserID111 = $stateParams.UserID;

    $searchdata.personDetail($scope.UserID111);
    $scope.$on('person.update',function (event) {
      $scope.$apply(function () {
        $scope.personsdetail=$searchdata.getPersonDetail().user;
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
        $scope.personsdetail.IsAttention=$addattentionser.getaddAttention111();
        // $scope.youmeiyou= $searchdata.getyesorno($scope.personsdetail111.Mobile)
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
        $scope.personsdetail.IsAttention=$addattentionser.getaddAttention111();
        // $scope.youmeiyou= $searchdata.getyesorno($scope.personsdetail111.Mobile)
      })
    });

  })


  .controller('searchLocalCtrl',function ($scope, $http, $state, $stateParams, contactService,$timeout,$ionicBackdrop,$rootScope,$mqtt,$searchlocal,$ionicActionSheet,$phonepluin) {

    $scope.query = "";

    $scope.dosearchlocal = function(query) {
      $searchlocal.getlocalContact(query);
      $scope.$on('localperson.update',function (event) {
        $scope.$apply(function () {
          $scope.localpersons=$searchlocal.getLocalContacts();
          //alert($scope.localpersons)
        })
      });

    }

    // 点击按钮触发，或一些其他的触发条件
    $scope.tanchuanglocal = function(phonenumber,name) {
      //打电话
      $scope.call = function(phonenumber,name) {
        $phonepluin.call(phonenumber,name);
      };
      $scope.sms = function(phonenumber) {
        $phonepluin.sms(phonenumber);
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


  })

  .controller('myattentionaaaSelectCtrl',function ($scope,$state,$myattentionser,$api,$ionicLoading,$timeout,$phonepluin,$ionicActionSheet,$searchdata,$searchdatadianji) {

    // $myattentionser.getAttentionList();
    // $scope.$on('attention.update',function (event) {
    //   $scope.$apply(function () {
    //     $scope.contactsListatten=$myattentionser.getAttentionaaList();
    //     //alert($scope.localpersons)
    //   })
    // });

    $scope.jumpattenDetial=function (id) {
      // $searchdatadianji.personDetaildianji(id);
      $state.go("attentionDetail",{
        "UserIDatten":id
        // "youmeiyou":$scope.youmeiyou,
      });

    }

    $scope.$on('person.update',function (event) {
      $scope.$apply(function () {
        $scope.phoneattention=$searchdata.getPersonDetail().user.Mobile;
        $scope.nameattention=$searchdata.getPersonDetail().user.UserName;
//打电话
        $scope.call = function(phonenumber,name) {
          $phonepluin.call(phonenumber,name);
        };
        //发短信
        $scope.sms = function(phonenumber) {
          $phonepluin.sms(phonenumber);
        };
        // 显示操作表
        $ionicActionSheet.show({
          buttons: [
            { text: '打电话' },
            { text: '发短信'}
          ],
          titleText: $scope.nameattention,
          cancelText: '取消',
          buttonClicked: function(index) {
            if(index==0){
              $scope.call($scope.phoneattention,$scope.nameattention);
            }else {
              $scope.sms($scope.phoneattention);
            }
            return true;
          }

        });
        // $scope.youmeiyou= $searchdata.getyesorno($scope.personsdetail111.Mobile)
      })
    });
    // 点击按钮触发，或一些其他的触发条件
    $scope.tanchuangattention = function(id) {
      //获取人员详细信息
      $searchdata.personDetail(id);

    };

    // //取消关注
    // $scope.removeattention=function (id) {
    //   var deletemembersArr=[];
    //   deletemembersArr.push(id);
    //   $api.removeAttention(deletemembersArr, function (msg) {
    //     alert("取消关注成功");
    //   }, function (msg) {
    //     alert("取消关注失败");
    //   });
    //
    //   $myattentionser.getAttentionList();
    //   $scope.$on('attention.update',function (event) {
    //     $scope.$apply(function () {
    //       $scope.contactsListatten=$myattentionser.getAttentionaaList();
    //       //alert($scope.localpersons)
    //     })
    //   });
    // }
    // Setup the loader
    $ionicLoading.show({
      content: 'Loading',
      animation: 'silde-in-up',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
    $timeout(function () {
      $ionicLoading.hide();
      $myattentionser.getAttentionList();
      $scope.$on('attention.update',function (event) {
        $scope.$apply(function () {
          $scope.contactsListatten=$myattentionser.getAttentionaaList();
          //alert($scope.localpersons)
        })
      });
    }, 2000);


  })
  .controller('attentionDetailCtrl',function ($scope,$state,$stateParams,$savaLocalPlugin,$phonepluin,$searchdata,$api,$searchlocal,$addattentionser) {
    //返回关注列表界面
    $scope.backAttention = function () {
      $state.go("myAttention");
    }
    //拿上一个页面传的参数
    $scope.UserIDattention = $stateParams.UserIDatten;
    // $scope.$on('$ionicView.loaded', function() {
    //   $scope.youmeiyou = $stateParams.youmeiyou;
    //   alert("111详情界面有没有啊"+$scope.youmeiyou);
    // });
    // $scope.youmeiyou = $stateParams.youmeiyou;
    // alert("拿到的数据是这样的"+$scope.youmeiyou);


    // $scope.$on('personyes.updateno',function (event) {
    //   alert("走这了2");
    //   $scope.$apply(function () {
    //     alert("走这了3");
    //     $scope.youmeiyou=$searchdata.getYoumeiyou();
    //     alert($scope.youmeiyou+"到底");
    //     // $scope.youmeiyou= $searchdata.getyesorno($scope.personsdetail111.Mobile)
    //
    //   })
    // });


    //获取人员详细信息
    $searchdata.personDetail($scope.UserIDattention);
    $scope.$on('person.update',function (event) {
      $scope.$apply(function () {
        $scope.personsdetail111=$searchdata.getPersonDetail().user;
        // $scope.youmeiyou= $searchdata.getyesorno($scope.personsdetail111.Mobile)
      })
    });


    // $scope.number=$searchdata.getPersonDetail().user.Mobile;
    // alert($scope.number)

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
        // $scope.youmeiyou= $searchdata.getyesorno($scope.personsdetail111.Mobile)
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
        // $scope.youmeiyou= $searchdata.getyesorno($scope.personsdetail111.Mobile)
      })
    });

  })
  .controller('historyMessageCtrl', function ($scope, $http, $state, $stateParams, contactService) {
    $scope.goSetting = function () {
      $state.go("personalSetting");
    }

  })

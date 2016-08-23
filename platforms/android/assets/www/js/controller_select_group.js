/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('selectgroup.controllers', [])



.controller('addNewPersonfirstCtrl', function ($scope, $state, $stateParams,$contacts,$ionicHistory) {

  $contacts.rootDept();
  $scope.$on('first.update', function (event) {
    $scope.$apply(function () {
      $scope.depts = $contacts.getRootDept();
    })
  });

  $scope.backback=function () {
    $ionicHistory.goBack();
  };


})


  .controller('addNewPersonsecondCtrl',function ($scope, $http, $state, $stateParams,$contacts,$ionicHistory){

    $scope.departlist = [];
    $scope.userlist = [];
    $scope.secondStatus;
    $scope.lastIds=[];


    $scope.contactId = $stateParams.contactId;//传过来的id；
    //根据id获取子部门和人员信息
    $contacts.deptInfo($scope.contactId);
    $scope.$on('second.update', function (event) {
      $scope.$apply(function () {

        $scope.deptinfo = $contacts.getFirstDeptName().DeptName;

        $scope.activeSecondDeptCount = $contacts.getCount1();

        $scope.activeSecondUserCount = $contacts.getCount2();


        if ($scope.activeSecondDeptCount > 0) {
          var olddepts = $contacts.getDeptInfo().deptList;
          for (var i = 0; i < olddepts.length; i++) {
            olddepts[i].isSelected=false;
            $scope.departlist.push(olddepts[i]);
          }
        }


        if ($scope.activeSecondUserCount) {
          var oldusers = $contacts.getDeptInfo().userList;
          for (var i = 0; i < oldusers.length; i++) {

            oldusers[i].isSelected=false;
            $scope.userlist.push(oldusers[i]);
          }
        }


        if (($scope.activeSecondDeptCount + $scope.activeSecondUserCount) === 10) {
          $scope.secondStatus = true;
        } else if (($scope.activeSecondDeptCount + $scope.activeSecondUserCount) < 10) {
          $scope.secondStatus = false;

        }


        $scope.parentID = $contacts.getDeptInfo().deptID;


        $scope.$broadcast('scroll.infiniteScrollComplete');


      })

    });
    $scope.$on('$ionicView.leave', function () {
      $contacts.clearSecondCount();
    });


    $scope.loadMoreSecond = function () {
      $contacts.deptInfo($scope.contactId);
    };


    //在二级目录跳转到联系人界面
    $scope.backFirst = function () {
      //$state.go("addnewpersonfirst");
      $ionicHistory.goBack();
    }

    //在二级目录跳转到三级目录
    $scope.jumpGroupThird = function (id, pname) {
      $state.go("addnewpersonthird", {
        "contactId": id,
        "secondname": pname
      });
    };

    //点击人员进入人员详情
    $scope.goGroupSecondDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });

    };

    $scope.secondConfirm=function () {
      alert("jinlai");
      if($scope.departlist.length>0){
        for (var i=0;i<$scope.departlist.length;i++){
          if($scope.departlist[i].isSelected){
            $scope.lastIds.push($scope.departlist[i].DeptID);
          }
        }
      }
      if($scope.userlist.length>0){
        for(var j=0;j<$scope.userlist.length;j++){
          if($scope.userlist[j].isSelected){
            $scope.lastIds.push($scope.userlist[j].UserID);
          }
        }

      }
      alert($scope.lastIds.length)
      $scope.lastIds=[];
    }



  })
  .controller('addNewPersonthirdCtrl',function ($scope, $http, $state, $stateParams,$contacts,$ionicHistory,$ionicPopup,$api) {

    $scope.departthirdlist = [];
    $scope.userthirdlist = [];
    $scope.thirdStatus;
    $scope.thirdDeptIds=[];
    $scope.thirdUserIds=[];


    //点击当前点击部门的id
    $scope.contactId = $stateParams.contactId;
    //一级的名字
    $scope.pppid = $stateParams.secondname;

    //根据id获取子部门的数据
    $contacts.deptThirdInfo($scope.contactId);


    $scope.$on('third.update', function (event) {

      $scope.$apply(function () {
        $scope.count1 = $contacts.getCount3();
        if ($scope.count1 > 0) {
          var olddepts = $contacts.getDeptThirdInfo().deptList;
          for (var i = 0; i < olddepts.length; i++) {
            olddepts[i].isSelected=false;
            $scope.departthirdlist.push(olddepts[i]);
          }
        }
        $scope.count2 = $contacts.getCount4();

        if ($scope.count2 > 0) {
          var oldusers = $contacts.getDeptThirdInfo().userList;

          for (var i = 0; i < oldusers.length; i++) {

            oldusers[i].isSelected=false;
            $scope.userthirdlist.push(oldusers[i]);
          }
        }

        $scope.parentID = $contacts.getDeptThirdInfo().deptID;
        $scope.deptinfo2 = $contacts.getSecondDeptName().DeptName;

        $scope.thirdlength = (document.getElementById('a1').innerText.length + $scope.pppid.length + $scope.deptinfo2.length) * 15 + 80;
        var thirddiv = document.getElementById("thirdscroll");
        thirddiv.style.width = $scope.thirdlength + "px";

        if (($scope.count1 + $scope.count2) === 10) {
          $scope.thirdStatus = true;
        } else if (($scope.count1 + $scope.count2) < 10) {
          $scope.thirdStatus = false;

        }
      })
      $scope.$broadcast('scroll.infiniteScrollComplete');

    });


    $scope.loadThirdMore = function () {

      $contacts.deptThirdInfo($scope.contactId);

    };


    $scope.$on('$ionicView.leave', function () {
      $contacts.clearThirdCount();
    });

    //在三级目录返回第二级
    $scope.idddd = $contacts.getFirstID();

    $scope.backSecond = function () {

      $ionicHistory.goBack();
     }




    //在第二级目录跳转到第四级目录
    $scope.jumpGroupForth = function (id, sname, tname) {
      $state.go("addnewpersonforth", {
        "contactId": id,
        "secondname": sname,
        "thirdname": tname
      });
    }


    //点击人员进入人员详情
    $scope.goGroupThirdDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });

    };

    $scope.thirdConfirm=function () {

      if($scope.departthirdlist.length>0){

        for (var i=0;i<$scope.departthirdlist.length;i++){
          if($scope.departthirdlist[i].isSelected){
            $scope.thirdDeptIds.push($scope.departthirdlist[i].DeptID);
          }
        }

        alert($scope.thirdDeptIds.length+"部门")

      }
      if($scope.userthirdlist.length>0){
        for(var j=0;j<$scope.userthirdlist.length;j++){
          if($scope.userthirdlist[j].isSelected){
            $scope.thirdUserIds.push($scope.userthirdlist[j].UserID);
          }
        }
        alert($scope.thirdUserIds.length+"人员")

      }

      $scope.data = {};
      /*$ionicPopup.show({
        template: '<input type="text" ng-model="data.name">',
        title: '创建群聊',
        subTitle: '请输入群名称',
        scope: $scope,
        buttons: [
          { text: '取消' },
          {
            text: '<b>确定</b>',
            type: 'button-positive',
            onTap: function(e) {
              /!*alert($scope.data.name);

              alert($scope.thirdDeptIds.length+"部门1")
              alert($scope.thirdUserIds.length+"人员1")

              $api.addGroup($scope.data.name,$scope.thirdDeptIds,$scope.thirdUserIds,function (msg) {
                alert("创建成功");
              },function (err) {
                $scope.thirdDeptIds=[];
                $scope.thirdUserIds=[];
              });*!/
            }
          },
        ]
      });*/


      alert($scope.thirdDeptIds.length+"部门")
      alert($scope.thirdUserIds.length+"人员")
    }




  })


  .controller('addNewPersonforthCtrl', function ($scope, $http, $state, $stateParams,$contacts,$ionicHistory) {
    $scope.departlist = [];
    $scope.userlist = [];

    $scope.forthStatus;


    $scope.contactId = $stateParams.contactId;
    $scope.secondName = $stateParams.secondname;
    $scope.thirdName = $stateParams.thirdname;

    //根据id获取子部门和人员信息
    $contacts.deptForthInfo($scope.contactId);
    $scope.$on('forth.update', function (event) {
      $scope.$apply(function () {


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

        $scope.parentID = $contacts.getDeptForthInfo().deptID;
        $scope.deptinfo4 = $contacts.getThirdDeptName().DeptName;


        $scope.forthlength = (document.getElementById('a1').innerText.length + $scope.secondName.length + $scope.thirdName.length + $scope.deptinfo4.length) * 15 + 120;

        var forthdiv = document.getElementById("forthscroll");
        forthdiv.style.width = $scope.forthlength + "px";

        if (($scope.count1 + $scope.count2) === 10) {
          $scope.forthStatus = true;
        } else if (($scope.count1 + $scope.count2) < 10) {
          $scope.forthStatus = false;

        }

        $scope.$broadcast('scroll.infiniteScrollComplete');


      })

    });

    $scope.loadForthMore = function () {
      $contacts.deptForthInfo($scope.contactId);

    }

    $scope.$on('$ionicView.leave', function () {
      $contacts.clearForthCount();
    });


    //在四级目录需要返回三级目录  （ 三级目录进来需要两个参数 一个是 二级目录id一个是二级目录的名字 ）

    $scope.idididi = $contacts.getSecondID();
    $scope.firstid = $contacts.getFirstID();


    /*$scope.backThird = function (sd, named) {

      $state.go("addnewpersonthird", {
        "contactId": sd,
        "secondname": named
      });

    };*/

    $scope.backThird = function () {

      $ionicHistory.goBack();

     };


    // 在四级目录返回二级目录  （二级目录只需要一个id就行）
    $scope.fromForthToSecond = function (sd) {
      $state.go("addnewpersonsecond", {
        "contactId": sd
      });
    };

    //从四级目录跳入五级目录
    $scope.jumpGroupFifth = function (id, sname, tname, fname) {
      $state.go("addnewpersonfifth", {
        "contactId": id,
        "secondname": sname,
        "thirdname": tname,
        "forthname": fname,
      });
    };

    //从四级目录跳入详情界面

    $scope.goGroupForthDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });
    }

  })



  .controller('addNewPersonfifthCtrl', function ($scope, $state, $stateParams,$contacts,$ionicHistory) {



    $scope.departfifthlist = [];
    $scope.userfifthlist = [];
    $scope.fifthStatus;

    $scope.contactId = $stateParams.contactId;
    $scope.secondName = $stateParams.secondname;
    $scope.thirdName = $stateParams.thirdname;
    $scope.forthName = $stateParams.forthname;

    //根据id获取子部门和人员信息
    $contacts.deptFifthInfo($scope.contactId);
    $scope.$on('fifth.update', function (event) {
      $scope.$apply(function () {

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


        if (($scope.count1 + $scope.count2) === 10) {
          $scope.fifthStatus = true;
        } else if (($scope.count1 + $scope.count2) < 10) {
          $scope.fifthStatus = false;

        }

        $scope.parentID = $contacts.getDeptFifthInfo().deptID;
        $scope.deptinfo5 = $contacts.getForthDeptName().DeptName;

        $scope.fifthlength = (document.getElementById('a1').innerText.length + $scope.secondName.length + $scope.thirdName.length + $scope.forthName.length + $scope.deptinfo5.length) * 15 + 140;


        var fifthdiv = document.getElementById("fifthscroll");
        fifthdiv.style.width = $scope.fifthlength + "px";

        $scope.$broadcast('scroll.infiniteScrollComplete');


      })

    });

    $scope.loadFifthMore = function () {
      $contacts.deptFifthInfo($scope.contactId);

    }


    $scope.$on('$ionicView.leave', function () {
      $contacts.clearFifthCount();
    });

    //返回二级部门 需要一个id；
    $scope.firstid = $contacts.getFirstID();
    $scope.secondid = $contacts.getSecondID();
    $scope.thirdid = $contacts.getThirdID();

    $scope.fromFifthToSecond = function (sd) {
      $state.go("addnewpersonsecond", {
        "contactId": sd
      });

    };


    //返回三级部门需要一个Id和一个名字；
    $scope.fromFifthToThird = function (sd, sname) {
      $state.go("addnewpersonthird", {
        "contactId": sd,
        "secondname": sname,
      });
    };


    //返回四级部门 需要一个id 和 两个名字
    /*$scope.backForth = function (sd, sname, tname) {
      $state.go("addnewpersonforth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
      });
    };*/

    $scope.backForth = function () {
      $ionicHistory.goBack();
    };

    //从五级部门跳转到六级部门
    $scope.jumpGroupSixth = function (id, sname, tname, fname, dd) {
      $state.go("addnewpersonsixth", {
        "contactId": id,
        "secondname": sname,
        "thirdname": tname,
        "forthname": fname,
        "fifthname": dd
      });
    };


    //从五级部门跳转到详情界面
    $scope.goGroupFifthDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });
    }
  })
  .controller('addNewPersonsixthCtrl', function ($scope, $state, $stateParams,$contacts,$ionicHistory) {



    $scope.departsixthlist = [];
    $scope.usersixthlist = [];
    $scope.sixthStatus;

    $scope.contactId = $stateParams.contactId;
    $scope.secondName = $stateParams.secondname;
    $scope.thirdName = $stateParams.thirdname;
    $scope.forthName = $stateParams.forthname;
    $scope.fifthName = $stateParams.fifthname;


    //根据id获取子部门和人员信息

    //根据id获取子部门和人员信息
    $contacts.deptSixthInfo($scope.contactId);
    $scope.$on('sixth.update', function (event) {
      $scope.$apply(function () {

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


        if (($scope.count1 + $scope.count2) === 10) {
          $scope.sixthStatus = true;
        } else if (($scope.count1 + $scope.count2) < 10) {
          $scope.sixthStatus = false;

        }


        $scope.parentID = $contacts.getDeptSixthInfo().deptID;
        $scope.deptinfo6 = $contacts.getFifthDeptName().DeptName;


        $scope.sixthlength = (document.getElementById('a1').innerText.length + $scope.secondName.length + $scope.thirdName.length +
          $scope.forthName.length + $scope.fifthName.length + $scope.deptinfo6.length) * 15 + 180;

        var sixthdiv = document.getElementById("sixthscroll");
        sixthdiv.style.width = $scope.sixthlength + "px";

        $scope.$broadcast('scroll.infiniteScrollComplete');


      })

    });



    $scope.loadSixthMore = function () {
      $contacts.deptSixthInfo($scope.contactId);

    }

    $scope.$on('$ionicView.leave', function () {
      $contacts.clearSixthCount();
    });


    //返回二级部门 需要一个id；
    $scope.firstidInSix = $contacts.getFirstID();
    $scope.secondidInSix = $contacts.getSecondID();
    $scope.thirdidInSix = $contacts.getThirdID();
    $scope.forthidInSix = $contacts.getForthID();


    //从六级部门跳转到七级部门
    $scope.jumpGroupSeventh = function (id, sname, tname, fname, sixname, ddd) {
      $state.go("addnewpersonseventh", {
        "contactId": id,
        "secondname": sname,
        "thirdname": tname,
        "forthname": fname,
        "fifthname": sixname,
        "sixthname": ddd
      });
    };

    //从六级界面跳转到2级界面 只需要一个参数
    $scope.fromSixthToSecond = function (sd) {
      $state.go("addnewpersonsecond", {
        "contactId": sd
      });
    };

    //从六级跳转到3级界面 需要两个参数
    $scope.fromSixthToThird = function (sd, sname) {
      $state.go("addnewpersonthird", {
        "contactId": sd,
        "secondname": sname,
      });
    };

    //从六级跳转到4级界面  需要三个参数

    $scope.fromSixthToForth = function (sd, sname, tname) {
      $state.go("addnewpersonforth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
      });
    };

    //从六级返回五级  需要四个参数

    $scope.backFifth = function () {
      $ionicHistory.goBack();

    };


    //从六级部门跳转到详情界面
    $scope.goGroupSixthDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });
    };

  })

  .controller('addNewPersonseventhCtrl', function ($scope, $state, $stateParams,$contacts,$ionicHistory) {

    $scope.nihao = [];
    $scope.buhao = [];
    $scope.seventhStatus;

    $scope.contactId = $stateParams.contactId;
    $scope.secondName = $stateParams.secondname;
    $scope.thirdName = $stateParams.thirdname;
    $scope.forthName = $stateParams.forthname;
    $scope.fifthName = $stateParams.fifthname;
    $scope.sixthName = $stateParams.sixthname;

    //根据id获取子部门和人员信息

    $contacts.deptSeventhInfo($scope.contactId);
    $scope.$on('seventh.update', function (event) {
      $scope.$apply(function () {
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


        if (($scope.count1 + $scope.count2) === 10) {
          $scope.seventhStatus = true;
        } else if (($scope.count1 + $scope.count2) < 10) {
          $scope.seventhStatus = false;

        }


        $scope.parentID = $contacts.getDeptSeventhInfo().deptID;
        $scope.deptinfo7 = $contacts.getSixthDeptName().DeptName;


        $scope.seventhlength = (document.getElementById('a1').innerText.length + $scope.secondName.length + $scope.thirdName.length + $scope.forthName.length
          + $scope.fifthName.length + $scope.sixthName.length + $scope.deptinfo7.length) * 15 + 200;

        var seventhdiv = document.getElementById("seventhscroll");
        seventhdiv.style.width = $scope.seventhlength + "px";

        $scope.$broadcast('scroll.infiniteScrollComplete');

      })

    });

    $scope.loadSeventhMore = function () {
      $contacts.deptSeventhInfo($scope.contactId);

    }

    $scope.$on('$ionicView.leave', function () {
      $contacts.clearSeventhCount();
    });

    $scope.firstidInSeven = $contacts.getFirstID();
    $scope.secondidInSeven = $contacts.getSecondID();
    $scope.thirdidInSeven = $contacts.getThirdID();
    $scope.forthidInSeven = $contacts.getForthID();
    $scope.fifthidInSeven = $contacts.getFifthID();

    $scope.jumpGroupEighth=function (id, sname, tname, fname, sixname, ddd,zuihou) {
      $state.go("addnewpersoneighth", {
        "contactId": id,
        "secondname": sname,
        "thirdname": tname,
        "forthname": fname,
        "fifthname": sixname,
        "sixthname": ddd,
        "seventhname":zuihou
      });
    }


    //返回六级列表

    $scope.backSixth = function () {
      $ionicHistory.goBack();

    }


    //从七级目录到五级目录  五级目录需要四个参数
    $scope.formSeventhToFifth = function (sd, sname, tname, ttname) {
      $state.go("addnewpersonfifth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
        "forthname": ttname
      });
    }

    //从七级目录到四级目录  四级目录需要四个参数
    $scope.fromSeventhToForth = function (sd, sname, tname) {
      $state.go("addnewpersonforth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
      });
    };

    //从七级目录到三级目录  三级目录需要两个个参数


    $scope.fromSeventhToThird = function (sd, sname) {
      $state.go("addnewpersonthird", {
        "contactId": sd,
        "secondname": sname,
      });
    };

    //从七级目录到二级目录  二级目录需要1个参数

    $scope.fromSeventhToSecond = function (sd) {
      $state.go("addnewpersonsecond", {
        "contactId": sd
      });
    };


    //从七级界面跳入到详情界面
    $scope.goGroupSeventhDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });
    };


  })


  .controller('addNewPersoneighthCtrl', function ($scope, $state, $stateParams,$contacts,$ionicHistory) {
    $scope.eightDept = [];
    $scope.eightUser = [];
    $scope.eighthStatus;


    $scope.contactId = $stateParams.contactId;
    $scope.secondName = $stateParams.secondname;
    $scope.thirdName = $stateParams.thirdname;
    $scope.forthName = $stateParams.forthname;
    $scope.fifthName = $stateParams.fifthname;
    $scope.sixthName = $stateParams.sixthname;
    $scope.seventhName = $stateParams.seventhname;


    //根据id获取子部门和人员信息
    $contacts.deptEighthInfo($scope.contactId);
    $scope.$on('eighth.update', function (event) {
      $scope.$apply(function () {
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


        if (($scope.count1 + $scope.count2) === 10) {
          $scope.eighthStatus = true;
        } else if (($scope.count1 + $scope.count2) < 10) {
          $scope.eighthStatus = false;

        }


        $scope.parentID = $contacts.getDeptEighthInfo().deptID;
        $scope.deptinfo8 = $contacts.getSeventhDeptName().DeptName;


        $scope.eighthlength = (document.getElementById('a1').innerText.length + $scope.secondName.length + $scope.thirdName.length + $scope.forthName.length
          + $scope.fifthName.length + $scope.sixthName.length+$scope.seventhName.length + $scope.deptinfo8.length) * 15 + 220;

        var eighthdiv = document.getElementById("eighthscroll");
        eighthdiv.style.width = $scope.eighthlength + "px";

        $scope.$broadcast('scroll.infiniteScrollComplete');

      })

    });

    $scope.loadEighthMore = function () {
      $contacts.deptEighthInfo($scope.contactId);

    }

    $scope.$on('$ionicView.leave', function () {
      $contacts.clearEngithCount();
    });



    $scope.goGroupEighthDetail=function (id) {
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
      $state.go("addnewpersonsixth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
        "forthname": ttname,
        "fifthname":tttname
      });
    }


    //从八级目录到五级目录  五级目录需要四个参数
    $scope.fromEighthToFifth = function (sd, sname, tname, ttname) {
      $state.go("addnewpersonfifth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
        "forthname": ttname
      });
    }

    //从八级目录到四级目录  四级目录需要三个参数
    $scope.fromEighthToForth = function (sd, sname, tname) {
      $state.go("addnewpersonforth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
      });
    };

    //从七级目录到三级目录  三级目录需要两个个参数


    $scope.fromEighthToThird = function (sd, sname) {
      $state.go("addnewpersonthird", {
        "contactId": sd,
        "secondname": sname,
      });
    };

    //从七级目录到二级目录  二级目录需要1个参数

    $scope.fromEighthToSecond = function (sd) {
      $state.go("addnewpersonsecond", {
        "contactId": sd
      });
    };

    $scope.backSeventh=function () {
      $ionicHistory.goBack();

    }
  })


  .controller('localDetailsCtrl',function ($scope,$state) {


  })

  //修改群名称
  .controller('groupModifyNameCtrl',function ($scope,$state) {


  })



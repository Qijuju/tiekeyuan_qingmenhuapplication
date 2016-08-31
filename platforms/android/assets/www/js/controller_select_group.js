/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('selectgroup.controllers', [])



.controller('addNewPersonfirstCtrl', function ($scope, $state, $stateParams,$contacts,$ionicHistory) {

  //创建的类型看到底是从哪里过来的
  $scope.createType=$stateParams.createtype;
  $contacts.rootDept();
  $scope.$on('first.update', function (event) {
    $scope.$apply(function () {
      $scope.depts = $contacts.getRootDept();
    })
  });

  $scope.backback=function () {
    $ionicHistory.goBack();
  };

  //跳转到二级选人界面
  $scope.jumpGroupSecond=function (id) {
    $state.go('addnewpersonsecond',{
      "contactId":id,
      "createtype":$scope.createType
    });
  }


})


  .controller('addNewPersonsecondCtrl',function ($scope, $http, $state, $stateParams,$contacts,$ionicHistory,$greendao){

    //创建的类型看到底是从哪里过来的
    $scope.createType=$stateParams.createtype;
    $scope.contactId = $stateParams.contactId;//传过来的id；

    $scope.departlist = [];
    $scope.userlist = [];
    $scope.secondStatus;
    $scope.lastIds=[];

    $scope.secondDeptIds=[];
    $scope.secondUserIds=[];

    //$scope.$on('$ionicView.enter', function () {

      //最终存入的数据
      var finalInfo=[];

      //先从数据库里面取出id为特殊级别的 ids  特殊级别为0的
      var originalInfo=[];
      $greendao.queryData("SelectIdService", 'where grade =?', "0",function (msg) {

        originalInfo=msg;
        if(originalInfo.length>0){
          for(var i=0;i<originalInfo.length;i++){
            finalInfo.push(originalInfo[i]);
          }

        }
      },function (err) {

      })
      //现在进入的是二级目录 所以要先获取等于二级的目录的人
      var anotherInfo=[];
      $greendao.queryData("SelectIdService", 'where grade =?', "2",function (msg) {

        anotherInfo=msg;
        if(anotherInfo.length>0){
          for(var i=0;i<anotherInfo.length;i++){
            finalInfo.push(anotherInfo[i]);
          }
        }

      },function (err) {

      })



    $contacts.deptInfo($scope.contactId);

    //根据id获取子部门和人员信息
    $scope.$on('second.update', function (event) {
      $scope.$apply(function () {

        $scope.deptinfo = $contacts.getFirstDeptName().DeptName;

        $scope.activeSecondDeptCount = $contacts.getCount1();

        $scope.activeSecondUserCount = $contacts.getCount2();


        if ($scope.activeSecondDeptCount > 0) {


          //拿到数据后开始变化展现形式
          var olddepts = $contacts.getDeptInfo().deptList;

          //遍历所有的ids并吧存在的设置为true
          for(var n=0;n<olddepts.length; n++){

              olddepts[n].isSelected=false;
          }



          for(var j=0;j<finalInfo.length;j++){

            for(var m=0;m<olddepts.length; m++){
                if(finalInfo[j].id==olddepts[m].DeptID){
                  olddepts[m].isSelected=true;
                  alert(olddepts[m].DeptName)
                }
            }
          }

          for (var i = 0; i < olddepts.length; i++) {

            $scope.departlist.push(olddepts[i]);

          }


        }


        if ($scope.activeSecondUserCount>0) {
          var oldusers = $contacts.getDeptInfo().userList;

          //先把界面上所有的值给false
          for(var n=0;n<oldusers.length;n++){
            oldusers[n].isSelected=false;

          }

          //然后再从数据库里面取出已经标记的了
          for(var j=0;j<finalInfo.length;j++){
            for(var m=0;m<oldusers.length; m++){
              if(finalInfo[j].id==oldusers[m].UserID){
                oldusers[m].isSelected=true;
              }
            }
          }

          //在界面上展示已经显示的了
          for (var i = 0; i < oldusers.length; i++) {
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
        "secondname": pname,
          obj:$scope.objall,
      });
    };

    //点击人员进入人员详情
    $scope.goGroupSecondDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });

    };

    //当点击确定按钮的时候的操作
    /*$scope.secondConfirm=function () {
      if($scope.departlist.length>0){
        for (var i=0;i<$scope.departlist.length;i++){
          if($scope.departlist[i].isSelected){
            $scope.secondDeptIds.push($scope.departlist[i].DeptID);
          }
        }
      }
      if($scope.userlist.length>0){
        for(var j=0;j<$scope.userlist.length;j++){
          if($scope.userlist[j].isSelected){
            $scope.secondUserIds.push($scope.userlist[j].UserID);
          }
        }

      }







    }*/


    //当我离开这个页面的时候要先判断数据库里面有没有数据， 如果没有数据则证明已经创建群成功 我就不需要遍历再次存到数据库里面
    //当数据库里面如果有数据的话，则证明没有创建群 只是跳入下一个界面而已 需要把选中的保存到数据库里面
    $scope.$on('$ionicView.leave', function () {
      $contacts.clearSecondCount();
      $greendao.loadAllData('SelectIdService',function (msg) {
        if(msg.length>0){

          //部门的操作
          if($scope.departlist.length>0){
            for (var i=0;i<$scope.departlist.length;i++){
              if($scope.departlist[i].isSelected){

                var deptSaveId={};
                deptSaveId.id=$scope.departlist[i].DeptID;
                deptSaveId.grade='2';                        //二级代表是二级目录存下来的数据
                deptSaveId.isselected=true;
                $greendao.saveObj('SelectIdService',deptSaveId,function (msg) {

                },function (err) {

                })
              }
            }
          }


          //人员的操作
          if($scope.userlist.length>0){
            for(var i=0;i<originalInfo.length;i++){
                for(var j=0;j<$scope.userlist.length;j++){
                  if(originalInfo[i].id==scope.userlist[j].UserID){
                    $scope.userlist.splice(j,1);
                  }
                }
            }
          }
          //再次遍历这个集合把所有选中的ids添加到数据库
          for(var j=0;j<$scope.userlist.length;j++){
            if($scope.userlist[j].isSelected){
              $scope.lastIds.push($scope.userlist[j].UserID);


              var userSaveId={};
              userSaveId.id=$scope.userlist[j].UserID;
              userSaveId.grade='2';                        //二级代表是二级目录存下来的数据
              userSaveId.isselected=true;
              $greendao.saveObj('SelectIdService',userSaveId,function (msg) {

              },function (err) {

              })

            }

          }
        }

      },function (msg) {

      });




    });











  })
  .controller('addNewPersonthirdCtrl',function ($scope, $http, $state, $stateParams,$contacts,$ionicHistory,$ionicPopup,$api,$ToastUtils,$greendao) {

    //创建的类型看到底是从哪里过来的
    $scope.createType=$stateParams.createtype;

    //最终存入的数据
    var finalInfo=[];

    //先从数据库里面取出id为特殊级别的 ids  特殊级别为0的
    var originalInfo=[];
    $greendao.queryData("SelectIdService", 'where grade =?', "0",function (msg) {

      originalInfo=msg;
      if(msg.length>0){
        for(var i=0;i<msg.length;i++){
          finalInfo.push(msg[i]);
        }
      }
    },function (err) {

    })
    //现在进入的是二级目录 所以要先获取等于二级的目录的人
    var anotherInfo=[];
    $greendao.queryData("SelectIdService", 'where grade =?', "3",function (msg) {

      anotherInfo=msg;
      if(msg.length>0){
        for(var i=0;i<msg.length;i++){
          finalInfo.push(msg[i]);
        }
      }

    },function (err) {

    })


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


          //遍历所有并且显示为false
          for(var n=0;n<olddepts.length; n++){
            olddepts[n].isSelected=false;
          }

          //取出数据库中的并且设置为黑色
          for(var j=0;j<finalInfo.length;j++){
            for(var m=0;m<olddepts.length; m++){
              if(finalInfo[j].id==olddepts[m].DeptID){
                olddepts[m].isSelected=true;
              }
            }
          }


          //在界面上面展示
          for (var i = 0; i < olddepts.length; i++) {
            $scope.departthirdlist.push(olddepts[i]);
          }




        }
        $scope.count2 = $contacts.getCount4();

        if ($scope.count2 > 0) {
          var oldusers = $contacts.getDeptThirdInfo().userList;

          //设置所有的为false
          for(var n=0;n<oldusers.length; n++){
            oldusers[n].isSelected=false;
          }

          //从数据库取出数据然后赋值
          for(var j=0;j<finalInfo.length;j++){
            for(var m=0;m<oldusers.length; m++){
              if(finalInfo[j].id==oldusers[m].UserID){
                oldusers[m].isSelected=true;
              }
            }
          }


          //界面上面展示

          for (var i = 0; i < oldusers.length; i++) {

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

    //当离开页面时候需要做的操作
    $scope.$on('$ionicView.leave', function () {
      $contacts.clearThirdCount();

      $greendao.loadAllData('SelectIdService',function (msg) {
        if(msg.length>0){
          //先遍历拿出所有groud等于3的所有对象
          $greendao.queryData("SelectIdService", 'where grade =?', "3",function (data) {
            if(data.length>0){

              //然后把等于3的都删除了
              for(var k=0;k<data.length;k++){
                $greendao.deleteObj('SelectIdService',data[k],function (data) {

                },function (err) {

                })
              }
            }

            //然后在开始部门的操作
              if($scope.departthirdlist.length>0){
                for (var i=0;i<$scope.departthirdlist.length;i++){
                  if($scope.departthirdlist[i].isSelected){

                    var deptSaveId={};
                    deptSaveId.id=$scope.departthirdlist[i].DeptID;
                    deptSaveId.grade='3';                        //二级代表是二级目录存下来的数据
                    deptSaveId.isselected=true;
                    $greendao.saveObj('SelectIdService',deptSaveId,function (msg) {

                    },function (err) {

                    })
                  }
                }
              }

              //人员的操作
              if($scope.userthirdlist.length>0){
                for(var i=0;i<originalInfo.length;i++){
                  for(var j=0;j<$scope.userthirdlist.length;j++){
                    if(originalInfo[i].id==$scope.userthirdlist[j].UserID){
                      $scope.userthirdlist.splice(j,1);
                    }
                  }
                }
              }
              //再次遍历这个集合把所有选中的ids添加到数据库
              for(var j=0;j<$scope.userthirdlist.length;j++){
                if($scope.userthirdlist[j].isSelected){

                  var userSaveId={};
                  userSaveId.id=$scope.userthirdlist[j].UserID;
                  userSaveId.grade='3';                        //二级代表是二级目录存下来的数据
                  userSaveId.isselected=true;
                  $greendao.saveObj('SelectIdService',userSaveId,function (msg) {

                  },function (err) {

                  })

                }

              }


          },function (err) {
            //第二次数据查询
          })

        }
        //数据查询结束第一次

      },function (msg) {
        //第一次数据查询
      });


    });

    //当点击确认按钮的时候

    $scope.thirdConfirm=function () {

      if($scope.departthirdlist.length>0){

        for (var i=0;i<$scope.departthirdlist.length;i++){
          if($scope.departthirdlist[i].isSelected){
            $scope.thirdDeptIds.push($scope.departthirdlist[i].DeptID);
          }
        }

      }
      if($scope.userthirdlist.length>0){
        for(var j=0;j<$scope.userthirdlist.length;j++){
          if($scope.userthirdlist[j].isSelected){
            $scope.thirdUserIds.push($scope.userthirdlist[j].UserID);
          }
        }

      }

      $scope.data = {};
      $ionicPopup.show({
        template: '<input type="text" ng-model="data.name">',
        title: '创建群聊',
        subTitle: '请输入群名称',
        scope: $scope,
        buttons: [
          { text: '取消',
            onTap: function(e) {
              $scope.thirdDeptIds=[];
              $scope.thirdUserIds=[];
            }

          },
          {
            text: '<b>确定</b>',
            type: 'button-positive',
            onTap: function(e) {
              if($scope.data.name===undefined||$scope.data.name===null||$scope.data.name===""){

                $scope.thirdDeptIds=[];
                $scope.thirdUserIds=[];
                $ToastUtils.showToast("群名称不能为空");

              }else{
                $api.addGroup($scope.data.name,$scope.thirdDeptIds,$scope.thirdUserIds,function (msg) {
                  //当成功的时候先把数据库给清了
                  $greendao.deleteAllData('SelectIdService',function (data) {
                      alert('数据被清空了')
                  },function (err) {

                  });

                  //信息保存到数据库
                  var obj={};
                  obj.id=msg;
                  obj.groupName=$scope.data.name;
                  obj.groupType='Group'
                  $greendao.saveObj('GroupChatsService',obj,function (msg) {
                    //跳转群聊天界面
                    $state.go('messageGroup',{
                      "id":obj.id,
                      "sessionid":$scope.data.name,
                      "grouptype":"Group",
                      "ismygroup":true,
                    });

                  },function (err) {

                  });
                },function (err) {


                });
              }

            }
          },
        ]
      });

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
  .controller('groupModifyNameCtrl',function ($scope,$state,$stateParams,$api,$ToastUtils,$ionicHistory,$greendao,$rootScope,$ionicHistory) {

    var keyboard = cordova.require('ionic-plugin-keyboard.keyboard');
    $scope.groupId=$stateParams.groupid;
    var groupName=$stateParams.groupname;


    $scope.saveName=function (name) {
      if(name==""){
        $ToastUtils.showToast('请输入群名称')
      }else if (name==undefined){
        $ionicHistory.goBack();
      }else {
        $api.modifyGroup("Group",$scope.groupId,name,null,function (msg) {
          var groupEntity={};
          groupEntity.id=$scope.groupId;
          groupEntity.groupName=name;
          groupEntity.groupType="Group";

          $greendao.saveObj('GroupChatsService',groupEntity,function (msg) {

            $rootScope.$broadcast('groupname.update');
          },function (err) {

          })
          $ionicHistory.goBack();
        },function (err) {

        })
      }

    }


    $scope.$on('$ionicView.enter', function () {

      document.getElementById('nameId').value=groupName;
      keyboard.show();
      document.getElementById('nameId').focus();


    });

    $scope.backAny=function () {
      $ionicHistory.goBack();
    }

  })


  //普通群的展示
  .controller('groupMemberCtrl',function ($scope,$state,$group,$stateParams,$api,$ToastUtils) {

    $scope.groupId = $stateParams.groupid;
    $scope.groupName = $stateParams.chatname;
    $scope.groupType = $stateParams.grouptype;

    $scope.groupMaster={};
    $scope.groupAdmin=[];
    $scope.groupCommon=[];
    $scope.listM=[];
      $scope.listM.push('GM');
      $scope.listM.push('GA');
      $scope.listM.push('GN');
      $scope.listM.push('GC');
      $scope.listM.push('GS');
      $scope.listM.push('GT');

     $group.groupDetail($scope.groupType,$scope.groupId,$scope.listM);
     $scope.$on('groupdetail.update', function (event) {
     $scope.$apply(function () {

      var groupDetails=$group.getGroupDetail();//所有的信息
      var adminId=$group.getGroupDetail().admins;//所有管理员的集合
       var members=$group.getGroupDetail().users;//所有人员的集合

       //获取群主
       for(var i=0;i<members.length;i++){
         if(members[i].UserID==groupDetails.creator){
           $scope.groupMaster=members[i];
           members.splice(i,1);
         }
       }

       //获取管理员
       for(var j=0;j<adminId.length;j++){

         for(var k=0;k<members.length;k++){
           if(adminId[j]==members[k].UserID && adminId[j]!= groupDetails.creator){
             $scope.groupAdmin.push(members[k]);
             members.splice(k,1);
           }
         }

       }
       //获取普通人员
       for(var m=0;m<members.length;m++){
         $scope.groupCommon.push(members[m]);

       }

     })
     });

    //删除群聊里面的人
    $scope.removeGroupPerson=function (id) {
      var idList=[];
      idList.push(id);
      $api.groupRemoveMember($scope.groupId,idList,function (msg) {
        $scope.groupAdmin=[];
        $scope.groupCommon=[];
        $group.groupDetail($scope.groupType,$scope.groupId,$scope.listM);
      },function (err) {
        $ToastUtils.showToast(err)
      });
    };

    //添加管理员

    $scope.addAdmin=function (id) {
      var addId=[];
      addId.push(id);
      $api.groupAddAdmin($scope.groupId,addId,function (msg) {
        $scope.groupAdmin=[];
        $scope.groupCommon=[];
        $group.groupDetail($scope.groupType,$scope.groupId,$scope.listM);
      },function (err) {
        $ToastUtils.showToast(err)

      })
    };

    //取消管理员
    $scope.cancelAdmin=function (id) {
      var ids=[];
      ids.push(id);
      $api.groupRemoveAdmin($scope.groupId,ids,function (msg) {
        $scope.groupAdmin=[];
        $scope.groupCommon=[];
        $group.groupDetail($scope.groupType,$scope.groupId,$scope.listM);
      },function (err) {

      });
    }



    $scope.addPerson=function () {
      $state.go('addnewpersonfirst');
    };





  })

  //部门群展示
  .controller('groupDeptMemberCtrl',function ($scope,$state,$group,$stateParams,$ionicHistory) {


    $scope.groupId = $stateParams.groupid;
    $scope.groupName = $stateParams.chatname;
    $scope.groupType = $stateParams.grouptype;

    $scope.listM=[];
    $scope.listM.push('GM');
    $scope.listM.push('GN');
    $scope.listM.push('GS');

    $group.groupDetail($scope.groupType,$scope.groupId,$scope.listM);
    $scope.$on('groupdetail.update', function (event) {
      $scope.$apply(function () {

        $scope.groupDetails=$group.getGroupDetail();

        $scope.members=$group.getGroupDetail().users;

      })
    });

    $scope.backAny=function () {
      $ionicHistory.goBack();
    }


    $scope.groupGoDetail=function (id) {
      $state.go("person", {
        "userId": id,
      });
    }


  })







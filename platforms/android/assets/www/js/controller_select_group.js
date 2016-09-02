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

  //二级界面
  .controller('addNewPersonsecondCtrl',function ($scope, $http, $state, $stateParams,$contacts,$ionicHistory,$greendao,$ToastUtils,$ionicPopup,$api,$rootScope){

    //创建的类型看到底是从哪里过来的
    $scope.createType=$stateParams.createtype;
    $scope.contactId = $stateParams.contactId;//传过来的id；

    $scope.departlist = [];
    $scope.userlist = [];
    $scope.secondStatus;
    $scope.secondDeptIds=[];
    $scope.secondUserIds=[];

      //先从数据库里面取出id为特殊级别的 ids  特殊级别为0的
      var originalInfo=[];
      $greendao.queryData("SelectIdService", 'where grade =?', "0",function (msg) {

        originalInfo=msg;

      },function (err) {

      })
      //现在进入的是二级目录 所以要先获取等于二级的目录的人
      var anotherInfo=[];
      $greendao.queryData("SelectIdService", 'where grade =?', "2",function (msg) {

        anotherInfo=msg;

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


          if(anotherInfo.length>0){
            for(var j=0;j<anotherInfo.length;j++){
              for(var m=0;m<olddepts.length; m++){
                if(anotherInfo[j].id==olddepts[m].DeptID){
                  olddepts[m].isSelected=true;
                }
              }
            }
          }


          for (var i = 0; i < olddepts.length; i++) {

            $scope.departlist.push(olddepts[i]);

          }


        }


        if ($scope.activeSecondUserCount>0) {
          var oldusers = $contacts.getDeptInfo().userList;

          //去除群主为了不让群主在里面显示
          for(var i=0;i<originalInfo.length;i++){
            for(var j=0;j<oldusers.length;j++){
              if(originalInfo[i].id==oldusers[j].UserID){
                oldusers.splice(j,1);
              }
            }
          }

          //先把界面上所有的值给false
          for(var n=0;n<oldusers.length;n++){
            oldusers[n].isSelected=false;

          }

          if(anotherInfo.length>0){
            //然后再从数据库里面取出已经标记的了
            for(var j=0;j<anotherInfo.length;j++){
              for(var m=0;m<oldusers.length; m++){
                if(anotherInfo[j].id==oldusers[m].UserID){
                  oldusers[m].isSelected=true;
                }
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
      $ionicHistory.goBack();
    }

    //在二级目录跳转到三级目录
    $scope.jumpGroupThird = function (id, pname,bb) {
      if(bb){
        $ToastUtils.showToast('选中后不可以再选择下级')
        $event.stopPropagation()
      }else {
        $state.go("addnewpersonthird", {
          "contactId": id,
          "secondname": pname,
          "createtype":$scope.createType
        });
      }

    };

    //点击人员进入人员详情
    $scope.goGroupSecondDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });

    };

    //当点击确定按钮的时候的操作
    $scope.secondConfirm=function () {
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

      $scope.data = {};
      $ionicPopup.show({
        template: '<input type="text" ng-model="data.name">',
        title: '创建群聊',
        subTitle: '请输入群名称',
        scope: $scope,
        buttons: [
          { text: '取消',
            onTap: function(e) {
              $scope.secondUserIds=[];
              $scope.secondDeptIds=[];
            }

          },
          {
            text: '<b>确定</b>',
            type: 'button-positive',
            onTap: function(e) {
              if($scope.data.name===undefined||$scope.data.name===null||$scope.data.name===""){
                $scope.secondUserIds=[];
                $scope.secondDeptIds=[];
                $ToastUtils.showToast("群名称不能为空");
              }else{
                // 查询数据库把不等于3这个级别的所有数据拿出来
                $greendao.queryData('SelectIdService','where grade <>?', "2",function (data) {

                  for(var i=0;i<data.length;i++){
                    if(data[i].type=='user'){

                      $scope.secondUserIds.push(data[i].id)
                    }else if (data[i].type=='dept'){
                      $scope.secondDeptIds.push(data[i].id)
                    }
                  }

                  // alert('走到了这一步')

                  //开始提交创建群组
                  $api.addGroup($scope.data.name,$scope.secondDeptIds,$scope.secondUserIds,function (msg) {
                    // alert('你好我进来了')
                    //当成功的时候先把数据库给清了
                    $greendao.deleteAllData('SelectIdService',function (data) {
                      // alert('数据被清空了')
                    },function (err) {

                    });

                    //信息保存到数据库
                    var obj={};
                    obj.id=msg;
                    obj.groupName=$scope.data.name;
                    obj.groupType='Group'
                    obj.ismygroup=true
                    $greendao.saveObj('GroupChatsService',obj,function (msg) {
                      $rootScope.isGroupSend ='true'
                      //跳转群聊天界面
                      $state.go('messageGroup',{
                        "id":obj.id,
                        "chatName":$scope.data.name,
                        "grouptype":"Group",
                        "ismygroup":true
                      });
                    },function (err) {
                      $scope.secondUserIds=[];
                      $scope.secondDeptIds=[];
                    });
                  },function (err) {
                    $scope.secondUserIds=[];
                    $scope.secondDeptIds=[];
                    $ToastUtils.showToast(err)

                  });
                },function (err) {

                });
              }

            }
          },
        ]
      });
    }

    //当离开界面调用的方法
    $scope.$on('$ionicView.leave', function () {
      $contacts.clearSecondCount();
      $greendao.loadAllData('SelectIdService',function (msg) {
        if(msg.length>0){
          //查询级别等于2的值
          $greendao.queryData("SelectIdService", 'where grade =?', "2",function (data) {
            if(data.length>0){

              //然后把等于3的都删除了
              for(var k=0;k<data.length;k++){
                $greendao.deleteObj('SelectIdService',data[k],function (data) {

                },function (err) {

                })
              }
            }

            //对部门的操作
            if($scope.departlist.length>0){
              for (var i=0;i<$scope.departlist.length;i++){
                if($scope.departlist[i].isSelected){

                  var deptSaveId={};
                  deptSaveId.id=$scope.departlist[i].DeptID;
                  deptSaveId.grade='2';                        //二级代表是二级目录存下来的数据
                  deptSaveId.isselected=true;
                  deptSaveId.type='dept'
                  $greendao.saveObj('SelectIdService',deptSaveId,function (msg) {

                  },function (err) {

                  })
                }
              }
            }


          //再次遍历这个集合把所有选中的ids添加到数据库

            for(var j=0;j<$scope.userlist.length;j++){
              if($scope.userlist[j].isSelected){

                var userSaveId={};
                userSaveId.id=$scope.userlist[j].UserID;
                userSaveId.grade='2';                        //二级代表是二级目录存下来的数据
                userSaveId.isselected=true;
                userSaveId.type='user'
                $greendao.saveObj('SelectIdService',userSaveId,function (msg) {

                },function (err) {

                })

              }

            }

          },function (err) {
            //第二次数据查询
          })

        }

      },function (msg) {

      });




    });


  })


  //三级界面创建群聊

  .controller('addNewPersonthirdCtrl',function ($scope, $http, $state, $stateParams,$contacts,$ionicHistory,$ionicPopup,$api,$ToastUtils,$greendao,$rootScope) {

    //创建的类型看到底是从哪里过来的
    $scope.createType=$stateParams.createtype;

    //先从数据库里面取出id为特殊级别的 ids  特殊级别为0的
    var originalInfo=[];
    $greendao.queryData("SelectIdService", 'where grade =?', "0",function (msg) {

      originalInfo=msg;

    },function (err) {

    })
    //现在进入的是二级目录 所以要先获取等于二级的目录的人
    var anotherInfo=[];
    $greendao.queryData("SelectIdService", 'where grade =?', "3",function (msg) {

      anotherInfo=msg;


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

        //三级界面部门操作
        if ($scope.count1 > 0) {
          var olddepts = $contacts.getDeptThirdInfo().deptList;


          //遍历所有并且显示为false
          for(var n=0;n<olddepts.length; n++){
            olddepts[n].isSelected=false;
          }

          //取出数据库中的并且设置为黑色
          if(anotherInfo.length>0){
            for(var j=0;j<anotherInfo.length;j++){
              for(var m=0;m<olddepts.length; m++){
                if(anotherInfo[j].id==olddepts[m].DeptID){
                  olddepts[m].isSelected=true;
                }
              }
            }
          }
          //在界面上面展示
          for (var i = 0; i < olddepts.length; i++) {
            $scope.departthirdlist.push(olddepts[i]);
          }


        }

        //四级界面对部门的操作
        $scope.count2 = $contacts.getCount4();

        if ($scope.count2 > 0) {
          var oldusers = $contacts.getDeptThirdInfo().userList;

          //去除群主为了不让群主在里面显示
          for(var i=0;i<originalInfo.length;i++){
            for(var j=0;j<oldusers.length;j++){
              if(originalInfo[i].id==oldusers[j].UserID){
                oldusers.splice(j,1);
              }
            }
          }

          //设置所有的为false
          for(var n=0;n<oldusers.length; n++){
            oldusers[n].isSelected=false;
          }
          if(anotherInfo.length>0){
            //从数据库取出数据然后赋值
            for(var j=0;j<anotherInfo.length;j++){
              for(var m=0;m<oldusers.length; m++){
                if(anotherInfo[j].id==oldusers[m].UserID){
                  oldusers[m].isSelected=true;
                }
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




    //在第三级目录跳转到第四级目录
    $scope.jumpGroupForth = function (id, sname, tname,isnext) {
      if(isnext){
        $ToastUtils.showToast('选中后不可以再选择下级')
        $event.stopPropagation()
      }else {
        $state.go("addnewpersonforth", {
          "contactId": id,
          "secondname": sname,
          "thirdname": tname,
          "createtype":$scope.createType
        });
      }

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
                    deptSaveId.type='dept'
                    $greendao.saveObj('SelectIdService',deptSaveId,function (msg) {

                    },function (err) {

                    })
                  }
                }
              }


              //再次遍历这个集合把所有选中的ids添加到数据库
              for(var j=0;j<$scope.userthirdlist.length;j++){
                if($scope.userthirdlist[j].isSelected){

                  var userSaveId={};
                  userSaveId.id=$scope.userthirdlist[j].UserID;
                  userSaveId.grade='3';
                  userSaveId.isselected=true;
                  userSaveId.type='user'
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
              $scope.thirdUserIds=[];
              $scope.thirdDeptIds=[];
            }

          },
          {
            text: '<b>确定</b>',
            type: 'button-positive',
            onTap: function(e) {
              if($scope.data.name===undefined||$scope.data.name===null||$scope.data.name===""){
                $scope.thirdUserIds=[];
                $scope.thirdDeptIds=[];
                $ToastUtils.showToast("群名称不能为空");
              }else{
                // 查询数据库把不等于3这个级别的所有数据拿出来
                $greendao.queryData('SelectIdService','where grade <>?', "3",function (data) {

                  for(var i=0;i<data.length;i++){
                    if(data[i].type=='user'){

                      $scope.thirdUserIds.push(data[i].id)
                    }else if (data[i].type=='dept'){
                      $scope.thirdDeptIds.push(data[i].id)
                    }
                  }

                  //开始提交创建群组
                  $api.addGroup($scope.data.name,$scope.thirdDeptIds,$scope.thirdUserIds,function (msg) {
                    //当成功的时候先把数据库给清了
                    $greendao.deleteAllData('SelectIdService',function (data) {
                      // alert('数据被清空了')
                    },function (err) {

                    });

                    //信息保存到数据库
                    var obj={};
                    obj.id=msg;
                    obj.groupName=$scope.data.name;
                    obj.groupType='Group'
                    obj.ismygroup=true
                    $greendao.saveObj('GroupChatsService',obj,function (msg) {
                      $rootScope.isGroupSend ='true'
                      //跳转群聊天界面
                      $state.go('messageGroup',{
                        "id":obj.id,
                        "chatName":$scope.data.name,
                        "grouptype":"Group",
                        "ismygroup":true
                      });
                    },function (err) {
                      $scope.thirdUserIds=[];
                      $scope.thirdDeptIds=[];
                    });
                  },function (err) {
                    $scope.thirdUserIds=[];
                    $scope.thirdDeptIds=[];
                    $ToastUtils.showToast(err)

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


  .controller('addNewPersonforthCtrl', function ($scope, $state, $stateParams,$contacts,$ionicHistory,$api,$ToastUtils,$greendao,$ionicPopup,$rootScope) {

    //创建的类型看到底是从哪里过来的
    $scope.createType=$stateParams.createtype;

    //先从数据库里面取出id为特殊级别的 ids  特殊级别为0的
    var originalInfo=[];
    $greendao.queryData("SelectIdService", 'where grade =?', "0",function (msg) {

      originalInfo=msg;

    },function (err) {

    })
    //现在进入的是二级目录 所以要先获取等于二级的目录的人
    var anotherInfo=[];
    $greendao.queryData("SelectIdService", 'where grade =?', "4",function (msg) {

      anotherInfo=msg;


    },function (err) {

    })



    $scope.departforthlist = [];
    $scope.userforthlist = [];
    $scope.forthStatus;

    $scope.forthDeptIds=[];
    $scope.forthUserIds=[];


    $scope.contactId = $stateParams.contactId;
    $scope.secondName = $stateParams.secondname;
    $scope.thirdName = $stateParams.thirdname;

    //根据id获取子部门和人员信息
    $contacts.deptForthInfo($scope.contactId);
    $scope.$on('forth.update', function (event) {
      $scope.$apply(function () {

        //四级界面对部门的操作
        $scope.count1 = $contacts.getCount5();
        if ($scope.count1 > 0) {

          var olddepts = $contacts.getDeptForthInfo().deptList;
          //遍历所有并且显示为false
          for(var n=0;n<olddepts.length; n++){
            olddepts[n].isSelected=false;
          }

          //取出数据库中的并且设置为黑色
          if(anotherInfo.length>0){

            for(var j=0;j<anotherInfo.length;j++){
              for(var m=0;m<olddepts.length; m++){
                if(anotherInfo[j].id==olddepts[m].DeptID){
                  olddepts[m].isSelected=true;
                }
              }
            }
          }
          //在界面上面展示
          for (var i = 0; i < olddepts.length; i++) {
            $scope.departforthlist.push(olddepts[i]);
          }

        }


        //四级界面对人员的保存
        $scope.count2 = $contacts.getCount6();

        if ($scope.count2 > 0) {
          var oldusers = $contacts.getDeptForthInfo().userList;

          //去除群主为了不让群主在里面显示
          for(var i=0;i<originalInfo.length;i++){
            for(var j=0;j<oldusers.length;j++){
              if(originalInfo[i].id==oldusers[j].UserID){
                oldusers.splice(j,1);
              }
            }
          }

          //设置所有的为false
          for(var n=0;n<oldusers.length; n++){
            oldusers[n].isSelected=false;
          }
          if(anotherInfo.length>0){
            //从数据库取出数据然后赋值
            for(var j=0;j<anotherInfo.length;j++){
              for(var m=0;m<oldusers.length; m++){
                if(anotherInfo[j].id==oldusers[m].UserID){
                  oldusers[m].isSelected=true;
                }
              }
            }
          }

          //界面上面展示

          for (var i = 0; i < oldusers.length; i++) {

            $scope.userforthlist.push(oldusers[i]);
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




    //在四级目录需要返回三级目录  （ 三级目录进来需要两个参数 一个是 二级目录id一个是二级目录的名字 ）

    $scope.idididi = $contacts.getSecondID();
    $scope.firstid = $contacts.getFirstID();
    $scope.backThird = function () {

      $ionicHistory.goBack();

     };


    // 在四级目录返回二级目录  （二级目录只需要一个id就行）
    $scope.fromForthToSecond = function (sd) {
      $state.go("addnewpersonsecond", {
        "contactId": sd,
        "createtype":$scope.createType
      });
    };

    //从四级目录跳入五级目录
    $scope.jumpGroupFifth = function (id, sname, tname, fname,isnext) {
      if(isnext){
        $ToastUtils.showToast('选中后不可以再选择下级')
        $event.stopPropagation()
      }else {
        $state.go("addnewpersonfifth", {
          "contactId": id,
          "secondname": sname,
          "thirdname": tname,
          "forthname": fname,
          "createtype":$scope.createType
        });
      }
    };

    //从四级目录跳入详情界面

    $scope.goGroupForthDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });
    }

    $scope.$on('$ionicView.leave', function () {
      $contacts.clearForthCount();

      $greendao.loadAllData('SelectIdService',function (msg) {
        if(msg.length>0){
          //先遍历拿出所有groud等于3的所有对象
          $greendao.queryData("SelectIdService", 'where grade =?', "4",function (data) {
            if(data.length>0){

              //然后把等于3的都删除了
              for(var k=0;k<data.length;k++){
                $greendao.deleteObj('SelectIdService',data[k],function (data) {

                },function (err) {

                })
              }
            }


            //然后在开始部门的操作
            if($scope.departforthlist.length>0){
              for (var i=0;i<$scope.departforthlist.length;i++){
                if($scope.departforthlist[i].isSelected){

                  var deptSaveId={};
                  deptSaveId.id=$scope.departforthlist[i].DeptID;
                  deptSaveId.grade='4';
                  deptSaveId.isselected=true;
                  deptSaveId.type='dept'
                  $greendao.saveObj('SelectIdService',deptSaveId,function (msg) {

                  },function (err) {

                  })
                }
              }
            }


            //再次遍历这个集合把所有选中的ids添加到数据库
            for(var j=0;j<$scope.userforthlist.length;j++){


              if($scope.userforthlist[j].isSelected){

                var userSaveId={};
                userSaveId.id=$scope.userforthlist[j].UserID;
                userSaveId.grade='4';
                userSaveId.isselected=true;
                userSaveId.type='user'
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

    $scope.forthConfirm=function () {

      //拿部门ids
      if($scope.departforthlist.length>0){
        for (var i=0;i<$scope.departforthlist.length;i++){
          if($scope.departforthlist[i].isSelected){
            $scope.forthDeptIds.push($scope.departforthlist[i].DeptID);
          }
        }
      }
      //拿人员ids
      if($scope.userforthlist.length>0){
        for(var j=0;j<$scope.userforthlist.length;j++){
          if($scope.userforthlist[j].isSelected){
            $scope.forthUserIds.push($scope.userforthlist[j].UserID);
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
              $scope.forthDeptIds=[];
              $scope.forthUserIds=[];
            }

          },
          {
            text: '<b>确定</b>',
            type: 'button-positive',
            onTap: function(e) {
              if($scope.data.name===undefined||$scope.data.name===null||$scope.data.name===""){
                $scope.forthDeptIds=[];
                $scope.forthUserIds=[];
                $ToastUtils.showToast("群名称不能为空");
              }else{
                // 查询数据库把不等于3这个级别的所有数据拿出来
                $greendao.queryData('SelectIdService','where grade <>?', "4",function (data) {

                  for(var i=0;i<data.length;i++){
                    if(data[i].type=='user'){

                      $scope.forthUserIds.push(data[i].id)
                    }else if (data[i].type=='dept'){
                      $scope.forthDeptIds.push(data[i].id)
                    }
                  }

                  // alert('走到了这一步')

                  //开始提交创建群组
                  $api.addGroup($scope.data.name,$scope.forthDeptIds,$scope.forthUserIds,function (msg) {
                    // alert('你好我进来了')
                    //当成功的时候先把数据库给清了
                    $greendao.deleteAllData('SelectIdService',function (data) {
                      // alert('数据被清空了')
                    },function (err) {

                    });

                    //信息保存到数据库
                    var obj={};
                    obj.id=msg;
                    obj.groupName=$scope.data.name;
                    obj.groupType='Group'
                    obj.ismygroup=true
                    $greendao.saveObj('GroupChatsService',obj,function (msg) {
                      $rootScope.isGroupSend ='true'
                      //跳转群聊天界面
                      $state.go('messageGroup',{
                        "id":obj.id,
                        "chatName":$scope.data.name,
                        "grouptype":"Group",
                        "ismygroup":true
                      });
                    },function (err) {
                      $scope.forthDeptIds=[];
                      $scope.forthUserIds=[];
                    });
                  },function (err) {
                    $scope.forthDeptIds=[];
                    $scope.forthUserIds=[];
                    $ToastUtils.showToast(err)

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







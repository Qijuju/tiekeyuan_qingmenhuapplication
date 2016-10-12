/**
 * Created by Administrator on 2016/9/2.
 */
angular.module('selectothergroup.controllers', [])

  .controller('addNewPersonfifthCtrl', function ($scope,$state, $stateParams,$contacts,$ionicHistory,$greendao,$ToastUtils,$ionicPopup,$api,$rootScope,$ionicLoading,$timeout) {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });
    //创建的类型看到底是从哪里过来的
    $scope.createType=$stateParams.createtype;

    $scope.gourpId=$stateParams.groupid;
    $scope.groupName=$stateParams.groupname;

    $scope.departfifthlist = [];
    $scope.userfifthlist = [];
    $scope.fifthStatus;
    $scope.fifthDeptIds=[];
    $scope.fifthUserIds=[];
    $scope.contactId = $stateParams.contactId;
    $scope.secondName = $stateParams.secondname;
    $scope.thirdName = $stateParams.thirdname;
    $scope.forthName = $stateParams.forthname;

    //先从数据库里面取出id为特殊级别的 ids  特殊级别为0的
    var originalInfo=[];
    $greendao.queryData("SelectIdService", 'where grade =?', "0",function (msg) {

      originalInfo=msg;

    },function (err) {

    })
    //现在进入的是二级目录 所以要先获取等于二级的目录的人
    var anotherInfo=[];
    $greendao.queryData("SelectIdService", 'where grade =?', "5",function (msg) {

      anotherInfo=msg;

    },function (err) {

    })

    //根据id获取子部门和人员信息
    $contacts.deptFifthInfo($scope.contactId);
    $scope.$on('fifth.update', function (event) {
      $scope.$apply(function () {

        $timeout(function () {
          $ionicLoading.hide();
          $scope.count1 = $contacts.getCount7();
          //首先是对部门的操作
          if ($scope.count1 > 0) {
            var olddepts = $contacts.getDeptFifthInfo().deptList;
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

              $scope.departfifthlist.push(olddepts[i]);

            }
          }


          //然后是对人员的操作
          $scope.count2 = $contacts.getCount8();

          if ($scope.count2 > 0) {
            var oldusers = $contacts.getDeptFifthInfo().userList;

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
        });


      })

    });

    $scope.loadFifthMore = function () {
      $contacts.deptFifthInfo($scope.contactId);

    }


    $scope.$on('$ionicView.leave', function () {
      $contacts.clearFifthCount();
      $greendao.loadAllData('SelectIdService',function (msg) {
        if(msg.length>0){
          //查询级别等于2的值
          $greendao.queryData("SelectIdService", 'where parentid =?', $scope.parentID,function (data) {
            if(data.length>0){

              //然后把等于3的都删除了
              for(var k=0;k<data.length;k++){
                if(data[k].grade=="5"){
                  $greendao.deleteObj('SelectIdService',data[k],function (data) {

                  },function (err) {

                  });
                }
              }
            }

            //对部门的操作
            if($scope.departfifthlist.length>0){
              for (var i=0;i<$scope.departfifthlist.length;i++){
                if($scope.departfifthlist[i].isSelected){

                  var deptSaveId={};
                  deptSaveId.id=$scope.departfifthlist[i].DeptID;
                  deptSaveId.grade='5';
                  deptSaveId.isselected=true;
                  deptSaveId.type='dept';
                  deptSaveId.parentid=$scope.parentID;
                  $greendao.saveObj('SelectIdService',deptSaveId,function (msg) {

                  },function (err) {

                  })
                }
              }
            }


            //再次遍历这个集合把所有选中的ids添加到数据库

            for(var j=0;j<$scope.userfifthlist.length;j++){
              if($scope.userfifthlist[j].isSelected){

                var userSaveId={};
                userSaveId.id=$scope.userfifthlist[j].UserID;
                userSaveId.grade='5';                        //二级代表是二级目录存下来的数据
                userSaveId.isselected=true;
                userSaveId.type='user';
                userSaveId.parentid=$scope.parentID;

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

    //点击确定按钮执行
    $scope.fifthConfirm=function () {

      if($scope.departfifthlist.length>0){
        for (var i=0;i<$scope.departfifthlist.length;i++){
          if($scope.departfifthlist[i].isSelected){
            $scope.fifthDeptIds.push($scope.departfifthlist[i].DeptID);
          }
        }
      }
      if($scope.userfifthlist.length>0){
        for(var j=0;j<$scope.userfifthlist.length;j++){
          if($scope.userfifthlist[j].isSelected){
            $scope.fifthUserIds.push($scope.userfifthlist[j].UserID);
          }
        }

      }

      if($scope.createType==="single"){
        $scope.data = {};
        $ionicPopup.show({
          template: '<input type="text" ng-model="data.name">',
          title: '创建群聊',
          subTitle: '请输入群名称',
          scope: $scope,
          buttons: [
            { text: '取消',
              onTap: function(e) {
                $scope.fifthDeptIds=[];
                $scope.fifthUserIds=[];
              }

            },
            {
              text: '<b>确定</b>',
              type: 'button-positive',
              onTap: function(e) {
                if($scope.data.name===undefined||$scope.data.name===null||$scope.data.name===""){
                  $scope.fifthDeptIds=[];
                  $scope.fifthUserIds=[];
                  $ToastUtils.showToast("群名称不能为空");
                }else{
                  // 查询数据库把不等于3这个级别的所有数据拿出来
                  $greendao.queryData('SelectIdService','where parentid <>?', $scope.parentID,function (data) {

                    for(var i=0;i<data.length;i++){
                      if(data[i].type=='user'){

                        $scope.fifthUserIds.push(data[i].id)
                      }else if (data[i].type=='dept'){
                        $scope.fifthDeptIds.push(data[i].id)
                      }
                    }


                    //开始提交创建群组
                    $api.addGroup($scope.data.name,$scope.fifthDeptIds,$scope.fifthUserIds,function (msg) {
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
                        $rootScope.isPersonSend === 'true'
                        //跳转群聊天界面
                        $state.go('messageGroup',{
                          "id":obj.id,
                          "chatName":$scope.data.name,
                          "grouptype":"Group",
                          "ismygroup":true
                        });
                      },function (err) {
                        $scope.fifthDeptIds=[];
                        $scope.fifthUserIds=[];
                      });
                    },function (err) {
                      $scope.fifthDeptIds=[];
                      $scope.fifthUserIds=[];
                      $ToastUtils.showToast(err)

                    });
                  },function (err) {

                  });
                }

              }
            },
          ]
        });
      }else {
        //当是从添加群组的联系人开始的时候

        $greendao.queryData('SelectIdService','where parentid <>?', $scope.parentID,function (data) {

          if(data.length>0){
            for(var i=0;i<data.length;i++){
              if(data[i].type=='user'){

                $scope.fifthUserIds.push(data[i].id)
              }else if (data[i].type=='dept'){
                $scope.fifthDeptIds.push(data[i].id)
              }
            }
          }

          if($scope.fifthDeptIds.length>0 || $scope.fifthUserIds.length>0){
            $api.groupAddMember($scope.gourpId,$scope.fifthDeptIds,$scope.fifthUserIds,function (data) {

              $greendao.deleteAllData('SelectIdService',function (hh) {
                //跳转到设置界面
                $state.go('groupMember',{
                  "groupid":data,
                  "chatname":$scope.groupName,
                  "grouptype":'Group',
                  "ismygroup":true
                });

              },function (err) {

              });
              $ToastUtils.showToast("添加人员成功")

            },function (err) {
              $scope.fifthDeptIds=[];
              $scope.fifthUserIds=[];
              $ToastUtils.showToast(err)

            })
          }else {
            $scope.fifthDeptIds=[];
            $scope.fifthUserIds=[];
            $ToastUtils.showToast('请先选择人员')
          }

        },function (err) {
          $scope.fifthDeptIds=[];
          $scope.fifthUserIds=[];
          $ToastUtils.showToast(err)

        })
      }




    }
    //返回二级部门 需要一个id；
    $scope.firstid = $contacts.getFirstID();
    $scope.secondid = $contacts.getSecondID();
    $scope.thirdid = $contacts.getThirdID();

    $scope.fromFifthToSecond = function (sd) {
      $state.go("addnewpersonsecond", {
        "contactId": sd,
        "createtype":$scope.createType,
        "groupid": $scope.gourpId,
        "groupname":$scope.groupName
      });

    };


    //返回三级部门需要一个Id和一个名字；
    $scope.fromFifthToThird = function (sd, sname) {
      $state.go("addnewpersonthird", {
        "contactId": sd,
        "secondname": sname,
        "createtype":$scope.createType,
        "groupid": $scope.gourpId,
        "groupname":$scope.groupName
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
    $scope.jumpGroupSixth = function (id, sname, tname, fname, dd,isnext) {
      if(isnext){
        $ToastUtils.showToast('选中后不可以再选择下级')
        $event.stopPropagation()
      }else {
        $state.go("addnewpersonsixth", {
          "contactId": id,
          "secondname": sname,
          "thirdname": tname,
          "forthname": fname,
          "fifthname": dd,
          "createtype":$scope.createType,
          "groupid": $scope.gourpId,
          "groupname":$scope.groupName

        });
      }
    };


    //从五级部门跳转到详情界面
    $scope.goGroupFifthDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });
    }
  })



  //对六级目录的操作
  .controller('addNewPersonsixthCtrl', function ($scope,$state, $stateParams,$contacts,$ionicHistory,$greendao,$ToastUtils,$ionicPopup,$api,$rootScope,$ionicLoading,$timeout) {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });
    //创建的类型看到底是从哪里过来的
    $scope.createType=$stateParams.createtype;
    $scope.gourpId=$stateParams.groupid;
    $scope.groupName=$stateParams.groupname;

    $scope.departsixthlist = [];
    $scope.usersixthlist = [];
    $scope.sixthStatus;
    $scope.sixthDeptIds=[];
    $scope.sixthUserIds=[];
    $scope.contactId = $stateParams.contactId;
    $scope.secondName = $stateParams.secondname;
    $scope.thirdName = $stateParams.thirdname;
    $scope.forthName = $stateParams.forthname;
    $scope.fifthName = $stateParams.fifthname;


    //先从数据库里面取出id为特殊级别的 ids  特殊级别为0的
    var originalInfo=[];
    $greendao.queryData("SelectIdService", 'where grade =?', "0",function (msg) {

      originalInfo=msg;

    },function (err) {

    })
    //现在进入的是二级目录 所以要先获取等于二级的目录的人
    var anotherInfo=[];
    $greendao.queryData("SelectIdService", 'where grade =?', "6",function (msg) {

      anotherInfo=msg;

    },function (err) {

    })

    //根据id获取子部门和人员信息
    $contacts.deptSixthInfo($scope.contactId);
    $scope.$on('sixth.update', function (event) {
      $scope.$apply(function () {

        $timeout(function () {
          $ionicLoading.hide();

          $scope.count1 = $contacts.getCount9();
          //对部门的操作
          if ($scope.count1 > 0) {
            var olddepts = $contacts.getDeptSixthInfo().deptList;

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

              $scope.departsixthlist.push(olddepts[i]);

            }



          }





          //对人员进行操作

          $scope.count2 = $contacts.getCount10();

          if ($scope.count2 > 0) {
            var oldusers = $contacts.getDeptSixthInfo().userList;

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


        });




      })

    });



    $scope.loadSixthMore = function () {
      $contacts.deptSixthInfo($scope.contactId);

    }

    //离开页面的操作
    $scope.$on('$ionicView.leave', function () {
      $contacts.clearSixthCount();
      $greendao.loadAllData('SelectIdService',function (msg) {
        if(msg.length>0){
          //查询级别等于2的值
          $greendao.queryData("SelectIdService", 'where parentid =?', $scope.parentID,function (data) {
            if(data.length>0){

              //然后把等于3的都删除了
              for(var k=0;k<data.length;k++){
                if(data[k].grade=="6"){
                  $greendao.deleteObj('SelectIdService',data[k],function (data) {

                  },function (err) {

                  })
                }
              }
            }

            //对部门的操作
            if($scope.departsixthlist.length>0){
              for (var i=0;i<$scope.departsixthlist.length;i++){
                if($scope.departsixthlist[i].isSelected){

                  var deptSaveId={};
                  deptSaveId.id=$scope.departsixthlist[i].DeptID;
                  deptSaveId.grade='6';
                  deptSaveId.isselected=true;
                  deptSaveId.type='dept';
                  deptSaveId.parentid=$scope.parentID;
                  $greendao.saveObj('SelectIdService',deptSaveId,function (msg) {

                  },function (err) {

                  })
                }
              }
            }


            //再次遍历这个集合把所有选中的ids添加到数据库

            for(var j=0;j<$scope.usersixthlist.length;j++){
              if($scope.usersixthlist[j].isSelected){

                var userSaveId={};
                userSaveId.id=$scope.usersixthlist[j].UserID;
                userSaveId.grade='6';                        //二级代表是二级目录存下来的数据
                userSaveId.isselected=true;
                userSaveId.type='user';
                userSaveId.parentid=$scope.parentID;
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


    //点击确定按钮的操作
    $scope.sixthConfirm=function () {


      if($scope.departsixthlist.length>0){
        for (var i=0;i<$scope.departsixthlist.length;i++){
          if($scope.departsixthlist[i].isSelected){
            $scope.sixthDeptIds.push($scope.departsixthlist[i].DeptID);
          }
        }
      }
      if($scope.usersixthlist.length>0){
        for(var j=0;j<$scope.usersixthlist.length;j++){
          if($scope.usersixthlist[j].isSelected){
            $scope.sixthUserIds.push($scope.usersixthlist[j].UserID);
          }
        }

      }
      if($scope.createType==="single"){
        $scope.data = {};
        $ionicPopup.show({
          template: '<input type="text" ng-model="data.name">',
          title: '创建群聊',
          subTitle: '请输入群名称',
          scope: $scope,
          buttons: [
            { text: '取消',
              onTap: function(e) {
                $scope.sixthUserIds=[];
                $scope.sixthDeptIds=[];
              }

            },
            {
              text: '<b>确定</b>',
              type: 'button-positive',
              onTap: function(e) {
                if($scope.data.name===undefined||$scope.data.name===null||$scope.data.name===""){
                  $scope.sixthUserIds=[];
                  $scope.sixthDeptIds=[];
                  $ToastUtils.showToast("群名称不能为空");
                }else{
                  // 查询数据库把不等于3这个级别的所有数据拿出来
                  $greendao.queryData('SelectIdService','where parentid <>?', $scope.parentID,function (data) {

                    for(var i=0;i<data.length;i++){
                      if(data[i].type=='user'){

                        $scope.sixthUserIds.push(data[i].id)
                      }else if (data[i].type=='dept'){
                        $scope.sixthDeptIds.push(data[i].id)
                      }
                    }


                    //开始提交创建群组
                    $api.addGroup($scope.data.name,$scope.sixthDeptIds,$scope.sixthUserIds,function (msg) {
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
                        $rootScope.isPersonSend === 'true'
                        //跳转群聊天界面
                        $state.go('messageGroup',{
                          "id":obj.id,
                          "chatName":$scope.data.name,
                          "grouptype":"Group",
                          "ismygroup":true
                        });
                      },function (err) {
                        $scope.sixthUserIds=[];
                        $scope.sixthDeptIds=[];
                      });
                    },function (err) {
                      $scope.sixthUserIds=[];
                      $scope.sixthDeptIds=[];
                      $ToastUtils.showToast(err)

                    });
                  },function (err) {

                  });
                }

              }
            },
          ]
        });
      }else {
        $greendao.queryData('SelectIdService','where parentid <>?', $scope.parentID,function (data) {

          if(data.length>0){
            for(var i=0;i<data.length;i++){
              if(data[i].type=='user'){

                $scope.sixthUserIds.push(data[i].id)
              }else if (data[i].type=='dept'){
                $scope.sixthDeptIds.push(data[i].id)
              }
            }
          }

          if($scope.sixthDeptIds.length>0 || $scope.sixthUserIds.length>0){
            $api.groupAddMember($scope.gourpId,$scope.sixthDeptIds,$scope.sixthUserIds,function (data) {

              $greendao.deleteAllData('SelectIdService',function (hh) {
                //跳转到设置界面
                $state.go('groupMember',{
                  "groupid":data,
                  "chatname":$scope.groupName,
                  "grouptype":'Group',
                  "ismygroup":true
                });

              },function (err) {

              });
              $ToastUtils.showToast("添加人员成功")

            },function (err) {
              $scope.sixthUserIds=[];
              $scope.sixthDeptIds=[];
              $ToastUtils.showToast(err)

            })
          }else {
            $scope.sixthUserIds=[];
            $scope.sixthDeptIds=[];
            $ToastUtils.showToast('请先选择人员')
          }

        },function (err) {
          $scope.sixthUserIds=[];
          $scope.sixthDeptIds=[];
          $ToastUtils.showToast(err)

        })
      }



    }

    //返回二级部门 需要一个id；
    $scope.firstidInSix = $contacts.getFirstID();
    $scope.secondidInSix = $contacts.getSecondID();
    $scope.thirdidInSix = $contacts.getThirdID();
    $scope.forthidInSix = $contacts.getForthID();


    //从六级部门跳转到七级部门
    $scope.jumpGroupSeventh = function (id, sname, tname, fname, sixname, ddd,isnext) {
      if(isnext){
        $ToastUtils.showToast('选中后不可以再选择下级')
        $event.stopPropagation()
      }else {
        $state.go("addnewpersonseventh", {
          "contactId": id,
          "secondname": sname,
          "thirdname": tname,
          "forthname": fname,
          "fifthname": sixname,
          "sixthname": ddd,
          "createtype":$scope.createType,
          "groupid": $scope.gourpId,
          "groupname":$scope.groupName

        });
      }

    };

    //从六级界面跳转到2级界面 只需要一个参数
    $scope.fromSixthToSecond = function (sd) {
      $state.go("addnewpersonsecond", {
        "contactId": sd,
        "createtype":$scope.createType,
        "groupid": $scope.gourpId,
        "groupname":$scope.groupName

      });
    };

    //从六级跳转到3级界面 需要两个参数
    $scope.fromSixthToThird = function (sd, sname) {
      $state.go("addnewpersonthird", {
        "contactId": sd,
        "secondname": sname,
        "createtype":$scope.createType,
        "groupid": $scope.gourpId,
        "groupname":$scope.groupName

      });
    };

    //从六级跳转到4级界面  需要三个参数

    $scope.fromSixthToForth = function (sd, sname, tname) {
      $state.go("addnewpersonforth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
        "createtype":$scope.createType,
        "groupid": $scope.gourpId,
        "groupname":$scope.groupName

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


  //七级界面创建群聊

  .controller('addNewPersonseventhCtrl', function ($scope,$state, $stateParams,$contacts,$ionicHistory,$greendao,$ToastUtils,$ionicPopup,$api,$rootScope,$ionicLoading,$timeout) {

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });

    //创建的类型看到底是从哪里过来的
    $scope.createType=$stateParams.createtype;
    $scope.gourpId=$stateParams.groupid;
    $scope.groupName=$stateParams.groupname;

    //先从数据库里面取出id为特殊级别的 ids  特殊级别为0的
    var originalInfo=[];
    $greendao.queryData("SelectIdService", 'where grade =?', "0",function (msg) {

      originalInfo=msg;

    },function (err) {

    })
    //现在进入的是二级目录 所以要先获取等于二级的目录的人
    var anotherInfo=[];
    $greendao.queryData("SelectIdService", 'where grade =?', "7",function (msg) {

      anotherInfo=msg;

    },function (err) {

    })

    $scope.departseventhlist = [];
    $scope.userseventhlist = [];
    $scope.seventhDeptIds=[];
    $scope.seventhUserIds=[];
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

        $timeout(function () {
          $ionicLoading.hide();

          $scope.count1 = $contacts.getCount11();

          if ($scope.count1 > 0) {
            var olddepts = $contacts.getDeptSeventhInfo().deptList;

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

              $scope.departseventhlist.push(olddepts[i]);

            }
          }





          $scope.count2 = $contacts.getCount12();

          if ($scope.count2 > 0) {
            var oldusers = $contacts.getDeptSeventhInfo().userList;

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
              $scope.userseventhlist.push(oldusers[i]);
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

        });




      })

    });

    $scope.loadSeventhMore = function () {
      $contacts.deptSeventhInfo($scope.contactId);

    }

    $scope.$on('$ionicView.leave', function () {
      $contacts.clearSeventhCount();
      $greendao.loadAllData('SelectIdService',function (msg) {
        if(msg.length>0){
          //查询级别等于2的值
          $greendao.queryData("SelectIdService", 'where parentid =?', $scope.parentID,function (data) {
            if(data.length>0){

              //然后把等于3的都删除了
              for(var k=0;k<data.length;k++){
                if(data[k].grade=="7"){
                  $greendao.deleteObj('SelectIdService',data[k],function (data) {

                  },function (err) {

                  });
                }

              }
            }

            //对部门的操作
            if($scope.departseventhlist.length>0){
              for (var i=0;i<$scope.departseventhlist.length;i++){
                if($scope.departseventhlist[i].isSelected){

                  var deptSaveId={};
                  deptSaveId.id=$scope.departseventhlist[i].DeptID;
                  deptSaveId.grade='7';
                  deptSaveId.isselected=true;
                  deptSaveId.type='dept';
                  deptSaveId.parentid=$scope.parentID;
                  $greendao.saveObj('SelectIdService',deptSaveId,function (msg) {

                  },function (err) {

                  })
                }
              }
            }


            //再次遍历这个集合把所有选中的ids添加到数据库

            for(var j=0;j<$scope.userseventhlist.length;j++){
              if($scope.userseventhlist[j].isSelected){

                var userSaveId={};
                userSaveId.id=$scope.userseventhlist[j].UserID;
                userSaveId.grade='7';                        //二级代表是二级目录存下来的数据
                userSaveId.isselected=true;
                userSaveId.type='user';
                userSaveId.parentid=$scope.parentID;
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

    $scope.seventhConfirm=function () {



      if($scope.departseventhlist.length>0){
        for (var i=0;i<$scope.departseventhlist.length;i++){
          if($scope.departseventhlist[i].isSelected){
            $scope.seventhDeptIds.push($scope.departseventhlist[i].DeptID);
          }
        }
      }
      if($scope.userseventhlist.length>0){
        for(var j=0;j<$scope.userseventhlist.length;j++){
          if($scope.userseventhlist[j].isSelected){
            $scope.seventhUserIds.push($scope.userseventhlist[j].UserID);
          }
        }

      }

      if($scope.createType==="single"){
        $scope.data = {};
        $ionicPopup.show({
          template: '<input type="text" ng-model="data.name">',
          title: '创建群聊',
          subTitle: '请输入群名称',
          scope: $scope,
          buttons: [
            { text: '取消',
              onTap: function(e) {
                $scope.seventhDeptIds=[];
                $scope.seventhUserIds=[];
              }

            },
            {
              text: '<b>确定</b>',
              type: 'button-positive',
              onTap: function(e) {
                if($scope.data.name===undefined||$scope.data.name===null||$scope.data.name===""){
                  $scope.seventhDeptIds=[];
                  $scope.seventhUserIds=[];
                  $ToastUtils.showToast("群名称不能为空");
                }else{
                  // 查询数据库把不等于3这个级别的所有数据拿出来
                  $greendao.queryData('SelectIdService','where parentid <>?', $scope.parentID,function (data) {

                    for(var i=0;i<data.length;i++){
                      if(data[i].type=='user'){

                        $scope.seventhUserIds.push(data[i].id)
                      }else if (data[i].type=='dept'){
                        $scope.seventhDeptIds.push(data[i].id)
                      }
                    }


                    //开始提交创建群组
                    $api.addGroup($scope.data.name,$scope.seventhDeptIds,$scope.seventhUserIds,function (msg) {
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
                        $rootScope.isPersonSend === 'true'
                        //跳转群聊天界面
                        $state.go('messageGroup',{
                          "id":obj.id,
                          "chatName":$scope.data.name,
                          "grouptype":"Group",
                          "ismygroup":true
                        });
                      },function (err) {
                        $scope.seventhDeptIds=[];
                        $scope.seventhUserIds=[];
                      });
                    },function (err) {
                      $scope.seventhDeptIds=[];
                      $scope.seventhUserIds=[];
                      $ToastUtils.showToast(err)

                    });
                  },function (err) {

                  });
                }

              }
            },
          ]
        });

      }else {

        $greendao.queryData('SelectIdService','where parentid <>?', $scope.parentID,function (data) {

          if(data.length>0){
            for(var i=0;i<data.length;i++){
              if(data[i].type=='user'){

                $scope.seventhUserIds.push(data[i].id)
              }else if (data[i].type=='dept'){
                $scope.seventhDeptIds.push(data[i].id)
              }
            }
          }

          if($scope.seventhDeptIds.length>0 || $scope.seventhUserIds.length>0){
            $api.groupAddMember($scope.gourpId,$scope.seventhDeptIds,$scope.seventhUserIds,function (data) {

              $greendao.deleteAllData('SelectIdService',function (hh) {
                //跳转到设置界面
                $state.go('groupMember',{
                  "groupid":data,
                  "chatname":$scope.groupName,
                  "grouptype":'Group',
                  "ismygroup":true
                });

              },function (err) {

              });
              $ToastUtils.showToast("添加人员成功")

            },function (err) {
              $scope.seventhDeptIds=[];
              $scope.seventhUserIds=[];
              $ToastUtils.showToast(err)

            })
          }else {
            $scope.seventhDeptIds=[];
            $scope.seventhUserIds=[];
            $ToastUtils.showToast('请先选择人员')
          }

        },function (err) {
          $scope.seventhDeptIds=[];
          $scope.seventhUserIds=[];
          $ToastUtils.showToast(err)

        })


      }



    }


    $scope.firstidInSeven = $contacts.getFirstID();
    $scope.secondidInSeven = $contacts.getSecondID();
    $scope.thirdidInSeven = $contacts.getThirdID();
    $scope.forthidInSeven = $contacts.getForthID();
    $scope.fifthidInSeven = $contacts.getFifthID();

    $scope.jumpGroupEighth=function (id, sname, tname, fname, sixname, ddd,zuihou,isnext) {
      if(isnext){
        $ToastUtils.showToast('选中后不可以再选择下级')
        $event.stopPropagation()
      }
      $state.go("addnewpersoneighth", {
        "contactId": id,
        "secondname": sname,
        "thirdname": tname,
        "forthname": fname,
        "fifthname": sixname,
        "sixthname": ddd,
        "seventhname":zuihou,
        "createtype":$scope.createType,
        "groupid":$scope.gourpId,
        "groupname":$scope.groupName

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
        "forthname": ttname,
        "createtype":$scope.createType,
        "groupid": $scope.gourpId,
        "groupname":$scope.groupName

      });
    }

    //从七级目录到四级目录  四级目录需要四个参数
    $scope.fromSeventhToForth = function (sd, sname, tname) {
      $state.go("addnewpersonforth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
        "createtype":$scope.createType,
        "groupid": $scope.gourpId,
        "groupname":$scope.groupName

      });
    };

    //从七级目录到三级目录  三级目录需要两个个参数


    $scope.fromSeventhToThird = function (sd, sname) {
      $state.go("addnewpersonthird", {
        "contactId": sd,
        "secondname": sname,
        "createtype":$scope.createType,
        "groupid": $scope.gourpId,
        "groupname":$scope.groupName

      });
    };

    //从七级目录到二级目录  二级目录需要1个参数

    $scope.fromSeventhToSecond = function (sd) {
      $state.go("addnewpersonsecond", {
        "contactId": sd,
        "createtype":$scope.createType,
        "groupid": $scope.gourpId,
        "groupname":$scope.groupName

      });
    };


    //从七级界面跳入到详情界面
    $scope.goGroupSeventhDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });
    };


  })


  //八级界面的展示

  .controller('addNewPersoneighthCtrl', function ($scope,$state, $stateParams,$contacts,$ionicHistory,$greendao,$ToastUtils,$ionicPopup,$api,$rootScope,$ionicLoading,$timeout) {

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });

    //创建的类型看到底是从哪里过来的
    $scope.createType=$stateParams.createtype;
    $scope.gourpId=$stateParams.groupid;
    $scope.groupName=$stateParams.groupname;

    //先从数据库里面取出id为特殊级别的 ids  特殊级别为0的
    var originalInfo=[];
    $greendao.queryData("SelectIdService", 'where grade =?', "0",function (msg) {

      originalInfo=msg;

    },function (err) {

    })
    //现在进入的是二级目录 所以要先获取等于二级的目录的人
    var anotherInfo=[];
    $greendao.queryData("SelectIdService", 'where grade =?', "8",function (msg) {

      anotherInfo=msg;

    },function (err) {

    })





    $scope.eightDept = [];
    $scope.eightUser = [];
    $scope.eighthStatus;
    $scope.eighthDeptIds=[];
    $scope.eighthUserIds=[];



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

        $timeout(function () {
          $ionicLoading.hide();

          $scope.count1 = $contacts.getCount13();
          if ($scope.count1 > 0) {

            var olddepts = $contacts.getDeptEighthInfo().deptList;
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

              $scope.eightDept.push(olddepts[i]);

            }

          }


          $scope.count2 = $contacts.getCount14();
          if ($scope.count2 > 0) {
            var oldusers = $contacts.getDeptEighthInfo().userList;

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
        });



      })

    });

    $scope.loadEighthMore = function () {
      $contacts.deptEighthInfo($scope.contactId);

    }



    $scope.$on('$ionicView.leave', function () {
      $contacts.clearEngithCount();
      $greendao.loadAllData('SelectIdService',function (msg) {
        if(msg.length>0){
          //查询级别等于2的值
          $greendao.queryData("SelectIdService", 'where parentid =?', $scope.parentID,function (data) {
            if(data.length>0){

              //然后把等于3的都删除了
              for(var k=0;k<data.length;k++){
                if(data[k].grade=="8"){

                  $greendao.deleteObj('SelectIdService',data[k],function (data) {

                  },function (err) {

                  });
                  
                }
              }
            }

            //对部门的操作
            if($scope.eightDept.length>0){
              for (var i=0;i<$scope.eightDept.length;i++){
                if($scope.eightDept[i].isSelected){

                  var deptSaveId={};
                  deptSaveId.id=$scope.eightDept[i].DeptID;
                  deptSaveId.grade='8';
                  deptSaveId.isselected=true;
                  deptSaveId.type='dept';
                  deptSaveId.parentid=$scope.parentID;
                  $greendao.saveObj('SelectIdService',deptSaveId,function (msg) {

                  },function (err) {

                  })
                }
              }
            }


            //再次遍历这个集合把所有选中的ids添加到数据库

            for(var j=0;j<$scope.eightUser.length;j++){
              if($scope.eightUser[j].isSelected){

                var userSaveId={};
                userSaveId.id=$scope.eightUser[j].UserID;
                userSaveId.grade='8';                        //二级代表是二级目录存下来的数据
                userSaveId.isselected=true;
                userSaveId.type='user';
                userSaveId.parentid=$scope.parentID;

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



    $scope.eighthConfirm=function () {

      if($scope.eightDept.length>0){
        for (var i=0;i<$scope.eightDept.length;i++){
          if($scope.eightDept[i].isSelected){
            $scope.eighthDeptIds.push($scope.eightDept[i].DeptID);
          }
        }
      }
      if($scope.eightUser.length>0){
        for(var j=0;j<$scope.eightUser.length;j++){
          if($scope.eightUser[j].isSelected){
            $scope.eighthUserIds.push($scope.eightUser[j].UserID);
          }
        }

      }

      if($scope.createType==="single"){
        $scope.data = {};
        $ionicPopup.show({
          template: '<input type="text" ng-model="data.name">',
          title: '创建群聊',
          subTitle: '请输入群名称',
          scope: $scope,
          buttons: [
            { text: '取消',
              onTap: function(e) {
                $scope.eighthDeptIds=[];
                $scope.eighthUserIds=[];
              }

            },
            {
              text: '<b>确定</b>',
              type: 'button-positive',
              onTap: function(e) {
                if($scope.data.name===undefined||$scope.data.name===null||$scope.data.name===""){
                  $scope.eighthDeptIds=[];
                  $scope.eighthUserIds=[];
                  $ToastUtils.showToast("群名称不能为空");
                }else{
                  // 查询数据库把不等于3这个级别的所有数据拿出来
                  $greendao.queryData('SelectIdService','where parentid <>?', $scope.parentID,function (data) {

                    for(var i=0;i<data.length;i++){
                      if(data[i].type=='user'){

                        $scope.eighthUserIds.push(data[i].id)
                      }else if (data[i].type=='dept'){
                        $scope.eighthDeptIds.push(data[i].id)
                      }
                    }


                    //开始提交创建群组
                    $api.addGroup($scope.data.name,$scope.eighthDeptIds,$scope.eighthUserIds,function (msg) {
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
                        $rootScope.isPersonSend === 'true'
                        //跳转群聊天界面
                        $state.go('messageGroup',{
                          "id":obj.id,
                          "chatName":$scope.data.name,
                          "grouptype":"Group",
                          "ismygroup":true
                        });
                      },function (err) {
                        $scope.eighthDeptIds=[];
                        $scope.eighthUserIds=[];
                      });
                    },function (err) {
                      $scope.eighthDeptIds=[];
                      $scope.eighthUserIds=[];
                      $ToastUtils.showToast(err)

                    });
                  },function (err) {

                  });
                }

              }
            },
          ]
        });
      }else {

        $greendao.queryData('SelectIdService','where parentid <>?', $scope.parentID,function (data) {

          if(data.length>0){
            for(var i=0;i<data.length;i++){
              if(data[i].type=='user'){

                $scope.eighthUserIds.push(data[i].id)
              }else if (data[i].type=='dept'){
                $scope.eighthDeptIds.push(data[i].id)
              }
            }
          }

          if($scope.eighthDeptIds.length>0 || $scope.eighthUserIds.length>0){
            $api.groupAddMember($scope.gourpId,$scope.eighthDeptIds,$scope.eighthUserIds,function (data) {

              $greendao.deleteAllData('SelectIdService',function (hh) {
                //跳转到设置界面
                $state.go('groupMember',{
                  "groupid":data,
                  "chatname":$scope.groupName,
                  "grouptype":'Group',
                  "ismygroup":true
                });

              },function (err) {

              });
              $ToastUtils.showToast("添加人员成功")

            },function (err) {
              $scope.eighthDeptIds=[];
              $scope.eighthUserIds=[];
              $ToastUtils.showToast(err)

            })
          }else {
            $scope.eighthDeptIds=[];
            $scope.eighthUserIds=[];
            $ToastUtils.showToast('请先选择人员')
          }

        },function (err) {
          $scope.eighthDeptIds=[];
          $scope.eighthUserIds=[];
          $ToastUtils.showToast(err)

        })

      }



    }



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
        "fifthname":tttname,
        "createtype":$scope.createType,
        "groupid": $scope.gourpId,
        "groupname":$scope.groupName

      });
    }


    //从八级目录到五级目录  五级目录需要四个参数
    $scope.fromEighthToFifth = function (sd, sname, tname, ttname) {
      $state.go("addnewpersonfifth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
        "forthname": ttname,
        "createtype":$scope.createType,
        "groupid": $scope.gourpId,
        "groupname":$scope.groupName
      });
    }

    //从八级目录到四级目录  四级目录需要三个参数
    $scope.fromEighthToForth = function (sd, sname, tname) {
      $state.go("addnewpersonforth", {
        "contactId": sd,
        "secondname": sname,
        "thirdname": tname,
        "createtype":$scope.createType,
        "groupid": $scope.gourpId,
        "groupname":$scope.groupName
      });
    };

    //从七级目录到三级目录  三级目录需要两个个参数


    $scope.fromEighthToThird = function (sd, sname) {
      $state.go("addnewpersonthird", {
        "contactId": sd,
        "secondname": sname,
        "createtype":$scope.createType,
        "groupid": $scope.gourpId,
        "groupname":$scope.groupName
      });
    };

    //从七级目录到二级目录  二级目录需要1个参数

    $scope.fromEighthToSecond = function (sd) {
      $state.go("addnewpersonsecond", {
        "contactId": sd,
        "createtype":$scope.createType,
        "groupid": $scope.gourpId,
        "groupname":$scope.groupName
      });
    };

    $scope.backSeventh=function () {
      $ionicHistory.goBack();

    }
  })








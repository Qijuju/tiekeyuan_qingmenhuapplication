/**
 * Created by Administrator on 2016/9/2.
 */
angular.module('selectothergroup.controllers', [])

  .controller('addNewPersonfifthCtrl', function ($scope,$state, $stateParams,$contacts,$ionicHistory,$greendao,$ToastUtils,$ionicPopup,$api,$rootScope) {

    //创建的类型看到底是从哪里过来的
    $scope.createType=$stateParams.createtype;

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
          $greendao.queryData("SelectIdService", 'where grade =?', "5",function (data) {
            if(data.length>0){

              //然后把等于3的都删除了
              for(var k=0;k<data.length;k++){
                $greendao.deleteObj('SelectIdService',data[k],function (data) {

                },function (err) {

                })
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
                  deptSaveId.type='dept'
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
                $greendao.queryData('SelectIdService','where grade <>?', "5",function (data) {

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
                      $rootScope.isGroupSend ='true'
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


    }




























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


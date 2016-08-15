/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('search.controllers', [])
  .controller('searchCtrl',function ($scope, $http, $state, $stateParams, $timeout,$ionicBackdrop,$rootScope,$mqtt,$search111,$ionicPopup,$search222,$searchdata,$api,$ionicActionSheet,$phonepluin,$searchdatadianji,$ionicHistory,$ToastUtils,$saveMessageContacts) {

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
        $scope.phoneattention=$searchdatadianji.getPersonDetaildianji().Mobile;
        $scope.nameattention=$searchdatadianji.getPersonDetaildianji().UserName;
        $scope.idattention=$searchdatadianji.getPersonDetaildianji().UserID;

        $scope.createchat = function (id,phone, name) {
          $saveMessageContacts.saveMessageContacts(id,phone,name);

          $rootScope.isPersonSend = 'true';
          alert(id + name);
          $state.go('tab.message', {
            "id": id,
            "sessionid": name
          });
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
              }else {
                $ToastUtils.showToast("电话号码为空");
              }
            }else if(index==1){
              $scope.createchat($scope.idattention,$scope.phoneattention,$scope.nameattention);
            }else {
              if ($scope.phoneattention!=""){
                $phonepluin.sms($scope.idattention,$scope.phoneattention, $scope.nameattention, 1);
              }else {
                $ToastUtils.showToast("电话号码为空");
              }
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



    //点击人员进入人员详情
    $scope.goSearchDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });

    };

    //当点击取消时候执行
    $scope.searchBack=function () {
      $ionicHistory.goBack();
    };

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


  .controller('searchLocalCtrl',function ($scope, $http, $state, $stateParams, $timeout,$ionicBackdrop,$rootScope,$mqtt,$searchlocal,$ionicActionSheet,$phonepluin) {

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

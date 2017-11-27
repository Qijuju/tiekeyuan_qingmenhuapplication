/**
 * Created by bim on 2017/11/16.
 */
/**
 * 描述：联系人功能模块
 */
angular.module('contacts.controller', [])
//常用联系人
  .controller('TopContactsCtrl', function ($scope, $contacts, $state) {

    //调用service层的常用联系人列表
    $contacts.topContactsInfo();
    $scope.$on('topcontacts.update', function (event) {
      $scope.$apply(function () {
        $scope.topall = $contacts.getTopContactsInfo();
      });
    });


    //跳转联系人详情界面
    $scope.topContactGoDetail = function (userID) {

      $state.go('person', {
        userId: userID
      });
    };

    //滑动删除常用联系人
    $scope.deleteTopCotacts = function (id) {

      cordova.plugins.CordovaSqlitePlugin.deleteContactPersonWithDict({"_id": id}, function (data) {

        $contacts.topContactsInfo();
        $rootScope.$broadcast('topcontacts.update');
      }, function (error) {

      });
    };
  })

  //联系人模块
  .controller('ContactsCtrl', function ($scope, $state, $http, $SPUtils, $formalurlapi, $publicionicloading, $contacts,$toastutils) {

    document.addEventListener('deviceready', function () {
      $SPUtils.getLoginInfo(function (success) {
        $publicionicloading.showloading();
        $scope.mydeptid = success.user.deptid;
        // $scope.mydeptname = success.user.rootDeptName;
        $scope.loginid = success.user.id;
        var imCode=success.mepId;
        //获取根部门信息
        $http({
          method: 'post',
          url: $formalurlapi.getBaseUrl(),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
            "Action": "GetRootDepartment",
            "objId": $scope.loginid,
            "id": $scope.loginid,
            "idType": 'U',
            "mepId": imCode
          }
        }).success(function (msg) {
          var msg = JSON.parse(decodeURIComponent(msg));
          $scope.depts = msg.Event;
          $publicionicloading.hideloading();
        }).error(function (err) {
          $publicionicloading.hideloading();
          $toastutils.showToast(err.toString(),'0');

        });

        //联系人跳转至二级目录，新增一个变量
        $scope.gogosecond = function (id,name) {

          $state.go("second", {
            "contactId": id,
            "contactName": name//$scope.mydeptname
          });
          //,{reload:true});
        }

        //常用联系人
        $contacts.topContactsInfo();
        $scope.$on('topcontacts.update', function (event) {
          $scope.$apply(function () {
            $scope.topContactsInfo = $contacts.getTopContactsInfo();
          });
        });


        //跳转联系人详情界面
        $scope.ContactGoDetail = function (userID) {
          $state.go('person', {
            userId: userID
          });
        };

      }, function (err) {
      });
    });


    //-----------------------------------------手机通讯录------------------------------------//
    /**
     * 公共方法：用户有权限以后,再访问本地通讯录
     * 1.showloading
     * 2.查询数据成功以后关闭loading
     */
    $scope.openLocalContacts = function () {
      $publicionicloading.showloading();
      cordova.plugins.CordovaPluginPhoneNumber.getAllPeopleContactsArray(function (success) {
        $publicionicloading.hideloading();
        if (success.allPeople.length > 0) {
          $state.go('localContacts');
        }
      }, function (error) {
        $publicionicloading.hideloading();
      });
    }

    /**手机通讯录**/
    $scope.goLocalContact = function () {

      $SPUtils.getStr('allowcontact', function (succ) {

        if (succ === null) {

          //判断用户是否有访问通讯录的权限
          cordova.plugins.CordovaPluginPhoneNumber.requestAuthorizationAddressBook(function (data) {

            $SPUtils.saveStr('allowcontact', data, function (success) {
              $scope.openLocalContacts();
            }, function (err) {
            });
          }, function (error) {

            $toastutils.showToast('不能访问手机通讯录','0');

          });
        } else {
          $scope.openLocalContacts();
        }

      }, function (err) {

      });
    }


    //联系人模块搜索
    $scope.goSearchcontacts = function () {
      $scope.a = false;
      $state.go("searchmessage", {
        "UserIDSM": $scope.localuserId,
        "UserNameSM": $scope.localuserName
      });
    }

  })

  /**我的群组控制器**/
  .controller('GroupCtrl', function ($scope, $publicionicloading, $ionicHistory, $http, $formalurlapi, $SPUtils, $state) {
    $scope.backAny = function () {
      $ionicHistory.goBack();
    };
    document.addEventListener('deviceready', function () {
      //获取当前登录用户信息
      $SPUtils.getLoginInfo(function (userinfo) {
        $scope.userId = userinfo.user.id;
        $scope.userName = userinfo.user.displayName;
        //获取当前用户的所在群信息
        $scope.deptid = userinfo.user.deptid;
        $scope.deptname = userinfo.user.deptName;
        var imCode = userinfo.mepId;
        //通过接口取出当前用户所在的所有群信息
        $http({
          method: 'post',
          url: $formalurlapi.getBaseUrl(),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
            "Action": "GetAllGroup",
            "id": $scope.userId,
            "mepId": imCode
          }
        }).success(function (allgroupinfo) {
          var allgroupinfo = JSON.parse(decodeURIComponent(allgroupinfo));
          $scope.grouplist = allgroupinfo.Event;
          $scope.ismycreat = 0;
        }).error(function (err) {

        });
      }, function (err) {

      });

      //点击我创建的群进入群聊
      $scope.goCreateGroup = function (id, name, ismygroup) {
        $state.go('messageGroup', {
          "id": id,
          "chatName": name,
          "grouptype": "Group",
          "ismygroup": ismygroup
        });
      }
      //点击部门群进入群聊
      $scope.goDepartmentGroup = function (id, name, ismygroup) {
        $state.go('messageGroup', {
          "id": id,
          "chatName": name,
          "grouptype": "Dept",
          "ismygroup": ismygroup
        });
      }

      //点击我加入的群进入群聊
      $scope.goJoinGroup = function (id, name, ismygroup) {
        $state.go('messageGroup', {
          "id": id,
          "chatName": name,
          "grouptype": "Group",
          "ismygroup": ismygroup
        });
      }

      //创建群聊的function
      $scope.createGroupChats = function () {

        //点击创建聊天时，先清空select表数据(选择群成员时入库)
        cordova.plugins.CordovaSqlitePlugin.deleteAllGroupIDS(function (succ) {
          var selectInfo = {};
          //当创建群聊的时候先把登录的id和信息  存到数据库上面
          selectInfo._id = $scope.userId;
          selectInfo.name = $scope.userName;
          selectInfo.grade = "0";
          selectInfo.isselected = true;
          selectInfo.type = 'User';
          selectInfo.parentid = $scope.deptid;
          cordova.plugins.CordovaSqlitePlugin.addGroupIDSWithDict(selectInfo, function (succ) {
            $state.go('addnewpersonfirst', {
              "createtype": 'single',
              "groupid": '0',
              "groupname": '',
              "functiontag": "groupchat"
            });
          }, function (err) {
          });
        }, function (err) {
        });
      }
    })
  })

  /**联系人---二级~八级目录**/
  .controller('ContactSecondCtrl', function ($scope, $state, $ionicScrollDelegate, $SPUtils, $publicionicloading, $http, $formalurlapi, $stateParams) {
    var pageNo=1;
    var allContactArray;

    $scope.secondStatus=true;
    //返回联系人主界面
    $scope.goPrevious = function () {
      $state.go("tab.contacts");
    };

    //跳转联系人详情界面
    $scope.goPersonDetail = function (userID) {
      $state.go('person', {
        userId: userID
      });
    };

    allContactArray=function () {

      // $scope.secondStatus=false;
      $SPUtils.getLoginInfo(function (success) {
        console.log('请求数据的第'+ pageNo+'页数据' );
        var myDeptName='';
        if ($stateParams.contactName==='我的部门'){
          myDeptName=success.deptName;
        }else {
          myDeptName=$stateParams.contactName;
        }

        $publicionicloading.showloading();
        $scope.userid = success.user.id;
        var mepId=success.mepId;
        //获取一级部门的组织机构列表
        $http({
          method: 'post',
          url: $formalurlapi.getBaseUrl(),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
            "Action": "GetChilds",
            "deptId": $stateParams.contactId,
            "pageNo": pageNo,
            "pageSize": 100,
            "id": $scope.userid,
            "mepId": mepId
          }
        }).success(function (succ) {
          var succ = JSON.parse(decodeURIComponent(succ));
          $scope.departlist = succ.Event.depts;
          $scope.userlist = succ.Event.users;
          //添加一级部门指示标
          $scope.docList.push({
            index: 0,
            deptId: $stateParams.contactId,
            deptName: myDeptName  //$stateParams.contactName
          });
          //界面主题名字(取出导航栏上一级目录存的deptname)
          $scope.deptinfo = $scope.docList[$scope.docList.length - 1].deptName;
          viewScroll.scrollTop();

          // $scope.secondStatus=true;

          $publicionicloading.hideloading();

        }).error(function (err) {
          $publicionicloading.hideloading();
        });

      }, function (err) {

      });
    };

    var viewScroll = $ionicScrollDelegate.$getByHandle('scrollTop');
    $scope.docList = [];
    document.addEventListener('deviceready', function () {

      allContactArray();

    });

    //控制列表是否允许其加载更多
    $scope.moreDataCanBeLoaded = function () {
      return $scope.secondStatus;
    }

    $scope.loadMoreSecond=function () {
      if( !$scope.secondStatus){
        $scope.$broadcast('scroll.infiniteScrollComplete');
        return;
      }

      pageNo++;
      allContactArray();

    };

    //获取多级部门
    $scope.switchData = function (deptId, deptName, isIndicate) {
      pageNo=1;
      $publicionicloading.showloading();
      var isLoadSuccess = false;
      //添加N级部门指示标
      if (!isIndicate) {
        $scope.docList.push({
          index: $scope.docList.length,
          deptId: deptId,
          deptName: deptName
        });

      }

      $scope.departlist = [];
      $scope.userlist = [];
      //获取多级部门下的部门列表
      $SPUtils.getLoginInfo(function (success) {

        var mepId=success.mepId;

        $http({
          method: 'post',
          url: $formalurlapi.getBaseUrl(),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
            "Action": "GetChilds",
            "deptId": deptId,
            "pageNo": pageNo,
            "pageSize": 100,
            "id": $scope.userid,
            "mepId": mepId//window.device.uuid
          }
        }).success(function (succ) {
          var succ = JSON.parse(decodeURIComponent(succ));
          $scope.departlist = succ.Event.depts;
          $scope.userlist = succ.Event.users;
          viewScroll.scrollTop();
          isLoadSuccess = true;
          //界面主题名字(取出导航栏上一级目录存的deptname)
          $scope.deptinfo = $scope.docList[$scope.docList.length - 1].deptName;

          // $scope.$broadcast('scroll.infiniteScrollComplete');
          // pageNo++;
          // if($scope.departlist.length+$scope.userlist.length<10){
          //     console.log('不加载');
          //     $scope.secondStatus=false;
          //
          // }else {
          //     console.log('加载');
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.secondStatus=true;

          // }

          $publicionicloading.hideloading();
        }).error(function (err) {
          $publicionicloading.hideloading();
        });
      },function (error) {

      });
    };

    //从部门导航切换数据
    $scope.switchIndicate = function (item) {
      var index = item.index;

      if ($scope.docList.length - index - 1 > 0) {
        $scope.docList.splice(index + 1, $scope.docList.length - index - 1);
      }
      $scope.switchData(item.deptId, item.deptName, true);
    };

  })

  //特别关注模块控制器
  .controller('myattentionaaaSelectCtrl', function ($scope, $state, $publicionicloading, $SPUtils, $http, $rootScope, $formalurlapi) {

    var tempArr=[];
    $scope.$on('attention.update', function (event) {
      $publicionicloading.hideloading();
      $scope.contactsListatten = $scope.attentionlist;
    });


    document.addEventListener('deviceready', function () {
      $publicionicloading.showloading();
      //获取当前用户的id
      $SPUtils.getLoginInfo(function (msg) {
        $scope.myid = msg.user.id;
        var imCode=msg.mepId;
        //从服务器端获取特别关注列表
        $http({
          url: $formalurlapi.getBaseUrl(),
          method: 'post',
          data: {
            "id": $scope.myid,
            "mepId":imCode,
            "Action": "GetAttention"

          }
        }).success(function (attenionlist) {
          $publicionicloading.hideloading();
          var attenionJSON = JSON.parse(decodeURIComponent(attenionlist));
          tempArr=attenionJSON.user;
          $scope.attentionlist =tempArr;

          $rootScope.$broadcast('attention.update');
        }).error(function (err) {
          $scope.attentionlist = '';
          $rootScope.$broadcast('attention.update');
        });
      }, function (err) {
      });

    });

    //点击人员进入人员详情
    $scope.jumpattenDetial = function (id) {
      $state.go("person", {
        "userId": id
      });
    };

    //取消特别关注
    $SPUtils.getLoginInfo(function (msg) {

      var imCode = msg.mepId;
      $scope.removeattention = function (id) {

        var membersAerr = [];
        membersAerr.push(id);
        $http({
          url: $formalurlapi.getBaseUrl(),
          method: 'post',
          data: {
            "id": $scope.myid,
            "Action": "RemoveAttention",
            "mepId": imCode,
            "members": membersAerr
          }
        }).success(function (succ) {
          var succJSON = JSON.parse(decodeURIComponent(succ));

          if (succJSON.Succeed) {
            for(var i=0;i<tempArr.length;i++){

              if(tempArr[i].id==id){

                tempArr.splice(i,1);
              }
            }

            $scope.attentionlist =tempArr;
            $rootScope.$broadcast('attention.update');

          }

        }).error(function (err) {
          $scope.persondsfs.isAttenttion = isAttenttion ? "true" : "false";
        });
      };
    },function (error) {

    });
  })

  //个人详情控制器
  .controller('PersonCtrl', function ($scope, $stateParams, $SPUtils, $http, $formalurlapi, $rootScope, $publicionicloading, $state, $ionicHistory,$toastutils,$toastutils) {

    // Setup the loader
    $publicionicloading.showloading();

    //获取当前登陆用户的id
    document.addEventListener('deviceready', function () {
      $scope.userId = $stateParams.userId;
      //头像是否有更改，默认为false(未变动)
      $scope.picyoumeiyoudet = false;
      $SPUtils.getLoginInfo(function (msg) {
        $scope.myid = msg.user.id;
        var imCode = msg.mepId;
        //根据传进来的用户id获取用户个人信息
        $http({
          url: $formalurlapi.getBaseUrl(),
          method: 'post',
          data: {
            "Action": "GetUser",
            "id": $scope.myid,
            "userId": $scope.userId,
            "mepId": imCode
          }
        }).success(function (userInfo) {
          var userInfo = JSON.parse(decodeURIComponent(userInfo));
          $publicionicloading.hideloading();
          $scope.userinfo = userInfo;
          $rootScope.$broadcast('personDetail.update');
        }).error(function (err) {
          $publicionicloading.hideloading();
          $toastutils.showToast('请求个人信息失败！','0');

        });
      }, function (err) {
      });


      //调用打电话功能，并且会存到数据库里面
      $scope.detailCall = function (id, phone, name, type) {
        //常用联系人的count
        cordova.plugins.CordovaSqlitePlugin.updateAddCountWithDict({
          "_id": $scope.userId,
          "name": name,
          "userID": $scope.userId,
          "phone": phone
        }, function (success) {

        }, function (error) {

        });

        if ($scope.myid == $scope.userId) {
          $toastutils.showToast('无法对自己进行该项操作', '1');

        } else {
          if (phone != "") {
            cordova.plugins.CallNumberPlugin.callNumber(phone, function (success) {
              }, function (error) {

              }
            );
          } else {
            $toastutils.showToast('电话为空！','0');
          }
        }
      }


      //发短信 也会把存入数据库  传入类型的原因是 type 只是存 通过组织架构拨打出去的电话和人
      $scope.detailSendSms = function (id, phone, name, type) {
        //常用联系人的count
        cordova.plugins.CordovaSqlitePlugin.updateAddCountWithDict({
          "_id": $scope.userId,
          "name": name,
          "userID": $scope.userId,
          "phone": phone
        }, function (success) {


        }, function (error) {

        });
        if ($scope.myid == $scope.userId) {
          $toastutils.showToast('无法对自己进行该项操作！','0');

        } else {
          if (phone != "") {

            // $phonepluin.sms(id, phone, name, type);
            cordova.plugins.IMSendMessagePlugin.sendMessage([phone], "", function (successs) {
            }, function (error) {

            });
          } else {
            $toastutils.showToast('电话为空！','0');

          }
        }

      };


      //把联系人存入本地
      $scope.insertPhone = function (name, phone) {
        if ($scope.myid == $scope.userId) {
          $toastutils.showToast('无法对自己进行该项操作！','0');

        } else {
          if (name != null && phone != null) {

            var myContact = navigator.contacts.create({"displayName": name});
            var phoneNumbers = [];
            //work  768-555-1234 手机号
            phoneNumbers[0] = new ContactField('work', phone, false);
            phoneNumbers[1] = new ContactField('mobile', '999-555-5432', true); // preferred number
            phoneNumbers[2] = new ContactField('home', '203-555-7890', false);

            myContact.phoneNumbers = phoneNumbers;
            myContact.save(function (contact_obj) {
              var contactObjToModify = contact_obj.clone();
              contact_obj.remove(function () {
                var phoneNumbers = [contactObjToModify.phoneNumbers[0]];
                contactObjToModify.phoneNumbers = phoneNumbers;
                contactObjToModify.save(function (c_obj) {
                  $toastutils.showToast('保存成功','0');

                }, function (error) {
                  console.log("Not able to save the cloned object: " + error);
                });
              }, function (contactError) {
                console.log("Contact Remove Operation failed: " + contactError);
              });
            });
          } else {
            $toastutils.showToast('姓名或者电话为空','0');

          }
        }

      };
    });

    $scope.$on('personDetail.update', function (event) {
      // $scope.$apply(function () {
      $publicionicloading.hideloading();
      $scope.persondsfs = $scope.userinfo;

      if ($scope.persondsfs.Event.displayName.length > 2) {
        $scope.simpleName = $scope.persondsfs.Event.displayName.substr(($scope.persondsfs.Event.displayName.length - 2), $scope.persondsfs.Event.displayName.length);
      } else {
        $scope.simpleName = $scope.persondsfs.Event.displayName;
      }
      // })
    });


    $scope.backAny = function () {

      $ionicHistory.goBack();

    };

    //取消关注
    $scope.changeAttentionStatus = function (id, isAttenttion) {

      $SPUtils.getLoginInfo(function (logininfo) {

        var imCode = logininfo.mepId;

        $scope.persondsfs.isAttenttion = isAttenttion ? "false" : "true";
        if ($scope.myid == $scope.userId) {
          $toastutils.showToast('无法对自己进行该项操作', '0');

        } else {
          var membersArr = [];
          membersArr.push(id);
          if (isAttenttion) {
            $http({
              url: $formalurlapi.getBaseUrl(),
              method: 'post',
              data: {
                id: $scope.myid,
                Action: "RemoveAttention",
                mepId: imCode,
                members: membersArr
              }
            }).success(function (succ) {
              var succJSON = JSON.parse(decodeURIComponent(succ));

            }).error(function (err) {

              $scope.persondsfs.isAttenttion = isAttenttion ? "true" : "false";
            });
          } else {
            var membersArr = [];
            membersArr.push(id);
            $http({
              url: $formalurlapi.getBaseUrl(),
              method: 'post',
              data: {
                id: $scope.myid,
                Action: "AddAttention",
                mepId: imCode,
                members: membersArr
              }
            }).success(function (succ) {
              var succJSON = JSON.parse(decodeURIComponent(succ));
            }).error(function (err) {

              $scope.persondsfs.isAttenttion = isAttenttion ? "true" : "false";
            });
          }
        }
      },function (erros) {

      });
    }


    //创建会话
    $scope.createchat = function (id, phone, name) {

      //常用联系人的count
      cordova.plugins.CordovaSqlitePlugin.updateAddCountWithDict({
        '_id': $scope.userId,
        'name': name,
        'userID': $scope.userId,
        'phone': phone
      }, function (success) {

      }, function (error) {

      });


      if (id == "" || id == null || name == "" || name == null) {
        $toastutils.showToast('当前用户信息不全','0');

      } else {
        //统计常用联系人次数
        // $saveMessageContacts.saveMessageContacts(id,phone,name);
        // $ToastUtils.showToast("进来创建聊天");
        $rootScope.isPersonSend = 'true';
        if ($scope.myid == $scope.userId) {

          $toastutils.showToast('无法对自己进行该项操作','1');

        } else if (id === null || name === null || id === '' || name === '') {
          $toastutils.showToast('当前用户信息不全','0');

        } else {
          //统计常用联系人次数
          $state.go('messageDetail', {
            "id": id,
            "ssid": name,
            "grouptype": 'User'
          });
        }
      }
    }

  });

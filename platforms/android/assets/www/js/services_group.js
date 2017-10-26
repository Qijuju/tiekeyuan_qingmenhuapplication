/**
 * Created by Administrator on 2016/8/17.
 */
angular.module('group.services', [])

.factory('$group',function ($api,$rootScope,$timeout,$ToastUtils) {

  var allGroup=[];
  var groupDetails;

  return{
    allGroup:function () {
      $api.getAllGroup(function (msg) {

        allGroup=msg.groupList


        $rootScope.$broadcast('group.update');

      },function (err) {
        $timeout(function () {
          allGroup = null;
          $rootScope.$broadcast('group.update');
          $ToastUtils.showToast("获取数据失败")
        },5000);
      });
    },

    getAllGroup:function () {
      return allGroup;
    },


    groupDetail:function (type,id,typelist) {

      $api.getGroupUpdate(type,id,typelist,function (msg) {
        groupDetails=msg;
        $rootScope.$broadcast('groupdetail.update');

      },function (err) {
        $timeout(function () {
          groupDetails = null;
          $rootScope.$broadcast('groupdetail.update');
          $ToastUtils.showToast(err)
        },5000);

      })
    },

    getGroupDetail:function () {
      return groupDetails;
    },
  }

})

.factory('$notify',function ($api,$rootScope,$timeout,$ToastUtils) {

  var defaultCount=1;
  var allNotify;
  var defaultNumber=5;

  return{

    allNotify:function () {
      $api.getNotifyMsg('A', false, '', defaultCount, defaultNumber, function (msg) {
        allNotify=msg;
        $rootScope.$broadcast('allnotify.update');
        defaultCount++;
      }, function (err) {
        $ToastUtils.showToast(err)
        $rootScope.$broadcast('allnotify.update.error');

      });
    },


    clearDefaultCount:function () {
      defaultCount=1;
    },



    getAllNotify:function () {
      return allNotify;
    },


  }

});



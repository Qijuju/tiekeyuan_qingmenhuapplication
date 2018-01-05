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
        allGroup=msg.groupList;
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
    }
  }
})

.factory('$notify',function ($api,$rootScope,$timeout,$ToastUtils,$http,$formalurlapi) {

  var defaultCount=1;
  var defaultCount2=1;
  var allNotify;
  var allAttentionNotify;
  var defaultNumber=5;
  var defaultAttentionCount=1;
  var allApplications = [];

  return{
    allNotifications:function (userID,imcode) { // 调接口，获取全部的通知数据
        $http({
          method: 'post',
          timeout: 5000,
          url:$formalurlapi.getBaseUrl(),
          data:{
            Action:"GetExtMsg",
            id:userID,
            mepId:imcode,
            date:"A",
            isAttention:false,
            pageNo:defaultCount2,
            pageSize:defaultNumber
          }
        }).success(function (data, status) {

          allApplications=JSON.parse(decodeURIComponent(data)).msgList;
          $rootScope.$broadcast('allNotifications.update','');
          defaultCount2++;
        }).error(function (data, status,err) {
          $ToastUtils.showToast(err);
          $rootScope.$broadcast('allNotifications.update.error');
        });
      },
    getAllNotifications:function () { // 返回全部通知数据
      return allApplications;
    },
    getAttentionNotify:function (userID,imcode) { // 调接口，获取关注的列表数据

      $http({
        method: 'post',
        timeout: 5000,
        url:$formalurlapi.getBaseUrl(),
        data:{
          Action:"GetExtMsg",
          id:userID,
          mepId:imcode,
          date:"A",
          isAttention:true,
          pageNo:defaultAttentionCount,
          pageSize:defaultNumber
        }
      }).success(function (data, status) {

        allAttentionNotify  =JSON.parse(decodeURIComponent(data)).msgList;
        $rootScope.$broadcast('attention.update');
        defaultAttentionCount++;
      }).error(function (data, status,err) {
        $ToastUtils.showToast(err);
        $rootScope.$broadcast('attention.update.error');
      });
    },

    clearDefaultCount:function () {
      defaultCount=1;
      defaultCount2=1;
    },
    clearDefaultAttentionCount:function () {
      defaultAttentionCount=1;
    },


    getAllNotify:function () {
      return allNotify;
    },

    getAllAttentionNotify:function () {
      return allAttentionNotify;
    }
  }
})




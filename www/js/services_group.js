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
    },
  }

})

.factory('$notify',function ($api,$rootScope,$timeout,$ToastUtils,$http,$formalurlapi) {

  var defaultCount=1;
  var allNotify;
  var attentionNotify;
  var defaultNumber=5;
  var defaultAttentionCount=1;

  return{
   // 通过封装的插件调取接口，修改了字段的大小写以及获取的字段的个数
   /* allNotify:function () {
      $api.getNotifyMsg('A', false, '', defaultCount, defaultNumber, function (msg) {
        allNotify=msg;
        $rootScope.$broadcast('allnotify.update');
        defaultCount++;
      }, function (err) {
        $ToastUtils.showToast(err);
        $rootScope.$broadcast('allnotify.update.error');

      });
    }, */
    // 直接通过http请求拿数据，字段展示形式和后台一致
    allNotify:function (userID,imcode) {
      console.log("allNotify接口被调用了--全部通知" + userID +"--" +imcode + "--" + $formalurlapi.getBaseUrl());
        $http({
          method: 'post',
          timeout: 5000,
          url:$formalurlapi.getBaseUrl(),
          data:{Action:"GetExtMsg",id:userID,mepId:imcode,date:"A",isAttention:false,pageNo:defaultCount,pageSize:defaultNumber}
        }).success(function (data, status) {
          console.log("allNotify接口返回数据---全部通知：" + JSON.stringify(decodeURIComponent(data)));
          // allNotify=data;
          // $rootScope.$broadcast('allnotify.update');
          // defaultCount++;
        }).error(function (data, status) {
          // $ToastUtils.showToast(err);
          // $rootScope.$broadcast('allnotify.update.error');
        });
      },
    //获取关注列表
    getAttentionNotify:function () {
      $api.getNotifyMsg('A',true, '', defaultAttentionCount, defaultNumber, function (data) {
        attentionNotify=data;
        $rootScope.$broadcast('attention.update');
        defaultAttentionCount++;
      }, function (err) {
        $ToastUtils.showToast(err);
        $rootScope.$broadcast('attention.update');

      });
    },

    clearDefaultCount:function () {
      defaultCount=1;
    },
    clearDefaultAttentionCount:function () {
      defaultAttentionCount=1;
    },


    getAllNotify:function () {
      console.log("getAllNotify返回通知全部数据源方法被调用了----全部通知");
      return allNotify;
    },

    getAllAttentionNotify:function () {
      return attentionNotify;
    }
  }
})




/**
 * Created by Administrator on 2016/8/17.
 */
angular.module('group.services', [])

.factory('$group',function ($api,$rootScope) {

  var allGroup=[];
  var isMyCreate;
  var count=0;
  var groupDetails;

  return{
    allGroup:function () {
      $api.getAllGroup(function (msg) {

        allGroup=msg.groupList
        for(var i=0; i<allGroup.length;i++){
          if(allGroup[i].isMyGroup==true){
              count++;
              isMyCreate=count;
          }
        }

        $rootScope.$broadcast('group.update');

      },function (err) {

      });
    },

    getAllGroup:function () {
      return allGroup;
    },

    getCreateCount:function () {
      return isMyCreate;
    },


    groupDetail:function (type,id,typelist) {

      $api.getGroupUpdate(type,id,typelist,function (msg) {
        groupDetails=msg;
        $rootScope.$broadcast('groupdetail.update');

      },function (err) {


      })
    },

    getGroupDetail:function () {
      return groupDetails;
    }















  }

});



/**
 * Created by Administrator on 2016/8/17.
 */
angular.module('group.services', [])

.factory('$group',function ($api,$rootScope) {

  var allGroup=[];

  return{
    allGroup:function () {
      $api.getAllGroup(function (msg) {

        allGroup=msg.groupList

        $rootScope.$broadcast('group.update');

      },function (err) {

      });
    },

    getAllGroup:function () {
      return allGroup;
    }
  }

});



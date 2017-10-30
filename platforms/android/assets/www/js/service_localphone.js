/**
 * Created by Administrator on 2016/9/9.
 */
angular.module('localphone.services', [])

  .factory('localContact',function ($rootScope,$greendao,$api) {

    var contactPlugin
    document.addEventListener('deviceready',function () {
      contactPlugin=cordova.require('localContact.localContact');

    });
    return{
      getContact:function () {

        contactPlugin.getLocalContactsInfos("",function (message) {

          //开始构造数据，然后再去调用接口的方法

          $greendao.loadAllData("LocalPhoneService",function (msg) {

          var replyList=[];
          var newList=[];

          var lastList=msg;

           for(var i=0;i<msg.length;i++){
             var reply={};
             reply.id=msg[i].id;
             reply.phone=msg[i].phonenumber;
             replyList.push(reply);

           }

            $api.checkLocalUser(replyList,function (msg) {
              //拿到的msg是一个集合
              for(var j=0;j<msg.length;j++){
                if(msg[j].Flag==true){
                  newList.push(msg[j])
                }
              }

              //然后更新数据库
              for(var m=0;m<newList.length;m++){
                for(var n=0;n<lastList.length;n++){

                  if(newList[m].AppsID==lastList[n].id){
                    var newobj={};
                    newobj.id=newList[m].AppsID;
                    newobj.isplatform=true;
                    newobj.name=lastList[n].name;
                    newobj.phonenumber=lastList[n].phonenumber;
                    newobj.pinyinname=lastList[n].pinyinname;
                    newobj.platformid=newList[m].UserID;

                    $greendao.saveObj("LocalPhoneService",newobj,function (msg) {
                      console.log("入库数据"+JSON.stringify(msg));
                    },function (err) {

                    })
                  }
                }

              }

              $rootScope.$broadcast('im.back');
            },function (err) {
              $rootScope.$broadcast('im.wrong');
            })
          },function (err) {
            $rootScope.$broadcast('im.wrong');
          })
        },function (message) {

          $rootScope.$broadcast('im.wrong');
        });
      },

    }

  })


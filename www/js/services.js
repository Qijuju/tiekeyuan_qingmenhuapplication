angular.module('starter.services', [])



  .factory('Count',function () {
    return{
      count:1
    };
  })

  .factory('contactService',function ($http) {

    var contacts= [];
    var people=[];

    return{

        //联系人目录
        getContacts:function () {



          return $http.get("http://61.237.239.144/baseservice/rest/login/getdepartmentlist1?nodetype=2&nodeparentid=279").then(function(response) {
            contacts = response.data;
            return response.data;
          });

        },


        getContactById:function (contactId) {

          for (var i=0;i<contacts.length;i++){
            if(contacts[i].deptid===contactId){
              return contacts[i];
            }
          }
            return null;
        },

        getParentById:function (contact) {

          for (var i=0;i<contacts.length;i++){
            if(contacts[i].deptid===contact.parentdeptid){
              return contacts[i];
            }
          }
          return null;
        },


        getContactThirdById:function (contactId) {
          return $http.get("http://61.237.239.144/baseservice/rest/login/getUserinfoByDepid?depid="+contactId+"&isall=0&token=jfie&pageno=1&pagesize=25").then(function(response) {
            people = response.data;
            return response.data;
          });

        },

        getDetailContactById:function (contactId) {
          for (var i=0;i<people.length;i++){
            if(people[i].id===contactId){
              return people[i];
            }
          }
          return null;
        }






    }

  })

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})




  .factory('$mqtt',function ($rootScope,$greendao) {
    var mqtt;
    var msgs=new Array();
    var groupMsgs=new Array();
    var lastMsgs=new Array();
    var size;
    var count = 0;
    var groupCount=0;
    var isLogin = false;

    document.addEventListener('deviceready',function () {
      mqtt = cordova.require('MqttChat.mqtt_chat');
    });
    return{

      startMqttChat:function(topics){
        document.addEventListener('deviceready',function () {
          mqtt.startMqttChat(topics,function (message) {
          },function (message) {
          });
        });
        return -1;
      },


      getMqtt:function(){
        return mqtt;
      },


      sendMsg:function (topic,content,id) {
        var messageDetail={};
        messageDetail._id=id;
        messageDetail.account='6698';
        messageDetail.sessionid=topic;
        messageDetail.type='User';
        messageDetail.from='true';
        messageDetail.message=content;
        messageDetail.messagetype='normal';
        messageDetail.platform='Windows';
        messageDetail.when='lll';
        messageDetail.isFailure='false';

        mqtt.sendMsg(topic, messageDetail, function (message) {
          // msgs.push(messageDetail);
          $greendao.saveObj('MessagesService',messageDetail,function (data) {
            // alert(data);
          },function (err) {
            alert(err+"sendmistake");
          });
          // messages.addMsgs(messageDetail);
          $rootScope.$broadcast('msgs.update');
          return "成功";
        },function (message) {
          messageDetail.isFailure='true';
          // msgs.push(messageDetail);
          $greendao.saveObj('MessagesService',messageDetail,function (data) {
            // alert(data);
          },function (err) {
            // alert(err+"msgerr");
          });
          // messages.addMsgs(messageDetail);
          $rootScope.$broadcast('msgs.error');
          return "失败";
        });
        return "啥也不是";
      },

      arriveMsg:function (topic) {
        mqtt.getChats(topic,function (message) {
          var arriveMessage={};
          arriveMessage._id=message._id;
          arriveMessage.account=message.account;
          arriveMessage.sessionid=message.sessionid;
          arriveMessage.type=message.type;
          arriveMessage.from=message.from;
          arriveMessage.message=message.message;
          arriveMessage.messagetype=message.messagetype;
          arriveMessage.platform=message.platform;
          arriveMessage.when=message.when;
          arriveMessage.isFailure=message.isFailure;
          // msgs.push(arriveMessage);
          $greendao.saveObj('MessagesService',arriveMessage,function (data) {
            // alert(data+"aaaaa");
          },function (err) {
            alert(err+"arrmistake");
          });
          count++;
          $rootScope.$broadcast('msgs.update');

          return size;

        },function (message) {
          return 0;
        });

        return "nihao";
      },

      getMsgCount:function () {
        return count;
      },

      clearMsgCount:function () {
        count=0;
      },


      sendGroupMsg:function (topic,content,id) {
        var messageReal={};
        messageReal._id=id;
        messageReal.account='6698';
        messageReal.sessionid=topic;
        messageReal.type='Group';
        messageReal.from='true';
        messageReal.message=content;
        messageReal.messagetype='normal';
        messageReal.platform='Windows';
        messageReal.when='lll';
        messageReal.isFailure='false';
        // messageReal.topic=topic;
        // messageReal.content=content;
        // messageReal.id=id;
        // messageReal.isFromMe=true;
        // messageReal.isSingle=false;
        mqtt.sendMsg(topic, messageReal, function (message) {
          // msgs.push(messageReal);
          $greendao.saveObj('MessagesService',messageReal,function (data) {
            // alert("群组消息保存成功");
          },function (err) {
            alert("群组消息保存失败");
          });
          // messages.addMsgs(messageReal);
          $rootScope.$broadcast('groupMsgs.update');
          return "成功";
        },function (message) {
          messageReal.isFailure=true;
          groupMsgs.push(messageReal);
          $greendao.saveObj('MessagesService',messageReal,function (data) {
            // alert(data);
          },function (err) {
            // alert(err+"msgerr");
          });
          // messages.addMsgs(messageReal);
          $rootScope.$broadcast('groupMsgs.error');
          return "失败";
        });
        return "啥也不是";
      },

      rececivGroupMsg:function (topic) {

        mqtt.getChats(topic,function (message) {
          if(!(message.id===topic)){

            var messageGroup={};
            messageGroup._id=message._id;
            messageGroup.account=message.account;
            messageGroup.sessionid=message.sessionid;
            messageGroup.type=message.type;
            messageGroup.from=message.from;
            messageGroup.message=message.message;
            messageGroup.messagetype=message.messagetype;
            messageGroup.platform=message.platform;
            messageGroup.when=message.when;
            messageGroup.isFailure='false';
            // msgs.push(messageGroup);
            $greendao.saveObj('MessagesService',messageGroup,function (data) {
              // alert("群组接收消息保存成功");
            },function (err) {
              alert("群组接收消息保存失败");
            });
            // messages.addMsgs(messageGroup);
            groupCount++;
            $rootScope.$broadcast('groupMsgs.update');
            return size;
          }
        },function (message) {
          return 0;
        });

        return "nihao";
      },

      getMsgGroupCount:function () {
        return groupCount;
      },

      clearMsgGroupCount:function () {
        groupCount=0;
      },




      getAllMsg:function () {
        // messages.getMsgsBySingle(function (data) {
        //   $scope.msgs=data;
        // })
        return msgs;
      },

      getAllGroupMsg:function () {
        // messages.getMsgsBySingle(function (data) {
        //   $scope.groupMsgs=data;
        // })
        return msgs;
      },
      disconnect:function (success, error) {
        mqtt.disconnect(success, error);
      },
      save:function (key,value) {
        mqtt.save(key,value);
      },
      getUserInfo:function (success, error) {//获取用户信息（登录之后可以使用该方法）
        mqtt.getUserInfo(success, error);
      },
      setLogin:function (loginStatus) {
        isLogin = loginStatus;
      },
      isLogin:function () {
        return isLogin;
      }


    };
  })

  .factory('$greendao',function () {
    var greendao;
    document.addEventListener('deviceready',function () {
      greendao = cordova.require('GreenDaoPlugin.green_dao_plugin');
    });
    return {
      //
      loadAllData:function (services, success, error) {
        greendao.loadAllData(services, success, error);
      },
      loadDataByArg:function (services,str, success, error) {

      },
      queryData:function (services,where,args, success, error) {
        greendao.queryData(services,where,args, success, error);
      },
      saveObj:function (services,jsonObject, success, error) {
        greendao.saveObj(services,jsonObject, success, error);
      },
      saveDataLists:function (services,arraylist, success, error) {

      },
      deleteAllData:function (services, success, error) {
        greendao.deleteAllData(services, success, error);
      },
      deleteDataByArg:function (services,str, success, error) {

      },
      deleteObj:function (services,jsonObject, success, error) {

      },
      queryMessagelistByIsSingle:function (services,isSingle, success, error) {

      }
    };

  })

.factory('localContact',function ($rootScope) {

  var contactPlugin
  document.addEventListener('deviceready',function () {
    contactPlugin=cordova.require('localContact.localContact');

  });

  var contactsAll=new Array();
  var A=new Array();
  var B=new Array();
  var C=new Array();
  var D=new Array();
  var E=new Array();
  var F=new Array();
  var G=new Array();
  var H=new Array();
  var I=new Array();
  var J=new Array();
  var K=new Array();
  var L=new Array();
  var M=new Array();
  var N=new Array();
  var O=new Array();
  var P=new Array();
  var Q=new Array();
  var R=new Array();
  var S=new Array();
  var T=new Array();
  var U=new Array();
  var V=new Array();
  var W=new Array();
  var X=new Array();
  var Y=new Array();
  var Z=new Array();
  var onsuch=new Array();


  return{
    getContact:function () {

      contactPlugin.getLocalContactsInfos("",function (message) {
        if(message!=null){
          contactsAll=message;
          for(var i=0; i<message.length; i++){

            if (message[i].sortLetters.substring(0,1)==="A"){
              A.push(message[i])
            }else if (message[i].sortLetters.substring(0,1)==="B"){
              B.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="C"){
              C.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="D"){
              D.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="E"){
              E.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="F"){
              F.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="G"){
              G.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="H"){
              H.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="I"){
              I.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="J"){
              J.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="K"){
              K.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="L"){
              L.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="M"){
              M.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="N"){
              N.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="O"){
              O.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="P"){
              P.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="Q"){
              Q.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="R"){
              R.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="S"){
              S.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="T"){
              T.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="U"){
              U.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="V"){
              V.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="W"){
              W.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="X"){
              X.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="Y"){
              Y.push(message[i])

            }else if (message[i].sortLetters.substring(0,1)==="Z"){
              Z.push(message[i])

            }else {
              onsuch.push(message[i])
            }


          }

          $rootScope.$broadcast('im.back');


        }
      },function (message) {


      });
    },


    getAllContacts:function () {

      return contactsAll;
    },

    getA:function () {
      return A;

    },
    getB:function () {
      return B;

    },
    getC:function () {
      return C;

    },
    getD:function () {
      return D;

    },getE:function () {
      return E;

    },getF:function () {
      return F;

    },getG:function () {
      return G;

    },getH:function () {
      return H;

    },getI:function () {
      return I;

    },getJ:function () {
      return J;

    },getK:function () {
      return K;

    },getL:function () {
      return L;

    },getM:function () {
      return M;

    },getN:function () {
      return N;

    },getO:function () {
      return O;

    },getP:function () {
      return P;

    },getQ:function () {
      return Q;

    },getR:function () {
      return R;

    },getS:function () {
      return S;

    },getT:function () {
      return T;

    },getU:function () {
      return U;

    },getV:function () {
      return V;

    },getW:function () {
      return W;

    },getX:function () {
      return X;

    },getY:function () {
      return Y;

    },getZ:function () {
      return Z;

    },getNoSuch:function () {
      return onsuch;

    }



  }





})


  .factory('$phonepluin',function ($greendao) {
    var phonePlugin;
    document.addEventListener('deviceready',function () {
      phonePlugin = cordova.require('PhonePlugin.phoneplugin');

    })

    return{

      call:function (phonenumber,name) {

        var topContacts={};

        topContacts.name=name;
        topContacts.phone=phonenumber;
        topContacts.count="1";
        topContacts._id="2";
        topContacts.when="123"

        $greendao.saveObj('TopContactsService',topContacts,function (data) {

        },function (err) {

        });

        phonePlugin.call(phonenumber,function (message) {
          //alert(phonenumber);
          // $greendao.saveObj('TopContactsService',topContacts,function (data) {
          //
          // },function (err) {
          //
          // });
          alert("成功")
        },function (message) {
          alert("失败")
        });
      },
      sms:function (msg) {
        phonePlugin.sms(msg,function (message) {
          alert("成功")
        },function (message) {
          alert("失败")
        });
      }
    };
  })

.factory('$savaLocalPlugin',function () {
  var SavaLocalPlugin;
  document.addEventListener('deviceready',function () {
    SavaLocalPlugin=cordova.require('SavaLocalPlugin.SavaLocalPlugin');

  });
  return{
    insert:function (name,phonenumber) {
      SavaLocalPlugin.insert(name,phonenumber,function (message) {
        alert("成功")
      },function (message) {
        alert("失败")
      });
    }
  }
})
  .factory('$api', function () {//系统接口。
    var api;
    return {
      init:function () {
        document.addEventListener('deviceready',function () {
          api = cordova.require('ThriftApiClient.thrift_api_client');
        });
      },
      login:function(username,password,imCode, success, error) {
        api.login(username,password,imCode, success, error);
      },
      activeUser:function(userId,imCode, success, error) {
        api.activeUser(userId,imCode, success, error);
      },
      getDatetime:function(userId, success, error) {
        api.getDatetime(userId, success, error);
      },
      seachUsers:function(username,searchText,pageNum,pageCount, success, error) {
        api.seachUsers(username,searchText,pageNum,pageCount, success, error);
      },
      getChild:function(ID,deptID,pageNum,pageCount, success, error) {
        api.getChild(ID,deptID,pageNum,pageCount, success, error);
      },
      getDeparment:function(ID,deptID, success, error) {
        api.getDeparment(ID,deptID, success, error);
      },
      getUserRoot:function(ID, success, error) {
        api.getUserRoot(ID, success, error);
      },
      getUser:function(userID, success, error) {
        api.getUser(userID, success, error);
      },
      updatePwd:function(oldPWD, newPWD, confirmPWD, success, error) {
        api.updatePwd(oldPWD, newPWD, confirmPWD, success, error);
      },
      updateUserInfo:function(newUserInfoObj, success, error) {//newUserInfoObj：这是一个JSONObject
        api.updateUserInfo(newUserInfoObj, success, error);
      }
    };
  });

























;

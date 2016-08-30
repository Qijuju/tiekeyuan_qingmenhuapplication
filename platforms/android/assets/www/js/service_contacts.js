/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('contacts.services', [])

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

  .factory('$phonepluin', function ($greendao) {
    var phonePlugin;
    document.addEventListener('deviceready', function () {
      phonePlugin = cordova.require('PhonePlugin.phoneplugin');

    })

    return {

      call: function (id, phone, name,querytype) {

        if(querytype===1){
          $greendao.queryData("TopContactsService", 'where _id =?', id, function (msg) {
            if (msg.length > 0) {
              //如果大于0说明已经村上去一次
              var queryCount = msg[0].count;
              //取到值后再重新存一次
              var queryTopContact = {};
              queryTopContact._id = msg[0]._id;
              queryTopContact.phone = msg[0].phone;
              queryTopContact.name = msg[0].name;
              queryTopContact.type = msg[0].type;
              queryTopContact.count = queryCount + 1;
              queryTopContact.when = 0;

              $greendao.saveObj('TopContactsService', queryTopContact, function (data) {
              }, function (err) {

              });
            } else {
              //没有查到说明是第一次存到里面
              var fistTopContacts = {};
              fistTopContacts._id = id;
              fistTopContacts.phone = phone;
              fistTopContacts.name = name;
              fistTopContacts.type = "1";  //常用联系人的类型  1 代表打电话
              fistTopContacts.count = 1;
              fistTopContacts.when = 0;

              $greendao.saveObj('TopContactsService', fistTopContacts, function (data) {
              }, function (err) {

              });
            }


          }, function (err) {

          });
        }

        //调用插件的打电话功能
        phonePlugin.call(phone, function (message) {

        }, function (message) {

        });
      },


      // 调用发短信功能 也会存入数据库
      sms: function (id, phone, name,querytype) {
        if (querytype==1){
          $greendao.queryData("TopContactsService", 'where _id =?', id, function (msg) {
            if (msg.length > 0) {
              //如果大于0说明已经存上去一次
              var queryCount = msg[0].count;
              //取到值后再重新存一次
              var queryTopContact = {};

              queryTopContact._id = msg[0]._id;
              queryTopContact.phone = msg[0].phone;
              queryTopContact.name = msg[0].name;
              queryTopContact.type = msg[0].type;
              queryTopContact.count = queryCount + 1;
              queryTopContact.when = 0;

              $greendao.saveObj('TopContactsService', queryTopContact, function (data) {
              }, function (err) {

              });
            } else {
              //没有查到说明是第一次存到里面
              var fistTopContacts = {};
              fistTopContacts._id = id;
              fistTopContacts.phone = phone;
              fistTopContacts.name = name;
              fistTopContacts.type = "2";  //常用联系人的类型  2 代表打电话
              fistTopContacts.count = 1;
              fistTopContacts.when = 0;

              $greendao.saveObj('TopContactsService', fistTopContacts, function (data) {
              }, function (err) {

              });
            }


          }, function (err) {

          });
        }


        //调用发短信的功能
        phonePlugin.sms(phone, function (message) {
          alert("成功")
        }, function (message) {
          alert("电话号码不能为空")
        });
      }


    };
  })

  .factory('$savaLocalPlugin', function () {
    var SavaLocalPlugin;
    document.addEventListener('deviceready', function () {
      SavaLocalPlugin = cordova.require('SavaLocalPlugin.SavaLocalPlugin');

    });
    return {
      insert: function (name, phonenumber) {
        SavaLocalPlugin.insert(name, phonenumber, function (message) {
          alert("成功")
        }, function (message) {
          alert("失败")
        });
      }
    }
  })

  .factory('$contacts', function ($api, $rootScope,$mqtt,$greendao) {

    var loginId;
    var topContactList;
    var rootList = [];
    var deptSecondInfo;
    var deptThirdInfo;
    var deptForthInfo;
    var deptFifhtInfo;
    var deptSixthInfo;
    var deptSeventhInfo;
    var deptEighthInfo


    var firstname;
    var secondname;
    var thirdname;
    var forthname;
    var fifthname;
    var sixthname;
    var seventhname;
    var logindeptname;

    var firstId;
    var secondId;
    var thirdId;
    var forthId;
    var fifthId;
    var sixthId;
    var seventhId;
    var persondetail;

    var secondCount = 1;
    var thirdCount = 1;
    var forthCount = 1;
    var fifthCount = 1;
    var sixthCount = 1;
    var seventhCount = 1;
    var eighthCount=1;

    var count1;
    var count2;
    var count3;
    var count4;
    var count5;
    var count6;
    var count7;
    var count8;
    var count9;
    var count10;

    var count11;
    var count12;

    var count13;
    var count14;


    return {

      //获取登录用的id
      loginInfo:function () {
        //获取登录用户的信息
        $mqtt.getUserInfo(function (msg) {

          //用户的部门id
          loginId=msg.deptID;
          $rootScope.$broadcast('login.update');

        },function (err) {

        })
      },


      getLoignInfo:function () {
        return loginId;
      },

      //获取常用联系人

      topContactsInfo:function () {
        $greendao.queryByConditions('TopContactsService',function (msg) {
          topContactList=msg;
          $rootScope.$broadcast('topcontacts.update');

        },function (err) {

        })

      },

      getTopContactsInfo:function () {
        return topContactList;
      },





      //获取根目录的
      rootDept: function () {

        $api.getUserRoot(function (msg) {
          rootList = msg.deptList;
          $rootScope.$broadcast('first.update');

        }, function (msg) {

        });


        return null;
      },
      getRootDept: function () {

        return rootList;
      },



      //二级目录的数据 传入的id是一级目录的id

      deptInfo: function (deptId) {

        $api.getDeparment(deptId, function (msg) {
          //拿到root部门的详细信息
          firstname = msg.deptInfo
          $api.getChild(deptId, secondCount, 10, function (msg) {
            deptSecondInfo = msg;
            count1 = msg.deptCount;
            count2 = msg.userCount;
            //返回的一级目录的id ，也就是rootId
            firstId = msg.deptID
            $rootScope.$broadcast('second.update');
            secondCount++;

          }, function (msg) {
            count1 = 0;
            count2 = 0;
            $rootScope.$broadcast('second.update');

          });
        }, function (msg) {

        });

      },
      getDeptInfo: function () {
        return deptSecondInfo;
      },


      getCount1: function () {
        return count1
      },

      getCount2: function () {
        return count2
      },
      clearSecondCount: function () {
        secondCount = 1;
      },

      //三级级目录的数据 传入的id是二级目录的id

      deptThirdInfo: function (deptId) {


        $api.getDeparment(deptId, function (msg) {

          secondname = msg.deptInfo
          $api.getChild(deptId, thirdCount, 10, function (msg) {
            deptThirdInfo = msg;
            secondId = msg.deptID;
            count3 = msg.deptCount;
            count4 = msg.userCount;
            $rootScope.$broadcast('third.update');
            thirdCount++;



          }, function (msg) {

            count3 = 0;
            count4 = 0;
            $rootScope.$broadcast('third.update');

          });

        }, function (msg) {

        });

      },

      getDeptThirdInfo: function () {
        return deptThirdInfo;
      },

      getCount3: function () {
        return count3
      },

      getCount4: function () {
        return count4
      },

      clearThirdCount: function () {
        thirdCount = 1;
      },

      //四级目录的数据 传入的id是三级目录的id


      deptForthInfo: function (deptId) {
        $api.getDeparment(deptId, function (msg) {
          thirdname = msg.deptInfo
          $api.getChild(deptId, forthCount, 10, function (msg) {
            deptForthInfo = msg;
            thirdId = msg.deptID;
            count5 = msg.deptCount;
            count6 = msg.userCount;
            $rootScope.$broadcast('forth.update');
            forthCount++;
          }, function (msg) {
            count5 = 0;
            count6 = 0;
            $rootScope.$broadcast('forth.update');
          });


        }, function (msg) {

        });



      },


      getDeptForthInfo: function () {
        return deptForthInfo;
      },

      getCount5: function () {
        return count5
      },

      getCount6: function () {
        return count6
      },

      clearForthCount: function () {
        forthCount = 1;
      },

      //五级目录的数据 传入的是四级目录的id


      deptFifthInfo: function (deptId) {
        $api.getDeparment(deptId, function (msg) {
          forthname = msg.deptInfo
          $api.getChild(deptId, fifthCount, 10, function (msg) {
            deptFifhtInfo = msg;
            forthId = msg.deptID;
            count7 = msg.deptCount;
            count8 = msg.userCount;
            $rootScope.$broadcast('fifth.update');
            fifthCount++;


          }, function (msg) {
            count7 = 0;
            count8 = 0;
            $rootScope.$broadcast('fifth.update');
          });

        }, function (msg) {

        });

      },




      getDeptFifthInfo: function () {
        return deptFifhtInfo;
      },

      getCount7: function () {
        return count7;
      },

      getCount8: function () {
        return count8;
      },

      clearFifthCount: function () {
        fifthCount = 1;
      },


      //六级目录的数据 传入是是五级目录的id



      deptSixthInfo: function (deptId) {

        $api.getDeparment(deptId, function (msg) {
          fifthname = msg.deptInfo
          $api.getChild(deptId, sixthCount, 10, function (msg) {
            deptSixthInfo = msg;
            fifthId = msg.deptID;
            count9 = msg.deptCount;
            count10 = msg.userCount;
            $rootScope.$broadcast('sixth.update');
            sixthCount++;
          }, function (msg) {
            count9 = 0;
            count10 = 0;
            $rootScope.$broadcast('sixth.update');

          });

        }, function (msg) {

        });



      },


      getDeptSixthInfo: function () {
        return deptSixthInfo;
      },
      getCount9: function () {
        return count9;
      },

      getCount10: function () {
        return count10;
      },

      clearSixthCount: function () {
        sixthCount = 1;
      },


      //七级目录的数据 传入是是六级目录的id



      deptSeventhInfo: function (deptId) {

        $api.getDeparment(deptId, function (msg) {
          sixthname = msg.deptInfo
          $api.getChild(deptId, seventhCount, 10, function (msg) {
            deptSeventhInfo = msg;
            sixthId = msg.deptID;
            count11 = msg.deptCount;
            count12 = msg.userCount;
            $rootScope.$broadcast('seventh.update');
            seventhCount++;
          }, function (err) {
            count11 = 0;
            count12 = 0;
            $rootScope.$broadcast('seventh.update');
          })


        }, function (err) {

        });


      },



      getDeptSeventhInfo: function () {
        return deptSeventhInfo;
      },
      getCount11: function () {
        return count11;
      },

      getCount12: function () {
        return count12;
      },

      clearSeventhCount: function () {
        seventhCount = 1;
      },


      //八级目录传入的是七级目录的id


      deptEighthInfo: function (deptId) {

        $api.getDeparment(deptId, function (msg) {
          seventhname = msg.deptInfo
          $api.getChild(deptId, eighthCount, 10, function (msg) {
            deptEighthInfo = msg;
            seventhId = msg.deptID;
            count13 = msg.deptCount;
            count14 = msg.userCount;
            $rootScope.$broadcast('eighth.update');
            eighthCount++;
          }, function (err) {
            count13 = 0;
            count14 = 0;
            $rootScope.$broadcast('eighth.update');
          })

        }, function (err) {

        });


      },


      getDeptEighthInfo: function () {
        return deptEighthInfo;
      },
      getCount13: function () {
        return count13;
      },

      getCount14: function () {
        return count14;
      },

      clearEngithCount: function () {
        eighthCount = 1;
      },

      //获取登录用户所在的部门

      loginDeptInfo: function (deptId) {

        $api.getDeparment(deptId, function (msg) {
          logindeptname = msg.deptInfo.DeptName
          $rootScope.$broadcast('logindept.update');

        }, function (msg) {

        });

      },
      getloginDeptInfo: function () {
        return logindeptname;
      },







      //获取详情信息

      personDetail: function (id) {
        $api.getUser(id, function (msg) {
          persondetail = msg.user
          $rootScope.$broadcast('personDetail.update');
        }, function (msg) {

        });
      },

      getPersonDetail: function () {
        return persondetail;
      },


      //.......................................................

      getFirstDeptName: function () {
        return firstname;
      },


      getSecondDeptName: function () {
        return secondname;
      },

      getThirdDeptName: function () {
        return thirdname;
      },

      getForthDeptName: function () {
        return forthname;
      },
      getFifthDeptName: function () {
        return fifthname;
      },
      getSixthDeptName: function () {
        return sixthname;
      },
      getSeventhDeptName: function () {
        return seventhname;
      },

      getFirstID: function () {
        return firstId;
      },

      getSecondID: function () {
        return secondId;
      },

      getThirdID: function () {
        return thirdId;
      },

      getForthID: function () {
        return forthId;
      },
      getFifthID: function () {
        return fifthId;
      },

      getSixthID: function () {
        return sixthId;
      },
      getSeventhID: function () {
        return seventhId;
      }


    }
  })

  .factory('$searchdata',function ($api,$rootScope) {
    var youmeiyou;
    var persondetail;
    var contactPlugin;
    document.addEventListener('deviceready',function () {
      contactPlugin=cordova.require('localContact.localContact');

    });

    return{
      personDetail:function (userID) {
        $api.getUser(userID,function (msg) {
          persondetail=msg;
          $rootScope.$broadcast('person.update');

        },function (msg) {

        });
      },
      getPersonDetail:function () {
        return persondetail;
      },

      getyesorno:function (number) {
        contactPlugin.getLocalContactsInfosBynumber(number,function (message) {
          youmeiyou= message;
          //  alert("真实请求的是这个"+youmeiyou)
          $rootScope.$broadcast('personyes.updateno');
        },function (message) {

        });
      },
      getYoumeiyou:function () {
        return youmeiyou;
      }
    }

  })
  .factory('$searchdatadianji',function ($api,$rootScope) {
    var persondetaildianji;

    return{
      personDetaildianji:function (userID) {
        $api.getUser(userID,function (msg) {
          persondetaildianji=msg.user;
          $rootScope.$broadcast('person.dianji');

        },function (msg) {

        });
      },
      getPersonDetaildianji:function () {
        return persondetaildianji;
      },

    }

  })

  .factory('$search111',function ($api,$rootScope) {

    var persons;
    return{
      search1111:function (userid,page,count,query) {
        $api.seachUsers(userid,query,page,count,function (msg) {
          persons=msg;
          $rootScope.$broadcast('persons.update');

        },function (msg) {
          $rootScope.$broadcast('persons.update');
        });
      },

      getPersons:function () {
        return persons;
      }
    }

  })

  .factory('$search222',function ($api,$rootScope) {

    var persons2;
    return{
      search2222:function (userid,page,count,query) {
        $api.seachUsers(userid,query,page,count,function (msg) {
          persons2=msg;
          if (msg.searchCount==0){
            persons2=null;
          }
          $rootScope.$broadcast('persons2.update2');
        },function (msg) {
          persons2=null;
          $rootScope.$broadcast('persons2.update2');
        });
      },

      getPersons2:function () {
        return persons2;
      }
    }

  })
  .factory('$searchlocal',function ($rootScope) {
    var contactPlugin
    var localpersons;
    document.addEventListener('deviceready',function () {
      contactPlugin=cordova.require('localContact.localContact');

    });
    return{
      getlocalContact:function (query) {
        //联系人插件里的按关键字搜索
        contactPlugin.getLocalContactsInfosByText(query,function (message) {
          if(message!=null){
            localpersons=message;
            $rootScope.$broadcast('localperson.update');
          }
        },function (message) {
        });
      },
      getLocalContacts:function () {
        return localpersons;
      }

    };



  })

  .factory('$myattentionser',function ($api,$rootScope) {
    var attentionList;
    return{
      getAttentionList:function () {
        $api.getAttention(function (msg) {
          attentionList=msg;
          $rootScope.$broadcast('attention.update');
        },function (msg) {
        });
      },

      getAttentionaaList:function () {
        return attentionList;
      }
    }

  })

  .factory('$addattentionser',function ($api,$rootScope) {
    var addwancheng;
    return{
      addAttention111:function (membersAerr) {
        $api.addAttention(membersAerr,function (msg) {
          addwancheng=true;
          $rootScope.$broadcast('attention.add');
        },function (msg) {
          alert("添加关注失败")
          $rootScope.$broadcast('attention.add');
        });
      },
      removeAttention111:function (membersAerr) {
        $api.removeAttention(membersAerr,function (msg) {
          addwancheng=false;
          $rootScope.$broadcast('attention.delete');
        },function (msg) {
          alert("取消关注失败")
          $rootScope.$broadcast('attention.delete');
        });
      },

      getaddAttention111:function () {
        return addwancheng;
      }
    }

  })
  .factory('$searchmessage',function ($greendao,$rootScope) {
    var messagesss;
    var messagenamess;
    return{
      searchmessagessss:function (quey) {
        $greendao.queryData('MessagesService', 'where MESSAGE LIKE ?', quey, function (data) {
          messagesss=data;
          $rootScope.$broadcast('messagesss.search');
        },function (msg) {
          alert("失败")
        })
      },

      searchmessagesbyperson:function (name,message) {
        $greendao.querySearchDetail(name,message,function (data) {
          messagenamess=data;
          $rootScope.$broadcast('messagesss.name');
        },function (msg) {
          alert("失败")
        })
      },
      getmessagenamess:function () {
        return messagenamess;
      },

      getmessagessss:function () {
        return messagesss;
      }
    }

  })

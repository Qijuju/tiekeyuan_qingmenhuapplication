/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('contacts.services', [])


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
              queryTopContact.phone = phone;
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
              queryTopContact.phone = phone;
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
          // alert("成功")
        }, function (message) {
          // alert("电话号码不能为空")
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
          // alert("成功")
        }, function (message) {
          // alert("失败")
        });
      }
    }
  })

  .factory('$contacts', function ($api, $rootScope,$mqtt,$greendao,$timeout,$ToastUtils) {

    var loginInfo;
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
          loginInfo=msg;
          $rootScope.$broadcast('login.update');

        },function (err) {

        })
      },


      getLoignInfo:function () {
        return loginInfo;
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

        }, function (err) {
          rootList = null;
          $rootScope.$broadcast('first.update');
        });


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
            $rootScope.$broadcast('second.update',{"pageNo":secondCount,"pageSize":10});
            secondCount++;

          }, function (msg) {
            count1 = 0;
            count2 = 0;
            $rootScope.$broadcast('second.update');

          });
        }, function (msg) {
          $timeout(function () {
            firstname = null;
            deptSecondInfo=null;
            $rootScope.$broadcast('second.update');
            // $ToastUtils.showToast("获取数据失败")
          },4000);

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
            // alert("拿到第san层级的数据"+JSON.stringify(deptThirdInfo));
            secondId = msg.deptID;
            count3 = msg.deptCount;
            count4 = msg.userCount;
            $rootScope.$broadcast('third.update',{"pageNo":thirdCount,"pageSize":10});
            thirdCount++;



          }, function (msg) {

            count3 = 0;
            count4 = 0;
            $rootScope.$broadcast('third.update');

          });

        }, function (msg) {
          $timeout(function () {
            secondname = null;
            deptThirdInfo=null;
            $rootScope.$broadcast('third.update');
            // $ToastUtils.showToast("获取数据失败")
          },4000);

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
          thirdname = msg.deptInfo;
          $api.getChild(deptId, forthCount, 10, function (msg) {
            deptForthInfo = msg;
            thirdId = msg.deptID;
            count5 = msg.deptCount;
            count6 = msg.userCount;
            $rootScope.$broadcast('forth.update',{"pageNo":forthCount,"pageSize":10});
            forthCount++;
          }, function (msg) {
            count5 = 0;
            count6 = 0;
            $rootScope.$broadcast('forth.update',{"pageNo":0,"pageSize":0});
          });


        }, function (msg) {
          $timeout(function () {
            thirdname = null;
            deptForthInfo=null;
            $rootScope.$broadcast('forth.update',{"pageNo":0,"pageSize":0});
            // $ToastUtils.showToast("获取数据失败")
          },4000);
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
          forthname = msg.deptInfo.DeptName;
          $api.getChild(deptId, fifthCount, 10, function (msg) {
            deptFifhtInfo = msg;
            // alert("拿到第五层级的数据"+JSON.stringify(deptFifhtInfo));
            forthId = msg.deptID;
            count7 = msg.deptCount;
            count8 = msg.userCount;
            $rootScope.$broadcast('fifth.update',{"pageNo":fifthCount,"pageSize":10});
            fifthCount++;


          }, function (msg) {
            count7 = 0;
            count8 = 0;
            $rootScope.$broadcast('fifth.update');
          });

        }, function (msg) {
          $timeout(function () {
            forthname = null;
            deptFifhtInfo=null;
            $rootScope.$broadcast('fifth.update');
            // $ToastUtils.showToast("获取数据失败")
          },4000);
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
          fifthname = msg.deptInfo.DeptName;
          $api.getChild(deptId, sixthCount, 10, function (msg) {
            deptSixthInfo = msg;
            // alert("拿到第六层级的数据"+JSON.stringify(deptSixthInfo));
            fifthId = msg.deptID;
            count9 = msg.deptCount;
            count10 = msg.userCount;
            $rootScope.$broadcast('sixth.update',{"pageNo":sixthCount,"pageSize":10});
            sixthCount++;
          }, function (msg) {
            count9 = 0;
            count10 = 0;
            $rootScope.$broadcast('sixth.update');

          });

        }, function (msg) {
          $timeout(function () {
            fifthname = null;
            deptSixthInfo=null;
            $rootScope.$broadcast('sixth.update');
            // $ToastUtils.showToast("获取数据失败")
          },4000);

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
          sixthname = msg.deptInfo.DeptName;
          $api.getChild(deptId, seventhCount, 10, function (msg) {
            deptSeventhInfo = msg;
            sixthId = msg.deptID;
            count11 = msg.deptCount;
            count12 = msg.userCount;
            $rootScope.$broadcast('seventh.update',{"pageNo":seventhCount,"pageSize":10});
            seventhCount++;
          }, function (err) {
            count11 = 0;
            count12 = 0;
            $rootScope.$broadcast('seventh.update');
          })


        }, function (err) {
          $timeout(function () {
            sixthname = null;
            deptSeventhInfo=null;
            $rootScope.$broadcast('seventh.update');
            // $ToastUtils.showToast("获取数据失败")
          },4000);
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
          seventhname = msg.deptInfo.DeptName;
          $api.getChild(deptId, eighthCount, 10, function (msg) {
            deptEighthInfo = msg;
            seventhId = msg.deptID;
            count13 = msg.deptCount;
            count14 = msg.userCount;
            $rootScope.$broadcast('eighth.update',{"pageNo":eighthCount,"pageSize":10});
            eighthCount++;
          }, function (err) {
            count13 = 0;
            count14 = 0;
            $rootScope.$broadcast('eighth.update');
          })

        }, function (err) {
          $timeout(function () {
            seventhname = null;
            deptEighthInfo=null;
            $rootScope.$broadcast('eighth.update');
            // $ToastUtils.showToast("获取数据失败")
          },4000);
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

      personDetail: function (id,$timeout,$ToastUtils) {
        $api.getUser(id, function (msg) {
          persondetail = msg.user;
          $rootScope.$broadcast('personDetail.update');
        }, function (msg) {
          $timeout(function () {
            persondetail = null;
            $rootScope.$broadcast('personDetail.update');
            // $ToastUtils.showToast("获取数据失败")
          },5000);
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

  .factory('$search111',function ($api,$rootScope,$greendao,$pubionicloading,$timeout,$ToastUtils) {
    var persons;
    var historymsg;
    return{
      search1111:function (userid,page,count,query) {
        $api.seachUsers(userid,query,page,count,function (msg) {
          $greendao.qureyHistoryMsg("person",function (msgaaa) {
            var msgs=[];
            for(var i=0;i<msgaaa.length;i++){
              msgs.push(msgaaa[i].msg);
            }
            if(msgs.indexOf(query)==-1){
              // alert(query)
              var msghistory={};
              msghistory._id="";
              msghistory.msg=query;
              msghistory.type="person";
              msghistory.when=0;
              $greendao.saveObj("MsgHistoryService",msghistory,function (message) {
                // alert("存取成功");
              },function (message) {

              })
            }else {
              // alert(query)
              $greendao.queryData("MsgHistoryService",'where msg =?',query,function (msgbbb) {
                // alert("进了")
                for(var j=0;j<msgbbb.length;j++) {
                  var key = msgbbb[j]._id;
                  $greendao.deleteDataByArg('MsgHistoryService', key, function (data) {
                  }, function (err) {
                  });
                }
                var msghistory={};
                msghistory._id="";
                msghistory.msg=query;
                msghistory.type="person";
                msghistory.when=0;
                $greendao.saveObj("MsgHistoryService",msghistory,function (message) {
                  // alert("存取成功");
                },function (message) {

                })
              },function (msgbbb) {
              })
            }
          },function (msgaaa) {
          });
          if(query.length==0||query==""){
            persons=new Array();
          }else {
            persons=msg;
          }

          if(msg.searchResult==null||msg.searchResult.length==0||msg.searchResult==""){
          }
          $rootScope.$broadcast('persons.update');

        },function (msg) {
          $timeout(function () {
            $pubionicloading.hide();
          },5000);
          $rootScope.$broadcast('persons.update');
        });
      },
      getHistorymsg:function (type) {
        $greendao.qureyHistoryMsg(type,function (msg) {
          historymsg=msg;
          $rootScope.$broadcast('persons.history');
        },function (msg) {
          $rootScope.$broadcast('persons.history');
        });
      },
      getPersons:function () {
        return persons;
      },
      getHistorymsgs:function () {
        return historymsg;
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

  .factory('$myattentionser',function ($api,$rootScope,$timeout,$ToastUtils) {
    var attentionList;
    return{
      getAttentionList:function () {
        $api.getAttention(function (msg) {
          attentionList=msg;

          // 截取后两位显示在头像logo上
          // for (var i=0;i<attentionList.length();i++){
          //   attentionList[i].logoName = attentionList[i].UserName.slice(-2);
          // }
          $rootScope.$broadcast('attention.update');
        },function (msg) {
          $timeout(function () {
            attentionList=null;
            $rootScope.$broadcast('attention.update');
            // $ToastUtils.showToast("请选择联系人进行关注")
          },5000);
        });
      },

      getAttentionaaList:function () {

        return attentionList;
      }
    }

  })

  .factory('$addattentionser',function ($api,$rootScope,$timeout,$ToastUtils) {
    var addwancheng;
    return{
      addAttention111:function (membersAerr) {
        $api.addAttention(membersAerr,function (msg) {
          addwancheng=true;
          $rootScope.$broadcast('attention.add');
          $ToastUtils.showToast("添加关注成功")
        },function (msg) {
          $ToastUtils.showToast("添加关注失败")
          $rootScope.$broadcast('attention.add');
        });
      },
      removeAttention111:function (membersAerr) {
        $api.removeAttention(membersAerr,function (msg) {
          addwancheng=false;
          $rootScope.$broadcast('attention.delete');
          $ToastUtils.showToast("取消关注成功")
        },function (msg) {
          $timeout(function () {
            $rootScope.$broadcast('attention.delete');
            $ToastUtils.showToast("取消关注失败")
          },5000);
        });
      },

      getaddAttention111:function () {
        return addwancheng;
      }
    }

  })
  .factory('$searchmessage',function ($greendao,$rootScope,$timeout,$pubionicloading,$ToastUtils) {
    var messagesss;
    var messagenamess;
    return{
      searchmessagessss:function (quey) {
        // messagesss=[];
        $greendao.queryData('MessagesService', 'where MESSAGE LIKE ?', quey, function (data) {
          // for(var i=0;i<data.length;i++){
          //   messagesss.push(data[i]);
          // }
          messagesss=data;

          if(messagesss==null||messagesss.length==0||messagesss==""){
          }
          $rootScope.$broadcast('messagesss.search');
        },function (msg) {
          $timeout(function () {
            $pubionicloading.hide();
          },5000);
        })
      },

      searchmessagesbyperson:function (name,message) {
        $greendao.querySearchDetail(name,message,function (data) {
          messagenamess=data;
          $rootScope.$broadcast('messagesss.name');
        },function (msg) {
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

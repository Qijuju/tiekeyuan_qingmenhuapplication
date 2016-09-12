/**
 * Created by Administrator on 2016/9/9.
 */
angular.module('localphone.services', [])

  .factory('localContact',function ($rootScope,$greendao,$api) {

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
         contactsAll=[];
         A=[];
         B=[];
         C=[];
         D=[];
         E=[];
         F=[];
         G=[];
         H=[];
         I=[];
         J=[];
         K=[];
         L=[];
         M=[];
         N=[];
         O=[];
         P=[];
         Q=[];
         R=[];
         S=[];
         T=[];
         U=[];
         V=[];
         W=[];
         X=[];
         Y=[];
         Z=[];
         onsuch=[];

        contactPlugin.getLocalContactsInfos("",function (message) {

          //开始构造数据，然后再去调用接口的方法

          $greendao.loadAllData("LocalPhoneService",function (msg) {

          var replyList=[];

           for(var i=0;i<msg.length;i++){
             var reply={};
             reply.id=msg.id;
             reply.phone=msg.phone;
             replyList.push(reply);

           }


           







          },function (err) {

          })







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


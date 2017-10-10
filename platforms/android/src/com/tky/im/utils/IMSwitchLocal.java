package com.tky.im.utils;

import android.content.Context;

import com.tky.im.connection.IMConnection;
import com.tky.im.enums.IMEnums;
import com.tky.im.params.ConstantsParams;
import com.tky.im.service.IMService;
import com.tky.mqtt.chat.MqttChat;
import com.tky.mqtt.paho.MType;
import com.tky.mqtt.paho.MqttNotification;
import com.tky.mqtt.paho.SPUtils;
import com.tky.mqtt.paho.ToastUtil;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.bean.MessageBean;
import com.tky.mqtt.paho.callback.OKHttpCallBack2;
import com.tky.mqtt.paho.http.OKAsyncClient;
import com.tky.mqtt.paho.http.Request;
import com.tky.mqtt.paho.httpbean.BaseBean;
import com.tky.mqtt.paho.httpbean.ParamsMap;
import com.tky.mqtt.paho.utils.GsonUtils;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Map;

/**
 * Created by tkysls on 2017/4/18.
 */

public class IMSwitchLocal {
//    private static String local = "TEST";//开发环境
    private static String local = "LN";//生产环境
//    private static String local = "LW";//老挝正式环境

    public static void setLocal(String local) {
        IMSwitchLocal.local = local;
    }

    public static String getLocal() {
        return local;//(local == null || "".equals(local.trim()) ? "LN" : "LW");
    }

    public static String getLocalIp() {
        String localIp = "";
        //目前路内和路外localIp都是相同的
        if ("LW".equals(getLocal())) {
            localIp = "tcp://" + IMConnection.getURL();
        } else {
            localIp = "tcp://" + IMConnection.getURL();
        }
        return localIp;
    }

    /**
     * 获取一个Topic
     * @param type
     * @param id 可能会是用户ID，也可能是群组ID，也可能是部门ID
     * @return
     */
    public static String getATopic(MType type, String id) {
        return getLocal() + "/A/" + getType(type) + "/" + id;
    }

  /**
   * 用topic获取ID
   * @return
   */
  public static String fromTopic(String topic, String type) {
    return topic.substring((getLocal() + "/A/" + type).length());
  }

  //固定的上下线发送Topic
  public static String getOnOffTopic(){
    return  getLocal()+"/A/"+"SI/LoginEventHandler";
  }

    public static String getType(MType type) {
        if (MType.U == type) {
            return "U";
        } else if (MType.G == type) {
            return "G";
        } else if (MType.D == type) {
            return "D";
        } else {
            return "U";
        }
    }

    public static MType getType(String type) {
        if ("User" == type) {
            return MType.U;
        } else if ("Group" == type) {
            return MType.G;
        } else if ("Dept" == type) {
            return MType.D;
        } else {
            return MType.U;
        }
    }


    /**
     * 获取当前登录的用户ID
     *
     * @return
     */
    public static String getUserID() throws JSONException {
        JSONObject userInfo = getUserInfo();
        return userInfo.getString("userID");
    }

    /**
     * 获取当前登录用户的deptID
     *
     * @return
     * @throws JSONException
     */
    public static String getDeptID() throws JSONException {
        JSONObject userInfo = getUserInfo();
        return userInfo.getString("deptID");
    }

  /**
   * 将登录信息清空
   * @throws JSONException
   */
    public static void clearUserInfo() throws JSONException {
      SPUtils.save("login_info", "");
    }

    public static JSONObject getUserInfo() throws JSONException {
        String login_info = SPUtils.getString("login_info", "");
        return new JSONObject(login_info);
    }

    /**
     * 重新连接MQTT验证
     * @param reloginCheck
     */
    public static void reloginCheck(final IReloginCheck reloginCheck) {
        try {
            reloginCheck(getUserID(), reloginCheck);
        } catch (JSONException e) {
            ToastUtil.showSafeToast("重连失败！");
            e.printStackTrace();
        }
    }

    /**
     * 重新连接MQTT验证
     * @param reloginCheck
     */
    public static void reloginCheck(final String userID, final IReloginCheck reloginCheck) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Request request = new Request();
                    Map<String, Object> paramsMap = ParamsMap.getInstance("ReloginCheck").getParamsMap();
                    request.addParamsMap(paramsMap);
                    OKAsyncClient.post(request, new OKHttpCallBack2<BaseBean>() {
                        @Override
                        public void onSuccess(Request request, BaseBean result) {
                            if (result.isSucceed()) {
                                reloginCheck.onCheck(true);
                            } else if ("106".equals(result.getErrCode()) || "107".equals(result.getErrCode())) {
                                reloginCheck.onCheck(false);
                            }
                        }

                        @Override
                        public void onFailure(Request request, Exception e) {
                        }
                    });
                } catch (JSONException e) {
                    e.printStackTrace();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    /**
     * 重新连接MQTT验证
     * @param reloginCheckStatus
     */
    public static void reloginCheckStatus(final IReloginCheckStatus reloginCheckStatus) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Request request = new Request();
                    Map<String, Object> paramsMap = ParamsMap.getInstance("ReloginCheck").getParamsMap();
                    request.addParamsMap(paramsMap);
                    OKAsyncClient.post(request, new OKHttpCallBack2<BaseBean>() {
                        @Override
                        public void onSuccess(Request request, BaseBean result) {
                            if (result.isSucceed()) {
                                reloginCheckStatus.onCheck(EReloginCheckStatus.CAN_RECONNECT);
                            } else if ("106".equals(result.getErrCode()) || "107".equals(result.getErrCode())) {
                                reloginCheckStatus.onCheck(EReloginCheckStatus.NEED_LOGOUT);
                            }
                        }

                        @Override
                        public void onFailure(Request request, Exception e) {
                            reloginCheckStatus.onCheck(EReloginCheckStatus.ERROR);
                        }
                    });
                } catch (JSONException e) {
                    reloginCheckStatus.onCheck(EReloginCheckStatus.ERROR);
                    e.printStackTrace();
                } catch (Exception e) {
                    reloginCheckStatus.onCheck(EReloginCheckStatus.ERROR);
                    e.printStackTrace();
                }
            }
        }).start();
    }

    public interface IReloginCheck {
        public void onCheck(boolean result);
    }

    public interface IReloginCheckStatus {
        public void onCheck(EReloginCheckStatus status);
    }

    public enum EReloginCheckStatus {
        CAN_RECONNECT/*可以重连*/,NEED_LOGOUT/*被强踢，需要退出登录*/,ERROR/*遇到异常*/
    }

    /**
     * 退出登录
     * @param context
     */
    public static void exitLogin(Context context) {
        MessageBean eventBean = new MessageBean();
        eventBean.set_id("");
        eventBean.setSessionid("");
        eventBean.setUsername("");
        eventBean.setWhen(0L);
        eventBean.setImgSrc("");
        eventBean.setFrom("");
        eventBean.setIsFailure("");
        eventBean.setMessage("");
        eventBean.setMessagetype("Event_KUF");
        eventBean.setPlatform("");
        eventBean.setType("");
        eventBean.setIsDelete("");
        eventBean.setSenderid("");
        String json = GsonUtils.toJson(eventBean, MessageBean.class);
        IMBroadOper.broadArrivedMsg("", 1, json);
        MqttChat.setHasLogin(false);
        try {
            //清空登录信息
            clearUserInfo();
            if (!UIUtils.isServiceWorked(IMService.class.getName())) {
                IMStatusManager.setImStatus(IMEnums.CONNECT_DOWN_BY_HAND);
            }
            IMBroadOper.broad(ConstantsParams.PARAM_STOP_IMSERVICE);
        } catch (Exception e) {

        }
        MqttNotification.cancelAll();
        ToastUtil.showSafeToast("您的账号在其他设备已登录！");
    }
}

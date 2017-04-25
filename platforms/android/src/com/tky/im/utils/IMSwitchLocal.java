package com.tky.im.utils;

import android.content.Context;
import android.content.Intent;

import com.tky.im.enums.IMEnums;
import com.tky.im.params.ConstantsParams;
import com.tky.mqtt.chat.MqttChat;
import com.tky.mqtt.paho.ConnectionType;
import com.tky.mqtt.paho.MType;
import com.tky.mqtt.paho.MqttNotification;
import com.tky.mqtt.paho.MqttService;
import com.tky.mqtt.paho.ReceiverParams;
import com.tky.mqtt.paho.SPUtils;
import com.tky.mqtt.paho.ToastUtil;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.bean.MessageBean;
import com.tky.mqtt.paho.utils.GsonUtils;
import com.tky.mqtt.paho.utils.MqttOper;
import com.tky.mqtt.plugin.thrift.api.SystemApi;

import org.apache.thrift.TException;
import org.apache.thrift.async.AsyncMethodCallback;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import im.server.System.IMSystem;

/**
 * Created by tkysls on 2017/4/18.
 */

public class IMSwitchLocal {
    private static String local;

    public static void setLocal(String local) {
        IMSwitchLocal.local = local;
    }

    public static String getLocal() {
        return (local == null || "".equals(local.trim()) ? "LN" : "LW");
    }

    public static String getLocalIp() {
        String localIp = "";
        //目前路内和路外localIp都是相同的
        if ("LW".equals(getLocal())) {
            localIp = "tcp://" + SystemApi.url + ":1883";
        } else {
            localIp = "tcp://" + SystemApi.url + ":1883";
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
        return getLocal() + "/" + getType(type) + "/" + id;
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
                    SystemApi.reloginCheck(userID, UIUtils.getDeviceId(), new AsyncMethodCallback<IMSystem.AsyncClient.ReloginCheck_call>() {
                        @Override
                        public void onComplete(IMSystem.AsyncClient.ReloginCheck_call reloginCheck_call) {
                            try {
                                if (reloginCheck_call != null && reloginCheck != null) {
                                    if (reloginCheck_call.getResult().result) {
                                        reloginCheck.onCheck(true);
                                    } else if ("106".equals(reloginCheck_call.getResult().getResultCode()) || "107".equals(reloginCheck_call.getResult().getResultCode())) {
                                        reloginCheck.onCheck(false);
                                    }
                                }
                            } catch (Exception e) {
                                ToastUtil.showSafeToast("重连失败！");
                                e.printStackTrace();
                            }
                        }

                        @Override
                        public void onError(Exception e) {
                            ToastUtil.showSafeToast("重连失败！");
                        }
                    });
                } catch (IOException e) {
                    ToastUtil.showSafeToast("重连失败！");
                    e.printStackTrace();
                } catch (TException e) {
                    ToastUtil.showSafeToast("重连失败！");
                    e.printStackTrace();
                } catch (Exception e) {
                    ToastUtil.showSafeToast("重连失败！");
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
                    SystemApi.reloginCheck(IMSwitchLocal.getUserID(), UIUtils.getDeviceId(), new AsyncMethodCallback<IMSystem.AsyncClient.ReloginCheck_call>() {
                        @Override
                        public void onComplete(IMSystem.AsyncClient.ReloginCheck_call reloginCheck_call) {
                            try {
                                if (reloginCheck_call != null && reloginCheckStatus != null) {
                                    if (reloginCheck_call.getResult().result) {
                                        reloginCheckStatus.onCheck(EReloginCheckStatus.CAN_RECONNECT);
                                    } else if ("106".equals(reloginCheck_call.getResult().getResultCode()) || "107".equals(reloginCheck_call.getResult().getResultCode())) {
                                        reloginCheckStatus.onCheck(EReloginCheckStatus.NEED_LOGOUT);
                                    }
                                }
                            } catch (Exception e) {
                                if (reloginCheck_call != null && reloginCheckStatus != null) {
                                    reloginCheckStatus.onCheck(EReloginCheckStatus.ERROR);
                                }
                                e.printStackTrace();
                            }
                        }

                        @Override
                        public void onError(Exception e) {
                            if (reloginCheckStatus != null) {
                                reloginCheckStatus.onCheck(EReloginCheckStatus.ERROR);
                            }
                        }
                    });
                } catch (IOException e) {
                    if (reloginCheckStatus != null) {
                        reloginCheckStatus.onCheck(EReloginCheckStatus.ERROR);
                    }
                    e.printStackTrace();
                } catch (TException e) {
                    if (reloginCheckStatus != null) {
                        reloginCheckStatus.onCheck(EReloginCheckStatus.ERROR);
                    }
                    e.printStackTrace();
                } catch (JSONException e) {
                    if (reloginCheckStatus != null) {
                        reloginCheckStatus.onCheck(EReloginCheckStatus.ERROR);
                    }
                    e.printStackTrace();
                } catch (Exception e) {
                    if (reloginCheckStatus != null) {
                        reloginCheckStatus.onCheck(EReloginCheckStatus.ERROR);
                    }
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
//            IMStatusManager.setImStatus(IMEnums.CONNECT_DOWN_BY_HAND);
            IMBroadOper.broad(ConstantsParams.PARAM_STOP_IMSERVICE);
        } catch (Exception e) {

        }
        MqttNotification.cancelAll();
        ToastUtil.showSafeToast("您已被强制下线！");
    }
}

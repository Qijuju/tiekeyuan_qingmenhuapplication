package com.tky.mqtt.paho.utils;

import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.Looper;

import com.tky.im.connection.IMConnection;
import com.tky.mqtt.chat.MqttChat;
import com.tky.mqtt.paho.ConnectionType;
import com.tky.mqtt.paho.MType;
import com.tky.mqtt.paho.MqttNotification;
import com.tky.mqtt.paho.MqttService;
import com.tky.mqtt.paho.MqttStatus;
import com.tky.mqtt.paho.ReceiverParams;
import com.tky.mqtt.paho.SPUtils;
import com.tky.mqtt.paho.ToastUtil;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.bean.MessageBean;
import com.tky.mqtt.paho.main.MqttRobot;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * 作者：
 * 包名：com.tky.mqtt.paho.utils
 * 日期：2016/8/10 16:11
 * 描述：
 */
public class SwitchLocal {
    private static String local;

    public static void setLocal(String local) {
        SwitchLocal.local = local;
    }

    public static String getLocal() {
        return (local == null || "".equals(local.trim()) ? "LN" : "LW");
    }

    public static String getLocalIp() {
        String localIp = "";
        //目前路内和路外localIp都是相同的
        if ("LW".equals(getLocal())) {
            localIp = "tcp://" + IMConnection.getURL() + ":1883";
        } else {
            localIp = "tcp://" + IMConnection.getURL() + ":1883";
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
    //固定的上下线发送Topic
    public static String getOnOffTopic(){
      return  getLocal()+"/A/"+"s/LoginEvent";
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
        if ("ChildJSBean" == type) {
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
            //ToastUtil.showSafeToast("重连失败！");
            e.printStackTrace();
        }
    }

  private static class SaveMQTTRunnable implements Runnable {

    private String userID;
    private IReloginCheck reloginCheck;
    private Handler handler;

    public SaveMQTTRunnable(final String userID, final IReloginCheck reloginCheck, Handler handler) {
      this.userID = userID;
      this.reloginCheck = reloginCheck;
      this.handler = handler;
    }

    @Override
    public void run() {
      handler.removeCallbacks(this);
      if (MqttRobot.getConnectionType() != ConnectionType.MODE_CONNECTION_DOWN_MANUAL && MqttRobot.getMqttStatus() != MqttStatus.OPEN) {
        reloginCheck(userID, reloginCheck);
      }
    }
  }

  private static class SaveMQTTRunnable2 implements Runnable {

    private IReloginCheckStatus reloginCheck;
    private Handler handler;

    public SaveMQTTRunnable2(IReloginCheckStatus reloginCheck, Handler handler) {
      this.handler = handler;
      this.reloginCheck = reloginCheck;
    }

    @Override
    public void run() {
      handler.removeCallbacks(this);
      if (MqttRobot.getConnectionType() != ConnectionType.MODE_CONNECTION_DOWN_MANUAL && MqttRobot.getMqttStatus() != MqttStatus.OPEN) {
        reloginCheckStatus(reloginCheck);
      }
    }
  }

    /**
     * 重新连接MQTT验证
     * @param reloginCheck
     */
    public static void reloginCheck(final String userID, final IReloginCheck reloginCheck) {
      new Thread(new Runnable() {
        final Handler handler = new Handler();
        final SaveMQTTRunnable saveMQTTRunnable = new SaveMQTTRunnable(userID, reloginCheck, handler);
        @Override
        public void run() {
          Looper.prepare();
          try {
            /*SystemApi.reloginCheck(userID, UIUtils.getDeviceId(), new AsyncMethodCallback<IMSystem.AsyncClient.ReloginCheck_call>() {
              @Override
              public void onComplete(IMSystem.AsyncClient.ReloginCheck_call reloginCheck_call) {
                handler.removeCallbacks(saveMQTTRunnable);
                try {
                  if (reloginCheck_call != null && reloginCheck != null) {
                    if (reloginCheck_call.getResult().result) {
                      reloginCheck.onCheck(true);
                    } else if ("106".equals(reloginCheck_call.getResult().getResultCode()) || "107".equals(reloginCheck_call.getResult().getResultCode())) {
                      reloginCheck.onCheck(false);
                    }
                  }
                } catch (Exception e) {
                  //ToastUtil.showSafeToast("重连失败！");
                  e.printStackTrace();
                }
              }

              @Override
              public void onError(Exception e) {
                handler.postDelayed(saveMQTTRunnable, 2000);
                //ToastUtil.showSafeToast("重连失败！");
              }
            });*/
          } catch (Exception e) {
            handler.postDelayed(saveMQTTRunnable, 2000);
            //ToastUtil.showSafeToast("重连失败！");
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
          Looper.prepare();
          final Handler handler = new Handler();
          final SaveMQTTRunnable2 saveMQTTRunnable = new SaveMQTTRunnable2(reloginCheckStatus, handler);
          try {
            /*SystemApi.reloginCheck(SwitchLocal.getUserID(), UIUtils.getDeviceId(), new AsyncMethodCallback<IMSystem.AsyncClient.ReloginCheck_call>() {
              @Override
              public void onComplete(IMSystem.AsyncClient.ReloginCheck_call reloginCheck_call) {
                handler.removeCallbacks(saveMQTTRunnable);
                try {
                  if (reloginCheck_call != null && reloginCheckStatus != null) {
                    if (reloginCheck_call.getResult().result) {
                      reloginCheckStatus.onCheck(EReloginCheckStatus.CAN_RECONNECT);
                    } else if ("106".equals(reloginCheck_call.getResult().getResultCode()) || "107".equals(reloginCheck_call.getResult().getResultCode())) {
                      reloginCheckStatus.onCheck(EReloginCheckStatus.NEED_LOGOUT);
                    }
                  }
                } catch (Exception e) {
                  handler.postDelayed(saveMQTTRunnable, 2000);
                  if (reloginCheck_call != null && reloginCheckStatus != null) {
                    reloginCheckStatus.onCheck(EReloginCheckStatus.ERROR);
                  }
                  e.printStackTrace();
                }
              }

              @Override
              public void onError(Exception e) {
                handler.postDelayed(saveMQTTRunnable, 2000);
                if (reloginCheckStatus != null) {
                  reloginCheckStatus.onCheck(EReloginCheckStatus.ERROR);
                }
              }
            });*/
          } catch (Exception e) {
            handler.postDelayed(saveMQTTRunnable, 2000);
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
        Intent intent = new Intent();
        intent.setAction(ReceiverParams.MESSAGEARRIVED);
        intent.putExtra("topic", "");
        String json = GsonUtils.toJson(eventBean, MessageBean.class);
        intent.putExtra("content", json);
        intent.putExtra("qos", 1);
        context.sendBroadcast(intent);
        MqttChat.setHasLogin(false);
        try {
            MqttRobot.setConnectionType(ConnectionType.MODE_CONNECTION_DOWN_MANUAL);
            MqttOper.closeMqttConnection();
            UIUtils.getContext().stopService(new Intent(UIUtils.getContext(), MqttService.class));
        } catch (Exception e) {

        }
        MqttNotification.cancelAll();
        MqttRobot.setIsStarted(false);
        ToastUtil.showSafeToast("您已被强制下线！");
    }
}

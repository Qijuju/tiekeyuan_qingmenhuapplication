package com.tky.im.utils;

import com.tky.mqtt.paho.SPUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.UUID;

/**
 * Created by tkysls on 2017/4/11.
 */

public class IMUtils {
    /**
     * 获取当前登录的用户ID
     * @return
     */
    public static String getUserID() {
        JSONObject userInfo = null;
        try {
            userInfo = getUserInfo();
            return userInfo.getString("userID");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return UUID.randomUUID().toString().toUpperCase().substring(0, 6);
    }

    /**
     * 获取用户登录信息
     * @return
     * @throws JSONException
     */
    public static JSONObject getUserInfo() throws JSONException {
        String login_info = SPUtils.getString("login_info", "");
        return new JSONObject(login_info);
    }
}

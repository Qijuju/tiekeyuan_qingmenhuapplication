package com.tky.oaintegration;

import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.List;

/**
 * 作者：
 * 包名：com.tky.oaintegration
 * 日期：2017-08-23 15:47:30
 * 描述：oa集成插件
 */
public class MqttPluginResult extends PluginResult {
    public MqttPluginResult(Status status) {
        super(status);
    }

    public MqttPluginResult(Status status, String message) {
        super(status, message);
    }

    public MqttPluginResult(Status status, JSONArray message) {
        super(status, message);
    }

    public MqttPluginResult(Status status, JSONObject message) {
        super(status, message);
    }

    public MqttPluginResult(Status status, int i) {
        super(status, i);
    }

    public MqttPluginResult(Status status, float f) {
        super(status, f);
    }

    public MqttPluginResult(Status status, boolean b) {
        super(status, b);
    }

    public MqttPluginResult(Status status, byte[] data) {
        super(status, data);
    }

    public MqttPluginResult(Status status, byte[] data, boolean binaryString) {
        super(status, data, binaryString);
    }

    public MqttPluginResult(Status status, List<PluginResult> multipartMessages) {
        super(status, multipartMessages);
    }

    @Override
    public void setKeepCallback(boolean b) {
        super.setKeepCallback(true);
    }
}

package com.tky.mqtt.paho.httpbean;

import com.tky.mqtt.paho.UIUtils;

import org.json.JSONException;

import java.util.HashMap;
import java.util.Map;

import static com.tky.im.utils.IMSwitchLocal.getDeptID;
import static com.tky.im.utils.IMUtils.getUserID;

/**
 * Created by r on 2017/6/16.
 */

public class ParamsMap {

  private static final ParamsMap INSTANCE = new ParamsMap();
  private static String actionName;

  private ParamsMap(){}
  public static ParamsMap getInstance(String actionName) {
    ParamsMap.actionName = actionName;
    return INSTANCE;
  }

  /**
   * 获取一个Map
   * @return
   */
  public Map<String, Object> getParamsMap() throws JSONException {
    HashMap<String, Object> paramsMap = new HashMap<String, Object>();
    paramsMap.put("Action", actionName);
    paramsMap.put("id", getUserID());
    paramsMap.put("mepId", UIUtils.getDeviceId());
    return paramsMap;
  }
}

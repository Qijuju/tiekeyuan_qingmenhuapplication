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

  private String actionName;

  private ParamsMap(){}

  /**
   * 获取实例并且
   * @param actionName
   * @return
   */
  public static ParamsMap getInstance(String actionName) {
    ParamsMap INSTANCE = new ParamsMap();
    INSTANCE.actionName = actionName;
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

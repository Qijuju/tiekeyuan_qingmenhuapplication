package com.tky.im.utils;

import com.tky.im.enums.IMEnums;
import com.tky.mqtt.paho.SPUtils;

/**
 * Created by tkysls on 2017/4/17.
 */

public class IMStatusManager {
    /**
     * IM的连接状态
     */
    private static IMEnums imStatus = IMEnums.INIT;

    /**
     * 设置IM的状态
     * @param imStatus
     */
    public static void setImStatus(IMEnums imStatus) {
        SPUtils.save("im_status", getImStatus(imStatus));
    }

    /**
     * 获取IM状态
     * @return
     */
    public static IMEnums getImStatus() {
        return switchImStatus(SPUtils.getString("im_status", "INIT"));
    }

    /**
     * 由String转为IMEnums
     * @param imStatus
     * @return
     */
    private static IMEnums switchImStatus(String imStatus) {
        if ("INIT".equals(imStatus)) {
            return IMEnums.INIT;
        } else if ("CONNECTED".equals(imStatus)) {
            return IMEnums.CONNECTED;
        } else if ("CONNECT_DOWN".equals(imStatus)) {
            return IMEnums.CONNECT_DOWN;
        } else if ("CONNECT_DOWN_BY_HAND".equals(imStatus)) {
            return IMEnums.CONNECT_DOWN_BY_HAND;
        } else if ("CONNECT_DOWN_BY_NET_DOWN".equals(imStatus)) {
            return IMEnums.CONNECT_DOWN_BY_NET_DOWN;
        }
        return IMEnums.INIT;
    }

    /**
     * 由IMEnums转为String
     * @param imStatus
     * @return
     */
    private static String getImStatus(IMEnums imStatus) {
        if (imStatus == IMEnums.INIT) {
            return "INIT";
        } else if (imStatus == IMEnums.CONNECTED) {
            return "CONNECTED";
        } else if (imStatus == IMEnums.CONNECT_DOWN) {
            return "CONNECT_DOWN";
        } else if (imStatus == IMEnums.CONNECT_DOWN_BY_HAND) {
            return "CONNECT_DOWN_BY_HAND";
        } else if (imStatus == IMEnums.CONNECT_DOWN_BY_NET_DOWN) {
            return "CONNECT_DOWN_BY_NET_DOWN";
        }
        return "INIT";
    }
}

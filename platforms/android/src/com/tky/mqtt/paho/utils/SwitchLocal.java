package com.tky.mqtt.paho.utils;

import com.tky.mqtt.paho.MType;

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
            localIp = "tcp://61.237.239.152:1883";
        } else {
            localIp = "tcp://61.237.239.152:1883";
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


}

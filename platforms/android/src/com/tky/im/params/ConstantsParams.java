package com.tky.im.params;

import com.tky.mqtt.paho.UIUtils;

/**
 * Created by tkysls on 2017/4/11.
 */

public class ConstantsParams {
    private static final String BASE_PARAM = UIUtils.getContext().getPackageName() + ".im.";
    /**
     * 发消息
     */
    public static final String PARAM_SEND_MESSAGE = BASE_PARAM + "param_send_message";

    /**
     * 收消息
     */
    public static final String PARAM_RECEIVE_MESSAGE = BASE_PARAM + "param_receive_message";

    /**
     * IM断开
     */
    public static final String PARAM_IM_DOWN = BASE_PARAM + "param_im_down";

    /**
     * MQTT连接成功
     */
    public static final String PARAM_CONNECT_SUCCESS = BASE_PARAM + "param_connect_success";

    /**
     * MQTT连接失败
     */
    public static final String PARAM_CONNECT_FAILURE = BASE_PARAM + "param_connect_failure";

    /**
     * MQTT重新连接
     */
    public static final String PARAM_RE_CONNECT = BASE_PARAM + "param_re_connect";

    /**
     * 杀死IM
     */
    public static final String PARAM_KILL_IM = BASE_PARAM + "param_kill_im";

    /**
     * 网络断开
     */
    public static final String PARAM_NET_DOWN = BASE_PARAM + "param_net_down";

    /**
     * 网络连接上
     */
    public static final String PARAM_NET_UP = BASE_PARAM + "param_net_up";

    /**
     * 干死IMService
     */
    public static final String PARAM_STOP_IMSERVICE = BASE_PARAM + "param_stop_imservice";

    /**
     * 订阅topic
     */
    public static final String PARAM_TOPIC_SUBSCRIBE = BASE_PARAM + "param_topic_subscribe";

    /**
     * 反订阅topic
     */
    public static final String PARAM_TOPIC_UNSUBSCRIBE = BASE_PARAM + "param_topic_unsubscribe";
}

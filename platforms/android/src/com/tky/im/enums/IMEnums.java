package com.tky.im.enums;

/**
 * MQTT的五种状态
 */

public enum IMEnums {
    /*初始化状态*/
    INIT,
    /*连接状态*/
    CONNECTED,
    /*未知错误导致不能连接，逐次递增时间重启MQTT，
    间隔例如：前5s内每1s检查一次，后面逐次递增为5s、10s、20s一次，
    如果20s检查仍然无法连接，则不再重连，直接退出登录*/
    CONNECT_DOWN,
    /*网络断开，等待网络重连*/
    CONNECT_DOWN_BY_NET_DOWN,
    /*手动断开，不可再次连接*/
    CONNECT_DOWN_BY_HAND
}

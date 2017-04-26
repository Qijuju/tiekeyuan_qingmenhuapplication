package com.tky.im.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.tky.im.enums.IMEnums;
import com.tky.im.params.ConstantsParams;
import com.tky.im.utils.IMBroadOper;
import com.tky.im.utils.IMStatusManager;
import com.tky.mqtt.plugin.thrift.api.SystemApi;

/**
 * Created by tkysls on 2017/4/11.
 */

public class IMScreenReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_SCREEN_ON.equals(intent.getAction())) {
            if (IMStatusManager.getImStatus() != IMEnums.CONNECT_DOWN_BY_HAND) {
                //初始化Thrift
                SystemApi.dealNetDown();
                //发送重连广播
                IMBroadOper.broad(ConstantsParams.PARAM_RE_CONNECT);
            }
        }
    }
}

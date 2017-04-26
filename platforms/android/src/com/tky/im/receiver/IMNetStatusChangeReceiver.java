package com.tky.im.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiManager;
import com.tky.im.enums.IMEnums;
import com.tky.im.params.ConstantsParams;
import com.tky.im.utils.IMBroadOper;
import com.tky.im.utils.IMStatusManager;
import com.tky.mqtt.paho.ToastUtil;
import com.tky.mqtt.paho.utils.NetUtils;
import com.tky.mqtt.plugin.thrift.api.SystemApi;

/**
 * Created by tkysls on 2017/4/18.
 */

public class IMNetStatusChangeReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        if (ConnectivityManager.CONNECTIVITY_ACTION.equals(intent.getAction())) {
            /*NetworkInfo info = intent.getParcelableExtra(WifiManager.EXTRA_NETWORK_INFO);
            if (info.getState().equals(NetworkInfo.State.CONNECTED) && NetUtils.isConnect(context)) {
                IMBroadOper.broad(ConstantsParams.PARAM_NET_UP);
                if (IMStatusManager.getImStatus() != IMEnums.CONNECT_DOWN_BY_HAND) {
                    IMBroadOper.broad(ConstantsParams.PARAM_RE_CONNECT);
                }
            } else if (info.getState().equals(NetworkInfo.State.DISCONNECTED)) {
                IMBroadOper.broad(ConstantsParams.PARAM_NET_DOWN);
            }*/
            if (NetUtils.getNetWorkState(context) != -1) {
                SystemApi.dealNetDown();
                IMBroadOper.broad(ConstantsParams.PARAM_NET_UP);
                if (IMStatusManager.getImStatus() != IMEnums.CONNECT_DOWN_BY_HAND) {
                    IMBroadOper.broad(ConstantsParams.PARAM_RE_CONNECT);
                }
            } else {
                IMBroadOper.broad(ConstantsParams.PARAM_NET_DOWN);
            }
        }
    }
}

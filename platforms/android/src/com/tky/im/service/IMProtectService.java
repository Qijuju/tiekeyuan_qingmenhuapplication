package com.tky.im.service;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.support.annotation.Nullable;

import com.tky.im.enums.IMEnums;
import com.tky.im.test.LogPrint;
import com.tky.im.utils.IMStatusManager;

/**
 * Created by tkysls on 2017/4/11.
 */

public class IMProtectService extends Service {
    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (IMStatusManager.getImStatus() != IMEnums.CONNECT_DOWN_BY_HAND && IMStatusManager.getImStatus() != IMEnums.CONNECTED) {
            startService(new Intent(getBaseContext(), IMService.class));
        }
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        if (IMStatusManager.getImStatus() != IMEnums.CONNECT_DOWN_BY_HAND && IMStatusManager.getImStatus() != IMEnums.CONNECTED) {
            startService(new Intent(getBaseContext(), IMService.class));
        }
        super.onDestroy();
    }
}

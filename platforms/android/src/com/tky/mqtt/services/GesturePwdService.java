package com.tky.mqtt.services;

import android.content.Context;
import android.util.Log;

import com.tky.mqtt.base.BaseInterface;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.GesturePwd;
import com.tky.mqtt.dao.GesturePwdDao;
import com.tky.mqtt.dao.Otherpichead;
import com.tky.mqtt.dao.OtherpicheadDao;
import com.tky.mqtt.paho.BaseApplication;

import java.util.List;

/**
 * Created by Administrator on 2017/3/29.
 */
public class GesturePwdService implements BaseInterface<GesturePwd> {
    private static final String TAG = OtherHeadPicService.class.getSimpleName();
    private static GesturePwdService instance;
    private static Context appContext;
    private DaoSession mDaoSession;
    private GesturePwdDao gesturePwdDao;



    private GesturePwdService() {
    }

    public static GesturePwdService getInstance(Context context) {
        if (instance == null) {
            instance = new GesturePwdService();
            if (appContext == null){
                appContext = context.getApplicationContext();
            }
            instance.mDaoSession = BaseApplication.getDaoSession(context);
            instance.gesturePwdDao = instance.mDaoSession.getGesturePwdDao();
        }
        return instance;
    }

    @Override
    public GesturePwd loadDataByArg(String arg) {
        return gesturePwdDao.load(arg);
    }

    @Override
    public List<GesturePwd> loadAllData() {
        return gesturePwdDao.loadAll();
    }

    @Override
    public List<GesturePwd> queryData(String where, String... params) {
        return gesturePwdDao.queryRaw(where, params);
    }

    @Override
    public List<GesturePwd> queryByConditions() {
        return gesturePwdDao.queryBuilder()
                .orderDesc(OtherpicheadDao.Properties.Id)
                .build()
                .list();
    }

    @Override
    public long saveObj(GesturePwd gesturePwd) {
        return gesturePwdDao.insertOrReplace(gesturePwd);
    }

    @Override
    public void saveDataLists(final  List<GesturePwd> list) {
        if(list == null || list.isEmpty()){
            return;
        }
        gesturePwdDao.getSession().runInTx(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < list.size(); i++) {
                    GesturePwd gesturePwd = list.get(i);
                    gesturePwdDao.insertOrReplace(gesturePwd);
                }
            }
        });
    }

    @Override
    public void deleteAllData() {
        gesturePwdDao.deleteAll();
    }

    @Override
    public void deleteDataByArg(String arg) {
        gesturePwdDao.deleteByKey(arg);
        Log.i(TAG, "delete");
    }

    @Override
    public void deleteObj(GesturePwd gesturePwd) {
        gesturePwdDao.delete(gesturePwd);
    }
}

package com.tky.mqtt.services;

import android.content.Context;
import android.util.Log;

import com.tky.mqtt.base.BaseInterface;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.GesturePwd;
import com.tky.mqtt.dao.GesturePwdDao;
import com.tky.mqtt.dao.OtherpicheadDao;
import com.tky.mqtt.dao.QYYIconPath;
import com.tky.mqtt.dao.QYYIconPathDao;
import com.tky.mqtt.paho.BaseApplication;

import java.util.List;

/**
 * Created by bim on 2017/10/24.
 */

public class QYYIconPathService implements BaseInterface<QYYIconPath> {
    private static final String TAG = QYYIconPathService.class.getSimpleName();
    private static QYYIconPathService instance;
    private static Context appContext;
    private DaoSession mDaoSession;
    private QYYIconPathDao qyyIconPathDao;



    private QYYIconPathService() {
    }

    public static QYYIconPathService getInstance(Context context) {
        if (instance == null) {
            instance = new QYYIconPathService();
            if (appContext == null){
                appContext = context.getApplicationContext();
            }
            instance.mDaoSession = BaseApplication.getDaoSession(context);
            instance.qyyIconPathDao = instance.mDaoSession.getQYYIconPathDao();
        }
        return instance;
    }

    @Override
    public QYYIconPath loadDataByArg(String arg) {
        return qyyIconPathDao.load(arg);
    }

    @Override
    public List<QYYIconPath> loadAllData() {
        return qyyIconPathDao.loadAll();
    }

    @Override
    public List<QYYIconPath> queryData(String where, String... params) {
        return qyyIconPathDao.queryRaw(where, params);
    }

    @Override
    public List<QYYIconPath> queryByConditions() {
        return qyyIconPathDao.queryBuilder()
                .orderDesc(OtherpicheadDao.Properties.Id)
                .build()
                .list();
    }

    @Override
    public long saveObj(QYYIconPath qyyIconPath) {
        return qyyIconPathDao.insertOrReplace(qyyIconPath);
    }

    @Override
    public void saveDataLists(final List<QYYIconPath> list) {
        if(list == null || list.isEmpty()){
            return;
        }
        qyyIconPathDao.getSession().runInTx(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < list.size(); i++) {
                    QYYIconPath qyyIconPath = list.get(i);
                    qyyIconPathDao.insertOrReplace(qyyIconPath);
                }
            }
        });
    }

    @Override
    public void deleteAllData() {
        qyyIconPathDao.deleteAll();
    }

    @Override
    public void deleteDataByArg(String arg) {
        qyyIconPathDao.deleteByKey(arg);
        Log.i(TAG, "delete");
    }

    @Override
    public void deleteObj(QYYIconPath qyyIconPath) {
        qyyIconPathDao.delete(qyyIconPath);
    }
}

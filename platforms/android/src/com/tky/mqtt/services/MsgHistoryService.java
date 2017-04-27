package com.tky.mqtt.services;

import android.content.Context;
import android.util.Log;

import com.tky.mqtt.base.BaseInterface;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.MessagesDao;
import com.tky.mqtt.dao.MsgHistory;
import com.tky.mqtt.dao.MsgHistoryDao;
import com.tky.mqtt.dao.NotifyList;
import com.tky.mqtt.dao.NotifyListDao;
import com.tky.mqtt.dao.TopContactsDao;
import com.tky.mqtt.paho.BaseApplication;

import java.util.List;

/**
 * Created by Administrator on 2016/9/9.
 */
public class MsgHistoryService implements BaseInterface<MsgHistory>{
    private static final String TAG = MsgHistoryService.class.getSimpleName();
    private static MsgHistoryService instance;
    private static Context appContext;
    private DaoSession mDaoSession;
    private MsgHistoryDao msgHistoryDao;

    public MsgHistoryService() {
    }
    public static MsgHistoryService getInstance(Context context) {
        if (instance == null) {
            instance = new MsgHistoryService();
            if (appContext == null){
                appContext = context.getApplicationContext();
            }
            instance.mDaoSession = BaseApplication.getDaoSession(context);
            instance.msgHistoryDao = instance.mDaoSession.getMsgHistoryDao();
        }
        return instance;
    }

    @Override
    public MsgHistory loadDataByArg(String arg) {
        return msgHistoryDao.load(arg);
    }

    @Override
    public List<MsgHistory> loadAllData() {
        return msgHistoryDao.loadAll();
    }

    @Override
    public List<MsgHistory> queryData(String where, String... params) {
        return msgHistoryDao.queryRaw(where, params);
    }

    @Override
    public List<MsgHistory> queryByConditions() {
        return null;
    }

    @Override
    public long saveObj(MsgHistory msgHistory) {
        return msgHistoryDao.insertOrReplace(msgHistory);
    }

    @Override
    public void saveDataLists(final List<MsgHistory> list) {
        if(list == null || list.isEmpty()){
            return;
        }
        msgHistoryDao.getSession().runInTx(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < list.size(); i++) {
                    MsgHistory msgHistory = list.get(i);
                    msgHistoryDao.insertOrReplace(msgHistory);
                }
            }
        });
    }

    @Override
    public void deleteAllData() {
        msgHistoryDao.deleteAll();
    }

    @Override
    public void deleteDataByArg(String arg) {
        msgHistoryDao.deleteByKey(arg);
        Log.i(TAG, "delete");
    }

    @Override
    public void deleteObj(MsgHistory msgHistory) {
        msgHistoryDao.delete(msgHistory);
    }


    public List<MsgHistory> queryMsg(String type){

        return msgHistoryDao.queryBuilder()
                .where(MsgHistoryDao.Properties.Type.eq(type))
                .orderDesc(MsgHistoryDao.Properties.When)
                .limit(10)
                .build()
                .list();
    }



}

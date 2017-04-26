package com.tky.mqtt.services;

import android.content.Context;
import android.util.Log;

import com.tky.mqtt.base.BaseInterface;
import com.tky.mqtt.dao.ChatList;
import com.tky.mqtt.dao.ChatListDao;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.Otherpichead;
import com.tky.mqtt.dao.OtherpicheadDao;
import com.tky.mqtt.paho.BaseApplication;

import java.util.List;

import de.greenrobot.dao.query.QueryBuilder;

/**
 * Created by Administrator on 2017/1/11.
 */
public class OtherHeadPicService implements BaseInterface<Otherpichead> {
    private static final String TAG = OtherHeadPicService.class.getSimpleName();
    private static OtherHeadPicService instance;
    private static Context appContext;
    private DaoSession mDaoSession;
    private OtherpicheadDao otherpicheadDao;



    private OtherHeadPicService() {
    }

    public static OtherHeadPicService getInstance(Context context) {
        if (instance == null) {
            instance = new OtherHeadPicService();
            if (appContext == null){
                appContext = context.getApplicationContext();
            }
            instance.mDaoSession = BaseApplication.getDaoSession(context);
            instance.otherpicheadDao = instance.mDaoSession.getOtherpicheadDao();
        }
        return instance;
    }

    @Override
    public Otherpichead loadDataByArg(String arg) {
        return otherpicheadDao.load(arg);
    }

    @Override
    public List<Otherpichead> loadAllData() {
        return otherpicheadDao.loadAll();
    }

    @Override
    public List<Otherpichead> queryData(String where, String... params) {
        return otherpicheadDao.queryRaw(where, params);
    }

    @Override
    public List<Otherpichead> queryByConditions() {
        return otherpicheadDao.queryBuilder()
                .orderDesc(OtherpicheadDao.Properties.Id)
                .build()
                .list();
    }

    @Override
    public long saveObj(Otherpichead otherpichead) {
        return otherpicheadDao.insertOrReplace(otherpichead);
    }

    @Override
    public void saveDataLists(final List<Otherpichead> list) {
        if(list == null || list.isEmpty()){
            return;
        }
        otherpicheadDao.getSession().runInTx(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < list.size(); i++) {
                    Otherpichead otherpichead = list.get(i);
                    otherpicheadDao.insertOrReplace(otherpichead);
                }
            }
        });
    }

    @Override
    public void deleteAllData() {
        otherpicheadDao.deleteAll();
    }

    @Override
    public void deleteDataByArg(String arg) {
        otherpicheadDao.deleteByKey(arg);
        Log.i(TAG, "delete");
    }

    @Override
    public void deleteObj(Otherpichead otherpichead) {
        otherpicheadDao.delete(otherpichead);
    }
}

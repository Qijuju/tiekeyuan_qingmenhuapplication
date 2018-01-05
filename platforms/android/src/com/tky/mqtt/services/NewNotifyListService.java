package com.tky.mqtt.services;

import android.content.Context;
import android.util.Log;

import com.tky.mqtt.base.BaseInterface;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.NewNotifyList;
import com.tky.mqtt.dao.NewNotifyListDao;
import com.tky.mqtt.dao.OtherpicheadDao;
import com.tky.mqtt.paho.BaseApplication;

import java.util.List;

/**
 * Created by bim on 2017/10/24.
 */

public class NewNotifyListService implements BaseInterface<NewNotifyList> {

    private static final String TAG = NewNotifyListService.class.getSimpleName();
    private static NewNotifyListService instance;
    private static Context appContext;
    private DaoSession mDaoSession;
    private NewNotifyListDao newNotifyListDao;



    private NewNotifyListService() {
    }

    public static NewNotifyListService getInstance(Context context) {
        if (instance == null) {
            instance = new NewNotifyListService();
            if (appContext == null){
                appContext = context.getApplicationContext();
            }
            instance.mDaoSession = BaseApplication.getDaoSession(context);
            instance.newNotifyListDao = instance.mDaoSession.getNewNotifyListDao();
        }
        return instance;
    }

    @Override
    public void deleteObj(NewNotifyList newNotifyList) {
        newNotifyListDao.delete(newNotifyList);
    }

    @Override
    public void deleteDataByArg(String arg) {
        newNotifyListDao.deleteByKey(arg);
        Log.i(TAG, "delete");
    }

    @Override
    public void deleteAllData() {
        newNotifyListDao.deleteAll();
    }

    @Override
    public void saveDataLists(final List<NewNotifyList> list) {
        if(list == null || list.isEmpty()){
            return;
        }
        newNotifyListDao.getSession().runInTx(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < list.size(); i++) {
                    NewNotifyList newNotifyList = list.get(i);
                    newNotifyListDao.insertOrReplace(newNotifyList);
                }
            }
        });
    }

    @Override
    public long saveObj(NewNotifyList newNotifyList) {
        return newNotifyListDao.insertOrReplace(newNotifyList);
    }

    @Override
    public List<NewNotifyList> queryByConditions() {
        return newNotifyListDao.queryBuilder()
                .orderDesc(OtherpicheadDao.Properties.Id)
                .build()
                .list();
    }

    @Override
    public List<NewNotifyList> queryData(String where, String... params) {
        return newNotifyListDao.queryRaw(where, params);
    }

    @Override
    public List<NewNotifyList> loadAllData() {
        return newNotifyListDao.loadAll();
    }

    @Override
    public NewNotifyList loadDataByArg(String arg) {
        return newNotifyListDao.load(arg);
    }
}

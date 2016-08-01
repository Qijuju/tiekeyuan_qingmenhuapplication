package com.tky.mqtt.services;

import android.content.Context;

import com.tky.mqtt.base.BaseInterface;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.TopContacts;
import com.tky.mqtt.dao.TopContactsDao;
import com.tky.mqtt.paho.BaseApplication;

import java.util.List;

/**
 * Created by Administrator on 2016/7/29.
 */
public class TopContactsService implements BaseInterface<TopContacts>{

    public static final String TAG=TopContactsService.class.getSimpleName();
    public static TopContactsService instance;
    private static Context appContext;
    private DaoSession mDaoSession;
    private TopContactsDao topContactsDao;


    public TopContactsService(){

    }

    public static TopContactsService getInstance(Context context){
        if (instance==null){
            instance=new TopContactsService();
            if (appContext==null){
                appContext=context.getApplicationContext();
            }
            instance.mDaoSession = BaseApplication.getDaoSession(context);
            instance.topContactsDao = instance.mDaoSession.getTopContactsDao();
        }

        return instance;
    }


    @Override
    public TopContacts loadDataByArg(String arg) {
        return topContactsDao.load(arg);
    }

    @Override
    public List<TopContacts> loadAllData() {

        return topContactsDao.loadAll();
    }

    @Override
    public List<TopContacts> queryData(String where, String... params) {
        return topContactsDao.queryRaw(where,params);
    }

    @Override
    public long saveObj(TopContacts topContacts) {
        return topContactsDao.insertOrReplace(topContacts);
    }

    @Override
    public void saveDataLists(List<TopContacts> list) {

    }

    @Override
    public void deleteAllData() {
        topContactsDao.deleteAll();
    }

    @Override
    public void deleteDataByArg(String arg) {

    }

    @Override
    public void deleteObj(TopContacts topContacts) {
        topContactsDao.delete(topContacts);
    }
}

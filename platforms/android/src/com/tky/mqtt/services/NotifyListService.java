package com.tky.mqtt.services;

import android.content.Context;
import android.util.Log;

import com.tky.mqtt.base.BaseInterface;
import com.tky.mqtt.dao.ChatList;
import com.tky.mqtt.dao.ChatListDao;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.NotifyList;
import com.tky.mqtt.dao.NotifyListDao;
import com.tky.mqtt.paho.BaseApplication;

import java.util.List;

import de.greenrobot.dao.query.QueryBuilder;

/**
 * Created by Administrator on 2016/9/12.
 */
public class NotifyListService implements BaseInterface<NotifyList>{
    private static final String TAG = MessagesService.class.getSimpleName();
    private static NotifyListService instance;
    private static Context appContext;
    private DaoSession mDaoSession;
    private NotifyListDao notifyListDao;


    private NotifyListService() {
    }

    public static NotifyListService getInstance(Context context) {
        if (instance == null) {
            instance = new NotifyListService();
            if (appContext == null){
                appContext = context.getApplicationContext();
            }
            instance.mDaoSession = BaseApplication.getDaoSession(context);
            instance.notifyListDao = instance.mDaoSession.getNotifyListDao();
        }
        return instance;
    }
    @Override
    public void deleteAllData() {
        notifyListDao.deleteAll();
    }

    @Override
    public void deleteDataByArg(String arg) {
        notifyListDao.deleteByKey(arg);
        Log.i(TAG, "delete");
    }

    @Override
    public void deleteObj(NotifyList chatList) {
        notifyListDao.delete(chatList);
    }

    @Override
    public List<NotifyList> loadAllData() {
        return notifyListDao.loadAll();
    }

    @Override
    public NotifyList loadDataByArg(String arg) {
        return notifyListDao.load(arg);
    }

    @Override
    public List<NotifyList> queryData(String where, String... params) {
        return notifyListDao.queryRaw(where, params);
    }

    @Override
    public List<NotifyList> queryByConditions() {
        return notifyListDao.queryBuilder()
                .orderDesc(NotifyListDao.Properties.LastDate)
                .build()
                .list();
    }

    @Override
    public void saveDataLists(final List<NotifyList> list) {
        if(list == null || list.isEmpty()){
            return;
        }
        notifyListDao.getSession().runInTx(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < list.size(); i++) {
                    NotifyList personInfo = list.get(i);
                    notifyListDao.insertOrReplace(personInfo);
                }
            }
        });
    }

    @Override
    public long saveObj(NotifyList notifyList) {
        return notifyListDao.insertOrReplace(notifyList);
    }

    public List<NotifyList> queryByType(String one,String two){
        QueryBuilder qb = notifyListDao.queryBuilder();
        qb.or(NotifyListDao.Properties.ChatType.eq(one),ChatListDao.Properties.ChatType.eq(two));
        List<NotifyList> notifyLists=qb.list();
        return notifyLists;

    }
}

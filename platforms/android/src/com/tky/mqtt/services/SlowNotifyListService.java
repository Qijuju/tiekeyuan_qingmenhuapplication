package com.tky.mqtt.services;

import android.content.Context;
import android.util.Log;

import com.tky.mqtt.base.BaseInterface;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.SlowNotifyList;
import com.tky.mqtt.dao.SlowNotifyListDao;
import com.tky.mqtt.paho.BaseApplication;

import java.util.List;

import de.greenrobot.dao.query.QueryBuilder;

/**
 * Created by Administrator on 2016/10/10.
 */
public class SlowNotifyListService implements BaseInterface<SlowNotifyList> {
    private static final String TAG = MessagesService.class.getSimpleName();
    private static SlowNotifyListService instance;
    private static Context appContext;
    private DaoSession mDaoSession;
    private SlowNotifyListDao slowNotifyListDao;


    private SlowNotifyListService() {
    }

    public static SlowNotifyListService getInstance(Context context) {
        if (instance == null) {
            instance = new SlowNotifyListService();
            if (appContext == null){
                appContext = context.getApplicationContext();
            }
            instance.mDaoSession = BaseApplication.getDaoSession(context);
            instance.slowNotifyListDao = instance.mDaoSession.getSlowNotifyListDao();
        }
        return instance;
    }
    @Override
    public void deleteAllData() {
        slowNotifyListDao.deleteAll();
    }

    @Override
    public void deleteDataByArg(String arg) {
        slowNotifyListDao.deleteByKey(arg);
        Log.i(TAG, "delete");
    }

    @Override
    public void deleteObj(SlowNotifyList chatList) {
        slowNotifyListDao.delete(chatList);
    }

    @Override
    public List<SlowNotifyList> loadAllData() {
        return slowNotifyListDao.loadAll();
    }

    @Override
    public SlowNotifyList loadDataByArg(String arg) {
        return slowNotifyListDao.load(arg);
    }

    @Override
    public List<SlowNotifyList> queryData(String where, String... params) {
        return slowNotifyListDao.queryRaw(where, params);
    }

    @Override
    public List<SlowNotifyList> queryByConditions() {
        return slowNotifyListDao.queryBuilder()
                .orderDesc(SlowNotifyListDao.Properties.LastDate)
                .build()
                .list();
    }

    @Override
    public void saveDataLists(final List<SlowNotifyList> list) {
        if(list == null || list.isEmpty()){
            return;
        }
        slowNotifyListDao.getSession().runInTx(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < list.size(); i++) {
                    SlowNotifyList personInfo = list.get(i);
                    slowNotifyListDao.insertOrReplace(personInfo);
                }
            }
        });
    }

    @Override
    public long saveObj(SlowNotifyList notifyList) {
        return slowNotifyListDao.insertOrReplace(notifyList);
    }


    /**
     * 区分紧急和一般的信息
     */
    public List<SlowNotifyList>  querySlowNotifyChat(String type,String sessionid){

        return slowNotifyListDao.queryBuilder()
                .orderDesc(SlowNotifyListDao.Properties.LastDate)
                .where(SlowNotifyListDao.Properties.ChatType.eq(type))
                .where(SlowNotifyListDao.Properties.Id.eq(sessionid))
                .build()
                .list();
    }


    /**
     * 按时间划分数据
     */
    public List<SlowNotifyList>  querySlowDataByDate(String date,String type){

        return slowNotifyListDao.queryBuilder()
                .orderDesc(SlowNotifyListDao.Properties.LastDate)
                .where(SlowNotifyListDao.Properties.LastDate.gt(date))
                .where(SlowNotifyListDao.Properties.ChatType.like(type))
                .build()
                .list();
    }
}

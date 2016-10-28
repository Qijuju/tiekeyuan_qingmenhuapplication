package com.tky.mqtt.services;

import android.content.Context;
import android.util.Log;

import com.tky.mqtt.base.BaseInterface;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.SystemMsg;
import com.tky.mqtt.dao.SystemMsgDao;
import com.tky.mqtt.paho.BaseApplication;

import java.util.List;

/**
 * Created by Administrator on 2016/9/9.
 */
public class SystemMsgService implements BaseInterface<SystemMsg> {
    private static final String TAG = MessagesService.class.getSimpleName();
    private static SystemMsgService instance;
    private static Context appContext;
    private DaoSession mDaoSession;
    private SystemMsgDao systemMsgDao;


    private SystemMsgService() {
    }

    public static SystemMsgService getInstance(Context context) {
        if (instance == null) {
            instance = new SystemMsgService();
            if (appContext == null){
                appContext = context.getApplicationContext();
            }
            instance.mDaoSession = BaseApplication.getDaoSession(context);
            instance.systemMsgDao = instance.mDaoSession.getSystemMsgDao();
        }
        return instance;
    }

    @Override
    public SystemMsg loadDataByArg(String arg) {
        return systemMsgDao.load(arg);
    }


    @Override
    public List<SystemMsg> loadAllData() {
        return systemMsgDao.loadAll();
    }



    /**
     * query list with where clause
     * ex: begin_date_time >= ? AND end_date_time <= ?
     * @param where where clause, include 'where' word
     * @param params query parameters
     * @return
     */

    @Override
    public List<SystemMsg> queryData(String where, String... params) {
        return systemMsgDao.queryRaw(where, params);
    }

    @Override
    public List<SystemMsg> queryByConditions() {
        return systemMsgDao.queryBuilder()
                .orderDesc(SystemMsgDao.Properties.Istop)
                .orderDesc(SystemMsgDao.Properties.When)
                .build()
                .list();
    }



    /**
     * insert or update note
     * @param message
     * @return insert or update note id
     */
    @Override
    public long saveObj(SystemMsg message) {
        return systemMsgDao.insertOrReplace(message);
    }

    /**
     * insert or update noteList use transaction
     * @param list
     */
    @Override
    public void saveDataLists(final List<SystemMsg> list) {
        if(list == null || list.isEmpty()){
            return;
        }
        systemMsgDao.getSession().runInTx(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < list.size(); i++) {
                    SystemMsg personInfo = list.get(i);
                    systemMsgDao.insertOrReplace(personInfo);
                }
            }
        });

    }

    /**
     * delete all note
     */
    @Override
    public void deleteAllData() {
        systemMsgDao.deleteAll();
    }

    /**
     * delete note by id
     * @param arg
     */
    @Override
    public void deleteDataByArg(String arg) {
        systemMsgDao.deleteByKey(arg);
        Log.i(TAG, "delete");
    }

    @Override
    public void deleteObj(SystemMsg message) {
        systemMsgDao.delete(message);
    }

    public List<SystemMsg>  querySearchDetail(String name,String msg){

        return systemMsgDao.queryBuilder()
                .orderDesc(SystemMsgDao.Properties.When)
                .where(SystemMsgDao.Properties.Username.eq(name))
                .where(SystemMsgDao.Properties.Message.like(msg))
                .build()
                .list();
    }

    /**
     * 区分紧急程度的信息
     */
    public List<SystemMsg>  queryNewNotifyChat(String type,String sessionid){

        return systemMsgDao.queryBuilder()
                .orderDesc(SystemMsgDao.Properties.When)
                .where(SystemMsgDao.Properties.Msglevel.eq(type))
                .where(SystemMsgDao.Properties.Sessionid.eq(sessionid))
                .build()
                .list();
    }
}

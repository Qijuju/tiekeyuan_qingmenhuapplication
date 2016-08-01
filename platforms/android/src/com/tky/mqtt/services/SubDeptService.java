package com.tky.mqtt.services;

import android.content.Context;
import android.util.Log;


import com.tky.mqtt.base.BaseInterface;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.SubDept;
import com.tky.mqtt.dao.SubDeptDao;
import com.tky.mqtt.paho.BaseApplication;

import java.util.List;

/**
 * Created by Administrator on 2016/7/26.
 */
public class SubDeptService implements BaseInterface <SubDept> {
    private static final String TAG = SubDeptService.class.getSimpleName();
    private static SubDeptService instance;
    private static Context appContext;
    private DaoSession mDaoSession;
    private SubDeptDao subDeptDao;


    private SubDeptService() {
    }

    public static SubDeptService getInstance(Context context) {
        if (instance == null) {
            instance = new SubDeptService();
            if (appContext == null){
                appContext = context.getApplicationContext();
            }
            instance.mDaoSession = BaseApplication.getDaoSession(context);
            instance.subDeptDao = instance.mDaoSession.getSubDeptDao();
        }
        return instance;
    }

    /**
     * 带参数加载
     * @param arg
     * @return
     */
    @Override
    public SubDept loadDataByArg(String arg) {
        return subDeptDao.load(arg);
    }

    @Override
    public List loadAllData() {
        return subDeptDao.loadAll();
    }

    /**
     * query list with where clause
     * ex: begin_date_time >= ? AND end_date_time <= ?
     * @param where where clause, include 'where' word
     * @param params query parameters
     * @return
     */
    @Override
    public List queryData(String where, String... params) {
        return subDeptDao.queryRaw(where, params);
    }

    /**
     * insert or update note
     * @param subDept
     * @return insert or update note id
     */
    @Override
    public long saveObj(SubDept subDept) {
        return subDeptDao.insertOrReplace(subDept);
    }

    /**
     * insert or update noteList use transaction
     * @param list
     */
    @Override
    public void saveDataLists(final List<SubDept> list) {
        if(list == null || list.isEmpty()){
            return;
        }
        subDeptDao.getSession().runInTx(new Runnable() {
            @Override
            public void run() {
                for(int i=0; i<list.size(); i++){
                    SubDept parentDept = list.get(i);
                    subDeptDao.insertOrReplace(parentDept);
                }
            }
        });

    }

    /**
     * delete all note
     */
    @Override
    public void deleteAllData() {
        subDeptDao.deleteAll();
    }


    /**
     * delete note by id
     * @param arg
     */
    @Override
    public void deleteDataByArg(String arg) {
        subDeptDao.deleteByKey(arg);
        Log.i(TAG, "delete");
    }

    /**
     * delete obj
     * @param subDept
     */
    @Override
    public void deleteObj(SubDept subDept) {
        subDeptDao.delete(subDept);
    }
}

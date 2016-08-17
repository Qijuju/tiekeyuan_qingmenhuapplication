package com.tky.mqtt.services;

import android.content.Context;
import android.util.Log;

import com.tky.mqtt.base.BaseInterface;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.ParentDept;
import com.tky.mqtt.dao.ParentDeptDao;
import com.tky.mqtt.paho.BaseApplication;

import java.util.List;

/**
 * Created by Administrator on 2016/7/26.
 */
public class ParentDeptService implements BaseInterface<ParentDept>{
    private static final String TAG = ParentDeptService.class.getSimpleName();
    private static ParentDeptService instance;
    private static Context appContext;
    private DaoSession mDaoSession;
    private ParentDeptDao parentDeptDao;


    private ParentDeptService() {
    }

    public static ParentDeptService getInstance(Context context) {
        if (instance == null) {
            instance = new ParentDeptService();
            if (appContext == null){
                appContext = context.getApplicationContext();
            }
            instance.mDaoSession = BaseApplication.getDaoSession(context);
            instance.parentDeptDao = instance.mDaoSession.getParentDeptDao();
        }
        return instance;
    }


    /**
     * 带参数加载
     * @param arg
     * @return
     */
    @Override
    public ParentDept loadDataByArg(String arg) {
        return parentDeptDao.load(arg);
    }

    @Override
    public List loadAllData() {
        return parentDeptDao.loadAll();
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
        return parentDeptDao.queryRaw(where, params);
    }

  @Override
  public List<ParentDept> queryByConditions() {
    return null;
  }

  /**
     * insert or update note
     * @param parentDept
     * @return insert or update note id
     */
    @Override
    public long saveObj(ParentDept parentDept) {
        return parentDeptDao.insertOrReplace(parentDept);
    }

    /**
     * insert or update noteList use transaction
     * @param list
     */
    @Override
    public void saveDataLists(final List<ParentDept> list) {
        if(list == null || list.isEmpty()){
            return;
        }
        parentDeptDao.getSession().runInTx(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < list.size(); i++) {
                    ParentDept parentDept = list.get(i);
                    parentDeptDao.insertOrReplace(parentDept);
                }
            }
        });

    }

    /**
     * delete all note
     */
    @Override
    public void deleteAllData() {
        parentDeptDao.deleteAll();
    }


    /**
     * delete note by id
     * @param arg
     */
    @Override
    public void deleteDataByArg(String arg) {
        parentDeptDao.deleteByKey(arg);
        Log.i(TAG, "delete");
    }

    /**
     * delete obj
     * @param parentDept
     */
    @Override
    public void deleteObj(ParentDept parentDept) {
        parentDeptDao.delete(parentDept);
    }


}

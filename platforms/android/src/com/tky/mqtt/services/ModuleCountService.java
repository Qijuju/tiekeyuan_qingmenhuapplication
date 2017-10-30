package com.tky.mqtt.services;

import android.content.Context;
import android.util.Log;

import com.tky.mqtt.base.BaseInterface;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.ModuleCount;
import com.tky.mqtt.dao.ModuleCountDao;
import com.tky.mqtt.paho.BaseApplication;

import java.util.List;

/**
 * Created by Administrator on 2016/10/9.
 */
public class ModuleCountService implements BaseInterface<ModuleCount> {
    private static final String TAG = ModuleCountService.class.getSimpleName();
    private static ModuleCountService instance;
    private static Context appContext;
    private DaoSession mDaoSession;
    private ModuleCountDao moduleCountDao;

    public ModuleCountService(){

    }

    public static ModuleCountService getInstance(Context context) {
        if (instance == null) {
            instance = new ModuleCountService();
            if (appContext == null){
                appContext = context.getApplicationContext();
            }
            instance.mDaoSession = BaseApplication.getDaoSession(context);
            instance.moduleCountDao = instance.mDaoSession.getModuleCountDao();
        }
        return instance;
    }





    @Override
    public ModuleCount loadDataByArg(String arg) {
        return moduleCountDao.load(arg);
    }

    @Override
    public List<ModuleCount> loadAllData() {
        return moduleCountDao.loadAll();

    }

    @Override
    public List<ModuleCount> queryData(String where, String... params) {
        return moduleCountDao.queryRaw(where, params);
    }

    @Override
    public List<ModuleCount> queryByConditions() {
        return null;
    }

    @Override
    public long saveObj(ModuleCount selectedId) {
        return moduleCountDao.insertOrReplace(selectedId);
    }

    @Override
    public void saveDataLists(final List<ModuleCount> list) {
        if(list == null || list.isEmpty()){
            return;
        }
        moduleCountDao.getSession().runInTx(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < list.size(); i++) {
                    ModuleCount selectedId = list.get(i);
                    moduleCountDao.insertOrReplace(selectedId);
                }
            }
        });
    }

    @Override
    public void deleteAllData() {
        moduleCountDao.deleteAll();
    }

    @Override
    public void deleteDataByArg(String arg) {
        moduleCountDao.deleteByKey(arg);
        Log.i(TAG, "delete");
    }

    @Override
    public void deleteObj(ModuleCount selectedId) {
        moduleCountDao.delete(selectedId);
    }

}

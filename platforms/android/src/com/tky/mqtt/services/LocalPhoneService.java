package com.tky.mqtt.services;

import android.content.Context;
import android.util.Log;

import com.tky.mqtt.base.BaseInterface;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.LocalPhone;
import com.tky.mqtt.dao.LocalPhoneDao;
import com.tky.mqtt.dao.SelectedId;
import com.tky.mqtt.paho.BaseApplication;

import java.util.List;

/**
 * Created by Administrator on 2016/9/12.
 */
public class LocalPhoneService implements BaseInterface<LocalPhone> {


  private static final String TAG = LocalPhoneService.class.getSimpleName();
  private static LocalPhoneService instance;
  private static Context appContext;
  private DaoSession mDaoSession;
  private LocalPhoneDao localPhoneDao;

  public LocalPhoneService(){

  }

  public static LocalPhoneService getInstance(Context context) {
    if (instance == null) {
      instance = new LocalPhoneService();
      if (appContext == null){
        appContext = context.getApplicationContext();
      }
      instance.mDaoSession = BaseApplication.getDaoSession(context);
      instance.localPhoneDao = instance.mDaoSession.getLocalPhoneDao();
    }
    return instance;
  }


  @Override
  public LocalPhone loadDataByArg(String arg) {
    return localPhoneDao.load(arg);
  }

  @Override
  public List<LocalPhone> loadAllData() {
    return localPhoneDao.loadAll();
  }

  @Override
  public List<LocalPhone> queryData(String where, String... params) {
    return localPhoneDao.queryRaw(where, params);
  }

  @Override
  public List<LocalPhone> queryByConditions() {
    return localPhoneDao.queryBuilder().orderDesc(LocalPhoneDao.Properties.Isplatform).build().list();
  }

  @Override
  public long saveObj(LocalPhone localPhone) {
    return localPhoneDao.insertOrReplace(localPhone);
  }

  @Override
  public void saveDataLists(final List<LocalPhone> list) {
    if(list == null || list.isEmpty()){
      return;
    }
    localPhoneDao.getSession().runInTx(new Runnable() {
      @Override
      public void run() {
        for (int i = 0; i < list.size(); i++) {
          LocalPhone localPhone = list.get(i);
          localPhoneDao.insertOrReplace(localPhone);
        }
      }
    });
  }

  @Override
  public void deleteAllData() {
    localPhoneDao.deleteAll();
  }

  @Override
  public void deleteDataByArg(String arg) {
    localPhoneDao.deleteByKey(arg);
    Log.i(TAG, "delete");
  }

  @Override
  public void deleteObj(LocalPhone localPhone) {
    localPhoneDao.delete(localPhone);
  }
}

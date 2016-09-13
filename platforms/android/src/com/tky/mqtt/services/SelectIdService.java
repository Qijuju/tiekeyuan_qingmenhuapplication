package com.tky.mqtt.services;

import android.content.Context;
import android.util.Log;

import com.tky.mqtt.base.BaseInterface;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.GroupChats;
import com.tky.mqtt.dao.SelectedId;
import com.tky.mqtt.dao.SelectedIdDao;
import com.tky.mqtt.paho.BaseApplication;

import java.util.List;

/**
 * Created by Administrator on 2016/8/31.
 */
public class SelectIdService implements BaseInterface<SelectedId> {


  private static final String TAG = SelectIdService.class.getSimpleName();
  private static SelectIdService instance;
  private static Context appContext;
  private DaoSession mDaoSession;
  private SelectedIdDao selectedIdDao;

  public SelectIdService(){

  }

  public static SelectIdService getInstance(Context context) {
    if (instance == null) {
      instance = new SelectIdService();
      if (appContext == null){
        appContext = context.getApplicationContext();
      }
      instance.mDaoSession = BaseApplication.getDaoSession(context);
      instance.selectedIdDao = instance.mDaoSession.getSelectedIdDao();
    }
    return instance;
  }





  @Override
  public SelectedId loadDataByArg(String arg) {
    return selectedIdDao.load(arg);
  }

  @Override
  public List<SelectedId> loadAllData() {
    return selectedIdDao.loadAll();

  }

  @Override
  public List<SelectedId> queryData(String where, String... params) {
    return selectedIdDao.queryRaw(where, params);
  }

  @Override
  public List<SelectedId> queryByConditions() {
    return null;
  }

  @Override
  public long saveObj(SelectedId selectedId) {
    return selectedIdDao.insertOrReplace(selectedId);
  }

  @Override
  public void saveDataLists(final List<SelectedId> list) {
    if(list == null || list.isEmpty()){
      return;
    }
    selectedIdDao.getSession().runInTx(new Runnable() {
      @Override
      public void run() {
        for (int i = 0; i < list.size(); i++) {
          SelectedId selectedId = list.get(i);
          selectedIdDao.insertOrReplace(selectedId);
        }
      }
    });
  }

  @Override
  public void deleteAllData() {
    selectedIdDao.deleteAll();
  }

  @Override
  public void deleteDataByArg(String arg) {
    selectedIdDao.deleteByKey(arg);
    Log.i(TAG, "delete");
  }

  @Override
  public void deleteObj(SelectedId selectedId) {
    selectedIdDao.delete(selectedId);
  }


  public List<SelectedId> queryBy(String one,String two){

    return selectedIdDao.queryBuilder().
      where(SelectedIdDao.Properties.Grade.notEq(one))
      .where(SelectedIdDao.Properties.Grade.notEq(two))
      .build()
      .list();

  }


}

package com.tky.mqtt.services;

import android.content.Context;
import android.util.Log;

import com.tky.mqtt.base.BaseInterface;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.GroupChats;
import com.tky.mqtt.dao.GroupChatsDao;
import com.tky.mqtt.dao.Messages;
import com.tky.mqtt.paho.BaseApplication;

import java.util.List;

/**
 * Created by Administrator on 2016/8/24.
 */
public class GroupChatsService implements BaseInterface<GroupChats> {

  private static final String TAG = GroupChatsService.class.getSimpleName();
  private static GroupChatsService instance;
  private static Context appContext;
  private DaoSession mDaoSession;
  private GroupChatsDao groupChatsDao;


  public GroupChatsService(){

  }
  public static GroupChatsService getInstance(Context context) {
    if (instance == null) {
      instance = new GroupChatsService();
      if (appContext == null){
        appContext = context.getApplicationContext();
      }
      instance.mDaoSession = BaseApplication.getDaoSession(context);
      instance.groupChatsDao = instance.mDaoSession.getGroupChatsDao();
    }
    return instance;
  }


  @Override
  public GroupChats loadDataByArg(String arg) {
    return groupChatsDao.load(arg);
  }

  @Override
  public List<GroupChats> loadAllData() {
    return groupChatsDao.loadAll();
  }

  @Override
  public List<GroupChats> queryData(String where, String... params) {
    return groupChatsDao.queryRaw(where, params);
  }

  @Override
  public List<GroupChats> queryByConditions() {
    return null;
  }

  @Override
  public long saveObj(GroupChats groupChats) {
    return groupChatsDao.insertOrReplace(groupChats);
  }

  @Override
  public void saveDataLists(final List<GroupChats> list) {
    if(list == null || list.isEmpty()){
      return;
    }
    groupChatsDao.getSession().runInTx(new Runnable() {
      @Override
      public void run() {
        for (int i = 0; i < list.size(); i++) {
          GroupChats groupChat = list.get(i);
          groupChatsDao.insertOrReplace(groupChat);
        }
      }
    });
  }

  @Override
  public void deleteAllData() {
    groupChatsDao.deleteAll();
  }

  @Override
  public void deleteDataByArg(String arg) {
    groupChatsDao.deleteByKey(arg);
    Log.i(TAG, "delete");
  }

  @Override
  public void deleteObj(GroupChats groupChats) {
    groupChatsDao.delete(groupChats);
  }
}

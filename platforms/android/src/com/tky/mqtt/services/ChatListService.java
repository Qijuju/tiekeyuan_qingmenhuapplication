package com.tky.mqtt.services;

import android.content.Context;
import android.util.Log;

import com.tky.mqtt.base.BaseInterface;
import com.tky.mqtt.dao.ChatList;
import com.tky.mqtt.dao.ChatListDao;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.paho.BaseApplication;

import java.util.List;

/**
 * Created by Administrator on 2016/8/8.
 */
public class ChatListService implements BaseInterface<ChatList>{
    private static final String TAG = MessagesService.class.getSimpleName();
    private static ChatListService instance;
    private static Context appContext;
    private DaoSession mDaoSession;
    private ChatListDao chatListDao;


    private ChatListService() {
    }

    public static ChatListService getInstance(Context context) {
        if (instance == null) {
            instance = new ChatListService();
            if (appContext == null){
                appContext = context.getApplicationContext();
            }
            instance.mDaoSession = BaseApplication.getDaoSession(context);
            instance.chatListDao = instance.mDaoSession.getChatListDao();
        }
        return instance;
    }
    @Override
    public void deleteAllData() {
        chatListDao.deleteAll();
    }

    @Override
    public void deleteDataByArg(String arg) {
        chatListDao.deleteByKey(arg);
        Log.i(TAG, "delete");
    }

    @Override
    public void deleteObj(ChatList chatList) {
        chatListDao.delete(chatList);
    }

    @Override
    public List<ChatList> loadAllData() {
        return chatListDao.loadAll();
    }

    @Override
    public ChatList loadDataByArg(String arg) {
        return chatListDao.load(arg);
    }

    @Override
    public List<ChatList> queryData(String where, String... params) {
        return chatListDao.queryRaw(where, params);
    }

  @Override
  public List<ChatList> queryByConditions() {
    return null;
  }

  @Override
    public void saveDataLists(final List<ChatList> list) {
        if(list == null || list.isEmpty()){
            return;
        }
        chatListDao.getSession().runInTx(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < list.size(); i++) {
                    ChatList personInfo = list.get(i);
                    chatListDao.insertOrReplace(personInfo);
                }
            }
        });
    }

    @Override
    public long saveObj(ChatList chatList) {
        return chatListDao.insertOrReplace(chatList);
    }
}

package com.tky.mqtt.services;

import android.content.Context;
import android.util.Log;

import com.tky.mqtt.base.BaseInterface;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.Messages;
import com.tky.mqtt.dao.MessagesDao;
import com.tky.mqtt.dao.MsgHistory;
import com.tky.mqtt.dao.MsgHistoryDao;
import com.tky.mqtt.dao.TopContactsDao;
import com.tky.mqtt.paho.BaseApplication;

import java.util.List;

/**
 * Created by Administrator on 2016/7/26.
 */
public class MessagesService implements BaseInterface<Messages>{
    private static final String TAG = MessagesService.class.getSimpleName();
    private static MessagesService instance;
    private static Context appContext;
    private DaoSession mDaoSession;
    private MessagesDao messagesDao;


    private MessagesService() {
    }

    public static MessagesService getInstance(Context context) {
        if (instance == null) {
            instance = new MessagesService();
            if (appContext == null){
                appContext = context.getApplicationContext();
            }
            instance.mDaoSession = BaseApplication.getDaoSession(context);
            instance.messagesDao = instance.mDaoSession.getMessagesDao();
        }
        return instance;
    }

    @Override
    public Messages loadDataByArg(String arg) {
        return messagesDao.load(arg);
    }

    @Override
    public List<Messages> loadAllData() {
        return messagesDao.loadAll();
    }



    /**
     * query list with where clause
     * ex: begin_date_time >= ? AND end_date_time <= ?
     * @param where where clause, include 'where' word
     * @param params query parameters
     * @return
     */

    @Override
    public List<Messages> queryData(String where, String... params) {
        return messagesDao.queryRaw(where, params);
    }

  @Override
  public List<Messages> queryByConditions() {
      return messagesDao.queryBuilder()
              .orderDesc(MessagesDao.Properties.When)
              .build()
              .list();
  }



  /**
     * insert or update note
     * @param message
     * @return insert or update note id
     */
    @Override
    public long saveObj(Messages message) {
        return messagesDao.insertOrReplace(message);
    }

    /**
     * insert or update noteList use transaction
     * @param list
     */
    @Override
    public void saveDataLists(final List<Messages> list) {
        if(list == null || list.isEmpty()){
            return;
        }
        messagesDao.getSession().runInTx(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < list.size(); i++) {
                    Messages personInfo = list.get(i);
                    messagesDao.insertOrReplace(personInfo);
                }
            }
        });

    }

    /**
     * delete all note
     */
    @Override
    public void deleteAllData() {
        messagesDao.deleteAll();
    }

    /**
     * delete note by id
     * @param arg
     */
    @Override
    public void deleteDataByArg(String arg) {
        messagesDao.deleteByKey(arg);
        Log.i(TAG, "delete");
    }

    @Override
    public void deleteObj(Messages message) {
        messagesDao.delete(message);
    }

    public List<Messages>  querySearchDetail(String name,String msg){

        return messagesDao.queryBuilder()
                .orderDesc(MessagesDao.Properties.When)
                .where(MessagesDao.Properties.Username.eq(name))
                .where(MessagesDao.Properties.Message.like(msg))
                .build()
                .list();
    }

    /**
     * 区分群聊和单聊的信息
     */
    public List<Messages>  queryGroupOrSingleChat(String type,String sessionid){

        return messagesDao.queryBuilder()
                .orderDesc(MessagesDao.Properties.When)
                .where(MessagesDao.Properties.Type.eq(type))
                .where(MessagesDao.Properties.Sessionid.like(sessionid))
                .build()
                .list();
    }

    public List<Messages>  queryDataByquery(String query){

        return messagesDao.queryBuilder()
                .orderDesc(MessagesDao.Properties.When)
                .where(MessagesDao.Properties.Message.like(query))
                .where(MessagesDao.Properties.Username.like(query))
                .build()
                .list();
    }

    /**
     * 根据对话框id+isread状态取出对应的messagelist
     */

    public List<Messages> queryDataByIdAndIsread(String sessionid,String isread){
        return messagesDao.queryBuilder().orderDesc(MessagesDao.Properties.When)
                .where(MessagesDao.Properties.Sessionid.eq(sessionid))
                .where(MessagesDao.Properties.Isread.eq(isread))
                .build()
                .list();
    }


  public List<Messages> queryFailure(){

    return messagesDao.queryBuilder().where(MessagesDao.Properties.IsFailure.eq("false")).where(MessagesDao.Properties.IsSuccess.eq("false")).build().list();

  }


}

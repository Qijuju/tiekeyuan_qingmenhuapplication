package com.tky.mqtt.services;

import android.content.Context;

import com.tky.mqtt.base.BaseInterface;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.FilePicture;
import com.tky.mqtt.dao.FilePictureDao;
import com.tky.mqtt.dao.TopContacts;
import com.tky.mqtt.dao.TopContactsDao;
import com.tky.mqtt.paho.BaseApplication;

import java.util.List;

/**
 * Created by Administrator on 2016/7/29.
 */
public class FilePictureService implements BaseInterface<FilePicture>{

    public static final String TAG=FilePictureService.class.getSimpleName();
    public static FilePictureService instance;
    private static Context appContext;
    private DaoSession mDaoSession;
    private FilePictureDao filePictureDao;


    public FilePictureService(){

    }

    public static FilePictureService getInstance(Context context){
        if (instance==null){
            instance=new FilePictureService();
            if (appContext==null){
                appContext=context.getApplicationContext();
            }
            instance.mDaoSession = BaseApplication.getDaoSession(context);
            instance.filePictureDao = instance.mDaoSession.getFilePictureDao();
        }

        return instance;
    }


    @Override
    public FilePicture loadDataByArg(String arg) {
        return filePictureDao.load(arg);
    }

    @Override
    public List<FilePicture> loadAllData() {
        return filePictureDao.loadAll();
    }

    @Override
    public List<FilePicture> queryData(String where, String... params) {
        return filePictureDao.queryRaw(where, params);
    }

    @Override
    public List<FilePicture> queryByConditions() {

        return null;
    }

    @Override
    public long saveObj(FilePicture filePicture) {
        return filePictureDao.insertOrReplace(filePicture);
    }

    @Override
    public void saveDataLists(List<FilePicture> list) {

    }

    @Override
    public void deleteAllData() {
        filePictureDao.deleteAll();
    }

    @Override
    public void deleteDataByArg(String arg) {
        filePictureDao.deleteByKey(arg);
    }

    @Override
    public void deleteObj(FilePicture filePicture) {
        filePictureDao.delete(filePicture);
    }


    public List<FilePicture> queryFilePic(String sessionid,String type){

        return filePictureDao.queryBuilder()
                .where(FilePictureDao.Properties.Sessionid.eq(sessionid))
                .where(FilePictureDao.Properties.Type.eq(type))
                .orderAsc(FilePictureDao.Properties.When)
                .build()
                .list();
    }
}

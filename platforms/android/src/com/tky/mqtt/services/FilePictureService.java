package com.tky.mqtt.services;

import android.content.Context;

import com.tky.mqtt.base.BaseInterface;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.FilePicture;
import com.tky.mqtt.dao.FilePictureDao;
import com.tky.mqtt.dao.SystemMsg;
import com.tky.mqtt.dao.SystemMsgDao;
import com.tky.mqtt.dao.TopContacts;
import com.tky.mqtt.dao.TopContactsDao;
import com.tky.mqtt.paho.BaseApplication;
import com.tky.mqtt.paho.ToastUtil;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
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

    //查找今天的
    public List<FilePicture> queryTodayFile(String sessionid,String type){

        Calendar calendar=Calendar.getInstance();

        int year=calendar.get(Calendar.YEAR);
        int month=calendar.get(Calendar.MONTH)+1;
        int day=calendar.get(Calendar.DAY_OF_MONTH);

        String syear=year+"";
        String smonth=month+"";
        String sday=day+"";

        List<FilePicture> list=new ArrayList<FilePicture>();
        if(day<10){
            sday=0+sday;
        }

        if(month<10){
          smonth=0+smonth;
        }

        String start=syear+smonth+sday+"000000";
        String end=syear+smonth+sday+"235959";

        DateFormat formatter = new SimpleDateFormat("yyyyMMddhhmmss");

        try {
            long stmill=formatter.parse(start).getTime();
            long etmill=formatter.parse(end).getTime();

            //gt大于  lt小于
            list= filePictureDao.queryBuilder()
                    .where(FilePictureDao.Properties.Sessionid.eq(sessionid))
                    .where(FilePictureDao.Properties.Type.eq(type))
                    .where(FilePictureDao.Properties.When.gt(stmill))
                    .orderDesc(FilePictureDao.Properties.When)
                    .build().list();

        } catch (ParseException e) {
            e.printStackTrace();
        }

        return list;
    }

    //查找本周的File  大于本周1 的开始时间 小于今天的时间

    public List<FilePicture> queryWeekFile(String sessionid,String type){

        Calendar calendar=Calendar.getInstance();

        int year=calendar.get(Calendar.YEAR);
        int month=calendar.get(Calendar.MONTH)+1;
        int day=calendar.get(Calendar.DAY_OF_MONTH);

        String syear=year+"";
        String smonth=month+"";
        String sday=day+"";

        List<FilePicture> list=new ArrayList<FilePicture>();
        if(day<10){
            sday=0+sday;
        }

        if(month<10){
          smonth=0+smonth;
        }

        //拿到的今天的时间
        String start=syear+smonth+sday+"000000";//2016 11-10 000000

        //拿到本周周一的时间
        calendar.setFirstDayOfWeek(Calendar.MONDAY);
        calendar.setTime(new Date());
        calendar.set(Calendar.DAY_OF_WEEK, calendar.getFirstDayOfWeek());

        SimpleDateFormat sdf=new SimpleDateFormat("yyyyMMdd");
        String end=sdf.format(calendar.getTime ())+"000000";// 2016 11-07 000000



        DateFormat formatter = new SimpleDateFormat("yyyyMMddhhmmss");

        try {
            long stmill=formatter.parse(start).getTime();//今天的
            long etmill=formatter.parse(end).getTime();//周一
            //gt大于  lt小于
            list= filePictureDao.queryBuilder()
                    .where(FilePictureDao.Properties.Sessionid.eq(sessionid))
                    .where(FilePictureDao.Properties.Type.eq(type))
                    .where(FilePictureDao.Properties.When.gt(etmill))
                    .where(FilePictureDao.Properties.When.lt(stmill))
                    .orderDesc(FilePictureDao.Properties.When)
                    .build().list();

        } catch (ParseException e) {
            e.printStackTrace();
        }

        return list;
    }







    //查找本月的File   从本月的一号  到今天的的星期几为止
    public List<FilePicture> queryMonthFile(String sessionid,String type){

        List<FilePicture> list=new ArrayList<FilePicture>();


        Calendar calendar=Calendar.getInstance();

        int year=calendar.get(Calendar.YEAR);
        int month=calendar.get(Calendar.MONTH)+1;


        String syear=year+"";
        String smonth=month+"";
        if(month<10){
            smonth=0+smonth;
        }


        String start=syear+smonth+"01000000";//本月的  2016 11 01 000000




        //拿到本周周一的时间
        calendar.setFirstDayOfWeek(Calendar.MONDAY);
        calendar.setTime(new Date());
        calendar.set(Calendar.DAY_OF_WEEK, calendar.getFirstDayOfWeek());

        SimpleDateFormat sdf=new SimpleDateFormat("yyyyMMdd");
        String end=sdf.format(calendar.getTime ())+"000000";// 2016 11-07 000000


        DateFormat formatter = new SimpleDateFormat("yyyyMMddhhmmss");

        try {
            long stmill=formatter.parse(start).getTime();
            long etmill=formatter.parse(end).getTime();

            //gt大于  lt小于
            list= filePictureDao.queryBuilder()
                    .where(FilePictureDao.Properties.Sessionid.eq(sessionid))
                    .where(FilePictureDao.Properties.Type.eq(type))
                    .where(FilePictureDao.Properties.When.gt(stmill))//大于月初  小于本周的周一的时间
                    .where(FilePictureDao.Properties.When.lt(etmill))
                    .orderDesc(FilePictureDao.Properties.When)
                    .build().list();

        } catch (ParseException e) {
            e.printStackTrace();
        }

        return list;





    }

    //查找以前的的File
    public List<FilePicture> queryLongFile(String sessionid,String type){

        Calendar calendar=Calendar.getInstance();

        int year=calendar.get(Calendar.YEAR);
        int month=calendar.get(Calendar.MONTH)+1;

        String syear=year+"";
        String smonth=month+"";

        if(month<10){
            smonth=0+smonth;
        }

        List<FilePicture> list=new ArrayList<FilePicture>();

        String start=syear+smonth+"01000000";

        DateFormat formatter = new SimpleDateFormat("yyyyMMddhhmmss");

        try {
            long stmill=formatter.parse(start).getTime();

            //gt大于  lt小于
            list= filePictureDao.queryBuilder()
                    .where(FilePictureDao.Properties.Sessionid.eq(sessionid))
                    .where(FilePictureDao.Properties.Type.eq(type))
                    .where(FilePictureDao.Properties.When.lt(stmill))
                    .orderDesc(FilePictureDao.Properties.When)
                    .build().list();

        } catch (ParseException e) {
            e.printStackTrace();
        }

        return list;
    }



    public void deleteBySessionid(String sessionid){

      List<FilePicture> filePictures=new ArrayList<FilePicture>();

      filePictures= filePictureDao.queryBuilder()
        .where(FilePictureDao.Properties.Sessionid.eq(sessionid))
        .build().list();

      if(filePictures.size()==0){
        return;
      }else{
        filePictureDao.deleteInTx(filePictures);
      }


      //filePictureDao.deleteAll();


    }






}

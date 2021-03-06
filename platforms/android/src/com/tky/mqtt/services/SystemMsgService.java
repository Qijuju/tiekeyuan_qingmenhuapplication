package com.tky.mqtt.services;

import android.content.Context;
import android.util.Log;

import com.tky.mqtt.base.BaseInterface;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.FilePicture;
import com.tky.mqtt.dao.FilePictureDao;
import com.tky.mqtt.dao.SystemMsg;
import com.tky.mqtt.dao.SystemMsgDao;
import com.tky.mqtt.paho.BaseApplication;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * Created by Administrator on 2016/9/9.
 */
public class SystemMsgService implements BaseInterface<SystemMsg> {
    private static final String TAG = MessagesService.class.getSimpleName();
    private static SystemMsgService instance;
    private static Context appContext;
    private DaoSession mDaoSession;
    private SystemMsgDao systemMsgDao;


    private SystemMsgService() {
    }

    public static SystemMsgService getInstance(Context context) {
        if (instance == null) {
            instance = new SystemMsgService();
            if (appContext == null){
                appContext = context.getApplicationContext();
            }
            instance.mDaoSession = BaseApplication.getDaoSession(context);
            instance.systemMsgDao = instance.mDaoSession.getSystemMsgDao();
        }
        return instance;
    }

    @Override
    public SystemMsg loadDataByArg(String arg) {
        return systemMsgDao.load(arg);
    }


    @Override
    public List<SystemMsg> loadAllData() {
        return systemMsgDao.loadAll();
    }



    /**
     * query list with where clause
     * ex: begin_date_time >= ? AND end_date_time <= ?
     * @param where where clause, include 'where' word
     * @param params query parameters
     * @return
     */

    @Override
    public List<SystemMsg> queryData(String where, String... params) {
        return systemMsgDao.queryRaw(where, params);
    }

    @Override
    public List<SystemMsg> queryByConditions() {
        return systemMsgDao.queryBuilder()
                .orderDesc(SystemMsgDao.Properties.Istop)
                .orderDesc(SystemMsgDao.Properties.When)
                .build()
                .list();
    }



    /**
     * insert or update note
     * @param message
     * @return insert or update note id
     */
    @Override
    public long saveObj(SystemMsg message) {
        return systemMsgDao.insertOrReplace(message);
    }

    /**
     * insert or update noteList use transaction
     * @param list
     */
    @Override
    public void saveDataLists(final List<SystemMsg> list) {
        if(list == null || list.isEmpty()){
            return;
        }
        systemMsgDao.getSession().runInTx(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < list.size(); i++) {
                    SystemMsg personInfo = list.get(i);
                    systemMsgDao.insertOrReplace(personInfo);
                }
            }
        });

    }

    /**
     * delete all note
     */
    @Override
    public void deleteAllData() {
        systemMsgDao.deleteAll();
    }

    /**
     * delete note by id
     * @param arg
     */
    @Override
    public void deleteDataByArg(String arg) {
        systemMsgDao.deleteByKey(arg);
        Log.i(TAG, "delete");
    }

    @Override
    public void deleteObj(SystemMsg message) {
        systemMsgDao.delete(message);
    }

    public List<SystemMsg>  querySearchDetail(String name,String msg){

        return systemMsgDao.queryBuilder()
                .orderDesc(SystemMsgDao.Properties.When)
                .where(SystemMsgDao.Properties.Username.eq(name))
                .where(SystemMsgDao.Properties.Message.like(msg))
                .build()
                .list();
    }

    /**
     * 区分紧急程度的信息
     */
    public List<SystemMsg>  queryNewNotifyChat(String type,String sessionid){

        return systemMsgDao.queryBuilder()
                .orderDesc(SystemMsgDao.Properties.When)
                .where(SystemMsgDao.Properties.Msglevel.eq(type))
                .where(SystemMsgDao.Properties.Sessionid.eq(sessionid))
                .build()
                .list();
    }


    /**
     * 查询今天的
     */
    public List<SystemMsg>  queryByToday(){


        Calendar calendar=Calendar.getInstance();

        int year=calendar.get(Calendar.YEAR);
        int month=calendar.get(Calendar.MONTH)+1;
        int day=calendar.get(Calendar.DAY_OF_MONTH);

        String syear=year+"";
        String smonth=month+"";
        String sday=day+"";

        List<SystemMsg> list=new ArrayList<SystemMsg>();
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
            list= systemMsgDao.queryBuilder()
                    .where(SystemMsgDao.Properties.When.gt(stmill))
                    .orderDesc(SystemMsgDao.Properties.Istop)
                    .orderDesc(SystemMsgDao.Properties.When)
                    .build().list();

        } catch (ParseException e) {
            e.printStackTrace();
        }

        return list;

    }


    public List<SystemMsg>  queryByWeek(){


        Calendar calendar=Calendar.getInstance();

        int year=calendar.get(Calendar.YEAR);
        int month=calendar.get(Calendar.MONTH)+1;
        int day=calendar.get(Calendar.DAY_OF_MONTH);

        String syear=year+"";
        String smonth=month+"";
        String sday=day+"";

        List<SystemMsg> list=new ArrayList<SystemMsg>();
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
            list= systemMsgDao.queryBuilder()
                    .where(SystemMsgDao.Properties.When.gt(etmill))
                    .where(SystemMsgDao.Properties.When.lt(stmill))
                    .orderDesc(SystemMsgDao.Properties.Istop)
                    .orderDesc(SystemMsgDao.Properties.When)
                    .build().list();

        } catch (ParseException e) {
            e.printStackTrace();
        }

        return list;

    }




    public List<SystemMsg>  queryByYesterday(){


        Calendar calendar=Calendar.getInstance();

        /*int year=calendar.get(Calendar.YEAR);
        int month=calendar.get(Calendar.MONTH)+1;
        int day=calendar.get(Calendar.DAY_OF_MONTH);

        String syear=year+"";
        String smonth=month+"";
        String sday=day+"";

        List<SystemMsg> list=new ArrayList<SystemMsg>();
        if(day<10){
            sday=0+sday;
        }
        if(month<10){
            smonth=0+smonth;
        }

        String start=syear+smonth+sday+"000000";
        String end=syear+smonth+sday+"235959";*/

        List<SystemMsg> list=new ArrayList<SystemMsg>();

        //拿到本周周一的时间
        calendar.setFirstDayOfWeek(Calendar.MONDAY);
        calendar.setTime(new Date());
        calendar.set(Calendar.DAY_OF_WEEK, calendar.getFirstDayOfWeek());

        SimpleDateFormat sdf=new SimpleDateFormat("yyyyMMdd");
        String end=sdf.format(calendar.getTime ())+"000000";// 2016 11-07 000000

        DateFormat formatter = new SimpleDateFormat("yyyyMMddhhmmss");

        try {
            //long stmill=formatter.parse(start).getTime();
            long etmill=formatter.parse(end).getTime();

            //gt大于  lt小于
            list= systemMsgDao.queryBuilder()
                    .where(SystemMsgDao.Properties.When.lt(etmill))
                    .orderDesc(SystemMsgDao.Properties.Istop)
                    .orderDesc(SystemMsgDao.Properties.When)
                    .build().list();

        } catch (ParseException e) {
            e.printStackTrace();
        }

        return list;

    }

    /**
     * 区分紧急程度的信息
     */
    public List<SystemMsg>  queryNotifyCount(String sessionid){

        return systemMsgDao.queryBuilder()
                .where(SystemMsgDao.Properties.Sessionid.eq(sessionid))
                .where(SystemMsgDao.Properties.Isread.eq("false"))
                .build()
                .list();
    }











}

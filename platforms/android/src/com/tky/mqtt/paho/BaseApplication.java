package com.tky.mqtt.paho;

import android.app.Application;
import android.content.Context;
import android.os.Environment;
import android.os.Handler;

import com.tky.mqtt.dao.DaoMaster;
import com.tky.mqtt.dao.DaoSession;

import java.io.File;

public class BaseApplication extends Application {
	private static Context context;
	private static int mainThreadId;
	private static Thread mainThread;
	private static Handler handler;
	private static BaseApplication mInstance;
	private static DaoMaster daoMaster;
	private static DaoSession daoSession;
	public static final String DB_NAME= Environment.getExternalStorageDirectory().getPath()
			+ File.separator+"TKY"+ File.separator+"jkjk";//数据库路径
	@Override
	public void onCreate() {
		super.onCreate();
		//Context
		context = getApplicationContext();
		//mainThreadId
		mainThreadId = android.os.Process.myTid();
		//Thread-->object
		mainThread = Thread.currentThread();
		//Handler
		handler = new Handler();
		if(mInstance == null){
			mInstance = this;
		}
	}
	public static Context getContext() {
		return context;
	}
	public static int getMainThreadId() {
		return mainThreadId;
	}
	public static Thread getMainThread() {
		return mainThread;
	}
	public static Handler getHandler() {
		return handler;
	}
	/**
	 * 取得DaoMaster
	 *
	 * @param context
	 * @return
	 */
	public static DaoMaster getDaoMaster(Context context) {
		if (daoMaster == null) {
			DaoMaster.OpenHelper helper = new DaoMaster.DevOpenHelper(context, DB_NAME, null);
			daoMaster = new DaoMaster(helper.getWritableDatabase());
		}
		return daoMaster;
	}

	/**
	 * 取得DaoSession
	 *
	 * @param context
	 * @return
	 */
	public static DaoSession getDaoSession(Context context) {
		if (daoSession == null) {
			if (daoMaster == null) {
				daoMaster = getDaoMaster(context);
			}
			daoSession = daoMaster.newSession();
		}
		return daoSession;
	}
}

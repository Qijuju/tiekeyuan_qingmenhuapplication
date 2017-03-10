package com.tky.saveLocal;

import android.app.Application;
import android.content.Context;
import android.os.Handler;

public class BaseApplication extends Application {
	private static Context context;
	private static int mainThreadId;
	private static Thread mainThread;
	private static Handler handler;

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
}

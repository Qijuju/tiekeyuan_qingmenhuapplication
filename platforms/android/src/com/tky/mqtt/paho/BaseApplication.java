package com.tky.mqtt.paho;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.support.multidex.MultiDex;

import com.tencent.tinker.anno.DefaultLifeCycle;
import com.tencent.tinker.loader.app.DefaultApplicationLike;
import com.tencent.tinker.loader.shareutil.ShareConstants;
import com.tky.mqtt.dao.DaoMaster;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mytinker.util.SampleApplicationContext;
import com.tky.mytinker.util.TinkerManager;
import com.yixia.camera.VCamera;
import com.yixia.camera.util.DeviceUtils;

import java.io.File;


@DefaultLifeCycle(
  application ="ook.yzx.tinker.Application",
  flags = ShareConstants.TINKER_ENABLE_ALL
)


public class BaseApplication extends DefaultApplicationLike {
  private static Context context;
  private static int mainThreadId;
  private static Thread mainThread;
  private static Handler handler;
  private static BaseApplication mInstance;
  private static DaoMaster daoMaster;
  private static DaoSession daoSession;
//  public static final String DB_NAME= Environment.getExternalStorageDirectory().getPath()
//    + File.separator+"TKY"+ File.separator+"KKK";//测试版本数据库路径
  private boolean isInBackground;
  public static final String DB_NAME = "KKK";//正式发布版本数据库路径






  public BaseApplication(Application application, int tinkerFlags, boolean tinkerLoadVerifyFlag, long applicationStartElapsedTime, long applicationStartMillisTime, Intent tinkerResultIntent) {
    super(application, tinkerFlags, tinkerLoadVerifyFlag, applicationStartElapsedTime, applicationStartMillisTime, tinkerResultIntent);
  }


  @Override
  public void onBaseContextAttached(Context base) {
    super.onBaseContextAttached(base);
    /*MultiDex.install(base);
    TinkerInstaller.install(this);*/

    MultiDex.install(base);

    SampleApplicationContext.application = getApplication();
    SampleApplicationContext.context = getApplication();
    TinkerManager.setTinkerApplicationLike(this);

    TinkerManager.initFastCrashProtect();
    //should set before tinker is installed
    TinkerManager.setUpgradeRetryEnable(true);

    //optional set logIml, or you can use default debug log
    //TinkerInstaller.setLogIml(new MyLogImp());

    //installTinker after load multiDex
    //or you can put com.tencent.tinker.** to main dex
    TinkerManager.installTinker(this);
  }

  @Override
  public void onCreate() {
    super.onCreate();
    //Context
    context = getApplication();
    //mainThreadId
    mainThreadId = android.os.Process.myTid();
    //Thread-->object
    mainThread = Thread.currentThread();
    //Handler
    handler = new Handler();
    if (mInstance == null) {
      mInstance = this;
    }
    getApplication().registerActivityLifecycleCallbacks(new Application.ActivityLifecycleCallbacks() {
      @Override
      public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
      }

      @Override
      public void onActivityStarted(Activity activity) {
      }

      @Override
      public void onActivityResumed(Activity activity) {
        if (isInBackground) {
          MqttNotification.cancelAll();
          isInBackground = false;
        }
      }

      @Override
      public void onActivityPaused(Activity activity) {
      }

      @Override
      public void onActivityStopped(Activity activity) {
        //判断应用是否进入后台
        if (UIUtils.isApplicationBroughtToBackground(getApplication())) {
          isInBackground = true;
        }
      }

      @Override
      public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
      }

      @Override
      public void onActivityDestroyed(Activity activity) {
      }
    });
    //初始化摄像机
    initDCIM();

   /* okhttp3.OkHttpClient okHttpClient=new okhttp3.OkHttpClient.Builder().
      connectTimeout(10000L, TimeUnit.MICROSECONDS).
      readTimeout(10000L,TimeUnit.MICROSECONDS).build();

    OkHttpUtils.initClient(okHttpClient);*/

//    JPushInterface.setDebugMode(true); 	// 设置开启日志,发布时请关闭日志
//    JPushInterface.init(context);     		// 初始化 JPush

  }

  /**
   * 初始化摄像机
   */
  private void initDCIM() {
    // 设置拍摄视频缓存路径
    File dcim = Environment
      .getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM);
    if (DeviceUtils.isZte()) {
      if (dcim.exists()) {
        VCamera.setVideoCachePath(dcim + "/recoder/");
      } else {
        VCamera.setVideoCachePath(dcim.getPath().replace("/sdcard/",
          "/sdcard-ext/")
          + "/recoder/");
      }
    } else {
      VCamera.setVideoCachePath(dcim + "/WeChatJuns/");
    }

//		VCamera.setVideoCachePath(FileUtils.getRecorderPath());
    // 开启log输出,ffmpeg输出到logcat
    VCamera.setDebugMode(true);
    // 初始化拍摄SDK，必须
    VCamera.initialize(getApplication());
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

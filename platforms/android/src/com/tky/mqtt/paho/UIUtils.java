package com.tky.mqtt.paho;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.ComponentName;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.content.res.ColorStateList;
import android.content.res.Resources;
import android.database.Cursor;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.telephony.TelephonyManager;
import android.text.TextUtils;
import android.util.Log;
import android.view.Display;
import android.view.View;
import android.view.WindowManager;

import java.io.File;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.List;

import cn.jpush.android.api.JPushInterface;

/**
 * 作者：SLS 包名：com.tky.frameplay.utils 日期：2016/1/11 描述：UI工具类
 */
public class UIUtils {
	/**
	 * 获取全局上下文
	 *
	 * @return
	 */
	public static Context getContext() {
		return BaseApplication.getContext();
	}

	/**
	 * 获取主线程
	 *
	 * @return
	 */
	public static Thread getMainThread() {
		return BaseApplication.getMainThread();
	}

	/**
	 * 获取主线程ID
	 *
	 * @return
	 */
	public static int getMainThreadId() {
		return BaseApplication.getMainThreadId();
	}

	/**
	 * 获取Handler
	 */
	public static Handler getHandler() {
		return BaseApplication.getHandler();
	}

	/**
	 * 获取资源
	 *
	 * @return
	 */
	public static Resources getResources() {
		return getContext().getResources();
	}

	/**
	 * 获取res/strings.xml中的字符串数据
	 *
	 * @param resId
	 *            资源ID
	 * @return
	 */
	public static String getString(int resId) {
		return getResources().getString(resId);
	}

	/**
	 * 获取res/strings.xml中的字符串数组数据
	 *
	 * @param resId
	 * @return
	 */
	public static String[] getStringArray(int resId) {
		return getResources().getStringArray(resId);
	}

	/**
	 * 获取res/dimens.xml中的尺寸大小数据
	 *
	 * @param resId
	 * @return
	 */
	public static int getDimens(int resId) {
		return getResources().getDimensionPixelSize(resId);
	}

	public static int getColor(int resId) {
		return getResources().getColor(resId);
	}

	/**
	 * dip转px 1dp=1px 1dp=2px
	 *
	 * @param dip
	 * @return
	 */
	public static int dip2px(int dip) {
		// dip和px的转换关系比例值
		float density = getResources().getDisplayMetrics().density;
		return (int) (dip * density + 0.5);
	}

	/**
	 * px转dip
	 *
	 * @param px
	 *            像素值
	 * @return
	 */
	public static int px2dip(int px) {
		float density = getResources().getDisplayMetrics().density;
		return (int) (px / density + 0.5);
	}

	/**
	 * 判断是否在主线程中执行
	 *
	 * @return
	 */
	public static boolean isRunInMainThread() {
		return getMainThreadId() == android.os.Process.myTid();
	}

	/**
	 * 放到主线程中执行（如果在主线程中就直接运行，否则放到主线程中再执行）
	 *
	 * @param runnable
	 */
	public static void runInMainThread(Runnable runnable) {
		if (isRunInMainThread()) {
			// 如果现在是在主线程中执行，就直接运行run方法
			runnable.run();
		} else {
			// 如果现在不是在主线程中执行，就把它放到主线程中执行
			getHandler().post(runnable);
		}
	}

	/**
	 * java代码区设置颜色选择器的方法
	 *
	 * @param mTabTextColorResId
	 * @return
	 */
	public static ColorStateList getColorStateList(int mTabTextColorResId) {
		return getContext().getResources()
				.getColorStateList(mTabTextColorResId);
	}

	/**
	 * 布局转View
	 *
	 * @param layoutId
	 *            布局文件资源ID
	 * @return
	 */
	public static View inflate(int layoutId) {
		return View.inflate(getContext(), layoutId, null);
	}

	/**
	 * 延迟一段时间执行一个方法
	 *
	 * @param runnable
	 * @param delayTime
	 *            延迟执行时间
	 */
	public static void postDeleyed(Runnable runnable, long delayTime) {
		getHandler().postDelayed(runnable, delayTime);
	}

	/**
	 * 移除在当前任务中维护的任务
	 *
	 * @param runnable
	 *            传递进来的任务
	 */
	public static void removeCallback(Runnable runnable) {
		getHandler().removeCallbacks(runnable);
	}

	/**
	 * 获取屏幕宽度
	 *
	 * @param activity
	 * @return
	 */
	public static int getScreenWidth(Activity activity) {
		WindowManager manager = activity.getWindowManager();
		Display dm = manager.getDefaultDisplay();
		return dm.getWidth();
	}

	/**
	 * 获取屏幕高度
	 *
	 * @param activity
	 * @return
	 */
	public static int getScreenHeight(Activity activity) {
		WindowManager manager = activity.getWindowManager();
		Display dm = manager.getDefaultDisplay();
		return dm.getHeight();
	}

	/**
	 * 获取状态栏高度
	 *
	 * @return 状态栏高度
	 */
	public static int getStatusBarHeight() {
		int result = 0;
		int resourceId = getResources().getIdentifier("status_bar_height",
				"dimen", "android");
		if (resourceId > 0) {
			result = getResources().getDimensionPixelSize(resourceId);
		}
		return result;
	}

	/**
	 * 打开文件（各种类型）
	 *
	 * @param filePath
	 */
	public static boolean openFile(String filePath) {
		File file = new File(filePath);
		if (!file.exists()) {
			return false;
		}
		Intent intent = new Intent();
		intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		intent.setAction(Intent.ACTION_VIEW);
		Uri uri = Uri.fromFile(new File(filePath));
		String suffix = filePath.substring(filePath.lastIndexOf(".") + 1,
				filePath.length());
		String mimeType = (suffix == null || TextUtils.isEmpty(suffix) || MimeTypeConstants
				.getMimeType(suffix) == null) ? MimeTypeConstants
				.getMimeType("all") : MimeTypeConstants.getMimeType(suffix);
		intent.setDataAndType(uri, mimeType);
		getContext().startActivity(intent);
		return true;
	}

	/**
	 * 判断当前版本是否兼容目标版本的方法
	 *
	 * @param versionCode
	 * @return
	 */
	public static boolean isMethodsCompat(int versionCode) {
		int currentVersion = android.os.Build.VERSION.SDK_INT;
		return currentVersion >= versionCode;
	}

	/**
	 * 获取手机的设备码
	 * @return
	 */
	public static String getDeviceId() {
     return JPushInterface.getRegistrationID(getContext());
//		TelephonyManager TelephonyMgr = (TelephonyManager)UIUtils.getContext().getSystemService(Context.TELEPHONY_SERVICE);
//		return TelephonyMgr.getDeviceId();
	}

	public static String getPhoneImsiNum(Context context) {
		int subId1 = -1;
		int subId2 = -1;
		String imsi1 = null;
		String imsi2 = null;
		try {
			TelephonyManager tManager = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
			if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) { //大于等于Android 5.0 L版本
				Method getSubscriberId = tManager.getClass().getMethod("getSubscriberId", int.class);

				ContentResolver contentResolver = context.getContentResolver();
				Cursor c = contentResolver.query(Uri.parse("content://telephony/siminfo"),
						new String[]{"_id"}, "sim_id" + " = ?", new String[]{"0"}, null);
				if (null != c && c.moveToFirst()) {
					subId1 = c.getInt(c.getColumnIndexOrThrow("_id"));
					Log.d("PhoneUtil", "subId1:" + subId1);
					c.close();
				}

				c = contentResolver.query(Uri.parse("content://telephony/siminfo"),
						new String[]{"_id"}, "sim_id" + " = ?", new String[]{"1"}, null);
				if (null != c && c.moveToFirst()) {
					subId2 = c.getInt(c.getColumnIndexOrThrow("_id"));
					Log.d("PhoneUtil", "subId2:" + subId2);
					c.close();
				}

				if (subId1 > 0) {
					imsi1 = (String) getSubscriberId.invoke(tManager, subId1);
				}
				if (subId2 > 0) {
					imsi2 = (String) getSubscriberId.invoke(tManager, subId2);
				}

				if (!TextUtils.isEmpty(imsi1) && !TextUtils.isEmpty(imsi2)) {
					return imsi1 + "," + imsi2;
				} else {
					if (!TextUtils.isEmpty(imsi1)) {
						return imsi1;
					} else {
						return imsi2;
					}
				}
			} else { //Android 5.0以下的api获取ismi方法 sdk < 21
				return tManager.getDeviceId();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/***
	 * sim_id 就是0 和 1
	 * 通过sim_id来获取subId 然后在根据subid 通过反射获取imsi值 sim_id 和subid在同一张表中，可以通过simid 获取subid 这样就解决问题了
	 之后在通过上面的方法把subid传入进去就可以了
	 * @return
	 */
	public int getSubId(int simid,Context context) {
		Uri uri = Uri.parse("content://telephony/siminfo");
		Cursor cursor = null;
		ContentResolver contentResolver = context.getContentResolver();
		try {
			cursor = contentResolver.query(uri, new String[]{"_id", "sim_id"}, "sim_id = ?",
					new String[]{String.valueOf(simid)}, null);
			if (null != cursor) {
				if (cursor.moveToFirst()) {
					return cursor.getInt(cursor.getColumnIndex("_id"));
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (null != cursor) {
				cursor.close();
			}
		}
		return -1;
	}

	/**
	 * 获取版本名称（版本号）
	 * @return
	 */
	public static String getVersion() {
		PackageManager manager = UIUtils.getContext().getPackageManager();
		try {
			PackageInfo pi = manager.getPackageInfo(UIUtils.getContext().getPackageName(), 0);
			if (pi != null) {
				return pi.versionName;
			}
		} catch (PackageManager.NameNotFoundException e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * Retrieve launcher activity name of the application from the context
	 *
	 * @param context The context of the application package.
	 * @return launcher activity name of this application. From the
	 * "android:name" attribute.
	 */
	private static String getLauncherClassName(Context context) {
		PackageManager packageManager = context.getPackageManager();

		Intent intent = new Intent(Intent.ACTION_MAIN);
		// To limit the components this Intent will resolve to, by setting an
		// explicit package name.
		intent.setPackage(context.getPackageName());
		intent.addCategory(Intent.CATEGORY_LAUNCHER);

		// All Application must have 1 Activity at least.
		// Launcher activity must be found!
		ResolveInfo info = packageManager
				.resolveActivity(intent, PackageManager.MATCH_DEFAULT_ONLY);

		// get a ResolveInfo containing ACTION_MAIN, CATEGORY_LAUNCHER
		// if there is no Activity which has filtered by CATEGORY_DEFAULT
		if (info == null) {
			info = packageManager.resolveActivity(intent, 0);
		}

		return info.activityInfo.name;
	}

	/**
	 * 安装应用
	 * @param
	 * @param appPath
	 */
	public static void installApk(final String appPath) {
		runInMainThread(new Runnable() {
			@Override
			public void run() {
				Intent intent = new Intent(Intent.ACTION_VIEW);
				intent.setDataAndType(Uri.fromFile(new File(appPath)), "application/vnd.android.package-archive");
				intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
				getContext().startActivity(intent);
			}
		});
	}

	/**
	 * 获取文件后缀名
	 * @param filePath
	 * @return
	 */
	public static String getSuffix(String filePath) {
		return filePath.substring(filePath.lastIndexOf(".") + 1,
				filePath.length());
	}

	/**
	 *判断当前应用程序处于前台还是后台
	 */
	public static boolean isApplicationBroughtToBackground(final Context context) {
		ActivityManager am = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
		List<ActivityManager.RunningTaskInfo> tasks = am.getRunningTasks(1);
		if (!tasks.isEmpty()) {
			ComponentName topActivity = tasks.get(0).topActivity;
			if (!topActivity.getPackageName().equals(context.getPackageName())) {
				return true;
			}
		}
		return false;

	}

	/**
	 * 字符串转MD5
	 * @param var0
	 * @return
	 */
	public static String string2MD5(String var0) {
		MessageDigest var1;
		try {
			var1 = MessageDigest.getInstance("MD5");
		} catch (Exception var4) {
			System.out.println(var4.toString());
			var4.printStackTrace();
			return "";
		}

		char[] var5;
		byte[] var2 = new byte[(var5 = var0.toCharArray()).length];

		for(int var3 = 0; var3 < var5.length; ++var3) {
			var2[var3] = (byte)var5[var3];
		}

		byte[] var9 = var1.digest(var2);
		StringBuffer var6 = new StringBuffer();

		for(int var7 = 0; var7 < var9.length; ++var7) {
			int var8;
			if((var8 = var9[var7] & 255) < 16) {
				var6.append("0");
			}

			var6.append(Integer.toHexString(var8));
		}

		return var6.toString();
	}

	/**
	 * 将double类型的比特数值转成文本大小（字符串）
	 * @param var0 文件大小（比特【byte】）
	 * @return 文本大小
	 */
	public static String getFormatSize(double var0) {
		double var2;
		if((var2 = var0 / 1024.0D) < 1.0D) {
			return var0 + "Byte(s)";
		} else {
			double var4;
			if((var4 = var2 / 1024.0D) < 1.0D) {
				BigDecimal var11 = new BigDecimal(Double.toString(var2));
				return var11.setScale(2, 4).toPlainString() + "KB";
			} else {
				double var6;
				if((var6 = var4 / 1024.0D) < 1.0D) {
					BigDecimal var12 = new BigDecimal(Double.toString(var4));
					return var12.setScale(2, 4).toPlainString() + "MB";
				} else {
					double var8;
					BigDecimal var10;
					if((var8 = var6 / 1024.0D) < 1.0D) {
						var10 = new BigDecimal(Double.toString(var6));
						return var10.setScale(2, 4).toPlainString() + "GB";
					} else {
						var10 = new BigDecimal(var8);
						return var10.setScale(2, 4).toPlainString() + "TB";
					}
				}
			}
		}
	}

	/**
	 * 切换听筒模式和正常模式
	 * @param context
	 * @param earphone
	 */
	public static void switchEarphone(Activity context, boolean earphone) {
		AudioManager manager = (AudioManager) getContext().getSystemService(Context.AUDIO_SERVICE);
		manager.setSpeakerphoneOn(!earphone);
		manager.setMode(earphone ? AudioManager.MODE_IN_COMMUNICATION : AudioManager.MODE_NORMAL);
		if (context != null) {
			context.setVolumeControlStream(earphone ? AudioManager.STREAM_VOICE_CALL : AudioManager.STREAM_MUSIC);
		}
	}

	/**
	 * 响铃
	 */
	public static void ring() {
		MediaPlayer mp = new MediaPlayer();
		try {

			mp.setDataSource(getContext(), RingtoneManager
					.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION));
			mp.prepare();
			mp.start();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 本方法判断自己些的一个Service-->com.xxx.xxx是否已经运行
	 * @param className Service类名(全名）
	 * @return
     */
	public static boolean isServiceWorked(String className)
	{
		ActivityManager myManager=(ActivityManager)getContext().getSystemService(Context.ACTIVITY_SERVICE);
		ArrayList<ActivityManager.RunningServiceInfo> runningService = (ArrayList<ActivityManager.RunningServiceInfo>) myManager.getRunningServices(30);
		for(int i = 0 ; i<runningService.size();i++) {
			if(runningService.get(i).service.getClassName().toString().equals(className)) {
				return true;
			}
		}
		return false;
	}
}

package com.tky.mqtt.paho;

import android.annotation.SuppressLint;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;

import java.util.Set;

/**
 * @desc SharedPreferences存储工具类
 *
 * @author SLS
 *
 */
public class SPUtils {

	private static SharedPreferences sp;
	private static String name = UIUtils.getContext().getPackageName();

	@SuppressLint("NewApi")
	public static void save(String key, Object value){
		if (sp == null) {
			sp = UIUtils.getContext().getSharedPreferences(name, UIUtils.getContext().MODE_PRIVATE);
		}
		Editor edit = sp.edit();
		if (value instanceof String) {
			edit.putString(key, (String)value);
		}else if (value instanceof Integer) {
			edit.putInt(key, (Integer)value);
		}else if (value instanceof Float) {
			edit.putFloat(key, (Float)value);
		}else if (value instanceof Long) {
			edit.putLong(key, (Long)value);
		}else if (value instanceof Boolean) {
			edit.putBoolean(key, (Boolean)value);
		}else if (value instanceof Set){
			edit.putStringSet(key, (Set<String>)value);
		}
		edit.commit();
	}

	/**
	 * 获取String类型的数据
	 * @param context
	 * @param key
	 * @param defValue
	 * @return
	 */
	public static String getString(String key, String defValue){
		if (sp == null) {
			sp = UIUtils.getContext().getSharedPreferences(name, UIUtils.getContext().MODE_PRIVATE);
		}
		return sp.getString(key, defValue);
	}

	/**
	 * 获取int类型的数据
	 * @param context
	 * @param key
	 * @param defValue
	 * @return
	 */
	public static int getInt(String key, int defValue){
		if (sp == null) {
			sp = UIUtils.getContext().getSharedPreferences(name, UIUtils.getContext().MODE_PRIVATE);
		}
		return sp.getInt(key, defValue);
	}

	/**
	 * 获取float类型的数据
	 * @param context
	 * @param key
	 * @param defValue
	 * @return
	 */
	public static float getFloat(String key, float defValue){
		if (sp == null) {
			sp = UIUtils.getContext().getSharedPreferences(name, UIUtils.getContext().MODE_PRIVATE);
		}
		return sp.getFloat(key, defValue);
	}

	/**
	 * 获取long类型的数据
	 * @param context
	 * @param key
	 * @param defValue
	 * @return
	 */
	public static long getLong(String key, long defValue){
		if (sp == null) {
			sp = UIUtils.getContext().getSharedPreferences(name, UIUtils.getContext().MODE_PRIVATE);
		}
		return sp.getLong(key, defValue);
	}

	/**
	 * 获取boolean类型的数据
	 * @param context
	 * @param key
	 * @param defValue
	 * @return
	 */
	public static boolean getBoolean(String key, boolean defValue){
		if (sp == null) {
			sp = UIUtils.getContext().getSharedPreferences(name, UIUtils.getContext().MODE_PRIVATE);
		}
		return sp.getBoolean(key, defValue);
	}

	/**
	 * 获取Set<String>类型的数据
	 * @param context
	 * @param key
	 * @param defValue
	 * @return
	 */
	@SuppressLint("NewApi")
	public static Set<String> getSet(String key, Set<String> defValue){
		if (sp == null) {
			sp = UIUtils.getContext().getSharedPreferences(name, UIUtils.getContext().MODE_PRIVATE);
		}
		return sp.getStringSet(key, defValue);
	}

}

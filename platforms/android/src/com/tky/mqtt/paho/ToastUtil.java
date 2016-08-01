package com.tky.mqtt.paho;

import android.widget.Toast;

public class ToastUtil {
	/**
	 * 弹出土司
	 * @param text
	 */
	public static void showToast(String text){
		Toast.makeText(UIUtils.getContext(), text, Toast.LENGTH_SHORT).show();
	}

	/**
	 * 保证始终在主线程中弹出土司（在子线程中可以直接使用，不用担心子线程不能操作界面的危险）
	 * @param text
	 */
	public static void showSafeToast(final CharSequence text){
		if (!UIUtils.isRunInMainThread()) {
			UIUtils.runInMainThread(new Runnable() {
				@Override
				public void run() {
					Toast.makeText(UIUtils.getContext(), text, Toast.LENGTH_SHORT).show();
				}
			});
		}else {
			Toast.makeText(UIUtils.getContext(), text, Toast.LENGTH_SHORT).show();
		}
	}
}

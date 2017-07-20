package com.tky.mqtt.paho.utils;

import android.app.Activity;
import android.content.Context;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.AnimationSet;
import android.view.animation.DecelerateInterpolator;
import android.view.animation.LinearInterpolator;
import android.view.animation.RotateAnimation;
import android.view.animation.ScaleAnimation;
import com.r93535.im.R;

public class AnimationUtils {
	/**
	 * 启动旋转动画
	 * @param view 要启动动画的控件
	 * @param from 从多少角度开始
	 * @param to 到多少角度结束
	 */
	public static void startRotateAnimation(View view, float from, float to){
		RotateAnimation animation = new RotateAnimation(from, to, Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
		animation.setDuration(200);
		animation.setRepeatCount(0);
		animation.setFillAfter(true);
		view.startAnimation(animation);
	}

	/**
	 * 启动Alpha动画（亮度渐变）
	 * @param view
	 * @param from
	 * @param to
	 * @param duration
	 * @param repeatCount
	 */
	public static void startAlphaAnimation(View view, float from, float to, int duration, int repeatCount){
		AlphaAnimation animation = new AlphaAnimation(from, to);
		animation.setDuration(duration);
		animation.setRepeatCount(repeatCount);
		animation.setFillAfter(true);
		view.startAnimation(animation);
	}

	/**
	 * 执行下一步的动画
	 */
	public static void execNextAnim(Context context){
		((Activity)context).overridePendingTransition(R.anim.tran_next_enter, R.anim.tran_next_exit);
	}

	/**
	 * 执行上一步的动画
	 */
	public static void execPreAnim(Context context){
		((Activity)context).overridePendingTransition(R.anim.tran_pre_enter, R.anim.tran_pre_exit);
	}

	/**
	 * 执行下一步的动画
	 */
	public static void execMagnifyAnim(Context context){
		((Activity)context).overridePendingTransition(R.anim.magnify_fade_in, R.anim.magnify_fade_out);
	}

	/**
	 * 执行上一步的动画
	 */
	public static void execShrinkAnim(Context context){
		((Activity)context).overridePendingTransition(R.anim.shrink_fade_in,R.anim.shrink_fade_out);
	}

	private static final long MEDIUM = 500;

	/** 创建一个淡入放大的动画 */
	public static Animation createZoomInNearAnim() {
		AnimationSet ret;
		Animation anim;
		ret = new AnimationSet(false);
		// 创建一个淡入的动画
		anim = new AlphaAnimation(0f, 1f);
		anim.setDuration(MEDIUM);
		anim.setInterpolator(new LinearInterpolator());
		ret.addAnimation(anim);
		// 创建一个放大的动画
		anim = new ScaleAnimation(0, 1, 0, 1, Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
		anim.setDuration(MEDIUM);
		anim.setInterpolator(new DecelerateInterpolator());
		ret.addAnimation(anim);
		return ret;
	}

	/** 创建一个淡出放大的动画 */
	public static Animation createZoomInAwayAnim() {
		AnimationSet ret;
		Animation anim;
		ret = new AnimationSet(false);
		// 创建一个淡出的动画
		anim = new AlphaAnimation(1f, 0f);
		anim.setDuration(MEDIUM);
		anim.setInterpolator(new DecelerateInterpolator());
		ret.addAnimation(anim);
		// 创建一个放大的动画
		anim = new ScaleAnimation(1, 3, 1, 3, Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
		anim.setDuration(MEDIUM);
		anim.setInterpolator(new DecelerateInterpolator());
		ret.addAnimation(anim);
		return ret;
	}

	/** 创建一个淡入缩小的动画 */
	public static Animation createZoomOutNearAnim() {
		AnimationSet ret;
		Animation anim;
		ret = new AnimationSet(false);
		// 创建一个淡入的动画
		anim = new AlphaAnimation(0f, 1f);
		anim.setDuration(MEDIUM);
		anim.setInterpolator(new LinearInterpolator());
		ret.addAnimation(anim);
		// 创建一个缩小的动画
		anim = new ScaleAnimation(3, 1, 3, 1, Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
		anim.setDuration(MEDIUM);
		anim.setInterpolator(new DecelerateInterpolator());
		ret.addAnimation(anim);
		return ret;
	}

	/** 创建一个淡出缩小的动画 */
	public static Animation createZoomOutAwayAnim() {
		AnimationSet ret;
		Animation anim;
		ret = new AnimationSet(false);
		// 创建一个淡出的动画
		anim = new AlphaAnimation(1f, 0f);
		anim.setDuration(MEDIUM);
		anim.setInterpolator(new DecelerateInterpolator());
		ret.addAnimation(anim);
		// 创建一个缩小的动画
		anim = new ScaleAnimation(1, 0, 1, 0, Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
		anim.setDuration(MEDIUM);
		anim.setInterpolator(new DecelerateInterpolator());
		ret.addAnimation(anim);
		return ret;
	}

	/** 创建一个淡入放大的动画 */
	public static Animation createPanInAnim(float degree) {
		AnimationSet ret;
		Animation anim;
		ret = new AnimationSet(false);
		// 创建一个淡入动画
		anim = new AlphaAnimation(0f, 1f);
		anim.setDuration(MEDIUM);
		anim.setInterpolator(new LinearInterpolator());
		ret.addAnimation(anim);
		// 创建一个放大动画
		final float pivotX = (float) (1 - Math.cos(degree)) / 2;
		final float pivotY = (float) (1 + Math.sin(degree)) / 2;

		anim = new ScaleAnimation(0.8f, 1, 0.8f, 1, Animation.RELATIVE_TO_SELF, pivotX, Animation.RELATIVE_TO_SELF,
				pivotY);
		anim.setDuration(MEDIUM);
		anim.setInterpolator(new DecelerateInterpolator());
		ret.addAnimation(anim);

		return ret;
	}

	/** 创建一个淡出缩小的动画 */
	public static Animation createPanOutAnim(float degree) {
		AnimationSet ret;
		Animation anim;
		ret = new AnimationSet(false);
		// 创建一个淡出动画
		anim = new AlphaAnimation(1f, 0f);
		anim.setDuration(MEDIUM);
		anim.setInterpolator(new DecelerateInterpolator());
		ret.addAnimation(anim);
		// 创建一个缩小动画
		final float pivotX = (float) (1 + Math.cos(degree)) / 2;
		final float pivotY = (float) (1 - Math.sin(degree)) / 2;
		anim = new ScaleAnimation(1, 0.8f, 1, 0.8f, Animation.RELATIVE_TO_SELF, pivotX, Animation.RELATIVE_TO_SELF,
				pivotY);
		anim.setDuration(MEDIUM);
		anim.setInterpolator(new DecelerateInterpolator());
		ret.addAnimation(anim);

		return ret;
	}
}

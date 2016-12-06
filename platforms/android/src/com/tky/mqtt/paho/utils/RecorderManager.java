package com.tky.mqtt.paho.utils;

import android.app.Activity;
import android.media.MediaRecorder;
import android.os.Handler;
import android.support.annotation.NonNull;

import java.io.IOException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * 作者：
 * 包名：com.example.billgao.lab1_radio
 * 日期：2016/12/5 9:48
 * 描述：
 */
public class RecorderManager {

    private static Activity context;
    private MediaRecorder recorder;
    private boolean isRecording = false;
    private OnRecorderChangeListener onRecorderChangeListener;
    /**
     * 录制时间定时检测
     */
    private int PERIOD = 1000;
    /**
     * 定时器延时检测（延时300毫秒）
     */
    private static final long SCHEDULE_DELAY = 300;
    /**
     * 声音强度监测延时
     */
    private static final long POLL_INTERAL = 300;
    private static Handler handler = new Handler();

    /**
     * 录制开始时间
     */
    private long startTime;
    private ScheduledExecutorService executorService;
    private VoicePollTask voicePollTask;

    /**
     * 本类自己构造一个对象，供外界调用
     */
    private static final RecorderManager INSTANCE = new RecorderManager();

    /**
     * 私有化构造器
     */
    private RecorderManager() {}

    /**
     * 获取该类的实例
     * @param context
     * @return
     */
    public static RecorderManager getInstance(@NonNull Activity context) {
        RecorderManager.context = context;
        return INSTANCE;
    }

    /**
     * 开始录音
     * @param filePath 录音文件存放路径（包含文件名）
     * @param interval 定时（默认是一分钟）
     * @throws RuntimeException
     */
    public void startRecord(final String filePath, long interval) {
        interval = (interval <= 0 ? 59 * 1000 : interval);
        if (isRecording) {
            if (onRecorderChangeListener != null) {
                final long finalInterval = interval;
                context.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        onRecorderChangeListener.onError(filePath, finalInterval, "Recorder is running...");
                    }
                });
            }
            return;
        }
        isRecording = true;
        recorder = new MediaRecorder();
        recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        recorder.setOutputFormat(MediaRecorder.OutputFormat.AAC_ADTS);
        recorder.setOutputFile(filePath);
        recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
        try {
            recorder.prepare();
        } catch (IOException e) {
            isRecording = false;
            if (onRecorderChangeListener != null) {
                final long finalInterval1 = interval;
                context.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        onRecorderChangeListener.onError(filePath, finalInterval1, "Recorder prepare is failed...");
                    }
                });
            }
            e.printStackTrace();
            return;
        }
        recorder.start();
        voicePollTask = new VoicePollTask(filePath, interval);
        handler.postDelayed(voicePollTask, POLL_INTERAL);
        executorService = Executors.newSingleThreadScheduledExecutor();
        startTime = System.currentTimeMillis();
        VoiceScheduleTask voiceScheduleTask = new VoiceScheduleTask(filePath, interval);
        executorService.scheduleAtFixedRate(voiceScheduleTask, SCHEDULE_DELAY, PERIOD, TimeUnit.MILLISECONDS);

    }

    /**
     * 停止录音
     * @throws Exception
     */
    public void stopRecord() throws RuntimeException {
        if (isRecording) {
            if (recorder != null) {
                recorder.stop();
                recorder.release();
                recorder = null;
            }
        } else {
            throw new RuntimeException("Recorder is not running");
        }
        isRecording = false;
        onRecorderChangeListener = null;
        if (executorService != null && !executorService.isShutdown()) {
            executorService.shutdown();
            executorService = null;
        }
        if (voicePollTask != null) {
            handler.removeCallbacks(voicePollTask);
            voicePollTask = null;
        }
    }

    public void setOnRecorderChangeListener(OnRecorderChangeListener onRecorderChangeListener) {
        this.onRecorderChangeListener = onRecorderChangeListener;
    }

    public interface OnRecorderChangeListener {
        /**
         * 录制时间改变时
         * @param filePath 文件路径
         * @param interval 超时时长
         * @param recordTime 已录制时长（单位：秒）
         */
        public void onTimeChange(String filePath, long interval, long recordTime);

        /**
         * 录制超时（自动关闭录制）
         * @param filePath
         * @param interval
         */
        public void onTimeout(String filePath, long interval);

        /**
         * 录制声音改变时
         * @param filePath
         * @param interval
         * @param rate
         */
        public void onRateChange(String filePath, long interval, int rate);

        /**
         * 录制出错
         * @param filePath
         * @param interval
         */
        public void onError(String filePath, long interval, String error);
    }

    private class VoiceScheduleTask implements Runnable {
        private String filePath;
        private long interval;

        public VoiceScheduleTask(){
            super();
        }

        public VoiceScheduleTask(String filePath, long interval){
            super();
            this.filePath = filePath;
            this.interval = interval;
        }
        @Override
        public void run() {
            if (isRecording) {
                context.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        long recordTime = System.currentTimeMillis() - startTime;
                        if (recordTime >= interval) {
                            if (onRecorderChangeListener != null) {
                                onRecorderChangeListener.onTimeout(filePath, interval);
                            }
                            stopRecord();
                        }
                        if (onRecorderChangeListener != null) {
                            onRecorderChangeListener.onTimeChange(filePath, interval, recordTime);
                        }
                    }
                });
            }
        }
    }

    /**
     * 声音频率监测任务
     */
    private class VoicePollTask implements Runnable {
        private String filePath;
        private long interval;

        public VoicePollTask(String filePath, long interval) {
            super();
            this.filePath = filePath;
            this.interval = interval;
        }
        @Override
        public void run() {
            if (isRecording) {
                double amp = getAmplitude();
                if (onRecorderChangeListener != null) {
                    final int rate = ((int) (amp / 2f));
                    context.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            onRecorderChangeListener.onRateChange(filePath, interval, rate > 5 ? 5 : rate);
                        }
                    });
                }
                handler.postDelayed(voicePollTask, POLL_INTERAL);
            }
        }
    }

    /**
     * 获取声音频率（0~11，每两个作为一个单位计量）
     * @return
     */
    private double getAmplitude() {
        if (recorder != null) {
            return (recorder.getMaxAmplitude() / 2700.0d);
        } else {
            return 0;
        }
    }
}

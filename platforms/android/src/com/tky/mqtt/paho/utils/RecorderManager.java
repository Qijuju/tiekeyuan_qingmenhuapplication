package com.tky.mqtt.paho.utils;

import android.app.Activity;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.widget.Toast;

import com.tky.mqtt.paho.UIUtils;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
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

    //********************* 录音相关参数开始 START *********************
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
//    private static Handler handler = new Handler();

    /**
     * 录制开始时间
     */
    private long startTime;
    private ScheduledExecutorService executorService;
    private VoicePollTask voicePollTask;

    private String filePath;
    //********************* 录音相关参数结束 END *********************

    //********************* 录音播放相关参数开始 START *********************
    /**
     * 是否正在播放
     */
//    private boolean isPlaying = false;
    //********************* 录音播放相关参数结束 END *********************
    /**
     * 本类自己构造一个对象，供外界调用
     */
    private static final RecorderManager INSTANCE = new RecorderManager();
    private MediaPlayer player;
    private String playVoiceName;
    private int[] amps;

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

    //********************* 录音相关方法开始 START *********************
    /**
     * 创建一个录音文件的存放位置（包含文件名）
     * @return
     */
    public String createVoicePath() {
        return FileUtils.getVoiceDir() + File.separator + UUID.randomUUID().toString() + ".aac";
    }

    /**
     * 根据录音文件的名称获取它存放的路径（包含文件名）
     * @param voiceName
     * @return
     */
    public String getFilePathByVoiceName(String voiceName) {
        return FileUtils.getVoiceDir() + File.separator + voiceName;
    }

    /**
     * 开始录音
     * @param filePath 录音文件存放路径（包含文件名）
     * @param interval 定时（默认是一分钟）
     * @throws RuntimeException
     */
    public void startRecord(final String filePath, long interval) {
        this.filePath = filePath;
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
        context.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                UIUtils.getHandler().postDelayed(voicePollTask, POLL_INTERAL);
            }
        });
        executorService = Executors.newSingleThreadScheduledExecutor();
        startTime = System.currentTimeMillis();
        VoiceScheduleTask voiceScheduleTask = new VoiceScheduleTask(filePath, interval);
        executorService.scheduleAtFixedRate(voiceScheduleTask, SCHEDULE_DELAY, PERIOD, TimeUnit.MILLISECONDS);

    }

    /**
     * 获取录制文件存放的路径
     * @return
     */
    public String getRecordPath() {
        return filePath;
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
            UIUtils.getHandler().removeCallbacks(voicePollTask);
            voicePollTask = null;
        }
    }

    /**
     * 获取已录制时长
     * @return
     */
    public long getDuration() {
        return System.currentTimeMillis() - startTime;
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
                    final int rate = getAmps()[(int)amp];//((int) (amp / 2f));
                    context.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            onRecorderChangeListener.onRateChange(filePath, interval, rate > 5 ? 5 : rate);
                        }
                    });
                }
                UIUtils.getHandler().postDelayed(voicePollTask, POLL_INTERAL);
            }
        }
    }

    /**
     * 获取声音频率标准
     * @return
     */
    private int[] getAmps() {
        if (amps == null || amps.length <= 0) {
            amps = new int[]{0, 1, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5};
        }
        return amps;
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

    //********************* 录音相关方法结束 END *********************

    //********************* 录音播放相关方法开始 START *********************
    /**
     * 播放录音
     * @param playVoiceName 录音文件的名称（仅仅是名称，具体路径在该方法中补全）
     */
    public void playRecord(String playVoiceName) {
        this.playVoiceName = playVoiceName;
        if (player == null) {
            player = new MediaPlayer();
        } else {
            player.stop();
            player.reset();
        }
        try {
            player.setDataSource(getFilePathByVoiceName(playVoiceName));
            player.prepare();
            player.start();                                           // play the record
//            isPlaying = true;
        }catch (IOException e) {
//            isPlaying = false;
            Toast.makeText(context, "播放失败！", Toast.LENGTH_SHORT).show();
            e.printStackTrace();
        }
    }

    public void stopPlayRecord() {
        if (player != null && player.isPlaying()) {

        }
    }

    //********************* 录音播放相关方法结束 END *********************
}

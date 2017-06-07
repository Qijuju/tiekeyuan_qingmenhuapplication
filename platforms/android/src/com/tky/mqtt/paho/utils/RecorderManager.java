package com.tky.mqtt.paho.utils;

import android.app.Activity;
import android.content.Context;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.support.annotation.NonNull;
import android.widget.Toast;

import com.tky.mqtt.paho.SPUtils;
import com.tky.mqtt.paho.UIUtils;

import java.io.File;
import java.io.IOException;
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
    private static final long POLL_INTERAL = 50;
//    private static Handler handler = new Handler();

    /**
     * 录制开始时间
     */
    private long startTime;
    private ScheduledExecutorService executorService;
    private VoicePollTask voicePollTask;

    private String filePath;
    /**
     * 录音参数
     */
    private int BASE_RATIO = 600;
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
    private int currentPausePosition;

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
     * 对该类进行初始化
     */
    public void init() {
        if (recorder != null) {
            try {
                recorder.stop();
                recorder.release();
                recorder = null;
            } catch (Exception e) {}
        }
        if (player != null) {
            try {
                player.stop();
                player.release();
                player = null;
            } catch (Exception e) {}
        }
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
        //先停止播放
        try {
            stopPlayRecord();
        } catch (Exception e){}
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
        //设置声音采样频率
        recorder.setAudioEncodingBitRate(44100);
        recorder.setMaxDuration((int) interval);
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
                UIUtils.getHandler().postDelayed(voicePollTask, 0);
            }
        });
        executorService = Executors.newSingleThreadScheduledExecutor();
        startTime = System.currentTimeMillis();
        //初始化时间提示
        if (onRecorderChangeListener != null) {
            onRecorderChangeListener.onTimeChange(filePath, interval, 0);
        }
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

        public VoiceScheduleTask(String filePath, long interval){
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
            this.filePath = filePath;
            this.interval = interval;
        }
        @Override
        public void run() {
            if (isRecording) {
                final int amp = getAmplitude();
                if (onRecorderChangeListener != null) {
//                    final int rate = getAmps()[(int)amp];//((int) (amp / 2f));
                    context.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            onRecorderChangeListener.onRateChange(filePath, interval, amp > 5 ? 5 : amp);
                        }
                    });
                }
                UIUtils.getHandler().removeCallbacks(voicePollTask);
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
    private int getAmplitude() {
        if (recorder != null) {
            int ratio = recorder.getMaxAmplitude() / BASE_RATIO;
            int amp = 0;
            if (ratio > 1) {
                amp = (int) (20 * Math.log10(ratio));
            }
            return amp / 4;
//            return (recorder.getMaxAmplitude() / 2700.0d);
        } else {
            return 0;
        }
    }

    //********************* 录音相关方法结束 END *********************

    //********************* 录音播放相关方法开始 START *********************

    /**
     * 播放之前要初始化播放器
     */
    public void initPlayer() {
        //初始化currentPausePosition
        currentPausePosition = 0;
    }

    /**
     * 播放录音
     * @param playVoiceName 录音文件的名称（仅仅是名称，具体路径在该方法中补全）
     */
    public MediaPlayer playRecord(String playVoiceName) {
        //初始化播放器
        initPlayer();

        this.playVoiceName = playVoiceName;
        if (player == null) {
            player = new MediaPlayer();
        } else {
            try {
                player.stop();
                player.reset();
            } catch (Exception e) {
                player = new MediaPlayer();
            }
        }
        boolean proxyMode = SPUtils.getBoolean("set_proxy_mode", false);
        UIUtils.switchEarphone(context, !proxyMode);
        try {
            player.setDataSource(getFilePathByVoiceName(playVoiceName));
            player.prepare();
            player.start();                                           // play the record
            AudioManager audioManager = (AudioManager) UIUtils.getContext().getSystemService(Context.AUDIO_SERVICE);
//            boolean proxyMode = SPUtils.getBoolean("set_proxy_mode", false);
            int currVolume = audioManager.getStreamVolume(proxyMode ? AudioManager.STREAM_MUSIC : AudioManager.STREAM_VOICE_CALL) ;// 当前的媒体音量
            player.setVolume(currVolume, currVolume);
        }catch (IOException e) {
            UIUtils.switchEarphone(context, false);
            player.stop();
            player.release();
            player = null;
            Toast.makeText(context, "播放失败！", Toast.LENGTH_SHORT).show();
            e.printStackTrace();
        }
        return player;
    }

    /**
     * 设置播放声音大小
     * @param volume
     */
    public void setVolume(int volume) {
        if (player != null) {
            player.setVolume(volume, volume);
        }
    }

    /**
     * 暂停
     */
    public void pause() {
        try {
            if (player != null && player.isPlaying()) {
                currentPausePosition = player.getCurrentPosition() - 100;
                currentPausePosition = (currentPausePosition > 0 ? currentPausePosition : 0);
                player.pause();
            }
        } catch (Exception e) {
        }
    }

    /**
     * 恢复播放
     */
    public void resume() {
        try {
            if (player != null && !player.isPlaying()) {
                player.seekTo(currentPausePosition);
                player.start();
            }
        } catch (Exception e){}
    }

    /**
     * 停止播放
     */
    public void stopPlayRecord() {
        try {
            if (player != null && player.isPlaying()) {
                player.stop();
                player.release();
                player = null;
            }
        } catch (Exception e) {
        } finally {
            UIUtils.switchEarphone(context, false);
        }
    }

    /**
     * 是否正在播放
     * @return
     */
    public boolean isPlaying() {//
        return (player != null && player.isPlaying());
    }

    //********************* 录音播放相关方法结束 END *********************
}

package com.tky.mqtt.paho.utils;

import android.media.MediaRecorder;

import com.tky.mqtt.paho.SPUtils;
import com.tky.mqtt.paho.UIUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 作者：SLS
 * 包名：com.tky.mqtt.paho.utils
 * 日期：2016/12/1 14:39
 * 描述：录音工具类
 */
public class RecordManager {
    private MediaRecorder mediaRecorder;
    private AtomicBoolean atomicBoolean = new AtomicBoolean(false);
    private String recordFileName;
    private String recordFilePath;
    private File file;
    private long startTime;

    private static final RecordManager INSTANCE = new RecordManager();

    private RecordManager(){}

    public static RecordManager getInstance() {
        return INSTANCE;
    }

    public void startRecording() throws JSONException {
        if(this.mediaRecorder == null) {
            this.mediaRecorder = new MediaRecorder();
            this.mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
            this.mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.AMR_NB);
            this.mediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
            this.mediaRecorder.setAudioChannels(1);
            this.mediaRecorder.setAudioEncodingBitRate(12200);
            this.mediaRecorder.setOnErrorListener(new MediaRecorder.OnErrorListener() {
                @Override
                public void onError(MediaRecorder mr, int what, int extra) {

                }
            });
        } else {
            this.mediaRecorder.stop();
            this.mediaRecorder.reset();
        }

        mediaRecorder.setOnInfoListener(new MediaRecorder.OnInfoListener() {
            @Override
            public void onInfo(MediaRecorder mr, int what, int extra) {

            }
        });

        this.recordFileName = this.getRecordFileName();
        recordFilePath = this.getRecordFilePath();
        file = new File(this.recordFilePath);
        this.mediaRecorder.setOutputFile(this.file.getAbsolutePath());

        try {
            this.mediaRecorder.prepare();
            this.mediaRecorder.start();
            this.atomicBoolean.set(true);
            startTime = (new Date()).getTime();
//            this.executeService.execute(new What(this));
        } catch (IllegalStateException var2) {
            this.atomicBoolean.set(false);
            this.mediaRecorder.release();
            this.mediaRecorder = null;
        } catch (IOException var3) {
            this.atomicBoolean.set(false);
            this.mediaRecorder.release();
            this.mediaRecorder = null;
        }
    }


    public int stopRecording() {
        if(this.mediaRecorder != null) {
            this.atomicBoolean.set(false);
            this.mediaRecorder.stop();
            this.mediaRecorder.release();
            this.mediaRecorder = null;
            return (int)((new Date()).getTime() - this.startTime) / 1000;
        } else {
            return 0;
        }
    }

    public boolean isRecording() {
        return this.atomicBoolean.get();
    }

    public MediaRecorder getMediaRecorder() {
        return this.mediaRecorder;
    }

    public String getRecordFilePath() throws JSONException {
        String var2 = UIUtils.string2MD5(getUserID());
        File var4;
        if(!(var4 = new File(FileUtils.getVoiceDir() + File.separator + var2 + File.separator + getUserID())).exists()) {
            var4.mkdirs();
        }

        var4 = new File(var4.getAbsolutePath() + File.separator + this.recordFileName);

        try {
            if(!var4.exists()) {
                var4.createNewFile();
            }
        } catch (IOException var3) {
            ;
        }

        return var4.getAbsolutePath();
    }

    public String getRecordFileName() {
        return System.currentTimeMillis() + ".amr";
    }

    /**
     * 获取当前登录的用户ID
     * @return
     */
    public static String getUserID() throws JSONException {
        JSONObject userInfo = getUserInfo();
        return userInfo == null ? null : userInfo.getString("userID");
    }

    public static JSONObject getUserInfo() throws JSONException {
        String login_info = SPUtils.getString("login_info", "");
        JSONObject obj = null;
        if (login_info == null || "".equals(login_info.trim())) {
            obj = null;
        } else {
            obj = new JSONObject(login_info);
        }
        return obj;
    }
}

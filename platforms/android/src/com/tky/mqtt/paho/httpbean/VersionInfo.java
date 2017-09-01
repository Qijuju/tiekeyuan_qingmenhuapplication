package com.tky.mqtt.paho.httpbean;

/**
 * Created by bim on 2017/8/24.
 */

public class VersionInfo {
    private String versionName;//版本名
    private long fileSize;//apk文件大小

    public String getVersionName() {
        return versionName;
    }

    public void setVersionName(String versionName) {
        this.versionName = versionName;
    }

    public long getFileSize() {
        return fileSize;
    }

    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }
}

package com.tky.mqtt.paho.bean;

/**
 * 作者：
 * 包名：com.tky.mqtt.paho.bean
 * 日期：2016/9/13 11:34
 * 描述：
 */
public class MediaContent {
    /**
     * 图片ID
     */
    private String image_id_path;
    /**
     * 图片URL
     */
    private String thumbnail_path;

    public String getImage_id_path() {
        return image_id_path;
    }

    public void setImage_id_path(String image_id_path) {
        this.image_id_path = image_id_path;
    }

    public String getThumbnail_path() {
        return thumbnail_path;
    }

    public void setThumbnail_path(String thumbnail_path) {
        this.thumbnail_path = thumbnail_path;
    }
}

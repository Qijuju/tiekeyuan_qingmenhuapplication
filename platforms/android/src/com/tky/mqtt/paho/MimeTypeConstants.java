package com.tky.mqtt.paho;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by MSI on 2015/10/16.
 */
public class MimeTypeConstants {
    private static final Map<String, String> mimeTypeMap = new HashMap<String, String>();
    static {
        mimeTypeMap.put("m4a", "audio/*");
        mimeTypeMap.put("mp3", "audio/*");
        mimeTypeMap.put("mid", "audio/*");
        mimeTypeMap.put("xmf", "audio/*");
        mimeTypeMap.put("ogg", "audio/*");
        mimeTypeMap.put("wav", "audio/*");
        mimeTypeMap.put("3gp", "video/*");
        mimeTypeMap.put("mp4", "video/*");
        mimeTypeMap.put("rm", "video/*");
        mimeTypeMap.put("rmvb", "video/*");
        mimeTypeMap.put("avi", "video/*");
        mimeTypeMap.put("jpg", "image/*");
        mimeTypeMap.put("gif", "image/*");
        mimeTypeMap.put("png", "image/*");
        mimeTypeMap.put("jpeg", "image/*");
        mimeTypeMap.put("bmp", "image/*");
        mimeTypeMap.put("apk", "application/vnd.android.package-archive");
        mimeTypeMap.put("ppt", "application/vnd.ms-powerpoint");
        mimeTypeMap.put("pptx", "application/vnd.ms-powerpoint");
        mimeTypeMap.put("xls", "application/vnd.ms-excel");
        mimeTypeMap.put("xlsx", "application/vnd.ms-excel");
        mimeTypeMap.put("doc", "application/msword");
        mimeTypeMap.put("docx", "application/msword");
        mimeTypeMap.put("pdf", "application/pdf");
        mimeTypeMap.put("chm", "application/x-chm");
        mimeTypeMap.put("txt", "text/plain");
        mimeTypeMap.put("all", "*/*");
    }
    /**
     * 获取文件类型
     * @return
     */
    public static String getMimeType(String suffix){
        return mimeTypeMap.get(suffix);
    }

    /*
     * 这种方法更简单
    public static String getMimeType(String fileName) {
        String result = "application/octet-stream";
        int extPos = fileName.lastIndexOf(".");
        if(extPos != -1) {
            String ext = fileName.substring(extPos + 1);
            result = MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext);
        }
        return result;
    }*/
}

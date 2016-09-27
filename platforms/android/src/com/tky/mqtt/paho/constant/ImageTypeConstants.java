package com.tky.mqtt.paho.constant;

import com.ionicframework.im366077.R;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by MSI on 2016/09/13.
 */
public class ImageTypeConstants {
    private static final Map<String, Integer> mimeTypeMap = new HashMap<String, Integer>();
    static {
        mimeTypeMap.put("m4a", R.drawable.ems_file);
        mimeTypeMap.put("mp3", R.drawable.ems_file);
        mimeTypeMap.put("mid", R.drawable.ems_file);
        mimeTypeMap.put("xmf", R.drawable.ems_file);
        mimeTypeMap.put("ogg", R.drawable.ems_file);
        mimeTypeMap.put("wav", R.drawable.ems_file);
        mimeTypeMap.put("3gp", R.drawable.ems_video);
        mimeTypeMap.put("mp4", R.drawable.ems_video);
        mimeTypeMap.put("jpg", R.drawable.ems_photo);
        mimeTypeMap.put("gif", R.drawable.gif);
        mimeTypeMap.put("png", R.drawable.ems_photo);
        mimeTypeMap.put("jpeg", R.drawable.ems_photo);
        mimeTypeMap.put("bmp", R.drawable.ems_photo);
        mimeTypeMap.put("apk", R.drawable.ems_apk);
        mimeTypeMap.put("ppt", R.drawable.explorer_ppt);
        mimeTypeMap.put("pptx", R.drawable.explorer_ppt);
        mimeTypeMap.put("xls", R.drawable.explorer_xls);
        mimeTypeMap.put("xlsx", R.drawable.explorer_xls);
        mimeTypeMap.put("doc", R.drawable.explorer_file_doc);
        mimeTypeMap.put("docx", R.drawable.explorer_file_doc);
        mimeTypeMap.put("pdf", R.drawable.explorer_pdf);
        mimeTypeMap.put("chm", R.drawable.explorer_file_archive);
        mimeTypeMap.put("txt", R.drawable.explorer_txt);
        mimeTypeMap.put("htm", R.drawable.explorer_html);
        mimeTypeMap.put("html", R.drawable.explorer_html);
        mimeTypeMap.put("xml", R.drawable.explorer_xml);
        mimeTypeMap.put("all", R.drawable.ems_file);
    }
    /**
     * 获取文件类型对应的图片
     * @return
     */
    public static int getMimeType(String suffix){
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

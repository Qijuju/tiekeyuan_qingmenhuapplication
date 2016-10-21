package com.tky.mqtt.paho.utils;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;

import java.io.File;

/**
 * 作者：SLS
 * 包名：com.tky.mqtt.paho.utils
 * 日期：2016/10/17 17:29
 * 描述：拍照
 */
public class PhotoUtils {
    public static final int TAKE_PICTURE = 0x0104;
    //类型码
    public static int REQUEST_CODE;

    /**
     * 拍照方法
     * @param context activity的实例
     */
    public static void takePhoto(Context context) {
        Uri imageUri = null;
        String fileName = null;
        Intent openCameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        REQUEST_CODE = TAKE_PICTURE;
        fileName = "photo.jpg";
        imageUri = Uri.fromFile(new File(Environment.getExternalStorageDirectory(), fileName));
        //指定照片保存路径（SD卡），image.jpg为一个临时文件，每次拍照后这个图片都会被替换
        openCameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, imageUri);
        ((Activity)context).startActivityForResult(openCameraIntent, REQUEST_CODE);
    }

    /**
     * 计算图片的缩放值
     */
    public static int calculateInSampleSize(BitmapFactory.Options options,int reqWidth, int reqHeight) {
        final int height = options.outHeight;
        final int width = options.outWidth;
        int inSampleSize = 1;

        if (height > reqHeight || width > reqWidth) {
            final int heightRatio = Math.round((float) height/ (float) reqHeight);
            final int widthRatio = Math.round((float) width / (float) reqWidth);
            inSampleSize = heightRatio < widthRatio ? heightRatio : widthRatio;
        }
        return inSampleSize;
    }

    /**
     * 根据路径获得图片并压缩，返回bitmap用于显示
     */
    public static Bitmap getSmallBitmap(String filePath) {
        final BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeFile(filePath, options);
        options.inPreferredConfig = Bitmap.Config.RGB_565;    // 默认是Bitmap.Config.ARGB_8888
        options.inSampleSize = calculateInSampleSize(options, 1080, 1920);

        options.inJustDecodeBounds = false;

        return BitmapFactory.decodeFile(filePath, options);
    }


}

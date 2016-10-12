package com.tky.photohelper;

import android.app.Activity;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;

import com.ionicframework.im366077.R;

import java.io.File;

/**
 * Created by Administrator on 2016/9/28.
 */
public class PhotoScaleActivity extends Activity  {

    private PhotoView photoView;
    private MyReceiver receiver;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_photo);

        photoView = (PhotoView) findViewById(R.id.pv_scale);
        final String filePath = getIntent().getStringExtra("filePath");

        File file= new File(filePath);
        long filesize=file.length();

        if(filesize>1024*1024*2){
            BitmapFactory.Options opts = new BitmapFactory.Options();
            opts.inSampleSize = 2;
            Bitmap bitmap = BitmapFactory.decodeFile(filePath, opts);
            photoView.setImageBitmap(bitmap);
        }else {
            photoView.setImageURI(Uri.fromFile(new File(filePath)));
        }




        IntentFilter filter = new IntentFilter("com.tky.updatefilepath");
        receiver = new MyReceiver();
        registerReceiver(receiver,filter);
        receiver.setUpdateListener(new MyReceiver.UpdateListener() {
            @Override
            public void updatepath(String filepath) {
                File file2=new File(filepath);
                long file2size=file2.length();
                if(file2size>1024*1024*2){
                    BitmapFactory.Options opts = new BitmapFactory.Options();
                    opts.inSampleSize = 2;
                    Bitmap bitmap = BitmapFactory.decodeFile(filepath, opts);
                    photoView.setImageBitmap(bitmap);
                }else {
                    photoView.setImageURI(Uri.fromFile(new File(filepath)));
                }
            }
        });
    }

    @Override
    protected void onDestroy() {
        if (receiver!=null){
            unregisterReceiver(receiver);
            receiver=null;
        }
        super.onDestroy();
    }
}

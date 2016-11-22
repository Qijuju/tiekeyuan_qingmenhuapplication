package com.tky.photohelper;

import android.app.Activity;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.ProgressBar;

import com.ionicframework.im366077.R;

import java.io.File;

/**
 * Created by Administrator on 2016/9/28.
 */
public class PhotoScaleActivity extends Activity  {

    private PhotoView photoView;
    private MyReceiver receiver;
    private ProgressBar progressBar;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_photo);

        photoView = (PhotoView) findViewById(R.id.pv_scale);
        progressBar = (ProgressBar) findViewById(R.id.progress);

        final String filePath = getIntent().getStringExtra("filePath");
        final String fromwhere = getIntent().getStringExtra("fromwhere");
        final long factsize=getIntent().getLongExtra("filefactsize", 0l);

        String bigfilepath=getIntent().getStringExtra("bigfilepath");

        long bigfilesize=0;

        File file= new File(filePath);
        long filesize=file.length();


        File file1=new File(bigfilepath);
        if(file1.exists()){
             bigfilesize=file1.length();

        }

        //说明是从本地加载的照片 自己发送的直接展示就行
        if("local".equals(fromwhere)){

            //photoView.setImageURI(Uri.fromFile(new File(filePath)));

            if(filesize>1024*1024*2){
                BitmapFactory.Options opts = new BitmapFactory.Options();
                opts.inSampleSize = 2;
                Bitmap bitmap = BitmapFactory.decodeFile(filePath, opts);
                photoView.setImageBitmap(bitmap);

            }else {
                photoView.setImageURI(Uri.fromFile(new File(filePath)));
            }

        }else {

            //说明是接收到的照片
            if(bigfilesize!=factsize){
                progressBar.setVisibility(View.VISIBLE);
                photoView.setImageURI(Uri.fromFile(new File(filePath)));

            }else {
                progressBar.setVisibility(View.GONE);

                if(filesize>1024*1024*2){
                    BitmapFactory.Options opts = new BitmapFactory.Options();
                    opts.inSampleSize = 2;
                    Bitmap bitmap = BitmapFactory.decodeFile(filePath, opts);
                    photoView.setImageBitmap(bitmap);

                }else {
                    photoView.setImageURI(Uri.fromFile(new File(filePath)));
                }
            }

            IntentFilter filter = new IntentFilter("com.tky.updatefilepath");
            receiver = new MyReceiver();
            registerReceiver(receiver,filter);
            receiver.setUpdateListener(new MyReceiver.UpdateListener() {
                @Override
                public void updatepath(String filepath) {
                    progressBar.setVisibility(View.GONE);
                    File file2=new File(filepath);
                    long file2size=file2.length();
                    if(file2size>1024*1024*2){
                        BitmapFactory.Options opts = new BitmapFactory.Options();
                        opts.inSampleSize = 2;
                        Bitmap bitmap = BitmapFactory.decodeFile(filepath, opts);
                        photoView.setImageBitmap(bitmap);
                    }else {
                        //photoView.setImageURI(Uri.fromFile(new File(filepath)));
                        Bitmap bitmap2=BitmapFactory.decodeFile(filepath);
                        photoView.setImageBitmap(bitmap2);
                    }
                }
            });






        }

    }

    @Override
    protected void onDestroy() {
        progressBar.setVisibility(View.GONE);
        if (receiver!=null){
            unregisterReceiver(receiver);
            receiver=null;
        }
        super.onDestroy();
    }
}

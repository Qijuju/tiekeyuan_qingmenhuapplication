package com.tky.photoview;

import android.app.Activity;
import android.content.IntentFilter;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.widget.ProgressBar;

import com.ionicframework.im366077.R;
import com.tky.mqtt.paho.utils.AnimationUtils;
import com.tky.photohelper.MyReceiver;

import java.io.File;

/**
 * 作者：SLS
 * 包名：com.tky.photoview
 * 日期：2016/12/22 15:31
 * 描述：
 */
public class PhotoScaleActivity extends Activity {

    private PhotoView photoView;
    private MyReceiver receiver;
    private ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_photo2);
        AnimationUtils.execMagnifyAnim(this);
        photoView = (PhotoView) findViewById(R.id.pv_scale);
        photoView.enable();
        photoView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
                AnimationUtils.execShrinkAnim(PhotoScaleActivity.this);
            }
        });
        progressBar = (ProgressBar) findViewById(R.id.progress);
        final String filePath = getIntent().getStringExtra("filePath");
        final String fromwhere = getIntent().getStringExtra("fromwhere");
        final long factsize=getIntent().getLongExtra("filefactsize", 0l);
        String bigfilepath=getIntent().getStringExtra("bigfilepath");
        long bigfilesize=0;
        File file= new File(filePath);


        File file1=new File(bigfilepath);
        if(file1.exists()){
            bigfilesize=file1.length();

        }
        photoView.setAdjustViewBounds(true);
        if("local".equals(fromwhere)) {
            progressBar.setVisibility(View.GONE);
            photoView.setImageBitmap(BitmapFactory.decodeFile(filePath));
        } else {
            if(bigfilesize!=factsize) {
                progressBar.setVisibility(View.VISIBLE);
                photoView.setImageBitmap(BitmapFactory.decodeFile(filePath));
            } else {
                progressBar.setVisibility(View.GONE);
                photoView.setImageBitmap(BitmapFactory.decodeFile(bigfilepath));
            }
            IntentFilter filter = new IntentFilter("com.tky.updatefilepath");
            receiver = new MyReceiver();
            registerReceiver(receiver, filter);
            receiver.setUpdateListener(new MyReceiver.UpdateListener() {
                @Override
                public void updatepath(String filepath) {
                    progressBar.setVisibility(View.GONE);
                    File file2 = new File(filepath);
                    photoView.setImageBitmap(BitmapFactory.decodeFile(file2.getAbsolutePath()));
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

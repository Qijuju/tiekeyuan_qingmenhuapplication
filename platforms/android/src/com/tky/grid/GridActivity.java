package com.tky.grid;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.GridView;
import android.widget.ImageView;

import com.ionicframework.im366077.MainActivity;
import com.ionicframework.im366077.R;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.FilePicture;
import com.tky.mqtt.dao.FilePictureDao;
import com.tky.mqtt.paho.BaseApplication;
import com.tky.mqtt.paho.UIUtils;
import com.tky.photohelper.PhotoScaleActivity;

import java.util.List;

/**
 * Created by Administrator on 2016/10/10.
 */
public class GridActivity extends Activity {

    private GridView mGridView;

    private DaoSession mDaoSession;
    private FilePictureDao filePictureDao;

    private String[] IMAGES_PATH = null;
    private ImageLoader mImageLoader;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_grid);

        mImageLoader = ImageLoader.getInstance(3, ImageLoader.Type.LIFO);

        mDaoSession= BaseApplication.getDaoSession(UIUtils.getContext());
        filePictureDao=mDaoSession.getFilePictureDao();
        String sessionid = getIntent().getStringExtra("sessionid");
        String type = getIntent().getStringExtra("type");
        getImagespath(sessionid,type);
        init();
    }

    private void getImagespath(String sessionid,String type) {
        List<FilePicture> filePictures= filePictureDao.queryBuilder().where(FilePictureDao.Properties.Sessionid.eq(sessionid))
                .where(FilePictureDao.Properties.Type.eq(type))
                .orderAsc(FilePictureDao.Properties.When)
                .build()
                .list();

        String[] IMAGES_PATHs = new String[filePictures.size()];

        for(int i=0;i<filePictures.size();i++){
            IMAGES_PATHs[i]=filePictures.get(i).getBigurl();
        }

        IMAGES_PATH = IMAGES_PATHs;

    }

    private void init() {
        mGridView = (GridView) findViewById(R.id.gridView);
        setUpAdapter();
        mGridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                Intent intent =new Intent(GridActivity.this, PhotoScaleActivity.class);
                intent.putExtra("filePath",IMAGES_PATH[i]);
                intent.putExtra("fromwhere","local");
                intent.putExtra("filefactsize",0l);
                intent.putExtra("bigfilepath",IMAGES_PATH[i]);
                startActivity(intent);
            }
        });
    }

    private void setUpAdapter() {

        if (IMAGES_PATH != null)
        {
            mGridView.setAdapter(new ListImgItemAdaper(this, 0,
                    IMAGES_PATH));
        } else
        {
            mGridView.setAdapter(null);
        }

    }

    private class ListImgItemAdaper extends ArrayAdapter<String>
    {

        public ListImgItemAdaper(Context context, int resource, String[] datas)
        {
            super(context, 0, datas);
            Log.e("TAG", "ListImgItemAdaper");
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent)
        {
            if (convertView == null)
            {
                convertView= LayoutInflater.from(getContext()).inflate(R.layout.grid_item, null);
            }
            ImageView imageview = (ImageView) convertView
                    .findViewById(R.id.imageView);
            imageview.setImageResource(R.drawable.icon);
            mImageLoader.loadImage(getItem(position), imageview, false);
            return convertView;
        }




    }


}

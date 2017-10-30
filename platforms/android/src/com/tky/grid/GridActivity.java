package com.tky.grid;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.GridView;
import android.widget.ImageView;

import com.r93535.im.R;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.FilePicture;
import com.tky.mqtt.dao.FilePictureDao;
import com.tky.mqtt.paho.BaseApplication;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.constant.ResumeParams;
import com.tky.mqtt.paho.utils.AnimationUtils;

import java.io.File;
import java.util.ArrayList;
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
    private ImageView imageView;


  @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_grid);

        imageView = (ImageView) findViewById(R.id.tv_back);

        AnimationUtils.execNextAnim(this);

        mImageLoader = ImageLoader.getInstance(3, ImageLoader.Type.LIFO);

        mDaoSession= BaseApplication.getDaoSession(UIUtils.getContext());
        filePictureDao=mDaoSession.getFilePictureDao();
        String sessionid = getIntent().getStringExtra("sessionid");
        String type = getIntent().getStringExtra("type");
        getImagespath(sessionid,type);
        init();

        imageView.setOnClickListener(new View.OnClickListener() {
          @Override
          public void onClick(View view) {
            GridActivity.this.finish();

          }
        });
    }


    //从数据库获取图片列表
    private void getImagespath(String sessionid,String type) {
        List<FilePicture> filePictures= filePictureDao.queryBuilder().where(FilePictureDao.Properties.Sessionid.eq(sessionid))
                .where(FilePictureDao.Properties.Type.eq(type))
                .orderAsc(FilePictureDao.Properties.When)
                .build()
                .list();

        String[] IMAGES_PATHs = new String[filePictures.size()];
        List<String> list = new ArrayList<String>();

        for(int i=0;i<filePictures.size();i++){
            String path = trimNull(filePictures.get(i).getBigurl());
            if (path == null) {
                continue;
            } else {
//                IMAGES_PATHs[i] = path;
                list.add(path);
            }
        }
        IMAGES_PATH = new String[list.size()];
        list.toArray(IMAGES_PATH);

    }

    private String trimNull(String trims) {
        File file = new File(trims);
//        String path = FileUtils.getIconDir() + File.separator + "default" + File.separator + "default.png";
        return trims == null || TextUtils.isEmpty(trims) || !file.exists() ? null : trims;
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (ResumeParams.IMG_RESUME) {
            AnimationUtils.execShrinkAnim(this);
            ResumeParams.IMG_RESUME = false;
        }
    }

    private void init() {
        mGridView = (GridView) findViewById(R.id.gridView);
        setUpAdapter();
        mGridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                Intent intent =new Intent(GridActivity.this, com.tky.photoview.PhotoScaleActivity.class);
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

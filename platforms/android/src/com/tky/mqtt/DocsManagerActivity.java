package com.tky.mqtt;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.ionicframework.im366077.R;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.constant.ImageTypeConstants;
import com.tky.mqtt.paho.utils.FileUtils;

import java.io.File;
import java.io.FilenameFilter;

/**
 * 作者：
 * 包名：com.tky.mqtt
 * 日期：2016/9/13 9:00
 * 描述：
 */
public class DocsManagerActivity extends Activity {

    private ListView listMain;
    private File[] files;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_docs_manager);
        listMain = (ListView) findViewById(R.id.list_main);
        files = getFiles();
        listMain.setAdapter(new MyAdapter());
        listMain.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Intent intent = getIntent();
                intent.putExtra("filePath", files[position].getAbsolutePath());
                setResult(0, intent);
                finish();
            }
        });
    }

    class MyAdapter extends BaseAdapter {
        @Override
        public int getCount() {
            return files != null ? files.length : 0;
        }

        @Override
        public Object getItem(int position) {
            return files[position];
        }

        @Override
        public long getItemId(int position) {
            return position;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            ViewHolder holder = null;
            if (convertView == null) {
                convertView = UIUtils.inflate(R.layout.item_docs_manager);
                holder = new ViewHolder();
                holder.image = (ImageView) convertView.findViewById(R.id.image);
                holder.content = (TextView) convertView.findViewById(R.id.content);
                convertView.setTag(holder);
            } else {
                holder = (ViewHolder) convertView.getTag();
            }
            /*if (position % 2 == 0) {
                holder.image.setImageResource(R.drawable.flip_camera);
            } else {
                holder.image.setImageResource(R.drawable.icon_friends);
            }*/
            holder.image.setImageResource(ImageTypeConstants.getMimeType(UIUtils.getSuffix(files[position].getAbsolutePath())));
            holder.content.setText(files[position].getName());
            return convertView;
        }

        class ViewHolder {
            ImageView image;
            TextView content;
        }
    }

    /**
     * 获取某个目录下的所有文件
     * @return
     */
    private File[] getFiles() {
        String dir = FileUtils.getIconDir() + File.separator + "chat_img";
        File file = new File(dir);
        if (!file.exists()) {
            return null;
        }
        File[] files = file.listFiles(new FilenameFilter() {
            @Override
            public boolean accept(File dir, String filename) {
                File dirFile = new File(dir, filename);
                return !dirFile.isDirectory();
            }
        });
       /* List<String> fileList = new ArrayList<String>();
        for (File single : files) {
            if (single != null && single.exists()) {
                fileList.add(single.getAbsolutePath());
            }
        }*/
        return files;
    }

//    public void

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        return super.onKeyDown(keyCode, event);
    }
}

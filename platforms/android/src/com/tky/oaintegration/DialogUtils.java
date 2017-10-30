package com.tky.oaintegration;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.r93535.im.R;
import com.tky.mqtt.paho.UIUtils;


/**
 * Created by sb on 2015/7/31.
 */
public class DialogUtils {
    /**
     * @param context 上下文环境，不能是getApplicationContext()获取的结果
     * @param title 标题
     * @param message 消息内容
     * @param callBack 回调函数
     */
    public static void alertDialog(final Context context, final String title, final String message, final DialogCallBack callBack){
        UIUtils.runInMainThread(new Runnable() {
            @Override
            public void run() {
                AlertDialog.Builder builder = new AlertDialog.Builder(context);
                builder.setTitle(title);
                builder.setMessage(message);
                builder.setCancelable(false);
                builder.setPositiveButton("确认", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        callBack.positive();
                    }
                });
                builder.setNegativeButton("取消", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        callBack.negative();
                    }
                });
                builder.show();
            }
        });

    }

    public interface DialogCallBack {
        /**
         * 点击确定按钮的处理事件（需要自己控制dialog.dismiss()）
         */
        public void positive();
        /**
         * 点击取消按钮的处理事件
         */
        public void negative();
    }
}

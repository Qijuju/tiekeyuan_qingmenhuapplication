package com.tky.mqtt.plugin.thrift.api;

import android.app.ProgressDialog;
import android.content.Context;

/**
 * Created by Administrator on 2016/9/21.
 */
public class ProgressDialogFactory {

    private static ProgressDialog progressDialog = null;

    public static ProgressDialog getProgressDialog(Context context) {
        if (progressDialog == null) {
            progressDialog = new ProgressDialog(context);
            progressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);// 设置水平进度条
            progressDialog.setCancelable(false);// 设置是否可以通过点击Back键取消
            progressDialog.setCanceledOnTouchOutside(false);// 设置在点击Dialog外是否取消Dialog进度条
            progressDialog.setMax(100);
            progressDialog.setMessage("下载中...");
            progressDialog.show();
        }
        return progressDialog;
    }

    public static void setProgress(int value) {
        if (progressDialog != null) {
            progressDialog.setProgress(value);
        }
    }

    public static void cancel() {
        if (progressDialog != null) {
            progressDialog.dismiss();
            progressDialog = null;
        }
    }
}

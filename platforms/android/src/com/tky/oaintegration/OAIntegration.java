package com.tky.oaintegration;

import android.app.ProgressDialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Environment;
import android.os.Parcelable;
import android.util.Log;
import android.widget.Toast;

import com.google.gson.Gson;
import com.r93535.im.Constants;
import com.r93535.im.MainActivity;
import com.r93535.im.R;
import com.r93535.im.TestActivity;
import com.tky.im.enums.IMEnums;
import com.tky.im.utils.IMStatusManager;
import com.tky.im.utils.IMSwitchLocal;
import com.tky.mqtt.paho.SPUtils;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.callback.OKHttpCallBack2;
import com.tky.mqtt.paho.http.OKAsyncClient;
import com.tky.mqtt.paho.http.Request;
import com.tky.mqtt.paho.httpbean.ParamsMap;
import com.tky.mqtt.paho.httpbean.VersionInfo;
import com.tky.mqtt.plugin.thrift.ThriftApiClient;
import com.tky.mqtt.plugin.thrift.api.ProgressDialogFactory;
import com.tky.okhttpload.ImFileCallBack;
import com.zhy.http.okhttp.OkHttpUtils;
import com.zhy.http.okhttp.callback.StringCallback;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import okhttp3.Call;

/**
 * 作者：
 * 包名：com.tky.oaintegration
 * 日期：2017-08-23 15:47:29
 * 描述：oa集成插件
 */
public class OAIntegration extends CordovaPlugin {
    private static String TAG=OAIntegration.class.getSimpleName();
    private String s1 = "oa.app";//公文处理actionname
    private String s2 = "hideicon.yy";//物资设备actionname
    private String s3 = "com.ivms.traffic.tainan.launch";//视频监控actionname(路畅均安)

  	@Override
    public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    Method method = OAIntegration.class.getDeclaredMethod(action, JSONArray.class, CallbackContext.class);
                    method.invoke(OAIntegration.this, args, callbackContext);
                } catch (NoSuchMethodException e) {
                    e.printStackTrace();
                } catch (InvocationTargetException e) {
                    e.printStackTrace();
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        });
        return true;
    }

    /**
     * 获取oa应用并启动
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void getApk(final JSONArray args, final CallbackContext callbackContext) {
        try {
            //应用的包名
            String packagename = args.getString(0);
//            System.out.println("拿到的包名"+packagename);
            //应用的appid
            final String appId = args.getString(1);
            //应用的名称
            String name = args.getString(2);
            //当集成的应用是物资设备时，需要拿到URL
            String url= args.getString(3);
//            Log.i("传进来的包名：", packagename + "");
            if(!(isAppInstalled(UIUtils.getContext(),packagename == null ? "" : packagename.trim()))){
                DialogUtils.alertDialog(cordova.getActivity(), "下载", "确认下载吗", new DialogUtils.DialogCallBack() {
                    @Override
                    public void positive() {
                        /**
                         * 1.先判断本地apk版本名跟服务器的版本名作对比，若服务器版本大于本地版本，强制升级
                         * 2.调用下载接口，下载apk
                         */
                        compareVersion(appId, "A", new CompareCallBack() {
                            @Override
                            public void setResult(final VersionInfo obj) {
                                //下载应用
                                new Thread(new Runnable() {
                                    @Override
                                    public void run() {
                                         downloadAPK(obj.getVersionName(),"ExtApp","A",appId, obj.getFileSize());
                                    }
                                }).start();
                            }
                        });
                    }
                    @Override
                    public void negative() {

                    }
                });

            }else{
                if(name.equals("公文处理")){
                    startAppByAction(s1,name,url);
                }else if(name.equals("物资设备")){
                    startAppByAction(s2,name,url);
                }else if(name.equals("视频监控")){
                    startAppByAction(s3,name,url);
                }


            }
            setResult("success",PluginResult.Status.OK,callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }


    /**
     * 创建桌面快捷方式
     */
    public void createDsk(final JSONArray args, final CallbackContext callbackContext) {
        try {
            //应用的包名
            final String packagename = args.getString(0);
//            System.out.println("拿到的包名"+packagename);
            //应用的appid
            final String appId = args.getString(1);
            //应用的名称
            final String name = args.getString(2);

            UIUtils.runInMainThread(new Runnable() {
                @Override
                public void run() {
                    // 创建添加快捷方式的Intent
                    Intent addShortCut = new Intent(
                            "com.android.launcher.action.INSTALL_SHORTCUT");
                    addShortCut.putExtra("duplicate", false);
                    // 加载app的logo
                    Parcelable icon = Intent.ShortcutIconResource.fromContext(
                            cordova.getActivity(), R.drawable.ems_book);
                    //点击快捷方式后操作Intent,快捷方式建立后，再次启动该程序
                    Intent intent = new Intent(Intent.ACTION_MAIN);
                    intent.setAction("oa.app");
//                    intent.setClass(cordova.getActivity(), TestActivity.class);
//                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
//                    intent.addCategory(Intent.CATEGORY_LAUNCHER);
                    //设置快捷方式的标题
                    addShortCut.putExtra(Intent.EXTRA_SHORTCUT_NAME, "公文处理");
                    //设置快捷方式的图标
                    addShortCut.putExtra(Intent.EXTRA_SHORTCUT_ICON_RESOURCE, icon);
                    //设置快捷方式对应的Intent
                    addShortCut.putExtra(Intent.EXTRA_SHORTCUT_INTENT, intent);
                    //发送广播添加快捷方式
                    cordova.getActivity().sendBroadcast(addShortCut);
                }
            });
            System.out.println("进来创建桌面快捷方式");
            setResult("success",PluginResult.Status.OK,callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }


    /**
     * 检查某个应用是否安装
     * @param packageName
     * @return
     */
    public static boolean isAppInstalled(Context context, String packageName) {
        PackageManager packageManager =context.getPackageManager();
        if (packageName == null || "".equals(packageName)) {
            Log.i(TAG, "找不到包名！！！");
            return true;
        }
        if (packageManager == null) {
            packageManager = UIUtils.getContext().getPackageManager();
        }
        try {
            packageManager.getApplicationInfo(packageName, PackageManager.GET_INSTRUMENTATION);
            Log.i(TAG, "应用正确安装！！！");
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            Log.i(TAG, "没有安装此应用！！！");
            return false;
        }
    }



    //启动APP
    public void startAppByAction(String actionname,String name,String url){
        try {
            if(actionname.equals("oa.app")){//公文处理
                Intent intent=new Intent();
                intent.setAction(actionname);
                cordova.getActivity().startActivity(intent);
            }else if(actionname.equals("hideicon.yy")){//物资设备
                Intent intent=new Intent();
                ComponentName cn = new ComponentName("com.mengyou.myplatforms",
                        "com.mengyou.myplatforms.MainActivity");
                intent.setComponent(cn);
                Uri uri = Uri.parse("wzsb");// 此处应与物资设备程序中Data中标签一致
                intent.setData(uri);
              intent.putExtra("wzsb_url", url);
                cordova.getActivity().startActivity(intent);
            }else if(actionname.equals("com.ivms.traffic.tainan.launch")){//视频监控(路畅均安)
                Intent intent=new Intent();
                intent.setAction(actionname);
                cordova.getActivity().startActivity(intent);
            }else{
                Toast.makeText(UIUtils.getContext(), "应用程序异常", Toast.LENGTH_SHORT).show();
            }
        }catch (Exception e){
            e.printStackTrace();
        }

    }


    /**
     * 文件服务：下载oa应用
     */

    public void downloadAPK(String fileId,String type,String platform,String appId,final long filesize){
        try {
            Log.i(TAG,"234233434");
            Map<String, String> map = new HashMap<String, String>();
            map.put("id", IMSwitchLocal.getUserID());
            map.put("mepId", UIUtils.getDeviceId());
            map.put("fileId",fileId);
            map.put("type",type);
            map.put("appId", appId);
            map.put("platform", platform);
            String filePath = Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + "LPREMPLAT";
            OkHttpUtils.get()
                    .url(Constants.commonfileurl + "/DownloadFile")
                    .params(map)
                    .build()
                    .execute(new ImFileCallBack(filePath,"") {
                        ProgressDialog pdDialog;
                        @Override
                        public void onBefore(okhttp3.Request request, int id) {
                            super.onBefore(request, id);
                            UIUtils.runInMainThread(new Runnable() {
                                @Override
                                public void run() {
                                    pdDialog=new ProgressDialog(cordova.getActivity());
                                    pdDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
                                    pdDialog.setTitle("正在下载应用……");
                                    pdDialog.setIndeterminate(false);
                                    pdDialog.setCanceledOnTouchOutside(false);
                                    pdDialog.show();
                                }
                            });
                        }

                        @Override
                        public void onError(Call call, Exception e, int id) {

                        }

                        @Override
                        public void onResponse(File response, int id) {
                            pdDialog.dismiss();
                            UIUtils.installApk(response.getAbsolutePath());
                        }

                        @Override
                        public void inProgress(float progress, long total, int id) {
                            super.inProgress(progress, total, id);
//                            IMEnums imEnums= IMStatusManager.getImStatus();
//                            if(imEnums == IMEnums.CONNECT_DOWN_BY_HAND){
//                                IMSwitchLocal.exitLogin(UIUtils.getContext());
//                                return;
//                            }
                            progress = progress *  100;
                            final float finalProgress = progress;
                            UIUtils.runInMainThread(new Runnable() {
                                @Override
                                public void run() {
                                    pdDialog.setProgress(Math.round(finalProgress));
                                }
                            });

                        }
                    });
        } catch (JSONException e) {
            e.printStackTrace();
        }

    }

    /**
     * 获取服务器oa版本名
     * @param appId
     */
    public void compareVersion(String appId,String platform,final CompareCallBack compareCallBack){
        try {
            Request request = new Request(cordova.getActivity(), Constants.commonfileurl);
            Map<String, Object> paramsMap = ParamsMap.getInstance("GetExtAppInfo").getParamsMap();
            paramsMap.put("appId", appId);
            paramsMap.put("platform", platform);
            request.addParamsMap(paramsMap);
            OKAsyncClient.get(request, new OKHttpCallBack2<VersionInfo>() {
                @Override
                public void onFailure(Request request, Exception e) {

                }

                @Override
                public void onSuccess(Request request, VersionInfo result) {
                    compareCallBack.setResult(result);
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public interface CompareCallBack {
        public void setResult(VersionInfo obj);
    }


    /**
     * 插件-给js端提供获取版本号接口
     */
    public String getCurrentVersion(final JSONArray args,final CallbackContext callbackContext) {
        PackageManager manager = UIUtils.getContext().getPackageManager();
        try {
            PackageInfo pi = manager.getPackageInfo(UIUtils.getContext().getPackageName(), 0);
            if (pi != null) {
                setResult(pi.versionName,PluginResult.Status.OK,callbackContext);
                return pi.versionName;
            }
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 设置返回信息
     * @param result 返回结果数据
     * @param resultStatus 返回结果状态  PluginResult.Status.ERROR / PluginResult.Status.OK
     * @param callbackContext
     */
    public void setResult(String result, PluginResult.Status resultStatus, CallbackContext callbackContext){
        MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }

    /**
     * 设置返回信息
     * @param result 返回结果数据
     * @param resultStatus 返回结果状态  PluginResult.Status.ERROR / PluginResult.Status.OK
     * @param callbackContext
     */
    public void setResult(JSONObject result, PluginResult.Status resultStatus, CallbackContext callbackContext){
        MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }


}





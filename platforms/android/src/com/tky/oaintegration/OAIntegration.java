package com.tky.oaintegration;

import android.app.ProgressDialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;
import android.widget.Toast;

import com.google.gson.Gson;
import com.r93535.im.Constants;
import com.tky.im.utils.IMSwitchLocal;
import com.tky.mqtt.paho.SPUtils;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.callback.OKHttpCallBack2;
import com.tky.mqtt.paho.http.OKAsyncClient;
import com.tky.mqtt.paho.http.Request;
import com.tky.mqtt.paho.httpbean.LoginInfoBean;
import com.tky.mqtt.paho.httpbean.ParamsMap;
import com.tky.mqtt.paho.httpbean.User;
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
            //应用的appid
            final String appId = args.getString(1);
            //应用的名称
            String name = args.getString(2);
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
                    startAppByAction(s1,name);
                }else if(name.equals("物资设备")){
                    startAppByAction(s2,name);
                }

            }
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
    public void startAppByAction(String actionname,String name){
        try {
            if(actionname.equals("oa.app")){
                Intent intent=new Intent();
                //判断是否为在线培训
                if(actionname.equals("elearning.a")){
                    intent.putExtra("key_elearning_default_login", true);
                }
                intent.setAction(actionname);
                cordova.getActivity().startActivity(intent);
            }else if(actionname.equals("hideicon.yy")){//物资设备
                //取出当前用户的username和realname
                String logininfo= SPUtils.getString("login_info","");
              JSONObject jsonObject=new JSONObject(logininfo);
//              JSONObject userStr=jsonObject.getJSONObject("user");
              String username = jsonObject.getString("loginAccount");
              String realname = jsonObject.getString("userName");
//              System.out.println("用户名"+username+realname);
                Intent intent=new Intent();
                ComponentName cn = new ComponentName("com.mengyou.myplatforms",
                        "com.mengyou.myplatforms.MainActivity");
                intent.setComponent(cn);
                Uri uri = Uri.parse("wzsb");// 此处应与物资设备程序中Data中标签一致
                intent.setData(uri);
                String wzsbUrl="http://123.56.187.121:60/interfaceLogin.aspx?UserName="+username+"&RealName="+realname+"&GUID=c95c77759ba60769d55cf441508ee342";
//              System.out.println("用户名url "+wzsbUrl);

              intent.putExtra("wzsb_url", wzsbUrl);
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
            String filePath = Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + "NewEMCAPP";
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
                            progress = (progress * (-1.0f)) / filesize * 100;
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





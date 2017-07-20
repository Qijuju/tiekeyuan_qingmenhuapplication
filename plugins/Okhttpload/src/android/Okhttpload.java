package com.tky.okhttpload;

import android.os.Environment;
import android.os.Looper;
import android.util.Log;

import com.google.gson.Gson;
import com.tky.im.utils.IMUtils;
import com.tky.mqtt.paho.ToastUtil;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.utils.FileUtils;
import com.tky.mqtt.paho.utils.NetUtils;
import com.zhy.http.okhttp.OkHttpUtils;
import com.zhy.http.okhttp.callback.FileCallBack;
import com.zhy.http.okhttp.callback.StringCallback;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import okhttp3.Call;

/**
 * 作者：
 * 包名：com.tky.okhttpload
 * 日期：2017-06-27 18:11:31
 * 描述：数据的存储于获取工具插件
 */
public class Okhttpload extends CordovaPlugin {


  	@Override
    public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    Method method = Okhttpload.class.getDeclaredMethod(action, JSONArray.class, CallbackContext.class);
                    method.invoke(Okhttpload.this, args, callbackContext);
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
   * 文件是上传
   * @param args
   * @param callbackContext
     */
    public void upload(final JSONArray args, final CallbackContext callbackContext) {
      try {

        final JSONObject messageDetail=args.getJSONObject(0);
        String objectTP = args.getString(1);
        String objectID = args.getString(2);
        String filePath = args.getString(3).split("###")[0];
        String url = args.getString(4);

        if (objectID != null && ("null".equals(objectID.trim()) || "".equals(objectID.trim()))) {
          objectID = null;
        }

        //发送文件的类型 文件 图片 viedo
        String messagetype = messageDetail.getString("messagetype");
        //发送者id
        String senderid=messageDetail.getString("senderid");
        //接受者id
        String receiveid=messageDetail.getString("sessionid");
        //imcode码
        String imcod= UIUtils.getDeviceId();

        File file=null;
        String nowSavePath=null;

        //判读发送的类型是什么
        if (!"Audio".equals(messagetype) && !"Vedio".equals(messagetype)&&!"File".equals(messagetype)){

          //把选择的图片拷贝到指定的目录下面 im目录下
          FileInputStream fis=new FileInputStream(filePath);
          final String dir = FileUtils.getIconDir() + File.separator + "chat_img";
          File dirFile = new File(dir);
          if (dirFile != null && !dirFile.exists()) {
            dirFile.mkdirs();
          }

          //重新保存的文件的路径
          nowSavePath = dir + File.separator + filePath.substring(filePath.lastIndexOf("/") + 1, filePath.length());

          file=new File(nowSavePath);

          //复制文件到指定目录
          if (!file.exists()) {
            FileOutputStream fos = new FileOutputStream(nowSavePath);

            byte[] bys = new byte[10 * 1024];
            int len = 0;
            while ((len = fis.read(bys)) != -1) {
              fos.write(bys, 0, len);
            }

            fos.close();
          }

        }else {
          //如果不是图片直接用的是自己的文件路径
          nowSavePath=filePath;
          file = new File(filePath);
        }

        final String savePath=nowSavePath;

        //文件的判断
        if (file==null||!file.exists()){
          return;
        }

        //根据网络状态来判断，
        if (!NetUtils.isConnect(UIUtils.getContext())){

          JSONArray retnObj = new JSONArray("['" + savePath + "','" + objectID + "','" + String.valueOf(-1) + "']");

          if (messageDetail!=null){
            retnObj.put(messageDetail);
          }
          setResult(retnObj, PluginResult.Status.OK, callbackContext);

          return;

        }


        final long starttime=System.currentTimeMillis();



        Map<String, String> map = new HashMap<String, String>();
        map.put("qquuid", UUID.randomUUID().toString());
        map.put("id",senderid);
        map.put("mepId",imcod);
        map.put("type",messagetype);
        map.put("toId",receiveid);
        final String finalObjectID = objectID;
        OkHttpUtils.post()
          .addFile("qqfilename", file.getName(), file)
          .url(url)
          .params(map)
          .build()
          .execute(new StringCallback() {
            @Override
            public void onError(Call call, Exception e, int id) {
              JSONArray retnObj = null;
              try {
                 retnObj = new JSONArray("['" + savePath + "','" + finalObjectID + "','" + String.valueOf(-1) + "']");

              } catch (JSONException e1) {
                e1.printStackTrace();
              }

              if (messageDetail != null) {
                retnObj.put(messageDetail);
              }
              setResult(retnObj, PluginResult.Status.OK, callbackContext);

              System.out.print(e.getMessage()+"========================");
              e.printStackTrace();
            }

            @Override
            public void inProgress(final float progress, long total, int id) {
              super.inProgress(progress, total, id);
              if (((int)(progress * 100) % 5) == 0) {
                System.out.print(progress+"+++++++++++++++++++++++++++++++++");
                JSONArray retnObj = null;
                try {
                  retnObj = new JSONArray("['" + savePath + "','" + finalObjectID + "','" + String.valueOf(progress) + "']");
                } catch (JSONException e) {
                  e.printStackTrace();
                }
                if (messageDetail != null) {
                  retnObj.put(messageDetail);
                }
                setResult(retnObj, PluginResult.Status.OK, callbackContext);
              }


            }

            @Override
            public void onResponse(String response, int id) {
              long endtime=System.currentTimeMillis();

              long lasttime=endtime-starttime;

              Gson gson=new Gson();
                Map<String, String> obj=(Map<String, String>)gson.fromJson(response, Map.class);
              String docId=obj.get("fileId");

              JSONArray retnObj=null;
              try {
                 retnObj = new JSONArray(("['" + savePath + "','" + docId + "','" + String.valueOf(1) + "']"));
                if (messageDetail != null) {
                  retnObj.put(messageDetail);
                }
              } catch (JSONException e) {
                e.printStackTrace();
              }


              setResult(retnObj, PluginResult.Status.OK, callbackContext);
              System.out.print((lasttime/1000)+"======================================");
              ToastUtil.showSafeToast((lasttime)+"dddddddddddddddddd");
            }
          });
      } catch (JSONException e) {
        e.printStackTrace();
      }catch (FileNotFoundException e){
        e.printStackTrace();
      }catch (IOException e){
        e.printStackTrace();
      }






    }

  /**
   * 文件的下载
   * @param args
   * @param callbackContext
     */
    public void download(final JSONArray args, final CallbackContext callbackContext) {
    /*	//SP数据的key值
    	String key = args.getString(0);
    	//SP数据的默认值
    	String defValue = args.getString(1);*/



      String url="http://imtest.crbim.win:1666/IMFile/DownloadFile?fileId=7bb3ef8f-def7-465e-ba4b-778391b81efe";
      OkHttpUtils
        .get()
        .url(url)
        .build()
        .execute(new FileCallBack(Environment.getExternalStorageDirectory().getAbsolutePath(),"") {
          @Override
          public void onError(Call call, Exception e, int id) {

          }

          @Override
          public void onResponse(File response, int id) {
            System.out.print(response.getAbsoluteFile()+"下载的路径+++++++++++++++++++++++++++++++++");
          }

          @Override
          public void inProgress(float progress, long total, int id) {
            super.inProgress(progress, total, id);

            System.out.print(progress+"下载的进度+++++++++++++++++++++++++++++++++");

          }
        });







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

  /**
   *
   * @param result
   * @param resultStatus
   * @param callbackContext
     */

   private void setResult(JSONArray result, PluginResult.Status resultStatus, CallbackContext callbackContext) {
       MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
       pluginResult.setKeepCallback(true);
       callbackContext.sendPluginResult(pluginResult);
   }


}

package com.tky.mqtt.plugin.photo;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Log;

import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.FilePicture;
import com.tky.mqtt.dao.FilePictureDao;
import com.tky.mqtt.paho.BaseApplication;
import com.tky.mqtt.paho.SPUtils;
import com.tky.mqtt.paho.ToastUtil;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.utils.FileUtils;
import com.tky.mqtt.plugin.thrift.api.SystemApi;
import com.tky.mqtt.services.FilePictureService;
import com.tky.photohelper.PhotoScaleActivity;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.thrift.TException;
import org.apache.thrift.async.AsyncMethodCallback;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.UUID;

import im.server.File.IMFile;
import im.server.File.RSTgetFile;

/**
 * 作者：
 * 包名：com.tky.mqtt.plugin.photo
 * 日期：2016-09-28 15:07:57
 * 描述：
 */
public class ScalePhoto extends CordovaPlugin {

    private int TAKE_PHOTO_CODE = 0x0104;
    private boolean isDown = false;
  
  	@Override
    public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    Method method = ScalePhoto.class.getDeclaredMethod(action, JSONArray.class, CallbackContext.class);
                    method.invoke(ScalePhoto.this, args, callbackContext);
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
     * 缩放图片
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void scale(final JSONArray args, final CallbackContext callbackContext) {
    	//需要传入的图片路径
        try {
            String filepath = args.getString(0);
            Intent intent =new Intent(cordova.getActivity(), PhotoScaleActivity.class);
            intent.putExtra("filePath",filepath);
            intent.putExtra("fromwhere","local");
            cordova.getActivity().startActivity(intent);
            setResult("加载成功！", PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("加载失败！", PluginResult.Status.ERROR, callbackContext);
        }
    }
    
    /**
     * 请求大图并且缩放
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void netScale(final JSONArray args, final CallbackContext callbackContext) {
    	//图片的id
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String imageid = args.getString(0);
                    final String imagename=args.getString(1);
                    final String samllfilepath=args.getString(2);

                    DaoSession mDaoSession= BaseApplication.getDaoSession(UIUtils.getContext());
                    final FilePictureDao filePictureDao=mDaoSession.getFilePictureDao();
                    final FilePicture firstFilePic=filePictureDao.load(imageid);

                    //收到图片的真是大小
                    String factStringSize=firstFilePic.getBytesize();

                    final long factsize=Long.parseLong(factStringSize);

                    final File testFile = new File(FileUtils.getIconDir() + File.separator + "original" + File.separator + imagename);



                    if(testFile .exists() && testFile.length()==factsize){


                        FilePicture thirdFilePic=new FilePicture();
                        thirdFilePic.setFilepicid(firstFilePic.getFilepicid());
                        thirdFilePic.setFrom(firstFilePic.getFrom());
                        thirdFilePic.setSessionid(firstFilePic.getSessionid());
                        thirdFilePic.setFromname(firstFilePic.getFromname());
                        thirdFilePic.setToname(firstFilePic.getToname());
                        thirdFilePic.setSmallurl(firstFilePic.getSmallurl());
                        thirdFilePic.setBigurl(testFile.getAbsolutePath());
                        thirdFilePic.setBytesize(firstFilePic.getBytesize());
                        thirdFilePic.setMegabyte(firstFilePic.getMegabyte());
                        thirdFilePic.setFilename(firstFilePic.getFilename());
                        thirdFilePic.setType(firstFilePic.getType());
                        thirdFilePic.setWhen(System.currentTimeMillis());

                        filePictureDao.insertOrReplace(thirdFilePic);


                        UIUtils.runInMainThread(new Runnable() {
                            @Override
                            public void run() {
                                final Intent intent3=new Intent(cordova.getActivity(),PhotoScaleActivity.class);
                                intent3.putExtra("filePath",FileUtils.getIconDir() + File.separator + "original" + File.separator + imagename);
                                //intent3.putExtra("filefactsize",testFile.length());
                                cordova.getActivity().startActivity(intent3);
                            }
                        });
                    }else {

                        UIUtils.runInMainThread(new Runnable() {
                            @Override
                            public void run() {
                                final Intent intent=new Intent(cordova.getActivity(),PhotoScaleActivity.class);
                                intent.putExtra("filePath", samllfilepath);

                                cordova.getActivity().startActivity(intent);
                            }
                        });


                        //将正在下载状态改为false
                        isDown = false;

                        File filenew=new File(FileUtils.getIconDir() + File.separator + "original" + File.separator + imagename);

                        if(filenew.exists()){
                            filenew.delete();
                        }






                        SystemApi.getFile(getUserID(), "I", imageid, "00", 0, 0, new AsyncMethodCallback<IMFile.AsyncClient.GetFile_call>() {
                            @Override
                            public void onComplete(IMFile.AsyncClient.GetFile_call arg0) {
                                isDown = true;
                                if (arg0 != null) {
                                    try {
                                        RSTgetFile result = arg0.getResult();
                                        String tempPicName = null;
                                        if (result.result) {
                                            System.out.println("获取图片成功");
                                            String tempUserPic = FileUtils.getIconDir() + File.separator + "original";
                                            RandomAccessFile baf = null;
                                            File directory = new File(tempUserPic);
                                            if (!directory.exists()) {
                                                directory.mkdirs();
                                            }
                                            long offset = result.getOffset();
                                            String type = result.getObjectTP();
                                            tempPicName = "";
                                            tempPicName = tempUserPic + File.separator + imagename;//result.getObjectID() + "_" + type + "_" + result.picSize + objectID.split("###")[4].substring(objectID.split("###")[4].lastIndexOf("."));
//                                }
                                            File tempFile = new File(tempPicName);
                                            if (!tempFile.exists())
                                                tempFile.createNewFile();
                                            baf = new RandomAccessFile(tempFile, "rw");
                                            baf.seek(offset);
                                            while (isDown) {
                                                int length = result.fileByte.limit() - result.fileByte.position();
                                                baf.getChannel().write(result.fileByte);
                                                if (result.isFinish) {
                                                    System.out.println("文件下载完成。");
                                                    break;
                                                }
                                                try {
                                                    result = SystemApi.getFileSyncClient().getFileClient().GetFile(getUserID(), result.objectTP, result.getObjectID(),
                                                            result.getPicSize(), result.getOffset() + length, 0);
                                                } catch (JSONException e) {
                                                    e.printStackTrace();
                                                }
                                                if (!result.result) {
                                                    System.out.println("本次请求失败，原因：" + result.getResultMsg());
                                                    break;
                                                }
                                            }
                                            try {
                                                baf.close();
                                            } catch (IOException ex) {

                                            }
                                        } else {
                                            System.out.println("获取我的头像失败");
                                        }

                                        final String finalTempPicName = tempPicName;
                                        UIUtils.runInMainThread(new Runnable() {

                                            @Override
                                            public void run() {
                                                Intent intent1=new Intent();
                                                intent1.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                                intent1.setAction("com.tky.updatefilepath");
                                                intent1.putExtra("filepath", finalTempPicName);
                                                cordova.getActivity().sendBroadcast(intent1);
                                            }
                                        });


                                        FilePicture secondFilePic = new FilePicture();
                                        secondFilePic.setFilepicid(firstFilePic.getFilepicid());
                                        secondFilePic.setFrom(firstFilePic.getFrom());
                                        secondFilePic.setSessionid(firstFilePic.getSessionid());
                                        secondFilePic.setFromname(firstFilePic.getFromname());
                                        secondFilePic.setToname(firstFilePic.getToname());
                                        secondFilePic.setSmallurl(firstFilePic.getSmallurl());
                                        secondFilePic.setBigurl(tempPicName);
                                        secondFilePic.setBytesize(firstFilePic.getBytesize());
                                        secondFilePic.setMegabyte(firstFilePic.getMegabyte());
                                        secondFilePic.setFilename(firstFilePic.getFilename());
                                        secondFilePic.setType(firstFilePic.getType());
                                        secondFilePic.setWhen(System.currentTimeMillis());

                                        filePictureDao.insertOrReplace(secondFilePic);


                                        setResult(tempPicName, PluginResult.Status.OK, callbackContext);
                                        setResult("100", PluginResult.Status.OK, callbackContext);
                                    } catch (IOException e) {
                                        e.printStackTrace();
                                    } catch (TException e) {
                                        e.printStackTrace();
                                    }
                                }
                            }

                            @Override
                            public void onError(Exception e) {

                            }
                        });

                    }
                } catch (IOException e) {
                    e.printStackTrace();
                } catch (TException e) {
                    e.printStackTrace();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    public void takePhoto(final JSONArray args, final CallbackContext callbackContext) {
        String dir = FileUtils.getIconDir() + File.separator + "photo";
        String filename = UUID.randomUUID().toString() + ".jpg";
        String filePath = dir + filename;

        // final Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        Log.d("test", "MediaStore.ACTION_IMAGE_CAPTURE"
                + android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
        final Intent intent = new Intent(
                android.provider.MediaStore.ACTION_IMAGE_CAPTURE == null ? "android.media.action.IMAGE_CAPTURE"
                        : android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
        final File cameraDir = new File(dir);
        if (!cameraDir.exists()) {
            // return false;
            cameraDir.mkdirs();
        }

        final File file = new File(filePath);
        final Uri outputFileUri = Uri.fromFile(file);
        intent.putExtra(MediaStore.EXTRA_OUTPUT, outputFileUri);
        try {
            cordova.getActivity().startActivityForResult(intent, TAKE_PHOTO_CODE);

        } catch (final ActivityNotFoundException e) {
        }
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

    public String getUserID() throws JSONException {
        JSONObject userInfo = getUserInfo();
        return userInfo == null ? null : userInfo.getString("userID");
    }

    public JSONObject getUserInfo() throws JSONException {
        String login_info = SPUtils.getString("login_info", "");
        JSONObject obj = null;
        if (login_info == null || "".equals(login_info.trim())) {
            obj = null;
        } else {
            obj = new JSONObject(login_info);
        }
        return obj;
    }


}

 


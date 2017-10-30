package com.tky.mqtt.plugin.photo;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Log;

import com.tky.im.utils.IMUtils;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.FilePicture;
import com.tky.mqtt.dao.FilePictureDao;
import com.tky.mqtt.paho.BaseApplication;
import com.tky.mqtt.paho.SPUtils;
import com.tky.mqtt.paho.ToastUtil;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.utils.AnimationUtils;
import com.tky.mqtt.paho.utils.FileUtils;
import com.tky.mqtt.services.FilePictureService;
import com.tky.okhttpload.ImFileCallBack;
import com.zhy.http.okhttp.OkHttpUtils;
import com.zhy.http.okhttp.callback.FileCallBack;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import okhttp3.Call;

/**
 * 作者：
 * 包名：com.tky.mqtt.plugin.photo
 * 日期：2016-09-28 15:07:57
 * 描述：
 */
public class ScalePhoto extends CordovaPlugin {

    private int TAKE_PHOTO_CODE = 0x0104;


    private static final List<String> downList = new ArrayList<String>();

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
        try {
            //需要传入的图片路径
            String filepath = args.getString(0);
            Intent intent =new Intent(cordova.getActivity(), com.tky.photoview.PhotoScaleActivity.class);
            intent.putExtra("filePath",filepath);
            intent.putExtra("fromwhere","local");
            intent.putExtra("filefactsize",0l);
            intent.putExtra("bigfilepath",filepath);
            cordova.getActivity().startActivity(intent);
            AnimationUtils.execShrinkAnim(cordova.getActivity());
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
       /* new Thread(new Runnable() {
            String imageid=null;
            @Override
            public void run() {
                try {
                    imageid = args.getString(0);
                    final String imagename=args.getString(1);
                    final String samllfilepath=args.getString(2);

                  DaoSession mDaoSession= BaseApplication.getDaoSession(UIUtils.getContext());
                  final FilePictureDao filePictureDao=mDaoSession.getFilePictureDao();
                  final FilePicture firstFilePic=filePictureDao.load(imageid);
                  if (firstFilePic==null){
                    ToastUtil.showSafeToast("图片文件损坏");
                    return;
                  }

                    if (downList.contains(imageid)) {

                        UIUtils.runInMainThread(new Runnable() {
                            @Override
                            public void run() {
                                final Intent intent4=new Intent(cordova.getActivity(),com.tky.photoview.PhotoScaleActivity.class);
                                //传入的是小图路径
                                intent4.putExtra("filePath", samllfilepath);
                                intent4.putExtra("filefactsize", 0);

                                //传入的是大图路径
                                intent4.putExtra("bigfilepath",FileUtils.getIconDir() + File.separator + "original" + File.separator + imagename);
                                cordova.getActivity().startActivity(intent4);
                                AnimationUtils.execShrinkAnim(cordova.getActivity());
                            }
                        });

                        return;
                    }
                    downList.add(imageid);


                    //收到图片的真是大小
                    String factStringSize=firstFilePic.getBytesize();

                    final long factsize=Long.parseLong(factStringSize);

                    final File testFile = new File(FileUtils.getIconDir() + File.separator + "original" + File.separator + imagename);



                    if(testFile .exists() && testFile.length()==factsize){

                        downList.remove(imageid);
                        FilePicture thirdFilePic = new FilePicture();
                        thirdFilePic.setFilepicid(firstFilePic.getFilepicid());
                        thirdFilePic.set_id(firstFilePic.get_id());
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
                                final Intent intent3=new Intent(cordova.getActivity(),com.tky.photoview.PhotoScaleActivity.class);
                                intent3.putExtra("filePath",FileUtils.getIconDir() + File.separator + "original" + File.separator + imagename);
                                intent3.putExtra("filefactsize",factsize);
                                intent3.putExtra("bigfilepath",FileUtils.getIconDir() + File.separator + "original" + File.separator + imagename);
                                cordova.getActivity().startActivity(intent3);
                                AnimationUtils.execShrinkAnim(cordova.getActivity());
                            }
                        });

                        return;
                    }else {

                        File filenew=new File(FileUtils.getIconDir() + File.separator + "original" + File.separator + imagename);

                        if(filenew.exists()){
                            filenew.delete();
                        }

                        UIUtils.runInMainThread(new Runnable() {
                            @Override
                            public void run() {
                                final Intent intent=new Intent(cordova.getActivity(),com.tky.photoview.PhotoScaleActivity.class);
                                //传入的是小图路径
                                intent.putExtra("filePath", samllfilepath);
                                intent.putExtra("filefactsize",factsize);

                                //传入的是大图路径
                                intent.putExtra("bigfilepath",FileUtils.getIconDir() + File.separator + "original" + File.separator + imagename);
                                cordova.getActivity().startActivity(intent);
                                AnimationUtils.execShrinkAnim(cordova.getActivity());
                            }
                        });

                      //用post做文件的下载
                      String url="http://imtest.crbim.win:1666/DownloadFile";
                      String tempUserPic = FileUtils.getIconDir() + File.separator + "original";
                      String imcode= UIUtils.getDeviceId();
                      String loginid= IMUtils.getUserID();
                      OkHttpUtils
                        .get()
                        .addParams("id",loginid)
                        .addParams("mepId",imcode)
                        .addParams("fileId",imageid)
                        .addParams("type","Image")
                        .addParams("size","0")
                        .addParams("offset",String.valueOf(0))
                        .addParams("platform","A")
                        .url(url)
                        .build()
                        .execute(new FileCallBack(tempUserPic,imagename) {
                          @Override
                          public void onError(Call call, Exception e, int id) {
                            downList.remove(imageid);
                          }

                          @Override
                          public void onResponse(final File response, int id) {


                            UIUtils.runInMainThread(new Runnable() {

                              @Override
                              public void run() {
                                Intent intent1 = new Intent();
                                intent1.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                intent1.setAction("com.tky.updatefilepath");
                                intent1.putExtra("filepath", response.getAbsolutePath());
                                cordova.getActivity().sendBroadcast(intent1);
                              }
                            });

                            //成功以后修改数据库
                            FilePictureService filePictureService=FilePictureService.getInstance(UIUtils.getContext());
                            FilePicture filePicture=filePictureService.queryData("where filepicid =?",imageid).get(0);
                            filePicture.setBigurl(response.getAbsolutePath());
                            filePicture.setBytesize(String.valueOf(response.length()));
                            filePictureService.saveObj(filePicture);




                            setResult(response.getAbsolutePath(), PluginResult.Status.OK, callbackContext);
                            setResult("100", PluginResult.Status.OK, callbackContext);


                          }

                          @Override
                          public void inProgress(float progress, long total, int id) {
                            super.inProgress(progress, total, id);


                          }
                        });





                        //将正在下载状态改为false
                        //isDown = false;
                        callback = new MyAsyncMethodCallback<IMFile.AsyncClient.GetFile_call>() {
                            @Override
                            public void onComplete(IMFile.AsyncClient.GetFile_call arg0) {
                                //isDown = true;
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
                                            while (true) {
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

                                            downList.remove(imageid);

                                        } else {
                                            downList.remove(imageid);
                                            System.out.println("获取我的头像失败");
                                        }

                                        final String finalTempPicName = tempPicName;
                                        UIUtils.runInMainThread(new Runnable() {

                                            @Override
                                            public void run() {
                                                Intent intent1 = new Intent();
                                                intent1.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                                intent1.setAction("com.tky.updatefilepath");
                                                intent1.putExtra("filepath", finalTempPicName);
                                                cordova.getActivity().sendBroadcast(intent1);
                                            }
                                        });


                                        FilePicture secondFilePic = new FilePicture();
                                        secondFilePic.setFilepicid(firstFilePic.getFilepicid());
                                        secondFilePic.set_id(firstFilePic.get_id());
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
                                        downList.remove(imageid);
                                        e.printStackTrace();
                                    } catch (TException e) {
                                        downList.remove(imageid);
                                        e.printStackTrace();
                                    }
                                }
                                close();
                            }

                            @Override
                            public void onError(Exception e) {
                                close();
                                downList.remove(imageid);

                            }
                        };

                        SystemApi.getFile(getUserID(), "I", imageid, "00", 0, 0, callback);

                    }
                } catch (JSONException e) {

                    if(imageid!=null){
                        downList.remove(imageid);
                    }
                    e.printStackTrace();
                }
            }
        }).start();*/




      try {

          final String imageid= args.getString(0);
          final String imagename=args.getString(1);
          final String samllfilepath=args.getString(2);

          File filesmall=new File(samllfilepath);

          final long xiaotu=filesmall.length();

          final FilePictureService filePictureService=FilePictureService.getInstance(UIUtils.getContext());

          final FilePicture filePicture=filePictureService.queryData("where filepicid= ?",imageid).get(0);


          String fileurl=filePicture.getBigurl();
          String filebyte=filePicture.getBytesize();

          long daxiao=Long.parseLong(filebyte);

          File file=new File(fileurl);

          final long yuantu=file.length();

          if (downList.contains(imageid)){

            //刚进来时候判断文件的大小 是否
            if (file.exists() && file.length()==daxiao && file.length()!=-1){

              UIUtils.runInMainThread(new Runnable() {
                @Override
                public void run() {
                  final Intent intent3=new Intent(cordova.getActivity(),com.tky.photoview.PhotoScaleActivity.class);
                  intent3.putExtra("filePath",FileUtils.getIconDir() + File.separator + "original" + File.separator + imagename);
                  intent3.putExtra("filefactsize",yuantu);
                  intent3.putExtra("bigfilepath",FileUtils.getIconDir() + File.separator + "original" + File.separator + imagename);
                  cordova.getActivity().startActivity(intent3);
                  AnimationUtils.execShrinkAnim(cordova.getActivity());
                }
              });

            }
            return;
          }else {
            downList.add(imageid);

            File filenew=new File(FileUtils.getIconDir() + File.separator + "original" + File.separator + imagename);

            if(filenew.exists()){
              filenew.delete();
            }

            UIUtils.runInMainThread(new Runnable() {
              @Override
              public void run() {
                final Intent intent=new Intent(cordova.getActivity(),com.tky.photoview.PhotoScaleActivity.class);
                //传入的是小图路径
                intent.putExtra("filePath", samllfilepath);
                intent.putExtra("filefactsize",xiaotu);

                //传入的是大图路径
                intent.putExtra("bigfilepath",FileUtils.getIconDir() + File.separator + "original" + File.separator + imagename);
                cordova.getActivity().startActivity(intent);
                AnimationUtils.execShrinkAnim(cordova.getActivity());
              }
            });




            //用post做文件的下载
            String downurl="http://imtest.crbim.win:1666/DownloadFile";
            String tempUserPic = FileUtils.getIconDir() + File.separator + "original";
            String imcode= UIUtils.getDeviceId();
            String loginid= IMUtils.getUserID();
            OkHttpUtils
              .get()
              .addParams("id",loginid)
              .addParams("mepId",imcode)
              .addParams("fileId",imageid)
              .addParams("type","Image")
              .addParams("size","0")
              .addParams("offset",String.valueOf(0))
              .addParams("platform","A")
              .url(downurl)
              .build()
              .execute(new FileCallBack(tempUserPic,imagename) {
                @Override
                public void onError(Call call, Exception e, int id) {
                  filePicture.setBytesize(String.valueOf(-1));
                  filePictureService.saveObj(filePicture);
                  downList.remove(imageid);
                }

                @Override
                public void onResponse(final File response, int id) {


                  UIUtils.runInMainThread(new Runnable() {

                    @Override
                    public void run() {
                      Intent intent1 = new Intent();
                      intent1.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                      intent1.setAction("com.tky.updatefilepath");
                      intent1.putExtra("filepath", response.getAbsolutePath());
                      cordova.getActivity().sendBroadcast(intent1);
                    }
                  });

                  //成功以后修改数据库
                  filePicture.setBigurl(response.getAbsolutePath());
                  filePicture.setBytesize(String.valueOf(response.length()));
                  filePictureService.saveObj(filePicture);




                  setResult(response.getAbsolutePath(), PluginResult.Status.OK, callbackContext);
                  setResult("100", PluginResult.Status.OK, callbackContext);


                }

                @Override
                public void inProgress(float progress, long total, int id) {
                  super.inProgress(progress, total, id);


                }
              });

          }
      } catch (JSONException e) {
        e.printStackTrace();
      }
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
            AnimationUtils.execShrinkAnim(cordova.getActivity());

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




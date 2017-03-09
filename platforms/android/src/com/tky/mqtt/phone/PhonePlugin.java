package com.tky.mqtt.phone;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.telephony.PhoneNumberUtils;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * 打电话、发短信插件
 * Created by Administrator on 2016/7/18.
 */
public class PhonePlugin extends CordovaPlugin{
    private static final int PHONE_CALL=0;
    private static final int PHONE_SMS=0;
    private CallbackContext callbackContext;
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        this.callbackContext=callbackContext;
        if (action.equals("call")){
            call(args.get(0).toString(),callbackContext);
            return true;
        }else if (action.equals("sms")){
            sms(args.get(0).toString(),callbackContext);
            return true;
        }
        callbackContext.error("电话号码不能为空");
        return false;
    }
    //打电话
    private void call(String phonenumber, CallbackContext callbackContext){
        if (phonenumber!=null&&phonenumber.length()>0){
            if (PhoneNumberUtils.isGlobalPhoneNumber(phonenumber)){
                Intent intent=new Intent();
                intent.setAction(Intent.ACTION_DIAL);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                intent.setData(Uri.parse("tel:"+phonenumber));
                this.cordova.startActivityForResult(this,intent,PHONE_CALL);
                //callbackContext.success("success");
            }
            else {
                callbackContext.error(phonenumber+"不是有效的电话号码");
            }
        }
        else {
            callbackContext.error("电话号码不能为空");
        }
    }
    //发短信
    public void sms(String phonenumber,CallbackContext callbackContext){
        if (phonenumber!=null&&phonenumber.length()>0){
            if (PhoneNumberUtils.isGlobalPhoneNumber(phonenumber)){
                Uri uri=Uri.parse("smsto:"+phonenumber);
                Intent intent=new Intent(Intent.ACTION_SENDTO,uri);
                this.cordova.startActivityForResult(this,intent,PHONE_SMS);
            }
            else {
                callbackContext.error(phonenumber+"不是有效的电话号码");
            }
        }
        else {
            callbackContext.error("电话号码不能为空");
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        if (requestCode== Activity.RESULT_OK){
            if ((requestCode==PHONE_CALL)){
                this.callbackContext.success("拨打电话成功");
            }else if (requestCode==PHONE_SMS){
                this.callbackContext.success("发短信成功");
            }else {
                this.callbackContext.error("未知状态");
            }
        }else if (requestCode==Activity.RESULT_CANCELED){
            try {
                if (requestCode==PHONE_CALL){
                }else if (requestCode==PHONE_SMS){
                }else {
                    this.callbackContext.error("其他错误！");
                }
            }catch (Exception e){
                this.callbackContext.error(e.getMessage());
            }

        }
        super.onActivityResult(requestCode, resultCode, intent);
    }
}

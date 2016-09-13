package com.tky.localContact;

import android.content.ContentResolver;
import android.content.ContentUris;
import android.database.Cursor;
import android.net.Uri;
import android.os.Handler;
import android.provider.Contacts;
import android.provider.ContactsContract;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.tky.mqtt.dao.DaoSession;
import com.tky.mqtt.dao.LocalPhone;
import com.tky.mqtt.dao.LocalPhoneDao;
import com.tky.mqtt.paho.BaseApplication;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.services.LocalPhoneService;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.LOG;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * Created by Administrator on 2016/7/13.
 */
public class LocalContacts extends CordovaPlugin {

    PinyinComparator pinyinComparator = new PinyinComparator();
    private DaoSession mDaoSession;
    private LocalPhoneDao localPhoneDao;
    private static LocalPhoneService instance;

  @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

    }

    @Override
    public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        Handler handler=new Handler();
        handler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    Method method = LocalContacts.class.getDeclaredMethod(action, JSONArray.class, CallbackContext.class);
                    method.invoke(LocalContacts.this, args, callbackContext);
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


    public void getLocalContactsInfos(JSONArray args, CallbackContext callbackContext) {
      instance= LocalPhoneService.getInstance(UIUtils.getContext());
      mDaoSession= BaseApplication.getDaoSession(UIUtils.getContext());
      localPhoneDao=mDaoSession.getLocalPhoneDao();
      localPhoneDao.deleteAll();
        ContentResolver cr = cordova.getActivity().getContentResolver();
        String str[] = {ContactsContract.CommonDataKinds.Phone.CONTACT_ID, ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME, ContactsContract.CommonDataKinds.Phone.NUMBER};
        Cursor cur = cr.query(
                ContactsContract.CommonDataKinds.Phone.CONTENT_URI, str, null,
                null, null);
        List<Friend> allContacts=new ArrayList<Friend>();
        if (cur != null) {

            while (cur.moveToNext()) {
                Friend friend = new Friend();
                friend.setMobile(cur.getString(cur
                        .getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER)));// 得到手机号码
                friend.setNickname(cur.getString(cur
                        .getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)));
                // contactsInfo.setContactsPhotoId(cur.getLong(cur.getColumnIndex(Phone.PHOTO_ID)));
                long contactid = cur.getLong(cur
                        .getColumnIndex(ContactsContract.CommonDataKinds.Phone.CONTACT_ID));

                Uri uri = ContentUris.withAppendedId(
                        ContactsContract.Contacts.CONTENT_URI, contactid);
                InputStream input = ContactsContract.Contacts
                        .openContactPhotoInputStream(cr, uri);

                allContacts.add(friend);
            }
        }
        cur.close();
        initSortLetters(allContacts);
        //Collections.sort(allContacts, pinyinComparator);
        Gson gson = new Gson();
        String s = gson.toJson(allContacts, new TypeToken<List<Friend>>() {
        }.getType());
        try {
            setResult(new JSONArray(s), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
        }

    }
    //根据关键字查询本地联系人数据库
    public void getLocalContactsInfosByText(JSONArray args, CallbackContext callbackContext) {
        String username ="";
        try {
            username = args.getString(0);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        ContentResolver cr = cordova.getActivity().getContentResolver();
        String str[] = {ContactsContract.CommonDataKinds.Phone.CONTACT_ID, ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME, ContactsContract.CommonDataKinds.Phone.NUMBER};
        Cursor cur = cr.query(
                ContactsContract.CommonDataKinds.Phone.CONTENT_URI, str, ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME+" LIKE"+" '%"+username+"%'",
                null, null);
        List<Friend> allContacts=new ArrayList<Friend>();
        if (cur != null) {

            while (cur.moveToNext()) {
                Friend friend = new Friend();
                friend.setMobile(cur.getString(cur
                        .getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER)));// 得到手机号码
                friend.setNickname(cur.getString(cur
                        .getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)));
                // contactsInfo.setContactsPhotoId(cur.getLong(cur.getColumnIndex(Phone.PHOTO_ID)));
                long contactid = cur.getLong(cur
                        .getColumnIndex(ContactsContract.CommonDataKinds.Phone.CONTACT_ID));

                Uri uri = ContentUris.withAppendedId(
                        ContactsContract.Contacts.CONTENT_URI, contactid);
                InputStream input = ContactsContract.Contacts
                        .openContactPhotoInputStream(cr, uri);

                allContacts.add(friend);
            }
        }
        cur.close();
        initSortLetters(allContacts);
        //Collections.sort(allContacts, pinyinComparator);
        Gson gson = new Gson();
        String s = gson.toJson(allContacts, new TypeToken<List<Friend>>() {
        }.getType());
        try {
            setResult(new JSONArray(s), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
        }

    }
    //根据号码查询本地联系人数据库
    public void getLocalContactsInfosBynumber(JSONArray args, CallbackContext callbackContext) {
        String phonenumber ="";
        try {
            phonenumber = args.getString(0);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        ContentResolver cr = cordova.getActivity().getContentResolver();
        String str[] = {ContactsContract.CommonDataKinds.Phone.CONTACT_ID, ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME, ContactsContract.CommonDataKinds.Phone.NUMBER};
        Cursor cur = cr.query(
                ContactsContract.CommonDataKinds.Phone.CONTENT_URI, str, ContactsContract.CommonDataKinds.Phone.NUMBER+" LIKE"+" '%"+phonenumber+"%'",
                null, null);
        List<Friend> allContacts=new ArrayList<Friend>();
        if (cur != null) {

            while (cur.moveToNext()) {
                Friend friend = new Friend();
                friend.setMobile(cur.getString(cur
                        .getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER)));// 得到手机号码
                friend.setNickname(cur.getString(cur
                        .getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)));
                // contactsInfo.setContactsPhotoId(cur.getLong(cur.getColumnIndex(Phone.PHOTO_ID)));
                long contactid = cur.getLong(cur
                        .getColumnIndex(ContactsContract.CommonDataKinds.Phone.CONTACT_ID));

                Uri uri = ContentUris.withAppendedId(
                        ContactsContract.Contacts.CONTENT_URI, contactid);
                InputStream input = ContactsContract.Contacts
                        .openContactPhotoInputStream(cr, uri);

                allContacts.add(friend);
            }
        }
        cur.close();
        boolean you=false;
        if (allContacts.size()>0&&allContacts!=null){
            you=true;
        }else {
            you=false;
        }
       // initSortLetters(allContacts);
        //Collections.sort(allContacts, pinyinComparator);
//        Gson gson = new Gson();
//        String s = gson.toJson(allContacts, new TypeToken<List<Friend>>() {
//        }.getType());

        setResult(you, PluginResult.Status.OK, callbackContext);


    }

    private void setResult(JSONArray result, PluginResult.Status resultStatus, CallbackContext callbackContext) {


        PluginResult pluginResult = new PluginResult(resultStatus, result);

        pluginResult.setKeepCallback(true);

        callbackContext.sendPluginResult(pluginResult);

    }

    private void setResult(boolean result, PluginResult.Status resultStatus, CallbackContext callbackContext) {


        PluginResult pluginResult = new PluginResult(resultStatus, result);

        pluginResult.setKeepCallback(true);

        callbackContext.sendPluginResult(pluginResult);

    }

    private void initSortLetters(List<Friend> allContacts) {

        CharacterParser characterParser=CharacterParser.getInstance();
        for (Friend friend : allContacts) {
                String nickname = friend.getNickname();
                if (nickname != null && nickname.length() > 0) {
                    friend.setSortLetters(characterParser.getSelling(nickname).toUpperCase());
                  LocalPhone localPhone=new LocalPhone();
                  localPhone.setId(friend.getMobile()+"");
                  localPhone.setPlatformid("");
                  localPhone.setIsplatform(false);
                  localPhone.setName(friend.getNickname());
                  localPhone.setPhonenumber(friend.getMobile());
                  localPhone.setPinyinname(friend.getSortLetters());
                  localPhoneDao.insertOrReplace(localPhone);
            }
        }
    }

}

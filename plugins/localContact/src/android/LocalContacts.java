package com.tky.localContact;

import android.content.ContentResolver;
import android.content.ContentUris;
import android.database.Cursor;
import android.net.Uri;
import android.os.Handler;
import android.provider.ContactsContract;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

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

/**
 * Created by Administrator on 2016/7/13.
 */
public class LocalContacts extends CordovaPlugin {

    PinyinComparator pinyinComparator = new PinyinComparator();


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

    private void setResult(JSONArray result, PluginResult.Status resultStatus, CallbackContext callbackContext) {


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
            }
        }
    }

}

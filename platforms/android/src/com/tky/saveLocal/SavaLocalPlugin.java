package com.tky.saveLocal;

import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.ContentValues;
import android.database.Cursor;
import android.net.Uri;
import android.provider.ContactsContract;
import android.text.TextUtils;
import android.widget.Toast;

import com.tky.localContact.Friend;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * 添加联系人姓名手机号到本地通讯录 插件
 * Created by Administrator on 2016/7/20.
 */
public class SavaLocalPlugin extends CordovaPlugin{
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        if (action.equals("insert")){
            insert(args.get(0).toString(),args.get(1).toString());
            return true;
        }
        return false;
    }

    public void insert(String given_name, String mobile_number/*,
                        String work_email, String im_qq*/) {
        if (mobile_number.length()>0&&mobile_number!=null){
            List<Friend> localContactsInfos = getLocalContactsInfos();
            int j=0;
            for (int i = 0; i < localContactsInfos.size(); i++) {
                if (!mobile_number.equals(localContactsInfos.get(i).getMobile())&&mobile_number.length()>0){
                    j++;
                }
            }
            if (j==localContactsInfos.size()){
                try {
                    ContentValues values = new ContentValues();
                    Uri contentUri = cordova.getActivity().getContentResolver().insert(ContactsContract.RawContacts.CONTENT_URI,
                            values);
                    long rawContactId = ContentUris.parseId(contentUri);
                    // 插入姓名
                    if (!TextUtils.isEmpty(given_name)) {
                        values.clear();
                        values.put(ContactsContract.Data.RAW_CONTACT_ID, rawContactId);
                        values.put(ContactsContract.Data.MIMETYPE, ContactsContract.CommonDataKinds.StructuredName.CONTENT_ITEM_TYPE);
                        values.put(ContactsContract.CommonDataKinds.StructuredName.GIVEN_NAME, given_name);
                        cordova.getActivity().getContentResolver().insert(ContactsContract.Data.CONTENT_URI,
                                values);
                    }

                    // 向data表插入电话数据
                    if (!TextUtils.isEmpty(mobile_number)) {
                        values.clear();
                        values.put(ContactsContract.Data.RAW_CONTACT_ID, rawContactId);
                        values.put(ContactsContract.Data.MIMETYPE, ContactsContract.CommonDataKinds.Phone.CONTENT_ITEM_TYPE);
                        values.put(ContactsContract.CommonDataKinds.Phone.NUMBER, mobile_number);
                        values.put(ContactsContract.CommonDataKinds.Phone.TYPE, ContactsContract.CommonDataKinds.Phone.TYPE_MOBILE);
                        cordova.getActivity().getContentResolver().insert(ContactsContract.Data.CONTENT_URI,
                                values);
                    } else {

                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                Toast.makeText(cordova.getActivity(),"保存至本地成功",Toast.LENGTH_SHORT).show();
            }else {
                Toast.makeText(cordova.getActivity(),"手机中已经存在",Toast.LENGTH_SHORT).show();
            }

            // 向data表插入Email数据
        /*if (work_email != "") {
            values.clear();
			values.put(Data.RAW_CONTACT_ID, rawContactId);
			values.put(Data.MIMETYPE, Email.CONTENT_ITEM_TYPE);
			values.put(Email.DATA, work_email);
			values.put(Email.TYPE, Email.TYPE_WORK);
			getContentResolver().insert(ContactsContract.Data.CONTENT_URI,
					values);
		}*/

            // 向data表插入QQ数据
		/*if (im_qq != "") {
			values.clear();
			values.put(Data.RAW_CONTACT_ID, rawContactId);
			values.put(Data.MIMETYPE, Im.CONTENT_ITEM_TYPE);
			values.put(Im.DATA, im_qq);
			values.put(Im.PROTOCOL, Im.PROTOCOL_QQ);
			getContentResolver().insert(ContactsContract.Data.CONTENT_URI,
					values);
		}*/
        /*Bitmap sourceBitmap = BitmapFactory.decodeResource(UIUtils.getContext().getResources(),
                R.drawable.ic_launcher);
        final ByteArrayOutputStream os = new ByteArrayOutputStream();
        // 将Bitmap压缩成PNG编码，质量为100%存储
        sourceBitmap.compress(Bitmap.CompressFormat.PNG, 100, os);
        byte[] avatar = os.toByteArray();
        values.put(ContactsContract.Data.RAW_CONTACT_ID, rawContactId);
        values.put(ContactsContract.Data.MIMETYPE, ContactsContract.CommonDataKinds.Photo.CONTENT_ITEM_TYPE);
        values.put(ContactsContract.CommonDataKinds.Photo.PHOTO, avatar);
        UIUtils.getContext().getContentResolver().insert(ContactsContract.Data.CONTENT_URI,
                values);*/
        }else {
            Toast.makeText(cordova.getActivity(),"该号码为空",Toast.LENGTH_SHORT).show();
        }


    }
    public List<Friend> getLocalContactsInfos() {
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
        return allContacts;
    }
}

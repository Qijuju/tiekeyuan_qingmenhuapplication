package com.tky.saveLocal;

import android.content.ContentUris;
import android.content.ContentValues;
import android.net.Uri;
import android.provider.ContactsContract;
import android.text.TextUtils;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created by Administrator on 2016/7/20.
 */
public class SavaLocalPlugin extends CordovaPlugin{
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        if (action.equals("call")){
            insert(args.get(0).toString(),args.get(1).toString());
            return true;
        }
        return false;
    }

    public void insert(String given_name, String mobile_number/*,
                        String work_email, String im_qq*/) {
        try {
            ContentValues values = new ContentValues();
            Uri contentUri = UIUtils.getContext().getContentResolver().insert(ContactsContract.RawContacts.CONTENT_URI,
                    values);
            long rawContactId = ContentUris.parseId(contentUri);
            // 插入姓名
            if (!TextUtils.isEmpty(given_name)) {
                values.clear();
                values.put(ContactsContract.Data.RAW_CONTACT_ID, rawContactId);
                values.put(ContactsContract.Data.MIMETYPE, ContactsContract.CommonDataKinds.StructuredName.CONTENT_ITEM_TYPE);
                values.put(ContactsContract.CommonDataKinds.StructuredName.GIVEN_NAME, given_name);
                UIUtils.getContext().getContentResolver().insert(ContactsContract.Data.CONTENT_URI,
                        values);
            }

            // 向data表插入电话数据
            if (!TextUtils.isEmpty(mobile_number)) {
                values.clear();
                values.put(ContactsContract.Data.RAW_CONTACT_ID, rawContactId);
                values.put(ContactsContract.Data.MIMETYPE, ContactsContract.CommonDataKinds.Phone.CONTENT_ITEM_TYPE);
                values.put(ContactsContract.CommonDataKinds.Phone.NUMBER, mobile_number);
                values.put(ContactsContract.CommonDataKinds.Phone.TYPE, ContactsContract.CommonDataKinds.Phone.TYPE_MOBILE);
                UIUtils.getContext().getContentResolver().insert(ContactsContract.Data.CONTENT_URI,
                        values);
            } else {

            }
        } catch (Exception e) {
            e.printStackTrace();

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

    }
}

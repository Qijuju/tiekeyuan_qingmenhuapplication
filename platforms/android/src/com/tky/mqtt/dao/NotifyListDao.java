package com.tky.mqtt.dao;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteStatement;

import de.greenrobot.dao.AbstractDao;
import de.greenrobot.dao.Property;
import de.greenrobot.dao.internal.DaoConfig;

import com.tky.mqtt.dao.NotifyList;

// THIS CODE IS GENERATED BY greenDAO, DO NOT EDIT.
/** 
 * DAO for table NOTIFY_LIST.
*/
public class NotifyListDao extends AbstractDao<NotifyList, String> {

    public static final String TABLENAME = "NOTIFY_LIST";

    /**
     * Properties of entity NotifyList.<br/>
     * Can be used for QueryBuilder and for referencing column names.
    */
    public static class Properties {
        public final static Property Id = new Property(0, String.class, "id", true, "ID");
        public final static Property ChatName = new Property(1, String.class, "chatName", false, "CHAT_NAME");
        public final static Property IsDelete = new Property(2, String.class, "isDelete", false, "IS_DELETE");
        public final static Property ImgSrc = new Property(3, String.class, "imgSrc", false, "IMG_SRC");
        public final static Property LastText = new Property(4, String.class, "lastText", false, "LAST_TEXT");
        public final static Property Count = new Property(5, String.class, "count", false, "COUNT");
        public final static Property LastDate = new Property(6, Long.class, "lastDate", false, "LAST_DATE");
        public final static Property ChatType = new Property(7, String.class, "chatType", false, "CHAT_TYPE");
        public final static Property SenderId = new Property(8, String.class, "senderId", false, "SENDER_ID");
        public final static Property SenderName = new Property(9, String.class, "senderName", false, "SENDER_NAME");
    };


    public NotifyListDao(DaoConfig config) {
        super(config);
    }
    
    public NotifyListDao(DaoConfig config, DaoSession daoSession) {
        super(config, daoSession);
    }

    /** Creates the underlying database table. */
    public static void createTable(SQLiteDatabase db, boolean ifNotExists) {
        String constraint = ifNotExists? "IF NOT EXISTS ": "";
        db.execSQL("CREATE TABLE " + constraint + "'NOTIFY_LIST' (" + //
                "'ID' TEXT PRIMARY KEY NOT NULL ," + // 0: id
                "'CHAT_NAME' TEXT," + // 1: chatName
                "'IS_DELETE' TEXT," + // 2: isDelete
                "'IMG_SRC' TEXT," + // 3: imgSrc
                "'LAST_TEXT' TEXT," + // 4: lastText
                "'COUNT' TEXT," + // 5: count
                "'LAST_DATE' INTEGER," + // 6: lastDate
                "'CHAT_TYPE' TEXT," + // 7: chatType
                "'SENDER_ID' TEXT," + // 8: senderId
                "'SENDER_NAME' TEXT);"); // 9: senderName
    }

    /** Drops the underlying database table. */
    public static void dropTable(SQLiteDatabase db, boolean ifExists) {
        String sql = "DROP TABLE " + (ifExists ? "IF EXISTS " : "") + "'NOTIFY_LIST'";
        db.execSQL(sql);
    }

    /** @inheritdoc */
    @Override
    protected void bindValues(SQLiteStatement stmt, NotifyList entity) {
        stmt.clearBindings();
 
        String id = entity.getId();
        if (id != null) {
            stmt.bindString(1, id);
        }
 
        String chatName = entity.getChatName();
        if (chatName != null) {
            stmt.bindString(2, chatName);
        }
 
        String isDelete = entity.getIsDelete();
        if (isDelete != null) {
            stmt.bindString(3, isDelete);
        }
 
        String imgSrc = entity.getImgSrc();
        if (imgSrc != null) {
            stmt.bindString(4, imgSrc);
        }
 
        String lastText = entity.getLastText();
        if (lastText != null) {
            stmt.bindString(5, lastText);
        }
 
        String count = entity.getCount();
        if (count != null) {
            stmt.bindString(6, count);
        }
 
        Long lastDate = entity.getLastDate();
        if (lastDate != null) {
            stmt.bindLong(7, lastDate);
        }
 
        String chatType = entity.getChatType();
        if (chatType != null) {
            stmt.bindString(8, chatType);
        }
 
        String senderId = entity.getSenderId();
        if (senderId != null) {
            stmt.bindString(9, senderId);
        }
 
        String senderName = entity.getSenderName();
        if (senderName != null) {
            stmt.bindString(10, senderName);
        }
    }

    /** @inheritdoc */
    @Override
    public String readKey(Cursor cursor, int offset) {
        return cursor.isNull(offset + 0) ? null : cursor.getString(offset + 0);
    }    

    /** @inheritdoc */
    @Override
    public NotifyList readEntity(Cursor cursor, int offset) {
        NotifyList entity = new NotifyList( //
            cursor.isNull(offset + 0) ? null : cursor.getString(offset + 0), // id
            cursor.isNull(offset + 1) ? null : cursor.getString(offset + 1), // chatName
            cursor.isNull(offset + 2) ? null : cursor.getString(offset + 2), // isDelete
            cursor.isNull(offset + 3) ? null : cursor.getString(offset + 3), // imgSrc
            cursor.isNull(offset + 4) ? null : cursor.getString(offset + 4), // lastText
            cursor.isNull(offset + 5) ? null : cursor.getString(offset + 5), // count
            cursor.isNull(offset + 6) ? null : cursor.getLong(offset + 6), // lastDate
            cursor.isNull(offset + 7) ? null : cursor.getString(offset + 7), // chatType
            cursor.isNull(offset + 8) ? null : cursor.getString(offset + 8), // senderId
            cursor.isNull(offset + 9) ? null : cursor.getString(offset + 9) // senderName
        );
        return entity;
    }
     
    /** @inheritdoc */
    @Override
    public void readEntity(Cursor cursor, NotifyList entity, int offset) {
        entity.setId(cursor.isNull(offset + 0) ? null : cursor.getString(offset + 0));
        entity.setChatName(cursor.isNull(offset + 1) ? null : cursor.getString(offset + 1));
        entity.setIsDelete(cursor.isNull(offset + 2) ? null : cursor.getString(offset + 2));
        entity.setImgSrc(cursor.isNull(offset + 3) ? null : cursor.getString(offset + 3));
        entity.setLastText(cursor.isNull(offset + 4) ? null : cursor.getString(offset + 4));
        entity.setCount(cursor.isNull(offset + 5) ? null : cursor.getString(offset + 5));
        entity.setLastDate(cursor.isNull(offset + 6) ? null : cursor.getLong(offset + 6));
        entity.setChatType(cursor.isNull(offset + 7) ? null : cursor.getString(offset + 7));
        entity.setSenderId(cursor.isNull(offset + 8) ? null : cursor.getString(offset + 8));
        entity.setSenderName(cursor.isNull(offset + 9) ? null : cursor.getString(offset + 9));
     }
    
    /** @inheritdoc */
    @Override
    protected String updateKeyAfterInsert(NotifyList entity, long rowId) {
        return entity.getId();
    }
    
    /** @inheritdoc */
    @Override
    public String getKey(NotifyList entity) {
        if(entity != null) {
            return entity.getId();
        } else {
            return null;
        }
    }

    /** @inheritdoc */
    @Override    
    protected boolean isEntityUpdateable() {
        return true;
    }
    
}
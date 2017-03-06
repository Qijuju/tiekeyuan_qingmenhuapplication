package com.tky.mqtt.dao;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteStatement;

import de.greenrobot.dao.AbstractDao;
import de.greenrobot.dao.Property;
import de.greenrobot.dao.internal.DaoConfig;

// THIS CODE IS GENERATED BY greenDAO, DO NOT EDIT.
/** 
 * DAO for table CHAT_LIST.
*/
public class ChatListDao extends AbstractDao<ChatList, String> {

    public static final String TABLENAME = "CHAT_LIST";

    /**
     * Properties of entity ChatList.<br/>
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
        public final static Property IsSuccess = new Property(10, String.class, "isSuccess", false, "IS_SUCCESS");
        public final static Property Daytype = new Property(11, String.class, "daytype", false, "DAYTYPE");
        public final static Property IsFailure = new Property(12, String.class, "isFailure", false, "IS_FAILURE");
        public final static Property Messagetype = new Property(13, String.class, "messagetype", false, "MESSAGETYPE");
        public final static Property IsRead = new Property(14, String.class, "isRead", false, "IS_READ");
    };


    public ChatListDao(DaoConfig config) {
        super(config);
    }
    
    public ChatListDao(DaoConfig config, DaoSession daoSession) {
        super(config, daoSession);
    }

    /** Creates the underlying database table. */
    public static void createTable(SQLiteDatabase db, boolean ifNotExists) {
        String constraint = ifNotExists? "IF NOT EXISTS ": "";
        db.execSQL("CREATE TABLE " + constraint + "'CHAT_LIST' (" + //
                "'ID' TEXT PRIMARY KEY NOT NULL ," + // 0: id
                "'CHAT_NAME' TEXT," + // 1: chatName
                "'IS_DELETE' TEXT," + // 2: isDelete
                "'IMG_SRC' TEXT," + // 3: imgSrc
                "'LAST_TEXT' TEXT," + // 4: lastText
                "'COUNT' TEXT," + // 5: count
                "'LAST_DATE' INTEGER," + // 6: lastDate
                "'CHAT_TYPE' TEXT," + // 7: chatType
                "'SENDER_ID' TEXT," + // 8: senderId
                "'SENDER_NAME' TEXT," + // 9: senderName
                "'IS_SUCCESS' TEXT," + // 10: isSuccess
                "'DAYTYPE' TEXT," + // 11: daytype
                "'IS_FAILURE' TEXT," + // 12: isFailure
                "'MESSAGETYPE' TEXT," + // 13: messagetype
                "'IS_READ' TEXT);"); // 14: isRead
    }

    /** Drops the underlying database table. */
    public static void dropTable(SQLiteDatabase db, boolean ifExists) {
        String sql = "DROP TABLE " + (ifExists ? "IF EXISTS " : "") + "'CHAT_LIST'";
        db.execSQL(sql);
    }

    /** @inheritdoc */
    @Override
    protected void bindValues(SQLiteStatement stmt, ChatList entity) {
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
 
        String isSuccess = entity.getIsSuccess();
        if (isSuccess != null) {
            stmt.bindString(11, isSuccess);
        }
 
        String daytype = entity.getDaytype();
        if (daytype != null) {
            stmt.bindString(12, daytype);
        }
 
        String isFailure = entity.getIsFailure();
        if (isFailure != null) {
            stmt.bindString(13, isFailure);
        }
 
        String messagetype = entity.getMessagetype();
        if (messagetype != null) {
            stmt.bindString(14, messagetype);
        }
 
        String isRead = entity.getIsRead();
        if (isRead != null) {
            stmt.bindString(15, isRead);
        }
    }

    /** @inheritdoc */
    @Override
    public String readKey(Cursor cursor, int offset) {
        return cursor.isNull(offset + 0) ? null : cursor.getString(offset + 0);
    }    

    /** @inheritdoc */
    @Override
    public ChatList readEntity(Cursor cursor, int offset) {
        ChatList entity = new ChatList( //
            cursor.isNull(offset + 0) ? null : cursor.getString(offset + 0), // id
            cursor.isNull(offset + 1) ? null : cursor.getString(offset + 1), // chatName
            cursor.isNull(offset + 2) ? null : cursor.getString(offset + 2), // isDelete
            cursor.isNull(offset + 3) ? null : cursor.getString(offset + 3), // imgSrc
            cursor.isNull(offset + 4) ? null : cursor.getString(offset + 4), // lastText
            cursor.isNull(offset + 5) ? null : cursor.getString(offset + 5), // count
            cursor.isNull(offset + 6) ? null : cursor.getLong(offset + 6), // lastDate
            cursor.isNull(offset + 7) ? null : cursor.getString(offset + 7), // chatType
            cursor.isNull(offset + 8) ? null : cursor.getString(offset + 8), // senderId
            cursor.isNull(offset + 9) ? null : cursor.getString(offset + 9), // senderName
            cursor.isNull(offset + 10) ? null : cursor.getString(offset + 10), // isSuccess
            cursor.isNull(offset + 11) ? null : cursor.getString(offset + 11), // daytype
            cursor.isNull(offset + 12) ? null : cursor.getString(offset + 12), // isFailure
            cursor.isNull(offset + 13) ? null : cursor.getString(offset + 13), // messagetype
            cursor.isNull(offset + 14) ? null : cursor.getString(offset + 14) // isRead
        );
        return entity;
    }
     
    /** @inheritdoc */
    @Override
    public void readEntity(Cursor cursor, ChatList entity, int offset) {
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
        entity.setIsSuccess(cursor.isNull(offset + 10) ? null : cursor.getString(offset + 10));
        entity.setDaytype(cursor.isNull(offset + 11) ? null : cursor.getString(offset + 11));
        entity.setIsFailure(cursor.isNull(offset + 12) ? null : cursor.getString(offset + 12));
        entity.setMessagetype(cursor.isNull(offset + 13) ? null : cursor.getString(offset + 13));
        entity.setIsRead(cursor.isNull(offset + 14) ? null : cursor.getString(offset + 14));
     }
    
    /** @inheritdoc */
    @Override
    protected String updateKeyAfterInsert(ChatList entity, long rowId) {
        return entity.getId();
    }
    
    /** @inheritdoc */
    @Override
    public String getKey(ChatList entity) {
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

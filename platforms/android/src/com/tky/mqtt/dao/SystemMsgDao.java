package com.tky.mqtt.dao;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteStatement;

import de.greenrobot.dao.AbstractDao;
import de.greenrobot.dao.Property;
import de.greenrobot.dao.internal.DaoConfig;

import com.tky.mqtt.dao.SystemMsg;

// THIS CODE IS GENERATED BY greenDAO, DO NOT EDIT.
/** 
 * DAO for table SYSTEM_MSG.
*/
public class SystemMsgDao extends AbstractDao<SystemMsg, String> {

    public static final String TABLENAME = "SYSTEM_MSG";

    /**
     * Properties of entity SystemMsg.<br/>
     * Can be used for QueryBuilder and for referencing column names.
    */
    public static class Properties {
        public final static Property _id = new Property(0, String.class, "_id", true, "_ID");
        public final static Property Sessionid = new Property(1, String.class, "sessionid", false, "SESSIONID");
        public final static Property Type = new Property(2, String.class, "type", false, "TYPE");
        public final static Property From = new Property(3, String.class, "from", false, "FROM");
        public final static Property Message = new Property(4, String.class, "message", false, "MESSAGE");
        public final static Property Messagetype = new Property(5, String.class, "messagetype", false, "MESSAGETYPE");
        public final static Property Platform = new Property(6, String.class, "platform", false, "PLATFORM");
        public final static Property IsFailure = new Property(7, String.class, "isFailure", false, "IS_FAILURE");
        public final static Property When = new Property(8, Long.class, "when", false, "WHEN");
        public final static Property IsDelete = new Property(9, String.class, "isDelete", false, "IS_DELETE");
        public final static Property ImgSrc = new Property(10, String.class, "imgSrc", false, "IMG_SRC");
        public final static Property Username = new Property(11, String.class, "username", false, "USERNAME");
        public final static Property Senderid = new Property(12, String.class, "senderid", false, "SENDERID");
        public final static Property Msglevel = new Property(13, String.class, "msglevel", false, "MSGLEVEL");
        public final static Property Isread = new Property(14, String.class, "isread", false, "ISREAD");
        public final static Property Isfocus = new Property(15, String.class, "isfocus", false, "ISFOCUS");
        public final static Property Istop = new Property(16, Integer.class, "istop", false, "ISTOP");
        public final static Property Isconfirm = new Property(17, String.class, "isconfirm", false, "ISCONFIRM");
    };


    public SystemMsgDao(DaoConfig config) {
        super(config);
    }
    
    public SystemMsgDao(DaoConfig config, DaoSession daoSession) {
        super(config, daoSession);
    }

    /** Creates the underlying database table. */
    public static void createTable(SQLiteDatabase db, boolean ifNotExists) {
        String constraint = ifNotExists? "IF NOT EXISTS ": "";
        db.execSQL("CREATE TABLE " + constraint + "'SYSTEM_MSG' (" + //
                "'_ID' TEXT PRIMARY KEY NOT NULL ," + // 0: _id
                "'SESSIONID' TEXT," + // 1: sessionid
                "'TYPE' TEXT," + // 2: type
                "'FROM' TEXT," + // 3: from
                "'MESSAGE' TEXT," + // 4: message
                "'MESSAGETYPE' TEXT," + // 5: messagetype
                "'PLATFORM' TEXT," + // 6: platform
                "'IS_FAILURE' TEXT," + // 7: isFailure
                "'WHEN' INTEGER," + // 8: when
                "'IS_DELETE' TEXT," + // 9: isDelete
                "'IMG_SRC' TEXT," + // 10: imgSrc
                "'USERNAME' TEXT," + // 11: username
                "'SENDERID' TEXT," + // 12: senderid
                "'MSGLEVEL' TEXT," + // 13: msglevel
                "'ISREAD' TEXT," + // 14: isread
                "'ISFOCUS' TEXT," + // 15: isfocus
                "'ISTOP' INTEGER," + // 16: istop
                "'ISCONFIRM' TEXT);"); // 17: isconfirm
    }

    /** Drops the underlying database table. */
    public static void dropTable(SQLiteDatabase db, boolean ifExists) {
        String sql = "DROP TABLE " + (ifExists ? "IF EXISTS " : "") + "'SYSTEM_MSG'";
        db.execSQL(sql);
    }

    /** @inheritdoc */
    @Override
    protected void bindValues(SQLiteStatement stmt, SystemMsg entity) {
        stmt.clearBindings();
 
        String _id = entity.get_id();
        if (_id != null) {
            stmt.bindString(1, _id);
        }
 
        String sessionid = entity.getSessionid();
        if (sessionid != null) {
            stmt.bindString(2, sessionid);
        }
 
        String type = entity.getType();
        if (type != null) {
            stmt.bindString(3, type);
        }
 
        String from = entity.getFrom();
        if (from != null) {
            stmt.bindString(4, from);
        }
 
        String message = entity.getMessage();
        if (message != null) {
            stmt.bindString(5, message);
        }
 
        String messagetype = entity.getMessagetype();
        if (messagetype != null) {
            stmt.bindString(6, messagetype);
        }
 
        String platform = entity.getPlatform();
        if (platform != null) {
            stmt.bindString(7, platform);
        }
 
        String isFailure = entity.getIsFailure();
        if (isFailure != null) {
            stmt.bindString(8, isFailure);
        }
 
        Long when = entity.getWhen();
        if (when != null) {
            stmt.bindLong(9, when);
        }
 
        String isDelete = entity.getIsDelete();
        if (isDelete != null) {
            stmt.bindString(10, isDelete);
        }
 
        String imgSrc = entity.getImgSrc();
        if (imgSrc != null) {
            stmt.bindString(11, imgSrc);
        }
 
        String username = entity.getUsername();
        if (username != null) {
            stmt.bindString(12, username);
        }
 
        String senderid = entity.getSenderid();
        if (senderid != null) {
            stmt.bindString(13, senderid);
        }
 
        String msglevel = entity.getMsglevel();
        if (msglevel != null) {
            stmt.bindString(14, msglevel);
        }
 
        String isread = entity.getIsread();
        if (isread != null) {
            stmt.bindString(15, isread);
        }
 
        String isfocus = entity.getIsfocus();
        if (isfocus != null) {
            stmt.bindString(16, isfocus);
        }
 
        Integer istop = entity.getIstop();
        if (istop != null) {
            stmt.bindLong(17, istop);
        }
 
        String isconfirm = entity.getIsconfirm();
        if (isconfirm != null) {
            stmt.bindString(18, isconfirm);
        }
    }

    /** @inheritdoc */
    @Override
    public String readKey(Cursor cursor, int offset) {
        return cursor.isNull(offset + 0) ? null : cursor.getString(offset + 0);
    }    

    /** @inheritdoc */
    @Override
    public SystemMsg readEntity(Cursor cursor, int offset) {
        SystemMsg entity = new SystemMsg( //
            cursor.isNull(offset + 0) ? null : cursor.getString(offset + 0), // _id
            cursor.isNull(offset + 1) ? null : cursor.getString(offset + 1), // sessionid
            cursor.isNull(offset + 2) ? null : cursor.getString(offset + 2), // type
            cursor.isNull(offset + 3) ? null : cursor.getString(offset + 3), // from
            cursor.isNull(offset + 4) ? null : cursor.getString(offset + 4), // message
            cursor.isNull(offset + 5) ? null : cursor.getString(offset + 5), // messagetype
            cursor.isNull(offset + 6) ? null : cursor.getString(offset + 6), // platform
            cursor.isNull(offset + 7) ? null : cursor.getString(offset + 7), // isFailure
            cursor.isNull(offset + 8) ? null : cursor.getLong(offset + 8), // when
            cursor.isNull(offset + 9) ? null : cursor.getString(offset + 9), // isDelete
            cursor.isNull(offset + 10) ? null : cursor.getString(offset + 10), // imgSrc
            cursor.isNull(offset + 11) ? null : cursor.getString(offset + 11), // username
            cursor.isNull(offset + 12) ? null : cursor.getString(offset + 12), // senderid
            cursor.isNull(offset + 13) ? null : cursor.getString(offset + 13), // msglevel
            cursor.isNull(offset + 14) ? null : cursor.getString(offset + 14), // isread
            cursor.isNull(offset + 15) ? null : cursor.getString(offset + 15), // isfocus
            cursor.isNull(offset + 16) ? null : cursor.getInt(offset + 16), // istop
            cursor.isNull(offset + 17) ? null : cursor.getString(offset + 17) // isconfirm
        );
        return entity;
    }
     
    /** @inheritdoc */
    @Override
    public void readEntity(Cursor cursor, SystemMsg entity, int offset) {
        entity.set_id(cursor.isNull(offset + 0) ? null : cursor.getString(offset + 0));
        entity.setSessionid(cursor.isNull(offset + 1) ? null : cursor.getString(offset + 1));
        entity.setType(cursor.isNull(offset + 2) ? null : cursor.getString(offset + 2));
        entity.setFrom(cursor.isNull(offset + 3) ? null : cursor.getString(offset + 3));
        entity.setMessage(cursor.isNull(offset + 4) ? null : cursor.getString(offset + 4));
        entity.setMessagetype(cursor.isNull(offset + 5) ? null : cursor.getString(offset + 5));
        entity.setPlatform(cursor.isNull(offset + 6) ? null : cursor.getString(offset + 6));
        entity.setIsFailure(cursor.isNull(offset + 7) ? null : cursor.getString(offset + 7));
        entity.setWhen(cursor.isNull(offset + 8) ? null : cursor.getLong(offset + 8));
        entity.setIsDelete(cursor.isNull(offset + 9) ? null : cursor.getString(offset + 9));
        entity.setImgSrc(cursor.isNull(offset + 10) ? null : cursor.getString(offset + 10));
        entity.setUsername(cursor.isNull(offset + 11) ? null : cursor.getString(offset + 11));
        entity.setSenderid(cursor.isNull(offset + 12) ? null : cursor.getString(offset + 12));
        entity.setMsglevel(cursor.isNull(offset + 13) ? null : cursor.getString(offset + 13));
        entity.setIsread(cursor.isNull(offset + 14) ? null : cursor.getString(offset + 14));
        entity.setIsfocus(cursor.isNull(offset + 15) ? null : cursor.getString(offset + 15));
        entity.setIstop(cursor.isNull(offset + 16) ? null : cursor.getInt(offset + 16));
        entity.setIsconfirm(cursor.isNull(offset + 17) ? null : cursor.getString(offset + 17));
     }
    
    /** @inheritdoc */
    @Override
    protected String updateKeyAfterInsert(SystemMsg entity, long rowId) {
        return entity.get_id();
    }
    
    /** @inheritdoc */
    @Override
    public String getKey(SystemMsg entity) {
        if(entity != null) {
            return entity.get_id();
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

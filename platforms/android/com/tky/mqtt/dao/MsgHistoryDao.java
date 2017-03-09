package com.tky.mqtt.dao;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteStatement;

import de.greenrobot.dao.AbstractDao;
import de.greenrobot.dao.Property;
import de.greenrobot.dao.internal.DaoConfig;

import com.tky.mqtt.dao.MsgHistory;

// THIS CODE IS GENERATED BY greenDAO, DO NOT EDIT.
/** 
 * DAO for table MSG_HISTORY.
*/
public class MsgHistoryDao extends AbstractDao<MsgHistory, String> {

    public static final String TABLENAME = "MSG_HISTORY";

    /**
     * Properties of entity MsgHistory.<br/>
     * Can be used for QueryBuilder and for referencing column names.
    */
    public static class Properties {
        public final static Property _id = new Property(0, String.class, "_id", true, "_ID");
        public final static Property Msg = new Property(1, String.class, "msg", false, "MSG");
        public final static Property When = new Property(2, Long.class, "when", false, "WHEN");
        public final static Property Type = new Property(3, String.class, "type", false, "TYPE");
        public final static Property Personname = new Property(4, String.class, "personname", false, "PERSONNAME");
    };


    public MsgHistoryDao(DaoConfig config) {
        super(config);
    }
    
    public MsgHistoryDao(DaoConfig config, DaoSession daoSession) {
        super(config, daoSession);
    }

    /** Creates the underlying database table. */
    public static void createTable(SQLiteDatabase db, boolean ifNotExists) {
        String constraint = ifNotExists? "IF NOT EXISTS ": "";
        db.execSQL("CREATE TABLE " + constraint + "'MSG_HISTORY' (" + //
                "'_ID' TEXT PRIMARY KEY NOT NULL ," + // 0: _id
                "'MSG' TEXT," + // 1: msg
                "'WHEN' INTEGER," + // 2: when
                "'TYPE' TEXT," + // 3: type
                "'PERSONNAME' TEXT);"); // 4: personname
    }

    /** Drops the underlying database table. */
    public static void dropTable(SQLiteDatabase db, boolean ifExists) {
        String sql = "DROP TABLE " + (ifExists ? "IF EXISTS " : "") + "'MSG_HISTORY'";
        db.execSQL(sql);
    }

    /** @inheritdoc */
    @Override
    protected void bindValues(SQLiteStatement stmt, MsgHistory entity) {
        stmt.clearBindings();
 
        String _id = entity.get_id();
        if (_id != null) {
            stmt.bindString(1, _id);
        }
 
        String msg = entity.getMsg();
        if (msg != null) {
            stmt.bindString(2, msg);
        }
 
        Long when = entity.getWhen();
        if (when != null) {
            stmt.bindLong(3, when);
        }
 
        String type = entity.getType();
        if (type != null) {
            stmt.bindString(4, type);
        }
 
        String personname = entity.getPersonname();
        if (personname != null) {
            stmt.bindString(5, personname);
        }
    }

    /** @inheritdoc */
    @Override
    public String readKey(Cursor cursor, int offset) {
        return cursor.isNull(offset + 0) ? null : cursor.getString(offset + 0);
    }    

    /** @inheritdoc */
    @Override
    public MsgHistory readEntity(Cursor cursor, int offset) {
        MsgHistory entity = new MsgHistory( //
            cursor.isNull(offset + 0) ? null : cursor.getString(offset + 0), // _id
            cursor.isNull(offset + 1) ? null : cursor.getString(offset + 1), // msg
            cursor.isNull(offset + 2) ? null : cursor.getLong(offset + 2), // when
            cursor.isNull(offset + 3) ? null : cursor.getString(offset + 3), // type
            cursor.isNull(offset + 4) ? null : cursor.getString(offset + 4) // personname
        );
        return entity;
    }
     
    /** @inheritdoc */
    @Override
    public void readEntity(Cursor cursor, MsgHistory entity, int offset) {
        entity.set_id(cursor.isNull(offset + 0) ? null : cursor.getString(offset + 0));
        entity.setMsg(cursor.isNull(offset + 1) ? null : cursor.getString(offset + 1));
        entity.setWhen(cursor.isNull(offset + 2) ? null : cursor.getLong(offset + 2));
        entity.setType(cursor.isNull(offset + 3) ? null : cursor.getString(offset + 3));
        entity.setPersonname(cursor.isNull(offset + 4) ? null : cursor.getString(offset + 4));
     }
    
    /** @inheritdoc */
    @Override
    protected String updateKeyAfterInsert(MsgHistory entity, long rowId) {
        return entity.get_id();
    }
    
    /** @inheritdoc */
    @Override
    public String getKey(MsgHistory entity) {
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

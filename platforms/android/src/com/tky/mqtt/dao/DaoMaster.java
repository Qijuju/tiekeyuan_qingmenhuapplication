package com.tky.mqtt.dao;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteDatabase.CursorFactory;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

import de.greenrobot.dao.AbstractDaoMaster;
import de.greenrobot.dao.identityscope.IdentityScopeType;

// THIS CODE IS GENERATED BY greenDAO, DO NOT EDIT.
/**
 * Master of DAO (schema version 1): knows all DAOs.
*/
public class DaoMaster extends AbstractDaoMaster {
    public static final int SCHEMA_VERSION = 3;

    /** Creates underlying database table using DAOs. */
    public static void createAllTables(SQLiteDatabase db, boolean ifNotExists) {
        MessagesDao.createTable(db, ifNotExists);
        ParentDeptDao.createTable(db, ifNotExists);
        SubDeptDao.createTable(db, ifNotExists);
        TopContactsDao.createTable(db, ifNotExists);
        ChatListDao.createTable(db, ifNotExists);
        GroupChatsDao.createTable(db, ifNotExists);
        SelectedIdDao.createTable(db, ifNotExists);
        SystemMsgDao.createTable(db, ifNotExists);
        MsgHistoryDao.createTable(db, ifNotExists);
        LocalPhoneDao.createTable(db, ifNotExists);
        NotifyListDao.createTable(db, ifNotExists);
        FilePictureDao.createTable(db, ifNotExists);
        ModuleCountDao.createTable(db, ifNotExists);
        SlowNotifyListDao.createTable(db, ifNotExists);
        OtherpicheadDao.createTable(db, ifNotExists);
    }

    /** Drops underlying database table using DAOs. */
    public static void dropAllTables(SQLiteDatabase db, boolean ifExists) {
        MessagesDao.dropTable(db, ifExists);
        ParentDeptDao.dropTable(db, ifExists);
        SubDeptDao.dropTable(db, ifExists);
        TopContactsDao.dropTable(db, ifExists);
        ChatListDao.dropTable(db, ifExists);
        GroupChatsDao.dropTable(db, ifExists);
        SelectedIdDao.dropTable(db, ifExists);
        SystemMsgDao.dropTable(db, ifExists);
        MsgHistoryDao.dropTable(db, ifExists);
        LocalPhoneDao.dropTable(db, ifExists);
        NotifyListDao.dropTable(db, ifExists);
        FilePictureDao.dropTable(db, ifExists);
        ModuleCountDao.dropTable(db, ifExists);
        SlowNotifyListDao.dropTable(db, ifExists);
        OtherpicheadDao.dropTable(db, ifExists);
    }

    public static abstract class OpenHelper extends SQLiteOpenHelper {

        public OpenHelper(Context context, String name, CursorFactory factory) {
            super(context, name, factory, SCHEMA_VERSION);
        }

        @Override
        public void onCreate(SQLiteDatabase db) {
            Log.i("greenDAO", "Creating tables for schema version " + SCHEMA_VERSION);
            createAllTables(db, false);
        }
    }

    /** WARNING: Drops all table on Upgrade! Use only during development. */
    public static class DevOpenHelper extends OpenHelper {
        public DevOpenHelper(Context context, String name, CursorFactory factory) {
            super(context, name, factory);
        }

        @Override
        public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
            Log.i("greenDAO", "Upgrading schema from version " + oldVersion + " to " + newVersion + " by dropping all tables");
            dropAllTables(db, true);
            onCreate(db);
        }
    }

    public DaoMaster(SQLiteDatabase db) {
        super(db, SCHEMA_VERSION);
        registerDaoClass(MessagesDao.class);
        registerDaoClass(ParentDeptDao.class);
        registerDaoClass(SubDeptDao.class);
        registerDaoClass(TopContactsDao.class);
        registerDaoClass(ChatListDao.class);
        registerDaoClass(GroupChatsDao.class);
        registerDaoClass(SelectedIdDao.class);
        registerDaoClass(SystemMsgDao.class);
        registerDaoClass(MsgHistoryDao.class);
        registerDaoClass(LocalPhoneDao.class);
        registerDaoClass(NotifyListDao.class);
        registerDaoClass(FilePictureDao.class);
        registerDaoClass(ModuleCountDao.class);
        registerDaoClass(SlowNotifyListDao.class);
        registerDaoClass(OtherpicheadDao.class);
    }

    public DaoSession newSession() {
        return new DaoSession(db, IdentityScopeType.Session, daoConfigMap);
    }

    public DaoSession newSession(IdentityScopeType type) {
        return new DaoSession(db, type, daoConfigMap);
    }

}

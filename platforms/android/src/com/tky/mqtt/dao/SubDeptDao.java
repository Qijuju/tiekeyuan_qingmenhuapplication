package com.tky.mqtt.dao;

import java.util.List;
import java.util.ArrayList;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteStatement;

import de.greenrobot.dao.AbstractDao;
import de.greenrobot.dao.Property;
import de.greenrobot.dao.internal.SqlUtils;
import de.greenrobot.dao.internal.DaoConfig;
import de.greenrobot.dao.query.Query;
import de.greenrobot.dao.query.QueryBuilder;

import com.tky.mqtt.dao.SubDept;

// THIS CODE IS GENERATED BY greenDAO, DO NOT EDIT.
/** 
 * DAO for table SUB_DEPT.
*/
public class SubDeptDao extends AbstractDao<SubDept, String> {

    public static final String TABLENAME = "SUB_DEPT";

    /**
     * Properties of entity SubDept.<br/>
     * Can be used for QueryBuilder and for referencing column names.
    */
    public static class Properties {
        public final static Property _id = new Property(0, String.class, "_id", true, "_ID");
        public final static Property Name = new Property(1, String.class, "name", false, "NAME");
        public final static Property Type = new Property(2, String.class, "type", false, "TYPE");
        public final static Property Isactive = new Property(3, String.class, "isactive", false, "ISACTIVE");
        public final static Property Parentname = new Property(4, String.class, "parentname", false, "PARENTNAME");
        public final static Property Pagesize = new Property(5, Integer.class, "pagesize", false, "PAGESIZE");
        public final static Property Childcount = new Property(6, Integer.class, "childcount", false, "CHILDCOUNT");
        public final static Property F_id = new Property(7, String.class, "f_id", false, "F_ID");
    };

    private DaoSession daoSession;

    private Query<SubDept> parentDept_SubDeptListQuery;

    public SubDeptDao(DaoConfig config) {
        super(config);
    }
    
    public SubDeptDao(DaoConfig config, DaoSession daoSession) {
        super(config, daoSession);
        this.daoSession = daoSession;
    }

    /** Creates the underlying database table. */
    public static void createTable(SQLiteDatabase db, boolean ifNotExists) {
        String constraint = ifNotExists? "IF NOT EXISTS ": "";
        db.execSQL("CREATE TABLE " + constraint + "'SUB_DEPT' (" + //
                "'_ID' TEXT PRIMARY KEY NOT NULL ," + // 0: _id
                "'NAME' TEXT," + // 1: name
                "'TYPE' TEXT," + // 2: type
                "'ISACTIVE' TEXT," + // 3: isactive
                "'PARENTNAME' TEXT," + // 4: parentname
                "'PAGESIZE' INTEGER," + // 5: pagesize
                "'CHILDCOUNT' INTEGER," + // 6: childcount
                "'F_ID' TEXT NOT NULL );"); // 7: f_id
    }

    /** Drops the underlying database table. */
    public static void dropTable(SQLiteDatabase db, boolean ifExists) {
        String sql = "DROP TABLE " + (ifExists ? "IF EXISTS " : "") + "'SUB_DEPT'";
        db.execSQL(sql);
    }

    /** @inheritdoc */
    @Override
    protected void bindValues(SQLiteStatement stmt, SubDept entity) {
        stmt.clearBindings();
 
        String _id = entity.get_id();
        if (_id != null) {
            stmt.bindString(1, _id);
        }
 
        String name = entity.getName();
        if (name != null) {
            stmt.bindString(2, name);
        }
 
        String type = entity.getType();
        if (type != null) {
            stmt.bindString(3, type);
        }
 
        String isactive = entity.getIsactive();
        if (isactive != null) {
            stmt.bindString(4, isactive);
        }
 
        String parentname = entity.getParentname();
        if (parentname != null) {
            stmt.bindString(5, parentname);
        }
 
        Integer pagesize = entity.getPagesize();
        if (pagesize != null) {
            stmt.bindLong(6, pagesize);
        }
 
        Integer childcount = entity.getChildcount();
        if (childcount != null) {
            stmt.bindLong(7, childcount);
        }
        stmt.bindString(8, entity.getF_id());
    }

    @Override
    protected void attachEntity(SubDept entity) {
        super.attachEntity(entity);
        entity.__setDaoSession(daoSession);
    }

    /** @inheritdoc */
    @Override
    public String readKey(Cursor cursor, int offset) {
        return cursor.isNull(offset + 0) ? null : cursor.getString(offset + 0);
    }    

    /** @inheritdoc */
    @Override
    public SubDept readEntity(Cursor cursor, int offset) {
        SubDept entity = new SubDept( //
            cursor.isNull(offset + 0) ? null : cursor.getString(offset + 0), // _id
            cursor.isNull(offset + 1) ? null : cursor.getString(offset + 1), // name
            cursor.isNull(offset + 2) ? null : cursor.getString(offset + 2), // type
            cursor.isNull(offset + 3) ? null : cursor.getString(offset + 3), // isactive
            cursor.isNull(offset + 4) ? null : cursor.getString(offset + 4), // parentname
            cursor.isNull(offset + 5) ? null : cursor.getInt(offset + 5), // pagesize
            cursor.isNull(offset + 6) ? null : cursor.getInt(offset + 6), // childcount
            cursor.getString(offset + 7) // f_id
        );
        return entity;
    }
     
    /** @inheritdoc */
    @Override
    public void readEntity(Cursor cursor, SubDept entity, int offset) {
        entity.set_id(cursor.isNull(offset + 0) ? null : cursor.getString(offset + 0));
        entity.setName(cursor.isNull(offset + 1) ? null : cursor.getString(offset + 1));
        entity.setType(cursor.isNull(offset + 2) ? null : cursor.getString(offset + 2));
        entity.setIsactive(cursor.isNull(offset + 3) ? null : cursor.getString(offset + 3));
        entity.setParentname(cursor.isNull(offset + 4) ? null : cursor.getString(offset + 4));
        entity.setPagesize(cursor.isNull(offset + 5) ? null : cursor.getInt(offset + 5));
        entity.setChildcount(cursor.isNull(offset + 6) ? null : cursor.getInt(offset + 6));
        entity.setF_id(cursor.getString(offset + 7));
     }
    
    /** @inheritdoc */
    @Override
    protected String updateKeyAfterInsert(SubDept entity, long rowId) {
        return entity.get_id();
    }
    
    /** @inheritdoc */
    @Override
    public String getKey(SubDept entity) {
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
    
    /** Internal query to resolve the "subDeptList" to-many relationship of ParentDept. */
    public List<SubDept> _queryParentDept_SubDeptList(String f_id) {
        synchronized (this) {
            if (parentDept_SubDeptListQuery == null) {
                QueryBuilder<SubDept> queryBuilder = queryBuilder();
                queryBuilder.where(Properties.F_id.eq(null));
                parentDept_SubDeptListQuery = queryBuilder.build();
            }
        }
        Query<SubDept> query = parentDept_SubDeptListQuery.forCurrentThread();
        query.setParameter(0, f_id);
        return query.list();
    }

    private String selectDeep;

    protected String getSelectDeep() {
        if (selectDeep == null) {
            StringBuilder builder = new StringBuilder("SELECT ");
            SqlUtils.appendColumns(builder, "T", getAllColumns());
            builder.append(',');
            SqlUtils.appendColumns(builder, "T0", daoSession.getParentDeptDao().getAllColumns());
            builder.append(" FROM SUB_DEPT T");
            builder.append(" LEFT JOIN PARENT_DEPT T0 ON T.'F_ID'=T0.'_ID'");
            builder.append(' ');
            selectDeep = builder.toString();
        }
        return selectDeep;
    }
    
    protected SubDept loadCurrentDeep(Cursor cursor, boolean lock) {
        SubDept entity = loadCurrent(cursor, 0, lock);
        int offset = getAllColumns().length;

        ParentDept parentDept = loadCurrentOther(daoSession.getParentDeptDao(), cursor, offset);
         if(parentDept != null) {
            entity.setParentDept(parentDept);
        }

        return entity;    
    }

    public SubDept loadDeep(Long key) {
        assertSinglePk();
        if (key == null) {
            return null;
        }

        StringBuilder builder = new StringBuilder(getSelectDeep());
        builder.append("WHERE ");
        SqlUtils.appendColumnsEqValue(builder, "T", getPkColumns());
        String sql = builder.toString();
        
        String[] keyArray = new String[] { key.toString() };
        Cursor cursor = db.rawQuery(sql, keyArray);
        
        try {
            boolean available = cursor.moveToFirst();
            if (!available) {
                return null;
            } else if (!cursor.isLast()) {
                throw new IllegalStateException("Expected unique result, but count was " + cursor.getCount());
            }
            return loadCurrentDeep(cursor, true);
        } finally {
            cursor.close();
        }
    }
    
    /** Reads all available rows from the given cursor and returns a list of new ImageTO objects. */
    public List<SubDept> loadAllDeepFromCursor(Cursor cursor) {
        int count = cursor.getCount();
        List<SubDept> list = new ArrayList<SubDept>(count);
        
        if (cursor.moveToFirst()) {
            if (identityScope != null) {
                identityScope.lock();
                identityScope.reserveRoom(count);
            }
            try {
                do {
                    list.add(loadCurrentDeep(cursor, false));
                } while (cursor.moveToNext());
            } finally {
                if (identityScope != null) {
                    identityScope.unlock();
                }
            }
        }
        return list;
    }
    
    protected List<SubDept> loadDeepAllAndCloseCursor(Cursor cursor) {
        try {
            return loadAllDeepFromCursor(cursor);
        } finally {
            cursor.close();
        }
    }
    

    /** A raw-style query where you can pass any WHERE clause and arguments. */
    public List<SubDept> queryDeep(String where, String... selectionArg) {
        Cursor cursor = db.rawQuery(getSelectDeep() + where, selectionArg);
        return loadDeepAllAndCloseCursor(cursor);
    }
 
}

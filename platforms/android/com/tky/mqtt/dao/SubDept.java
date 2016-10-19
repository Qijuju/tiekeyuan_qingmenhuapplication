package com.tky.mqtt.dao;

import com.tky.mqtt.dao.DaoSession;
import de.greenrobot.dao.DaoException;

// THIS CODE IS GENERATED BY greenDAO, DO NOT EDIT. Enable "keep" sections if you want to edit. 
/**
 * Entity mapped to table SUB_DEPT.
 */
public class SubDept implements java.io.Serializable {

    private String _id;
    private String name;
    private String type;
    private String isactive;
    private String parentname;
    private Integer pagesize;
    private Integer childcount;
    /** Not-null value. */
    private String f_id;

    /** Used to resolve relations */
    private transient DaoSession daoSession;

    /** Used for active entity operations. */
    private transient SubDeptDao myDao;

    private ParentDept parentDept;
    private String parentDept__resolvedKey;


    public SubDept() {
    }

    public SubDept(String _id) {
        this._id = _id;
    }

    public SubDept(String _id, String name, String type, String isactive, String parentname, Integer pagesize, Integer childcount, String f_id) {
        this._id = _id;
        this.name = name;
        this.type = type;
        this.isactive = isactive;
        this.parentname = parentname;
        this.pagesize = pagesize;
        this.childcount = childcount;
        this.f_id = f_id;
    }

    /** called by internal mechanisms, do not call yourself. */
    public void __setDaoSession(DaoSession daoSession) {
        this.daoSession = daoSession;
        myDao = daoSession != null ? daoSession.getSubDeptDao() : null;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getIsactive() {
        return isactive;
    }

    public void setIsactive(String isactive) {
        this.isactive = isactive;
    }

    public String getParentname() {
        return parentname;
    }

    public void setParentname(String parentname) {
        this.parentname = parentname;
    }

    public Integer getPagesize() {
        return pagesize;
    }

    public void setPagesize(Integer pagesize) {
        this.pagesize = pagesize;
    }

    public Integer getChildcount() {
        return childcount;
    }

    public void setChildcount(Integer childcount) {
        this.childcount = childcount;
    }

    /** Not-null value. */
    public String getF_id() {
        return f_id;
    }

    /** Not-null value; ensure this value is available before it is saved to the database. */
    public void setF_id(String f_id) {
        this.f_id = f_id;
    }

    /** To-one relationship, resolved on first access. */
    public ParentDept getParentDept() {
        String __key = this.f_id;
        if (parentDept__resolvedKey == null || parentDept__resolvedKey != __key) {
            if (daoSession == null) {
                throw new DaoException("Entity is detached from DAO context");
            }
            ParentDeptDao targetDao = daoSession.getParentDeptDao();
            ParentDept parentDeptNew = targetDao.load(__key);
            synchronized (this) {
                parentDept = parentDeptNew;
            	parentDept__resolvedKey = __key;
            }
        }
        return parentDept;
    }

    public void setParentDept(ParentDept parentDept) {
        if (parentDept == null) {
            throw new DaoException("To-one property 'f_id' has not-null constraint; cannot set to-one to null");
        }
        synchronized (this) {
            this.parentDept = parentDept;
            f_id = parentDept.get_id();
            parentDept__resolvedKey = f_id;
        }
    }

    /** Convenient call for {@link AbstractDao#delete(Object)}. Entity must attached to an entity context. */
    public void delete() {
        if (myDao == null) {
            throw new DaoException("Entity is detached from DAO context");
        }    
        myDao.delete(this);
    }

    /** Convenient call for {@link AbstractDao#update(Object)}. Entity must attached to an entity context. */
    public void update() {
        if (myDao == null) {
            throw new DaoException("Entity is detached from DAO context");
        }    
        myDao.update(this);
    }

    /** Convenient call for {@link AbstractDao#refresh(Object)}. Entity must attached to an entity context. */
    public void refresh() {
        if (myDao == null) {
            throw new DaoException("Entity is detached from DAO context");
        }    
        myDao.refresh(this);
    }

}
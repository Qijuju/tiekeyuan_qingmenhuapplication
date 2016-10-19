package com.tky.mqtt.dao;

import java.util.List;
import com.tky.mqtt.dao.DaoSession;
import de.greenrobot.dao.DaoException;

// THIS CODE IS GENERATED BY greenDAO, DO NOT EDIT. Enable "keep" sections if you want to edit. 
/**
 * Entity mapped to table PARENT_DEPT.
 */
public class ParentDept implements java.io.Serializable {

    private String _id;
    private String name;
    private Integer childcount;

    /** Used to resolve relations */
    private transient DaoSession daoSession;

    /** Used for active entity operations. */
    private transient ParentDeptDao myDao;

    private List<SubDept> subDeptList;

    public ParentDept() {
    }

    public ParentDept(String _id) {
        this._id = _id;
    }

    public ParentDept(String _id, String name, Integer childcount) {
        this._id = _id;
        this.name = name;
        this.childcount = childcount;
    }

    /** called by internal mechanisms, do not call yourself. */
    public void __setDaoSession(DaoSession daoSession) {
        this.daoSession = daoSession;
        myDao = daoSession != null ? daoSession.getParentDeptDao() : null;
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

    public Integer getChildcount() {
        return childcount;
    }

    public void setChildcount(Integer childcount) {
        this.childcount = childcount;
    }

    /** To-many relationship, resolved on first access (and after reset). Changes to to-many relations are not persisted, make changes to the target entity. */
    public List<SubDept> getSubDeptList() {
        if (subDeptList == null) {
            if (daoSession == null) {
                throw new DaoException("Entity is detached from DAO context");
            }
            SubDeptDao targetDao = daoSession.getSubDeptDao();
            List<SubDept> subDeptListNew = targetDao._queryParentDept_SubDeptList(_id);
            synchronized (this) {
                if(subDeptList == null) {
                    subDeptList = subDeptListNew;
                }
            }
        }
        return subDeptList;
    }

    /** Resets a to-many relationship, making the next get call to query for a fresh result. */
    public synchronized void resetSubDeptList() {
        subDeptList = null;
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
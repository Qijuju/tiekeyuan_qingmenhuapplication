package com.tky.mqtt.dao;

// THIS CODE IS GENERATED BY greenDAO, DO NOT EDIT. Enable "keep" sections if you want to edit.

import com.tky.mqtt.base.BaseDao;

/**
 * Entity mapped to table FILE_PICTURE.
 */
public class FilePicture extends BaseDao {

    private String filepicid;
    private String _id;
    private String from;
    private String sessionid;
    private String fromname;
    private String toname;
    private String smallurl;
    private String bigurl;
    private String bytesize;
    private String megabyte;
    private String filename;
    private String type;
    private Long when;

    public FilePicture() {
    }

    public FilePicture(String filepicid) {
        this.filepicid = filepicid;
    }

    public FilePicture(String filepicid, String _id, String from, String sessionid, String fromname, String toname, String smallurl, String bigurl, String bytesize, String megabyte, String filename, String type, Long when) {
        this.filepicid = filepicid;
        this._id = _id;
        this.from = from;
        this.sessionid = sessionid;
        this.fromname = fromname;
        this.toname = toname;
        this.smallurl = smallurl;
        this.bigurl = bigurl;
        this.bytesize = bytesize;
        this.megabyte = megabyte;
        this.filename = filename;
        this.type = type;
        this.when = when;
    }

    public String getFilepicid() {
        return filepicid;
    }

    public void setFilepicid(String filepicid) {
        this.filepicid = filepicid;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getSessionid() {
        return sessionid;
    }

    public void setSessionid(String sessionid) {
        this.sessionid = sessionid;
    }

    public String getFromname() {
        return fromname;
    }

    public void setFromname(String fromname) {
        this.fromname = fromname;
    }

    public String getToname() {
        return toname;
    }

    public void setToname(String toname) {
        this.toname = toname;
    }

    public String getSmallurl() {
        return smallurl;
    }

    public void setSmallurl(String smallurl) {
        this.smallurl = smallurl;
    }

    public String getBigurl() {
        return bigurl;
    }

    public void setBigurl(String bigurl) {
        this.bigurl = bigurl;
    }

    public String getBytesize() {
        return bytesize;
    }

    public void setBytesize(String bytesize) {
        this.bytesize = bytesize;
    }

    public String getMegabyte() {
        return megabyte;
    }

    public void setMegabyte(String megabyte) {
        this.megabyte = megabyte;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getWhen() {
        return when;
    }

    public void setWhen(Long when) {
        this.when = when;
    }

}

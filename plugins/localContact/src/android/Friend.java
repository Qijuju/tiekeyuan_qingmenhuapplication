package com.tky.localContact;

import android.os.Environment;

import java.io.File;
import java.io.Serializable;

/**
 * Created by Administrator on 2016/7/13.
 */
public class Friend implements Serializable {




    private String impress;
    private String remdesc;
    private String remname;
    private String groupid;//
    private String grade;
    private String mobile;
    private String nickname;
    private String avatar;
    private String userid;
    private String groupname;//
    private String friendsid;//
    private boolean isChecked;
    private String sortLetters;


    //设置位置，用于解决搜索后错位问题
    private int position = -1;

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    //private ImageDownLoadThread th;

    public void setImpress(String impress) {
        this.impress = impress;
    }


    public void setRemdesc(String remdesc) {
        this.remdesc = remdesc;
    }

    public void setRemname(String remname) {
        this.remname = remname;
    }

    public void setGroupid(String groupid) {
        this.groupid = groupid;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getAvatarLocal(){
        String path= Environment.getExternalStorageDirectory().getAbsolutePath()+"/android/data/com.qianfeng.xiaoli.app/friends/"+userid+".png";
        File f=new File(path);
        if(!f.exists()){

        }
        return f.getAbsolutePath();
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }

    public void setGroupname(String groupname) {
        this.groupname = groupname;
    }

    public void setFriendsid(String friendsid) {
        this.friendsid = friendsid;
    }

    public String getImpress() {
        return impress;
    }

    public String getRemdesc() {
        return remdesc;
    }

    public String getRemname() {
        return remname;
    }

    public String getGroupid() {
        return groupid;
    }

    public String getGrade() {
        return grade;
    }

    public String getMobile() {
        return mobile;
    }

    public String getNickname() {
        return nickname;
    }

    public String getAvatar() {
        return avatar;
    }

    public String getUserid() {
        return userid;
    }

    public String getGroupname() {
        return groupname;
    }

    public String getFriendsid() {
        return friendsid;
    }

    public boolean isChecked() {
        return isChecked;
    }

    public void setIsChecked(boolean isChecked) {
        this.isChecked = isChecked;
    }

    public String getSortLetters() {
        return sortLetters;
    }

    public void setSortLetters(String sortLetters) {
        this.sortLetters = sortLetters;
    }

    @Override
    public String toString() {
        return "Friend{" +
                "impress='" + impress + '\'' +
                ", remdesc='" + remdesc + '\'' +
                ", remname='" + remname + '\'' +
                ", groupid='" + groupid + '\'' +
                ", grade='" + grade + '\'' +
                ", mobile='" + mobile + '\'' +
                ", nickname='" + nickname + '\'' +
                ", avatar='" + avatar + '\'' +
                ", userid='" + userid + '\'' +
                ", groupname='" + groupname + '\'' +
                ", friendsid='" + friendsid + '\'' +
                ", isChecked=" + isChecked +
                ", sortLetters='" + sortLetters + '\'' +
                '}';
    }
}

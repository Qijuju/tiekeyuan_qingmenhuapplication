package com.tky.mqtt.base;
import de.greenrobot.daogenerator.DaoGenerator;
import de.greenrobot.daogenerator.Entity;
import de.greenrobot.daogenerator.Property;
import de.greenrobot.daogenerator.Schema;
import de.greenrobot.daogenerator.ToMany;

/**
 * @author : yingmu on 14-12-31.
 * @email : yingmu@mogujie.com.
 *
 * 其中UserEntity、 GroupEntity 继承PeerEntity
 * 由于 UserEntity、 GroupEntity是自动生成，PeerEntity会有重复字段，所以每次生成之后要处理下成员变量。
 * PeerEntity成员变量名与子类统一。
 *
 * 【备注】session表中的create与update字段没有特别的区分，主要是之前服务端的习惯。。。
 */
public class GreenDaoGenerator {
    public static void main(String[] args) throws Exception {
        Schema schema = new Schema(1, "com.tky.mqtt.dao");
        addMessages(schema);
        addParentSubDept(schema);
        addTopContacts(schema);
        new DaoGenerator().generateAll(schema, "F:/im/platforms/android/src");//项目绝对路径
    }


    //常用联系人表
    private static void addTopContacts(Schema schema) {

        Entity topContacts=schema.addEntity("TopContacts");
        topContacts.addStringProperty("_id").primaryKey();
        topContacts.addStringProperty("name");
        topContacts.addStringProperty("phone");
        topContacts.addStringProperty("when");
       // topContacts.addStringProperty("type");//0表示本地通讯录联系人  1 表示公司通讯录联系人
        topContacts.addStringProperty("count");//根据count来降序来排列

    }

    //聊天消息(单人聊天、群聊)
    private  static  void addMessages(Schema schema){
        Entity message=schema.addEntity("Messages");
        message.addStringProperty("_id").primaryKey();
        message.addStringProperty("account");
        message.addStringProperty("sessionid");
        message.addStringProperty("type");
        message.addStringProperty("from");
        message.addStringProperty("message");
        message.addStringProperty("messagetype");
        message.addStringProperty("platform");
        message.addStringProperty("isSingle");
        message.addStringProperty("isFailure");
        message.addLongProperty("when");
    }


    //部门表（1：n）
    private static void addParentSubDept(Schema schema) {
        Entity parentDept = schema.addEntity("ParentDept");
        parentDept.implementsSerializable();
        parentDept.addStringProperty("_id").primaryKey();
        parentDept.addStringProperty("account");
        parentDept.addStringProperty("authority");
        parentDept.addStringProperty("create_date");
        parentDept.addStringProperty("create_user");
        parentDept.addStringProperty("description");
        parentDept.addStringProperty("grade");
        parentDept.addStringProperty("lastupdate");
        parentDept.addStringProperty("name");
        parentDept.addStringProperty("priority");
        parentDept.addStringProperty("prjid");
        parentDept.addStringProperty("root");
        parentDept.addStringProperty("sync_stage");
        parentDept.addStringProperty("update_user");
        parentDept.addStringProperty("f_sectid");

        Entity subDept = schema.addEntity("SubDept");
        subDept.implementsSerializable();
        subDept.addStringProperty("sub_id").primaryKey();
        subDept.addStringProperty("type");
        Property f_parentid = subDept.addStringProperty("f_id").notNull().getProperty();
        subDept.addToOne(parentDept, f_parentid);

        ToMany parentToSubs = parentDept.addToMany(subDept, f_parentid);
    }
}

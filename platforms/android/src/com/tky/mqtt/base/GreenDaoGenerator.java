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
        new DaoGenerator().generateAll(schema, "E:/WebstormProjects/IM/platforms/android/src");
    }


    //常用联系人表
    private static void addTopContacts(Schema schema) {

        Entity topContacts=schema.addEntity("TopContacts");
        topContacts.addStringProperty("_id").primaryKey();
        topContacts.addStringProperty("name");
        topContacts.addStringProperty("phone");
        topContacts.addStringProperty("type");//1代表打电话  2 代表发信息  3 代表创建聊天
        topContacts.addIntProperty("count");//根据count来降序来排列
        topContacts.addLongProperty("when");//存入当前的毫秒值


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
        parentDept.addStringProperty("_id").primaryKey();//部门
        parentDept.addStringProperty("name");//名字
        parentDept.addIntProperty("childcount");//部门下面的数据包含人员和部门


        Entity subDept = schema.addEntity("SubDept");
        subDept.implementsSerializable();

        subDept.addStringProperty("_id").primaryKey();  //主键id 自己的id
        subDept.addStringProperty("name"); // 名字  人的名字和部门的名称
        subDept.addStringProperty("type");// 1 代表部门  2 代表人员
        subDept.addStringProperty("isactive"); //1代表激活 2 代表未激活  3 代表部门没有这个字段、
        subDept.addStringProperty("parentname"); //父部门的名称
        subDept.addIntProperty("pagesize");//需要页数
        subDept.addIntProperty("childcount");//1 如果是部门有数 如果是人的话 设置为空


        Property f_parentid = subDept.addStringProperty("f_id").notNull().getProperty();
        subDept.addToOne(parentDept, f_parentid);

        ToMany parentToSubs = parentDept.addToMany(subDept, f_parentid);
    }
}

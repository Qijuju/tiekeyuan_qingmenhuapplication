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
        addChatLists(schema);
        new DaoGenerator().generateAll(schema, "C:/Users/Administrator/webstormproject/im/platforms/android/src");//项目绝对路径
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
        message.addStringProperty("_id").primaryKey();//主键id
        message.addStringProperty("account");//消息发出者所在公司id
        message.addStringProperty("sessionid");//发送者id+接收者id、群组id
        message.addStringProperty("type");//聊天类型：群聊、单聊、应用推送
        message.addStringProperty("from");//消息发出者id
        message.addStringProperty("message");//消息内容
        message.addStringProperty("messagetype");//消息类型:普通、回执、抖动窗口
        message.addStringProperty("platform");//客户端类型
        message.addStringProperty("isSingle");//暂时无用
        message.addStringProperty("isFailure");//消息发送成功与否
        message.addLongProperty("when");//消息发送时间
        message.addStringProperty("isDelete");//是否删除(记录该条信息的状态)
        message.addStringProperty("imgSrc");//头像图片来源
        message.addStringProperty("singlecount");//单聊未读消息数
        message.addStringProperty("qunliaocount");//群聊未读消息数
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

    //聊天列表
    private  static  void addChatLists(Schema schema){
        Entity chatitem=schema.addEntity("ChatList");
        chatitem.addStringProperty("id").primaryKey();//接收者id、群组id
        chatitem.addStringProperty("chatName");//对话名称(单聊：接收者名字；群聊：群名称)
        chatitem.addStringProperty("isDelete");//是否删除(记录该会话窗口的状态)
        chatitem.addStringProperty("imgSrc");//聊天图片来源
        chatitem.addStringProperty("lastText");//当前会话的最后一条消息内容
        chatitem.addStringProperty("count");//群聊or单聊未读消息数
        chatitem.addLongProperty("lastDate");//最后一条消息的时间
    }

}

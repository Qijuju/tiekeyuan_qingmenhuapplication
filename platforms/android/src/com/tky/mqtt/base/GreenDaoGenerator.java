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
        addGroupChats(schema);
        addGroupIDS(schema);
        addSearchMsgHistory(schema);
        new DaoGenerator().generateAll(schema,  "F:/xiao/dpan/WindowsApps/IM/platforms/android/src");//项目绝对路径
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

    //聊天消息(单人聊天)
    private  static  void addMessages(Schema schema){
        Entity message=schema.addEntity("Messages");
        message.addStringProperty("_id").primaryKey();//主键id
        message.addStringProperty("sessionid");//接收者id、群组id
        message.addStringProperty("type");//聊天类型：群聊、单聊、应用推送
        message.addStringProperty("from");//消息发出者id
        message.addStringProperty("message");//消息内容
        message.addStringProperty("messagetype");//消息类型:普通、回执、抖动窗口
        message.addStringProperty("platform");//客户端类型
        message.addStringProperty("isFailure");//消息发送成功与否
        message.addLongProperty("when");//消息发送时间
        message.addStringProperty("isDelete");//是否删除(记录该条信息的状态)
        message.addStringProperty("imgSrc");//头像图片来源
        message.addStringProperty("username");//用户名
        message.addStringProperty("senderid");//用于群聊时判断消息来源人id
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
        chatitem.addStringProperty("chatType");//当前会话是单聊还是群聊
        chatitem.addStringProperty("senderId");//消息来源人id
        chatitem.addStringProperty("senderName");//消息来源人的名字
    }

    //创建群聊天会创建数据库
    private static void addGroupChats(Schema schema){
      //
      Entity groupChat=schema.addEntity("GroupChats");
      groupChat.addStringProperty("id").primaryKey(); //群组的id
      groupChat.addStringProperty("groupName");//群组的名字
      groupChat.addStringProperty("groupType");//群组的类型
      groupChat.addBooleanProperty("ismygroup");//是否为自建群

    }


  //添加群聊人员选中ids的表

  private static void addGroupIDS(Schema schema) {
    Entity groupIds=schema.addEntity("SelectedId");
    groupIds.addStringProperty("id").primaryKey();//选中人或者部门的id
    groupIds.addStringProperty("grade");//选中的的在哪个级别
    groupIds.addBooleanProperty("isselected");//是否被选中
    groupIds.addStringProperty("type");
  }
    //添加搜素消息记录的表

    private static void addSearchMsgHistory(Schema schema) {
        Entity msgHistory=schema.addEntity("MsgHistory");
        msgHistory.addStringProperty("_id").primaryKey();
        msgHistory.addStringProperty("msg");//历史消息字段
        msgHistory.addLongProperty("when");
        msgHistory.addStringProperty("type");
    }
}

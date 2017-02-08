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
        addSystemMsg(schema);
        addSearchMsgHistory(schema);
        addLocalPhone(schema);
        addNotifyLists(schema);
        addFielandPic(schema);
        addModuleCount(schema);
        addSlowNotifyLists(schema);
        addOtherpichead(schema);
        //addTestData(schema);
<<<<<<< HEAD
        new DaoGenerator().generateAll(schema,  "C:/Users/Administrator/regitlab/IM/platforms/android/src");//项目绝对路径
=======
        new DaoGenerator().generateAll(schema,  "D:/WebstormProjects/IM/platforms/android/src");//项目绝对路径
>>>>>>> 621424a0c82dafe5d94866b15e352a7a033bcc61
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
        message.addStringProperty("isread");//消息阅读状态
        message.addStringProperty("isSuccess");//消息是否成功发送状态
        message.addStringProperty("daytype");//昨天为：“0” 今天为：“1”
        message.addStringProperty("istime");//如果前后两条消息间隔10分钟，则为true，否则为false
    }


    //系统通知(通知、报警)
    private  static  void addSystemMsg(Schema schema){
        Entity message=schema.addEntity("SystemMsg");
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
        message.addStringProperty("msglevel");//用于区分紧急程度(紧急：0,一般：1)
        message.addStringProperty("isread");//未读和已读    false代表未读    true 代表已读
        message.addStringProperty("isfocus");//是否关注     false 代表未关注   true 代表关注
        message.addIntProperty("istop");//是否置顶  0表示没有置顶  100 表示已经置顶
        message.addStringProperty("isconfirm");//是否已经确认过了  falser 代表没有确认   true 代表已经确认


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
        chatitem.addStringProperty("isSuccess");//消息成功与否状态
        chatitem.addStringProperty("daytype");//最后一条消息的日期类型
        chatitem.addStringProperty("isFailure");//最后一条消息的成功失败状态
        chatitem.addStringProperty("messagetype");//最后一条消息的类型(语音、文本、图片、文件等)
        chatitem.addStringProperty("isRead");//最后一条消息的已读未读状态

    }


    //通知列表
    private  static  void addNotifyLists(Schema schema){
        Entity chatitem=schema.addEntity("NotifyList");
        chatitem.addStringProperty("id").primaryKey();//主键id(uuid)
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

    //一般通知
    private  static  void addSlowNotifyLists(Schema schema){
        Entity chatitem=schema.addEntity("SlowNotifyList");
        chatitem.addStringProperty("id").primaryKey();//主键id(uuid)
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
    groupIds.addStringProperty("type");//选中的类型
      groupIds.addStringProperty("parentid");
  }
    //添加搜素消息记录的表

    private static void addSearchMsgHistory(Schema schema) {
        Entity msgHistory=schema.addEntity("MsgHistory");
        msgHistory.addStringProperty("_id").primaryKey();
        msgHistory.addStringProperty("msg");//历史消息字段
        msgHistory.addLongProperty("when");
        msgHistory.addStringProperty("type");
    }

  //添加本地手机通讯录

  private static void addLocalPhone(Schema schema){
    Entity localPhone=schema.addEntity("LocalPhone");
    localPhone.addStringProperty("id").primaryKey();
    localPhone.addBooleanProperty("isplatform");
    localPhone.addStringProperty("platformid");
    localPhone.addStringProperty("name");
    localPhone.addStringProperty("phonenumber");
    localPhone.addStringProperty("pinyinname");
  }


    //图片和文件查看的列表

    private static void addFielandPic(Schema schema) {

        Entity fileandpic=schema.addEntity("FilePicture");

        fileandpic.addStringProperty("filepicid").primaryKey();//
        fileandpic.addStringProperty("_id");
        fileandpic.addStringProperty("from");//代表是谁发的   true代表的我发的  或者 false
        fileandpic.addStringProperty("sessionid");//会话id
        fileandpic.addStringProperty("fromname");//发送者的名字
        fileandpic.addStringProperty("toname");//接收者的名字
        fileandpic.addStringProperty("smallurl");//小图url
        fileandpic.addStringProperty("bigurl");//大图的url
        fileandpic.addStringProperty("bytesize");//大小byte
        fileandpic.addStringProperty("megabyte");//Mb
        fileandpic.addStringProperty("filename");//文件或者图片的名字
        fileandpic.addStringProperty("type");//类型    File表示文件  Image表示图片
        fileandpic.addLongProperty("when");//时间


    }


    /**
     *  记录应用模块的count值
     * @param schema
     */
    private static void addModuleCount(Schema schema) {
        Entity msgHistory=schema.addEntity("ModuleCount");
        msgHistory.addStringProperty("id").primaryKey();
        msgHistory.addStringProperty("name");//应用名
        msgHistory.addLongProperty("count1");//应用1未读通知数
        msgHistory.addLongProperty("count2");//应用2未读通知数
        msgHistory.addLongProperty("count3");//应用3未读通知数
        msgHistory.addLongProperty("count4");//应用4未读通知数
        msgHistory.addStringProperty("type");//通知类型
    }


    /**
     *   为了测试在线升级
     */

    private static void addTestData(Schema schema) {
        Entity msgHistory=schema.addEntity("TestData");
        msgHistory.addStringProperty("id").primaryKey();
        msgHistory.addStringProperty("name");//应用名
    }

    /**
     * 他人的头像
     */
    private static void addOtherpichead(Schema schema) {
        Entity msgHistory=schema.addEntity("Otherpichead");
        msgHistory.addStringProperty("id").primaryKey();
        msgHistory.addStringProperty("picurl");//图片地址
    }
}

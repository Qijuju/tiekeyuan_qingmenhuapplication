package com.tky.mqtt.base;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.tky.mqtt.dao.ChatList;
import com.tky.mqtt.dao.FilePicture;
import com.tky.mqtt.dao.GroupChats;
import com.tky.mqtt.dao.LocalPhone;
import com.tky.mqtt.dao.Messages;
import com.tky.mqtt.dao.ModuleCount;
import com.tky.mqtt.dao.MsgHistory;
import com.tky.mqtt.dao.NotifyList;
import com.tky.mqtt.dao.ParentDept;
import com.tky.mqtt.dao.SelectedId;
import com.tky.mqtt.dao.SlowNotifyList;
import com.tky.mqtt.dao.SubDept;
import com.tky.mqtt.dao.SystemMsg;
import com.tky.mqtt.dao.TopContacts;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.paho.utils.GsonUtils;
import com.tky.mqtt.services.ChatListService;
import com.tky.mqtt.services.FilePictureService;
import com.tky.mqtt.services.GroupChatsService;
import com.tky.mqtt.services.LocalPhoneService;
import com.tky.mqtt.services.MessagesService;
import com.tky.mqtt.services.ModuleCountService;
import com.tky.mqtt.services.MsgHistoryService;
import com.tky.mqtt.services.NotifyListService;
import com.tky.mqtt.services.ParentDeptService;
import com.tky.mqtt.services.SelectIdService;
import com.tky.mqtt.services.SlowNotifyListService;
import com.tky.mqtt.services.SubDeptService;
import com.tky.mqtt.services.SystemMsgService;
import com.tky.mqtt.services.TopContactsService;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 作者：
 * 包名：com.tky.mqtt.base
 * 日期：2016-07-27 10:31:17
 * 描述：
 */
public class GreenDaoPlugin extends CordovaPlugin {

    /**
     * 获取obj对象
     *
     * @param services
     * @param jsonobj
     * @return
     */
    public BaseDao getResult(String services, JSONObject jsonobj) throws JSONException {
        BaseDao obj = null;
        if ("MessagesService".equals(services)) {
            Messages message = new Messages();
            message.set_id(jsonobj.getString("_id"));
            message.setSessionid(jsonobj.getString("sessionid"));
            message.setType(jsonobj.getString("type"));
            message.setFrom(jsonobj.getString("from"));
            message.setMessage(jsonobj.getString("message"));
            message.setMessagetype(jsonobj.getString("messagetype"));
            message.setPlatform(jsonobj.getString("platform"));
            if(jsonobj.getLong("when")== 0){
                message.setWhen(0L);
            }else{
                message.setWhen(jsonobj.getLong("when"));
            }
//            System.out.println(jsonobj.getLong("when") + "入库的时间");
            message.setIsFailure(jsonobj.getString("isFailure"));
            message.setUsername(jsonobj.getString("username"));
            message.setIsDelete(jsonobj.getString("isDelete"));
            message.setImgSrc(jsonobj.getString("imgSrc"));
            message.setSenderid(jsonobj.getString("senderid"));
            message.setIsread(jsonobj.getString("isread"));
            message.setIsSuccess(jsonobj.getString("isSuccess"));
            obj = message;
        } else if ("ParentDeptService".equals(services)) {
            obj = new ParentDept();
        } else if ("SubDeptService".equals(services)) {
            SubDept subDept = new SubDept();
            subDept.set_id(jsonobj.getString("_id"));
            subDept.setName(jsonobj.getString("name"));
            subDept.setType(jsonobj.getString("type"));
            subDept.setIsactive(jsonobj.getString("isactive"));
            subDept.setParentname(jsonobj.getString("parentname"));
            subDept.setF_id(jsonobj.getString("f_id"));
            subDept.setChildcount(jsonobj.getInt("childcount"));
            subDept.setPagesize(jsonobj.getInt("pagesize"));
            obj = subDept;
        } else if ("TopContactsService".equals(services)) {
            TopContacts topContacts = new TopContacts();
            topContacts.set_id(jsonobj.getString("_id"));
            topContacts.setName(jsonobj.getString("name"));
            topContacts.setType(jsonobj.getString("type"));
            topContacts.setPhone(jsonobj.getString("phone"));
            topContacts.setCount(jsonobj.getInt("count"));
            topContacts.setWhen(System.currentTimeMillis());
            obj = topContacts;
        } else if ("ChatListService".equals(services)) {
            ChatList chatList = new ChatList();
            chatList.setId(jsonobj.getString("id"));
            chatList.setChatName(jsonobj.getString("chatName"));
            chatList.setImgSrc(jsonobj.getString("imgSrc"));
            chatList.setCount(jsonobj.getString("count"));
            chatList.setIsDelete(jsonobj.getString("isDelete"));
            System.out.println(jsonobj.getLong("lastDate") + "");
            if(jsonobj.getLong("lastDate")== 0){
                chatList.setLastDate(0L);
            }else{
                chatList.setLastDate(jsonobj.getLong("lastDate"));
            }
            chatList.setLastText(jsonobj.getString("lastText"));
            chatList.setChatType(jsonobj.getString("chatType"));
            chatList.setSenderId(jsonobj.getString("senderId"));
            chatList.setSenderName(jsonobj.getString("senderName"));
            obj = chatList;
        }else if("GroupChatsService".equals(services)){
          GroupChats groupChats=new GroupChats();
          groupChats.setId(jsonobj.getString("id"));
          groupChats.setGroupName(jsonobj.getString("groupName"));
          groupChats.setGroupType(jsonobj.getString("groupType"));
          groupChats.setIsmygroup(jsonobj.getBoolean("ismygroup"));
          obj=groupChats;
        }else if ("SelectIdService".equals(services)){
          SelectedId selectedId=new SelectedId();
          selectedId.setId(jsonobj.getString("id"));
          selectedId.setGrade(jsonobj.getString("grade"));
          selectedId.setIsselected(jsonobj.getBoolean("isselected"));
          selectedId.setType(jsonobj.getString("type"));
          selectedId.setParentid(jsonobj.getString("parentid"));
          obj=selectedId;
        }else if("SystemMsgService".equals(services)){
            SystemMsg systemMsg = new SystemMsg();
            if("".equals(jsonobj.getString("_id"))){
                systemMsg.set_id(UUID.randomUUID().toString());
            } else {
                systemMsg.set_id(jsonobj.getString("_id"));
            }
            systemMsg.setSessionid(jsonobj.getString("sessionid"));
            systemMsg.setType(jsonobj.getString("type"));
            systemMsg.setFrom(jsonobj.getString("from"));
            systemMsg.setMessage(jsonobj.getString("message"));
            systemMsg.setMessagetype(jsonobj.getString("messagetype"));
            systemMsg.setPlatform(jsonobj.getString("platform"));
//            systemMsg.setWhen(System.currentTimeMillis());
            if(jsonobj.getLong("when")== 0){
                systemMsg.setWhen(0L);
            }else{
                systemMsg.setWhen(jsonobj.getLong("when"));
            }
            systemMsg.setIsFailure(jsonobj.getString("isFailure"));
            systemMsg.setUsername(jsonobj.getString("username"));
            systemMsg.setIsDelete(jsonobj.getString("isDelete"));
            systemMsg.setImgSrc(jsonobj.getString("imgSrc"));
            systemMsg.setSenderid(jsonobj.getString("senderid"));
            systemMsg.setMsglevel(jsonobj.getString("msglevel"));
            systemMsg.setIstop(jsonobj.getInt("istop"));
            systemMsg.setIsread(jsonobj.getString("isread"));
            systemMsg.setIsfocus(jsonobj.getString("isfocus"));
            systemMsg.setIsconfirm(jsonobj.getString("isconfirm"));
            obj = systemMsg;
        }else if ("MsgHistoryService".equals(services)){
            MsgHistory msgHistory=new MsgHistory();
            msgHistory.set_id(UUID.randomUUID().toString());
            msgHistory.setMsg(jsonobj.getString("msg"));
            msgHistory.setType(jsonobj.getString("type"));
            msgHistory.setWhen(System.currentTimeMillis());
            obj=msgHistory;
        }else if("NotifyListService".equals(services)){
            NotifyList notifyList = new NotifyList();
            notifyList.setId(jsonobj.getString("id"));
            notifyList.setChatName(jsonobj.getString("chatName"));
            notifyList.setImgSrc(jsonobj.getString("imgSrc"));
            notifyList.setCount(jsonobj.getString("count"));
            notifyList.setIsDelete(jsonobj.getString("isDelete"));
            notifyList.setLastDate(jsonobj.getLong("lastDate"));
//            System.out.println(jsonobj.getLong("lastDate") + "");
            if(jsonobj.getLong("lastDate")== 0){
                notifyList.setLastDate(0L);
            }else{
                notifyList.setLastDate(jsonobj.getLong("lastDate"));
            }
            notifyList.setLastText(jsonobj.getString("lastText"));
            notifyList.setChatType(jsonobj.getString("chatType"));
            notifyList.setSenderId(jsonobj.getString("senderId"));
            notifyList.setSenderName(jsonobj.getString("senderName"));
            obj = notifyList;
        }else if ("LocalPhoneService".equals(services)){
            LocalPhone localPhone=new LocalPhone();
            localPhone.setId(jsonobj.getString("id"));
            localPhone.setPlatformid(jsonobj.getString("platformid"));
            localPhone.setIsplatform(jsonobj.getBoolean("isplatform"));
            localPhone.setName(jsonobj.getString("name"));
            localPhone.setPhonenumber(jsonobj.getString("phonenumber"));
            localPhone.setPinyinname(jsonobj.getString("pinyinname"));
            obj=localPhone;
        }else if("FilePictureService".equals(services)){
            FilePicture filePicture=new FilePicture();
            filePicture.setFilepicid(jsonobj.getString("filepicid"));
            filePicture.setFrom(jsonobj.getString("from"));
            filePicture.setSessionid(jsonobj.getString("sessionid"));
            filePicture.setFromname(jsonobj.getString("fromname"));
            filePicture.setToname(jsonobj.getString("toname"));
            filePicture.setSmallurl(jsonobj.getString("smallurl"));
            filePicture.setBigurl(jsonobj.getString("bigurl"));
            filePicture.setBytesize(jsonobj.getString("bytesize"));
            filePicture.setMegabyte(jsonobj.getString("megabyte"));
            filePicture.setFilename(jsonobj.getString("filename"));
            filePicture.setType(jsonobj.getString("type"));
            filePicture.setWhen(System.currentTimeMillis());
            obj=filePicture;
        }else if("ModuleCountService".equals(services)){
            ModuleCount moduleCount=new ModuleCount();
            moduleCount.setId(jsonobj.getString("id"));
            moduleCount.setName(jsonobj.getString("name"));
            moduleCount.setCount1(jsonobj.getLong("count1"));
            moduleCount.setCount2(jsonobj.getLong("count2"));
            moduleCount.setCount3(jsonobj.getLong("count3"));
            moduleCount.setCount4(jsonobj.getLong("count4"));
            moduleCount.setType(jsonobj.getString("type"));
            obj=moduleCount;
        }else if("SlowNotifyListService".equals(services)){
            SlowNotifyList notifyList = new SlowNotifyList();
            notifyList.setId(jsonobj.getString("id"));
            notifyList.setChatName(jsonobj.getString("chatName"));
            notifyList.setImgSrc(jsonobj.getString("imgSrc"));
            notifyList.setCount(jsonobj.getString("count"));
            notifyList.setIsDelete(jsonobj.getString("isDelete"));
            notifyList.setLastDate(jsonobj.getLong("lastDate"));
//            System.out.println(jsonobj.getLong("lastDate") + "");
            if(jsonobj.getLong("lastDate")== 0){
                notifyList.setLastDate(0L);
            }else{
                notifyList.setLastDate(jsonobj.getLong("lastDate"));
            }
            notifyList.setLastText(jsonobj.getString("lastText"));
            notifyList.setChatType(jsonobj.getString("chatType"));
            notifyList.setSenderId(jsonobj.getString("senderId"));
            notifyList.setSenderName(jsonobj.getString("senderName"));
            obj = notifyList;
        }
        return obj;
    }

    /**
     * 获取obj对象
     * @param services
     * @param jsonArray
     * @return
     */
    public List<BaseDao> getListResult(String services, JSONArray jsonArray) throws JSONException {
        List<BaseDao> obj = new ArrayList<BaseDao>();
        if("MessagesService".equals(services)){
            List<Messages> messagesList=new ArrayList<Messages>();
            for(int i=0;i<jsonArray.length();i++){
                Messages message = new Messages();
                String data=jsonArray.get(i).toString();
                JSONObject jsonobj=new JSONObject(data);
                message.set_id(UUID.randomUUID().toString());
                message.setSessionid(jsonobj.getString("sessionid"));
                message.setType(jsonobj.getString("type"));
                message.setFrom(jsonobj.getString("from"));
                message.setMessage(jsonobj.getString("message"));
                message.setMessagetype(jsonobj.getString("messagetype"));
                message.setPlatform(jsonobj.getString("platform"));
                message.setWhen(System.currentTimeMillis());
                message.setIsFailure(jsonobj.getString("isFailure"));
                message.setIsDelete(jsonobj.getString("isDelete"));
                message.setImgSrc(jsonobj.getString("imgSrc"));
                message.setUsername(jsonobj.getString("username"));
                message.setSenderid(jsonobj.getString("senderid"));
                messagesList.add(message);
            }

            obj.addAll(messagesList);
        }else if("ParentDeptService".equals(services)){

        }else if("SubDeptService".equals(services)){

        }else if ("TopContactsService".equals(services)){

        }else if("ChatListService".equals(services)){

        }else if ("GroupChatsService".equals(services)){

        }else if ("SelectIdService".equals(services)){

        }else if ("MsgHistoryService".equals(services)){

        }else if("LocalPhoneService".equals(services)){

        }else if("FilePictureService".equals(services)){

        }
        return obj;
    }

    /**
     * 初始化业务类对象
     * @param services
     * @param <T>
     * @return
     */
    public <T> BaseInterface<T> getInterface(String services) {
        BaseInterface baseInterface = null;
        if("MessagesService".equals(services)){
            baseInterface = MessagesService.getInstance(UIUtils.getContext());
        }else if("ParentDeptService".equals(services)){
            baseInterface = ParentDeptService.getInstance(UIUtils.getContext());
        }else if("SubDeptService".equals(services)){
            baseInterface = SubDeptService.getInstance(UIUtils.getContext());
        }else if ("TopContactsService".equals(services)){
            baseInterface= TopContactsService.getInstance(UIUtils.getContext());
        }else if("ChatListService".equals(services)){
            baseInterface= ChatListService.getInstance(UIUtils.getContext());
        }else if("GroupChatsService".equals(services)){
          baseInterface= GroupChatsService.getInstance(UIUtils.getContext());
        }else if ("SelectIdService".equals(services)){
          baseInterface= SelectIdService.getInstance(UIUtils.getContext());
        }else if("SystemMsgService".equals(services)){
          baseInterface = SystemMsgService.getInstance(UIUtils.getContext());
        }else if ("MsgHistoryService".equals(services)) {
            baseInterface= MsgHistoryService.getInstance(UIUtils.getContext());
        }else if("NotifyListService".equals(services)){
            baseInterface= NotifyListService.getInstance(UIUtils.getContext());
        }else if ("LocalPhoneService".equals(services)){
            baseInterface= LocalPhoneService.getInstance(UIUtils.getContext());
        }else if ("FilePictureService".equals(services)){
            baseInterface= FilePictureService.getInstance(UIUtils.getContext());
        }else if("ModuleCountService".equals(services)){
            baseInterface= ModuleCountService.getInstance(UIUtils.getContext());
        }else if("SlowNotifyListService".equals(services)){
            baseInterface= SlowNotifyListService.getInstance(UIUtils.getContext());
        }
        return baseInterface;
    }


    /**
     * @param action          The action to execute.
     * @param args            The exec() arguments.
     * @param callbackContext The callback context used when calling back into JavaScript.
     * @return
     * @throws JSONException
     */

    @Override
    public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        cordova.getThreadPool().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    Method method = GreenDaoPlugin.class.getDeclaredMethod(action, JSONArray.class, CallbackContext.class);
                    method.invoke(GreenDaoPlugin.this, args, callbackContext);
                } catch (NoSuchMethodException e) {
                    e.printStackTrace();
                } catch (InvocationTargetException e) {
                    e.printStackTrace();
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        });
        return true;
    }


    /**
     * 带参加载数据
     *
     * @param args            参数
     * @param callbackContext 插件回调
     */
    public void loadDataByArg(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String services = args.getString(0);
            String key=args.getString(1);
            BaseInterface anInterface = getInterface(services);
            SystemMsg obj = (SystemMsg) anInterface.loadDataByArg(key);
            String ss=GsonUtils.toJson(obj, SystemMsg.class);
            setResult(new JSONObject(ss), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("load by key failure",PluginResult.Status.ERROR,callbackContext);
        }

    }

    /**
     * 加载所有数据
     *
     * @param args            参数
     * @param callbackContext 插件回调
     */
    public void loadAllData(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String services = args.getString(0);
            BaseInterface loadInterface = getInterface(services);
            List<BaseDao> list = loadInterface.loadAllData();
            Gson gson = new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<BaseDao>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
            System.out.println(jsonStr);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("加载失败", PluginResult.Status.ERROR, callbackContext);
        }
    }

    /**
     * @param args            参数
     * @param callbackContext
     */
    public void loadByCount(final JSONArray args, final CallbackContext callbackContext) {
        try {
            TopContactsService service = TopContactsService.getInstance(UIUtils.getContext());
            List<TopContacts> list = service.queryAsc();
            Gson gson = new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<TopContacts>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("加载失败", PluginResult.Status.ERROR, callbackContext);
        }

    }

  public void queryByConditions(final  JSONArray args,final  CallbackContext callbackContext){
    try {
      String service=args.getString(0);
      BaseInterface baseInterface = getInterface(service);
      List<BaseDao> list=baseInterface.queryByConditions();
      Gson gson = new Gson();
      String jsonStr = gson.toJson(list, new TypeToken<List<BaseDao>>() {
      }.getType());
      setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
    } catch (JSONException e) {
      e.printStackTrace();
      setResult("加载失败", PluginResult.Status.ERROR, callbackContext);
    }
  }

    public void querySearchDetail(final JSONArray args,final CallbackContext callbackContext){
        MessagesService service = MessagesService.getInstance(UIUtils.getContext());
        try {
            String name = args.getString(0);
            String message = args.getString(1);
            List<Messages> list=service.querySearchDetail(name, message);
            Gson gson = new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<BaseDao>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("加载失败", PluginResult.Status.ERROR, callbackContext);
        }


    }

    public void queryNotifyCount(final JSONArray args,final CallbackContext callbackContext){
        SystemMsgService service = SystemMsgService.getInstance(UIUtils.getContext());
        try {
            String sessionid = args.getString(0);
            List<SystemMsg> list=service.queryNotifyCount(sessionid);
            Gson gson = new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<BaseDao>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("加载失败", PluginResult.Status.ERROR, callbackContext);
        }


    }



    /**
     * 带两个参数查询(messageservice)
     */
    public void queryGroupOrSingleChat(final JSONArray args,final CallbackContext callbackContext){
        MessagesService service = MessagesService.getInstance(UIUtils.getContext());
        try {
            String type = args.getString(0);
            String sessionid = args.getString(1);
            List<Messages> list=service.querySearchDetail(type, sessionid);
            Gson gson = new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<BaseDao>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("加载失败", PluginResult.Status.ERROR, callbackContext);
        }
    }

    /**
     * 带两个参数查询(SystemMsgService)
     */
    public void queryNewNotifyChat(final JSONArray args,final CallbackContext callbackContext){
        SystemMsgService service = SystemMsgService.getInstance(UIUtils.getContext());
        try {
            String type = args.getString(0);
            String sessionid = args.getString(1);
            List<SystemMsg> list=service.queryNewNotifyChat(type, sessionid);
            Gson gson = new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<BaseDao>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("加载失败", PluginResult.Status.ERROR, callbackContext);
        }
    }


    /**
     * 查询今天的
     * @param args
     * @param callbackContext
     */
    public void queryByToday(final JSONArray args,final CallbackContext callbackContext){
        SystemMsgService service = SystemMsgService.getInstance(UIUtils.getContext());
        try {

            List<SystemMsg> list=service.queryByToday();
            Gson gson = new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<BaseDao>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("加载失败", PluginResult.Status.ERROR, callbackContext);
        }
    }

    /**
     *
     * @param args
     * @param callbackContext
     */
    public void queryByWeek(final JSONArray args,final CallbackContext callbackContext){
        SystemMsgService service = SystemMsgService.getInstance(UIUtils.getContext());
        try {

            List<SystemMsg> list=service.queryByWeek();
            Gson gson = new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<BaseDao>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("加载失败", PluginResult.Status.ERROR, callbackContext);
        }
    }

    /**
     * 查询以前的
     * @param args
     * @param callbackContext
     */
    public void queryByYesterday(final JSONArray args,final CallbackContext callbackContext){
        SystemMsgService service = SystemMsgService.getInstance(UIUtils.getContext());
        try {

            List<SystemMsg> list=service.queryByYesterday();
            Gson gson = new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<BaseDao>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("加载失败", PluginResult.Status.ERROR, callbackContext);
        }
    }

    /**
     * 查找今天的文件
     * @param args
     * @param callbackContext
     */
    public void queryTodayFile(final JSONArray args,final CallbackContext callbackContext){
        FilePictureService service = FilePictureService.getInstance(UIUtils.getContext());
        try {
            String ssid=args.getString(0);
            String type=args.getString(1);
            List<FilePicture> list=service.queryTodayFile(ssid, type);
            Gson gson = new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<BaseDao>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("加载失败", PluginResult.Status.ERROR, callbackContext);
        }
    }

    /**
     * 查找本周的文件
     * @param args
     * @param callbackContext
     */
    public void queryWeekFile(final JSONArray args,final CallbackContext callbackContext){
        FilePictureService service = FilePictureService.getInstance(UIUtils.getContext());
        try {
            String ssid=args.getString(0);
            String type=args.getString(1);
            List<FilePicture> list=service.queryWeekFile(ssid,type);
            Gson gson = new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<BaseDao>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("加载失败", PluginResult.Status.ERROR, callbackContext);
        }
    }

    /**
     * 查找本月的文件
     * @param args
     * @param callbackContext
     */
    public void queryMonthFile(final JSONArray args,final CallbackContext callbackContext){
        FilePictureService service = FilePictureService.getInstance(UIUtils.getContext());
        try {
            String ssid=args.getString(0);
            String type=args.getString(1);
            List<FilePicture> list=service.queryMonthFile(ssid,type);
            Gson gson = new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<BaseDao>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("加载失败", PluginResult.Status.ERROR, callbackContext);
        }
    }

    /**
     * 查找以前的文件
     * @param args
     * @param callbackContext
     */
    public void queryLongFile(final JSONArray args,final CallbackContext callbackContext){
        FilePictureService service = FilePictureService.getInstance(UIUtils.getContext());
        try {
            String ssid=args.getString(0);
            String type=args.getString(1);
            List<FilePicture> list=service.queryLongFile(ssid,type);
            Gson gson = new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<BaseDao>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("加载失败", PluginResult.Status.ERROR, callbackContext);
        }
    }






    /**
     * 带两个参数查询(NotifyListService)
     */
    public void queryNotifyChat(final JSONArray args,final CallbackContext callbackContext){
        NotifyListService service = NotifyListService.getInstance(UIUtils.getContext());
        try {
            String type = args.getString(0);
            String sessionid = args.getString(1);
            List<NotifyList> list=service.queryNotifyChat(type, sessionid);
            Gson gson = new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<BaseDao>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("加载失败", PluginResult.Status.ERROR, callbackContext);
        }
    }


    /**
     * 带两个参数查询(SlowNotifyListService)
     * @param args
     * @param callbackContext
     */
    public void querySlowNotifyChat(final JSONArray args,final CallbackContext callbackContext){
        SlowNotifyListService service = SlowNotifyListService.getInstance(UIUtils.getContext());
        try {
            String type = args.getString(0);
            String sessionid = args.getString(1);
            List<SlowNotifyList> list=service.querySlowNotifyChat(type, sessionid);
            Gson gson = new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<BaseDao>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("加载失败", PluginResult.Status.ERROR, callbackContext);
        }
    }

    /**
     * 根据新版日期查询
     * @param args
     * @param callbackContext
     */
    public void queryDataByDate(final JSONArray args,final CallbackContext callbackContext){
        NotifyListService service = NotifyListService.getInstance(UIUtils.getContext());
        try {
            String type = args.getString(0);
            String sessionid = args.getString(1);
            List<NotifyList> list=service.queryDataByDate(type, sessionid);
            Gson gson = new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<BaseDao>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("加载失败", PluginResult.Status.ERROR, callbackContext);
        }
    }

    public void querySlowDataByDate(final JSONArray args,final CallbackContext callbackContext){
        SlowNotifyListService service = SlowNotifyListService.getInstance(UIUtils.getContext());
        try {
            String type = args.getString(0);
            String sessionid = args.getString(1);
            List<SlowNotifyList> list=service.querySlowDataByDate(type, sessionid);
            Gson gson = new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<BaseDao>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("加载失败", PluginResult.Status.ERROR, callbackContext);
        }
    }


    public void queryGroupIds(final JSONArray args,final CallbackContext callbackContext){
      SelectIdService selectIdService=SelectIdService.getInstance(UIUtils.getContext());
      try {
        String one=args.getString(0);
        String two=args.getString(1);
        List<SelectedId> list=selectIdService.queryBy(one, two);
        Gson gson=new Gson();
        String jsonStr = gson.toJson(list, new TypeToken<List<SelectedId>>() {
        }.getType());
        setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
      } catch (JSONException e) {
        e.printStackTrace();
      }

    }

    public void qureyHistoryMsg(JSONArray args,CallbackContext callbackContext){
        MsgHistoryService  service=MsgHistoryService.getInstance(UIUtils.getContext());
        try {
            String type =args.getString(0);
            List<MsgHistory> list = service.queryMsg(type);
            Gson gson=new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<MsgHistory>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public void queryByType(final JSONArray args,final CallbackContext callbackContext){
        ChatListService chatListService=ChatListService.getInstance(UIUtils.getContext());
        try {
            String one=args.getString(0);
            String two=args.getString(1);
            List<ChatList> list=chatListService.queryByType(one, two);
            Gson gson=new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<ChatList>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("查询失败", PluginResult.Status.ERROR, callbackContext);
        }

    }


    /**
     * 历史消息记录搜索
     */
    public void queryDataByquery(final JSONArray args,final CallbackContext callbackContext){
        MessagesService messagesService=MessagesService.getInstance(UIUtils.getContext());
        try {
            String one=args.getString(0);
            List<Messages> list=messagesService.queryDataByquery(one);
            Gson gson=new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<Messages>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("查询失败", PluginResult.Status.ERROR, callbackContext);
        }

    }
    /**
     * 根据ssid和 type查询数据库里面的信息
     * @param args
     * @param callbackContext
     */
    public void queryByFilepic(final JSONArray args,final CallbackContext callbackContext){
        FilePictureService filePictureService=FilePictureService.getInstance(UIUtils.getContext());
        try {
            String ssid=args.getString(0);
            String type=args.getString(1);
            List<FilePicture> list=filePictureService.queryFilePic(ssid, type);
            Gson gson=new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<FilePicture>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("查询失败", PluginResult.Status.ERROR, callbackContext);
        }

    }


    /**
     * MessageService新增带两参查询方法
     */
    public void queryDataByIdAndIsread(final  JSONArray args,final  CallbackContext callbackContext){
        MessagesService messagesService=MessagesService.getInstance(UIUtils.getContext());
        try {
            String sessionid=args.getString(0);
            String isread=args.getString(1);
            List<Messages> messagesList=messagesService.queryDataByIdAndIsread(sessionid, isread);
            Gson gson=new Gson();
            String jsonstr = gson.toJson(messagesList,new TypeToken<List<Messages>>(){}.getType());
            setResult(new JSONArray(jsonstr),PluginResult.Status.OK,callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("查询失败",PluginResult.Status.ERROR,callbackContext);
        }

    }


    /**
     * 带参查询
     *
     * @param args            参数
     * @param callbackContext 插件回调
     */
    public void queryData(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String services = args.getString(0);
            BaseInterface queryInterface = getInterface(services);
            String whereStr = args.getString(1);
            String type = args.getString(2);
            List<BaseDao> querylist = queryInterface.queryData(whereStr, type);
            Gson gson = new Gson();
            String queryStr = gson.toJson(querylist, new TypeToken<List<BaseDao>>() {
            }.getType());
            setResult(new JSONArray(queryStr), PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("查询失败", PluginResult.Status.ERROR, callbackContext);
        }

    }

    /**
     * 保存对象
     *
     * @param args            参数
     * @param callbackContext 插件回调
     */
    public void saveObj(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String services = args.getString(0);
            JSONObject jsonobj = args.getJSONObject(1);
            BaseInterface anInterface = getInterface(services);
            BaseDao daoObj = getResult(services, jsonobj);
            anInterface.saveObj(daoObj);
            if (daoObj instanceof Messages) {
                String isFailure = jsonobj.getString("isFailure");
                Messages msg = (Messages) daoObj;
                if ("true".equals(isFailure)) {
                    setResult(msg.get_id(), PluginResult.Status.OK, callbackContext);
                } else {
                    setResult(msg.get_id(), PluginResult.Status.OK, callbackContext);
                }
            } else {
                setResult("success", PluginResult.Status.OK, callbackContext);
            }
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("failure", PluginResult.Status.ERROR, callbackContext);
        }
    }


    /**
     * 保存对象数组
     *
     * @param args            参数
     * @param callbackContext 插件回调
     */
    public void saveDataLists(final JSONArray args, final CallbackContext callbackContext) {

        try {
            String services = args.getString(0);
            BaseInterface savelist = getInterface(services);
            JSONArray jsonArray = args.getJSONArray(1);
            List<BaseDao> daolist = getListResult(services, jsonArray);
            savelist.saveDataLists(daolist);
            setResult("success", PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("failure", PluginResult.Status.ERROR, callbackContext);
        }

    }

    /**
     * 删除所有数据
     *
     * @param args            参数
     * @param callbackContext 插件回调
     */
    public void deleteAllData(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String services = args.getString(0);
            BaseInterface deleteInterface = getInterface(services);
            deleteInterface.deleteAllData();
            setResult("delete success", PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("delete failure", PluginResult.Status.ERROR, callbackContext);
        }
    }

    /**
     * 带参删除数据
     *
     * @param args            参数
     * @param callbackContext 插件回调
     */
    public void deleteDataByArg(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String services = args.getString(0);
            String key=args.getString(1);
            BaseInterface anInterface = getInterface(services);
            anInterface.deleteDataByArg(key);
            setResult("success", PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("delete by key failure",PluginResult.Status.ERROR,callbackContext);
        }
    }

    /**
     * 删除对象
     *
     * @param args            参数
     * @param callbackContext 插件回调
     */
    public void deleteObj(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String services = args.getString(0);
            JSONObject jsonobj = args.getJSONObject(1);
            BaseInterface anInterface = getInterface(services);
            BaseDao daoObj = getResult(services, jsonobj);
            anInterface.deleteObj(daoObj);
            setResult("success", PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("failure", PluginResult.Status.ERROR, callbackContext);
        }
    }

    /**
     * 根据聊天类型查询数据
     *
     * @param args            参数
     * @param callbackContext 插件回调
     */
    public void queryMessagelistByIsSingle(final JSONArray args, final CallbackContext callbackContext) {

    }

    /**
     * 获取uuid码
     * @return
     */
    public void getUUID(final JSONArray args, final CallbackContext callbackContext){
        setResult(UUID.randomUUID().toString(),PluginResult.Status.OK,callbackContext);
    }

    /**
     * 设置返回信息
     *
     * @param result          返回结果数据
     * @param resultStatus    返回结果状态  PluginResult.Status.ERROR / PluginResult.Status.OK
     * @param callbackContext
     */
    public void setResult(String result, PluginResult.Status resultStatus, CallbackContext callbackContext) {
        MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }

    /**
     * 设置返回信息
     *
     * @param result          返回结果数据
     * @param resultStatus    返回结果状态  PluginResult.Status.ERROR / PluginResult.Status.OK
     * @param callbackContext
     */
    public void setResult(JSONObject result, PluginResult.Status resultStatus, CallbackContext callbackContext) {
        MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }

    /**
     * 设置返回信息
     *
     * @param result          返回结果数据
     * @param resultStatus    返回结果状态  PluginResult.Status.ERROR / PluginResult.Status.OK
     * @param callbackContext
     */
    public void setResult(JSONArray result, PluginResult.Status resultStatus, CallbackContext callbackContext) {
        MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }

}




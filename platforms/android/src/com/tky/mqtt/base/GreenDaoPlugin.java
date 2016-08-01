package com.tky.mqtt.base;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.tky.mqtt.dao.Messages;
import com.tky.mqtt.dao.ParentDept;
import com.tky.mqtt.dao.SubDept;
import com.tky.mqtt.dao.TopContacts;
import com.tky.mqtt.paho.UIUtils;
import com.tky.mqtt.services.MessagesService;
import com.tky.mqtt.services.ParentDeptService;
import com.tky.mqtt.services.SubDeptService;
import com.tky.mqtt.services.TopContactsService;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
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
     * @param services
     * @param jsonobj
     * @return
     */
    public BaseDao getResult(String services, JSONObject jsonobj) throws JSONException {
        BaseDao obj = null;
        if("MessagesService".equals(services)){
            Messages message = new Messages();
            message.set_id(UUID.randomUUID().toString());
            message.setAccount(jsonobj.getString("account"));
            message.setSessionid(jsonobj.getString("sessionid"));
            message.setType(jsonobj.getString("type"));
            message.setFrom(jsonobj.getString("from"));
            message.setMessage(jsonobj.getString("message"));
            message.setMessagetype(jsonobj.getString("messagetype"));
            message.setPlatform(jsonobj.getString("platform"));
            message.setWhen(System.currentTimeMillis());
            message.setIsFailure(jsonobj.getString("isFailure"));
            obj = message;
        }else if("ParentDeptService".equals(services)){
            obj = new ParentDept();
        }else if("SubDeptService".equals(services)){
            obj = new SubDept();
        }else if ("TopContactsService".equals(services)){
            TopContacts topContacts=new TopContacts();
            topContacts.set_id(UUID.randomUUID().toString());
            topContacts.setName(jsonobj.getString("name"));
            topContacts.setPhone(jsonobj.getString("phone"));
            topContacts.setCount(jsonobj.getString("count"));
            topContacts.setWhen(System.currentTimeMillis()+"");
            obj=topContacts;
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
        }
        return baseInterface;
    }

    /**
     *
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
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void loadDataByArg(final JSONArray args, final CallbackContext callbackContext) {

    }

    /**
     * 加载所有数据
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void loadAllData(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String services=args.getString(0);
            BaseInterface loadInterface = getInterface(services);
            List<BaseDao> list = loadInterface.loadAllData();
            Gson gson = new Gson();
            String jsonStr = gson.toJson(list, new TypeToken<List<BaseDao>>() {
            }.getType());
            setResult(new JSONArray(jsonStr), PluginResult.Status.OK,callbackContext);
            System.out.println(jsonStr);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("加载失败", PluginResult.Status.ERROR, callbackContext);
        }
    }

    /**
     * 带参查询
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void queryData(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String services=args.getString(0);
            BaseInterface queryInterface=getInterface(services);
            String whereStr=args.getString(1);
            String type=args.getString(2);
            List<BaseDao> querylist=queryInterface.queryData(whereStr, type);
            Gson gson=new Gson();
            String queryStr=gson.toJson(querylist,new TypeToken<List<BaseDao>>(){}.getType());
            setResult(new JSONArray(queryStr), PluginResult.Status.OK,callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("查询失败", PluginResult.Status.ERROR,callbackContext);
        }

    }

    /**
     * 保存对象
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void saveObj(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String services = args.getString(0);
            JSONObject jsonobj=args.getJSONObject(1);
            BaseInterface anInterface = getInterface(services);
            BaseDao daoObj= getResult(services,jsonobj);
            anInterface.saveObj(daoObj);
            setResult("success", PluginResult.Status.OK, callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("failure", PluginResult.Status.ERROR, callbackContext);
        }
    }



    /**
     * 保存对象数组
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void saveDataLists(final JSONArray args, final CallbackContext callbackContext) {

    }

    /**
     * 删除所有数据
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void deleteAllData(final JSONArray args, final CallbackContext callbackContext) {
        try {
            String services=args.getString(0);
            BaseInterface deleteInterface=getInterface(services);
            deleteInterface.deleteAllData();
            setResult("delete success",PluginResult.Status.OK,callbackContext);
        } catch (JSONException e) {
            e.printStackTrace();
            setResult("delete failure", PluginResult.Status.ERROR,callbackContext);
        }
    }

    /**
     * 带参删除数据
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void deleteDataByArg(final JSONArray args, final CallbackContext callbackContext) {

    }

    /**
     * 删除对象
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void deleteObj(final JSONArray args, final CallbackContext callbackContext) {

    }

    /**
     * 根据聊天类型查询数据
     * @param args 参数
     * @param callbackContext 插件回调
     */
    public void queryMessagelistByIsSingle(final JSONArray args, final CallbackContext callbackContext) {

    }

    /**
     * 设置返回信息
     * @param result 返回结果数据
     * @param resultStatus 返回结果状态  PluginResult.Status.ERROR / PluginResult.Status.OK
     * @param callbackContext
     */
    public void setResult(String result, PluginResult.Status resultStatus, CallbackContext callbackContext){
        MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }

    /**
     * 设置返回信息
     * @param result 返回结果数据
     * @param resultStatus 返回结果状态  PluginResult.Status.ERROR / PluginResult.Status.OK
     * @param callbackContext
     */
    public void setResult(JSONObject result, PluginResult.Status resultStatus, CallbackContext callbackContext){
        MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }

    /**
     * 设置返回信息
     * @param result 返回结果数据
     * @param resultStatus 返回结果状态  PluginResult.Status.ERROR / PluginResult.Status.OK
     * @param callbackContext
     */
    public void setResult(JSONArray result, PluginResult.Status resultStatus, CallbackContext callbackContext){
        MqttPluginResult pluginResult = new MqttPluginResult(resultStatus, result);
        pluginResult.setKeepCallback(true);
        callbackContext.sendPluginResult(pluginResult);
    }


}




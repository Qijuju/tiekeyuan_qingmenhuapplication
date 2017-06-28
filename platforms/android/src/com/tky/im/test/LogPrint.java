package com.tky.im.test;

import com.tky.im.utils.IMSwitchLocal;
import com.tky.mqtt.paho.utils.FileUtils;

import org.json.JSONException;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

/**
 * 打印日志到文件中
 */

public class LogPrint {

    private static final List<String> regexLineList = new ArrayList<String>();

    /**
     * 是否打印日志
     */
    private static boolean isLog = false;

    static {
        regexLineList.add("\r\n-------+++++++++ 可耻的分割线 +++++++++-------");
        regexLineList.add("\r\n-------+++++++++ 可爱的分割线 +++++++++-------");
        regexLineList.add("\r\n-------+++++++++ 无耻的分割线 +++++++++-------");
        regexLineList.add("\r\n-------+++++++++ 有趣的分割线 +++++++++-------");
        regexLineList.add("\r\n-------+++++++++ 轻松的分割线 +++++++++-------");
        regexLineList.add("\r\n-------+++++++++ 严谨的分割线 +++++++++-------");
        regexLineList.add("\r\n-------+++++++++ 傻傻的分割线 +++++++++-------");
        regexLineList.add("\r\n-------+++++++++ 牛逼的分割线 +++++++++-------");
        regexLineList.add("\r\n-------+++++++++ 漂亮的分割线 +++++++++-------");
        regexLineList.add("\r\n-------+++++++++ 丑陋的分割线 +++++++++-------");
        regexLineList.add("\r\n-------+++++++++ 美丽的分割线 +++++++++-------");
        regexLineList.add("\r\n-------+++++++++ 我爱的分割线 +++++++++-------");
        regexLineList.add("\r\n-------+++++++++ 我恨的分割线 +++++++++-------");
        regexLineList.add("\r\n-------+++++++++ 八卦的分割线 +++++++++-------");
        regexLineList.add("\r\n-------+++++++++ 华丽的分割线 +++++++++-------");
    }

    /**
     * 测试打印数据到文件中
     * @param obj 执行对象是什么（例如：MQTT）
     * @param things 执行什么操作（例如：MQTT开始启动...）
     */
    public static void print(String obj, String things) {
        if (!isLog) {
            return;
        }
        try {
            saveToFile("时间：" + getDateTime() + "    userID：" + IMSwitchLocal.getUserID() + "    功能：" + obj + "     做了什么：" + things + getRegexLine() + "\r\n");
        } catch (IOException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public static void print2(String obj, String things) {
      if (!isLog) {
        return;
      }
        try {
            saveToFile("时间：" + getDateTime() + "    userID：" + IMSwitchLocal.getUserID() + "    功能：" + obj + "     做了什么：" + things + getRegexLine() + "\r\n");
        } catch (IOException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取当前时间
     * @return
     */
    private static String getDateTime() {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return format.format(new Date());
    }

    /**
     * 获取随机分割线
     * @return
     */
    private static String getRegexLine() {
        Random random = new Random();
        int rnum = random.nextInt(regexLineList.size() - 1);
        return regexLineList.get(rnum);
    }

    /**
     * 将收到的消息写到文件中
     * @param text
     * @throws IOException
     */
    private static void saveToFile(String text) throws IOException {
        File file = new File(FileUtils.getDownloadDir() + File.separator + "MqttChatPingSender.txt");
        if (!file.exists()) {
            file.createNewFile();
        }
        FileOutputStream fos = new FileOutputStream(file, true);
        fos.write(((text == null || "".equals(text.trim())) ? "\r\nnotext" : "\r\n" + text).getBytes());
        fos.flush();
    }
}

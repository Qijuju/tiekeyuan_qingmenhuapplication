package com.tky.mqtt.paho;

import android.content.Intent;

import com.tky.mqtt.paho.main.MqttRobot;
import com.tky.mqtt.paho.utils.FileUtils;

import org.eclipse.paho.client.mqttv3.TimerPingSender;
import org.eclipse.paho.client.mqttv3.internal.ClientComms;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class MqttChatPingSender extends TimerPingSender{
	private ClientComms comms;

	public MqttChatPingSender() {
		super();
	}

	@Override
	public void init(ClientComms comms) {
		super.init(comms);
		this.comms = comms;
		try {
			saveToFile("MqttChatPingSender ---> init " + getDateTime());
		} catch (IOException e) {
			e.printStackTrace();
		}
		try {
			saveToFile("MqttChatPingSender ---> stop " + getDateTime());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void start() {
		super.start();
		/**try {
			saveToFile("MqttChatPingSender ---> start " + getDateTime());
		} catch (IOException e) {
			e.printStackTrace();
		}*/
	}

	@Override
	public void stop() {
		super.stop();
		if (MqttRobot.isStarted()) {
			UIUtils.getContext().stopService(new Intent(UIUtils.getContext(), MqttService.class));
			UIUtils.getContext().startService(new Intent(UIUtils.getContext(), MqttService.class));
		}
	}

	@Override
	public void schedule(long delayInMilliseconds) {
		super.schedule(delayInMilliseconds);
		try {
			saveToFile("MqttChatPingSender ---> schedule " + getDateTime() + "---> " + comms.getClient().isConnected());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 获取当前时间
	 * @return
	 */
	private String getDateTime() {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return format.format(new Date());
	}

	/**
	 * 将收到的消息写到文件中
	 * @param text
	 * @throws IOException
	 */
	private void saveToFile(String text) throws IOException {
		File file = new File(FileUtils.getDownloadDir() + File.separator + "MqttChatPingSender.txt");
		if (!file.exists()) {
			file.createNewFile();
		}
		FileOutputStream fos = new FileOutputStream(file, true);
		fos.write(((text == null || "".equals(text.trim())) ? "\r\nnotext" : "\r\n" + text).getBytes());
		fos.flush();
	}
}

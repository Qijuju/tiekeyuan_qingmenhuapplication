package com.tky.mqtt.paho;

import org.eclipse.paho.client.mqttv3.TimerPingSender;
import org.eclipse.paho.client.mqttv3.internal.ClientComms;

public class MqttChatPingSender extends TimerPingSender{
	public MqttChatPingSender() {
		super();
	}

	@Override
	public void init(ClientComms comms) {
		super.init(comms);
	}

	@Override
	public void start() {
		super.start();
	}

	@Override
	public void stop() {
		super.stop();
	}

	@Override
	public void schedule(long delayInMilliseconds) {
		super.schedule(delayInMilliseconds);
	}
}

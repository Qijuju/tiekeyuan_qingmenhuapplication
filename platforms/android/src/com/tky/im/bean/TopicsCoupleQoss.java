package com.tky.im.bean;

public class TopicsCoupleQoss {
	private String[] topics;
	private int[] qoss;

	public TopicsCoupleQoss(){}

	public TopicsCoupleQoss(String[] topics, int[] qoss) {
		this.topics = topics;
		this.qoss = qoss;
	}

	public void setQoss(int[] qoss) {
		this.qoss = qoss;
	}

	public int[] getQoss() {
		return qoss;
	}

	public void setTopics(String[] topics) {
		this.topics = topics;
	}

	public String[] getTopics() {
			return topics;
		}
}

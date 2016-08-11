package com.tky.mqtt.paho.utils;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.List;

public class GsonUtils {
	/**
	 * json字符串转实体
	 * @param json
	 * @param clazz
	 * @return
	 */
	public static <T> T fromJson(String json, Class<T> clazz){
		Gson gson = new Gson();
		return gson.fromJson(json, clazz);
	}

	/**
	 * json字符串转实体集合（List集合）
	 * @param json
	 * @param clazz
	 * @return
	 */
	public static List<?> fromJsonToList(String json, Class<?> clazz){
		Gson gson = new Gson();
		return gson.fromJson(json,new TypeToken<List<?>>() {}.getType());
	}

	/**
	 * 实体转json字符串
	 * @param clazz
	 * @return
	 */
	public static <T> String toJson(T json, Class<T> clazz){
		Gson gson = new Gson();
		return gson.toJson(json, clazz);
	}

	/**
	 * 实体转json字符串
	 * @param clazz
	 * @return
	 */
	public static <T> String toJson(T json, Type clazz){
		Gson gson = new Gson();
		return gson.toJson(json, clazz);
	}

	/**
	 * 获取JSON数据的状态
	 * @param result
	 * @return
	 */
	public static JsonStatus getJsonStatus(String result){
		JsonStatus status = null;
		if (result == null) {
			status = JsonStatus.JSON_NULL;
		}else if ("".equals(result.trim())) {
			status = JsonStatus.JSON_NULL_STR;
		}else if (jsonIsNoData(result, "[", "]") || jsonIsNoData(result, "{", "}")) {
			status = JsonStatus.JSON_NO_DATA;
		}else {
			status = JsonStatus.JSON_NORMAL;
		}
		return status;
	}

	/**
	 * 判断JSON是否有数据
	 * @param result
	 * @return
	 */
	private static boolean jsonIsNoData(String result, String spId1, String spId2) {
		return result.trim().startsWith(spId1) && result.trim().endsWith(spId2) && "".equals(result.substring(1, result.length() - 1).trim());
	}

	public enum JsonStatus {
		/**
		 * 服务器网络错误，也就是拿到的数据为空
		 */
		JSON_NULL,
		/**
		 * 拿到的数据为空
		 */
		JSON_NULL_STR,
		/**
		 * 拿到的是数据为为[]或{}
		 */
		JSON_NO_DATA,
		/**
		 * JSON数据正常
		 */
		JSON_NORMAL
	}
}

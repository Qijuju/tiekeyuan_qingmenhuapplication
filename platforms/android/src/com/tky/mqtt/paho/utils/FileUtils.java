package com.tky.mqtt.paho.utils;

import android.os.Environment;

import com.tky.mqtt.paho.UIUtils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;

public class FileUtils {
	private static final String ROOT_DIR="tkyjst";
	public static String getCacheDir() {
		return getDir("cache");
	}
	public static String getIconDir(){
		return getDir("icon");
	}
	public static String getDownloadDir(){
		return getDir("download");
	}
	private static String getDir(String string) {
		if (isSDAvailable()) {
			return getSDDir(string);
		} else {
			return getDataDir(string);
		}
	}
	/**
	 * 获取到手机内存的目录
	 * @param string
	 * @return
	 */
	private static String getDataDir(String string) {
		// data/data/包名/cache/cache
		return UIUtils.getContext().getCacheDir().getAbsolutePath()+"/"+string;
	}
	/**
	 * 获取到sd卡的目录
	 * @param string
	 * @return
	 */
	private static String getSDDir(String string) {
		StringBuilder sb=new StringBuilder();
		String absolutePath = Environment.getExternalStorageDirectory().getAbsolutePath();///mnt/sdcard
		sb.append(absolutePath);
		sb.append(File.separator);//  /mnt/sdcard/
		sb.append(ROOT_DIR);//mnt/sdcard/GooglePlay
		sb.append(File.separator); //mnt/sdcard/GooglePlay/
		sb.append(string);//mnt/sdcard/GooglePlay/cache
		//sb.append(File.separator); //mnt/sdcard/GooglePlay/cache/
		String filePath = sb.toString();
		File file=new File(filePath);
		if(!file.exists()||!file.isDirectory()){
			if(file.mkdirs()){
				return file.getAbsolutePath();
			}else{
				return "";
			}
		}

		return file.getAbsolutePath();

	}
	/**
	 * 判断sd卡是否可以用
	 * @return
	 */
	private static boolean isSDAvailable() {
		if (Environment.getExternalStorageState().equals(
				Environment.MEDIA_MOUNTED)) {
			return true;
		} else {
			return false;
		}
	}

	/********************************以下是拷贝数据********************************/

	public static void copyData(File srcFile, String destPath) throws IOException {
		if (srcFile.exists()) {
			BufferedInputStream bis = new BufferedInputStream(new FileInputStream(srcFile));
			BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(destPath));
			byte[] bys = new byte[1024];
			int len = -1;
			while ((len = bis.read(bys)) != -1) {
				bos.write(bys, 0, len);
				bos.flush();
			}
			bos.close();
			bis.close();
		}
	}

	/**
	 * 根据路径获取本地文件
	 * @param filePath
	 * @return
	 */
	public static String getLocalFileContent(String filePath) {
		File file = new File(filePath);
		if (!file.exists()) {
			return null;
		}
		BufferedReader br = null;
		StringWriter sw = new StringWriter();
		try {
			br = new BufferedReader(new FileReader(file));
			String line = null;
			while ((line = br.readLine()) != null) {
				sw.append(line);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return sw.toString();
	}

	/**
	 * 根据路径获取本地文件并转换成流
	 * @param filePath
	 * @return
	 */
	public static InputStream getLocalFileToStream(String filePath) {
		File file = new File(filePath);
		if (!file.exists()) {
			return null;
		}
		try {
			return new FileInputStream(file);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 获取目录文件大小
	 *
	 * @param dir
	 * @return
	 */
	public static long getDirSize(File dir) {
		if (dir == null) {
			return 0;
		}
		if (!dir.isDirectory()) {
			return 0;
		}
		long dirSize = 0;
		File[] files = dir.listFiles();
		for (File file : files) {
			if (file.isFile()) {
				dirSize += file.length();
			} else if (file.isDirectory()) {
				dirSize += file.length();
				dirSize += getDirSize(file); // 递归调用继续统计
			}
		}
		return dirSize;
	}

	/**
	 * 转换文件大小
	 *
	 * @param fileS
	 * @return B/KB/MB/GB
	 */
	public static String formatFileSize(long fileS) {
		java.text.DecimalFormat df = new java.text.DecimalFormat("#.00");
		String fileSizeString = "";
		if (fileS < 1024) {
			fileSizeString = df.format((double) fileS) + "B";
		} else if (fileS < 1048576) {
			fileSizeString = df.format((double) fileS / 1024) + "KB";
		} else if (fileS < 1073741824) {
			fileSizeString = df.format((double) fileS / 1048576) + "MB";
		} else {
			fileSizeString = df.format((double) fileS / 1073741824) + "G";
		}
		return fileSizeString;
	}

}

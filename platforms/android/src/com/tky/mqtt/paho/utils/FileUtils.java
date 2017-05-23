package com.tky.mqtt.paho.utils;

import android.annotation.SuppressLint;
import android.content.ContentUris;
import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.DocumentsContract;
import android.provider.MediaStore;

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

	public static String getVoiceDir(){
		return getDir("voice");
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


	/******************************** 以下是根据Uri获取文件路径方法 START ********************************/
	/**
	 * 专为Android4.4设计（已经做兼容处理）的从Uri获取文件绝对路径，以前的方法已不好使
	 */
	@SuppressLint("NewApi")
	public static String getPathByUri4kitkat(final Context context, final Uri uri) {
		final boolean isKitKat = Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT;
		// DocumentProvider
		if (isKitKat && DocumentsContract.isDocumentUri(context, uri)) {
			if (isExternalStorageDocument(uri)) {// ExternalStorageProvider
				final String docId = DocumentsContract.getDocumentId(uri);
				final String[] split = docId.split(":");
				final String type = split[0];
				if ("primary".equalsIgnoreCase(type)) {
					return Environment.getExternalStorageDirectory() + "/" + split[1];
				}
			} else if (isDownloadsDocument(uri)) {// DownloadsProvider
				final String id = DocumentsContract.getDocumentId(uri);
				final Uri contentUri = ContentUris.withAppendedId(Uri.parse("content://downloads/public_downloads"),
						Long.valueOf(id));
				return getDataColumn(context, contentUri, null, null);
			} else if (isMediaDocument(uri)) {// MediaProvider
				final String docId = DocumentsContract.getDocumentId(uri);
				final String[] split = docId.split(":");
				final String type = split[0];
				Uri contentUri = null;
				if ("image".equals(type)) {
					contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
				} else if ("video".equals(type)) {
					contentUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
				} else if ("audio".equals(type)) {
					contentUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
				}
				final String selection = "_id=?";
				final String[] selectionArgs = new String[] { split[1] };
				return getDataColumn(context, contentUri, selection, selectionArgs);
			}
		} else if ("content".equalsIgnoreCase(uri.getScheme())) {// MediaStore
			// (and
			// general)
			return getDataColumn(context, uri, null, null);
		} else if ("file".equalsIgnoreCase(uri.getScheme())) {// File
			return uri.getPath();
		}
		return null;
	}

	/**
	 * Get the value of the data column for this Uri. This is useful for
	 * MediaStore Uris, and other file-based ContentProviders.
	 *
	 * @param context
	 *            The context.
	 * @param uri
	 *            The Uri to query.
	 * @param selection
	 *            (Optional) Filter used in the query.
	 * @param selectionArgs
	 *            (Optional) Selection arguments used in the query.
	 * @return The value of the _data column, which is typically a file path.
	 */
	public static String getDataColumn(Context context, Uri uri, String selection, String[] selectionArgs) {
		Cursor cursor = null;
		final String column = "_data";
		final String[] projection = { column };
		try {
			cursor = context.getContentResolver().query(uri, projection, selection, selectionArgs, null);
			if (cursor != null && cursor.moveToFirst()) {
				final int column_index = cursor.getColumnIndexOrThrow(column);
				return cursor.getString(column_index);
			}
		} finally {
			if (cursor != null)
				cursor.close();
		}
		return null;
	}

	/**
	 * @param uri
	 *            The Uri to check.
	 * @return Whether the Uri authority is ExternalStorageProvider.
	 */
	public static boolean isExternalStorageDocument(Uri uri) {
		return "com.android.externalstorage.documents".equals(uri.getAuthority());
	}

	/**
	 * @param uri
	 *            The Uri to check.
	 * @return Whether the Uri authority is DownloadsProvider.
	 */
	public static boolean isDownloadsDocument(Uri uri) {
		return "com.android.providers.downloads.documents".equals(uri.getAuthority());
	}

	/**
	 * @param uri
	 *            The Uri to check.
	 * @return Whether the Uri authority is MediaProvider.
	 */
	public static boolean isMediaDocument(Uri uri) {
		return "com.android.providers.media.documents".equals(uri.getAuthority());
	}
	/******************************** 以下是根据Uri获取文件路径方法 END ********************************/

}

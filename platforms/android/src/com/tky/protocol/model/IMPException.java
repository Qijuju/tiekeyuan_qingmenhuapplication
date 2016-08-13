package com.tky.protocol.model;

public class IMPException extends Exception {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	public static final int Err_Default = 0;
	public static final int Err_MissObj = 1;	//缺少必须项
	public static final int Err_Length = 2;		//值的长度与协议冲突
	public static final int Err_IsNull = 3;		//值为null或isEmpty
	public static final int Err_Format = 4;		//值格式错误()
	public static final int Err_Unknown = 5;	//未识别的值（对于一些字段，只允许一些特定的值，如消息类型）

	protected int type_ = Err_Default;

	public IMPException() {
		super();
	}

	public IMPException(int type) {
		super();
		type_ = type;
	}

	public IMPException(int type, String message) {
		super(message);
		type_ = type;
	}

	public IMPException(String message) {
		super(message);
	}

	public IMPException(int type, Throwable cause) {
		super(cause);
		type_ = type;
	}

	public IMPException(Throwable cause) {
		super(cause);
	}

	public IMPException(String message, Throwable cause) {
		super(message, cause);
	}

	public IMPException(int type, String message, Throwable cause) {
		super(message, cause);
		type_ = type;
	}

	public int setType() {
		return type_;
	}

	public int getType() {
		return type_;
	}

}
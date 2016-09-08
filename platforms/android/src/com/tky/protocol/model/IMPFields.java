package com.tky.protocol.model;

/**
 * All keys system used will be defined in this class.
 * @author Chen jiawen
 *
 */
public class IMPFields {
	public static final String DT_Boolean = "B";
	public static final String DT_Int = "I";
	public static final String DT_Long = "L";
	public static final String DT_String = "S";
	public static final String DT_String_CN = "C";
	public static final String DT_List = "A";
	public static final String DT_Map = "M";

	public static final String N_Error = "Error";

	public static final String MsgProtocol = "MsgProtocol";
	public static final String EventProtocol = "EventProtocol";

	public static final String NotifyType = "NotifyType";
	public static final String N_Type_Msg = "M";
	public static final String N_Type_Event = "E";


	public static final String Msg_type = "type";
	public static final String M_Type_User = "U";
	public static final String M_Type_Group = "G";
	public static final String M_Type_Sys = "S";
	public static final String M_Type_Dept = "D";
	public static final String M_Type_Radio = "R";
	public static final String M_Type_Recipt = "C";
	public static final String M_Type_Alarm = "A";

	public static final String Msg_mediaType = "mediaType";
	public static final String M_MsgType_Text  = "T";
	public static final String M_MsgType_Image = "I";
	public static final String M_MsgType_File  = "F";
	public static final String M_MsgType_Shake = "S";
	public static final String M_MsgType_Emote = "E";
	public static final String M_MsgType_Audio = "A";
	public static final String M_MsgType_Vedio = "V";

	public static final String Msg_platform = "platform";
	public static final String M_Platform_And  = "A";
	public static final String M_Platform_Win = "W";

	public static final String Msg_receipt = "receipt";
	public static final String M_Recipt_True  = "T";
	public static final String M_Recipt_False = "F";

	public static final String Msg_when = "when";
	public static final String Msg_to = "to";
	public static final String Msg_from = "from";
	public static final String Msg_message = "message";
	public static final String Msg_fromName = "fromName";

	public static final String Eventwhen = "when";
	public static final String EventCode = "EventCode";
	public static final String Event = "Event";

	public static final String E_GroupID = "GroupID";
	public static final String E_GroupName = "GroupName";
	public static final String E_UserName = "UserName";
	public static final String E_UpdateObj = "UpdateObj";

	public static final String E_Code_YAA ="YAA";
	public static final String E_Code_YAM ="YAM";
	public static final String E_Code_G00 ="G00";
	public static final String E_Code_YRA ="YRA";
	public static final String E_Code_YRM ="YRM";
	public static final String E_Code_GAM ="GAM";
	public static final String E_Code_GRM ="GRM";
	public static final String E_Code_RG0 ="RG0";
	public static final String E_Code_GN0 ="GN0";

}

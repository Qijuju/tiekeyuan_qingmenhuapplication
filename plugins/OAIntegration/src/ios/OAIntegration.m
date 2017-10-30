//
//  OAIntegration.m
//  IM
//
//  Created by  on 2017-08-23 15:47:29.
//  描述： oa集成插件
//


#import "OAIntegration.h"
#import <Cordova/CDV.h>

@implementation OAIntegration

/**
 * 获取oa应用并启动
 * @param args 参数
 * @param callbackContext 插件回调
 */
- (void)getApk:(CDVInvokedUrlCommand*)command 
{
	//应用的包名  String
	NSString* packagename = [command argumentAtIndex:0];
	//应用的appid  String
	NSString* appId = [command argumentAtIndex:1];
	//应用的名称  String
	NSString* name = [command argumentAtIndex:2];
}
    

@end

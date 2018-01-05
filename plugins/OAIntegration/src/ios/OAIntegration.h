//
//  OAIntegration.h
//  IM
//
//  Created by  on 2017-08-23 15:47:29.
//  描述： oa集成插件
//

#import <Cordova/CDV.h>

@interface OAIntegration : CDVPlugin

/**
 * 获取oa应用并启动
 * @param command 插件回调
 */
- (void)getApk:(CDVInvokedUrlCommand*)command;


@end

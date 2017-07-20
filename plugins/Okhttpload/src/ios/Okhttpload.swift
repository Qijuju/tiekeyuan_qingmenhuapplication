import Foundation
@objc(TkyOkhttpload) class Okhttpload : CDVPlugin {
	@objc(upload:)
	func upload (command:CDVInvokedUrlCommand) {
    	//SP数据的key值
    	let key: String = (command.arguments[0] as? String)!
    	//SP数据的value值
    	let value: String = (command.arguments[1] as? String)!
	}
	
	@objc(download:)
	func download (command:CDVInvokedUrlCommand) {
    	//SP数据的key值
    	let key: String = (command.arguments[0] as? String)!
    	//SP数据的默认值
    	let defValue: String = (command.arguments[1] as? String)!
	}
	
}
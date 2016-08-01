cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "id": "cordova-plugin-statusbar.statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/ionic-plugin-keyboard/www/android/keyboard.js",
        "id": "ionic-plugin-keyboard.keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ],
        "runs": true
    },
    {
        "file": "plugins/MqttChat/www/mqtt_chat.js",
        "id": "MqttChat.mqtt_chat",
        "clobbers": [
            "cordova.plugins.MqttChat"
        ]
    },
    {
        "file": "plugins/cordova-plugin-app-preferences/www/apppreferences.js",
        "id": "cordova-plugin-app-preferences.apppreferences",
        "clobbers": [
            "plugins.appPreferences"
        ]
    },
    {
        "file": "plugins/localContact/www/android/localContact.js",
        "id": "localContact.localContact",
        "clobbers": [
            "cordova.plugins.localContact"
        ],
        "runs": true
    },
    {
        "file": "plugins/PhonePlugin/www/phoneplugin.js",
        "id": "PhonePlugin.phoneplugin",
        "clobbers": [
            "cordova.plugins.PhonePlugin"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraConstants.js",
        "id": "cordova-plugin-camera.Camera",
        "clobbers": [
            "Camera"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraPopoverOptions.js",
        "id": "cordova-plugin-camera.CameraPopoverOptions",
        "clobbers": [
            "CameraPopoverOptions"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/Camera.js",
        "id": "cordova-plugin-camera.camera",
        "clobbers": [
            "navigator.camera"
        ]
    },
    {
        "file": "plugins/cordova-plugin-camera/www/CameraPopoverHandle.js",
        "id": "cordova-plugin-camera.CameraPopoverHandle",
        "clobbers": [
            "CameraPopoverHandle"
        ]
    },
    {
        "file": "plugins/SavaLocalPlugin/www/SavaLocalPlugin.js",
        "id": "SavaLocalPlugin.SavaLocalPlugin",
        "clobbers": [
            "cordova.plugins.SavaLocalPlugin"
        ]
    },
    {
        "file": "plugins/cordova-sqlite-storage/www/SQLitePlugin.js",
        "id": "cordova-sqlite-storage.SQLitePlugin",
        "clobbers": [
            "SQLitePlugin"
        ]
    },
    {
        "file": "plugins/GreenDaoPlugin/www/green_dao_plugin.js",
        "id": "GreenDaoPlugin.green_dao_plugin",
        "clobbers": [
            "cordova.plugins.GreenDaoPlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-console": "1.0.3",
    "cordova-plugin-device": "1.1.2",
    "cordova-plugin-splashscreen": "3.2.2",
    "cordova-plugin-statusbar": "2.1.3",
    "cordova-plugin-whitelist": "1.2.2",
    "ionic-plugin-keyboard": "2.2.0",
    "MqttChat": "1.0.0",
    "cordova-plugin-app-preferences": "0.7.7",
    "localContact": "1.0.0",
    "PhonePlugin": "1.0.0",
    "cordova-plugin-compat": "1.0.0",
    "cordova-plugin-camera": "2.2.0",
    "SavaLocalPlugin": "1.0.0",
    "cordova-sqlite-storage": "0.7.14",
    "GreenDaoPlugin": "1.0.0"
};
// BOTTOM OF METADATA
});
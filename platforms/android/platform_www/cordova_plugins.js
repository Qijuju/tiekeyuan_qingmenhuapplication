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
    },
    {
        "file": "plugins/ThriftApiClient/www/thrift_api_client.js",
        "id": "ThriftApiClient.thrift_api_client",
        "clobbers": [
            "cordova.plugins.ThriftApiClient"
        ]
    },
    {
        "file": "plugins/ToastUtils/www/toast_utils.js",
        "id": "ToastUtils.toast_utils",
        "clobbers": [
            "cordova.plugins.ToastUtils"
        ]
    },
    {
        "file": "plugins/cordova-plugin-image-picker/www/imagepicker.js",
        "id": "cordova-plugin-image-picker.ImagePicker",
        "clobbers": [
            "plugins.imagePicker"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/DirectoryEntry.js",
        "id": "cordova-plugin-file.DirectoryEntry",
        "clobbers": [
            "window.DirectoryEntry"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/DirectoryReader.js",
        "id": "cordova-plugin-file.DirectoryReader",
        "clobbers": [
            "window.DirectoryReader"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/Entry.js",
        "id": "cordova-plugin-file.Entry",
        "clobbers": [
            "window.Entry"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/File.js",
        "id": "cordova-plugin-file.File",
        "clobbers": [
            "window.File"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileEntry.js",
        "id": "cordova-plugin-file.FileEntry",
        "clobbers": [
            "window.FileEntry"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileError.js",
        "id": "cordova-plugin-file.FileError",
        "clobbers": [
            "window.FileError"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileReader.js",
        "id": "cordova-plugin-file.FileReader",
        "clobbers": [
            "window.FileReader"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileSystem.js",
        "id": "cordova-plugin-file.FileSystem",
        "clobbers": [
            "window.FileSystem"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileUploadOptions.js",
        "id": "cordova-plugin-file.FileUploadOptions",
        "clobbers": [
            "window.FileUploadOptions"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileUploadResult.js",
        "id": "cordova-plugin-file.FileUploadResult",
        "clobbers": [
            "window.FileUploadResult"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/FileWriter.js",
        "id": "cordova-plugin-file.FileWriter",
        "clobbers": [
            "window.FileWriter"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/Flags.js",
        "id": "cordova-plugin-file.Flags",
        "clobbers": [
            "window.Flags"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/LocalFileSystem.js",
        "id": "cordova-plugin-file.LocalFileSystem",
        "clobbers": [
            "window.LocalFileSystem"
        ],
        "merges": [
            "window"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/Metadata.js",
        "id": "cordova-plugin-file.Metadata",
        "clobbers": [
            "window.Metadata"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/ProgressEvent.js",
        "id": "cordova-plugin-file.ProgressEvent",
        "clobbers": [
            "window.ProgressEvent"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/fileSystems.js",
        "id": "cordova-plugin-file.fileSystems"
    },
    {
        "file": "plugins/cordova-plugin-file/www/requestFileSystem.js",
        "id": "cordova-plugin-file.requestFileSystem",
        "clobbers": [
            "window.requestFileSystem"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/resolveLocalFileSystemURI.js",
        "id": "cordova-plugin-file.resolveLocalFileSystemURI",
        "merges": [
            "window"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/browser/isChrome.js",
        "id": "cordova-plugin-file.isChrome",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-file/www/android/FileSystem.js",
        "id": "cordova-plugin-file.androidFileSystem",
        "merges": [
            "FileSystem"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file/www/fileSystems-roots.js",
        "id": "cordova-plugin-file.fileSystems-roots",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-file/www/fileSystemPaths.js",
        "id": "cordova-plugin-file.fileSystemPaths",
        "merges": [
            "cordova"
        ],
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-file-transfer/www/FileTransferError.js",
        "id": "cordova-plugin-file-transfer.FileTransferError",
        "clobbers": [
            "window.FileTransferError"
        ]
    },
    {
        "file": "plugins/cordova-plugin-file-transfer/www/FileTransfer.js",
        "id": "cordova-plugin-file-transfer.FileTransfer",
        "clobbers": [
            "window.FileTransfer"
        ]
    },
    {
        "file": "plugins/phonegap-plugin-barcodescanner/www/barcodescanner.js",
        "id": "phonegap-plugin-barcodescanner.BarcodeScanner",
        "clobbers": [
            "cordova.plugins.barcodeScanner"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/android/geolocation.js",
        "id": "cordova-plugin-geolocation.geolocation",
        "clobbers": [
            "navigator.geolocation"
        ]
    },
    {
        "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
        "id": "cordova-plugin-geolocation.PositionError",
        "runs": true
    },
    {
        "file": "plugins/ScalePhoto/www/scale_photo.js",
        "id": "ScalePhoto.scale_photo",
        "clobbers": [
            "cordova.plugins.ScalePhoto"
        ]
    },
    {
        "file": "plugins/GridPhoto/www/grid_photo.js",
        "id": "GridPhoto.grid_photo",
        "clobbers": [
            "cordova.plugins.GridPhoto"
        ]
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
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
        "file": "plugins/com.verso.cordova.clipboard/www/clipboard.js",
        "id": "com.verso.cordova.clipboard.Clipboard",
        "clobbers": [
            "cordova.plugins.clipboard"
        ]
    },
    {
        "file": "plugins/Okhttpload/www/okhttpload.js",
        "id": "Okhttpload.okhttpload",
        "clobbers": [
            "cordova.plugins.Okhttpload"
        ]
    },
    {
        "file": "plugins/cordova-plugin-fullscreen/www/AndroidFullScreen.js",
        "id": "cordova-plugin-fullscreen.AndroidFullScreen",
        "clobbers": [
            "AndroidFullScreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-spinner-dialog/www/spinner.js",
        "id": "cordova-plugin-spinner-dialog.SpinnerDialog",
        "merges": [
            "window.plugins.spinnerDialog"
        ]
    },
    {
        "file": "plugins/cordova-plugin-document-viewer/www/sitewaertsdocumentviewer.js",
        "id": "cordova-plugin-document-viewer.SitewaertsDocumentViewer",
        "clobbers": [
            "cordova.plugins.SitewaertsDocumentViewer",
            "SitewaertsDocumentViewer"
        ]
    },
    {
        "file": "plugins/cordova-plugin-x-toast/www/Toast.js",
        "id": "cordova-plugin-x-toast.Toast",
        "clobbers": [
            "window.plugins.toast"
        ]
    },
    {
        "file": "plugins/cordova-plugin-x-toast/test/tests.js",
        "id": "cordova-plugin-x-toast.tests"
    },
    {
        "file": "plugins/es6-promise-plugin/www/promise.js",
        "id": "es6-promise-plugin.Promise",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-screen-orientation/www/screenorientation.js",
        "id": "cordova-plugin-screen-orientation.screenorientation",
        "clobbers": [
            "cordova.plugins.screenorientation"
        ]
    },
    {
        "file": "plugins/cordova-plugin-badge/www/badge.js",
        "id": "cordova-plugin-badge.Badge",
        "clobbers": [
            "cordova.plugins.notification.badge"
        ]
    },
    {
        "file": "plugins/cordova-plugin-browsertab/www/browsertab.js",
        "id": "cordova-plugin-browsertab.BrowserTab",
        "clobbers": [
            "cordova.plugins.browsertab"
        ]
    },
    {
        "file": "plugins/com.spout.phonegap.plugins.baidulocation/www/baidulocation.js",
        "id": "com.spout.phonegap.plugins.baidulocation.BiaduLocation",
        "clobbers": [
            "window.baiduLocation"
        ]
    },
    {
        "file": "plugins/phonegap-nfc/www/phonegap-nfc.js",
        "id": "phonegap-nfc.NFC",
        "runs": true
    },
    {
        "file": "plugins/com.darktalker.cordova.screenshot/www/Screenshot.js",
        "id": "com.darktalker.cordova.screenshot.screenshot",
        "merges": [
            "navigator.screenshot"
        ]
    },
    {
        "file": "plugins/OAIntegration/www/o_a_integration.js",
        "id": "OAIntegration.o_a_integration",
        "clobbers": [
            "cordova.plugins.OAIntegration"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-console": "1.0.3",
    "cordova-plugin-device": "1.1.2",
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
    "GreenDaoPlugin": "1.0.0",
    "ThriftApiClient": "1.0.0",
    "ToastUtils": "1.0.0",
    "cordova-plugin-image-picker": "1.1.1",
    "cordova-plugin-file": "4.2.0",
    "cordova-plugin-file-transfer": "1.5.2-dev",
    "phonegap-plugin-barcodescanner": "6.0.1",
    "cordova-plugin-geolocation": "2.2.0",
    "ScalePhoto": "1.0.0",
    "GridPhoto": "1.0.0",
    "cordova-plugin-inappbrowser": "1.5.0",
    "cordova-plugin-splashscreen": "4.0.1",
    "com.verso.cordova.clipboard": "0.1.0",
    "cordova-plugin-add-swift-support": "1.6.2",
    "Okhttpload": "1.0.0",
    "cordova-plugin-fullscreen": "1.1.0",
    "cordova-plugin-spinner-dialog": "1.3.1",
    "cordova-plugin-document-viewer": "0.9.5",
    "cordova-plugin-x-toast": "2.6.0",
    "es6-promise-plugin": "4.1.0",
    "cordova-plugin-screen-orientation": "2.0.1",
    "cordova-plugin-badge": "0.8.1",
    "cordova-plugin-browsertab": "0.2.0",
    "com.spout.phonegap.plugins.baidulocation": "0.1.0",
    "phonegap-nfc": "0.6.6",
    "com.darktalker.cordova.screenshot": "0.1.5",
    "OAIntegration": "1.0.0"
};
// BOTTOM OF METADATA
});
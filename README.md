# Cashflow

The Cashflow project.

## Reference

[UX Design](https://jam4.sapjam.com/groups/Chds0rCvVGL1F7S3BpXq5e/documents/xx4reLY2O3Q8uaID43zGRj)

[User Story](https://jam4.sapjam.com/groups/Chds0rCvVGL1F7S3BpXq5e/documents/L0AMl97uEEsVsFKwDLsfwJ)

## Setup react-native
```bash
sudo npm install -g react-native-cli
```

```bash
cd cashflow-mobile
npm install
react-native link
```

## Run on iOS

```text
update xcode to lastst(Version 10.1 (10B61))
``` 

```bash
cd cashflow-mobile/node_modules/react-native
export http_proxy='http://proxy.wdf.sap.corp:8080'
export https_proxy='http://proxy.wdf.sap.corp:8080'
./scripts/ios-install-third-party.sh
```

```bash
cd cashflow-mobile/node_modules/react-native/third-party/glog-0.3.4
../../scripts/ios-configure-glog.sh
```

```text
open B1Lite.xcodeproj with xcode
click Libraries\RCTWebSocket.xcodeproj
click TARGETS->RCTWebSocket->Build Phases->Link Binary With Libraries->fishhook.a
click - Remove libfishhook.a
click + Add libfishhook.a again
``` 

```text
Run B1Lite on Simulator
``` 

## Run on Android
Tips: If you previously copied init.gradle file, please delete it in bash first:
```bash
rm ~/.gradle/init.gradle
```

### Install react-native-cli
If your OS is windows, open Git Bash as administrator, then execute following command:
```bash
npm install -g react-native-cli
```

### Build react-native
```bash
cd cashflow-mobile/android
./react-natvie-bundle.sh
```

### Install IDE
```text
Install Android Studio
Install Android SDK 8.1 Oreo (API Level 27)
Add Virtual Device with 8.1  Oreo (API Level 27)
```
Add following entry to your environment variable:
```properties
ANDROID_SDK_ROOT=%LOCALAPPDATA%\Android\Sdk
```
Edit "Path" environment variable, add following entry:
```text
%ANDROID_SDK_ROOT%\platform-tools
```
After you edit any environment variables, you probably need logout & login, or restart to make sure it's working.

### Run cashflow-mobile in Android Studio
```text
1. Open Android Studio
2. Choose "Import project (Gradle, Eclipse ADT, etc.)", select cashflow-mobile/android directory.
   Waiting for sync finish. (Ignore the sync failed message)
3. There should be one "app" project and multiple other projects starting with "react-native-".
   If you see only one "android" project in the list, click on "android" project, then click "File->Sync Project with Gradle Files".
   Waiting for sync finish. (Ignore the sync failed message)
4. Build -> Make Project
   Waiting for build finish. If prompted on missing Android SDK in log, click on blue text to install, then build again.
5. Run -> Edit Configurations...
   Create new configuration by click "+" in upper left corner of the window.
   Click "Android App".
   Set name to "Cashflow", then select "app" in Module, click "OK" to save.
6. Run -> Run 'Cashflow'
   Select a Virtual Device, then click "OK". Create one if no Virtual Device available.
   Waiting for run task finish, the Cashflow app should appear in the simulator.
```

### Run cashflow-mobile in Bash
Start Android AVD emulator.

Open bash shell.
```bash
cd cashflow-mobile/android
./react-natvie-run-android.sh
```
When app started, press R twice in keyboard to reload your JS change.

If reload failed, press Ctrl+M, click "Dev Settings", then click "Debug server host & port for device". Input localhost:8081, click "OK" and reload again.

### Replace APK default debug signature keystore (When required)
```bash
cd cashflow-mobile/android/app
keytool -genkey -v -keystore my-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10950
```
Set password (e.g. Initial0), fill other fields according to your requirement.

Edit gradle.properties, change following lines according to your keystore:
```properties
MYAPP_RELEASE_STORE_FILE=my-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=Initial0
MYAPP_RELEASE_KEY_PASSWORD=Initial0
```

## TypeORM

TypeORM is an [ORM](https://github.com/typeorm/typeorm)

```text
If Add or Remove Entity, please update entity/index.js

If Add or Remove Service, please update service/index.js
```

### Demo
```javascript
import AllServices from '../service';

AllServices.AccountService(B1Manager.getConnection()).save(accountData);
```

### Sqlite
DB Browser for SQLite [DownLoad](http://sqlitebrowser.org/), open testorm.db with DB Browser.

```text
filter xcode console log by words: General.db or DemoCN.db or DemoUS.db
For example,
~/Library/Developer/CoreSimulator/Devices/4C9445E6-5EC9-454C-B3DB-8CE029E4314E/data/Containers/Data/Application/F61E881A-C566-43DE-BE38-AF8EE5AC3FC9/Library/LocalDatabase/General.db

~/Library/Developer/CoreSimulator/Devices/4C9445E6-5EC9-454C-B3DB-8CE029E4314E/data/Containers/Data/Application/F61E881A-C566-43DE-BE38-AF8EE5AC3FC9/Library/LocalDatabase/DemoCN.db

~/Library/Developer/CoreSimulator/Devices/4C9445E6-5EC9-454C-B3DB-8CE029E4314E/data/Containers/Data/Application/F61E881A-C566-43DE-BE38-AF8EE5AC3FC9/Library/LocalDatabase/DemoUS.db

open the xxx.db by DB Browser
```

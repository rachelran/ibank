#!/bin/bash

SCRIPT_DIR=$(cd "$(dirname "$0")"; pwd)
cd "$SCRIPT_DIR/.."

if [ ! -f "android/app/src/main/assets/index.android.bundle" ]; then
	echo '$ react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res'
	react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
fi

echo '$ react-native run-android'
react-native run-android

echo ''
echo '----------'
echo 'Please start Android AVD emulator before react-native-run-android.'
echo 'When app started, press R twice in keyboard to reload your JS change.'
echo 'If reload failed, press Ctrl+M, click "Dev Settings", then click "Debug server host & port for device".'
echo 'Input localhost:8081, click "OK" and reload again.'

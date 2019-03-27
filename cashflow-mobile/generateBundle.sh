mkdir ./release
react-native bundle --minify --entry-file index.js --platform ios --dev false --bundle-output ./release/main.jsbundle --assets-dest ./release
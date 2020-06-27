cd android
call gradlew clean
if errorlevel 1 call gradlew clean
call gradlew bundleRelease
if errorlevel 1 call gradlew bundleRelease
cd ..
react-native run-android --variant=release
if errorlevel 1 call react-native run-android --variant=release

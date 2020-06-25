cd android
call gradlew clean
if errorlevel 1 call gradlew clean
call gradlew assembleDebug
if errorlevel 1 call gradlew assembleDebug
cd ..
react-native run-android
if errorlevel 1 call react-native run-android

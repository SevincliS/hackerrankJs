cd android
gradlew clean
IF %ERRORLEVEL% NEQ 0 (
    gradlew clean
)
gradlew assembleDebug
IF %ERRORLEVEL% NEQ 0 (
    gradlew assembleDebug
)
cd ..
react-native run-android
IF %ERRORLEVEL% NEQ 0 (
    react-native run-android
)
import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {GoogleSignin} from '@react-native-community/google-signin';
import admob, {MaxAdContentRating} from '@react-native-firebase/admob';
import {store, persistor} from './redux/store/store';
import Router from './Router.js';
import {Text} from 'react-native';
import Orientation from 'react-native-orientation';
console.disableYellowBox = true;

GoogleSignin.configure({
  webClientId:
    '417241406159-rhcrn9hfbg8qrru6eiprfd2ojnm0k3h5.apps.googleusercontent.com',
});
class App extends React.PureComponent {
  constructor(props) {
    super(props);
    Orientation.lockToPortrait();
    admob()
      .setRequestConfiguration({
        // Update all future requests suitable for parental guidance
        maxAdContentRating: MaxAdContentRating.PG,

        // Indicates that you want your content treated as child-directed for purposes of COPPA.
        tagForChildDirectedTreatment: true,

        // Indicates that you want the ad request to be handled in a
        // manner suitable for users under the age of consent.
        tagForUnderAgeOfConsent: true,
      })
      .then(() => {
        // Request config successfully set!
      });
  }

  componentDidMount() {
    SplashScreen.hide();
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
  }

  render() {
    return (
      <>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer>
              <Router />
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </>
    );
  }
}

export default App;

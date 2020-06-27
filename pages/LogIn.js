import React from 'react';
import db from '@react-native-firebase/database';
import Button from '../components/custom/Button';
import TextInput from '../components/custom/TextInput';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Modal from 'react-native-modal';

import {connect} from 'react-redux';
import {setUser as setUserAction} from '../redux/actions/userActions';
import {setConsent as setConsentAction} from '../redux/actions/consentAction';
import {GoogleSignin} from '@react-native-community/google-signin';
import {AdsConsent, AdsConsentStatus} from '@react-native-firebase/admob';

const width = parseInt(Dimensions.get('screen').width, 10) / 360;
const height = parseInt(Dimensions.get('screen').height, 10) / 640;

class LogIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      visible: false,
      modalText: '',
      warningText: '',
    };
  }

  componentDidMount = async () => {
    const consentInfo = await AdsConsent.requestInfoUpdate([
      'pub-6543358689178377',
    ]);
    const {setConsent} = this.props;
    if (consentInfo.isRequestLocationInEeaOrUnknown) {
      const status = await AdsConsent.getStatus();
      if (status === AdsConsentStatus.UNKNOWN) {
        const formResult = await AdsConsent.showForm({
          privacyPolicy: 'https://invertase.io/privacy-policy',
          withPersonalizedAds: true,
          withNonPersonalizedAds: true,
        });
        if (formResult.status === AdsConsentStatus.PERSONALIZED) {
          setConsent({status: false});
        } else if (formResult.status === AdsConsentStatus.NON_PERSONALIZED) {
          setConsent({status: true});
        }
      } else if (status === AdsConsentStatus.PERSONALIZED) {
        setConsent({status: false});
      } else if (status === AdsConsentStatus.NON_PERSONALIZED) {
        setConsent({status: true});
      }
    }
  };

  onGoogleButtonPress = async () => {
    // Get the users ID token
    const {setUser, navigation} = this.props;
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    auth()
      .signInWithCredential(googleCredential)
      .then(async res => {
        const {uid, displayName: name, email} = res.user;
        await db()
          .ref(`users/${uid}`)
          .once('value')
          .then(user => {
            if (!user.val()) {
              db()
                .ref(`users/${uid}`)
                .set({
                  name,
                  email,
                  uid,
                  learnedProblems: {randomId: 'problemId'},
                });
            }
          });
        setUser({uid, name, email});
        navigation.replace('HomePage');
      });
    return auth().signInWithCredential(googleCredential);
  };

  changeWarningText = () => {
    this.setState({
      warningText: 'Invalid email or password.\nPlease try again.',
    });
  };

  logIn = async () => {
    const {navigation, setUser} = this.props;
    const {email, password} = this.state;
    if (email.trim() === '' || password.trim() === '') {
      this.changeWarningText();
      return;
    }
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async res => {
        this.setState({warningText: ''});
        setUser(res.user);
        navigation.replace('HomePage');
      })
      .catch(({message}) => {
        this.changeWarningText();
        this.setState({password: ''});
      });
  };
  onPressForgot = () => {
    this.props.navigation.navigate('Forgot');
  };
  onSignUp = () => {
    this.props.navigation.navigate('SignUp');
  };

  render() {
    const {email, password, modalText, visible, warningText} = this.state;
    return (
      <View style={styles.container}>
        <Modal
          isVisible={visible}
          onBackdropPress={() => this.setState({visible: false})}>
          <View style={styles.modalView}>
            <View style={styles.modalTextView}>
              <Text>{modalText}</Text>
            </View>
          </View>
        </Modal>
        <Text style={styles.headerText}>Hackerrank JS</Text>
        <TextInput
          keyboardType="email-address"
          placeholder="Email"
          onChangeText={value => this.setState({email: value})}
          value={email}
        />

        <TextInput
          secureTextEntry
          placeholder="Password"
          onChangeText={value => this.setState({password: value})}
          value={password}
        />

        <TouchableOpacity
          style={styles.forgotTextView}
          onPress={() => this.onPressForgot()}>
          <Text style={styles.forgotText}>Forgot password ?</Text>
        </TouchableOpacity>

        <Button title="Sign in" onPress={() => this.logIn(email, password)} />
        <TouchableOpacity
          style={(styles.forgotTextView, {alignItems: 'center'})}
          onPress={() => this.onSignUp()}>
          <Text style={styles.createText}>Create Account</Text>
        </TouchableOpacity>
        <View
          style={{
            width: 140 * width,
            height: 28 * height,
            marginTop: 10 * height,
          }}>
          {warningText === '' ? null : (
            <Text style={styles.warningText}>{warningText}</Text>
          )}
        </View>
        <View style={styles.googleSigninView}>
          <Text style={styles.signInGoogleText}>or sign in with</Text>
          <TouchableOpacity
            style={styles.googleIconView}
            onPress={() =>
              this.onGoogleButtonPress()
                .then(() => console.log('Signed in with Google!'))
                .catch(err => {
                  console.log(err);
                })
            }>
            <Image
              resizeMode="contain"
              style={styles.googleIcon}
              source={require('../images/googleicon.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  forgotText: {
    fontFamily: 'roboto',
    fontWeight: 'bold',
    letterSpacing: 0.015,
    color: '#051B27',
    fontSize: height * 13,
  },
  createText: {
    fontFamily: 'roboto',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    letterSpacing: 0.035,
    color: '#051B27',
    fontSize: height * 14,
  },
  forgotTextView: {
    alignItems: 'flex-end',
    width: width * 284,
    height: height * 20,
  },
  headerText: {
    alignSelf: 'center',
    fontFamily: 'roboto',
    fontSize: 40 * height,
    color: '#051B27',
    marginBottom: 36 * height,
    marginTop: 36 * height,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  googleSigninView: {
    marginTop: 15 * height,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInGoogleText: {
    fontSize: 13 * height,
    fontFamily: 'roboto',
    color: '#00132C',
    textAlign: 'center',
  },
  googleIcon: {
    width: 40.68 * width,
    height: 43 * height,
  },
  googleIconView: {
    marginTop: 6 * height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 78 * width,
  },
  modalTextView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 204 * width,
    height: 50 * height,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  warningText: {
    alignSelf: 'center',
    fontFamily: 'roboto',
    fontSize: 12 * width,
    color: '#D43232',
    textAlign: 'center',
  },
});

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => dispatch(setUserAction(user)),
    setConsent: consent => dispatch(setConsentAction(consent)),
  };
};
// Exports
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LogIn);

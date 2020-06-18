import React from 'react';
import db from '@react-native-firebase/database';
import Button from '../components/custom/Button';
import TextInput from '../components/custom/TextInput';
import { StackActions } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { connect } from 'react-redux';
import { setUser as setUserAction } from '../redux/actions/userActions';
import { GoogleSignin } from '@react-native-community/google-signin';

const width = parseInt(Dimensions.get('screen').width) / 360;
const height = parseInt(Dimensions.get('screen').height) / 640;

class LogIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  onGoogleButtonPress = async () => {
    // Get the users ID token
    const { setUser, navigation } = this.props;
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    auth()
      .signInWithCredential(googleCredential)
      .then(async res => {
        const { uid, displayName: name, email } = res.user;
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
                  learnedProblems: { randomId: 'problemId' },
                });
            }
          });
        setUser({ uid, name, email });
        navigation.replace('HomePage');
      });
    return auth().signInWithCredential(googleCredential);
  };






  logIn = async () => {
    const { navigation, setUser } = this.props;
    const { email, password } = this.state;
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async res => {
        setUser(res.user);
        navigation.dispatch(
          StackActions.replace('HomePage')
        );
      })
      .catch(function (error) {
        if (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
        }
      });
  };
  onPressForgot = () => {
    this.props.navigation.navigate('Forgot');
  };
  onSignUp = () => {
    this.props.navigation.navigate('SignUp');
  };

  render() {
    const { email, password } = this.state;
    const { user, setUser } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>HackerrankJS</Text>
        <TextInput
          keyboardType="email-address"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={email}
        />

        <TextInput
          secureTextEntry
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={password}
        />

        <TouchableOpacity
          style={styles.forgotTextView}
          onPress={() => this.onPressForgot()}>
          <Text style={styles.forgotText}>Forgot password ?</Text>
        </TouchableOpacity>

        <Button title="Sign in" onPress={() => this.logIn(email, password)} />

        <TouchableOpacity
          style={(styles.forgotTextView, { alignItems: 'center' })}
          onPress={() => this.onSignUp()}>
          <Text style={styles.createText}>Create Account</Text>
        </TouchableOpacity>

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
    marginTop: 52 * height,
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
});

const mapStateToProps = state => {
  const { user } = state;
  return { user };
};

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => dispatch(setUserAction(user)),
  };
};
// Exports
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LogIn);

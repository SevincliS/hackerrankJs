import React from 'react';

import Button from '../components/custom/Button';
import TextInput from '../components/custom/TextInput';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { connect } from 'react-redux';
import { setUser as setUserAction } from '../redux/actions/userActions';



const width = parseInt(Dimensions.get('screen').width)/360
const height = parseInt(Dimensions.get('screen').height)/640


class LogIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    }
  }




  logIn = async () => {
    const { navigation,setUser } = this.props;
    const { email, password } = this.state;
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (res) => {
        const { uid: userId, email } = res.user;
        setUser(res.user);
        navigation.navigate('HomePage');
        
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
      <>
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
        </View>
      </>
    )
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
    marginTop: 36 * height
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
});


const mapStateToProps = (state) => {
  const { user } = state
  return { user };
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: (user) => dispatch(setUserAction(user)),
  };
};
// Exports
export default connect(mapStateToProps, mapDispatchToProps)(LogIn);
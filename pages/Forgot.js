import React, { Component } from 'react';
import auth from '@react-native-firebase/auth';
import Button from '../components/custom/Button';
import TextInput from '../components/custom/TextInput';

import { StyleSheet, View, Text, Dimensions } from 'react-native';

const height = parseInt(Dimensions.get('screen').height, 10) / 640;
const width = parseInt(Dimensions.get('screen').width, 10) / 360;

class Forgot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      visible: false,
      modalText: 'initial',
      warningText: '',
      warningColor: '#1BA94C',
    };
  }

  changeWarningText = (warningText, warningColor) => {
    this.setState({ warningText, warningColor });
  };

  sendForgotRequest = email => {
    if (email.trim() === '') {
      this.changeWarningText('Please enter your email', '#D43232');
      return;
    }
    auth()
      .sendPasswordResetEmail(email)
      .then(async () => {
        this.changeWarningText(
          "E-mail is sent.\nPlease don't forget to check your spam folder.",
          '#1BA94C',
        );
      })
      .catch(({ message }) => {
        this.changeWarningText(message.split(']')[1], '#D43232');
      });
  };

  render() {
    const { email, warningText, warningColor } = this.state;
    return (
      <>
        <View style={styles.container}>


          <TextInput
            keyboardType="email-address"
            placeholder="Your Email"
            onChangeText={value => this.setState({ email: value })}
            value={email}
          />
          <View style={styles.warningTextView}>
            {warningText === '' ? null : (
              <Text style={{ ...styles.warningText, ...{ color: warningColor } }}>
                {warningText}
              </Text>
            )}
          </View>
          <Button
            extraStyle={{ marginTop: 15 * height }}
            title="Send a Reset Link"
            onPress={() => this.sendForgotRequest(email)}
          />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 36 * height,
    marginTop: 180 * height,
    flex: 1,
    alignItems: 'center',
  },
  warningText: {
    fontFamily: 'roboto',
    fontSize: 12 * width,
  },
  warningTextView: {
    width: 278 * width,
    height: 28 * height,
    alignContent: 'flex-start',
    marginTop: -3 * height,
  },
});

export default Forgot;

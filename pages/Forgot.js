import React, { Component, useState } from 'react';
import auth from '@react-native-firebase/auth';
import db from '@react-native-firebase/database';
import Button from '../components/custom/Button';
import TextInput from '../components/custom/TextInput';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal'

const height = parseInt(Dimensions.get('screen').height) / 640;
const width = parseInt(Dimensions.get('screen').width) / 360;

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
    this.setState({ warningText, warningColor })
  };


  sendForgotRequest = (email) => {
    if (email.trim() == '') {
      this.changeWarningText('Please enter your email', '#D43232')
      return
    }
    auth().sendPasswordResetEmail(email).then(async () => {
      this.changeWarningText("E-mail is sent.\nPlease don\'t forget to check your spam folder.", '#1BA94C');
    }).catch(({ message }) => {
      this.changeWarningText(message.split("]")[1], '#D43232')
    });
  }

  render() {
    const { email, warningText, warningColor } = this.state;
    return (
      <>
        <View style={styles.container}>
          <TextInput
            keyboardType="email-address"
            placeholder="Your Email"
            onChangeText={email => this.setState({ email })}
            value={email}
          />
          <View
            style={{ width: 278 * width, height: 28 * height, alignContent: 'flex-start', marginTop: -3 * height }}>
            {warningText == '' ?
              null
              :
              <Text
                style={{ ...styles.warningText, ...{ color: warningColor } }}
              >{warningText}</Text>
            }
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
  }
})

export default Forgot;

import React, {Component, useState} from 'react';
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

const height = parseInt(Dimensions.get('screen').height)/640;
const width = parseInt(Dimensions.get('screen').width)/360;

class Forgot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
    };
  }
  sendForgotRequest(email) {
      console.log('forgot request')
  }

  render() {
    const {email} = this.state;
    return (
      <>
        <View style={styles.container}>
          <TextInput
            keyboardType="email-address"
            placeholder="Your Email"
            onChangeText={email => this.setState({email})}
            value={email}
          />
          <Button
            extraStyle={{marginTop: 15 * height}}
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
});

export default Forgot;

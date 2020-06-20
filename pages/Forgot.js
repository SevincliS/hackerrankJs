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
  Modal,
  StatusBar,
  Dimensions,
} from 'react-native';

const height = parseInt(Dimensions.get('screen').height) / 640;
const width = parseInt(Dimensions.get('screen').width) / 360;

class Forgot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      visible: false,
      modalText: 'initial'
    };
  }


  openModal = (seconds, modalText) => {
    return new Promise((resolve, reject) => {
      this.setState({ visible: true, modalText }, () => {
        setTimeout(() => {
          this.setState({ visible: false }, () => resolve('modalClosed'))
        }, seconds * 1000)
      })
    })
  }
  sendForgotRequest = (email) => {
    const { navigation } = this.props;
    if (email.trim() == '') {
      this.openModal(2, 'Please enter your email')
      return
    }
    auth().sendPasswordResetEmail(email).then(async () => {
      console.log("wtf yaaa");
      await this.openModal(2, "E-mail is sent.Please don't forget to check your spam folder.")
      navigation.goBack()
    }).catch(({ message }) => {
      this.openModal(3, message.split("]")[1]);
    });
  }

  render() {
    const { email, visible, modalText } = this.state;
    return (
      <>
        <View style={styles.container}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={visible}>
            <View style={styles.emailSentModal}>
              <View style={styles.emailModalText}>
                <Text>{modalText}</Text>
              </View>
            </View>
          </Modal>
          <TextInput
            keyboardType="email-address"
            placeholder="Your Email"
            onChangeText={email => this.setState({ email })}
            value={email}
          />
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
  emailSentModal: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 78 * width,
  },
  emailModalText: {
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
  }
});

export default Forgot;

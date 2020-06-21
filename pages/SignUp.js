import React, { Component, useState } from 'react';
import auth from '@react-native-firebase/auth';
import db from '@react-native-firebase/database';
import { connect } from 'react-redux';
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


import Button from '../components/custom/Button';
import TextInput from '../components/custom/TextInput';
import { setUser as setUserAction } from '../redux/actions/userActions';

const width = parseInt(Dimensions.get('screen').width) / 360
const height = parseInt(Dimensions.get('screen').height) / 640

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      name: '',
      password: '',
      visible: false
    };
  }

  openAndCloseModal = (seconds, modalText) => {
    this.setState({ visible: true, modalText }, () => {
      setTimeout(() => {
        this.setState({ visible: false })
      }, seconds * 1000)
    })
  }


  register = (email, password, name) => {
    const { navigation, setUser } = this.props;
    if (name.trim() == '') {
      this.openAndCloseModal(2, 'Please enter your name.')
      return
    }
    else if (email.trim() == '') {
      this.openAndCloseModal(2, 'Please enter your email.')
      return
    }
    else if (password.trim() == '') {
      this.openAndCloseModal(2, 'Please enter your password.')
      return
    }
    auth()
      .createUserWithEmailAndPassword(email, password, name)
      .then(async res => {
        const { user } = res;
        const { uid, email } = user;
        db().ref(`users/${uid}`)
          .set({ name, email, uid, learnedProblems: { randomId: 'problemId' } });
        setUser({ name, email, uid });
        navigation.replace('HomePage');
      })
      .catch(({ message }) => {
        const text = message.split(']')[1]
        this.openAndCloseModal(2, text)
      });
  };
  render() {
    const { name, email, password, visible, modalText } = this.state;
    return (
      <>
        <View style={styles.container}>
          <Modal
            isVisible={visible}
            onBackButtonPress={() => this.setState({visible:false})}>
            <View style={styles.modalView}>
              <View style={styles.modalTextView}>
                <Text>{modalText}</Text>
              </View>
            </View>
          </Modal>
          <TextInput
            placeholder="First & Last Name"
            onChangeText={name => this.setState({ name })}
            value={name}
          />

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
          <Button
            title="Create an Acount"
            onPress={() => this.register(email, password, name)}
          />
        </View>
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    marginBottom: 36 * height,
    marginTop: 90 * height,
    flex: 1,
    alignItems: 'center',
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
  }
});

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => dispatch(setUserAction(user)),
  };
};
// Exports
export default connect(
  null,
  mapDispatchToProps,
)(SignUp);

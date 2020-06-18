import React, {Component, useState} from 'react';
import auth from '@react-native-firebase/auth';
import db from '@react-native-firebase/database';
import {connect} from 'react-redux';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
} from 'react-native';

import Button from '../components/custom/Button';
import TextInput from '../components/custom/TextInput';
import {setUser as setUserAction} from '../redux/actions/userActions';

const width = parseInt(Dimensions.get('screen').width)/360
const height = parseInt(Dimensions.get('screen').height)/640

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      name: '',
      password: '',
    };
  }
  register = (email, password, name) => {
    const {navigation, setUser} = this.props;
    auth()
      .createUserWithEmailAndPassword(email, password, name)
      .then(async res => {
        const {user} = res;
        const {uid, email} = user;
        db().ref(`users/${uid}`)
          .set({name, email, uid, learnedProblems: {randomId: 'problemId'}});
        setUser({ name,email,uid });
        navigation.navigate('HomePage');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
        }
        if (error.code === 'auth/invalid-email') {
        }
        console.error(error);
      });
  };
  render() {
    const {name, email, password} = this.state;
    return (
      <>
        <View style={styles.container}>
          <TextInput
            placeholder="First & Last Name"
            onChangeText={name => this.setState({name})}
            value={name}
          />

          <TextInput
            keyboardType="email-address"
            placeholder="Email"
            onChangeText={email => this.setState({email})}
            value={email}
          />
          <TextInput
            secureTextEntry
            placeholder="Password"
            onChangeText={password => this.setState({password})}
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

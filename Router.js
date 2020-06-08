import React from 'react';
import {connect} from 'react-redux';

import {Dimensions} from 'react-native';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Forgot from './pages/Forgot';
import HomePage from './pages/HomePage';

import StackNavigator from './StackNavigator';


class Router extends React.Component {
  constructor(props) {
    super(props);
    const { user } = props;
    this.state = {
      initialRouteName: user.name != '' ? 'HomePage' : 'LogIn',
    };
  }
  render() {
    const { initialRouteName } = this.state;
    return (
      <StackNavigator initialRouteName={initialRouteName}></StackNavigator> 
      );
  }
}


const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

export default connect(
  mapStateToProps,
  null,
)(Router);

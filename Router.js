import React from 'react';
import {connect} from 'react-redux';

import StackNavigator from './StackNavigator';

class Router extends React.Component {
  constructor(props) {
    super(props);
    const {user} = props;
    this.state = {
      initialRouteName: user.name !== '' ? 'HomePage' : 'LogIn',
    };
  }
  render() {
    const {initialRouteName} = this.state;
    return <StackNavigator initialRouteName={initialRouteName} />;
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

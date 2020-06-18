import React from 'react';
import {Dimensions} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Forgot from './pages/Forgot';
import HomePage from './pages/HomePage';
import Problems from './pages/Problems';
import ProblemSheet from './pages/ProblemSheet';

const Stack = createStackNavigator();
const height = parseInt(Dimensions.get('screen').height)/640;
const width = parseInt(parseInt(Dimensions.get('screen').width))/360; 



class StackNavigator extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const {initialRouteName} = this.props;
    return (
      <Stack.Navigator
        initialRouteName = {initialRouteName}
        screenOptions={
          (this.screenOptions)
        }>
        <Stack.Screen
          name="LogIn"
          component={LogIn}
          options={{
            headerShown: false,
            
          }}
        />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Forgot" component={Forgot} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="Problems" component={Problems} />
        <Stack.Screen name="ProblemSheet" component={ProblemSheet} />
      </Stack.Navigator>
    );
  }
  screenOptions = {
    headerTintColor: '#ffffff',
    title: 'HackerrankJS',
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontSize: (25 * width),
      fontFamily: 'roboto',
    },
    headerStyle: {
      height: (63 * height),
      backgroundColor: '#051B27',
    },
  }
}

export default StackNavigator;


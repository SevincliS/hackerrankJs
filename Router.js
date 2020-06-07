import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
import LogIn  from './components/LogIn'
class Router extends React.Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="LogIn" component={LogIn} />
      </Stack.Navigator>
    )
  }
}

export default Router;
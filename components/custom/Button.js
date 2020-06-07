import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('screen');
const { height } = Dimensions.get('screen');
class Button extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={props.onPress}>
        <View style={{ ...styles.button, ...props.extraStyle }}>
          <Text style={styles.text}>{props.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  button: {
    marginTop: (55 * height) / 640,
    marginBottom: (12 * height) / 640,
    backgroundColor: '#051B27',
    fontSize: (width * 100) / 360,
    width: (width * 284) / 360,
    height: (height * 51) / 640,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  text: {
    fontSize: (width * 22) / 360,
    color: '#fff',
  },
});

export default Button;

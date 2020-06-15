import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Dimensions,
} from 'react-native';

const  width  = parseInt(Dimensions.get('screen').width)/360;
const  height  = parseInt(Dimensions.get('screen').height)/640;


class Button extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { onPress, title, extraStyle } = this.props;
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={{ ...styles.button, ...extraStyle }}>
          <Text style={styles.text}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
};





const styles = StyleSheet.create({
  button: {
    marginTop: (55 * height),
    marginBottom: (12 * height),
    backgroundColor: '#051B27',
    fontSize: (width * 100),
    width: (width * 284),
    height: (height * 51),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  text: {
    fontSize: (width * 22),
    color: '#fff',
  },
});

export default Button;

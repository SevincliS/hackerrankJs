import React from 'react';
import {
  StyleSheet,
  TextInput as TI,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('screen')
const { height } = Dimensions.get('screen')

class TextInput extends React.Component {
  render() {
    return (
      <TI placeholderTextColor='#817D7D'{...props} style={styles.textInput}>
      </TI>
    )
  }
}

const styles = StyleSheet.create({
  textInput: {
    paddingLeft: 15 * width / 360,
    marginBottom: height * 13 / 640,
    backgroundColor: '#E3E3E3',
    textAlign: 'left',
    fontSize: width * 15 / 360,
    width: width * 284 / 360,
    height: height * 51 / 640,
    borderRadius: 4,
  },
});
export default TextInput;


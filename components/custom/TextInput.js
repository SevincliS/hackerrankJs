import React from 'react';
import {StyleSheet, TextInput as TI, Dimensions} from 'react-native';

const width = parseInt(Dimensions.get('screen').width, 10) / 360;
const height = parseInt(Dimensions.get('screen').height, 10) / 640;

class TextInput extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TI
        placeholderTextColor="#817D7D"
        {...this.props}
        style={styles.textInput}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    paddingLeft: 15 * width,
    marginBottom: height * 13,
    backgroundColor: '#E3E3E3',
    textAlign: 'left',
    fontSize: width * 15,
    width: width * 284,
    height: height * 51,
    borderRadius: 4,
  },
});
export default TextInput;

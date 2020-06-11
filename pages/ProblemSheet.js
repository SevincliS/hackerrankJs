import React from 'react';
import db from '@react-native-firebase/database';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import HeaderBackButton from '../node_modules/@react-navigation/stack/lib/commonjs/views/Header/HeaderBackButton';
import {
  atomDark,
  tomorrow,
  duotoneDark,
  duotoneLight,
  vs,
  twilight,
  dark,
  funky,
  okaidia,
  duotoneForest,
  prism,
  duotoneEarth,
} from 'react-syntax-highlighter/dist/esm/styles/prism/';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Picker,
  StatusBar,
  Alert,
  Modal,
  TouchableHighlight,
  TextInput,
  Dimensions,
  Button,
  Clipboard,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';

import {connect} from 'react-redux';

import {setLearnedProblemIds} from '../redux/actions/problemsActions';

const height = Dimensions.get('screen').height / 640;
const width = Dimensions.get('screen').width / 360;

class ProblemSheet extends React.Component {
  constructor(props) {
    super(props);
    const { navigation, currentProblem } = props;
    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          tintColor={'#ffffff'}
          onPress={() => {
            if(!currentProblem.learned) {
              this.setState({modalVisible: true});
            }
            else {
              navigation.goBack()
            }
          }}
        />
      ),
    });

    this.state = {
      selectedTheme: tomorrow,
      spinner: false,
      problemText: '',
      solutionText: '',
      modalVisible: false,
      clipboardModalVisible: false,
    };
  }

  componentDidMount() {
    const {currentProblem} = this.props;
    const {id, name, text, solution} = currentProblem;

    Promise.all([
      fetch(text).then(problemText => problemText.text()),
      fetch(solution).then(solutionText => solutionText.text()),
    ]).then(([problemText, solutionText]) => {
      console.log({problemText, solutionText});
      this.setState({problemText, solutionText});
    });
  }

  themes = [
    {value: tomorrow, label: 'Tomorrow'},
    {value: duotoneForest, label: 'Duotone Forest'},
    {value: duotoneEarth, label: 'Duotone Earth'},
    {value: okaidia, label: 'Okaidia'},
    {value: atomDark, label: 'Atom Dark'},
    {value: duotoneDark, label: 'Duotone Dark'},
    {value: twilight, label: 'Twilight'},
    {value: dark, label: 'Dark'},
    {value: prism, label: 'Prism'},
    {value: vs, label: 'Visual Studio'},
    {value: duotoneLight, label: 'Duotone Light'},
  ];

  markAsLearned = async () => {
    const {currentProblem, user} = this.props;
    const {id} = currentProblem;
    const {uid} = user;
    let updates = {};
    updates['/learnedProblems/' + id] = true;
    db()
      .ref(`users/${uid}`)
      .update(updates);
    navigation.goBack();
  };

  writeToClipboard = text => {
    Clipboard.setString(text);
    setTimeout(() => {
      this.setState({clipboardModalVisible: false});      
    }, 1000);
  };

  render() {
    const {
      problemText,
      solutionText,
      selectedTheme,
      modalVisible,
      clipboardModalVisible,
    } = this.state;
    const {navigation} = this.props;

    return (
      <View>
        <ScrollView>
          <Modal
            animationType="fade"
            transparent={true}
            visible={clipboardModalVisible}
            >
              <View style={styles.clipboardView}>
            <View style={styles.clipboardModal}>
                <Text>
                  Code copied to the clipboard!
                </Text>
            </View>
            </View>
          </Modal>
          <View style={styles.textContainer}>
            <Text style={{fontSize: 16, fontFamily: 'roboto'}}>
              {' '}
              {problemText.split('Function Description')[0]}{' '}
            </Text>
            <Text
              style={{fontSize: 20, fontWeight: 'bold', fontFamily: 'roboto'}}>
              {' '}
              Function Description{' '}
            </Text>
            <Text style={{fontSize: 16, fontFamily: 'roboto'}}>
              {' '}
              {problemText.split('Function Description')[1]}{' '}
            </Text>
          </View>
          <Picker
            mode="dropdown"
            selectedValue={selectedTheme}
            style={{height: 40, width: 180, alignSelf: 'flex-end'}}
            onValueChange={selectedTheme => {
              this.setState({selectedTheme});
            }}>
            {this.themes.map(theme => (
              <Picker.Item label={theme['label']} value={theme['value']} />
            ))}
          </Picker>
          <ScrollView>
            <TouchableOpacity
              onPress={() => {
                this.setState({clipboardModalVisible: true}, 
                this.writeToClipboard(solutionText)
                );
              }}>
              <SyntaxHighlighter
                fontSize={14}
                language="javascript"
                style={selectedTheme}
                highlighter={'prism' || 'hljs'}>
                {solutionText}
              </SyntaxHighlighter>
            </TouchableOpacity>
          </ScrollView>
          <View style={styles.centeredView}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>
                    Do you want to mark this problem as "learned" ?
                  </Text>
                  <View style={styles.buttons}>
                    <TouchableHighlight
                      underlayColor="#1BA94C"
                      style={styles.yesButton}
                      onPress={() => {
                        this.markAsLearned();
                      }}>
                      <Text style={styles.yesText}>YES</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      underlayColor="#D50D20"
                      style={styles.noButton}
                      onPress={() => {
                        navigation.goBack();
                      }}>
                      <Text style={styles.noText}>NO</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  headerText: {
    fontSize: 25 * width,
    fontFamily: 'roboto',
    color: '#ffffff',
    textAlign: 'center',
    alignSelf: 'center',
  },
  headerBack: {
    color: '#ffffff',
    width: 10,
  },
  header: {
    flexDirection: 'row',
    height: 63 * height,
    backgroundColor: '#051B27',
    justifyContent: 'center',
  },
  textContainer: {
    backgroundColor: '#ffffff',
  },
  spinnerText: {
    color: '#A9A9A9',
    fontSize: 12,
    fontFamily: 'roboto',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clipboardView:{
    flex:1,
    justifyContent: 'flex-end',
    marginBottom:15*height,
    marginLeft:78*width

  },
  clipboardModal:{
    justifyContent:'center',
    alignItems:'center',
    width: 204 * width,
    height: 26 * height,
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
  },
  modalView: {
    justifyContent: 'center',
    width: 290 * width,
    height: 156 * height,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  yesText: {
    alignSelf: 'center',
    fontFamily: 'roboto',
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  noText: {
    alignSelf: 'center',
    fontFamily: 'roboto',
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  modalText: {
    marginHorizontal: 20,
    marginBottom: 30,
    fontSize: 18,
    textAlign: 'center',
  },
  yesButton: {
    justifyContent: 'center',
    width: 95 * width,
    height: 30 * height,
    marginRight: 18 * width,
    backgroundColor: '#10D554',
    borderRadius: 4,
    textAlign: 'center',
    elevation: 2,
  },
  noButton: {
    justifyContent: 'center',
    width: 95 * width,
    height: 30 * height,
    backgroundColor: '#DC3545',
    borderRadius: 4,
    textAlign: 'center',
    elevation: 2,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

mapStateToProps = state => {
  const {currentProblem} = state.problems;
  const {user} = state;
  return {
    currentProblem,
    user,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setLearnedProblemIds: problemIds =>
      dispatch(setLearnedProblemIds(problemIds)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProblemSheet);
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
import { Picker } from '@react-native-community/picker';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
  Modal,
  TouchableHighlight,
  TextInput,
  Dimensions,
  Button,
  Clipboard,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from '@react-native-firebase/admob';

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-6543358689178377~8698272277';

import { addToLearnedProblemIds } from '../redux/actions/problemsActions';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['hackerrank', 'code'],
});

const height = Dimensions.get('screen').height / 640;
const width = Dimensions.get('screen').width / 360;

class ProblemSheet extends React.Component {
  constructor(props) {
    super(props);
    const { navigation, currentProblem } = props;




    this.state = {
      selectedTheme: tomorrow,
      spinner: true,
      problemText: '',
      solutionText: '',
      modalVisible: false,
      clipboardModalVisible: false,
      learned: currentProblem.learned,
    };


    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          tintColor={'#ffffff'}
          onPress={() => {
            if (!this.state.learned) {
              this.setState({ modalVisible: true });
            } else {
              navigation.goBack();
            }
          }}
        />
      ),
    });

    this.eventListener = rewarded.onAdEvent((type, error, reward) => {
      if (type === RewardedAdEventType.LOADED) {
        this.setState({ showRewarded: true });
        console.log('loaded');
      }
      if (type === RewardedAdEventType.EARNED_REWARD) {
        console.log('User earned reward of ', reward);
      }
    });

    rewarded.load();


  }

  componentDidMount() {
    const { currentProblem } = this.props;
    const { id, name, text, solution } = currentProblem;
    this.setState({ spinner: true });
    Promise.all([
      fetch(text).then(problemText => problemText.text()),
      fetch(solution).then(solutionText => solutionText.text()),
    ]).then(([problemText, solutionText]) => {
      let [splittedProblemText, functionDescription] = problemText.split(
        'Function Description',
      );
      this.setState({
        problemText: splittedProblemText,
        functionDescription,
        solutionText,
        spinner: false,
      });
    });
  }

  componentDidUpdate() {
    console.log('problemsheet updated')
  }

  themes = [
    { value: tomorrow, label: 'Tomorrow', color: '#B15322' },
    { value: duotoneForest, label: 'Duotone Forest', color: '#97A656' },
    { value: duotoneEarth, label: 'Duotone Earth', color: '#8F7A37' },
    { value: okaidia, label: 'Okaidia', color: '#477880' },
    { value: atomDark, label: 'Atom Dark', color: '#1F8596' },
    { value: duotoneDark, label: 'Duotone Dark', color: '#564E75' },
    { value: twilight, label: 'Twilight', color: 'black' },
    { value: dark, label: 'Dark', color: 'black' },
    { value: prism, label: 'Prism', color: '#E24B71' },
    { value: vs, label: 'Visual Studio', color: '#343286' },
    { value: duotoneLight, label: 'Duotone Light', color: '#8289A6' },
  ];

  markAsLearned = async () => {
    const {
      currentProblem,
      user,
      navigation,
      addToLearnedProblemIds,
    } = this.props;
    const { id } = currentProblem;
    const { uid } = user;
    let updates = {};
    updates['/learnedProblems/' + id] = true;
    await db()
      .ref(`users/${uid}`)
      .update(updates);
    addToLearnedProblemIds(id);
    navigation.goBack();
  };


  writeToClipboard = text => {
    Clipboard.setString(text);

    setTimeout(() => {
      this.setState({ clipboardModalVisible: false });
      rewarded.show();
    }, 1000);
  };
  lastPressedMiliseconds;
  copyCode = () => {
    let currentMs = new Date().getMilliseconds();
    if (Math.abs(this.lastPressedMiliseconds - currentMs) < 200) {
      const { solutionText } = this.state;
      this.setState(
        {
          clipboardModalVisible: true,
        },
        this.writeToClipboard(solutionText),
      );
    }
    this.lastPressedMiliseconds = currentMs;
  };

  render() {
    const { spinner, visible, source } = this.state;
    const {
      problemText,
      functionDescription,
      solutionText,
      selectedTheme,
      modalVisible,
      clipboardModalVisible,
    } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        {spinner ? (
          <ActivityIndicator size="large" color="#051B27" />
        ) : (
            <ScrollView>
              <Modal
                animationType="fade"
                transparent={true}
                visible={clipboardModalVisible}>
                <View style={styles.clipboardView}>
                  <View style={styles.clipboardModal}>
                    <Text>Code copied to the clipboard!</Text>
                  </View>
                </View>
              </Modal>
              <View style={styles.textContainer}>
                <Text
                  key={'problemText'}
                  style={{ fontSize: 16, fontFamily: 'roboto' }}>
                  {' '}
                  {problemText}{' '}
                </Text>

                <Text
                  key={'functionDescriptionHeader'}
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    fontFamily: 'roboto',
                  }}>
                  {' '}
                Function Description{' '}
                </Text>
                <Text
                  key={'functionDescriptionText'}
                  style={{ fontSize: 16, fontFamily: 'roboto' }}>
                  {' '}
                  {functionDescription}{' '}
                </Text>
              </View>
              <Picker
                mode="dropdown"
                selectedValue={selectedTheme}
                style={{ height: 40, width: 180, alignSelf: 'flex-end' }}
                onValueChange={selectedTheme => {
                  this.setState({ selectedTheme });
                }}>
                {this.themes.map(theme => (
                  <Picker.Item
                    key={theme['label']}
                    label={theme['label']}
                    value={theme['value']}
                    color={theme['color']}
                  />
                ))}
              </Picker>
              <ScrollView>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    this.copyCode();
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
          )}
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
  clipboardView: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 15 * height,
    marginLeft: 78 * width,
  },
  clipboardModal: {
    justifyContent: 'center',
    alignItems: 'center',
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

mapStateToProps = state => {
  const { currentProblem } = state.problems;
  const { user } = state;
  return {
    currentProblem,
    user,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    addToLearnedProblemIds: problemId =>
      dispatch(addToLearnedProblemIds(problemId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProblemSheet);

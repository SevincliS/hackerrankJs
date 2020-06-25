/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-did-mount-set-state */
import React from 'react';
import db from '@react-native-firebase/database';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import {
  atomDark,
  tomorrow,
  duotoneDark,
  duotoneLight,
  vs,
  twilight,
  dark,
  okaidia,
  duotoneForest,
  prism,
  duotoneEarth,
} from 'react-syntax-highlighter/dist/esm/styles/prism/';
import {Picker} from '@react-native-community/picker';
import Modal from 'react-native-modal';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableHighlight,
  Dimensions,
  Clipboard,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ActivityIndicator, BackHandler} from 'react-native';
import {connect} from 'react-redux';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from '@react-native-firebase/admob';
import Orientation from 'react-native-orientation';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-6543358689178377~8698272277';

import {addToLearnedProblemIds as addToLearnedProblemIdsAction} from '../redux/actions/problemsActions';
const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ['hackerrank', 'code'],
});

const height = Dimensions.get('screen').height / 640;
const width = Dimensions.get('screen').width / 360;

class ProblemSheet extends React.Component {
  constructor(props) {
    super(props);
    const {navigation, currentProblem} = props;

    Orientation.unlockAllOrientations();
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.openModal();
      return true;
    });

    this.state = {
      selectedTheme: tomorrow,
      spinner: true,
      problemText: '',
      solutionText: '',
      modalVisible: false,
      clipboardModalVisible: false,
      learned: currentProblem.learned,
    };
    let backButton = require('../images/Back.png');
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            if (!this.state.learned) {
              this.setState({modalVisible: true});
            } else {
              navigation.goBack();
            }
          }}>
          <Image
            style={{
              marginLeft: 28 * width,
              width: width * 19,
              height: height * 16.8,
            }}
            source={backButton}
          />
        </TouchableOpacity>
      ),
    });
    const {status} = this.props;
    rewarded.requestNonPersonalizedAdsOnly = status;
    this.eventListener = rewarded.onAdEvent((type, error, reward) => {
      if (type === RewardedAdEventType.LOADED) {
        this.setState({showRewarded: true});
        console.log('loaded');
      }
      if (type === RewardedAdEventType.EARNED_REWARD) {
        const {solutionText} = this.state;
        console.log('User earned reward of ', reward);
        this.setState({
          clipboardModalVisible: true,
        });
        this.writeToClipboard(solutionText);
      }
      if (!rewarded.loaded) {
        rewarded.load();
      }
    });

    rewarded.load();
    console.log(rewarded);
  }

  openModal = () => {
    const {currentProblem, navigation} = this.props;
    if (!currentProblem.learned) {
      this.setState({modalVisible: true});
    } else {
      navigation.goBack();
    }
  };

  componentDidMount() {
    const {currentProblem} = this.props;
    const {text, solution} = currentProblem;
    this.setState({spinner: true});
    Promise.all([
      fetch(text).then(problemText => problemText.text()),
      fetch(solution).then(solutionText => solutionText.text()),
    ]).then(([problemText, solutionText]) => {
      this.setState({
        problemText,
        solutionText,
        spinner: false,
      });
    });
  }

  themes = [
    {value: tomorrow, label: 'Tomorrow', color: '#B15322'},
    {value: duotoneForest, label: 'Duotone Forest', color: '#97A656'},
    {value: duotoneEarth, label: 'Duotone Earth', color: '#8F7A37'},
    {value: okaidia, label: 'Okaidia', color: '#477880'},
    {value: atomDark, label: 'Atom Dark', color: '#1F8596'},
    {value: duotoneDark, label: 'Duotone Dark', color: '#564E75'},
    {value: twilight, label: 'Twilight', color: 'black'},
    {value: dark, label: 'Dark', color: 'black'},
    {value: prism, label: 'Prism', color: '#E24B71'},
    {value: vs, label: 'Visual Studio', color: '#343286'},
    {value: duotoneLight, label: 'Duotone Light', color: '#8289A6'},
  ];

  markAsLearned = async () => {
    const {
      currentProblem,
      user,
      navigation,
      addToLearnedProblemIds,
    } = this.props;
    const {id} = currentProblem;
    const {uid} = user;
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
      this.setState({clipboardModalVisible: false});
    }, 2500);
  };

  componentWillUnmount() {
    const {navigation} = this.props;

    Orientation.lockToPortrait();
    BackHandler.removeEventListener('hardwareBackPress', () => {
      this.openModal();
      return true;
    });
    BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.canGoBack() ? navigation.goBack() : BackHandler.exitApp();
      return true;
    });
  }

  lastPressedMiliseconds;
  copyCode = () => {
    let currentMs = new Date().getMilliseconds();
    if (Math.abs(this.lastPressedMiliseconds - currentMs) < 200) {
      rewarded.show();
    }
    this.lastPressedMiliseconds = currentMs;
  };

  render() {
    const {spinner} = this.state;
    const {
      problemText,
      solutionText,
      selectedTheme,
      modalVisible,
      clipboardModalVisible,
    } = this.state;
    const {navigation} = this.props;

    return (
      <View style={styles.container}>
        {spinner ? (
          <ActivityIndicator size="large" color="#051B27" />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Modal
              isVisible={clipboardModalVisible}
              onBackdropPress={() =>
                this.setState({clipboardModalVisible: false})
              }>
              <View style={styles.clipboardView}>
                <View style={styles.clipboardModal}>
                  <Text>Code copied to the clipboard!</Text>
                </View>
              </View>
            </Modal>
            <View style={styles.textContainer}>
              <Text
                key={'problemText'}
                style={{fontSize: 16, fontFamily: 'roboto', margin: 6 * width}}>
                {problemText}
              </Text>
            </View>
            <View style={styles.pickerView}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.doubleTapText}>
                  Double tap code for copy
                </Text>
                <Image
                  style={styles.downArrow}
                  source={require('../images/Down.png')}
                />
              </View>
              <Picker
                mode="dropdown"
                selectedValue={selectedTheme}
                style={styles.picker}
                onValueChange={value => {
                  this.setState({selectedTheme: value});
                }}>
                {this.themes.map(theme => (
                  <Picker.Item
                    key={theme.label}
                    label={theme.label}
                    value={theme.value}
                    color={theme.color}
                  />
                ))}
              </Picker>
            </View>
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
                isVisible={modalVisible}
                onBackdropPress={() => this.setState({modalVisible: false})}>
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
    marginHorizontal: 21 * width,
    borderRadius: 5 * width,
    marginTop: 21 * height,
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
  picker: {
    height: 30 * height,
    width: 140 * width,
    alignSelf: 'flex-end',
    marginRight: 22 * width,
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
  doubleTapText: {
    fontSize: 12 * height,
    color: '#817D7D',
    fontFamily: 'roboto',
    alignSelf: 'center',
    marginLeft: 22 * width,
  },
  pickerView: {
    marginTop: 5 * height,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  downArrow: {
    width: width * 8,
    height: height * 10,
    alignSelf: 'center',
    marginLeft: 3 * width,
    marginTop: 3 * height,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  const {currentProblem} = state.problems;
  const {user} = state;
  const {status} = state.consent;
  return {
    currentProblem,
    user,
    status,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    addToLearnedProblemIds: problemId =>
      dispatch(addToLearnedProblemIdsAction(problemId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProblemSheet);

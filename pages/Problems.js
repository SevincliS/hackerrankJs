import React from 'react';
import db from '@react-native-firebase/database';
import {connect} from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,TouchableHighlight
} from 'react-native';
import Modal from 'react-native-modal';

import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import {setCurrentProblem, removeFromLearnedProblemIds} from '../redux/actions/problemsActions';

import {BannerAd, BannerAdSize, TestIds} from '@react-native-firebase/admob';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-6543358689178377~8698272277';

const width = parseInt(Dimensions.get('screen').width) / 360;
const height = parseInt(Dimensions.get('screen').height) / 640;

class Problems extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = props;
    this.state = {
      longPressedProblemId:'',
      isLoaded: false,
      problems: [],
    };
    backButton = require('../images/Back.png');
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
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
  }

  componentDidMount() {
    this.loadProblems();
  }

  componentDidUpdate(prevProps) {
    const {learnedProblemIds} = this.props;
    console.log('problems updated');
    if (learnedProblemIds.length != prevProps.learnedProblemIds.length) {
      this.loadProblems();
    }
  }

  loadProblems = () => {
    const {currentProblemType, learnedProblemIds} = this.props;
    db()
      .ref(`problems/${currentProblemType}`)
      .once('value')
      .then(problems => {
        let stateProblems = [];
        let problemCount = Object.entries(problems.val()).length;
        for (let i = 0; i < problemCount; i++) {
          stateProblems.push({
            difficulty: 'Easy',
            difficultyPoint: 10,
            name: '',
            learned: false,
          });
        }
        this.setState({problemCount, problems: stateProblems}, () => {
          Object.entries(problems.val()).forEach(([id, value], i) => {
            if (learnedProblemIds.includes(id)) {
              this.setState(prevState => ({
                problems: [
                  ...prevState.problems.slice(0, i),
                  {...value, learned: true},
                  ...prevState.problems.slice(i + 1),
                ],
              }));
            } else {
              this.setState(prevState => ({
                problems: [
                  ...prevState.problems.slice(0, i),
                  {...value, learned: false},
                  ...prevState.problems.slice(i + 1),
                ],
              }));
            }
          });
        });
      });
  };

  openProblemPage = problem => {
    const {setCurrentProblem} = this.props;
    setCurrentProblem(problem);
    this.props.navigation.navigate('ProblemSheet');
  };
  markAsUnLearned = async () => {
    const {
      user,
      removeFromLearnedProblemIds,
    } = this.props;
    const id = this.state.longPressedProblemId;
    const {uid} = user;
    let updates = {};
    removeFromLearnedProblemIds(id);
    await db()
      .ref(`users/${uid}/learnedProblems/${id}`).remove()
    this.setState({modalVisible:false})
  };

  getEasyCss = learned => {
    if (!learned) {
      return 'unLearnedEasy';
    } else {
      return 'easy';
    }
  };
  render() {
    const {problems, problemCount,modalVisible} = this.state;
    const {status} = this.props;
    return (
      <ScrollView horizontal={false}>
        {problems.map((problem, index) => {
          let {difficulty, difficultyPoint, name, learned,id} = problem;
          let activeStyle = learned ? learnedStyle : unLearnedStyle;
          difficulty = difficulty.toLowerCase();
          return (
            <>
              <TouchableOpacity
                onLongPress={() => learned ? this.setState({modalVisible: true,longPressedProblemId:id}): null}
                onPress={() => this.openProblemPage(problem)}
                key={index}
                style={styles.container}>
                  <Modal
                isVisible={modalVisible}
                onBackdropPress={() => this.setState({modalVisible: false})}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>
                      Do you want to mark this problem as "UnLearned" ?
                    </Text>
                    <View style={styles.buttons}>
                      <TouchableHighlight
                        underlayColor="#1BA94C"
                        style={styles.yesButton}
                        onPress={() => {
                          this.markAsUnLearned();
                        }}>
                        <Text style={styles.yesText}>YES</Text>
                      </TouchableHighlight>
                      <TouchableHighlight
                        underlayColor="#D50D20"
                        style={styles.noButton}
                        onPress={() => this.setState({modalVisible: false})}>
                        <Text style={styles.noText}>NO</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </View>
              </Modal>
                <ShimmerPlaceHolder
                  style={styles.shimmerProblems}
                  autoRun
                  visible={name != ''}>
                  <View style={activeStyle.card}>
                    <View style={styles.texts}>
                      <Text style={activeStyle.textName}>{name}</Text>
                      <View style={styles.description}>
                        <Text
                          style={{
                            ...activeStyle.textDiff,
                            ...styles[
                              difficulty == 'easy'
                                ? this.getEasyCss(learned)
                                : difficulty == 'medium'
                                ? 'medium'
                                : 'hard'
                            ],
                          }}>
                          {problem.difficulty}
                        </Text>
                        <Text style={activeStyle.textProbDiff}>
                          {' '}
                          , Problem Difficulty: {difficultyPoint}
                        </Text>
                      </View>
                    </View>
                    <View style={activeStyle.learnCont}>
                      <Text style={activeStyle.learnText}>
                        {learned ? 'Learned' : 'Learn it !'}
                      </Text>
                    </View>
                  </View>
                </ShimmerPlaceHolder>
              </TouchableOpacity>
              {(index + 1)%5 == 0 ? (
                <View style={{marginTop: 10 * height,marginBottom:3*height}}>
                  <BannerAd
                    unitId={adUnitId}
                    size={BannerAdSize.SMART_BANNER}
                    requestOptions={{
                      requestNonPersonalizedAdsOnly: status,
                    }}
                  />
                </View>
              ) : null}
            </>
          );
        })}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shimmerProblems: {
    borderWidth: 0.2 * width,
    marginTop: 10 * height,
    marginBottom:3*height,
    borderRadius: 7 * width,
    height: 65 * height,
    width: 313 * width,
  },

  texts: {
    marginLeft: 13 * width,
  },

  description: {
    flexDirection: 'row',
  },

  easy: {
    color: '#fff',
  },
  unLearnedEasy: {
    color: '#1BA94C',
  },
  medium: {
    color: '#C24600',
  },
  hard: {
    color: '#FF0404',
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const learnedStyle = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 10 * height,
    marginBottom:3*height,
    backgroundColor: '#1BA94C',
    borderColor: '#000',
    borderWidth: 0.5 * width,
    borderRadius: 7 * width,
    height: 65 * height,
    width: 313 * width,
  },

  textName: {
    color: '#fff',
    fontSize: 20 * width,
  },

  textDiff: {
    color: '#fff',
    fontSize: 10 * width,
  },

  textProbDiff: {
    color: '#fff',
    fontSize: 10 * width,
  },

  learnCont: {
    marginRight: 14 * width,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5 * width,
    borderRadius: 7 * width,
    borderColor: '#fff',
    width: 82 * width,
    height: 27 * height,
  },

  learnText: {
    fontSize: 16 * width,
    fontFamily: 'roboto',
    color: '#fff',
  },
});

const unLearnedStyle = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 10 * height,
    marginBottom:3*height,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 0.5 * width,
    borderRadius: 7 * width,
    height: 65 * height,
    width: 313 * width,
  },

  textName: {
    fontFamily: 'roboto',
    color: '#000',
    fontSize: 20 * width,
  },

  textDiff: {
    fontFamily: 'roboto',
    color: '#000',
    fontSize: 10 * width,
  },

  textProbDiff: {
    fontFamily: 'roboto',
    color: '#000',
    fontSize: 10 * width,
  },

  learnCont: {
    marginRight: 14 * width,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5 * width,
    borderRadius: 7 * width,
    borderColor: '#1BA94C',
    width: 82 * width,
    height: 27 * height,
  },

  learnText: {
    fontSize: 16 * width,
    fontFamily: 'roboto',
    color: '#1BA94C',
  },
  
});

mapStateToProps = state => {
  const {problems, currentProblemType, learnedProblemIds} = state.problems;
  const {user} = state
  const {status} = state.consent;
  return {
    problems,
    currentProblemType,
    learnedProblemIds,
    status,
    user
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setCurrentProblem: problem => dispatch(setCurrentProblem(problem)),
    removeFromLearnedProblemIds: problemId => dispatch(removeFromLearnedProblemIds(problemId)) 
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Problems);

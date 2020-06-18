import React from 'react';
import db from '@react-native-firebase/database';
import { connect } from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import { setCurrentProblem } from '../redux/actions/problemsActions';

const width = parseInt(Dimensions.get('screen').width) / 360;
const height = parseInt(Dimensions.get('screen').height) / 640;

class Problems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      problems: [],
    };
  }

  componentDidMount() {
    this.loadProblems();
  }

  componentDidUpdate(prevProps) {
    const { learnedProblemIds } = this.props;

    if (learnedProblemIds.length != prevProps.learnedProblemIds.length) {
      this.loadProblems()
    }
  }

  loadProblems = () => {
    const { currentProblemType, learnedProblemIds } = this.props;
    db()
      .ref(`problems/${currentProblemType}`)
      .once('value')
      .then(problems => {
        let stateProblems = [];
        let problemCount = Object.entries(problems.val()).length
        for (let i = 0; i < problemCount; i++) {
          stateProblems.push({
            difficulty: "Easy",
            difficultyPoint: 10,
            name: "", learned: false,
          })
        }
        this.setState({ problemCount, problems: stateProblems }, () => {
            Object.entries(problems.val()).forEach(([id, value], i) => {
              if (learnedProblemIds.includes(id)) {
                this.setState(prevState => ({
                  problems:
                    [...prevState.problems.slice(0, i),
                    { ...value, learned: true },
                    ...prevState.problems.slice(i + 1)]
                }))
              } else {
                this.setState(prevState => ({
                  problems:
                    [...prevState.problems.slice(0, i),
                    { ...value, learned: false },
                    ...prevState.problems.slice(i + 1)]
                }))
              }
            });
        })

      });
  };

  openProblemPage = problem => {
    const { setCurrentProblem } = this.props;
    setCurrentProblem(problem);    
    this.props.navigation.navigate('ProblemSheet');
    const pushAction = StackActions.push('LogIn');

  };

  render() {
    const { problems, problemCount } = this.state;
    return (
      <ScrollView horizontal={false}>
        {problems.map((problem, index) => {
          let { difficulty, difficultyPoint, name, learned } = problem;
          let activeStyle = learned ? learnedStyle : unLearnedStyle;
          difficulty = difficulty.toLowerCase();
          return (

            <TouchableOpacity
              onPress={() => this.openProblemPage(problem)}
              key={index}
              style={styles.container}>
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
                            ? 'easy'
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
    marginTop: 20 * width,
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
  medium: {
    color: '#C24600',
  },
  hard: {
    color: '#FF0404',
  },
});

const learnedStyle = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 20 * height,
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
    fontWeight: 'bold',
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
    borderWidth: 1 * width,
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
    marginTop: 20 * height,
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
    fontWeight: 'bold',
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
    borderWidth: 1,
    borderRadius: 7,
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
  const { problems, currentProblemType, learnedProblemIds } = state.problems;
  return {
    problems,
    currentProblemType,
    learnedProblemIds,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setCurrentProblem: problem => dispatch(setCurrentProblem(problem)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Problems);

import React from 'react';
import db from '@react-native-firebase/database'
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';


const width = parseInt(Dimensions.get('screen').width) / 360
const height = parseInt(Dimensions.get('screen').height) / 640

class Problems extends React.Component {

  constructor(props) {
    super(props);
    //console.log(props.currentProblemType, props.learnedProblemIds);
    this.state = {
      problems: [],
    }
  }

  componentDidMount() {
    this.loadProblems();
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  loadProblems = () => {
    const { currentProblemType, learnedProblemIds } = this.props;
    db().ref(`problems/${currentProblemType}`).once('value').then(problems => {
      let stateProblems=[];
      Object.entries(problems.val()).forEach(([id, value]) => {
        if (learnedProblemIds.includes(id)) {
          stateProblems.push({ ...value, learned: true })
        }
        else {
          stateProblems.push({ ...value, learned: false })
        }
      })
      this.setState({ problems: stateProblems })
    })
  }

  openProblemPage = (problem) => {
    console.log(problem);
  }

  render() {
    const { problems } = this.state;
    return (

      <ScrollView horizontal={false}>
        {problems.map((problem, index) => {
          let { difficulty, difficultyPoint, name, learned } = problem;
          let activeStyle = learned ? learnedStyle : unLearnedStyle;
          difficulty = difficulty.toLowerCase();
          return (
            <TouchableOpacity
              onPress={() => this.openProblemPage(problem)}
              key={index} style={styles.container}>
              <View style={activeStyle.card}>
                <View style={styles.texts}>
                  <Text style={activeStyle.textName}>{name}</Text>
                  <View style={styles.description}>
                    <Text style={{
                      ...activeStyle.textDiff,
                      ...styles[difficulty == 'easy' ? 'easy' : difficulty == 'medium' ? 'medium' : 'hard']
                    }}>
                      {problem.difficulty}
                    </Text>
                    <Text style={activeStyle.textProbDiff}> , Problem Difficulty: {difficultyPoint}
                    </Text>
                  </View>
                </View>
                <View style={activeStyle.learnCont}>
                  <Text style={activeStyle.learnText}>
                    {learned ? 'Learned' : 'Learn It'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  texts: {
    marginLeft: 13 * width,
  },

  description: {
    flexDirection: 'row',
  },

  easy: {
    color: '#fff'
  },
  medium: {
    color: '#C24600'
  },
  hard: {
    color: '#FF0404'
  },
});

const learnedStyle = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: '#1BA94C',
    borderColor: '#000',
    borderWidth: 0.5,
    borderRadius: 7,
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
    borderWidth: 1,
    borderRadius: 7,
    borderColor: '#fff',
    width: 82 * width,
    height: 27 * height,
  },

  learnText: {
    fontSize: 16 * width,
    fontFamily: 'roboto',
    color: '#fff'
  },
});

const unLearnedStyle = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 0.5,
    borderRadius: 7,
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
    color: '#1BA94C'
  },
})



mapStateToProps = state => {
  const { problems, currentProblemType, learnedProblemIds } = state.problems;
  return {
    problems,
    currentProblemType,
    learnedProblemIds,
  }
}

export default connect(mapStateToProps, null)(Problems);
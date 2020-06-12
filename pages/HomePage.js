import React, { Component } from 'react'
import auth from '@react-native-firebase/auth';
import db from '@react-native-firebase/database';
import { connect } from 'react-redux';
import {
  View, TouchableOpacity, FlatList, Dimensions, StyleSheet
} from 'react-native';

import {
  setLearnedProblemIds as setLearnedProblemIdsAction,
  setCurrentProblemType as setCurrentProblemTypeAction
} from '../redux/actions/problemsActions';
import HomePageCard from '../components/custom/HomePageCard';
import LogOutButton from '../components/custom/LogOutButton';
import { resetUser as resetUserAction } from '../redux/actions/userActions';


const height = Dimensions.get('screen').height / 640;

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      problemData: {},
      matchedProblemData: {},
    };

    props.navigation.setOptions({
      headerRight: () => (
        <LogOutButton onPress={() => {
          props.resetUser();
          props.navigation.navigate('LogIn');
        }} />
      ),
    });
  }

  componentDidMount() {
    this.loadProblemData();
  }

  loadProblemData = () => {
    const { user } = this.props;

    const problemTypes = [
      'practice', 'interview', 'getMoreCertificates', 'javascript', 'machineLearning', 'certificate'
    ];

    db().ref(`users/${user.uid}/learnedProblems`).once('value').then(problems => {
      let learnedProblems = Object.keys(problems.val());
      console.log(problems);
      problemTypes.forEach(problemType => {
        db().ref(`problems/${problemType}`).once('value').then(problems => {
          let newObj = {}
          newObj[problemType] = {
            learnedProblems,
            matchedCount: Object.keys(problems.val()).filter(key => learnedProblems.includes(key)).length,
            totalCount: Object.keys(problems.val()).length,
            type: problemType,
          }
          this.setState(prevState => ({
            problemData: { ...prevState.problemData, ...newObj }
          }))

        }).catch(err => console.log(err))
      })
    }).catch(err => console.log(err))
  }

  openProblemsPage = (item) => {
    const { navigation, setCurrentProblemType, setLearnedProblemIds } = this.props;
    setLearnedProblemIds(item.learnedProblems);
    setCurrentProblemType(item.type);
    navigation.navigate('Problems');
  }

  render() {
    let { problemData } = this.state;

    problemData = Object.values(problemData);


    return (
      <View style={{ paddingBottom: height * 10 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={problemData}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.openProblemsPage(item)}>
              <HomePageCard item={item}></HomePageCard>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.type}
        />
      </View>
    );
  }
}


const mapStateToProps = (state) => {
  const { user, problems } = state
  return { user, problems };
}

const mapDispatchToProps = dispatch => {
  return {
    setLearnedProblemIds: (ids) => dispatch(setLearnedProblemIdsAction(ids)),
    setCurrentProblemType: (problemType) => dispatch(setCurrentProblemTypeAction(problemType)),
    resetUser: () => dispatch(resetUserAction()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);







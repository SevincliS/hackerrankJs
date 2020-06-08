import React, { Component } from 'react'
import auth from '@react-native-firebase/auth';
import db from '@react-native-firebase/database';
import { connect } from 'react-redux';
import {
  View,TouchableOpacity,FlatList,ScrollView,Text,StyleSheet
} from 'react-native';

import { setProblems as setProblemsAction} from '../redux/reducers/problemsReducer';
import HomePageCard from '../components/custom/HomePageCard';
import LogOutButton from '../components/custom/LogOutButton';
import { resetUser as resetUserAction } from '../redux/actions/userActions'; 

class HomePage extends Component{
  constructor(props){
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

  componentDidMount (){
    this.loadProblemData();
  }

  loadProblemData =  () => {
    const  { user }  = this.props;

    const problemTypes = [
      'practice','interview', 'getMoreCertificates','javascript','machineLearning', 'certificate'
    ];

    db().ref(`users/${user.uid}/learnedProblems`).once('value').then(problems => {
      let learnedProblems = Object.keys(problems.val());
      console.log(problems);
      problemTypes.forEach(problemType => {
        db().ref(`problems/${problemType}`).once('value').then(problems => {
          let newObj = {}
          newObj[problemType] = {
            matchedCount: Object.keys(problems.val()).filter(key => learnedProblems.includes(key)).length,
            totalCount: Object.keys(problems.val()).length,
            type: problemType, 
          } 
          this.setState(prevState => ({
            problemData: {...prevState.problemData, ...newObj}
          }))

        }).catch(err => console.log(err))
      }) 
    }).catch(err => console.log(err))
  }
    
  render(){
    let { problemData } = this.state;
    
    problemData = Object.values(problemData);

    
    return(
      <View>
        <FlatList
        data={problemData}
        renderItem={({ item }) =>(
          <HomePageCard item = {item}></HomePageCard>
        )}
        keyExtractor={item => item.id}
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
    setProblems: (problems) => dispatch(setProblemsAction(problems)),
    resetUser: () => dispatch(resetUserAction()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);


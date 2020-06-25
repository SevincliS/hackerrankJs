import React, {Component} from 'react';
import db from '@react-native-firebase/database';
import {connect} from 'react-redux';
import {View, TouchableOpacity, FlatList, Dimensions} from 'react-native';

import {
  setLearnedProblemIds as setLearnedProblemIdsAction,
  setCurrentProblemType as setCurrentProblemTypeAction,
} from '../redux/actions/problemsActions';
import HomePageCard from '../components/custom/HomePageCard';
import LogOutButton from '../components/custom/LogOutButton';
import {resetUser as resetUserAction} from '../redux/actions/userActions';
import {CommonActions} from '@react-navigation/native';
import {AdsConsent, AdsConsentStatus} from '@react-native-firebase/admob';
import {setConsent as setConsentAction} from '../redux/actions/consentAction';

const height = Dimensions.get('screen').height / 640;

class HomePage extends Component {
  constructor(props) {
    super(props);
    let problemTypes = [
      'practice',
      'interview',
      'getMoreCertificates',
      'javascript',
      'machineLearning',
      'certificate',
    ];
    let problemData = [];
    problemTypes.forEach(type => {
      problemData.push({
        learnedProblems: [],
        type,
        progress: null,
        progressText: '',
        progressPercentageText: '',
      });
    });
    this.state = {
      problemData,
      matchedProblemData: {},
      problemTypes,
    };

    props.navigation.setOptions({
      headerRight: () => (
        <LogOutButton
          onPress={() => {
            props.resetUser();
            props.navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{name: 'LogIn'}],
              }),
            );
          }}
        />
      ),
      headerLeft: () => null,
    });
  }

  componentDidMount = async () => {
    const {navigation} = this.props;
    this._unsubscribe = navigation.addListener('focus', () => {
      this.loadProblemData();
    });

    const consentInfo = await AdsConsent.requestInfoUpdate([
      'pub-6543358689178377',
    ]);
    const {setConsent} = this.props;
    if (consentInfo.isRequestLocationInEeaOrUnknown) {
      const status = await AdsConsent.getStatus();
      if (status === AdsConsentStatus.UNKNOWN) {
        setConsent({status: false});
      } else if (status === AdsConsentStatus.PERSONALIZED) {
        setConsent({status: false});
      } else if (status === AdsConsentStatus.NON_PERSONALIZED) {
        setConsent({status: true});
      }
    }
  };

  componentDidUpdate() {
    console.log('HomePage updated');
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  loadProblemData = () => {
    const {user} = this.props;
    const {problemTypes} = this.state;

    db()
      .ref(`users/${user.uid}/learnedProblems`)
      .once('value')
      .then(_problems => {
        let learnedProblems = Object.keys(_problems.val());
        problemTypes.forEach((problemType, i) => {
          db()
            .ref(`problems/${problemType}`)
            .once('value')
            .then(problems => {
              let newObj = {};
              let matchedCount = Object.keys(problems.val()).filter(key =>
                learnedProblems.includes(key),
              ).length;
              let totalCount = Object.keys(problems.val()).length;
              newObj = {
                learnedProblems,
                type: problemType,
                progress: matchedCount / totalCount,
                progressText: `${matchedCount}/${totalCount} challenges solved.`,
                progressPercentageText: matchedCount
                  ? `${Math.floor((matchedCount / totalCount) * 100)}%`
                  : '0%',
              };

              this.setState(prevState => ({
                problemData: [
                  ...prevState.problemData.slice(0, i),
                  newObj,
                  ...prevState.problemData.slice(i + 1),
                ],
              }));
            })
            .catch(err => console.log(err));
        });
      })
      .catch(err => console.log(err));
  };

  openProblemsPage = item => {
    const {
      navigation,
      setCurrentProblemType,
      setLearnedProblemIds,
    } = this.props;
    setLearnedProblemIds(item.learnedProblems);
    setCurrentProblemType(item.type);
    navigation.navigate('Problems');
  };

  render() {
    let {problemData} = this.state;

    return (
      <View style={{paddingBottom: height * 10}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={problemData}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => this.openProblemsPage(item)}>
              <HomePageCard item={item} />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.type}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const {user, problems} = state;
  return {user, problems};
};

const mapDispatchToProps = dispatch => {
  return {
    setLearnedProblemIds: ids => dispatch(setLearnedProblemIdsAction(ids)),
    setCurrentProblemType: problemType =>
      dispatch(setCurrentProblemTypeAction(problemType)),
    resetUser: () => dispatch(resetUserAction()),
    setConsent: consent => dispatch(setConsentAction(consent)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePage);

import React, {Component} from 'react';
import {Bar} from 'react-native-progress';
import {
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { RawButton } from 'react-native-gesture-handler';

const width = parseInt(Dimensions.get('screen').width) / 360;
const height = parseInt(Dimensions.get('screen').height) / 640;

class HomePageCard extends Component {
  constructor(props) {
    super(props);
    const {item} = props;

    const {matchedCount, totalCount} = item;
    console.log(`${Math.floor(matchedCount / totalCount) * 100}%`);

    this.state = {
      progress: matchedCount / totalCount,
      progressText: `${matchedCount}/${totalCount} challenges solved.`,
      progressPercentageText: matchedCount
        ? `${Math.floor(matchedCount / totalCount) * 100}%`
        : '0%',
    };
  }
  componentDidMount() {
    /** *
     const problemTypes = [
      'practice','interview', 'getMoreCertificates','javascript','machineLearning', 'certificate'
    ]; 
     */

    let title, color;
    switch (this.props.item.type) {
      case 'practice':
        (title = 'Practice Your Problem Solving Skills'), (color = '#204051');
        break;
      case 'interview':
        (title = 'Interview Preparation Kit'), (color = '#3B6978');
        break;
      case 'getMoreCertificates':
        (title = 'Get More Certificates'), (color = '#84A9AC');
        break;
      case 'javascript':
        (title = 'JavaScript'), (color = '#CAE8D5');
        break;
      case 'machineLearning':
        (title = 'Machine Learning'), (color = '#204051');
        break;
      case 'certificate':
        (title = 'Certificate'), (color = '#3B6978');
        break;
      default:
        (title = 'Unknown Type'), (color = '#3B6978');
    }

    this.setState({title, color});
  }

  render() {
    const {item} = this.props;
    const {
      progress,
      progressText,
      title,
      color,
      progressPercentageText,
    } = this.state;
    return (
      <View style={{...styles.cardView, ...{backgroundColor: color}}}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={{...styles.barView, ...{flexDirection: 'row'}}}>
          <Bar
            style={styles.bar}
            color={'#051B27'}
            height={10 * height}
            progress={progress}
          />
          <View style={styles.barTextView}>
            <Text style={styles.barText}>{progressPercentageText}</Text>
          </View>
        </View>
        <View style={styles.progressView}>
          <Text style={styles.progressText}>{progressText}</Text>
        </View>
      </View>
    );
  }
}
export default HomePageCard;

const styles = StyleSheet.create({
  cardView: {
    flex:1,
    width: 313 * width,
    height: 145 * height,
    borderTopStartRadius: 15 * width,
    borderTopEndRadius: 15 * width,
    borderBottomStartRadius: 15 * width,
    borderBottomEndRadius: 15 * width,
    marginTop: 20 * height,
    marginHorizontal: 23 * width,
  },
  titleView: {
    height:46*height,
    width: 230 * width,
    marginTop: 21 * height,
    marginBottom:27*height,
    marginLeft: 12 * width,
  },
  titleText: {
    fontSize: 20 * height,
    fontFamily: 'roboto',
    color: '#FFFFFF',
  },
  barView: {
    marginLeft: 12 * width,
    marginBottom:7*height
  },
  barTextView: {
    marginLeft:6*width,
    marginBottom:3*height
  },
  barText: {
    fontFamily: 'roboto',
    fontSize: 12 * width,
    color:'#FFFFFF'
  },
  bar:{
    height:10*height,
    width:256*width,
    alignSelf:'center'

  },
  progressView: {
    height:14*height,
    width:230*width,
    marginLeft:12*width,
    marginBottom:12*height

  },
  progressText: {
    fontSize:12*height,
    color:'#FFFFFF',
    fontFamily:'roboto'
  },
});

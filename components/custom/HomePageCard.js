/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/no-did-mount-set-state */
import React, {Component} from 'react';
import {Bar} from 'react-native-progress';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

const width = parseInt(Dimensions.get('screen').width, 10) / 360;
const height = parseInt(Dimensions.get('screen').height, 10) / 640;

class HomePageCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: null,
      progressText: '',
      progressPercentageText: '',
      title: '',
    };
  }

  componentDidUpdate() {
    const {progress, progressText, progressPercentageText} = this.props.item;
    if (
      progress !== this.state.progress ||
      progressText !== this.state.progressText ||
      progressPercentageText !== this.state.progressPercentageText
    ) {
      this.setState({
        progress,
        progressText,
        progressPercentageText,
      });
    }
  }
  componentDidMount() {
    let title, color;
    switch (this.props.item.type) {
      case 'practice':
        title = 'Practice Your Problem Solving Skills';
        color = '#204051';
        break;
      case 'interview':
        title = 'Interview Preparation Kit';
        color = '#3B6978';
        break;
      case 'getMoreCertificates':
        title = 'Get More Certificates';
        color = '#84A9AC';
        break;
      case '10DaysJS':
        title = '10 Days of JavaScript';
        color = '#CAE8D5';
        break;
      case 'machineLearning':
        title = 'Machine Learning';
        color = '#204051';
        break;
      case 'certificate':
        title = 'Certificate';
        color = '#3B6978';
        break;
      default:
        title = 'Unknown Type';
        color = '#3B6978';
    }
    this.setState({title, color});
  }

  render() {
    const {
      progress,
      progressText,
      title,
      color,
      progressPercentageText,
    } = this.state;
    return (
      <ShimmerPlaceHolder
        style={styles.cardView}
        autoRun
        visible={progressText !== '' && progress !== null}>
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
              width={256 * width}
            />
            <View style={styles.barTextView}>
              <Text style={styles.barText}>{progressPercentageText}</Text>
            </View>
          </View>
          <View style={styles.progressView}>
            <Text style={styles.progressText}>{progressText}</Text>
          </View>
        </View>
      </ShimmerPlaceHolder>
    );
  }
}
export default HomePageCard;

const styles = StyleSheet.create({
  cardView: {
    flex: 1,
    width: 313 * width,
    height: 145 * height,
    borderTopStartRadius: 15 * width,
    borderTopEndRadius: 15 * width,
    borderBottomStartRadius: 15 * width,
    borderBottomEndRadius: 15 * width,
    marginTop: 20 * height,
    marginHorizontal: 23 * width,
  },
  titleShimmer: {
    height: 23 * height,
    width: 230 * width,
    marginTop: 21 * height,
    marginBottom: 27 * height,
    marginLeft: 12 * width,
  },
  titleView: {
    height: 46 * height,
    width: 230 * width,
    marginTop: 21 * height,
    marginBottom: 27 * height,
    marginLeft: 12 * width,
  },
  titleText: {
    fontSize: 20 * height,
    fontFamily: 'roboto',
    color: '#FFFFFF',
  },
  barShimmer: {
    height: 14 * width,
    width: (width - 19) * width,
    marginHorizontal: 12 * width,
    marginBottom: 7 * height,
  },
  barView: {
    marginLeft: 12 * width,
    marginBottom: 7 * height,
  },
  barTextView: {
    marginLeft: 6 * width,
    marginBottom: 3 * height,
  },
  barText: {
    fontFamily: 'roboto',
    fontSize: 12 * width,
    color: '#FFFFFF',
  },
  bar: {
    height: 10 * height,
    width: 256 * width,
    alignSelf: 'center',
  },
  progressViewShimmer: {
    height: 14 * height,
    width: 230 * width,
    marginLeft: 12 * width,
    marginBottom: 12 * height,
  },
  progressView: {
    height: 14 * height,
    width: 230 * width,
    marginLeft: 12 * width,
    marginBottom: 12 * height,
  },
  progressText: {
    fontSize: 12 * height,
    color: '#FFFFFF',
    fontFamily: 'roboto',
  },
});

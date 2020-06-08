import {
    View,TouchableOpacity,FlatList,ScrollView,Text,StyleSheet,Image, Dimensions
  } from 'react-native';
import React, { Component } from 'react';

let width = parseInt(Dimensions.get('screen').width)/360;
let height = parseInt(Dimensions.get('screen').height)/640;
export default class LogOutButton extends Component{
    constructor(props) {
      super(props);
    }

    image = require('../../images/LogOutIcon.png');
    render() {
        return (
          <TouchableOpacity {...this.props}>
            <Image source={this.image} style = {styles.Icon}></Image>
          </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
Icon:{
    width:24*width,
    height:27*height,
    marginRight:15*width,
    marginTop:3*height
} 
}) 



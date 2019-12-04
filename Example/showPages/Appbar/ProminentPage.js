import React from 'react';
import {
  ToastAndroid,
  View,
  Image,
} from 'react-native';
import {
  Appbar,
  Text,
} from '@sdp.nd/material-js';

export default class ProminentAppbarPage extends React.Component {
  static navigationOptions = {
    header: null,
  }
  render() {
    const extraView = (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%'}}>
        <Image style={{width: 50, height: 50}} source={require('../../res/react-native.png')} />
        <Text style={{color: 'white'}}>这是自定义内容</Text>
      </View>
    );
    return (
      <Appbar.Prominent
        bgImg={require('../../res/night.png')}
        extraView={extraView}
      >
        <Appbar.NavigationItem
          onPress={() => this.props.navigation.goBack()}
        />
        <Appbar.Title
          title="Appbar title"
          subtitle="sub title"
          onPress={() => ToastAndroid.show('You clicked on the title', ToastAndroid.SHORT)}
        />
        <Appbar.ActionItem
          source="favorite"
          onPress={() => ToastAndroid.show('You clicked on the favorite icon', ToastAndroid.SHORT)}
        />
        <Appbar.ActionItem
          source="menu"
          onPress={() => ToastAndroid.show('You clicked on the menu icon', ToastAndroid.SHORT)}
        />
      </Appbar.Prominent>
    );
  }
}

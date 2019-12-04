import React from 'react';
import {
  ToastAndroid,
} from 'react-native';
import { Appbar } from '@sdp.nd/material-js';

export default class SampleAppbarPage extends React.Component {
  static navigationOptions = {
    header: null,
  }
  render() {
      return (
        <Appbar.Regular>
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
        </Appbar.Regular>
      );
  }
}

import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Button } from '@sdp.nd/material-js';

export default class AppbarPage extends React.Component {
  render() {
      return (
        <View style={styles.container}>
          <Button
            style={styles.button}
            title="Sample Appbar"
            onPress={() => this.props.navigation.navigate('Sample')}
          />
          <Button
            style={styles.button}
            title="Prominent Appbar"
            onPress={() => this.props.navigation.navigate('Prominent')}
          />
          <Button
            style={styles.button}
            title="Collapsing Appbar"
            onPress={() => this.props.navigation.navigate('Collapsing')}
          />
          <Button
            style={styles.button}
            title="Bottom Appbar"
            onPress={() => this.props.navigation.navigate('Bottom')}
          />
        </View>
      );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    button: {
        margin: 10,
    },
});

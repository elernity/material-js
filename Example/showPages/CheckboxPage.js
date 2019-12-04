import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Checkbox } from '@sdp.nd/material-js';

export default class CheckboxPage extends React.Component {
  state = {
    checked: false,
    disabledChecked: false,
    indeterminateChecked: 2,
  }
  render() {
    const {
      checked,
      disabledChecked,
      indeterminateChecked,
    } = this.state;
    checkStates = [Checkbox.STATES_CHECK, Checkbox.STATES_INDETERMINATE, Checkbox.STATES_UNCHECK];
    return (
      <View style={styles.container}>
        <Checkbox
          style={styles.checkbox}
          status={checked ? Checkbox.STATES_CHECK : Checkbox.STATES_UNCHECK}
          onPress={() => {this.setState({checked: !checked})}}
        />
        <Checkbox
          style={styles.checkbox}
          disabled={true}
          status={disabledChecked ? Checkbox.STATES_CHECK : Checkbox.STATES_UNCHECK}
          onPress={() => {this.setState({disabledChecked: !disabledChecked})}}
        />
        <Checkbox
          style={styles.checkbox}
          status={checkStates[indeterminateChecked % 3]}
          onPress={() => {this.setState({indeterminateChecked: indeterminateChecked + 1})}}
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
    checkbox: {
      margin: 10,
    },
});

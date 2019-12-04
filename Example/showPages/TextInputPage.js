import React from 'react';
import {
  StyleSheet,
  View,
  ToastAndroid,
} from 'react-native';
import {
  Button,
  TextInputFlat,
} from '@sdp.nd/material-js';

export default class TextInputPage extends React.Component {
  render() {
      return (
        <View style={styles.container}>
          <View style={[styles.item, {flexDirection: 'column', width: '100%'}]}>
            <TextInputFlat
              style={[styles.input, {flex: 0}]}
              placeholder="TextInput"
              ref="textInput"
            />

            <Button
              title="isFocused"
              style={[styles.button]}
              onPress={() => {
                ToastAndroid.show(`获取焦点：${this.refs.textInput.isFocused()}`, ToastAndroid.SHORT);
              }}
            />
            <View style={[styles.item]}>
              <Button
                title="clear"
                style={[styles.button]}
                onPress={() => {this.refs.textInput.clear()}}
              />
              <Button
                title="focus"
                style={[styles.button]}
                onPress={() => {this.refs.textInput.focus()}}
              />
              <Button
                title="blur"
                style={[styles.button]}
                onPress={() => {this.refs.textInput.blur()}}
              />
            </View>
          </View>
          <View style={styles.item}>
            <TextInputFlat
              style={styles.input}
              editable={false}
              placeholder="Uneditabled TextInput"
              ref="uneditabled"
            />
            <Button
              title="clear"
              style={styles.button}
              onPress={() => {this.refs.uneditabled.clear()}}
            />
          </View>
          <View style={styles.item}>
            <TextInputFlat
              style={styles.input}
              multiline={true}
              autoGrow={true}
              placeholder="Multiline TextInput"
              ref="multiline"
            />
            <Button
              title="clear"
              style={styles.button}
              onPress={() => {this.refs.multiline.clear()}}
            />
          </View>
        </View>
      );
  }
}
const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      backgroundColor: 'white',
      margin: 5,
    },
    input: {
      flex: 1,
      maxHeight: 120,
      margin: 5,
    },
    button: {
      margin: 5,
    },
});

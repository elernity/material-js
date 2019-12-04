import React from 'react';
import {
  StyleSheet,
  ToastAndroid,
  View,
  Animated,
  FlatList,
} from 'react-native';
import {
  Appbar,
  Text,
} from '@sdp.nd/material-js';

export default class CollapsingAppbarPage extends React.Component {
  static navigationOptions = {
    header: null,
  }
  render() {
    const listData = [];
    while(listData.length < 30) {
      listData.push({key: `第 ${listData.length} 项`});
    }

    const extraRender = (scrollY, scrollDistance) => {
      const imgRotate = scrollY.interpolate({
        inputRange: [0, scrollDistance],
        outputRange: ['0deg', '720deg'],
      });
      const imgOpacity = scrollY.interpolate({
        inputRange: [0, scrollDistance / 2, scrollDistance],
        outputRange: [1, 1, 0],
      });
      return (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Animated.Image
            source={require('../../res/react-native.png')}
            style={{
              width: 35,
              height: 35,
              bottom: 15,
              tintColor: 'white',
              transform: [
                {rotate: imgRotate}
              ],
              opacity: imgOpacity,
            }}
          />
        </View>
      );
    };
    return (
      <Appbar.Collapsing
        autoScroll={true}
        // overlayColor="red"
        // color="transparent"
        bgImg={require('../../res/night.png')}
        navigationItem={
          <Appbar.NavigationItem
            color="white"
            onPress={() => this.props.navigation.goBack()}
          />
        }
        actionItems={
          <View style={{flexDirection: 'row'}}>
            <Appbar.ActionItem
              color="white"
              source="insert-invitation"
              onPress={() => ToastAndroid.show('You clicked on the insert-invitation icon', ToastAndroid.SHORT)}
            />
            <Appbar.ActionItem
              color="white"
              source="menu"
              onPress={() => ToastAndroid.show('You clicked on the menu icon', ToastAndroid.SHORT)}
            />
          </View>
        }
        title="Appbar title"
        titleColor="white"
        extraRender={extraRender}
      >
        <FlatList
          data={listData}
          renderItem={
            ({item}) => 
              <Text style={styles.item} >
                {item.key}
              </Text>
          }
        />
      </Appbar.Collapsing>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
});

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
} from 'react-native';
import {createStackNavigator} from 'react-navigation';

const Comps = [
  {key: 'List'},
  {key: 'TextInput'},
  {key: 'Text'},
  {key: 'Button'},
  {key: 'Checkbox'},
  {key: 'Surface'},
  {key: 'Appbar'},
  {key: 'PopupWindow'},
  {key: 'DraggableGridView'},
];

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Demo',
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={Comps}
          renderItem={
            ({item}) => 
              <Text
                style={styles.item}
                onPress={() => this.props.navigation.navigate(item.key)}
              >
                {item.key}
              </Text>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
});

const MainNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    List: require('./showPages/ListPage').default,
    TextInput: require('./showPages/TextInputPage').default,
    Text: require('./showPages/TextPage').default,
    Button: require('./showPages/ButtonPage').default,
    Checkbox: require('./showPages/CheckboxPage').default,
    Surface: require('./showPages/SurfacePage').default,
    Appbar: require('./showPages/Appbar').default,
    Sample: require('./showPages/Appbar/SamplePage').default,
    Prominent: require('./showPages/Appbar/ProminentPage').default,
    Collapsing: require('./showPages/Appbar/CollapsingPage').default,
    Bottom: require('./showPages/Appbar/BottomPage').default,
    PopupWindow: require('./showPages/PopupPage').default,
    DraggableGridView: require('./showPages/DraggableGridViewPage').default,
  },
  {
    initialRouteName: 'Home',
  },
);

export default class App extends React.Component {
  render() {
    return <MainNavigator />;
  }
}

import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Easing,
} from 'react-native';
import {
  Button,
  IconButton,
  FAB,
  LightTheme,
} from '@sdp.nd/material-js';

export default class ButtonPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      animationFactor: new Animated.Value(0),
    };
  }

  render() {
    const primary = LightTheme.colors.primary;
    Animated.loop(Animated.timing(
      this.state.animationFactor,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }
    )).start();
    const imgRotate = this.state.animationFactor.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    const imgOpacity = this.state.animationFactor.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0, 1],
    });
    return (
      <View style={styles.container}>
        <View style={styles.item}>
          <Button
            title="Title Button"
            style={styles.button}
          />
          <Button
            title="Disabled Button"
            disabled={true}
            style={styles.button}
          />
        </View>
        <View style={styles.item}>
          <IconButton
            source="add-a-photo"
            color={primary}
            style={styles.button}
          />
          <IconButton
            source="add-a-photo"
            anotherSource="email"
            animated={true}
            color={primary}
            style={styles.button}
          />
          <IconButton
            source="add-a-photo"
            disabled={true}
            color={primary}
            style={styles.button}
          />
        </View>
        <View style={styles.item}>
          <FAB
            small={true}
            source="email"
            color="white"
            style={styles.button}
          />
          <FAB
            small={true}
            title="fab"
            source="email"
            color="white"
            style={[styles.button]}
          />
          <FAB
            small={true}
            source="email"
            color="white"
            disabled={true}
            style={[styles.button]}
          />
        </View>
        <View style={styles.item}>
          <Button style={styles.button}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Animated.Image
                source={require('../res/react-native.png')}
                style={{
                  width: 25,
                  height:25,
                  transform: [
                    {rotate: imgRotate}
                  ],
                  opacity: imgOpacity,
                }}
              />
              <Animated.Image
                source={require('../res/react-native.png')}
                style={{
                  width: 25,
                  height:25,
                  tintColor: 'white',
                  transform: [
                    {rotate: imgRotate}
                  ],
                  opacity: imgOpacity,
                }}
              />
            </View>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
      backgroundColor: 'white',
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 10,
    },
    button: {
      margin: 5,
    },
});

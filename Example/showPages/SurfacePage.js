import React from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';
import {
  Surface,
  Text,
  Title,
  Icon,
  IconButton,
  LightTheme,
} from '@sdp.nd/material-js';

export default class SurfacePage extends React.Component {
    render() {
        return (
          <View style={styles.container}>
            <Surface style={styles.surface}>
              <Text>
                OMG! This is a Surface Component! 🌹
              </Text>
            </Surface>
            <Surface style={[
              styles.surface,
              {
                width: 350,
                height: 350,
                padding: 0,
                paddingVertical: 8,
              }
            ]}>
              <View style={{
                flex: 1,
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 8,
              }}>
                <View style={{flexDirection: 'row'}}>
                  <Icon
                    source="explore"
                    size={35}
                    color={LightTheme.colors.primary}
                    style={{marginLeft: 20}}
                  />
                  <Title style={{marginLeft: 10}}>
                    Card 😁
                  </Title>
                </View>
                <IconButton
                  color={LightTheme.colors.primary}
                  source="menu"
                />
              </View>
              <Image style={{flex: 4, width: '100%'}} source={require('../res/night.png')}/>
              <View style={{
                flex: 2,
                width: '100%',
                paddingHorizontal: 8,
              }}>
                <Text>
                  OMG! This is a Surface Component! 🤩
                </Text>
                <View style={{
                  flexDirection: 'row',
                  width: '100%',
                  height: '80%',
                  alignItems: 'flex-end',
                }}>
                  <IconButton
                    color={LightTheme.colors.primary}
                    source="favorite"
                    style={{
                      marginLeft: 10,
                    }}
                  />
                  <IconButton
                    color={LightTheme.colors.primary}
                    source="share"
                    style={{
                      marginLeft: 5,
                    }}
                  />
                </View>
              </View>
            </Surface>
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
    surface: {
      margin: 10,
    },
});

import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  Text,
  Caption,
  Headline,
  Paragraph,
  Subheading,
  Title,
} from '@sdp.nd/material-js';

export default class TextPage extends React.Component {
    render() {
        return (
          <View style={styles.container}>
            <Text> Text </Text>
            <Caption> Caption </Caption>
            <Headline> Headline </Headline>
            <Paragraph> Paragraph </Paragraph>
            <Subheading> Subheading </Subheading>
            <Title> Title </Title>
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
});

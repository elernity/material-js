import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { List } from '@sdp.nd/material-js';

export default class ListPage extends React.Component {
    state = {
      expanded: true
    }

    _handlePress = () =>
      this.setState({
        expanded: !this.state.expanded
    });

    render() {
        return (
          <View style={styles.container}>
              <List.Section title="Subheader">
                <List.Accordion
                  title="Accordion"
                  description="This is accordion"
                  left={props => <List.Icon {...props} icon="folder" />}
                >
                  <List.Item
                    style={styles.item}
                    title="First item"
                    description="This is first item"

                  />
                  <List.Item
                    style={styles.item}
                    title="Second item"  
                    description="This is second item"
                  />
                </List.Accordion>
              </List.Section>
          </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    item: {
      // 分割线
      // borderTopWidth: 0,
      // borderBottomWidth: 1,
      // borderBottomColor: 'grey',
    },
});

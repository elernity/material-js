import React from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
} from 'react-native';
import {
    Appbar,
    IconButton
} from '@sdp.nd/material-js';

export default class BottomAppbarPage extends React.Component {
    static navigationOptions = {
        header: null,
    }
    render() {
        const listData = [];
        while(listData.length < 30) {
            listData.push({key: `第 ${listData.length} 项`});
        }
        return (
            <View>
                <FlatList
                    data={listData}
                    renderItem={
                        ({item}) => 
                            <Text style={styles.item} >
                                {item.key}
                            </Text>
                    }
                />
                <Appbar.Bottom
                    fabSource="edit"
                    leftItem={<IconButton source="chevron-left" color="white" onPress={() => console.log('click left item')}/>}
                    rightItem={<IconButton source="chevron-right" color="white" onPress={() => console.log('click right item')}/>}
                />
            </View>
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

import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
    PopupWindow,
    Button
} from '@sdp.nd/material-js';

export default class PopupPage extends React.Component {

    render() {
        return (
            <View style={StyleSheet.absoluteFill}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={styles.leftTop}>
                        <PopupWindow.Menu
                            ref={ref => this.leftTop = ref}
                            anchor=
                            {
                                <Button onPress={() => {
                                    this.leftTop.show();
                                }}/>
                            }
                        >
                            <PopupWindow.Item onPress={() => {
                                this.leftTop.dismiss();
                            }}>
                                item1
                            </PopupWindow.Item>
                            <PopupWindow.Item onPress={() => {
                                this.leftTop.dismiss();
                            }}>
                                item2
                            </PopupWindow.Item>
                        </PopupWindow.Menu>
                    </View>
                    <View style={styles.rightTop}>
                        <PopupWindow.Menu
                            ref={ref => this.rightTop = ref}
                            anchor=
                            {
                                <Button onPress={() => {
                                    this.rightTop.show();
                                }}/>
                            }
                        >
                            <PopupWindow.Item onPress={() => {
                                this.rightTop.dismiss();
                            }}>
                                item1
                            </PopupWindow.Item>
                            <PopupWindow.Item onPress={() => {
                                this.rightTop.dismiss();
                            }}>
                                item2
                            </PopupWindow.Item>
                        </PopupWindow.Menu>
                    </View>
                </View>

                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={styles.leftBottom}>
                        <PopupWindow.Menu
                            ref={ref => this.leftBottom = ref}
                            anchor=
                            {
                                <Button onPress={() => {
                                    this.leftBottom.show();
                                }}/>
                            }
                        >
                            <PopupWindow.Item onPress={() => {
                                this.leftBottom.dismiss();
                            }}>
                                item1
                            </PopupWindow.Item>
                            <PopupWindow.Item onPress={() => {
                                this.leftBottom.dismiss();
                            }}>
                                item2
                            </PopupWindow.Item>
                        </PopupWindow.Menu>
                    </View>
                    <View style={styles.rightBottom}>
                        <PopupWindow.Menu
                            ref={ref => this.rightBottom = ref}
                            anchor=
                            {
                                <Button onPress={() => {
                                    this.rightBottom.show();
                                }}/>
                            }
                        >
                            <PopupWindow.Item onPress={() => {
                                this.rightBottom.dismiss();
                            }}>
                                item1
                            </PopupWindow.Item>
                            <PopupWindow.Item onPress={() => {
                                this.rightBottom.dismiss();
                            }}>
                                item2
                            </PopupWindow.Item>
                        </PopupWindow.Menu>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    leftTop: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      backgroundColor: 'white',
    },
    rightTop: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      backgroundColor: 'white',
    },
    leftBottom: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      backgroundColor: 'white',
    },
    rightBottom: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      backgroundColor: 'white',
    },
});

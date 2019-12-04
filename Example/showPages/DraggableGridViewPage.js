import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    TouchableNativeFeedback,
    ScrollView,
    Button as NativeButton,
    Animated
} from 'react-native';
import {
    DraggableGridViewCustom,
    Surface,
    Button
} from '@sdp.nd/material-js';
import { isPortrait } from '../utils/orientation';

let addIndex = 0;
let removeIndex = 0;
const childrenWidth = 50;
const childrenHeight = 50;

export default class DraggableGridViewPage extends React.Component {

    constructor(props) {
        super(props);
        this.ds = [];
        for (let i = 1; i <= 100; i++) {
            this.ds.push({icon: require('../res/react-native.png'), txt: i});
        }
        this.state = {
            scrollEnabled: true,
            opacityForDel: new Animated.Value(0), // 0不可见 1可见
            disabledForDel: true,
            scrollY: 0,
        }
    }

    _showDel() {
        Animated.timing(this.state.opacityForDel, {
            toValue: 1,
            duration: 200,
        }).start();
        this.setState({
            disabledForDel: false,
        });
    }

    _hiddenDel() {
        Animated.timing(this.state.opacityForDel, {
            toValue: 0,
            duration: 200,
        }).start();
        this.setState({
            disabledForDel: true,
        });
    }

    render() {
        const {
            scrollEnabled,
            opacityForDel,
            disabledForDel,
        } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.btnWrapper}>
                    <NativeButton title="edit" onPress={() => this._showDel()}/>
                    <NativeButton title="finish" onPress={() => this._hiddenDel()}/>
                    <NativeButton title="add" onPress={() => {
                        this._ref.addItem({
                            icon: require('../res/react-native.png'),
                            txt: Math.random()
                        }, addIndex)}
                    }/>
                    <NativeButton title="remove" onPress={() => this._ref.removeItem(removeIndex)}/>
                </View>
                <ScrollView
                    onLayout={({nativeEvent: e}) => {
                        this._scrollViewHeight = e.layout.height;
                    }}
                    ref={ref => this._scrollView = ref}
                    style={styles.scrollView}
                    scrollEnabled={scrollEnabled}
                    onScroll={(event) => {
                        this.setState({
                            scrollY: event.nativeEvent.contentOffset.y,
                        });
                    }}
                    scrollEventThrottle={16}>
                    <View style={{
                        height: 100,
                        width: '100%',
                        backgroundColor: '#777777'
                    }} />
                    <DraggableGridViewCustom
                        ref={ref => this._ref = ref}
                        dataSource={this.ds}

                        childrenWidth={childrenWidth}
                        childrenHeight={childrenHeight}

                        marginChildrenLeft={8}
                        marginChildrenRight={8}
                        marginChildrenTop={8}
                        marginChildrenBottom={8}

                        scrollViewHeight={this._scrollViewHeight}
                        scrollViewOffset={this.state.scrollY}
                        scrollViewRef={this._scrollView}

                        fixedItems={[5, 6, 10]}
                        onLongPress={(ds, item, index) => {
                            console.log(`long press ${item.txt}`);
                        }}
                        onClickItem={(ds, item, index) => {
                            console.log(`click item ${item.txt}`);
                        }}

                        // 如果需要拖拽状态切换时有视图变化，请通过动画实现，不要修改DOM树
                        // 比如需要实现删除按钮，可以
                        onDragStart={(index) => {
                            this.setState({
                                scrollEnabled: false,
                            });
                        }}
                        onDragEnd={(index) => {
                            this.setState({
                                scrollEnabled: true,
                            });
                        }}
                        onOverStepTop={() => {
                            console.log('over step top');
                        }}
                        onOverStepBottom={() => {
                            console.log('over step bottom');
                        }}
                        keyExtractor={(item, index) => {
                            return item.txt;
                        }}
                        renderItem={(item, index, state) => {
                            return this.renderItem(item, index, state);
                    }}/>
                    <View style={{
                        height: 100,
                        width: '100%',
                        backgroundColor: '#777777'
                    }} />
                </ScrollView>
            </View>
        )
    }

    renderItem(item, index, state) {
        return (
            <Surface
                style={{
                    width: childrenWidth,
                    height: childrenHeight,
                    elevation: state.elevation,
                    // 覆盖Surface的干扰属性
                    borderWidth: 0,
                    padding: 0,
                }}>
                <View style={styles.item}>
                    <Image
                        style={styles.icon}
                        source={item.icon}/>
                    <Text style={styles.txt}>
                        {item.txt}
                    </Text>
                    <Animated.View style={{
                        position: 'absolute',
                        width: 24,
                        height: 24,
                        right: -8,
                        top: -8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'grey',
                        opacity: this.state.opacityForDel
                    }}>
                        <Text
                            style={{
                                fontSize: 24,
                                color: 'white'
                            }}
                            disabled={this.state.disabledForDel}
                            onPress={() => {
                                console.log(`delete ${item.txt}`);
                            }}>
                            X
                        </Text>
                    </Animated.View>
                </View>
            </Surface>
        )
    }



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height,
    },
    btnWrapper: {
        flexDirection: 'row',
    },
    scrollView: {
        flex: 1,
    },
    item: {
        width: childrenWidth,
        height: childrenHeight,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    icon: {
        width: childrenWidth - 8,
        height: childrenHeight - 8,
        resizeMode: 'contain',
        position: 'absolute'
    },
    txt: {
        fontSize: 18,
        lineHeight: 24,
        padding: 5,
    }
})
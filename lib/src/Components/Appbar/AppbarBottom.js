import * as React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    ART,
    Dimensions,
    StyleSheet
} from 'react-native';
import Surface from '../Common/Surface';
import FAB from '../Button/FAB';
import { withTheme } from '../../Library/themeContext';

const FAB_SIZE = 56;
const FAB_ICON_SIZE = 24;
const BAR_HEIGHT = 45;

class AppbarBottom extends React.Component {

    static propTypes = {
        barColor: PropTypes.string,
        fabSource: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
            PropTypes.string
        ]).isRequired,
        fabColor: PropTypes.string,
        fabBgColor: PropTypes.string,
        leftItem: PropTypes.node,
        rightItem: PropTypes.node,
        onPress: PropTypes.func,
    };

    static defaultProps = {
    };

    constructor(props) {
        super(props);
        this.state = {
            windowWidth: Dimensions.get('window').width,
            // ART对横竖屏的兼容性不佳 需要在横竖屏切换后二次刷新
            twiceRender: true,
        }
        this._onRotateScreen = this._onRotateScreen.bind(this);
    }

    _onRotateScreen({window, screen}) {
        this.setState({
            windowWidth: window.width,
            twiceRender: false,
        });
    }

    componentWillMount() {
        Dimensions.addEventListener('change', this._onRotateScreen);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this._onRotateScreen);
    }

    render() {
        const {
            barColor,
            fabSource,
            fabColor,
            fabBgColor,
            leftItem,
            rightItem,
            onPress,
            theme
        } = this.props;

        const realBarColor = barColor || theme.appbar.bgColor;
        const realFabColor = fabColor || theme.appbar.fabColor;
        const realFabBgColor = fabBgColor || theme.appbar.fabBgColor;

        const barHeight = BAR_HEIGHT;
        const midWidth = this.state.windowWidth / 2;
        const radius = barHeight / 3 * 2;
        const path = new ART.Path()
            .moveTo(0, 0)
            .lineTo(midWidth - radius - 4, 0)
            // 画半圆
            .counterArcTo(midWidth + radius + 4, 0, radius, radius)
            .lineTo(this.state.windowWidth, 0)
            .lineTo(this.state.windowWidth, barHeight)
            .lineTo(0, barHeight)
            .lineTo(0, 0)
            .close();
        return (
            <View style={[
                styles.container,
                {
                    width: this.state.windowWidth,
                    height: barHeight + FAB_SIZE / 2,
                }
            ]}>
                <Surface
                    onLayout={e => {
                        if (!this.state.twiceRender) {
                            this.setState({
                                // ART对横竖屏的兼容性不佳 需要在横竖屏切换后二次刷新 这里给windowWidth加上一个微小值
                                windowWidth: this.state.windowWidth + 0.01,
                                twiceRender: true,
                            });
                        }
                    }}
                    style={[
                        styles.appbar,
                        {
                            width: this.state.windowWidth,
                            height: barHeight,
                        }
                    ]}>
                    <ART.Surface
                        width={this.state.windowWidth}
                        height={barHeight}
                        style={{ backgroundColor: 'transparent' }}
                    >
                        <ART.Group>
                            <ART.Shape
                                d={path}
                                strokeWidth={0}
                                stroke="black"
                                fill={realBarColor}
                            />
                        </ART.Group>
                    </ART.Surface>
                    <View style={styles.itemContainer}>
                        <View style={[styles.left, {backgroundColor: realBarColor}]}>{leftItem}</View>
                        <View style={[styles.right, {backgroundColor: realBarColor}]}>{rightItem}</View>
                    </View>
                </Surface>
                <View
                    style={{
                        position: 'absolute',
                        bottom: barHeight - radius,
                        left: midWidth - radius,
                        width: radius * 2,
                        height: radius * 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <FAB
                        source={fabSource}
                        color={realFabColor}
                        bgColor={realFabBgColor}
                        size={FAB_SIZE}
                        iconSize={FAB_ICON_SIZE}
                        onPress={onPress}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
    },
    appbar: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
        backgroundColor: 'transparent',
        // 覆盖Surface的干扰属性
        borderWidth: 0,
        padding: 0,
    },
    itemContainer: {
        position: 'absolute',
        flexDirection: "row",
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    left: {
        flexDirection: "row",
        alignItems: 'center',
        padding: 8,
    },
    right: {
        flexDirection: "row",
        alignItems: 'center',
        padding: 8,
    },
});

export default withTheme(AppbarBottom);

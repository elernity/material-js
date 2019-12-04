import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Animated,
    View,
    Text,
    StyleSheet
} from 'react-native';
import Surface from '../Common/Surface';
import Icon from '../Common/Icon';
import TouchableRipple from '../Common/TouchableRipple';
import {
    alpha,
    isImageSource
} from '../../Library/util';
import { withTheme } from '../../Library/themeContext';

// 未抬升时的海拔高度
const ELEVATION_LOW = 6;
// 抬升后的海拔高度
const ELEVATION_HEIGHT = 12;

class FAB extends React.Component {

    static propTypes = {
        source: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
            PropTypes.string
        ]).isRequired,
        title: PropTypes.string,
        disabled: PropTypes.bool,
        color: PropTypes.string,
        bgColor: PropTypes.string,
        size: PropTypes.number,
        iconSize: PropTypes.number,
        rippleColor: PropTypes.string,
        onPress: PropTypes.any,
        style: PropTypes.any,
    };

    static defaultProps = {
        disabled: false,
        // FAB中图标的大小
        iconSize: 24,
        style: {},
    };

    state = {
        // 抬起高度
        elevation: new Animated.Value(ELEVATION_LOW),
    };

    _handlePressIn = () => {
        Animated.timing(this.state.elevation, {
            toValue: ELEVATION_HEIGHT,
            duration: 200,
        }).start();
    };

    _handlePressOut = () => {
        Animated.timing(this.state.elevation, {
            toValue: ELEVATION_LOW,
            duration: 150,
        }).start();
    };

    render() {
        const {
            disabled,
            source,
            title,
            color,
            bgColor,
            size,
            iconSize,
            rippleColor,
            onPress,
            theme,
            style,
            ...rest
        } = this.props;

        // 默认情况下 如果source是图片 配置如下
        let foregroundColor = 'transparent';
        let backgroundColor = 'transparent';
        let realRippleColor = alpha('black', 0.32);
        // 如果source是非图片的图标 重置配色
        if (!isImageSource(source)) {
            if (disabled) {
                // 不可用的情况下 前后颜色配置不可用色 无需配置水波纹颜色
                foregroundColor = theme.colors.disabledComponent;
                backgroundColor = theme.colors.disabledBackground;
            } else {
                foregroundColor = color || theme.fab.foregroundColor;
                backgroundColor = bgColor || theme.fab.backgroundColor;
                realRippleColor = rippleColor || alpha(foregroundColor, 0.32);
            }
        }
        const titleFontFamily = theme.fab.titleFontFamily;
        const elevation = disabled ? 0 : this.state.elevation;
        // 优先级：style > size > def
        const realSize = size || (title ? 48 : 56);
        // 带标题的FAB的width自有拓展 不带标题的使用下述值
        const width = style.width || realSize;
        const height = style.height || realSize;
        const borderRadius = height / 2;
        const surfaceStyle = StyleSheet.flatten([
            styles.surface,
            {
                elevation,
                backgroundColor,
                borderRadius,
            },
            style,
        ]);
        const textStyle = StyleSheet.flatten([
            styles.title,
            {
                color: foregroundColor,
                fontFamily: titleFontFamily,
            },
        ]);
        return (
            <Surface {...rest} style={surfaceStyle}>
                <TouchableRipple
                    disabled={disabled}
                    onPress={onPress}
                    onPressIn={this._handlePressIn}
                    onPressOut={this._handlePressOut}
                    rippleColor={realRippleColor}
                >
                    <View
                        style={[
                            styles.content,
                            title ?
                            {
                                height,
                                paddingHorizontal: 16,
                            } :
                            {
                                width,
                                height,
                            }
                        ]}
                        pointerEvents="none"
                    >
                        <Icon
                            source={source}
                            size={iconSize}
                            color={foregroundColor}
                        />
                        {title ? (
                            <Text style={textStyle} >
                                {title.toUpperCase()}
                            </Text>
                        ) : null}
                    </View>
                </TouchableRipple>
            </Surface>
        );
    }
}

const styles = StyleSheet.create({
    surface: {
        // 覆盖Surface的干扰属性
        borderWidth: 0,
        padding: 0,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        marginHorizontal: 8,
        textAlign: 'left',
        fontSize: 14,
    },
});

export default withTheme(FAB);

import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Animated,
    View,
    Text,
    StyleSheet
} from 'react-native';
import Surface from '../Common/Surface';
import TouchableRipple from '../Common/TouchableRipple';
import { withTheme } from '../../Library/themeContext';
import { alpha } from '../../Library/util';

const DEFAULT_TITLE = 'BUTTON';
// 未抬升时的海拔高度
const ELEVATION_LOW = 2;
// 抬升后的海拔高度
const ELEVATION_HEIGHT = 8;

class Button extends React.Component {

    static propTypes = {
        disabled: PropTypes.bool,
        children: PropTypes.node,
        title: PropTypes.string,
        rippleColor: PropTypes.string,
        onPress: PropTypes.any,
        onLongPress: PropTypes.any,
        onPressIn: PropTypes.any,
        onPressOut: PropTypes.any,
        style: PropTypes.any,
    };

    static defaultProps = {
        disabled: false,
        title: DEFAULT_TITLE,
        style: {},
    };

    state = {
        // 抬起高度
        elevation: new Animated.Value(ELEVATION_LOW),
    };

    render() {
        const {
            disabled,
            children,
            title,
            rippleColor,
            onPress,
            onLongPress,
            onPressIn,
            onPressOut,
            style,
            theme,
            ...rest
        } = this.props;

        const handlePressIn = () => {
            if (!!onPressIn) {
                onPressIn();
            }
            Animated.timing(this.state.elevation, {
                toValue: ELEVATION_HEIGHT,
                duration: 200,
            }).start();
        };

        const handlePressOut = () => {
            if (!!onPressOut) {
                onPressOut();
            }
            Animated.timing(this.state.elevation, {
                toValue: ELEVATION_LOW,
                duration: 150,
            }).start();
        };

        const elevation = disabled ? 0 : this.state.elevation;
        const borderRadius = theme.roundness;

        const btnTheme = theme.button;
        const bgColor = btnTheme.containerBgColor;
        const titleColor = style.titleColor || btnTheme.titleColor;
        const titleSize = style.titleSize || btnTheme.titleSize;
        const titleFontFamily = style.titleFontFamily || btnTheme.titleFontFamily;

        const surfaceStyle = StyleSheet.flatten([
            styles.container,
            {
                elevation,
                borderRadius,
                backgroundColor: bgColor,
            },
            style,
        ]);

        const textStyle = StyleSheet.flatten([
            styles.title,
            {
                color: titleColor,
                fontSize: titleSize,
                fontFamily: titleFontFamily,
            }
        ]);

        const touchableStyle = {
            minWidth: surfaceStyle.minWidth,
            minHeight: surfaceStyle.minHeight,
            width: '100%',
            height: surfaceStyle.height,
            borderRadius: surfaceStyle.borderRadius,
        };

        const realRippleColor = rippleColor
            || alpha(textStyle.color, 0.32);

        if (disabled) {
            surfaceStyle.backgroundColor =
                theme.colors.disabledBackground;
            textStyle.color =
                theme.colors.disabledText;
        }

        return (
            <Surface
                {...rest}
                style={surfaceStyle}
            >
                <TouchableRipple
                    disabled={disabled}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    rippleColor={realRippleColor}
                    style={touchableStyle}
                >
                    {
                        children ?
                        <View>
                            {children}
                        </View>
                        : 
                        <Text numberOfLines={1} style={textStyle}>
                            {title}
                        </Text>
                    }
                </TouchableRipple>
            </Surface>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        minWidth: 64,
        // 覆盖Surface的干扰属性
        borderWidth: 0,
        padding: 0,
    },
    title: {
        textAlign: 'center',
        letterSpacing: 2,
        marginVertical: 8,
        marginHorizontal: 16,
    }
});

export default withTheme(Button);

import React from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    StyleSheet
} from 'react-native';
import TouchableRipple from '../Common/TouchableRipple';
import { withTheme } from '../../Library/themeContext';
import { alpha } from '../../Library/util';

class MenuItem extends React.Component {

    static propTypes = {
        children: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        rippleColor: PropTypes.string,
        onPress: PropTypes.func,
        style: PropTypes.any,
    };

    static defaultProps = {
        disabled: false,
        style: {},
    };

    render() {
        const {
            children,
            disabled,
            rippleColor,
            onPress,
            style,
            theme,
        } = this.props;

        const borderRadius = theme.roundness;

        const textFontSize = style.textFontSize
            || theme.popupWindow.textFontSize;
        const textFontFamily = style.textFontFamily
            || theme.popupWindow.textFontFamily;

        let textColor = theme.colors.disabledText;
        let realRippleColor = 'transparent';
        if (!disabled) {
            textColor = style.textColor || theme.popupWindow.textColor;
        }
        realRippleColor = rippleColor || alpha(textColor, 0.32);

        return (
            <TouchableRipple
                disabled={disabled}
                borderless={false}
                rippleColor={realRippleColor}
                onPress={onPress}
                style={[
                    styles.container,
                    { borderRadius }
                ]}
            >
                <Text
                    numberOfLines={1}
                    style={[
                        styles.text,
                        {
                            fontSize: textFontSize,
                            fontFamily: textFontFamily,
                            color: textColor,
                        }
                    ]}
                >
                    {children}
                </Text>
            </TouchableRipple>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 48,
        justifyContent: 'center',
        maxWidth: 248,
        minWidth: 124,
    },
    text: {
        fontWeight: '400',
        paddingHorizontal: 16,
    },
});

export default withTheme(MenuItem);

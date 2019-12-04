import * as React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Animated,
    TextInput as NativeTextInput,
    StyleSheet,
} from 'react-native';
import { withTheme } from '../../Library/themeContext';

class TextInputFlat extends React.Component {

    static propTypes = {
        editable: PropTypes.bool,
        multiline: PropTypes.bool,
        value: PropTypes.string,
        placeholder: PropTypes.string,
        textColor: PropTypes.string,
        placeholderColor: PropTypes.string,
        componentColor: PropTypes.string,
        onChangeText: PropTypes.any,
    }

    static defaultProps = {
        editable: true,
        multiline: false,
        value: '',
        placeholder: '',
    };

    _root = null;

    _handleRef = ref => {
        this._root = ref;
    };

    constructor(props) {
        super(props);
        this.state = {
            focused: false,
            value: props.value,
            placeholder: props.placeholder,
        };
    }

    _showPlaceholder = () => {
        this.setState({
            placeholder: this.props.placeholder,
        });
    };

    _hidePlaceholder = () => {
        this.setState({
            placeholder: '',
        });
    };

    _handleChangeText = (value) => {
        if (!this.props.editable) {
            return;
        }
        if (value) {
            this._hidePlaceholder();
        } else {
            this._showPlaceholder();
        }
        this.setState({ value });
        this.props.onChangeText
            && this.props.onChangeText(value);
    };

    _handleFocus = (...args) => {
        if (!this.props.editable) {
            return;
        }
        this.setState({ focused: true });
        if (this.props.onFocus) {
            this.props.onFocus(...args);
        }
    };

    _handleBlur = (...args) => {
        if (!this.props.editable) {
            return;
        }
        this.setState({ focused: false });
        if (this.props.onBlur) {
            this.props.onBlur(...args);
        }
    };


    setNativeProps(...args) {
        return this._root && this._root.setNativeProps(...args);
    }

    isFocused() {
        return this._root && this._root.isFocused();
    }

    clear() {
        return this._root && this._root.clear();
    }

    focus() {
        return this._root && this._root.focus();
    }

    blur() {
        return this._root && this._root.blur();
    }

    render() {
        const {
            editable,
            multiline,
            textColor,
            placeholderColor,
            componentColor,
            style,
            theme,
            ...rest
        } = this.props;

        const {
            focused,
            value,
            placeholder,
        } = this.state;

        let bgColor = theme.colors.disabledBackground;
        let realTextColor = theme.colors.disabledText;
        let realPlaceholderColor = theme.colors.disabledText;
        let realComponentColor = theme.colors.disabledComponent;

        if (editable) {
            bgColor = style.backgroundColor || theme.textInputFlat.bgColor;
            realTextColor = textColor || theme.textInputFlat.textColor;
            realPlaceholderColor = placeholderColor || theme.textInputFlat.placeholderColor;
            realComponentColor = componentColor || theme.textInputFlat.componentColor;
        }

        // 获取焦点时 底线变粗 使用组件色彩
        // 丢失焦点时 底线变细 使用不可用色彩
        const underlineColor = focused ? realComponentColor
            : theme.colors.disabledComponent;
        const underlineScaleY = focused ? 1 : 0.5;

        // 文字字体
        const textFontFamily = theme.textInputFlat.textFontFamily;
        // 文字位置
        const textAlignVertical = multiline ? 'top' : 'center';
    
        // 容器样式
        const containerStyle = StyleSheet.flatten([
            styles.container,
            { backgroundColor: bgColor },
            style
        ]);

        // 底线样式
        const underlineStyle = StyleSheet.flatten([
            styles.underline,
            {
                backgroundColor: underlineColor,
                transform: [{scaleY: underlineScaleY}],
            }
        ]);

        // 输入框样式
        const inputStyle = StyleSheet.flatten([
            styles.inputBox,
            {
                color: realTextColor,
                fontFamily: textFontFamily,
                textAlign: 'left',
                textAlignVertical: textAlignVertical,
            }
        ]);

        return (
            <View style={containerStyle}>
                <Animated.View style={underlineStyle} />
                <NativeTextInput
                    {...rest}
                    editable={editable}
                    multiline={multiline}
                    value={value}
                    placeholder={placeholder}
                    ref={this._handleRef}
                    onFocus={this._handleFocus}
                    onBlur={this._handleBlur}
                    onChangeText={this._handleChangeText}
                    placeholderTextColor={realPlaceholderColor}
                    selectionColor={realComponentColor}
                    underlineColorAndroid='transparent'
                    style={inputStyle}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    underline: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 2,
    },
    inputBox: {
        flexGrow: 1,
        minHeight: 58,
        paddingHorizontal: 12,
        paddingVertical: 15,
        fontSize: 16,
        zIndex: 1,
    },
});

export default withTheme(TextInputFlat);

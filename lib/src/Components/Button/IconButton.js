import * as React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet
} from 'react-native';
import Icon from '../Common/Icon';
import CrossFadeIcon from '../Icon/CrossFadeIcon';
import TouchableRipple from '../Common/TouchableRipple';
import { withTheme } from '../../Library/themeContext';
import { alpha } from '../../Library/util';

const DEFAULT_ICON_SIZE = 24;

class IconButton extends React.Component {

    static propTypes = {
        source: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
            PropTypes.string
        ]).isRequired,
        anotherSource: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
            PropTypes.string
        ]),
        disabled: PropTypes.bool,
        animated: PropTypes.bool,
        color: PropTypes.string,
        size: PropTypes.number.isRequired,
        onPress: PropTypes.any,
    };

    static defaultProps = {
        disabled: false,
        animated: false,
        size: DEFAULT_ICON_SIZE,
    };

    root = null;

    handleRef = ref => {
        this.root = ref;
    };

    handlePress = () => {
        // 如果设置了ref 转换图标
        if (this.root) {
            this.root.transformIcon();
        }
        this.props.onPress && this.props.onPress();
    }

    render() {
        const {
            disabled,
            animated,
            source,
            anotherSource,
            color,
            size,
            onPress,
            theme,
            style,
            ...rest
        } = this.props;

        const iconColor = color || theme.iconButton.color;
        const rippleColor = alpha(iconColor, 0.32);
        const IconComponent = animated ? CrossFadeIcon : Icon;
        const hitSlop = {
            top: 10,
            left: 10,
            bottom: 10,
            right: 10,
        };
        return (
            <TouchableRipple
                disabled={disabled}
                onPress={this.handlePress}
                rippleColor={rippleColor}
                style={[
                    styles.container, // 公用属性
                    !TouchableRipple.supported &&
                        {
                            width: size / 2,
                            height: size / 2,
                        }, // 不支持类型
                    disabled && styles.disabled, // 不可用类型
                    style,
                ]}
                hitSlop={hitSlop}
                {...rest}
            >
                <IconComponent
                    ref={animated ? this.handleRef : null}
                    source={source}
                    anotherSource={anotherSource}
                    color={iconColor}
                    size={size}
                />
            </TouchableRipple>
        );
    }
};

const styles = StyleSheet.create({
    conteiner: {
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
    },
    disabled: {
        opacity: 0.32,
    },
});

export default withTheme(IconButton);

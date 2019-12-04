import * as React from 'react';
import PropTypes from 'prop-types';
import Icon from './Common/Icon';
import TouchableRipple from './Common/TouchableRipple';
import { withTheme } from '../Library/themeContext';
import { fade } from '../Library/util';

const STATES_CHECK = 'checked';
const STATES_UNCHECK = 'unchecked';
const STATES_INDETERMINATE = 'indeterminate';

class Checkbox extends React.Component {

    static STATES_CHECK = STATES_CHECK;
    static STATES_UNCHECK = STATES_UNCHECK;
    static STATES_INDETERMINATE = STATES_INDETERMINATE;

    static propTypes = {
        disabled: PropTypes.bool,
        status: PropTypes.string,
        size: PropTypes.number,
        color: PropTypes.string,
        onPress: PropTypes.any,
    };

    static defaultProps = {
        disabled: false,
        status: STATES_UNCHECK,
        size: 24,
    };

    render() {
        const {
            disabled,
            status,
            size,
            color,
            onPress,
            theme,
            ...rest
        } = this.props;

        let icon = 'check-box-outline-blank';
        if (status === STATES_CHECK) {
            icon = 'check-box';
        } else if (status === STATES_INDETERMINATE) {
            icon = 'indeterminate-check-box';
        }

        let checkboxColor = theme.colors.disabledComponent;
        if (!disabled) {
            if (status === STATES_CHECK
                || status === STATES_INDETERMINATE) {
                    checkboxColor = color || theme.checkbox.activeColor;
            } else if (status === STATES_UNCHECK) {
                checkboxColor = color || theme.checkbox.inactiveColor;
            }
        }
        const rippleColor = fade(
            color || theme.checkbox.activeColor, 0.32);

        return (
            <TouchableRipple
                {...rest}
                disabled={disabled}
                rippleColor={rippleColor}
                onPress={onPress}
                style={{
                    width: size + 12,
                    height: size + 12,
                    borderRadius: (size + 12) / 2,
                    padding: 6,
                }}
            >
                <Icon
                    allowFontScaling={false}
                    source={icon}
                    size={size}
                    color={checkboxColor}
                />
            </TouchableRipple>
        );
    }
}

export default withTheme(Checkbox);

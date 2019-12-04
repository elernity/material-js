import * as React from 'react';
import PropTypes from 'prop-types';
import IconButton from '../Button/IconButton';
import { withTheme } from '../../Library/themeContext';

class AppbarActionItem extends React.Component {

    static propTypes = {
        disabled: PropTypes.bool,
        animated: PropTypes.bool,
        color: PropTypes.string,
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
        onPress: PropTypes.any,
        _style: PropTypes.any,
    };

    static defaultProps = {
        disabled: false,
        animated: false,
    };

    render() {
        const {
            disabled,
            animated,
            color,
            source,
            anotherSource,
            onPress,
            theme,
            _style
        } = this.props;

        const iconColor = color || theme.appbar.actionItemColor;

        return (
            <IconButton
                disabled={disabled}
                animated={animated}
                color={iconColor}
                source={source}
                anotherSource={anotherSource}
                onPress={onPress}
                size={24}
                style={_style}
            />
        );
    }
}
export default withTheme(AppbarActionItem);

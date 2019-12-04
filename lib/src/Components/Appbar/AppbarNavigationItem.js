import * as React from 'react';
import PropTypes from 'prop-types';
import AppbarActionItem from './AppbarActionItem';
import { withTheme } from '../../Library/themeContext';

const ICON = 'arrow-back';

class AppbarNavigationItem extends React.Component {

    static propTypes = {
        disabled: PropTypes.bool,
        animated: PropTypes.bool,
        color: PropTypes.string,
        source: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
            PropTypes.string
        ]),
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
        source: ICON,
    };

    render() {
        const {
            color,
            theme
        } = this.props;
        const itemColor = color || theme.appbar.actionItemColor;
        return (
            <AppbarActionItem {...this.props} color={itemColor}/>
        );
    }
}

export default withTheme(AppbarNavigationItem);

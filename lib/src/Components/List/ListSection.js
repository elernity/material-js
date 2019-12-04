import * as React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import { withTheme } from '../../Library/themeContext';

class ListSection extends React.Component {

    static propTypes = {
        children: PropTypes.node.isRequired,
        title: PropTypes.string,
        style: PropTypes.any,
    };

    static defaultProps = {
        style: {},
    };

    render() {
        const {
            children,
            title,
            style,
            theme,
            ...rest
        } = this.props;

        const subheadingStyle = StyleSheet.flatten([
            styles.title,
            {
                fontSize: style.subheadingSize
                    || theme.list.subheadingSize,
                color: style.subheadingColor
                    || theme.list.subheadingColor,
                fontFamily: style.subheadingFontFamily
                    || theme.list.subheadingFontFamily,
            }
        ]);

        return (
            <View {...rest} style={[styles.container, style]}>
                {title &&
                    <Text numberOfLines={1} style={subheadingStyle}>
                        {title}
                    </Text>
                }
                {children}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    title: {
        textAlign: 'left',
        paddingHorizontal: 16,
        paddingVertical: 12,
    }
});

export default withTheme(ListSection);

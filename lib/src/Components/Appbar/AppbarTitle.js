import * as React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    StyleSheet
} from 'react-native';
import { withTheme } from '../../Library/themeContext';
import { alpha } from '../../Library/util';

class AppbarTitle extends React.Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string,
        color: PropTypes.string.isRequired,
        onPress: PropTypes.func,
        _style: PropTypes.any,
    };

    static defaultProps = {
        color: 'white',
    };

    render() {
        const {
            title,
            subtitle,
            color,
            onPress,
            theme,
            _style,
        } = this.props;

        const titleColor = color || theme.appbar.titleColor;
        const subtitleColor = alpha(titleColor, 0.7);
        const titleFontFamily = theme.appbar.titleFontFamily;
        const subtitleFontFamily = theme.appbar.subtitleFontFamily;

        return (
            <View style={[styles.container, _style]}>
                <TouchableWithoutFeedback onPress={onPress}>
                    <View>
                        <Text
                            style={[
                                styles.title,
                                {
                                    color: titleColor,
                                    fontFamily: titleFontFamily,
                                },
                            ]}
                            numberOfLines={1}
                        >
                            {title}
                        </Text>
                        {subtitle && (
                            <Text
                                style={[
                                    styles.subtitle,
                                    {
                                        color: subtitleColor,
                                        fontFamily: subtitleFontFamily,
                                    },
                                ]}
                                numberOfLines={1}
                            >
                                {subtitle}
                            </Text>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
    },
    title: {
        textAlign: 'left',
        fontSize: 20,
    },
    subtitle: {
        textAlign: 'left',
        fontSize: 14,
    },
});

export default withTheme(AppbarTitle);

import * as React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import TouchableRipple from '../Common/TouchableRipple';
import { withTheme } from '../../Library/themeContext';
import { alpha } from '../../Library/util';

class ListItem extends React.Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        left: PropTypes.func,
        right: PropTypes.func,
        onPress: PropTypes.func,
        style: PropTypes.any,
    };

    static defaultProps = {
        style: {},
    };

    render() {
        const {
            left,
            right,
            title,
            description,
            onPress,
            theme,
            style
        } = this.props;

        const flattenedStyle = StyleSheet.flatten([theme.list, style]);

        const {
            itemTitleFontSize,
            itemTitleColor,
            itemTitleFontFamily,
            itemDescriptionFontSize,
            itemDescriptionColor,
            itemDescriptionFontFamily,
        } = flattenedStyle;

        const titleStyle = {
            textAlign: 'left',
            fontSize: itemTitleFontSize,
            fontFamily: itemTitleFontFamily,
            color: itemTitleColor
        };

        const descriptionStyle = {
            textAlign: 'left',
            fontSize: itemDescriptionFontSize,
            fontFamily: itemDescriptionFontFamily,
            color: itemDescriptionColor
        };

        const iconStyle = {
            color: itemDescriptionColor
        };

        const rippleColor = alpha(itemDescriptionColor, 0.32);

        return (
            <TouchableRipple
                borderless={false}
                rippleColor={rippleColor}
                onPress={onPress}
                style={style}
            >
                <View style={styles.row}>
                    {left && left(iconStyle)}
                    <View style={styles.content} pointerEvents="none">
                        <Text numberOfLines={1} style={titleStyle} >
                            {title}
                        </Text>
                        {description && (
                            <Text numberOfLines={2} style={descriptionStyle} >
                                {description}
                            </Text>
                        )}
                    </View>
                    {right && right(iconStyle)}
                </View>
            </TouchableRipple>
        );
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        margin: 8,
    },
});

export default withTheme(ListItem);

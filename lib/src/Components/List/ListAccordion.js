import * as React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import TouchableRipple from '../Common/TouchableRipple';
import Icon from '../Common/Icon';
import { withTheme } from '../../Library/themeContext';
import { alpha } from '../../Library/util';

class ListAccordion extends React.Component {

    static propTypes = {
        children: PropTypes.node.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        left: PropTypes.func,
        onPress: PropTypes.func,
        style: PropTypes.any,
    };

    static defaultProps = {
        style: {},
    };

    state = {
        expanded: false,
    };

    _handlePress = () => {
        this.props.onPress && this.props.onPress();

        this.setState(state => ({
            expanded: !state.expanded,
        }));
    };

    render() {
        const {
            children,
            title,
            description,
            left,
            theme,
            style
        } = this.props;

        const {
            expanded
        } = this.state;

        const flattenedStyle = StyleSheet.flatten([theme.list, style]);

        const {
            accordionExpandedColor,
            accordionTitleFontSize,
            accordionTitleColor,
            accordionTitleFontFamily,
            accordionDescriptionFontSize,
            accordionDescriptionColor,
            accordionDescriptionFontFamily
        } = flattenedStyle;

        const titleStyle = {
            textAlign: 'left',
            fontSize: accordionTitleFontSize,
            fontFamily: accordionTitleFontFamily,
            color: expanded ? accordionExpandedColor
                : accordionTitleColor
        };

        const descriptionStyle = {
            textAlign: 'left',
            fontSize: accordionDescriptionFontSize,
            fontFamily: accordionDescriptionFontFamily,
            color: accordionDescriptionColor
        };

        const iconStyle = {
            color: expanded ? accordionExpandedColor
                : accordionDescriptionColor
        };

        const rippleColor = alpha(accordionDescriptionColor, 0.32);

        return (
            <View>
                <TouchableRipple
                    borderless={false}
                    rippleColor={rippleColor}
                    onPress={this._handlePress}
                    style={style}
                >
                <View style={styles.row} pointerEvents="none">
                    {left && left(iconStyle)}
                    <View style={[styles.item, styles.content]}>
                        <Text
                            numberOfLines={1}
                            style={[styles.title, titleStyle]}
                        >
                            {title}
                        </Text>
                        {description && (
                            <Text
                                numberOfLines={2}
                                style={[styles.description, descriptionStyle]}
                            >
                                {description}
                            </Text>
                        )}
                    </View>
                    <View style={[styles.item, description && styles.multiline]}>
                        <Icon
                            source={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                            color={titleStyle.color}
                            size={24}
                        />
                    </View>
                </View>
                </TouchableRipple>
                    {expanded
                    ? React.Children.map(children, child => {
                            if (
                                left &&
                                React.isValidElement(child) &&
                                !child.props.left &&
                                !child.props.right
                            ) {
                                return React.cloneElement(child, {
                                    style: [styles.child, child.props.style],
                                });
                            }
                            return child;
                        })
                    : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    item: {
        margin: 8,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    multiline: {
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    child: {
        paddingLeft: 64,
    },
});

export default withTheme(ListAccordion);

import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import NavigationItem from './AppbarNavigationItem';
import ActionItem from './AppbarActionItem';
import Title from './AppbarTitle';
import Surface from '../Common/Surface';
import { withTheme } from '../../Library/themeContext';

class AppbarRegular extends React.Component {

    static propTypes = {
        children: PropTypes.node.isRequired,
        color: PropTypes.string,
    };

    static defaultProps = {
    };

    render() {
        const {
            children,
            color,
            theme
        } = this.props;

        const bgColor = color || theme.appbar.bgColor;

        return (
            <Surface
                style={[
                    styles.container,
                    { backgroundColor: bgColor }
                ]}
            >
                {
                    React.Children.toArray(children)
                        .map((child, i, childrenArr) => {
                            if (!React.isValidElement(child)) {
                                return child;
                            }

                            const props = {};
                            if (child.type === Title) {
                                props._style = [
                                    { marginLeft: 32 },
                                    child.props.style
                                ];
                            } else if (child.type === ActionItem) {
                                let marginRight = 24;
                                if (i === childrenArr.length - 1) {
                                    marginRight = 0;
                                }
                                props._style = [
                                    { marginRight },
                                    child.props.style
                                ];
                            }
                            return React.cloneElement(child, props);
                        })
                }
            </Surface>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        elevation: 4,
        // 覆盖Surface的干扰属性
        borderWidth: 0,
        padding: 0,
    },
});

export default withTheme(AppbarRegular);

import * as React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Image,
    StyleSheet
} from 'react-native';
import NavigationItem from './AppbarNavigationItem';
import ActionItem from './AppbarActionItem';
import Title from './AppbarTitle';
import Surface from '../Common/Surface';
import { withTheme } from '../../Library/themeContext';

class AppbarProminent extends React.Component {

    static propTypes = {
        children: PropTypes.node.isRequired,
        bgImg: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number
        ]),
        color: PropTypes.string,
        extraView: PropTypes.node,
    };

    static defaultProps = {
    };

    render() {
        const {
            children,
            bgImg,
            color,
            extraView,
            theme
        } = this.props;

        const bgColor = color || theme.appbar.bgColor;

        return (
            <Surface
                style={[
                    { backgroundColor: bgColor },
                    styles.container,
                ]}
            >
                {bgImg && (<Image source={bgImg} style={styles.bgImg}/>)}
                <View style={styles.appbar}>
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
                </View>
                {extraView}
            </Surface>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 200,
        elevation: 4,
        // 覆盖Surface的干扰属性
        borderWidth: 0,
        padding: 0,
    },
    bgImg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    appbar: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
});

export default withTheme(AppbarProminent);

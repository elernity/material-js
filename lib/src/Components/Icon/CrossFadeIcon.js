import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Animated,
    View,
    StyleSheet
} from 'react-native';
import { polyfill } from 'react-lifecycles-compat';
import Icon from '../Common/Icon';
import {
    isValidIcon,
    isEqualIcon
} from '../../Library/util';

const DEFAULT_ICON_SIZE = 24;
const DEFAULT_ICON_COLOR = 'black';

class CrossFadeIcon extends React.Component {

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
        color: PropTypes.string,
        size: PropTypes.number.isRequired,
    };

    static defaultProps = {
        size: DEFAULT_ICON_SIZE,
        color: DEFAULT_ICON_COLOR,
    };

    constructor(props) {
        super(props);
        this.state = {
            fadeAwayIcon: props.anotherSource,
            showIcon: props.source,
            fade: new Animated.Value(0),
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            fadeAwayIcon: nextProps.anotherSource,
            showIcon: nextProps.source,
            fade: new Animated.Value(0),
        });
    }

    _shouldTransform() {
        const icon
            = this.props.source;
        const anotherIcon
            = this.props.anotherSource;
        return isValidIcon(icon)
            && isValidIcon(anotherIcon)
            && !isEqualIcon(icon, anotherIcon);
    }

    transformIcon() {
        if (this._shouldTransform()) {
            this.setState({
                fadeAwayIcon: this.state.showIcon,
                showIcon: this.state.fadeAwayIcon,
                fade: new Animated.Value(1),
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        Animated.timing(this.state.fade, {
            duration: 200,
            toValue: 0,
        }).start();
    }

    render() {
        const {
            color,
            size,
        } = this.props;
        const {
            fadeAwayIcon,
            showIcon,
            fade,
        } = this.state;
        // 消失图标透明度 逐渐透明
        const opacityPrev = fade;
        // 消失图标旋转度 0到-90°
        const rotatePrev = fade.interpolate({
            inputRange: [0, 1],
            outputRange: ['-90deg', '0deg'],
        });
        // 显示图标透明度 逐渐显示
        const opacityNext = fade.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
        });
        // 显示图标旋转度 -180°到0
        const rotateNext = fade.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '-180deg'],
        });

        const containerStyle = StyleSheet.flatten([
            styles.container,
            {
                width: size,
                height: size,
            }
        ]);
        return (
            this._shouldTransform() ?
                (
                    <View style={containerStyle}>
                        <Animated.View
                            style={[
                                StyleSheet.absoluteFill,
                                {
                                    opacity: opacityPrev,
                                    transform: [{ rotate: rotatePrev }],
                                },
                            ]}
                        >
                            <Icon source={fadeAwayIcon} size={size} color={color} />
                        </Animated.View>
                        <Animated.View
                            style={[
                                StyleSheet.absoluteFill,
                                {
                                    opacity: opacityNext,
                                    transform: [{ rotate: rotateNext }],
                                },
                            ]}
                        >
                            <Icon source={showIcon} size={size} color={color} />
                        </Animated.View>
                    </View>
                ) :
                (
                    <Icon source={showIcon} size={size} color={color} />
                )
                
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

polyfill(CrossFadeIcon);

export default CrossFadeIcon;

import * as React from 'react';
import PropTypes from 'prop-types';
import {
    TouchableNativeFeedback,
    TouchableHighlight,
    Platform,
    View
} from 'react-native';
import {
    fade
} from '../../Library/util';

const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_VERSION_PIE = 28;

class TouchableRipple extends React.Component {
    static propTypes = {
        borderless: PropTypes.bool,
        rippleColor: PropTypes.string,
        style: PropTypes.any,
        children: PropTypes.node.isRequired,
    };

    static defaultProps = {
        borderless: true,
        rippleColor: 'black',
    };

    static supported = Platform.OS === 'android'
        && Platform.Version >= ANDROID_VERSION_LOLLIPOP;

    render() {
        const {
            borderless,
            rippleColor,
            style,
            children,
            ...rest
        } = this.props;

        // A workaround for ripple on Android P is to use useForeground + overflow: 'hidden'
        // https://github.com/facebook/react-native/issues/6480
        const useForeground = Platform.OS === 'android'
            && Platform.Version >= ANDROID_VERSION_PIE
            && borderless;

        if (TouchableRipple.supported) {
            return (
                <TouchableNativeFeedback
                    {...rest}
                    useForeground={useForeground}
                    background={
                        TouchableNativeFeedback
                            .Ripple(rippleColor, borderless)
                    }
                >
                    <View style={[
                        borderless && { overflow: 'hidden' },
                        style
                    ]}>
                        {React.Children.only(children)}
                    </View>
                </TouchableNativeFeedback>
            );
        }

        return (
            <TouchableHighlight
                {...rest}
                underlayColor={fade(rippleColor, 0.5)}
                style={[
                    borderless && { overflow: 'hidden' },
                    style
                ]}
            >
                {React.Children.only(children)}
            </TouchableHighlight>
        );
    }
}

export default TouchableRipple;

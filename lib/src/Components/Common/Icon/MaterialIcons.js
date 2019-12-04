import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Platform,
    Text
} from 'react-native';
import glyphMap from './glyphMap';

const DEFAULT_ICON_SIZE = 24;
const DEFAULT_ICON_COLOR = 'black';

// 创建一个Material图标组件
function createIconSet() {
    // Android 不关心真正的fontFamily名，它只会在assets/fonts文件夹查找
    const fontReference = Platform.select({
        android: 'MaterialIcons',
        ios: 'Material Icons',
    });

    class Icon extends React.PureComponent {
        static propTypes = {
            source: PropTypes.oneOf(Object.keys(glyphMap)).isRequired,
            color: PropTypes.string,
            size: PropTypes.number,
            style: PropTypes.any,
            children: PropTypes.node,
        };

        static defaultProps = {
            size: DEFAULT_ICON_SIZE,
            color: DEFAULT_ICON_COLOR,
        };

        root = null;

        setNativeProps(nativeProps) {
            if (this.root) {
                this.root.setNativeProps(nativeProps);
            }
        }

        handleRef = ref => {
            this.root = ref;
        };

        render() {
            const {
                source,
                color,
                size,
                style,
                children,
                ...rest
            } = this.props;

            let glyph = glyphMap[source] || '?';
            if (typeof glyph === 'number') {
                glyph = String.fromCharCode(glyph);
            }

            const styleDefaults = {
                fontSize: size,
                color,
            };

            const styleOverrides = {
                fontFamily: fontReference,
                fontWeight: 'normal',
                fontStyle: 'normal',
            };

            rest.style = [styleDefaults, style, styleOverrides];
            rest.ref = this.handleRef;
            return (
                <Text {...rest}>
                    {glyph}
                    {children}
                </Text>
            );
        }
    }

    function hasIcon(source) {
        return Object.prototype.hasOwnProperty.call(glyphMap, source);
    }

    function getRawGlyphMap() {
        return glyphMap;
    }

    function getFontFamily() {
        return fontReference;
    }

    Icon.hasIcon = hasIcon;
    Icon.getRawGlyphMap = getRawGlyphMap;
    Icon.getFontFamily = getFontFamily;

    return Icon;
}

export default createIconSet();

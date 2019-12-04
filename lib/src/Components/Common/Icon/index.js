import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Image
} from 'react-native';
import {
    isImageSource,
    isValidIcon
} from '../../../Library/util';

import MaterialIcons from './MaterialIcons';

/**
 * 公用组件-图标
 * 包括图片和Material图标两种形式
 */
class Icon extends React.Component {
    static propTypes = {
        source: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
            PropTypes.string
        ]).isRequired,
        color: PropTypes.string,
        size: PropTypes.number,
    };
    render() {
        const {
            source,
            color,
            size,
            ...rest
        } = this.props;
        if (isImageSource(source)) {
            return (
                <Image
                    {...rest}
                    source={source}
                    style={{
                        width: size,
                        height: size,
                        resizeMode: 'contain',
                    }}
                />
            )
        } else if (isValidIcon(source)) {
            return (
                <MaterialIcons
                    {...rest}
                    source={source}
                    color={color}
                    size={size}
                    style={{
                        backgroundColor: 'transparent',
                    }}
                    pointerEvents="none"
                />
            );
        }
        return null;
    }
}

export default Icon;

import * as React from 'react';
import {
    Text as NativeText,
    StyleSheet
} from 'react-native';
import { withTheme } from '../../Library/themeContext';

// 普通文本
class Text extends React.Component {
    _root = null;

    setNativeProps(...args) {
        return this._root && this._root.setNativeProps(...args);
    }

    render() {
        const {
            style,
            theme,
            ...rest
        } = this.props;

        return (
            <NativeText
                {...rest}
                ref={c => {this._root = c;}}
                style={[
                    styles.text,
                    theme.textPlain,
                    style
                ]}
            />
        );
    }
}

const styles = StyleSheet.create({
    text: {
        textAlign: 'left',
    },
});

export default withTheme(Text);

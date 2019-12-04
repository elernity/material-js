import * as React from 'react';
import {
    Text,
    StyleSheet
} from 'react-native';
import { withTheme } from '../../Library/themeContext';

// 照片标题
class Caption extends React.Component {
    render() {
        const {
            style,
            theme,
            ...rest
        } = this.props;
        return (
            <Text
                {...rest}
                style={[
                    styles.caption,
                    theme.textCaption,
                    style
                ]}
            />
        );
    }
}

const styles = StyleSheet.create({
    caption: {
        textAlign: 'left',
        lineHeight: 20,
        marginVertical: 2,
    },
});

export default withTheme(Caption);

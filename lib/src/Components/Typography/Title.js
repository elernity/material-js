import * as React from 'react';
import {
    Text,
    StyleSheet
} from 'react-native';
import { withTheme } from '../../Library/themeContext';

// 标题
class Title extends React.Component {
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
                    styles.title,
                    theme.textTitle,
                    style,
                ]}
            />
        );
    }
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'left',
        lineHeight: 30,
        marginVertical: 2,
    },
});

export default withTheme(Title);

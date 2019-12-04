import * as React from 'react';
import {
    Text,
    StyleSheet
} from 'react-native';
import { withTheme } from '../../Library/themeContext';

// 新闻标题
class Headline extends React.Component {
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
                    styles.headline,
                    theme.textHeadline,
                    style,
                ]}
            />
        );
    }
}

const styles = StyleSheet.create({
    headline: {
        textAlign: 'left',
        lineHeight: 32,
        marginVertical: 2,
    },
});

export default withTheme(Headline);

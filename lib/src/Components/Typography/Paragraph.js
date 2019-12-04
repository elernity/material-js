import * as React from 'react';
import {
    Text,
    StyleSheet
} from 'react-native';
import { withTheme } from '../../Library/themeContext';

// 段落
class Paragraph extends React.Component {
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
                    styles.paragraph,
                    theme.textParagraph,
                    style,
                ]}
            />
        );
    }
}

const styles = StyleSheet.create({
    paragraph: {
        textAlign: 'left',
        lineHeight: 20,
        marginVertical: 2,
    },
});

export default withTheme(Paragraph);

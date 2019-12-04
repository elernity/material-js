import * as React from 'react';
import createThemeProvider from './createThemeProvider';
import createWithTheme from './createWithTheme';
import defaultTheme from '../../Themes/LightTheme';

const ThemeContext = React.createContext(defaultTheme);
const ThemeProvider = createThemeProvider(defaultTheme, ThemeContext);
const withTheme = createWithTheme(ThemeProvider, ThemeContext);

module.exports = {
    ThemeProvider,
    withTheme,
};

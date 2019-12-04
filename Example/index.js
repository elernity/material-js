/**
 * @format
 */

import * as React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import { ThemeProvider, LightTheme } from '@sdp.nd/material-js';
class Main extends React.Component {
    render() {
        return (
            <ThemeProvider theme={LightTheme}>
                <App />
            </ThemeProvider>
        );
    }
}

AppRegistry.registerComponent(appName, () => Main);

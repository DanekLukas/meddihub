/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App.tsx';
import { name as appName } from './app.json';
import { DbProvider } from './src/contexts/DbContext';
import { UserProvider } from './src/contexts/UserContext';
import "./global.css";

const WrappedApp = () => (
    <DbProvider>
        <UserProvider>
            <App />
        </UserProvider>
    </DbProvider>
);

AppRegistry.registerComponent(appName, () => WrappedApp);

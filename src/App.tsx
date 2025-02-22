import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import UserScreen from './screens/UserScreen';
import CameraScreen from './screens/CameraScreen';
import LoginScreen from './screens/LoginScreen';
import WeatherScreen from './screens/WeatherScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dimensions } from 'react-native';

const Tab = createBottomTabNavigator();

const App = () => {

    const Tab = createBottomTabNavigator();
    const screenOptions = {
        tabBarStyle: {
          height: 60,
          paddingVertical: 0,
          paddingRight: 16  ,
          marginLeft: - Dimensions.get('window').width / 3,
        },
      }
    const tabOptions = { headerShown: false, tabBarLabelStyle: {
        fontSize: 18,
        marginTop: -14,
      },    
    }

  return (
    <NavigationContainer>
    <Tab.Navigator initialRouteName="Login" screenOptions={screenOptions}>
        <Tab.Screen name="Login" component={LoginScreen}  options={{...tabOptions, tabBarStyle: {display: 'none'}, tabBarButton: () => null}} />
        <Tab.Screen name="User" component={UserScreen} options={tabOptions} />
        <Tab.Screen name="Camera" component={CameraScreen}  options={tabOptions} />
        <Tab.Screen name="Weather" component={WeatherScreen} options={tabOptions} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;

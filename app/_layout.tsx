import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Settings from './Settings';
import Home from './Home';
import React from 'react';


import { enableReactNativeComponents } from "@legendapp/state/config/enableReactNativeComponents";
import { TouchableOpacity } from 'react-native-gesture-handler';
import Picker from '../components/TimeCarousel/Picker';
enableReactNativeComponents();

const Drawer = createDrawerNavigator();


// TODO — Make this a legend database thing.
const colors = {
  bg: '#009955',
  transparent: 'transparent',
  active: '#990055',
  inactive: '#320122',
}

export default function RootLayout() {
  const drawerIcon = ({focused, size}: any, name: any) => {
    return (
      <MaterialIcons
        name={name}
        size={size}
        color={focused ? colors.active : colors.inactive}
      />
    )
  }

  return (
    <>
      <Picker />
      {/* <Drawer.Navigator initialRouteName="Home" screenOptions={{
          headerShown: false,
          drawerActiveBackgroundColor: colors.transparent,
          drawerInactiveBackgroundColor: colors.transparent,
          drawerActiveTintColor: colors.active,
          drawerInactiveTintColor: colors.inactive,
          overlayColor: colors.transparent,
          drawerStyle: {
            backgroundColor: colors.bg
          }
        }}>
        <Drawer.Screen
          name="Home"
          component={Home}
          options={{
            drawerIcon: options => drawerIcon(options, 'home')
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={Settings}
          options={{
            drawerIcon: options => drawerIcon(options, 'settings')
          }}
        />
      </Drawer.Navigator> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  }
});
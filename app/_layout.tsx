// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.tsx to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './Home';


const Drawer = createDrawerNavigator();

// TODO — Make this a legend database thing.
const colors = {
  bg: '#009955',
  transparent: 'transparent',
  active: '990055',
  inactive: '991111',
}

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto"/>
      <Drawer.Navigator initialRouteName="Home" screenOptions={{
          // headerShown: false,
          drawerActiveBackgroundColor: colors.transparent,
          drawerInactiveBackgroundColor: colors.transparent,
          drawerActiveTintColor: colors.active,
          drawerInactiveTintColor: colors.inactive,
          overlayColor: colors.transparent,
          drawerStyle: {
            backgroundColor: colors.bg
          }
        }}>
        <Drawer.Screen name="Home" component={Home}/>
      </Drawer.Navigator>
    </>

    // <SafeAreaView>
    //   <View>
    //     {/* Header */}
    //     <Text>Home</Text>

    //   </View>

    //   <View style={styles.container}>
    //     <DateTimePicker
    //       mode="single"
    //       date={date}
    //       onChange={(params) => setDate(params.date)}
    //     />
    //   </View>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});
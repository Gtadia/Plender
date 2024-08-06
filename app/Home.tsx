import { StyleSheet, Text, View } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { useState } from 'react';
import DrawerSceneWrapper from '../components/DrawerSceneWrapper';
import Header from '../components/Header';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import List from './tabs/List';
import Progress from './tabs/Progress';

const Tab = createMaterialTopTabNavigator();

export default function Home({navigation}) {
  const [date, setDate] = useState(dayjs());

  return (
    <DrawerSceneWrapper>
      <Header name="Home" toggleNav={navigation.openDrawer}/>
      <Tab.Navigator>
        <Tab.Screen name="List " component={List} />
        <Tab.Screen name="Calendar " component={Progress} />
      </Tab.Navigator>
    </DrawerSceneWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  }
});
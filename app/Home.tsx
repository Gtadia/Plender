import { StyleSheet, Text, View } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { useState } from 'react';
import Header from '../components/Header';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import List from './tabs/List';
import Progress from './tabs/Progress';
import BottomSheet from '../components/BottomSheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import AndroidSafeArea from '../components/AndroidSafeArea';

const Tab = createMaterialTopTabNavigator();

export default function Home({ navigation }: any) {
  const [date, setDate] = useState(dayjs());

  return (
    <SafeAreaView style={[AndroidSafeArea.AndroidSafeArea]} edges={['top', 'left', 'right']}>
      <Header name="Home" toggleNav={navigation.openDrawer} enableRightBtn={true}/>
      <Tab.Navigator>
        <Tab.Screen name="List " component={List} />
        <Tab.Screen name="Calendar " component={Progress} />
      </Tab.Navigator>

      <BottomSheet>
        <Text>Hi</Text>
      </BottomSheet>
    </SafeAreaView>
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
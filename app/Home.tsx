import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { useState } from 'react';
import DrawerSceneWrapper from '../components/DrawerSceneWrapper';
import Header from '../components/Header';


export default function Home({navigation}) {
  const [date, setDate] = useState(dayjs());

  return (
    <DrawerSceneWrapper>
      <Header name="Home" toggleNav={navigation.openDrawer}/>
      <View style={styles.container}>
        <DateTimePicker
          mode="single"
          date={date}
          onChange={(params) => setDate(params.date)}
        />
      </View>
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
import { StyleSheet, Text, View } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { useState } from 'react';
import DrawerSceneWrapper from '../components/DrawerSceneWrapper';

export default function Home() {
  const [date, setDate] = useState(dayjs());

  return (
    <DrawerSceneWrapper>
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
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { tasksState$ } from '../db/LegendApp'
import AntDesign from '@expo/vector-icons/AntDesign';
import { Dropdown } from 'react-native-element-dropdown'
// import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const TestPanel = () => {
  const [todayProg, setTodayProg] = useState('1800')
  const [todayLabel, setTodayLabel] = useState('');

  return (
    <SafeAreaView>
      <Text>TestPanel</Text>

      <TextInput
        value={todayProg}
        onChangeText={setTodayProg}
        keyboardType='numeric'
      />
      <Button title={"Change today prog"} onPress={() => tasksState$.today.data[0].time_remaining.set(Number(todayProg))} />

        {/* Change Task Label */}
      <TextInput
        value={todayLabel}
        onChangeText={setTodayLabel}
      />
      <Button title={"Change today label"} onPress={() => tasksState$.today.data[0].label.set(todayLabel)} />

      <CreateTask />

    </SafeAreaView>
  )
}

function CreateTask() {
  // TODO — These useState can be replaced with LegendApp

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [items, setItems] = useState([
    {label: 'Upcoming', value: 'upcoming'},
    {label: 'Current', value: 'current'},
    {label: 'Today', value: 'today'},
    {label: 'Completed', value: 'completed'},
    {label: 'Overdue', value: 'overdue'},
    // {label: 'Upcoming', value: tasksState$.upcoming},
    // {label: 'Current', value: tasksState$.current},
    // {label: 'Today', value: tasksState$.today},
    // {label: 'Completed', value: tasksState$.completed},
    // {label: 'Overdue', value: tasksState$.overdue},
  ])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isDaily, setIsDaily] = useState('false')
  // const [date, setDate] = useState(dayjs());
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };


  const submitHandler = () => {
    const task = {
      label: title,
      created_at: new Date(),
      due: date,
      time_goal: time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds(),
      time_remaining: 6400,    // TODO — Allow user to set this too
      description: description,
      num_breaks: 0,
      is_daily: Boolean(isDaily)
    }

    console.log(task)
    tasksState$[value].data.push(task)
  }

  return (
    <View>
        <Text>
          Adding Tasks
        </Text>

        <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={items}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select item"
        searchPlaceholder="Search..."
        value={value}
        onChange={item => {
          setValue(item.value);
        }}
        renderLeftIcon={() => (
          <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
        )}
      />
      <Text>
        Title
      </Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
      />

      <Text>
        Due Date
      </Text>
      <Button onPress={showDatepicker} title="Show time picker!" />

      <Text>
        Time Goal
      </Text>
      <Button onPress={showTimepicker} title="Show time picker!" />

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}

      {show && (
        <DateTimePicker
          testID="timePicker"
          value={time}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}

      <Text>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
      />

      {/* Set num_breaks to 0  */}

      <Text>Is it daily?</Text>
      <TextInput
        value={isDaily}
        onChangeText={setIsDaily}
      />

      <Button title={"Submit"} onPress={submitHandler} />

    </View>
  )
}

export default TestPanel

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

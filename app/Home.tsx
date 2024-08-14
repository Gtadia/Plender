import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import List from './tabs/List';
import Progress from './tabs/Progress';
import BottomSheet from '../components/BottomSheet';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AndroidSafeArea from '../components/AndroidSafeArea';
import { For, Memo, observer, Reactive, useObservable } from '@legendapp/state/react';
import Modal from '../components/Modal';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { AutoSizeText, ResizeTextMode } from 'react-native-auto-size-text';

import { observable, observe } from '@legendapp/state';
import { taskCategory$, taskTags$ } from '../db/LegendApp';

import AntDesign from '@expo/vector-icons/AntDesign';
import AddTags from '../components/Screens/Modals/AddTags';
import AddCategory from '../components/Screens/Modals/AddCategory';
import DatePicker from '../components/Screens/Modals/DatePicker';
import TimePicker from '../components/Screens/Modals/TimePicker';

const Tab = createMaterialTopTabNavigator();

var { width } = Dimensions.get('window');

export default function Home({ navigation }: any) {
  const insets = useSafeAreaInsets();


  const tagModalToggle$ = useObservable(false);
  const categoryModalToggle$ = useObservable(false);
  const dateModalToggle$ = useObservable(false);
  const timeModalToggle$ = useObservable(false);

  const dateDue$ = useObservable(dayjs());   // TODO — Allow user to choose how to format date
  const timeGoal$ = useObservable({hours: 0, minutes: 0, total: 0});
  const timeGoalDefault$ = useObservable({hours: 0, minutes: 0});

  const clearForm = () => {
    taskTags$.clear   // TODO — Does this function work (or should I just clear it here manually)
    taskCategory$.clear
  }

  const title$ = useObservable('hello');
  const repeated$ = useObservable([
    { day: 'Sunday', abbrev: 'Sun.', initial: 'S', selected: false},
    { day: 'Monday', abbrev: 'Mon.', initial: 'M', selected: false},
    { day: 'Tuesday', abbrev: 'Tues.', initial: 'T', selected: false},
    { day: 'Wednesday', abbrev: 'Wed.', initial: 'W', selected: false},
    { day: 'Thursday', abbrev: 'Thurs.', initial: 'T', selected: false},
    { day: 'Friday', abbrev: 'Fri.', initial: 'F', selected: false},
    { day: 'Saturday', abbrev: 'Sat.', initial: 'S', selected: false}
  ])

  observe(() => {
    console.log(dateDue$.get())
  })

  return (
    <SafeAreaView style={[AndroidSafeArea.AndroidSafeArea]} edges={['top', 'left', 'right']}>
      <Header name="Home" toggleNav={navigation.openDrawer} enableRightBtn={true}/>
      <Tab.Navigator>
        <Tab.Screen name="List " component={List} />
        <Tab.Screen name="Calendar " component={Progress} />
      </Tab.Navigator>

      <BottomSheet>
        {/* TODO — Check if padding is okay */}
        {/* paddingBottom: insets.bottom + (20 + 80) */}
        <View style={{ flexGrow: 1, justifyContent: 'space-between' }}>
          <ScrollView style={{marginHorizontal: 20, borderWidth: 2}}>
            <Reactive.TextInput
              $value={title$}
              style={styles.taskInput}
              placeholder="Title"
              />
              {/* TODO — Needs to avoid keyboard (KeyboardAvoidingView) (JUST MOVE THIS TEXT-INPUT UP)*/}

                <TouchableOpacity
                  onPress={() => tagModalToggle$.set(true)}
                  >
                  <Text>+ Tags</Text>
                </TouchableOpacity>
                <For each={taskTags$.selected} optimized>
                {item$ => (
                    <Text>
                        {taskTags$.list[item$.get() - 1].label.get()}
                    </Text>
                )}
              </For>


            <Text>Category</Text>
            <TouchableOpacity
              onPress={() => categoryModalToggle$.set(true)}
              >
                <AutoSizeText
                  fontSize={18}
                  numberOfLines={1}
                  mode={ResizeTextMode.max_lines}
                  >
                    <Memo>{() => taskCategory$.selected.label.get()}</Memo>
                  </AutoSizeText>
              </TouchableOpacity>

            <Text>Due</Text>
            <TouchableOpacity
              onPress={() => dateModalToggle$.set(true)}
              >
                <AutoSizeText
                  fontSize={18}
                  numberOfLines={1}
                  mode={ResizeTextMode.max_lines}>
                    <Memo>{() => dateDue$.get().format('MMM DD, YYYY')}</Memo>
                  </AutoSizeText>
              </TouchableOpacity>

            <Text>Time Goal</Text>
            <TouchableOpacity
              onPress={() => {
                timeModalToggle$.set(true)
                timeGoalDefault$.assign({
                  hours: timeGoal$.hours.get(),
                  minutes: timeGoal$.minutes.get()
                })
              }}
              >
                <AutoSizeText
                  fontSize={18}
                  numberOfLines={1}
                  mode={ResizeTextMode.max_lines}>
                    <Memo>{() => `${timeGoal$.hours.get()} : ${timeGoal$.minutes.get()}`}</Memo>
                  </AutoSizeText>
              </TouchableOpacity>

            <Text>Repeated</Text>
            <View style={{flexDirection: 'row'}}>
              <For each={repeated$} optimized>
                {item$ => (
                  <TouchableOpacity>
                    <Text>
                        {item$.initial.get()}
                    </Text>
                  </TouchableOpacity>
                )}
              </For>
            </View>

              <Text><Memo>{() => title$.get()}</Memo></Text>
          </ScrollView>

            {/* TODO — Clamp the width to about 1000 px */}
            {/* TODO — Clear the form when pressed*/}
            <TouchableOpacity
              style={{width: width - 40, height: 80, borderRadius: 15, backgroundColor: 'red', marginHorizontal: 20, marginTop: 20, marginBottom: insets.bottom, justifyContent: 'center', alignItems: 'center'}}
              onPress={() => {
                // TODO — Clear Selected Category,
              }}

              >
              <AutoSizeText
                fontSize={32}
                numberOfLines={1}
                mode={ResizeTextMode.max_lines}
                >
                Add Task
              </AutoSizeText>
            </TouchableOpacity>
        </View>
      </BottomSheet>

      <Memo>
        {() => (
          <Modal
            isOpen={tagModalToggle$.get()}
            withInput
            // onRequestClose={() => {
            //   tagModalToggle$.set(false)
            // }}
            >
              <AddTags modalToggle={tagModalToggle$} />
          </Modal>
        )}
      </Memo>

      <Memo>
        {() => (
          <Modal
            isOpen={categoryModalToggle$.get()}
            withInput
            >
              <AddCategory modalToggle={categoryModalToggle$} />
          </Modal>
        )}
      </Memo>

      <Memo>
        {() => (
          <Modal
            isOpen={dateModalToggle$.get()}
            >
              <DatePicker modalToggle={dateModalToggle$} date={dateDue$} />
            </Modal>
        )}
      </Memo>

      <Memo>
        {() => (
          <Modal
            isOpen={timeModalToggle$.get()}
            >
              <TimePicker modalToggle={timeModalToggle$} time={timeGoal$} timeDefault={timeGoalDefault$} />
            </Modal>
        )}
      </Memo>
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
  },
  taskInput: {
    fontSize: 24,
    fontFamily: ''
  },
});
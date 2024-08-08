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
import { For, Memo, Reactive, useObservable } from '@legendapp/state/react';
import Modal from '../components/Modal';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

const Tab = createMaterialTopTabNavigator();

var { width } = Dimensions.get('window');

export default function Home({ navigation }: any) {
  const insets = useSafeAreaInsets();


  const isModalOpen$ = useObservable(false);
  const createTagTitle$ = useObservable('');

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
          <ScrollView style={{borderWidth: 2}}>
            <Reactive.TextInput
              $value={title$}
              style={styles.taskInput}
              placeholder="Title"
              />
              {/* TODO — Needs to avoid keyboard (KeyboardAvoidingView) (JUST MOVE THIS TEXT-INPUT UP)*/}

                <TouchableOpacity
                  onPress={() => isModalOpen$.set(true)}
                  >
                  <Text>+ Tags</Text>
                </TouchableOpacity>

            <Text>Category</Text>
            <TouchableOpacity>
                <Text>No Category</Text>
              </TouchableOpacity>

            <Text>Due</Text>
            <TouchableOpacity>
                <Text>Aug 7</Text>
              </TouchableOpacity>

            <Text>Time Goal</Text>
            <TouchableOpacity>
                <Text>4:30</Text>
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
            <TouchableOpacity style={{width: width - 40, height: 80, borderRadius: 15, backgroundColor: 'red', marginHorizontal: 20, marginTop: 20, marginBottom: insets.bottom}}>
              <Text>Add Task</Text>
            </TouchableOpacity>
        </View>
      </BottomSheet>

      <Memo>
        {() => (
          <Modal
            isOpen={isModalOpen$.get()}
            withInput
            // onRequestClose={() => {
            //   isModalOpen$.set(false)
            // }}
            >
            <View style={{width: width - (16 * 2), height: 'auto', padding: 16, borderRadius: 16, backgroundColor: 'white'}}>
              <Text>Create Tag</Text>
              <Text>#</Text>
              <Reactive.TextInput
                $value={createTagTitle$}
                placeholder="Tag"
                />

              <TouchableOpacity
                onPress={() => {
                  isModalOpen$.set(false)
                }}
                >
                <Text>Close</Text>
              </TouchableOpacity>

            </View>
          </Modal>
        )}
      </Memo>

      {/* <Memo>
        {() => (

        )}
      </Memo> */}
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

  }
});
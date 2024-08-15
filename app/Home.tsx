import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import List from "./tabs/List";
import Progress from "./tabs/Progress";
import BottomSheet from "../components/BottomSheet";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AndroidSafeArea from "../components/AndroidSafeArea";
import { For, Memo, Reactive, useObservable } from "@legendapp/state/react";
import Modal from "../components/Modal";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { observable, observe } from "@legendapp/state";
import {
  openAddMenu$,
  taskCategory$,
  taskTags$,
  todayTasks$,
} from "../db/LegendApp";

import AntDesign from "@expo/vector-icons/AntDesign";

import AddTags from "../components/Screens/Modals/AddTags";
import AddCategory from "../components/Screens/Modals/AddCategory";
import DatePicker from "../components/Screens/Modals/DatePicker";
import TimePicker from "../components/Screens/Modals/TimePicker";

var isToday = require("dayjs/plugin/isToday");
// import isToday from 'dayjs/plugin/isToday' // ES 2015

const Tab = createMaterialTopTabNavigator();
const constants = {
  primaryFontSize: 24,
  secondaryFontSize: 16,

  smallPadding: 8,
  regularPadding: 16,
  errorPadding: 20,

  pillPaddingVertical: 8,
  pillPaddingHorizontal: 12,

  smallRadius: 8,
  regularRadius: 16,
};

var { width } = Dimensions.get("window");

export default function Home({ navigation }: any) {
  dayjs.extend(isToday);
  const insets = useSafeAreaInsets();

  const closeSheet$ = useObservable(false);
  const tagModalToggle$ = useObservable(false);
  const categoryModalToggle$ = useObservable(false);
  const dateModalToggle$ = useObservable(false);
  const timeModalToggle$ = useObservable(false);

  const title$ = useObservable("");
  const tags$ = useObservable([]);
  const category$ = useObservable(taskCategory$.list[0].get());
  const dateDue$ = useObservable(dayjs()); // TODO — Allow user to choose how to format date
  const dateCreated$ = useObservable(dayjs());
  const timeGoal$ = useObservable({ hours: 0, minutes: 0, total: 0 });
  const timeGoalDefault$ = useObservable({ hours: 0, minutes: 0 });
  const repeated$ = useObservable([
    { day: "Sunday", abbrev: "Sun.", initial: "S", selected: false },
    { day: "Monday", abbrev: "Mon.", initial: "M", selected: false },
    { day: "Tuesday", abbrev: "Tues.", initial: "T", selected: false },
    { day: "Wednesday", abbrev: "Wed.", initial: "W", selected: false },
    { day: "Thursday", abbrev: "Thurs.", initial: "T", selected: false },
    { day: "Friday", abbrev: "Fri.", initial: "F", selected: false },
    { day: "Saturday", abbrev: "Sat.", initial: "S", selected: false },
  ]);

  const clearForm = () => {
    title$.set("");
    tags$.set([]); // TODO — Does this function work (or should I just clear it here manually)
    category$.set(taskCategory$.list[0].get());
    timeGoal$.set({ hours: 0, minutes: 0, total: 0 });
    timeGoalDefault$.set({ hours: 0, minutes: 0 });
    dateDue$.set(dayjs()); // TODO — Actually set dateDue() everytime + is pressed
    repeated$.set([
      { day: "Sunday", abbrev: "Sun.", initial: "S", selected: false },
      { day: "Monday", abbrev: "Mon.", initial: "M", selected: false },
      { day: "Tuesday", abbrev: "Tues.", initial: "T", selected: false },
      { day: "Wednesday", abbrev: "Wed.", initial: "W", selected: false },
      { day: "Thursday", abbrev: "Thurs.", initial: "T", selected: false },
      { day: "Friday", abbrev: "Fri.", initial: "F", selected: false },
      { day: "Saturday", abbrev: "Sat.", initial: "S", selected: false },
    ]);
  };

  const createTask = () => {
    // There is no error for .isToday()
    if (dateDue$.get().isToday()) {
      todayTasks$.data.push({
        title: title$.get(),
        tags: tags$.get(),
        category: category$.get(), // TODO — Does clearing get rid of category -> Yes it does
        due: dateDue$.get(), // TODO — This is a DAYJS() object!!!
        created: dateCreated$.get(),
        time_goal: timeGoal$.get(),
        time_spent: { hours: 0, minutes: 0, seconds: 0, total: 0 },
        repeated: repeated$.get(),
      });
    }
  };

  observe(() => {
    console.log(dateDue$.get());
  });

  const TitleView = (
    <>
      <View style={{ alignSelf: "flex-start" }}>
        {/* TODO — The Text input font size should be bigger than the subcategories */}
        <Reactive.TextInput
          $value={title$}
          style={styles.taskInput}
          placeholder="Title"
        />
      </View>
      {/* TODO — Needs to avoid keyboard (KeyboardAvoidingView) (JUST MOVE THIS TEXT-INPUT UP)*/}
    </>
  );

  const TagsView = (
    <>
      <For each={tags$} optimized>
        {(item$) => (
          <Text>{taskTags$.list[item$.get() - 1].label.get()}</Text>
          // TODO — Touchable Opacity to pop-up delete panel
        )}
      </For>
      <View style={{ alignSelf: "flex-start" }}>
        <TouchableOpacity onPress={() => tagModalToggle$.set(true)}>
          <AutoSizeText
            fontSize={constants.secondaryFontSize}
            numberOfLines={1}
            mode={ResizeTextMode.max_lines}
            style={[styles.grayedText]}
          >
            +Tag(s)
          </AutoSizeText>
        </TouchableOpacity>
      </View>
    </>
  );

  const CategoryView = (
    <>
      <AutoSizeText
        fontSize={constants.primaryFontSize}
        numberOfLines={1}
        mode={ResizeTextMode.max_lines}
        style={{ paddingTop: constants.regularPadding }}
      >
        Category
      </AutoSizeText>
      <View style={styles.alignSelf}>
        <TouchableOpacity
          onPress={() => categoryModalToggle$.set(true)}
          style={[styles.pillTouchable, { backgroundColor: "purple" }]}
          // TODO — Change the background color ('wrap all of TouchableOpacity in Memo')
          // TODO — Fixed width (ADD CHARACTER LIMIT)
        >
          <AutoSizeText
            fontSize={constants.secondaryFontSize}
            numberOfLines={1}
            mode={ResizeTextMode.max_lines}
            style={styles.pillPadding}
          >
            {/* TODO — Character Limit */}
            <Memo>{() => category$.label.get()}</Memo>
          </AutoSizeText>
        </TouchableOpacity>
      </View>
    </>
  );

  const DueView = (
    <>
      <AutoSizeText
        fontSize={constants.primaryFontSize}
        numberOfLines={1}
        mode={ResizeTextMode.max_lines}
        style={{ paddingTop: constants.regularPadding }}
      >
        Due
      </AutoSizeText>
      <View style={styles.alignSelf}>
        <TouchableOpacity
          onPress={() => dateModalToggle$.set(true)}
          style={[styles.pillTouchable, styles.pillOutline]}
        >
          <AutoSizeText
            fontSize={constants.secondaryFontSize}
            numberOfLines={1}
            mode={ResizeTextMode.max_lines}
            style={styles.pillPadding}
          >
            <Memo>{() => dateDue$.get().format("MMM DD, YYYY")}</Memo>
          </AutoSizeText>
        </TouchableOpacity>
      </View>
    </>
  );

  const TimeGoalView = (
    <>
      <AutoSizeText
        fontSize={constants.primaryFontSize}
        numberOfLines={1}
        mode={ResizeTextMode.max_lines}
        style={{ paddingTop: constants.regularPadding }}
      >
        Time Goal
      </AutoSizeText>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styles.alignSelf}>
          <TouchableOpacity
            onPress={() => {
              timeModalToggle$.set(true);
              timeGoalDefault$.assign({
                hours: timeGoal$.hours.get(),
                minutes: timeGoal$.minutes.get(),
              });
            }}
            style={[styles.pillTouchable, styles.pillOutline]}
          >
            <AutoSizeText
              fontSize={18}
              numberOfLines={1}
              mode={ResizeTextMode.max_lines}
              style={styles.pillPadding}
            >
              <Memo>
                {() => `${timeGoal$.hours.get()} : ${timeGoal$.minutes.get()}`}
              </Memo>
            </AutoSizeText>
          </TouchableOpacity>
        </View>

        <MaterialIcons
          name="error"
          size={24}
          color="red"
          style={{ padding: constants.errorPadding }}
        />
      </View>
    </>
  );

  const RepeatView = (
    <>
      <AutoSizeText
        fontSize={constants.primaryFontSize}
        numberOfLines={1}
        mode={ResizeTextMode.max_lines}
        style={{ paddingTop: constants.regularPadding }}
      >
        Repeat
      </AutoSizeText>

      <View
        style={[
          {
            borderRadius: constants.smallRadius,
            flexDirection: "row",
            justifyContent: "space-around",
          },
          styles.pillOutline,
          styles.pillPadding,
        ]}
      >
        <For each={repeated$} optimized>
          {(item$) => (
            <TouchableOpacity>
              <Text>{item$.initial.get()}</Text>
            </TouchableOpacity>
          )}
        </For>
      </View>
    </>
  );

  const AddTaskButton = (
    <>
      {/* TODO — Clamp the width to about 1000 px */}
      {/* TODO — Clear the form when pressed*/}
      {/* Submit Button / Add Task Button */}
      <TouchableOpacity
        style={{
          width: "100%",
          height: 80,
          borderRadius: 15,
          backgroundColor: "red",
          marginTop: 20,
          marginBottom: insets.bottom,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          // TODO — Clear Selected Category,
          dateCreated$.set(dayjs());
          createTask();
          clearForm();
          closeSheet$.set((prev) => !prev);
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
    </>
  );

  const CreateTaskPage = (
    // TODO — Check if padding is okay
    // paddingBottom: insets.bottom + (20 + 80)
    <ScrollView>
      <View style={{ marginHorizontal: 20, borderWidth: 2 }}>
        {TitleView}
        {TagsView}
        {CategoryView}
        {DueView}
        {TimeGoalView}
        {RepeatView}

        {AddTaskButton}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView
      style={[AndroidSafeArea.AndroidSafeArea]}
      edges={["top", "left", "right"]}
    >
      <Header
        name="Home"
        toggleNav={navigation.openDrawer}
        enableRightBtn={true}
        setNewDueDate={dateDue$}
      />
      <Tab.Navigator>
        <Tab.Screen name="List " component={List} />
        <Tab.Screen name="Calendar " component={Progress} />
      </Tab.Navigator>

      <BottomSheet close={closeSheet$}>{CreateTaskPage}</BottomSheet>

      <Memo>
        {() => (
          <Modal
            isOpen={tagModalToggle$.get()}
            withInput
            // onRequestClose={() => {
            //   tagModalToggle$.set(false)
            // }}
          >
            <AddTags modalToggle={tagModalToggle$} tags={tags$} />
          </Modal>
        )}
      </Memo>

      <Memo>
        {() => (
          <Modal isOpen={categoryModalToggle$.get()} withInput>
            <AddCategory
              modalToggle={categoryModalToggle$}
              category={category$}
            />
          </Modal>
        )}
      </Memo>

      <Memo>
        {() => (
          <Modal isOpen={dateModalToggle$.get()}>
            <DatePicker modalToggle={dateModalToggle$} date={dateDue$} />
          </Modal>
        )}
      </Memo>

      <Memo>
        {() => (
          <Modal isOpen={timeModalToggle$.get()}>
            <TimePicker
              modalToggle={timeModalToggle$}
              time={timeGoal$}
              timeDefault={timeGoalDefault$}
            />
          </Modal>
        )}
      </Memo>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5FCFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  taskInput: {
    fontSize: 24,
    fontFamily: "",
  },
  grayedText: {
    color: "#B5B5B5",
  },
  pillPadding: {
    paddingVertical: constants.pillPaddingVertical,
    paddingHorizontal: constants.pillPaddingHorizontal,
  },
  pillTouchable: {
    borderRadius: constants.smallRadius,
    minWidth: 85,
    justifyContent: "center",
    alignItems: "center",
  },
  alignSelf: {
    alignSelf: "flex-start",
    paddingTop: constants.smallPadding,
  },
  pillOutline: {
    borderWidth: 2,
    borderColor: "black",
  },
});

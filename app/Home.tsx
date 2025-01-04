import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import dayjs from "dayjs";
import Header from "../components/Header";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BottomSheet from "../components/BottomSheet";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AndroidSafeArea from "../components/AndroidSafeArea";
import { For, Memo, Reactive, useObservable } from "@legendapp/state/react";
import Modal from "../components/Modal";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Observable, observable, observe } from "@legendapp/state";
import {
  overdueTasks$,
  taskCategory$,
  taskTags$,
  todayTasks$,
  upcomingTasks$,
} from "../db/LegendApp";

import AddTags from "../components/Screens/Modals/AddTags";
import AddCategory from "../components/Screens/Modals/AddCategory";
import DatePicker from "../components/Screens/Modals/DatePicker";
import TimePicker from "../components/Screens/Modals/TimePicker";
import { constants, fontSizes, padding } from "../constants/style";
import Calendar from "./tabs/Calendar";
import TopTab from "../components/TopTab";
import { addEvent } from "../utils/database";
import { useSQLiteContext } from "expo-sqlite";
import { Tags$, Categories$ } from "../utils/stateManager";
import { newEvent$, toggle$ } from "../utils/newEventState";

var isToday = require("dayjs/plugin/isToday");
// import isToday from 'dayjs/plugin/isToday' // ES 2015

const Tab = createMaterialTopTabNavigator();

var { width } = Dimensions.get("window");

export default function Home({ navigation }: any) {
  const db = useSQLiteContext();
  dayjs.extend(isToday);
  const insets = useSafeAreaInsets();

  const clearForm = () => {
    newEvent$.set({
      label: "",
      description: "",
      tags: [],
      category: 0,
      due_date: dayjs(),
      goal_time: 0,
    });
  };

  const createTask = () => {
    const event = {
      label: newEvent$.label.get(),
      description: newEvent$.description.get(),
      tags: newEvent$.tags.get(), // number[]
      category: newEvent$.category.get(), // number
      due_date: newEvent$.due_date.get(), // TODO — This is a DAYJS() object!!!
      created_date: dayjs(),
      goal_time: newEvent$.goal_time.get(),
      progress_time: 0,
    };

    async () => {
      await addEvent(db, event);
    };
  };

  /**
   * Title View
   */
  const TitleView = (
    <>
      <View style={{ alignSelf: "flex-start" }}>
        {/* TODO — The Text input font size should be bigger than the subcategories */}
        <Reactive.TextInput
          $value={newEvent$.label}
          style={styles.taskInput}
          placeholder="Title"
        />
      </View>
      {/* TODO — Needs to avoid keyboard (KeyboardAvoidingView) (JUST MOVE THIS TEXT-INPUT UP)*/}
    </>
  );

  /**
   * Tag View
   *
   * WARNING:
   * id == 0  does not get read by the `For Each` loop.
   * Make sure that SQLite starts the id at 1.
   */
  const TagsView = (
    <>
      <View style={{ flexDirection: "row", width: "100%", flexWrap: "wrap" }}>
        <For each={newEvent$.tags} optimized>
          {(item$: Observable<number>) => (
            <View style={{ marginRight: 15 }}>
              <Text
                style={[
                  { color: Tags$.list[item$.get()].color.get() },
                  { fontSize: fontSizes.regular, fontWeight: "600" },
                ]}
              >
                # {Tags$.list[item$.get()].label.get()}
              </Text>
            </View>
            // TODO — Touchable Opacity to pop-up delete panel
          )}
        </For>
      </View>
      <View style={{ alignSelf: "flex-start", marginTop: 5 }}>
        <TouchableOpacity onPress={() => toggle$.tagModal.set(true)}>
          <AutoSizeText
            fontSize={fontSizes.regular}
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
        fontSize={fontSizes.big}
        numberOfLines={1}
        mode={ResizeTextMode.max_lines}
        style={{ paddingTop: constants.regular, fontWeight: "bold" }}
      >
        Category
      </AutoSizeText>
      <View style={styles.alignSelf}>
        <Memo>
          {() => (
            <TouchableOpacity
              onPress={() => toggle$.categoryModal.set(true)}
              style={[
                styles.pillTouchable,
                {
                  backgroundColor:
                    Categories$.list[newEvent$.category.get()].color.get(),
                },
              ]}
              // TODO — Change the background color ('wrap all of TouchableOpacity in Memo')
              // TODO — Fixed width (ADD CHARACTER LIMIT)
            >
              <AutoSizeText
                fontSize={fontSizes.regular}
                numberOfLines={1}
                mode={ResizeTextMode.max_lines}
                style={[
                  styles.pillPadding,
                  { color: "white", fontSize: 18, fontWeight: "bold" },
                ]}
              >
                {/* TODO — Character Limit */}
                {Categories$.list[newEvent$.category.get()].label.get()}
              </AutoSizeText>
            </TouchableOpacity>
          )}
        </Memo>
      </View>
    </>
  );

  const DueView = (
    <>
      <AutoSizeText
        fontSize={fontSizes.big}
        numberOfLines={1}
        mode={ResizeTextMode.max_lines}
        style={{ paddingTop: constants.regular, fontWeight: "bold" }}
      >
        Due
      </AutoSizeText>
      <View style={styles.alignSelf}>
        <TouchableOpacity
          onPress={() => toggle$.dateModal.set(true)}
          style={[styles.pillTouchable, styles.pillOutline]}
        >
          <AutoSizeText
            fontSize={fontSizes.regular}
            numberOfLines={1}
            mode={ResizeTextMode.max_lines}
            style={[styles.pillPadding, { fontWeight: "bold" }]}
          >
            <Memo>{() => newEvent$.due_date.get().format("MMM DD, YYYY")}</Memo>
          </AutoSizeText>
        </TouchableOpacity>
      </View>
    </>
  );

  const TimeGoalView = (
    <>
      <AutoSizeText
        fontSize={fontSizes.big}
        numberOfLines={1}
        mode={ResizeTextMode.max_lines}
        style={{ paddingTop: constants.regular, fontWeight: "bold" }}
      >
        Time Goal
      </AutoSizeText>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styles.alignSelf}>
          <TouchableOpacity
            onPress={() => {
              toggle$.timeModal.set(true);
            }}
            style={[styles.pillTouchable, styles.pillOutline]}
          >
            <AutoSizeText
              fontSize={fontSizes.regular}
              numberOfLines={1}
              mode={ResizeTextMode.max_lines}
              style={[styles.pillPadding, { fontWeight: "bold" }]}
            >
              <Memo>
                {() => {
                  const time = newEvent$.goal_time.get();
                  const hours = Math.floor(time / 3600);
                  const minutes = Math.floor((time % 3600) / 60);

                  console.warn(hours, minutes, time);

                  return `${hours} : ${minutes < 10 ? `0${minutes}` : minutes}`;
                }}
              </Memo>
            </AutoSizeText>
          </TouchableOpacity>
        </View>

        <MaterialIcons
          name="error"
          size={24}
          color="red"
          style={{ padding: constants.error }}
        />
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
          height: 70,
          paddingVertical: constants.regular,
          borderRadius: 15,
          backgroundColor: "red",
          marginBottom: insets.bottom,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          // TODO — Clear Selected Category,
          createTask();
          clearForm();
          toggle$.closeSheet.set((prev) => !prev);
        }}
      >
        <AutoSizeText
          fontSize={fontSizes.title}
          numberOfLines={1}
          mode={ResizeTextMode.max_lines}
          style={{ color: "white", fontWeight: "bold" }}
        >
          Add Task
        </AutoSizeText>
      </TouchableOpacity>
    </>
  );

  const CreateTaskPage = (
    // TODO — Check if padding is okay
    // paddingBottom: insets.bottom + (20 + 80)
    <View style={{ flex: 1 }}>
      <ScrollView style={[{ overflow: "visible" }]}>
        <View style={{ marginHorizontal: 20 }}>
          {TitleView}
          {TagsView}
          {CategoryView}
          {DueView}
          {TimeGoalView}
        </View>
      </ScrollView>

      <View style={{ marginHorizontal: 20 }}>{AddTaskButton}</View>
    </View>
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
        setNewDueDate={newEvent$.due_date}
      />
      <View style={{ height: padding.regularPlus }} />
      <TopTab />

      <BottomSheet close={toggle$.closeSheet}>{CreateTaskPage}</BottomSheet>

      <Memo>
        {() => (
          <Modal
            isOpen={toggle$.tagModal.get()}
            withInput
            // onRequestClose={() => {
            //   toggle$.tagModal.set(false)
            // }}
          >
            <AddTags />
          </Modal>
        )}
      </Memo>

      <Memo>
        {() => (
          <Modal isOpen={toggle$.categoryModal.get()} withInput>
            <AddCategory />
          </Modal>
        )}
      </Memo>

      <Memo>
        {() => (
          <Modal isOpen={toggle$.dateModal.get()}>
            <DatePicker />
          </Modal>
        )}
      </Memo>

      <Memo>
        {() => (
          <Modal isOpen={toggle$.timeModal.get()}>
            <TimePicker />
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
    fontSize: fontSizes.title,
    fontFamily: "",
    fontWeight: "bold",
  },
  grayedText: {
    color: "#B5B5B5",
  },
  pillPadding: {
    paddingVertical: constants.pillPaddingVertical,
    paddingHorizontal: constants.pillPaddingHorizontal,
  },
  pillTouchable: {
    borderRadius: constants.smallPlus,
    minWidth: 85,
    justifyContent: "center",
    alignItems: "center",
  },
  alignSelf: {
    alignSelf: "flex-start",
    paddingTop: constants.small,
  },
  pillOutline: {
    borderWidth: 2,
    borderColor: "black",
  },
});

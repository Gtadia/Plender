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

import { observe } from "@legendapp/state";
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

var isToday = require("dayjs/plugin/isToday");
// import isToday from 'dayjs/plugin/isToday' // ES 2015

const Tab = createMaterialTopTabNavigator();

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
  const category$ = useObservable(0);
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
    category$.set(0);
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
    console.log(
      "This is it ",
      dateDue$.get().format("YY, MM, DD") > dayjs().format("YY, MM, DD")
    );
    // console.log("This is it ", dateDue$.get().diff(dayjs(), "day"));
    if (dateDue$.get().isToday()) {
      todayTasks$.data.push({
        title: title$.get(),
        tags: tags$.get(),
        category: taskCategory$.list[category$.get()], // TODO — Does clearing get rid of category -> Yes it does
        due: dateDue$.get(), // TODO — This is a DAYJS() object!!!
        created: dateCreated$.get(),
        time_goal: timeGoal$.get(),
        time_spent: { hours: 0, minutes: 0, seconds: 0, total: 0 },
        repeated: repeated$.get(),
      });
    } else if (
      dateDue$.get().format("YY, MM, DD") > dayjs().format("YY, MM, DD")
    ) {
      upcomingTasks$.data.push({
        title: title$.get(),
        tags: tags$.get(),
        category: taskCategory$.list[category$.get()], // TODO — Does clearing get rid of category -> Yes it does
        due: dateDue$.get(), // TODO — This is a DAYJS() object!!!
        created: dateCreated$.get(),
        time_goal: timeGoal$.get(),
        time_spent: { hours: 0, minutes: 0, seconds: 0, total: 0 },
        repeated: repeated$.get(),
      });
    } else if (
      dateDue$.get().format("YY, MM, DD") < dayjs().format("YY, MM, DD")
    ) {
      overdueTasks$.data.push({
        title: title$.get(),
        tags: tags$.get(),
        category: taskCategory$.list[category$.get()], // TODO — Does clearing get rid of category -> Yes it does
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
      <View style={{ flexDirection: "row", width: "100%", flexWrap: "wrap" }}>
        <For each={tags$} optimized>
          {(item$) => (
            <View style={{ marginRight: 15 }}>
              <Text
                style={[
                  { color: taskTags$.list[item$.get() - 1].color.get() },
                  { fontSize: fontSizes.regular, fontWeight: "600" },
                ]}
              >
                # {taskTags$.list[item$.get() - 1].label.get()}
              </Text>
            </View>
            // TODO — Touchable Opacity to pop-up delete panel
          )}
        </For>
      </View>
      <View style={{ alignSelf: "flex-start", marginTop: 5 }}>
        <TouchableOpacity onPress={() => tagModalToggle$.set(true)}>
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
              onPress={() => categoryModalToggle$.set(true)}
              style={[
                styles.pillTouchable,
                {
                  backgroundColor:
                    taskCategory$.list[category$.get()].color.get(),
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
                {taskCategory$.list[category$.get()].label.get()}
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
          onPress={() => dateModalToggle$.set(true)}
          style={[styles.pillTouchable, styles.pillOutline]}
        >
          <AutoSizeText
            fontSize={fontSizes.regular}
            numberOfLines={1}
            mode={ResizeTextMode.max_lines}
            style={[styles.pillPadding, { fontWeight: "bold" }]}
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
              timeModalToggle$.set(true);
              timeGoalDefault$.assign({
                hours: timeGoal$.hours.get(),
                minutes: timeGoal$.minutes.get(),
              });
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
                {() =>
                  `${timeGoal$.hours.get()} : ${
                    timeGoal$.minutes.get() < 10 ? "0" : ""
                  }${timeGoal$.minutes.get()}`
                }
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
          dateCreated$.set(dayjs());
          createTask();
          clearForm();
          closeSheet$.set((prev) => !prev);
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
        setNewDueDate={dateDue$}
      />
      <View style={{ height: padding.regularPlus }} />
      <TopTab />

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

import {
  FlatList,
  LayoutAnimation,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import {
  For,
  Memo,
  observer,
  Reactive,
  Show,
  useObservable,
} from "@legendapp/state/react";
import {
  currentTask$,
  dateToday$,
  overdueTasks$,
  todayTasks$,
  upcomingTasks$,
} from "../../db/LegendApp";

import AntDesign from "@expo/vector-icons/AntDesign";
import Card from "../../components/ui/Card";
import BottomSheet from "../../components/BottomSheet";
import { constants } from "../../constants/style";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import { ScrollView } from "react-native-gesture-handler";

var { width, height } = Dimensions.get("window");

const RADIUS = 30;
const DIAMETER = 2 * RADIUS;

const List = observer(() => {
  return (
    <>
      <ScrollView style={styles.container}>
        <View
          style={{ alignItems: "center", padding: constants.regularPadding }}
        >
          <Memo>
            {() => <Text>{dateToday$.get().format("ddd, MMM DD")}</Text>}
          </Memo>
        </View>

        <ItemList task={todayTasks$} />
        <ItemList task={overdueTasks$} />
        <ItemList task={upcomingTasks$} />

        {/* TODO — Come up with a better solution later... */}
        <View style={styles.taskBannerDimension} />
      </ScrollView>
      <View style={[styles.absBottom]}>
        {currentTask$.get() && (
          // true &&
          <Pressable
            style={[styles.taskBannerDimension, styles.taskBannerStyle]}
            onPress={() => console.log("hello")}
          >
            <Text>{currentTask$.title.get()}</Text>
            {/* <Text>{currentTask$.tags.get()}</Text> */}
            <Text>{currentTask$.time_goal.total.get()}</Text>
            <Text>{currentTask$.time_spent.total.get()}</Text>
          </Pressable>
        )}
      </View>
    </>
  );
});

function ItemList({ task }: any) {
  const show$ = useObservable(true);
  const onPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    show$.set((prev) => !prev);
  };

  if (task.data.get().length == 0) {
    return;
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.flexRow, { paddingLeft: 15 }]}
        onPress={onPress}
      >
        <Text>
          <Memo>{() => task.title.get()}</Memo>
        </Text>
        <Memo>
          {() =>
            show$.get() ? (
              <AntDesign name="caretdown" size={24} color="black" />
            ) : (
              <AntDesign name="caretup" size={24} color="black" />
            )
          }
        </Memo>
      </TouchableOpacity>

      <Show if={show$} else={<></>}>
        {() => (
          <View
            style={[styles.item, !show$.get() && { height: 40 }]}
            // activeOpacity={1}
          >
            <Memo>
              {() => (
                <For each={task.data}>
                  {(item$) => <Item item={item$.get()} />}
                </For>
              )}
            </Memo>
          </View>
        )}
      </Show>
    </>
  );
}

function Item({ item }: any) {
  // TODO — MAKE SURE ITEM UPDATES WHEN VALUES ARE UPDATED
  return (
    <View
      style={{
        height: 80,
        backgroundColor: "gray",
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        justifyContent: "space-between",
        margin: 7,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: DIAMETER,
            height: DIAMETER,
            backgroundColor: "pink",
            borderRadius: RADIUS,
          }}
        >
          {/* Play Button Icon */}
        </View>

        <View style={[itemStyles.middleSection]}>
          <AutoSizeText
            fontSize={constants.secondaryPlusFontSize}
            numberOfLines={1}
            mode={ResizeTextMode.max_lines}
            style={[itemStyles.title]}
          >
            {item.title}
          </AutoSizeText>

          <View
            style={[
              itemStyles.categoryPill,
              {
                backgroundColor: "purple",
              },
            ]}
          >
            {/* TODO — Get the background color of each category */}
            <AutoSizeText
              fontSize={constants.secondaryFontSize}
              numberOfLines={1}
              mode={ResizeTextMode.max_lines}
              style={[itemStyles.categoryText]}
            >
              {item.category.label}
            </AutoSizeText>
          </View>
        </View>
      </View>

      <View style={[itemStyles.rightSection]}>
        <View>
          <Reactive.Text style={[itemStyles.time_spent]}>
            {item.time_spent.hours > 9
              ? item.time_spent.hours
              : `0${item.time_spent.hours}`}
            :
            {item.time_spent.minutes > 9
              ? item.time_spent.minutes
              : `0${item.time_spent.minutes}`}
            :
            {item.time_spent.seconds > 9
              ? item.time_spent.seconds
              : `0${item.time_spent.seconds}`}
          </Reactive.Text>
        </View>

        <View>
          <Reactive.Text style={[itemStyles.time_goal]}>
            {item.time_goal.hours > 9
              ? item.time_goal.hours
              : `0${item.time_goal.hours}`}
            :
            {item.time_goal.minutes > 9
              ? item.time_goal.minutes
              : `0${item.time_goal.minutes}`}
            :00
          </Reactive.Text>
        </View>
      </View>
    </View>
  );
}

export default List;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // backgroundColor: "blue",
  },
  flexRow: {
    flexDirection: "row",
  },
  item: {
    width: "100%",
    paddingHorizontal: 20,
    overflow: "hidden",
    paddingVertical: 10,
    marginBottom: 5,
  },

  absBottom: {
    position: "absolute",
    bottom: 0,
  },
  taskBannerDimension: {
    width: width,
    height: 120,
  },
  taskBannerStyle: {
    backgroundColor: "green",
  },
});

const itemStyles = StyleSheet.create({
  middleSection: {
    paddingHorizontal: constants.smallPadding,
    // justifyContent: "center",
    justifyContent: "space-between",
    height: DIAMETER - 5,
  },
  title: {
    fontWeight: "700",
  },
  categoryPill: {
    borderRadius: 13,
    minWidth: 50,
    maxWidth: 100,
    justifyContent: "center",
    alignItems: "center",
    height: 25,
  },
  categoryText: {
    paddingHorizontal: 8,
    fontWeight: "600",
  },

  rightSection: {
    alignItems: "flex-end",
  },
  time_spent: {
    fontWeight: "800",
    fontSize: 18,
  },
  time_goal: {
    fontWeight: "700",
    fontSize: 15,
    color: "rgba(0, 0, 0, 0.8)",
  },
});

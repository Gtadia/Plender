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

import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { constants, fontSizes, padding } from "../../constants/style";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import { ScrollView } from "react-native-gesture-handler";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { appearance$ } from "../../db/Settings";
import { observe } from "@legendapp/state";

var { width, height } = Dimensions.get("window");

const RADIUS = 30;
const DIAMETER = 2 * RADIUS;

const itemHeight = 80;
const playButtonSize = 24;

const List = observer(() => {
  return (
    <>
      <View style={{ flex: 1 }}>
        <ScrollView style={[styles.container]}>
          <View style={{ alignItems: "center", padding: constants.regular }}>
            <Memo>
              {() => (
                <AutoSizeText
                  fontSize={fontSizes.big}
                  numberOfLines={1}
                  mode={ResizeTextMode.max_lines}
                  style={{ fontWeight: "bold" }}
                >
                  {dateToday$.get().format("ddd, MMM DD")}
                </AutoSizeText>
              )}
            </Memo>
          </View>

          <ItemList task={todayTasks$} />
          <ItemList task={overdueTasks$} />
          <ItemList task={upcomingTasks$} />

          {/* TODO — Come up with a better solution later... */}
          {/* <View style={styles.taskBannerDimension} /> */}
        </ScrollView>
      </View>

      <View style={[]}>
        {currentTask$.task.get() && (
          // true &&
          <Pressable
            style={[styles.taskBannerDimension, styles.taskBannerStyle]}
            onPress={() => console.log("hello")}
          >
            <Text>{currentTask$.task.title.get()}</Text>
            {/* <Text>{currentTask$.tags.get()}</Text> */}
            <Text>{currentTask$.task.time_goal.total.get()}</Text>
            <Text>{currentTask$.task.time_spent.total.get()}</Text>
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
        style={[
          styles.flexRow,
          { paddingLeft: 15, alignSelf: "flex-start", alignItems: "center" },
        ]}
        onPress={onPress}
      >
        <Text
          style={{
            fontSize: fontSizes.big,
            fontWeight: "bold",
            paddingRight: constants.small,
          }}
        >
          <Memo>{() => task.title.get()}</Memo>
        </Text>

        <Memo>
          {() =>
            show$.get() ? (
              <Entypo name="chevron-down" size={fontSizes.big} color="black" />
            ) : (
              <Entypo name="chevron-up" size={fontSizes.big} color="black" />
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
                <For each={task.data}>{(item$) => <Item item={item$} />}</For>
              )}
            </Memo>
          </View>
        )}
      </Show>
    </>
  );
}

function Item({ item }: any) {
  const startToggle$ = useObservable(false);

  const startCurrentTask = () => {
    startToggle$.set((prev) => !prev);
    // TODO — Move Task to current task
    // TODO — Move old current task back to today/upcoming/overdue/completed
    // TODO — Before replacing the old current task, have a warning page to verify.
  };

  const bColor = {
    primary:
      currentTask$.task.get() == item.get()
        ? appearance$.primaryDark.get()
        : appearance$.primaryWhite.get(),
    secondary:
      currentTask$.task.get() !== item.get()
        ? appearance$.primaryDark.get()
        : appearance$.primaryWhite.get(),
  };
  observe(() => {
    bColor.primary =
      currentTask$.task.get() == item.get()
        ? appearance$.primaryDark.get()
        : appearance$.primaryWhite.get();

    bColor.secondary =
      currentTask$.task.get() !== item.get()
        ? appearance$.primaryDark.get()
        : appearance$.primaryWhite.get();
  });

  // TODO — MAKE SURE ITEM UPDATES WHEN VALUES ARE UPDATED
  return (
    <View
      style={{
        height: itemHeight,
        backgroundColor: bColor.primary,
        borderRadius: constants.regular15,
        flexDirection: "row",
        alignItems: "center",
        padding: constants.regularPlus,
        justifyContent: "space-between",
        margin: constants.small,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: DIAMETER,
            height: DIAMETER,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RadialProgressBar
            item={item}
            time_goal={item.time_goal}
            time_spent={item.time_spent}
          />
          <Pressable
            onPress={startCurrentTask}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              opacity: 0.5,
            }}
          >
            <Memo>
              {() =>
                startToggle$.get() ? (
                  <View style={{ marginLeft: 2 }}>
                    <FontAwesome5
                      name="pause"
                      size={playButtonSize}
                      color={bColor.secondary}
                    />
                  </View>
                ) : (
                  <View style={{ paddingLeft: 5 }}>
                    <FontAwesome5
                      name="play"
                      size={playButtonSize}
                      color={bColor.secondary}
                    />
                  </View>
                )
              }
            </Memo>
          </Pressable>
        </View>

        <View style={[itemStyles.middleSection]}>
          <AutoSizeText
            fontSize={constants.secondaryPlusFontSize}
            numberOfLines={1}
            mode={ResizeTextMode.max_lines}
            style={[itemStyles.title, { color: bColor.secondary }]}
          >
            <Memo>{() => item.title.get()}</Memo>
          </AutoSizeText>

          <Memo>
            {() => (
              <View
                style={[
                  itemStyles.categoryPill,
                  {
                    backgroundColor: item.category.color.get(),
                  },
                ]}
              >
                {/* TODO — Get the background color of each category */}
                <AutoSizeText
                  fontSize={itemStyles.categoryFontSize.fontSize}
                  numberOfLines={1}
                  mode={ResizeTextMode.max_lines}
                  style={[itemStyles.categoryText, { color: "white" }]}
                >
                  <Memo>{() => item.category.label.get()}</Memo>
                </AutoSizeText>
              </View>
            )}
          </Memo>
        </View>
      </View>

      <Memo>
        {() => (
          <View
            style={[
              itemStyles.rightSection,
              { backgroundColor: "blue", alignSelf: "flex-end", width: 65 },
            ]}
          >
            <View>
              <AutoSizeText
                fontSize={fontSizes.regular}
                numberOfLines={1}
                mode={ResizeTextMode.max_lines}
                style={[{ color: bColor.secondary, fontWeight: "800" }]}
              >
                {item.time_spent.hours.get() > 9
                  ? item.time_spent.hours.get()
                  : `0${item.time_spent.hours.get()}`}
                :
                {item.time_spent.minutes.get() > 9
                  ? item.time_spent.minutes.get()
                  : `0${item.time_spent.minutes.get()}`}
                :
                {item.time_spent.seconds.get() > 9
                  ? item.time_spent.seconds.get()
                  : `0${item.time_spent.seconds.get()}`}
              </AutoSizeText>
            </View>

            <View>
              <Reactive.Text
                style={[itemStyles.time_goal, { color: bColor.secondary }]}
              >
                {item.time_goal.hours.get() > 9
                  ? item.time_goal.hours.get()
                  : `0${item.time_goal.hours.get()}`}
                :
                {item.time_goal.minutes.get() > 9
                  ? item.time_goal.minutes.get()
                  : `0${item.time_goal.minutes.get()}`}
                :00
              </Reactive.Text>
            </View>
          </View>
        )}
      </Memo>
    </View>
  );
}

const RadialProgressBar = observer(
  ({ time_goal, time_spent, currentHandler, item }: any) => {
    const color = "#e68f40"; // TODO — gradient change based on percentage completed (color-interpolate --> reanimated)
    const radius = RADIUS;
    const strokeWidth = 8;

    const innerRadius = radius - strokeWidth / 2;
    const outerDiameter = radius * 2;
    const outerBuffer = strokeWidth / 2;

    const path = Skia.Path.Make();
    path.addCircle(radius + outerBuffer, radius + outerBuffer, innerRadius);

    return (
      <View>
        <View>
          <View
            style={{
              width: outerDiameter + strokeWidth,
              height: outerDiameter + strokeWidth,
              transform: [{ rotate: "-90deg" }],
            }}
          >
            <Canvas style={{ flex: 1 }}>
              <Path
                path={path}
                strokeWidth={strokeWidth}
                style={"stroke"}
                color={"#333438"}
                strokeJoin={"round"}
                strokeCap={"round"}
                start={0}
                end={1}
              />
              <Path
                path={path}
                strokeWidth={strokeWidth}
                style={"stroke"}
                color={color}
                strokeJoin={"round"}
                strokeCap={"round"}
                start={0}
                end={item.time_spent.get() / item.time_goal.get()}
              />
            </Canvas>
          </View>
        </View>
      </View>
    );
  }
);

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
    paddingHorizontal: padding.small,
    // justifyContent: "center",
    justifyContent: "space-between",
    height: DIAMETER - 5,
    backgroundColor: "red",
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
  categoryFontSize: {
    fontSize: 14,
  },
  categoryText: {
    paddingHorizontal: 8,
    fontWeight: "600",
  },

  rightSection: {
    alignItems: "flex-end",
    backgroundColor: "blue ",
  },
  time_goal: {
    fontWeight: "700",
    fontSize: 15,
    color: "rgba(0, 0, 0, 0.8)",
  },
});

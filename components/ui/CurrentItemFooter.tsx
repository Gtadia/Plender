import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { currentTask$ } from "../../db/LegendApp";
import { constants, fontSizes, padding, radius } from "../../constants/style";
import { appearance$ } from "../../db/Settings";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import { Memo } from "@legendapp/state/react";

var { width } = Dimensions.get("window");
const bannerMarginBottom = 25;
const CurrentItemFooter = () => {
  return (
    currentTask$.task.get() && (
      // true &&
      <Pressable
        style={[
          styles.taskFooterDimension,
          styles.taskFooterStyle,
          {
            borderTopLeftRadius: radius.regular,
            borderTopRightRadius: radius.regular,
            backgroundColor: appearance$.primaryDark.get(),
          },
        ]}
        onPress={() => console.log("hello")}
      >
        <View
          style={{
            flexDirection: "row",
            width: "90%",
            height: "90%",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
              marginBottom: bannerMarginBottom,
            }}
          >
            <AutoSizeText
              fontSize={constants.secondaryPlusFontSize}
              numberOfLines={1}
              mode={ResizeTextMode.max_lines}
              minimumFontScale={0.6}
              style={[
                itemStyles.title,
                {
                  color: appearance$.primaryWhite.get(),
                },
              ]}
            >
              <Memo>{() => currentTask$.task.title.get()}</Memo>
            </AutoSizeText>

            <View style={{ height: 10 }} />
            <Memo>
              {() => (
                <View
                  style={[
                    itemStyles.categoryPill,
                    {
                      backgroundColor: currentTask$.task.category.color.get(),
                    },
                  ]}
                >
                  {/* TODO — Get the background color of each category */}
                  <AutoSizeText
                    fontSize={itemStyles.categoryFontSize.fontSize}
                    numberOfLines={1}
                    minimumFontScale={0.9}
                    mode={ResizeTextMode.max_lines}
                    style={[itemStyles.categoryText, { color: "white" }]}
                  >
                    <Memo>{() => currentTask$.task.category.label.get()}</Memo>
                  </AutoSizeText>
                </View>
              )}
            </Memo>
          </View>

          <View
            style={{
              flexDirection: "column",
              marginBottom: bannerMarginBottom,
            }}
          >
            <Memo>
              {() => (
                <View
                  style={[
                    itemStyles.rightSection,
                    {
                      alignSelf: "center",
                      width: 80,
                      paddingLeft: 10,
                    },
                  ]}
                >
                  <View style={{ alignSelf: "flex-end" }}>
                    <AutoSizeText
                      fontSize={fontSizes.regular}
                      numberOfLines={1}
                      mode={ResizeTextMode.max_lines}
                      style={[
                        {
                          color: appearance$.primaryWhite.get(),
                          fontWeight: "800",
                        },
                      ]}
                    >
                      {currentTask$.task.time_spent.hours.get()}:
                      {currentTask$.task.time_spent.minutes.get() > 9
                        ? currentTask$.task.time_spent.minutes.get()
                        : `0${currentTask$.task.time_spent.minutes.get()}`}
                      :
                      {currentTask$.task.time_spent.seconds.get() > 9
                        ? currentTask$.task.time_spent.seconds.get()
                        : `0${currentTask$.task.time_spent.seconds.get()}`}
                    </AutoSizeText>
                  </View>
                </View>
              )}
            </Memo>
            <View style={{ height: 5 }} />
            <Memo>
              {() => (
                <View
                  style={[
                    {
                      alignSelf: "center",
                      width: 80,
                      paddingLeft: 10,
                      justifyContent: "center",
                      opacity: 0.5,
                    },
                  ]}
                >
                  <View style={{ alignSelf: "flex-end" }}>
                    <AutoSizeText
                      fontSize={fontSizes.smallMinus}
                      numberOfLines={1}
                      mode={ResizeTextMode.max_lines}
                      style={[
                        {
                          color: appearance$.primaryWhite.get(),
                          fontWeight: "800",
                        },
                      ]}
                    >
                      {currentTask$.task.time_goal.hours.get()}:
                      {currentTask$.task.time_goal.minutes.get() > 9
                        ? currentTask$.task.time_goal.minutes.get()
                        : `0${currentTask$.task.time_goal.minutes.get()}`}
                      :00
                    </AutoSizeText>
                  </View>
                </View>
              )}
            </Memo>
          </View>
        </View>
      </Pressable>
    )
  );
};

export default CurrentItemFooter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
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

  taskFooterDimension: {
    width: width,
    height: 120,
  },
  taskFooterStyle: {
    // backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
});

const itemStyles = StyleSheet.create({
  middleSection: {
    paddingHorizontal: padding.small,
    // justifyContent: "center",
    // justifyContent: "space-between",
    // height: DIAMETER - 5,
    flex: 1,
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
    height: 20,
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
  },
  time_goal: {
    fontWeight: "700",
    fontSize: 15,
    color: "rgba(0, 0, 0, 0.8)",
  },
});

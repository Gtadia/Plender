import {
  Button,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { For, Memo, Reactive, useObservable } from "@legendapp/state/react";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";

import AntDesign from "@expo/vector-icons/AntDesign";
import { ScrollView } from "react-native-gesture-handler";

import { taskCategory$, taskTags$ } from "../../../db/LegendApp";
import ColorPicker, {
  Panel3,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
} from "reanimated-color-picker";
import { appearance$ } from "../../../db/Settings";
import { constants, fontSizes, modalConst } from "../../../constants/style";
import DateTimePicker from "react-native-ui-datepicker";
import { Dropdown } from "react-native-element-dropdown";

var { width } = Dimensions.get("window");

const CreateNewCategory = ({ modalToggle, date }: any) => {
  const repeatOptions = useObservable([
    { label: "None" },
    { label: "Until" },
    { label: "Forever" },
  ]);
  const repeatSelected = useObservable("None");
  const repeated$ = useObservable([
    { day: "Sunday", abbrev: "Sun.", initial: "S", selected: false },
    { day: "Monday", abbrev: "Mon.", initial: "M", selected: false },
    { day: "Tuesday", abbrev: "Tues.", initial: "T", selected: false },
    { day: "Wednesday", abbrev: "Wed.", initial: "W", selected: false },
    { day: "Thursday", abbrev: "Thurs.", initial: "T", selected: false },
    { day: "Friday", abbrev: "Fri.", initial: "F", selected: false },
    { day: "Saturday", abbrev: "Sat.", initial: "S", selected: false },
  ]);

  const renderItem = (item: any) => {
    return (
      <View style={dropdownStyles.item}>
        <Text style={[dropdownStyles.selectedTextStyle]}>{item.label}</Text>
      </View>
    );
  };

  const RepeatView = (
    <>
      <View
        style={[
          {
            borderRadius: constants.smallRadius,
            flexDirection: "row",
            justifyContent: "space-between",
          },
          styles.pillOutline,
          styles.pillPadding,
        ]}
      >
        <For each={repeated$} optimized>
          {(item$) => (
            <Pressable
              onPress={() => {
                item$.selected.set((prev: boolean) => !prev);
              }}
            >
              <Memo>
                {() => (
                  <View
                    style={{
                      width: 30,
                      aspectRatio: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 20,
                      backgroundColor: item$.selected.get()
                        ? "red"
                        : "rgba(0, 0, 0, 0)",
                    }}
                  >
                    <Text style={{ color: "white" }}>
                      {item$.initial.get()}
                    </Text>
                  </View>
                )}
              </Memo>
            </Pressable>
          )}
        </For>
      </View>
    </>
  );

  return (
    <View
      style={{
        width: width - 16 * 2,
        height: "auto",
        padding: 16,
        borderRadius: 16,
        backgroundColor: appearance$.primaryDark.get(),
      }}
    >
      <AutoSizeText
        fontSize={fontSizes.title}
        numberOfLines={1}
        mode={ResizeTextMode.max_lines}
        style={{ color: appearance$.primaryWhite.get(), fontWeight: "bold" }}
      >
        Due
      </AutoSizeText>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <AutoSizeText
          fontSize={fontSizes.bigMinus}
          numberOfLines={1}
          mode={ResizeTextMode.max_lines}
          style={{
            color: appearance$.primaryWhite.get(),
            fontWeight: "bold",
          }}
        >
          Repeat
        </AutoSizeText>

        <View style={dropdownStyles.container}>
          <Dropdown
            style={dropdownStyles.dropdown}
            placeholderStyle={dropdownStyles.placeholderStyle}
            selectedTextStyle={dropdownStyles.selectedTextStyle}
            inputSearchStyle={dropdownStyles.inputSearchStyle}
            iconStyle={dropdownStyles.iconStyle}
            data={repeatOptions.get()}
            maxHeight={200}
            labelField="label"
            valueField="value"
            placeholder={repeatSelected.get()}
            value={repeatSelected.get()}
            onChange={(item) => {
              repeatSelected.set(item.label);
            }}
            renderItem={renderItem}
          />
        </View>
      </View>

      <Memo>
        {() =>
          repeatSelected.get() === "None" ||
          repeatSelected.get() === "Until" ? (
            <>
              <AutoSizeText
                fontSize={fontSizes.bigMinus}
                numberOfLines={1}
                mode={ResizeTextMode.max_lines}
                style={{
                  color: appearance$.primaryWhite.get(),
                  fontWeight: "bold",
                  marginBottom: modalConst.paddingBetween1,
                }}
              >
                <Memo>
                  {() =>
                    repeatSelected.get() === "None"
                      ? "Pick Due Date"
                      : "Repeat Until"
                  }
                </Memo>
              </AutoSizeText>

              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: constants.regularMinusRadius,
                  paddingTop: 15,
                }}
              >
                <DateTimePicker
                  mode="single"
                  date={date.get()}
                  onChange={(params) => date.set(params.date)}
                  headerTextContainerStyle={{
                    backgroundColor: "#F0F2F7",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 5,
                  }}
                />
              </View>
            </>
          ) : (
            <></>
          )
        }
      </Memo>

      <Memo>
        {() =>
          repeatSelected.get() === "Until" ||
          repeatSelected.get() === "Forever" ? (
            <>
              <AutoSizeText
                fontSize={fontSizes.bigMinus}
                numberOfLines={1}
                mode={ResizeTextMode.max_lines}
                style={{
                  color: appearance$.primaryWhite.get(),
                  fontWeight: "bold",
                  marginTop: modalConst.paddingBetween1,
                  marginBottom: modalConst.smallPadding,
                }}
              >
                Repeat On
              </AutoSizeText>
              {RepeatView}
            </>
          ) : (
            <></>
          )
        }
      </Memo>

      <TouchableOpacity
        style={{
          width: "100%",
          height: "auto",
          borderRadius: 15,
          backgroundColor: appearance$.accentColor.get(),
          padding: 16,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 15,
        }}
        onPress={() => modalToggle.set(false)}
      >
        <AutoSizeText
          fontSize={24}
          numberOfLines={1}
          mode={ResizeTextMode.max_lines}
          style={{ color: "white", fontWeight: "bold" }}
        >
          Select
        </AutoSizeText>
      </TouchableOpacity>

      {/* TODO — Create X button  */}
    </View>
  );
};

// TODO — Warning if (1. Same Tag Name) or (2. No Tag Name)

export default CreateNewCategory;

const styles = StyleSheet.create({
  colorWheel: {
    height: "auto",
  },
  titleInput: {
    fontSize: 24,
    color: "black", // TODO — In Dark Mode, change 'color' to 'white'
  },
  swatches: {},

  pillPadding: {
    paddingVertical: constants.pillPaddingVertical,
    paddingHorizontal: constants.pillPaddingHorizontal,
  },
  pillOutline: {
    borderWidth: 2,
    borderColor: "black",
  },
});

const dropdownStyles = StyleSheet.create({
  container: { paddingVertical: modalConst.paddingBetween1 },
  dropdown: {
    height: 35,
    backgroundColor: appearance$.primaryWhite.get(),
    borderRadius: constants.smallPlusRadius,
    paddingHorizontal: constants.smallPlusPadding,
    width: 145,
    elevation: 2,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: fontSizes.small,
    fontWeight: "bold",
  },
  selectedTextStyle: {
    fontSize: fontSizes.small,
    fontWeight: "bold",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
});

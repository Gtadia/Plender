import {
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

import { appearance$ } from "../../../db/Settings";
import { constants, fontSizes, modalConst } from "../../../constants/style";
import DateTimePicker from "react-native-ui-datepicker";
import { Dropdown } from "react-native-element-dropdown";
import { newEvent$, toggle$ } from "../../../utils/newEventState";
import dayjs from "dayjs";

var { width } = Dimensions.get("window");

const CreateNewCategory = () => {
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

        <AutoSizeText
          fontSize={fontSizes.bigMinus}
          numberOfLines={1}
          mode={ResizeTextMode.max_lines}
          style={{
            color: appearance$.primaryWhite.get(),
            fontWeight: "bold",
          }}
        >
          Coming Soon!
        </AutoSizeText>
      </View>

      <Memo>
        {() => (
          <>
            <View
              style={{
                backgroundColor: "white",
                borderRadius: constants.regularMinusRadius,
                paddingTop: 15,
              }}
            >
              <DateTimePicker
                mode="single"
                date={newEvent$.due_date.get()}
                onChange={(params) =>
                  newEvent$.due_date.set(dayjs(params.date))
                }
                headerTextContainerStyle={{
                  backgroundColor: "#F0F2F7",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 5,
                }}
              />
            </View>
          </>
        )}
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
        onPress={() => toggle$.dateModal.set(false)}
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

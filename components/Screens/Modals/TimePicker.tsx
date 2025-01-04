import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { observer, useObservable } from "@legendapp/state/react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import Picker from "../../TimeCarousel/Picker";
import { fontSizes } from "../../../constants/style";
import { appearance$ } from "../../../db/Settings";
import { newEvent$, toggle$ } from "../../../utils/newEventState";

const { width } = Dimensions.get("window");

// Array of minutes and hours for carousel
const minutes = new Array(60).fill({ value: 0, label: 0 }).map((_, index) => ({
  value: index,
  label: index < 10 ? `0${index}` : `${index}`,
}));
const hours = new Array(24)
  .fill({ value: 0, label: 0 })
  .map((_, index) => ({ value: index, label: index }));

/**
 * Converts {hours: number, minutes: number} to an integer (seconds)
 */
const timeObjectToSeconds = (timeObject: { hours: number; minutes: number }) =>
  timeObject.hours * 3600 + timeObject.minutes * 60;

/**
 * The main object to be returned
 */
const TimePicker = observer(() => {
  /**
   * The time object to be displayed on the carousel
   */
  const timeObject = useObservable(() => {
    const seconds = newEvent$.goal_time.get();

    return {
      hours: Math.floor(seconds / 3600),
      minutes: Math.floor((seconds % 3600) / 60),
    };
  });

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
        Time Goal
      </AutoSizeText>

      <View
        style={{
          height: 72 * 5,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Picker
          values={hours}
          moreTextStyles={{
            FontWeight: "900",
          }}
          textStyle={{
            fontFamily: "Roboto",
            fontSize: 64,
            primaryColor: appearance$.primaryWhite.get(),
            secondaryColor: "gray",
          }}
          ITEM_HEIGHT={72}
          defaultValue={timeObject.hours}
          legendState={timeObject.hours}
          width={125}
        />
        <Text
          style={{
            fontFamily: "SFProText-Semibold",
            fontSize: 64,
            fontWeight: "bold",
            padding: 16,
            color: appearance$.primaryWhite.get(),
          }}
        >
          :
        </Text>
        <Picker
          values={minutes}
          moreTextStyles={{
            FontWeight: "900",
          }}
          textStyle={{
            fontFamily: "Roboto",
            fontSize: 64,
            primaryColor: appearance$.primaryWhite.get(),
            secondaryColor: "gray",
          }}
          ITEM_HEIGHT={72}
          defaultValue={timeObject.minutes}
          legendState={timeObject.minutes}
          width={125}
        />
      </View>

      {/* TODO — (Today) button */}

      <TouchableOpacity
        style={{
          width: "100%",
          height: "auto",
          borderRadius: 15,
          backgroundColor: "red",
          padding: 16,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          toggle$.timeModal.set(false);
          newEvent$.goal_time.set(timeObjectToSeconds(timeObject.get()));
          console.log(
            timeObject.hours.get(),
            timeObject.minutes.get(),
            newEvent$.goal_time.get()
          );
        }}
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
    </View>
  );
});

export default TimePicker;

const styles = StyleSheet.create({});

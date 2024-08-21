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

import { taskTags$ } from "../../../db/LegendApp";
import ColorPicker, {
  Panel3,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
} from "reanimated-color-picker";
import { appearance$ } from "../../../db/Settings";
import { fontSizes } from "../../../constants/style";

var { width } = Dimensions.get("window");

const CreateNewCategory = ({ modalToggle, tags }: any) => {
  const title$ = useObservable("");
  const tagColor$ = useObservable("red");

  // Note: 👇 This can be a `worklet` function.
  const onSelectColor = ({ hex }: { hex: string }) => {
    tagColor$.set(hex);
  };

  const createHandler = () => {
    if (title$.get() && tagColor$.get()) {
      const indexNum = taskTags$.list.get().length + 1;
      taskTags$.addToList({
        label: title$.get(),
        value: indexNum,
        color: tagColor$.get(),
      });
      modalToggle.set(false);
      tags.set((prev: any) => prev.concat(indexNum));
    } else {
      // TODO — Warn the user
      console.log("warn the user somehow (red line somewhere, I think)");
    }
  };

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
        Create Category
      </AutoSizeText>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
      >
        <Memo>
          {() => (
            <>
              <Reactive.TextInput
                $value={title$}
                style={[
                  styles.titleInput,
                  { color: tagColor$.get(), fontWeight: "bold" },
                ]}
                placeholder="Title"
              />
            </>
          )}
        </Memo>
      </View>

      <View style={{ width: "100%", alignItems: "center", marginTop: 20 }}>
        <ColorPicker
          style={{ width: "100%", alignItems: "center" }}
          value="red"
          onComplete={onSelectColor}
        >
          <View style={{ width: "75%", justifyContent: "center" }}>
            <Panel3 centerChannel="hsl-saturation" style={styles.colorWheel} />
          </View>
          <ScrollView
            style={{ flexDirection: "row", marginTop: 40 }}
            horizontal={true}
            scrollEnabled={true}
          >
            <Swatches
              // colors={[]}
              // swatchStyle={}
              style={styles.swatches}
            />
          </ScrollView>
        </ColorPicker>
      </View>

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
          Create
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
});

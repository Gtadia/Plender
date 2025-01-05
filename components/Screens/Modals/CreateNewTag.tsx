import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Memo, Reactive, useObservable } from "@legendapp/state/react";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";

import { ScrollView } from "react-native-gesture-handler";

import ColorPicker, { Panel3, Swatches } from "reanimated-color-picker";
import { appearance$ } from "../../../db/Settings";
import { fontSizes } from "../../../constants/style";
import { Tags$ } from "../../../utils/stateManager";
import { addTag, getTag } from "../../../utils/database";
import { useSQLiteContext } from "expo-sqlite";
import { Observable } from "@legendapp/state";
import { newEvent$ } from "../../../utils/newEventState";

var { width } = Dimensions.get("window");

/**
 *
 * @param props ModalToggle ==> Legend Data Observable ==> open/close modal
 * @returns UI to print inside of modal
 */
const CreateNewTag = (props: { modalToggle: Observable<boolean> }) => {
  const db = useSQLiteContext();
  const title$ = useObservable("");
  const tagColor$ = useObservable("red");

  // Note: 👇 This can be a `worklet` function.
  const onSelectColor = ({ hex }: { hex: string }) => {
    tagColor$.set(hex);
  };

  const createHandler = async () => {
    try {
      console.warn("CreateNewTag: new tag created");
      if (title$.get() !== "" && tagColor$.get()) {
        const tag = { label: title$.get(), color: tagColor$.get() };
        const id = await addTag(db, tag);

        if (id && id < 0) {
          console.error("CreateNewTag: Label Already Created. Try Again");
          // todo — implement something
        }
        console.log("CreateNewTag: Created New Tag", await getTag(db));
        if (id) {
          Tags$.addToList(id, tag);
          if (newEvent$.tagIDs.includes(id)) {
            throw Error("the ID already exists?!?!"); // TODO — handle this later
          }
          newEvent$.tagIDs.push(id);
          //   newEvent$.tagIDs.set((prev) => {
          //     const newTag: number[] = [];
          //     if (prev) {
          //       prev.forEach((item) => {
          //         if (!newTag.includes(item)) {
          //           newTag.push(item);
          //         }
          //       });
          //     }
          //     newTag.push(id);
          //     return newTag;
          //   });
        }
        props.modalToggle.set(false);
      }
    } catch (e) {
      // TODO — Warn the user (w/ error popup)
      console.error(
        "CreateNewTag: warn the user somehow (red line somewhere, I think)",
        e
      );
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
        Create Tag
      </AutoSizeText>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
      >
        <Memo>
          {() => (
            <>
              <Text
                style={{
                  color: tagColor$.get(),
                  fontSize: fontSizes.big,
                  fontWeight: "bold",
                }}
              >
                #{" "}
              </Text>
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
        onPress={createHandler}
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

export default CreateNewTag;

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

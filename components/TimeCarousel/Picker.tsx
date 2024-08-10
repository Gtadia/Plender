import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { ITEM_HEIGHT, VISIBLE_ITEMS } from "./Constants";
import { For, useObservable } from "@legendapp/state/react";


const { width } = Dimensions.get("window");
const perspective = 600;
const RADIUS_REL = VISIBLE_ITEMS * 0.5;
const RADIUS = RADIUS_REL * ITEM_HEIGHT;

interface PickerProps {
  defaultValue: number;
  values: { value: number; label: string }[];
}

const Picker = ({ values, defaultValue }: PickerProps) => {
  const hours$ = useObservable([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  const minutes$ = useObservable([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

  return (
    <View
      style={{height: '100%', justifyContent: 'center', alignItems: 'center'}}
      >
        <For each={hours$} optimized>
          {item$ => (
              <Text>
                  {item$.get()}
              </Text>
          )}
        </For>
    </View>
  )
};

export default Picker;

const styles = StyleSheet.create({
  container: {
    width: 0.61 * width,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: "hidden",
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
  },
  label: {
    color: "white",
    fontFamily: "SFProText-Semibold",
    fontSize: 24,
    lineHeight: ITEM_HEIGHT,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
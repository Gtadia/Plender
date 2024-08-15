import {
  Button,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect } from "react";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { observe } from "@legendapp/state";
import { openAddMenu$ } from "../db/LegendApp";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Show, useObservable } from "@legendapp/state/react";

var { height } = Dimensions.get("window");
const MAX_TRANSLATE_Y = -height;

import AntDesign from "@expo/vector-icons/AntDesign";

const gestureOffset = 10;
const lineMargin = 15;
const lineHeight = 4;

const BottomSheet = ({ close, children }: any) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(0);

  const scrollTo = useCallback((destination: number) => {
    "worklet";
    translateY.value = withSpring(destination, { damping: 50 });
  }, []);

  const context = useSharedValue({ y: 0 }); // to keep context of the previous scroll position
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y; // adding previous scroll position
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd((event) => {
      if (event.translationY > gestureOffset) {
        // Swiping Down
        if (context.value.y + (height * 5) / 8 < 10) {
          scrollTo(0);
        } else {
          scrollTo(context.value.y);
        }
      } else if (event.translationY < -gestureOffset) {
        // Swiping Up
        if (context.value.y + (height * 5) / 8 < 10) {
          scrollTo(MAX_TRANSLATE_Y);
        } else {
          scrollTo(context.value.y);
        }
      } else {
        scrollTo(context.value.y);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value, // when translateY.value...
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y], // reaches value of MAX_TRANSLATE_Y+50, the border radius needs to be 5
      [25, 5], // otherwise, if it is less than or equal to MAX_TRANSLATE_Y, it will be 25
      Extrapolation.CLAMP // without CLAMP, if the value is less than MAX_TRANSLATE_Y, the borderRadius won't be clamped to 25, but greater
    );
    return {
      borderRadius,
      transform: [{ translateY: translateY.value }],
      height: -translateY.value,
    };
  });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: translateY.value - MAX_TRANSLATE_Y < 10 ? "auto" : 0,
    };
  });

  openAddMenu$.onChange(
    ({ value }) => {
      scrollTo((-height * 5) / 8);
    },
    { initial: false, trackingType: true }
  );
  close.onChange(
    ({ value }: any) => {
      scrollTo(0);
    },
    { initial: false, trackingType: true }
  );

  // observe(() => {
  //   // Doesn't matter if it's true or false, just detect when changes happen
  //   scrollTo((-height * 5) / 8);
  // });

  return (
    <Animated.View style={[styles.container, rBottomSheetStyle]}>
      <GestureDetector gesture={gesture}>
        <View style={styles.gestureArea}>
          <View style={styles.line} />
        </View>
      </GestureDetector>
      <View>
        <Animated.View style={[animatedStyles]}>
          <View
            style={{ paddingTop: insets.top - 2 * lineMargin - lineHeight }}
          ></View>
          <TouchableOpacity onPress={() => scrollTo(0)}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
        </Animated.View>
        {
          // TODO — Use ...props to import clear functions to clear form when 'close' is pressed
        }
      </View>
      {children}
    </Animated.View>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    height: 0,
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    top: height / 1,
    borderRadius: 25,
  },
  line: {
    width: 75,
    height: lineHeight,
    backgroundColor: "gray",
    alignSelf: "center",
    marginVertical: lineMargin,
    borderRadius: lineHeight / 2,
  },
  gestureArea: {
    width: "100%",
    height: "auto",
  },
});

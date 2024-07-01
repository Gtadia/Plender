/*
From this tutorial:
https://www.youtube.com/watch?v=KvRqsRwpwhY&t=77s
*/
import { StatusBar } from 'expo-status-bar';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useEffect, useCallback } from 'react'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { fontState$, radialProgressState$ } from '../db/LegendApp';
import CircularProgressBar from '../components/RadialProgressBar';
import TaskList from '../components/TaskList';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const RADIUS = 160
const STROKEWIDTH = 25
const {height: SCREEN_HEIGHT} = Dimensions.get('window')

const scrollSensitivity = 100;

export default function Home() {
  const insets = useSafeAreaInsets();
  const MAX_TRANSLATE_Y = SCREEN_HEIGHT - insets.top - 100

  const translateY = useSharedValue(0)
  const radialTranslate = useSharedValue(0)
  const context = useSharedValue({ y: 0})     // to keep context of the previous scroll position

  const scrollTo = useCallback((destination: number) => {
      "worklet";
      translateY.value = withSpring(destination, { damping: 50 })
  }, [])

  const radialScrollTo = useCallback((destination: number) => {
    "worklet";
    radialTranslate.value = withSpring(destination, { damping: 50 })
  }, [])

  const gesture = Gesture.Pan().onStart(() => {
      context.value = {y:translateY.value}
  })
  .onUpdate((event) => {
      translateY.value = -event.translationY + context.value.y   // adding previous scroll position
      // translateY.value = Math.max(0, Math.min(translateY.value, MAX_TRANSLATE_Y))  // Clamps value between min and max
  })
  .onEnd(() => {
      if (translateY.value > MAX_TRANSLATE_Y / 2) {
          // TODO — maybe add a scroll sensitivity
          if (context.value.y < translateY.value - scrollSensitivity) {
              scrollTo(MAX_TRANSLATE_Y)
              console.log("1")
              console.log(insets.top)
          } else if (context.value.y > translateY.value + scrollSensitivity) {
              scrollTo(MAX_TRANSLATE_Y / 2)
              console.log("2")
          } else {
              scrollTo(context.value.y)
          }
      } else if (translateY.value < MAX_TRANSLATE_Y / 2) {
          if (context.value.y > translateY.value + scrollSensitivity) {
              scrollTo(10)
              radialScrollTo(MAX_TRANSLATE_Y / 2 - (RADIUS + STROKEWIDTH))  // TODO — Find how to find the height of the circle (including current task bar and how strokewidth affects the size)
              console.log("3")
          } else if (context.value.y < translateY.value - scrollSensitivity) {
            // (This doesn't (correction: it SHOULDN'T) ever run)
            scrollTo(MAX_TRANSLATE_Y / 2)
          } else {
              scrollTo(context.value.y)
          }
      } else {
        scrollTo(context.value.y)
      }
  })

  const swipeUpGesture = Gesture.Pan().onUpdate((event) => {
      // TODO — We can even get the velocity of the event (.velocityX .velocityY)
      translateY.value = -event.translationY
    })
    .onEnd(() => {
      if (translateY.value > scrollSensitivity) {
        scrollTo(MAX_TRANSLATE_Y / 2)
        radialScrollTo(0)
      } else {
          scrollTo(10)
      }
  })

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,                           // when translateY.value...
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],    // reaches value of MAX_TRANSLATE_Y+50, the border radius needs to be 5
      [25, 5],                                    // otherwise, if it is less than or equal to MAX_TRANSLATE_Y, it will be 25
      Extrapolation.CLAMP     // without CLAMP, if the value is less than MAX_TRANSLATE_Y, the borderRadius won't be clamped to 25, but greater
    )
    return {
      // TODO — Instead of moving things down, resize the component
      borderRadius,
      height: translateY.value,
    }
  })

  const radialStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: radialTranslate.value}]
    }
  })

  useEffect(() => {
      // TODO — origin point ==> SCREEN_HEIGHT - <Height of header> - <height of radial wheel> - <some padding>
      translateY.value = withSpring(MAX_TRANSLATE_Y/2, { damping: 50 })
      radialTranslate.value = withSpring(0, {damping: 50})

      radialProgressState$.sumTasks.get()
  }, [])

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={styles.container2}>
        <StatusBar style="auto" />
        <Animated.View style={[radialStyle]}>
            <CircularProgressBar radius={RADIUS} strokeWidth={STROKEWIDTH} font={fontState$.font.get()}/>
        </Animated.View>

      <GestureDetector gesture={swipeUpGesture}>
        <View style={styles.swipeUpFromZero}></View>
      </GestureDetector>

      <Animated.View style={[styles.container, rBottomSheetStyle]}>
        <GestureDetector gesture={gesture}>
            <View style={{width: "100%", height: 50,
                // backgroundColor: 'green'
              }}>
                <View style={styles.line} />
            </View>
        </GestureDetector>

        <TaskList />
      </Animated.View>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
    container: {
        height: SCREEN_HEIGHT,
        width: "100%",
        backgroundColor: "white",
        position: "absolute",
        // top: SCREEN_HEIGHT / 1,
        bottom: 0,
        borderRadius: 25
    },
    line: {
        width: 75,
        height: 4,
        backgroundColor: 'gray',
        alignSelf: 'center',
        marginVertical: 15,
        borderRadius: 2,
    },
    swipeUpFromZero: {
        height: SCREEN_HEIGHT / 3,
        width: '100%',
        position: 'absolute',

        bottom: 0,
        // backgroundColor: 'blue'
    },
    container2: {
      flex: 1,
      // backgroundColor: '#111',
      alignItems: 'center',
      // justifyContent: 'center',
      // paddingTop: Platform.select({ios: 170,  default: 0})
    },
    button: {
      height: 50,
      aspectRatio: 1,
      borderRadius: 25,
      backgroundColor: "white",
      opacity: 0.6,
    },
})
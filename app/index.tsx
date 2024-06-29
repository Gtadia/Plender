/*
From this tutorial:
https://www.youtube.com/watch?v=KvRqsRwpwhY&t=77s
*/
import { Button, Dimensions, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useCallback } from 'react'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Timer from '../components/Timer';
import { fontState$, radialProgressState$, tasksState$ } from '../db/LegendApp';
import CircularProgressBar from '../components/RadialProgressBar';
import { SkFont, useFont } from '@shopify/react-native-skia';

const RADIUS = 160
const STROKEWIDTH = 25

const {height: SCREEN_HEIGHT} = Dimensions.get('window')
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 25

const App = () => {
  const translateY = useSharedValue(0)
  const radialTranslate = useSharedValue(0)

  const swipeUpContext = useSharedValue({ y: 0 })

  const scrollTo = useCallback((destination: number) => {
      "worklet";
      translateY.value = withSpring(destination, { damping: 50 })
  }, [])

  const radialScrollTo = useCallback((destination: number) => {
    "worklet";
    radialTranslate.value = withSpring(destination, { damping: 50 })
  }, [])

  const context = useSharedValue({ y: 0})     // to keep context of the previous scroll position
  const gesture = Gesture.Pan().onStart(() => {
      context.value = {y:translateY.value}
  })
  .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y   // adding previous scroll position
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y)
  })
  .onEnd(() => {
      if (translateY.value < -SCREEN_HEIGHT / 2) {
          // TODO — maybe add a scroll sensitivity
          if (context.value.y > translateY.value + 100) {
              scrollTo(MAX_TRANSLATE_Y)
              console.log("1")
          } else if (context.value.y < translateY.value - 100) {
              scrollTo(-SCREEN_HEIGHT / 2)
              console.log("2")
          } else {
              scrollTo(context.value.y)
          }
      } else if (translateY.value > -SCREEN_HEIGHT / 2) {
          if (context.value.y < translateY.value - 100) {
              scrollTo(10)
              radialScrollTo(SCREEN_HEIGHT / 2 - (2 * RADIUS + STROKEWIDTH))
              console.log("3")
          } else if (context.value.y > translateY.value + 100) {
            // TODO — DELETE IT (This doesn't ever run)
          } else {
              scrollTo(context.value.y)
          }
      }
  })

  const swipeUpGesture = Gesture.Pan().onStart((event) => {
      swipeUpContext.value = {y:event.y}
  })
  .onUpdate((event) => {
      // TODO — We can even get the velocity of the event (.velocityX .velocityY)
      translateY.value = event.translationY * 1.5
      radialScrollTo(0)
  })
  .onEnd(() => {
      if (translateY.value < -125) {
          scrollTo(-SCREEN_HEIGHT / 2)
      } else {
          scrollTo(10)
      }
  })

  const rBottomSheetStyle = useAnimatedStyle(() => {
      return {
          transform: [{translateY: translateY.value}]
      }
  })

  const radialStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: radialTranslate.value}]
    }
  })

  useEffect(() => {
      // TODO — origin point ==> SCREEN_HEIGHT - <Height of header> - <height of radial wheel> - <some padding>
      translateY.value = withSpring(-SCREEN_HEIGHT/2, { damping: 50 })
      radialTranslate.value = withSpring(0, {damping: 50})

      radialProgressState$.sumTasks.get()
  }, [])

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      {/* Start Timer */}
      <Timer />
      <SafeAreaView style={styles.container2}>
        <StatusBar style="light" />
        <Animated.View style={[radialStyle]}>
            <CircularProgressBar radius={RADIUS} strokeWidth={STROKEWIDTH} font={fontState$.font.get()}/>
        </Animated.View>
      </SafeAreaView>

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
      </Animated.View>
    </GestureHandlerRootView>
  )
}

export default App

const styles = StyleSheet.create({
    container: {
        height: SCREEN_HEIGHT,
        width: "100%",
        backgroundColor: "white",
        position: "absolute",
        top: SCREEN_HEIGHT / 1,
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
      backgroundColor: '#111',
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
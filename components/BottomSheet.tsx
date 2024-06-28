/*
From this tutorial:
https://www.youtube.com/watch?v=KvRqsRwpwhY&t=77s
*/
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useCallback } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const {height: SCREEN_HEIGHT} = Dimensions.get('window')
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50

const BottomSheet = () => {
    const translateY = useSharedValue(0)

    const swipeUpContext = useSharedValue({ y: 0 })
    // TODO  — Output translateY to MMKV (not presistent storage) (to move radialProgressBar)

    const scrollTo = useCallback((destination: number) => {
        "worklet";
        translateY.value = withSpring(destination, { damping: 50 })
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
            } else if (context.value.y < translateY.value - 100) {
                scrollTo(-SCREEN_HEIGHT / 2)
            } else {
                scrollTo(context.value.y)
            }
        } else if (translateY.value > -SCREEN_HEIGHT / 2) {
            if (context.value.y < translateY.value - 100) {
                scrollTo(10)
            } else if (context.value.y > translateY.value + 100) {
                scrollTo(-SCREEN_HEIGHT / 2)
            } else {
                scrollTo(context.value.y)
            }
        }

        console.log(translateY.value)
    })

    const swipeUpGesture = Gesture.Pan().onStart((event) => {
        swipeUpContext.value = {y:event.y}
        console.log("swipe up", swipeUpContext.value.y)
    })
    .onUpdate((event) => {
        // TODO — We can even get the velocity of the event (.velocityX .velocityY)
        translateY.value = event.translationY * 1.5
    })
    .onEnd(() => {
        if (translateY.value < -125) {
            scrollTo(-SCREEN_HEIGHT / 2)
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
            // borderRadius,
            transform: [{translateY: translateY.value}]
        }
    })

    useEffect(() => {
        // TODO — origin point ==> SCREEN_HEIGHT - <Height of header> - <height of radial wheel> - <some padding>
        translateY.value = withSpring(-SCREEN_HEIGHT/2, { damping: 50 })
    }, [])

    return (
        <Animated.View style={{position: 'absolute', height: SCREEN_HEIGHT, width: '100%', top: 0}}>
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
        </Animated.View>
    )
}

export default BottomSheet

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
    }
})
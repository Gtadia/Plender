import { StyleSheet, View, Text as RNText, ScrollView } from 'react-native'
import React, { useState, useMemo, useEffect, useRef } from 'react'
import {Canvas, Path, SkFont, Skia, Text} from '@shopify/react-native-skia'

import Animated,{interpolate, useDerivedValue, useSharedValue, interpolateColor, useAnimatedStyle, withTiming, Extrapolation} from 'react-native-reanimated';
import { radialProgressState$, tasksState$ } from '../db/LegendApp';
import { observe } from '@legendapp/state';
import { observer } from '@legendapp/state/react';

const SECONDS_IN_DAY = 24 * 60 * 60;
const mainRingColor = '#51CC46';


interface CircularProgressProps {
    radius: number,
    strokeWidth: number,
    font: SkFont,
}

const CircularProgressBar = ({radius, strokeWidth, font}: CircularProgressProps) => {
  // ------------------------------------------------------------------------------------------------
  const scrollPercent = useSharedValue(0.0);

  const mainWheelColor = useDerivedValue(() => {
    return interpolateColor(
      scrollPercent.value,
      [0, 1],
      ['yellow', 'red']
    )
  })

  const secondaryTaskWheelColor = useDerivedValue(() => {
    return interpolateColor(
        scrollPercent.value,
        [0, 1],
        [mainRingColor, 'transparent']
      )
  })

  const secondaryTaskWheelColorBackground = useDerivedValue(() => {
    return interpolateColor(
        Math.abs(1-scrollPercent.value),
        [0, 1],
        ['transparent', '#747474']
      )
  })
  const backgroundColor = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollPercent.value,
        [0, 1],
        ['blue', 'green']
      )
    }
  })

  const backgroundColorRight = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
      Math.abs(1 - scrollPercent.value),
      [0, 1],
      ['transparent', 'green']
      )
    }
  })

  const pageIndicatorLeft = useAnimatedStyle(() => ({
    width: interpolate(
      Math.abs(1 - scrollPercent.value),
      [0, 1],
      [15, 15+35 * (1 - scrollPercent.value)],
      Extrapolation.CLAMP
    )
  }))

  const pageIndicatorRight = useAnimatedStyle(() => ({
    width: interpolate(
      (scrollPercent.value),
      [0, 1],
      [15, 15+35 * scrollPercent.value],
      Extrapolation.CLAMP
    )
  }))


  console.log(scrollPercent.value)

  // [scrollPercent])
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
  // curr, todo, daily could be implemented in a for loop
  const times = {
    now: {seconds: useSharedValue(0), percentage: useSharedValue(0)},     // the current time

    // tasks
    curr: {seconds: useSharedValue(0), percentage: useSharedValue(0)},    // current task
    todo: {seconds: useSharedValue(0), percentage: useSharedValue(0)},
    daily: {seconds: useSharedValue(0), percentage: useSharedValue(0)},
  }

  observe(() => {
    times.now.percentage.value = withTiming(radialProgressState$.now.get() / SECONDS_IN_DAY, { duration: 1000 });
    times.todo.percentage.value = withTiming(radialProgressState$.radialTodo.get() / SECONDS_IN_DAY, { duration: 1000 });
    times.daily.percentage.value = withTiming(radialProgressState$.radialDaily.get() / SECONDS_IN_DAY, { duration: 1000 });

    times.now.seconds.value = withTiming(radialProgressState$.now.get(), { duration: 1000 });
    times.todo.seconds.value = withTiming(radialProgressState$.todo.get(), { duration: 1000 });
    times.daily.seconds.value = withTiming(radialProgressState$.daily.get(), { duration: 1000 });
  })

  // TODO — Is this being observed (IT WON'T MATTER SINCE IT'S GOING INTO A FUNCTION LATER)
  const stringTimes = {
    now: useDerivedValue(() => `${Math.floor(times.now.seconds.value / 3600)} : ${("00" + Math.floor(times.now.seconds.value % 3600 / 60)).slice(-2)} : ${("00" + Math.floor(times.now.seconds.value % 60)).slice(-2)} `, [])
  }

  const measureStringTimes = {
    now: font.measureText(stringTimes.now.value)
  }

// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// Skia Path
  const innerRadius = radius - strokeWidth/2;
  const outerBuffer = strokeWidth / 2;
  const primaryPath = Skia.Path.Make();
  primaryPath.addCircle(radius + outerBuffer, radius + outerBuffer, innerRadius);
  const secondaryPath = Skia.Path.Make();
  secondaryPath.addCircle(radius + outerBuffer, radius + outerBuffer, radius + outerBuffer / 2)
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------
// ADDITIONAL STYLES
  const spacingBetween = 80;
  const outerDiameter = radius * 2
  const innerDiameter = radius * 2 - strokeWidth * 2

  // ----- text width -----
  const mainTextWidth = useDerivedValue(() => {
    return (innerDiameter - measureStringTimes.now.width)/2
  })

  // const taskTextWidth = useDerivedValue(() => {
  //   return (innerDiameter - font.measureText(taskTime.value).width)/2
  // })
  // ----- text width -----

  const additionalStyles = {
    scrollViewCrop: {...styles.innerTimerContainer, width: innerDiameter, height: innerDiameter, overflow: 'hidden', borderRadius: innerDiameter / 2},
    scrollViewContainer: {backgroundColor: 'rgba(0, 255, 0, 0.0)', width: innerDiameter + spacingBetween, height: innerDiameter},
    scrollViewWiderElement: {width: innerDiameter + spacingBetween, alignItems: 'center', },
    inViewComponent: {width: innerDiameter, alignItems: 'center',},

    // percentage: {...styles.innerTimerTextCanvas, width: innerDiameter, top: innerDiameter / 2 + fontMeasurePercentage.height},

    mainTimer: {...styles.innerTimerTextCanvas, width: innerDiameter, top: innerDiameter / 2 - measureStringTimes.now.height/2},
    mainTimerCanvas: [{height: measureStringTimes.now.height, width: innerDiameter,} ],
    // percentageCanvas: {width: fontMeasurePercentage.width, height: fontMeasurePercentage.height, },
  }
// ------------------------------------------------------------------------------------------------

  return (
    <View style={{...styles.centerFlex,}}>
      <View style={{width: outerDiameter, height: outerDiameter, justifyContent: 'center', alignItems:'center'}}>
{/* Move this canvas down to scrollView (DON'T USE A useSTATE (then the components won't render properly) — or you could use a useState but just add a transition (this might work)) */}
        <View style={{width: outerDiameter + strokeWidth, height: outerDiameter + strokeWidth, transform: [{rotate: '-90deg'}]}}>
          {/* <RoundProgBar path={path} path2={path2} strokeWidth={strokeWidth} scrollPercent={scrollPercent} /> */}
          <Canvas style={{...styles.container}}>
      <Path
        path={primaryPath}
        strokeWidth={strokeWidth}
        style={'stroke'}
        color={'#333438'}
        strokeJoin={'round'}
        strokeCap={'round'}
        start={0}
        end={1}
        />

        {/* To-Dos */}
      <Path
        path={primaryPath}
        strokeWidth={strokeWidth}
        style={'stroke'}
        color={'#e68f40'}
        strokeJoin={'round'}
        strokeCap={'round'}
        start={times.daily.percentage}
        end={times.todo.percentage}
        />

        {/* Daily Tasks */}
      <Path
        path={primaryPath}
        strokeWidth={strokeWidth}
        style={'stroke'}
        color={'#43e643'}
        strokeJoin={'round'}
        strokeCap={'round'}
        start={times.now.percentage}
        end={times.daily.percentage}
        />

        {/* Current Time */}
        <Path
          path={primaryPath}
          strokeWidth={strokeWidth}
          style={'stroke'}
          color={mainWheelColor}
          strokeJoin={'round'}
          strokeCap={'round'}
          start={0}
          end={times.now.percentage}/>


        {radialProgressState$.current.data.get().length !== 0 &&
          <Path
              path={secondaryPath}
              strokeWidth={strokeWidth / 2}
              style={'stroke'}
              color={secondaryTaskWheelColorBackground}
              strokeJoin={'round'}
              strokeCap={'round'}
              start={0}
              end={1}
          />
        }
        {radialProgressState$.current.data.get().length !== 0 &&
          <Path
              path={secondaryPath}
              strokeWidth={strokeWidth / 4}
              style={'stroke'}
              color={secondaryTaskWheelColor}
              strokeJoin={'round'}
              strokeCap={'round'}
              start={0}
              end={ times.curr.percentage } // todo — pass in a function that maybe CHANGES THE COLOR!!! (fade out)
          />
        }
    </Canvas>
        </View>


        {
          // Todo — Easy Solution, find a font with even spacing and even character width
          // Block it is also doing it
        }
        <View style={additionalStyles.scrollViewCrop}>
          {/*  TODO — The radialProgressState$ might need an observe... */}
          <ScrollView
            horizontal={true}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onScroll={({nativeEvent}) => {scrollPercent.value = (2 * (nativeEvent.contentOffset.x)/nativeEvent.contentSize.width)}}
            scrollEventThrottle={1}
            overScrollMode='always'
            scrollEnabled={radialProgressState$.current.get().data !== null}
            style={additionalStyles.scrollViewContainer}
          >
            { /*Current Time */ }
            <Animated.View style={[additionalStyles.scrollViewWiderElement]}>
              <View style={additionalStyles.mainTimer}>
                <Canvas style={additionalStyles.mainTimerCanvas}>
                  <Text
                    x={mainTextWidth}
                    y={measureStringTimes.now.height}
                    text={stringTimes.now}
                    color={"black"}
                    font={font}
                  />
                </Canvas>
              </View>
            </Animated.View>

            {
            // TODO — MOVE THIS TO A FUNCTION (observer)
          }
                {
                tasksState$.today.data[0].get() !== null && <Animated.View style={additionalStyles.scrollViewWiderElement}>

                <View style={additionalStyles.mainTimer}>
                  <Canvas style={additionalStyles.mainTimerCanvas}>
                    <Text
                      x={font.measureText(String(tasksState$.today.data[0].get().time_remaining)).x}
                      y={font.measureText(String(tasksState$.today.data[0].get().time_remaining)).y}
                      text={String(tasksState$.today.data[0].get().time_remaining)}
                      color={"black"}
                      font={font}
                    />
                  </Canvas>
                </View>
              </Animated.View>
              }

          </ScrollView>
        </View>

      </View>
    </View>
  )
}

export default CircularProgressBar

// function timeToPercent(remaining, goal) {
//     const remainInSec = remaining.hour * 3600 + remaining.min * 60 + remaining.sec;
//     const goalInSec = goal.hour * 3600 + goal.min * 60 + goal.sec;

//     return remainInSec / goalInSec;
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerFlex: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerTimerContainer:{
    position: "absolute",
    // textAlign: "center",
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  innerTimerTextCanvas: {
    position: "absolute",
    // textAlign: "center",
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    // top: 65
  },
  time: {
  },
  test: {
    borderWidth: 2,
    borderColor: 'red'
  },
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  scrollViewContainer: {
    position: 'absolute',
  },
  smallTimer: {
    position: "absolute",
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageIndicatorContainer: {
    width: 75,
    height: 15,
    marginTop:15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pageIndicator: {
    minWidth: 15,
    height: 15,
    borderRadius: 15/2
  }
})
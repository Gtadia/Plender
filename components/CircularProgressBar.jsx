import { StyleSheet, View, Text as RNText, ScrollView } from 'react-native'
import React, { useState } from 'react'
import {Canvas, Path, Skia, Text, useFont} from '@shopify/react-native-skia'
import {SharedValue, useDerivedValue} from 'react-native-reanimated';

import InView from 'react-native-component-inview'

const CircularProgressBar = ({radius, strokeWidth, currTime, todoTime, dailyTime, hour, minute, second, font, task}) => {
  const [ringColor, setRingColor] = useState('#51CC46')

  const checkVisible = (isVisible, color) => {
    if (isVisible){
      setRingColor(color) // todo — test using `useSharedValue` and `withTiming` to get a smooth transition.
      // Create states to turn off other the other rings...
      // Create states to change the location of the progress bar
    }

    console.log(color, isVisible)
    // else {
    //   setIsInView(isVisible)
    // }
  }


  const innerRadius = radius - strokeWidth/2;
  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

  const mainTime = useDerivedValue(() => `${Math.round(hour.value * 24)} : ${Math.round(minute.value * 60)} : ${Math.round(second.value * 60)} `, [])
  // const percentage = useDerivedValue(() => `${task.percentage.value}%`)  Todo — or something like that...
  const percentage = `25%`

  const dateToday = `Tue, 05/23/2024`
  const todoTimeText = `16:48`
  const dailyTimeText = `1:18`

  const fontMeasure = font.measureText(mainTime.value)
  const fontMeasureDate = font.measureText(dateToday)
  const fontMeasureDaily = font.measureText(dailyTimeText)
  const fontMeasureTodo = font.measureText(todoTimeText)
  const fontMeasurePercentage = font.measureText(percentage)

  const spacingBetween = 80;
  const outerDiameter = radius * 2
  const innerDiameter = radius * 2 - strokeWidth * 2

  const additionalStyles = {
    'scrollViewCrop': {...styles.innerTimerContainer, width: innerDiameter, height: innerDiameter, overflow: 'hidden', borderRadius: innerDiameter / 2},
    'scrollViewContainer': {backgroundColor: 'rgba(0, 255, 0, 0.0)', width: innerDiameter + spacingBetween, height: innerDiameter},
    'scrollViewWiderElement': {width: innerDiameter + spacingBetween, alignItems: 'center', },
    'inViewComponent': {width: innerDiameter, alignItems: 'center',},

    'dateText': {...styles.smallTimer, top: innerDiameter/2 - fontMeasureDate.height/2 - fontMeasure.height/2 - 20, },
    'mainTimer': {...styles.innerTimerTextCanvas, width: innerDiameter, top: innerDiameter / 2 - fontMeasure.height/2},
    'smallTimer': {...styles.smallTimer, top: innerDiameter / 2 + fontMeasureTodo.height, width: fontMeasureTodo.width, textAlign: 'center', fontSize: 26,},
    'smallTimerLeft': {left: strokeWidth + 20},
    'smallTimerRight': {right: strokeWidth + 20},

    'percentage': {...styles.innerTimerTextCanvas, width: innerDiameter, top: innerDiameter / 2 + fontMeasurePercentage.height},

    'mainTimerCanvas': {width: fontMeasure.width, height: fontMeasure.height, },
    'percentageCanvas': {width: fontMeasurePercentage.width, height: fontMeasurePercentage.height, }
  }



  return (
    <View style={{width: outerDiameter, height: outerDiameter, justifyContent: 'center', alignContent:'center'}}>
      <Canvas style={{...styles.container}}>
        <Path
          path={path}
          strokeWidth={strokeWidth}
          style={'stroke'}
          color={'#333438'}
          strokeJoin={'round'}
          strokeCap={'round'}
          start={0}
          end={1}
          />

          {/* Daily Tasks */}
        {/* <Path
          path={path}
          strokeWidth={strokeWidth}
          style={'stroke'}
          color={'#e68f40'}
          strokeJoin={'round'}
          strokeCap={'round'}
          start={todoTime}
          end={dailyTime}
          /> */}

          {/* To-Dos */}
        {/* <Path
          path={path}
          strokeWidth={strokeWidth}
          style={'stroke'}
          color={'#43e643'}
          strokeJoin={'round'}
          strokeCap={'round'}
          start={currTime}
          end={todoTime}
          /> */}

          {/* Current Time */}
          <Path
          path={path}
          strokeWidth={strokeWidth}
          style={'stroke'}
          // color={{isInView ? '#e64343' : 'purple'}}
          color={ringColor}
          strokeJoin={'round'}
          strokeCap={'round'}
          start={0}
          end={currTime}
          />
      </Canvas>

      {
        // Todo — Easy Solution, find a font with even spacing and even character width
        // Block it is also doing it
      }
      <View style={additionalStyles.scrollViewCrop}>
        <ScrollView
          horizontal= {true}
          decelerationRate={0}
          snapToInterval={innerDiameter + spacingBetween} //your element width
          snapToAlignment={"center"}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={additionalStyles.scrollViewContainer}
        >
          <View style={additionalStyles.scrollViewWiderElement}>
            <InView
              onChange={(isVisible) => checkVisible(isVisible, "red")}
              style={additionalStyles.inViewComponent}
            >
              {/* Date */}
              <RNText style={additionalStyles.dateText}>
                {dateToday}
              </RNText>

                {/* Current Time */}
              <View style={additionalStyles.mainTimer}>
                <Canvas style={additionalStyles.mainTimerCanvas}>
                  <Text
                    x={0}
                    y={fontMeasure.height}
                    text={mainTime}
                    color={"black"}
                    font={font}
                  />
                </Canvas>
              </View>

              <RNText style={{...additionalStyles.smallTimer, ...additionalStyles.smallTimerLeft}}>
                {todoTimeText}
              </RNText>
              <RNText style={{...additionalStyles.smallTimer, ...additionalStyles.smallTimerRight}}>
                {dailyTimeText}
              </RNText>
            </InView>
          </View>

          <View style={additionalStyles.scrollViewWiderElement}>
            <InView
              onChange={(isVisible) => checkVisible(isVisible, "yellow")}
              style={additionalStyles.inViewComponent}
            >
              <RNText style={additionalStyles.dateText}>
                {dateToday}
              </RNText>

              <View style={additionalStyles.mainTimer}>
                <Canvas style={additionalStyles.mainTimerCanvas}>
                  <Text
                    x={0}
                    y={fontMeasure.height}
                    text={mainTime}
                    color={"black"}
                    font={font}
                  />
                </Canvas>
              </View>


              <View style={additionalStyles.percentage}>
              {/* <View style={additionalStyles.mainTimer}> */}
                <Canvas style={additionalStyles.percentageCanvas}>
                  <Text
                    x={0}
                    y={fontMeasurePercentage.height}
                    text={percentage}
                    color={"black"}
                    font={font}
                  />
                  {/* {console.log(fontMeasurePercentage.height)} */}
                </Canvas>
              </View>

            </InView>
          </View>

        </ScrollView>
      </View>

      <View style={{width: 50, height: 15, ...styles.test, marginTop:0}}>
        <View></View>
        <View></View>
      </View>
    </View>
  )
}

export default CircularProgressBar

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
})
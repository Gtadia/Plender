import { StyleSheet, View, Text as Texts, ScrollView } from 'react-native'
import React from 'react'
import {Canvas, Path, Skia, Text, useFont} from '@shopify/react-native-skia'
import {SharedValue, useDerivedValue} from 'react-native-reanimated';


const CircularProgressBar = ({radius, strokeWidth, currTime, todoTime, dailyTime, hour, minute, second, font}) => {
  const innerRadius = radius - strokeWidth/2;
  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

  const targetText = useDerivedValue(() => `${Math.round(hour.value * 24)} : ${Math.round(minute.value * 60)} : ${Math.round(second.value * 60)} `, [])
  const targetText2 = useDerivedValue(() => `${Math.round(currTime.value * (24*60*60))}`, [])

  const fontMeasure = font.measureText(targetText.value)


  return (
    <View style={{width: radius * 2, height: radius * 2, justifyContent: 'center', alignContent:'center'}}>
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
          color={'#e64343'}
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
      <View style={{...styles.innerTimerContainer}}>
        <ScrollView
          horizontal= {true}
          decelerationRate={0}
          snapToInterval={radius *  2 - strokeWidth * 2} //your element width
          snapToAlignment={"center"}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}

          style={{
            backgroundColor: 'rgba(0, 255, 0, 0.0)',
            width: radius * 2 - strokeWidth*2,
            height: radius * 2 - strokeWidth * 2,
            ...styles.test, position: 'absolute',
          }}
          // contentContainerStyle= {{...styles.timerContainer, ...styles.test, margin: 10}}
        >
          <View style={{...styles.timerContainer, ...styles.test, width: radius *  2 - strokeWidth * 2}}>
            <Canvas style={{width: fontMeasure.width, height: fontMeasure.height,}}>
              <Text
                x={0}
                y={fontMeasure.height}
                text={targetText}
                color={"black"}
                font={font}
              />
            </Canvas>
          </View>

          <View style={{...styles.timerContainer, ...styles.test, width: radius *  2 - strokeWidth * 2}}>
            <Canvas style={{width: fontMeasure.width, height: fontMeasure.height,}}>
              <Text
                x={0}
                y={fontMeasure.height}
                text={"Test Phrase"}
                color={"black"}
                font={font}
              />
            </Canvas>
          </View>
        </ScrollView>

      </View>

      {/* <View style={styles.innerTimerContainer}> */}
        {/* Time */}
        {/* <Text style={styles.time}>{`${hour.value} : ${minute} : ${second}`}</Text> */}

        {/* To-Do Time */}
        {/* {/* <Text style={styles.todoTime}>{"10 : 25"}</Text> */}

        {/* Daily Tasks Time */}
        {/* <Text style={styles.dailyTime}>{"10 : 25"}</Text> */}
      {/* </View> */}
    </View>
  )
}

export default CircularProgressBar

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  innerTimerContainer: {
    position: "absolute",
    // textAlign: "center",
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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
  }
})
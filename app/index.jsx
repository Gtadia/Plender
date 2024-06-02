import { StatusBar } from 'expo-status-bar';
// import { Text, View, StyleSheet } from 'react-native';
// import { useEffect, useState } from 'react';
// import { useSharedValue, withTiming } from 'react-native-reanimated';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import {useFont} from '@shopify/react-native-skia';

import Button from '../components/GeneralButton'
import AccountButton from '../components/AccountButton';
import CircularProgressBar from '../components/CircularProgressBar';
import AccountMenu from '../components/AccountMenu';

import {StyleSheet, Text, View, ScrollView, Animated} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import {useFont} from '@shopify/react-native-skia';
import {SafeAreaView} from 'react-native-safe-area-context';
import TaskCard from '../components/TaskCard';
import CurrentTaskCard from '../components/CurrentTaskCard';


const RADIUS = 160;
const STROKEWIDTH = 23;

const PROGRESSBARDIMENSION = {"radius": RADIUS, "strokeWidth": STROKEWIDTH, "secondaryStrokeWidth": STROKEWIDTH/2, "secondaryRadius": RADIUS + STROKEWIDTH/2, "mavMargin": 15, "navHeight": 15, "navWidth": 75, "total": RADIUS * 2 + STROKEWIDTH * 1.5 + 30}
const SECONDSINDAY = 24 * 60 * 60;


export default function App() {
  const scrollY = useRef(new Animated.Value(0)).current;

  const translateHeader = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -200],
    extrapolate: 'clamp',
  });
  const opacityTitle = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const translateList = scrollY.interpolate({
    inputRange: [0, PROGRESSBARDIMENSION.total],
    outputRange: [0, -PROGRESSBARDIMENSION.total],
    extrapolate: 'clamp',
  });

  const [tasks, setTasks] = useState([
    {title: 'Daily', body: ['test', 'test', 'test']},
    {title: 'ToDo', body: ['test', 'test', 'test', 'test', 'test', 'test', 'test', 'test',]}
  ])
  const [taskHeaderIndex, setTaskHeaderIndex] = useState([]);
  const currTimeInSec = useSharedValue(0);
  const currHour = useSharedValue(0);
  const currMinute = useSharedValue(0);
  const currSecond = useSharedValue(0);

  const font = useFont(require("../assets/fonts/fff-forward/fffforward.ttf"), 32);

  const [dt, setDt] = useState(0);
  // const [hour, setHour] = useState(0);
  // const [minute, setMinute] = useState(0);
  // const [second, setSecond] = useState(0);

  // if (dt <= 0) {
  //   setDt(1)
  // }

  useEffect(() => {
      let secTimer = setInterval( () => {
        setDt(new Date().getHours() * 60 * 60 + new Date().getMinutes() * 60 + new Date().getSeconds())

        // currTimeInSec.value = withTiming(dt/SECONDSINDAY, {duration: 1000})

        // currHour.value = withTiming(new Date().getHours()/24, {duration: 1000})
        // currMinute.value = withTiming(new Date().getMinutes()/60, {duration: 1000})
        // currSecond.value = withTiming(new Date().getSeconds()/60, {duration: 1000})

        // TEST VALUES
        currTimeInSec.value = withTiming(34000/SECONDSINDAY, {duration: 1000})

        currHour.value = withTiming(9/24, {duration: 1000})
        currMinute.value = withTiming(32/60, {duration: 1000})
        currSecond.value = withTiming(5/60, {duration: 1000})
      },1000)


      return () => clearInterval(secTimer);
  });

  // useEffect(() => {
  //   console.log(currTimeInSec.value)
  // }, [dt])

  // Stores the indices of the headers
  useEffect(() => {
    const result = []
    let index = 0

    tasks.map((task) => {
      // result.push(index)
      result.push(index + 2)    // TODO REMEMBER TO FIX THIS SOMEHOW
      index = index + task.body.length + 1
    })

    setTaskHeaderIndex(result)
  },
  [tasks]
)

  const accountHandler = () => {

  }

  if (!font) {
    // prevent rendering without fonts being rendered
    return <View />;
  }

  return (
        <SafeAreaView edges={['top']} style={{...styles.container, ...styles.test, overflow: 'visible'}}>
            <View style={styles.header}>
              {/* <Text style={styles.headerLogo}>Image Text Logo </Text> */}
              <Text style={styles.headerLogo}>Home</Text>
              <Text>{dt}</Text>
              <AccountButton handlePress={accountHandler} style={styles.accountButton}/>
            </View>
          <View style={[
            {width: "100%"}
          ]}>
            {/* <AccountMenu active={false}/> */}
            <>
            <Animated.View
           style={[
            styles.header2,
            { transform: [{ translateY: translateHeader }] },
            {opacity: opacityTitle},
            { height: PROGRESSBARDIMENSION.total }
          ]}>
              <CircularProgressBar radius={RADIUS} strokeWidth={STROKEWIDTH} currTime={currTimeInSec} todoTime={0.5} dailyTime={0.75} hour={currHour} minute={currMinute} second={currSecond} font={font}/>
            </Animated.View>
            </>
            </View>


            <StatusBar style="auto" />

            <Animated.ScrollView
            // onScroll={({nativeEvent}) => {console.log(nativeEvent.contentOffset.y)}}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          },
        )}
        scrollEventThrottle={1}
        style={[
          // { transform: [{ translateY: translateList }] },
          { ...styles.test, borderColor: 'black'}
          // { marginTop: PROGRESSBARDIMENSION.total}
        ]}
        stickyHeaderIndices={taskHeaderIndex}
        >

            {/* <ScrollView
              // stickyHeaderIndices={[1, 5]} // always try to find index of the headers (use useState array) (always check if you have to update this component when you add (useState might take care of it but who knows))
              style={styles.listStyle}  // this can be a list of keys, I think (or use a function that counts the number of tasks between each category)
            > */}
              {/* TODO — I need keys for each item */}
              <Animated.View style={[
                {height: PROGRESSBARDIMENSION.total, borderWidth: 2, borderColor: 'red'},
                { transform: [{ scale: translateList }] },
                ]} />

              {/* Maybe remove current task cards for now... */}
              <CurrentTaskCard />
              {

                tasks.map((task) => (
                  Object.values(task).map((value) => {
                    if(typeof value == 'string') {
                          return (
                            <Animated.View style={{ transform: [{ translateY: translateList }] }}>
                              <Text>
                                {value}
                              </Text>
                            </Animated.View>
                          )
                        } else {
                          return (
                            value.map((t) => (
                              <TaskCard />
                            ))
                          )
                        }
                  })
                ))
              }
            {/* </ScrollView> */}
          </Animated.ScrollView>
        </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 15,
  },
  header: {
    width: "95%",
    // backgroundColor: 'pink',
    alignItems: "center",
    marginBottom: 25
  },
  header2: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    // paddingHorizontal: 24,
    // paddingVertical: 12,
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'stretch',
    justifyContent: 'flex-end',

    borderWidth: 2,
    borderColor:'blue'
  },
  headerLogo: {
    fontSize: 30
  },
  accountButton: {
    position: "absolute",
    right: 0,
    bottom: '-25%',
  },
  listStyle: {
    // marginTop: 25
    height: '100%',
  },
  test: {
    borderWidth: 2,
    borderColor: 'red'
  },
})
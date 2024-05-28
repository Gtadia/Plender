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

import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import {useFont} from '@shopify/react-native-skia';
import {SafeAreaView} from 'react-native-safe-area-context';


const RADIUS = 160;
const STROKEWIDTH = 30;
const SECONDSINDAY = 24 * 60 * 60;


export default function App() {
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

        currTimeInSec.value = withTiming(dt/SECONDSINDAY, {duration: 1000})

        currHour.value = withTiming(new Date().getHours()/24, {duration: 1000})
        currMinute.value = withTiming(new Date().getMinutes()/60, {duration: 1000})
        currSecond.value = withTiming(new Date().getSeconds()/60, {duration: 1000})
      },1000)


      return () => clearInterval(secTimer);
  });

  // useEffect(() => {
  //   console.log(currTimeInSec.value)
  // }, [dt])

  const accountHandler = () => {

  }

  if (!font) {
    // prevent rendering without fonts being rendered
    return <View />;
  }

  return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerLogo}>Image Text Logo </Text>
              <Text>{dt}</Text>
              <AccountButton handlePress={accountHandler} style={styles.accountButton}/>
            </View>
            {/* <AccountMenu active={false}/> */}
            <CircularProgressBar radius={RADIUS} strokeWidth={STROKEWIDTH} currTime={currTimeInSec} todoTime={0.9} dailyTime={1} hour={currHour} minute={currMinute} second={currSecond} font={font}/>
            <StatusBar style="auto" />
            {/* <Button title="Random" handlePress={handlePress} otherStyles="w-[85%]"/> */}
        </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 15
  },
  header: {
    width: "95%",
    // backgroundColor: 'pink',
    alignItems: "center",
    marginBottom: 25
  },
  headerLogo: {
    fontSize: 30
  },
  accountButton: {
    position: "absolute",
    right: 0,
    bottom: '-25%',
  }
})
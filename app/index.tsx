import { StatusBar } from 'expo-status-bar';
import { Button, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '../components/BottomSheet';
import { useCallback, useRef } from 'react';
import CircularProgressBar from '../components/RadialProgressBar';
import { useFont } from '@shopify/react-native-skia';
import { radialProgressState$, tasksState$ } from '../db/LegendApp';
import Timer from '../components/Timer';

const RADIUS = 160
const STROKEWIDTH = 25

export default function App() {
    const font = useFont(require("../assets/fonts/fffforward.ttf"), 32);
    if (!font) {
        // prevent rendering without fonts being rendered
        console.log("did this run?")
        return <View />;
    }

    radialProgressState$.sumTasks.get()

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      {/* Start Timer  */}
      <Timer />
      <SafeAreaView style={styles.container}>
        <Text style={{color: 'white'}}>Hi</Text>
        <StatusBar style="light" />
        <Button title="add" onPress={() => {
            tasksState$.today.push({label: 'test3', created_at: new Date(), due: new Date(), time_goal: 2 * 3600, time_remaining: 1800, description: 'nothing3', num_breaks: 5, is_daily: false},)
            tasksState$.today.onChange(() => console.log(tasksState$.today.get().length))
            }} />
        <CircularProgressBar radius={RADIUS} strokeWidth={STROKEWIDTH} font={font}/>
        <BottomSheet />
      </SafeAreaView>

    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  }
});

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Animated, { SharedValue } from 'react-native-reanimated';
import { Gesture, PanGestureHandler } from 'react-native-gesture-handler';

interface GestureHandlerProps {
  translateY: SharedValue<number>;
}

const GestureHandler = ({ translateY }: GestureHandlerProps) => {
  const gesture = Gesture.Pan()
}

export default GestureHandler

const styles = StyleSheet.create({})
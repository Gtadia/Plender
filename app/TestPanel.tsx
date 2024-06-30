import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { tasksState$ } from '../db/LegendApp'

const TestPanel = () => {
  const [todayProg, setTodayProg] = useState('1800')
  const [todayLabel, setTodayLabel] = useState('');

  return (
    <SafeAreaView>
      <Text>TestPanel</Text>

      <TextInput
        value={todayProg}
        onChangeText={setTodayProg}
        keyboardType='numeric'
      />
      <Button title={"Change today prog"} onPress={() => tasksState$.today.data[0].time_remaining.set(Number(todayProg))} />

        {/* Change Task Label */}
      <TextInput
        value={todayLabel}
        onChangeText={setTodayLabel}
      />
      <Button title={"Change today label"} onPress={() => tasksState$.today.data[0].label.set(todayLabel)} />

    </SafeAreaView>
  )
}

export default TestPanel

const styles = StyleSheet.create({})
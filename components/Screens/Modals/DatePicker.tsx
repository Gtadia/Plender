import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import DateTimePicker from 'react-native-ui-datepicker'
import { observer } from '@legendapp/state/react';

const { width } = Dimensions.get('window');

const DatePicker = observer(({modalToggle, date}: any) => {

  return (
    <View style={{width: width - (16 * 2), height: 'auto', padding: 16, borderRadius: 16, backgroundColor: 'white'}}>
      <DateTimePicker
        mode="single"
        date={date.get()}
        onChange={(params) => date.set(params.date)}
        // onChange={(params) => date.set({
        //   month: params.month,
        // })}
        />
    </View>
  )
})

export default DatePicker

const styles = StyleSheet.create({})
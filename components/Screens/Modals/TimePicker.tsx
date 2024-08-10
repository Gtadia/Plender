import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import DateTimePicker from 'react-native-ui-datepicker'
import { observer } from '@legendapp/state/react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AutoSizeText, ResizeTextMode } from 'react-native-auto-size-text';

const { width } = Dimensions.get('window');

const TimePicker = observer(({modalToggle, date}: any) => {

  return (
    <View style={{width: width - (16 * 2), height: 'auto', padding: 16, borderRadius: 16, backgroundColor: 'white'}}>
      <DateTimePicker
        mode="single"
        date={date.get()}
        onChange={(params) => date.set(params.date)}
        headerContainerStyle={{height: 0}}
        timePicker={true}
        initialView={'time'}
        />


        {/* TODO — (Today) button */}

      <TouchableOpacity
        style={{width: '100%', height: 'auto', borderRadius: 15, backgroundColor: 'red', padding: 16, justifyContent: 'center', alignItems: 'center'}}
        onPress={() => modalToggle.set(false)}
        >
        <AutoSizeText
          fontSize={24}
          numberOfLines={1}
          mode={ResizeTextMode.max_lines}
          >
            Select
        </AutoSizeText>
    </TouchableOpacity>
    </View>
  )
})

export default TimePicker

const styles = StyleSheet.create({})
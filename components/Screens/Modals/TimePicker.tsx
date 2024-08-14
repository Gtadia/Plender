import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { observer, useObservable } from '@legendapp/state/react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AutoSizeText, ResizeTextMode } from 'react-native-auto-size-text';
import Picker from '../../TimeCarousel/Picker';

const { width } = Dimensions.get('window');

const minutes = new Array(60).fill({value: 0, label: 0}).map((_, index) => ({value: index, label: index < 10 ? `0${index}` : `${index}`}))
const hours = new Array(24).fill({value: 0, label: 0}).map((_, index) => ({value: index, label: index}))

const TimePicker = observer(({modalToggle, time, timeDefault}: any) => {
  return (
    <View style={{width: width - (16 * 2), height: 'auto', padding: 16, borderRadius: 16, backgroundColor: 'white'}}>
      <AutoSizeText
        fontSize={32}
        numberOfLines={1}
        mode={ResizeTextMode.max_lines}
        >
          Select Time Goal
      </AutoSizeText>
      <View style={{height: 72 * 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <Picker values={hours}
              moreTextStyles={{ FontWeight: 'bold', }}
              textStyle={{fontSize: 64}}
              ITEM_HEIGHT={72}
              defaultValue={timeDefault.hours}
              legendState={time.hours}
              width={125}
            />
          <Text style={{fontFamily: "SFProText-Semibold", fontSize: 64, fontWeight: 'bold', padding: 16}}>:</Text>
          <Picker values={minutes}
            moreTextStyles={{ FontWeight: 'bold', }}
            textStyle={{fontSize: 64}}
            ITEM_HEIGHT={72}
            defaultValue={timeDefault.minutes}
            legendState={time.minutes}
            width={125}
          />
      </View>

        {/* TODO — (Today) button */}

      <TouchableOpacity
        style={{width: '100%', height: 'auto', borderRadius: 15, backgroundColor: 'red', padding: 16, justifyContent: 'center', alignItems: 'center'}}
        onPress={() => {
          modalToggle.set(false)
          time.total.set(time.hours.get() * 3600 + time.minutes.get() * 60)
          console.log(time.hours.get(), time.minutes.get(), time.total.get())
        }}
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
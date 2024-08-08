import { Button, Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { For, Memo, Reactive, useObservable } from '@legendapp/state/react';
import { AutoSizeText, ResizeTextMode } from 'react-native-auto-size-text';

import AntDesign from '@expo/vector-icons/AntDesign';
import { ScrollView } from 'react-native-gesture-handler';

import { taskTags$ } from '../../../db/LegendApp';
import ColorPicker, { Panel3, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';




var { width } = Dimensions.get('window');

const CreateNewTag = ({ modalToggle }: any) => {
  const title$ = useObservable('');
  const tagColor$ = useObservable('')

  // Note: 👇 This can be a `worklet` function.
  const onSelectColor = ({ hex }: { hex: string }) => {
    tagColor$.set(hex);
  };

  const createHandler = () => {
    if ( title$.get() && tagColor$.get() ) {
      const indexNum = taskTags$.list.get().length + 1
      taskTags$.addToList({ label: title$.get(), value: indexNum, color: tagColor$.get() })
      modalToggle.set(false)
      taskTags$.selected.set((prev) => prev.concat(indexNum))
    } else {
      // TODO — Warn the user
      console.log('warn the user somehow (red line somewhere, I think)')
    }
  }

  return (
    <View style={{width: width - (16 * 2), height: 'auto', padding: 16, borderRadius: 16, backgroundColor: 'white'}}>
      <AutoSizeText
        fontSize={24}
        numberOfLines={1}
        mode={ResizeTextMode.max_lines}
        >
          Create Tag
      </AutoSizeText>
      <View>
        <Memo>{() => <AntDesign name="tag" size={24} color={tagColor$.get()} />}</Memo>
        <Reactive.TextInput
          $value={title$}
          style={styles.titleInput}
          placeholder="Title"
          />
      </View>

      <AutoSizeText
        fontSize={24}
        numberOfLines={1}
        mode={ResizeTextMode.max_lines}
        >
          Tag Color
      </AutoSizeText>
      <ColorPicker style={{ width: '70%' }} value='red' onComplete={onSelectColor}>
          <Panel3
            centerChannel='hsl-saturation'
            style={styles.colorWheel}
            />
          <ScrollView
            style={{flexDirection: 'row'}}
            >
            <Swatches
              // colors={[]}
              // swatchStyle={}
              style={styles.swatches}
              />
          </ScrollView>
        </ColorPicker>

      <TouchableOpacity
        style={{}}
        onPress={ createHandler }>
        <Text>Create</Text>
      </TouchableOpacity>

      {/* TODO — Create X button  */}
    </View>
  )
}



export default CreateNewTag

const styles = StyleSheet.create({
  colorWheel: {
    height: 'auto'
  },
  titleInput: {
    fontSize: 24,
    color: 'black',   // TODO — In Dark Mode, change 'color' to 'white'
  },
  swatches: {

  }
})
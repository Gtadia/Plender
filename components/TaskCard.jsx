import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import {Canvas, Path, Skia, Text as SkiaText,} from '@shopify/react-native-skia'
import {SharedValue, useDerivedValue, useSharedValue, interpolateColor, useAnimatedStyle} from 'react-native-reanimated';

const strokeWidth = 8;
const radius = 30;

const TaskCard = ({ task, style, taskClick }) => {
  const [tags, setTags] = useState([]);

  const innerRadius = radius - strokeWidth/2;
  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

  return (
    // TODO — Maybe have another view so that the opacity behind the button is a bit darker (or bg to TouchableOpacity)
    <TouchableOpacity
      onPress={taskClick}
    >
    <View style={{...styles.container, ...styles.borderStyle, ...style}}>
      <View style={{flexDirection: 'row'}}>

        <View style={{width: radius * 2, height: radius * 2, marginLeft: 15, marginRight: 8,}}>
          <Canvas style={{flex: 1}}>
            <Path
              path={path}
              strokeWidth={strokeWidth}
              style={'stroke'}
              color={'#e68f40'}
              strokeJoin={'round'}
              strokeCap={'round'}
              start={0}
              end={0.6}
              />
          </Canvas>

          <TouchableOpacity
            style={[
              styles.pausePlayButton,
              {position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center'}
            ]}>
            <View style={{height: 10, width: 10, backgroundColor: 'blue'}} />
          </TouchableOpacity>
        </View>

          <View style={{justifyContent: 'center', backgroundColor: 'transparent'}}>
            <Text>
              {"test text"}
            </Text>

            <View style={{backgroundColor: 'transparent', width: 150, height: 40, flexDirection: 'row', alignItems: 'center'}}>
              {
                tags.map((tag) => (
                  <View>
                    <Text>{tag}</Text>
                  </View>
                ))
              }
              {
                tags.length === 0  &&
                <View>
                  <Text>add tag</Text>
                </View>
              }
            </View>
          </View>
      </View>

        <View style={{marginRight: 15}}>
          <View>
            <Text>{"1:38"}</Text>
          </View>
          <View>
            <Text style={{fontStyle: 'italic'}}>{"/2:00"}</Text>
          </View>
        </View>
    </View>
    </TouchableOpacity>
  )
}

export default TaskCard

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width * 0.9,
    height: 70,

    justifyContent: "space-between",
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: "gray",

  },
  borderStyle: {
    borderRadius: 12
  },
  test: {
    borderWidth: 2,
    borderColor: 'red'
  },
  pausePlayButton: {
    zIndex: 10,
  }
})
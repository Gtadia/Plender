import { FlatList, LayoutAnimation, Dimensions, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { observer } from '@legendapp/state/react'
import { currentTask$, openAddMenu$, overdueTasks$, todayTasks$, upcomingTasks$ } from '../../db/LegendApp'

import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import AntDesign from '@expo/vector-icons/AntDesign';
import Card from '../../components/ui/Card'
import { observable, observe } from '@legendapp/state'

var {width, height} = Dimensions.get('window');
const MAX_TRANSLATE_Y = -height + 50

const List = observer(() => {

  return (
    <View style={styles.container}>
      <Text>[Today's Date]</Text>

      {/* <SectionList
        sections={[todayTasks$.get(), overdueTasks$.get(), upcomingTasks$.get()]}
        keyExtractor={(item, index) => item + index}
        renderItem={({item, index}) => <Card item={item} index={index}/>}
        ListEmptyComponent={<Text>Empty List</Text>}
        renderSectionHeader={({section}) => (
          <Text>{section.title}</Text>
        )}
        stickySectionHeadersEnabled
      /> */}


      <Item task={todayTasks$.get()} />
      <Item task={overdueTasks$.get()} />
      <Item task={upcomingTasks$.get()} />

      <View style={[styles.absBottom]}>
        {
          currentTask$.get() &&
          // true &&
          <Pressable style={styles.taskBanner} onPress={() => console.log('hello')}>
              <Text>{currentTask$.title.get()}</Text>
              {/* <Text>{currentTask$.tags.get()}</Text> */}
              <Text>{currentTask$.time_goal.get()}</Text>
              <Text>{currentTask$.time_spent.get()}</Text>
          </Pressable>
        }
      </View>

      <BottomSheet />
    </View>
  )
})

function Item({task}: any) {
  const [open, setopen] = useState(true);
  const onPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setopen(!open);
  };

  if (task.data.length == 0) {
    return;
  }
  // !open && { height: 40} ==> turn `40` into the height of the text
  return (
    <TouchableOpacity style={[styles.item, !open && { height: 40 }]} onPress={onPress} activeOpacity={1}>
      <View style={[styles.flexRow, {paddingLeft: 15}]}>
        <Text>{task.title}</Text>
        {!open ? <AntDesign name="caretup" size={24} color="black" /> : <AntDesign name="caretdown" size={24} color="black" />}
      </View>

      <FlatList
        data={task.data}
        renderItem={({item}) => <ListItem item={item}/>}
        keyExtractor={item => item.created}
      />
    </TouchableOpacity>
  );
}

function BottomSheet() {
  const translateY = useSharedValue(0)

    const scrollTo = useCallback((destination: number) => {
        "worklet";
        translateY.value = (withSpring(destination, { damping: 50 }))
    }, [])

    const context = useSharedValue({ y: 0})     // to keep context of the previous scroll position
    const gesture = Gesture.Pan().onStart(() => {
        context.value = {y:translateY.value}
    })
    .onUpdate((event) => {
      translateY.value = (event.translationY + context.value.y)   // adding previous scroll position
      translateY.value = (Math.max(translateY.value, MAX_TRANSLATE_Y))
    })
    .onEnd(() => {
        if (translateY.value > -height / 3) {
            scrollTo(10)
        } else if (translateY.value < -height / 2) {
            scrollTo(MAX_TRANSLATE_Y)
        }
    })

    const rBottomSheetStyle = useAnimatedStyle(() => {
        const borderRadius = interpolate(
          translateY.value,                           // when translateY.value...
            [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],    // reaches value of MAX_TRANSLATE_Y+50, the border radius needs to be 5
            [25, 5],                                    // otherwise, if it is less than or equal to MAX_TRANSLATE_Y, it will be 25
            Extrapolation.CLAMP     // without CLAMP, if the value is less than MAX_TRANSLATE_Y, the borderRadius won't be clamped to 25, but greater
        )
        return {
            borderRadius,
            transform: [{translateY: translateY.value}]
        }
    })

    observe(() => {
      if (openAddMenu$.get()) {
        scrollTo(-height * 5 / 8)
      }
    })

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[bottomStyle.container, rBottomSheetStyle]}>
                <View style={bottomStyle.line} />
            </Animated.View>
        </GestureDetector>
    )
}

function ListItem({item}: any) {
  return (
    <View style={{height: 85, backgroundColor: 'red', borderRadius: 15, flexDirection: 'row', alignItems: 'center', padding: 20, justifyContent: 'space-between', margin: 7}}>
      <View style={{flexDirection: 'row'}}>
        <View style={{width: 55, height: 55, backgroundColor: 'pink'}}>
          <Text>Progress</Text>
        </View>

        <View>
          <Text>{item.title}</Text>
          {
            item.category ? <Text>{item.category.title.get()}</Text> : <Text>Nope</Text>
          }
        </View>
      </View>

      <View>
        <Text>Hi</Text>
      </View>
    </View>
  )
}

export default List

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    backgroundColor: 'blue'
  },
  flexRow: {
    flexDirection: 'row',
  },
  item: {
    width: '100%',
    paddingHorizontal: 20,
    overflow: 'hidden',
    paddingVertical: 10,
    marginBottom: 5,
  },

  absBottom: {
    position: 'absolute',
    bottom: 0,
  },
  taskBanner: {
    width: width,
    height: 120,
    backgroundColor: 'green',
  }
})

const bottomStyle = StyleSheet.create({
  container: {
    height: height,
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    top: height / 1,
    borderRadius: 25
  },
  line: {
      width: 75,
      height: 4,
      backgroundColor: 'gray',
      alignSelf: 'center',
      marginVertical: 15,
      borderRadius: 2,
  }
})
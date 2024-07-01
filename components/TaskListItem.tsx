import { AntDesign } from "@expo/vector-icons";
import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import Card from './ui/Card';
import { tasks } from "../types";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { tasksState$ } from "../db/LegendApp";
import { ObservablePrimitive, observe } from "@legendapp/state";
import { observer } from '@legendapp/state/react'
import { useSharedValue } from "react-native-reanimated";

interface taskType {
  index: number,
  taskType: String,
}

interface timeType {
  time_remaining: ObservablePrimitive<number>
  time_goal: ObservablePrimitive<number>
}

interface mainBodyType {
  label: ObservablePrimitive<string>
}

const TaskListItem = ({ index, taskType }: taskType ) => {
  let task = tasksState$.today.data[index]
  if (taskType === 'Upcoming') {
    task = tasksState$.upcoming.data[index]
  } else if (taskType === 'Overdue') {
    task = tasksState$.overdue.data[index]
  }
  return (
      <Card style={{ flexDirection: 'row'}}>
          <RadialProgressBar time_remaining={task.time_remaining} time_goal={task.time_goal} />
          <MainBody label={task.label} />
          <TimeBody time_remaining={task.time_remaining} time_goal={task.time_goal} />
      </Card>
  )
}

const RadialProgressBar = observer(({ time_remaining, time_goal }: timeType) => {
  const color = '#e68f40'  // TODO — gradient change based on percentage completed
  const radius = 50
  const strokeWidth = 10

  const innerRadius = radius - strokeWidth / 2
  const outerBuffer = strokeWidth / 2
  const outerDiameter = radius * 2

  const path = Skia.Path.Make();
  path.addCircle(radius + outerBuffer, radius + outerBuffer, innerRadius)


  return (
    <View>
      <View>
        <View style={{width: outerDiameter + strokeWidth, height: outerDiameter + strokeWidth, transform: [{rotate: '-90deg'}]}}>
          <Canvas style={{flex: 1}}>
            <Path
              path={path}
              strokeWidth={strokeWidth}
              style={'stroke'}
              color={'#333438'}
              strokeJoin={'round'}
              strokeCap={'round'}
              start={0}
              end={1}
            />
            <Path
              path={path}
              strokeWidth={strokeWidth}
              style={'stroke'}
              color={color}
              strokeJoin={'round'}
              strokeCap={'round'}
              start={0}
              end={time_remaining.get() / time_goal.get()}
            />
          </Canvas>
        </View>

        <View>
          {/* Pressable Play/Pause Button */}
        </View>
      </View>
    </View>
  )
})

const MainBody = observer(({ label }: mainBodyType) => {
  return (
    <View>
      <AutoSizeText
          fontSize={32}
          mode={ResizeTextMode.max_lines}
          numberOfLines={1}
          style={[styles.amount, { maxWidth: "80%" }]}
      >
        {label.get()}
      </AutoSizeText>

      <View style={styles.tags}>
        {/* Only Allow up to 5 tags (each tag can only be 15 characters long) */}
      </View>
    </View>
  )
})

const TimeBody = observer(({ time_remaining, time_goal }: timeType) => {
  return (
    <View>
      <AutoSizeText
        fontSize={24}
        mode={ResizeTextMode.max_lines}
        numberOfLines={1}

      >
        {time_remaining.get()}
      </AutoSizeText>

      <AutoSizeText
        fontSize={18}
        mode={ResizeTextMode.max_lines}
        numberOfLines={1}
      >
        / {time_goal.get()}
      </AutoSizeText>
    </View>
  )
})

export default TaskListItem

const styles = StyleSheet.create({
    amount: {
        fontSize: 32,
        fontWeight: "800",
      },
      row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      },
      categoryContainer: {
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 3,
        alignSelf: "flex-start",
      },
      categoryText: {
        fontSize: 12,
      },
      tags: {
        flexDirection: 'row',
      }
})
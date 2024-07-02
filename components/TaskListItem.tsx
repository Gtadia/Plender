import { AntDesign } from "@expo/vector-icons";
import { Button, TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import Card from './ui/Card';
import { tasks } from "../types";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { radialProgressState$, tasksState$ } from "../db/LegendApp";
import { batch, ObservablePrimitive, observe } from "@legendapp/state";
import { observer } from '@legendapp/state/react'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


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
  } else if (taskType === 'Current') {
    task = tasksState$.current.data[index]
  }

  const moveToCurrent = () => {
    const currTask = tasksState$.current.data.get()
    if (currTask.length >= 1) {
      // TODO — Implement a warning popup window to verify switching
      tasksState$.current.data[0].num_breaks.set(prev => prev + 1)  // Increase Num Breaks
    }
    tasksState$.current.data.set([])
    tasksState$.current.data.push(task)
  }


  return (
      <Card style={{ flexDirection: 'row'}}>
          <RadialProgressBar time_remaining={task.time_remaining} time_goal={task.time_goal} currentHandler={moveToCurrent} />
          <MainBody label={task.label} num_breaks={task.num_breaks} />
          <TimeBody time_remaining={task.time_remaining} time_goal={task.time_goal} />
      </Card>
  )
}

const RadialProgressBar = observer(({ time_remaining, time_goal, currentHandler }: timeType) => {
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


        <View style={{
          position: 'absolute',
top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'

        }}>
          <TouchableOpacity onPress={currentHandler}>
            <FontAwesome5 name="play" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
})

const MainBody = observer(({ label, num_breaks }: mainBodyType) => {
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

      <AutoSizeText
          fontSize={32}
          mode={ResizeTextMode.max_lines}
          numberOfLines={1}
          style={[styles.amount, { maxWidth: "80%" }]}
      >
        {num_breaks.get()}
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
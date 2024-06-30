import { SectionList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { settingsState$ } from '../db/LegendApp'
import TaskListItem from './TaskListItem'

const TaskList = () => {
  // todo — check if .get() is observable

  console.log("what", settingsState$.orderList.get())

  // TODO — Add shadow to TaskListItem

  return (
    <SectionList
      sections={settingsState$.orderList.get()}
      keyExtractor={(item, index) => item + index}
      // renderItem={({item, index, section}) => <TaskListItem task={item} index={index} db={section.title}/>}
      renderItem={({item, index, section}) => <TaskListItem index={index}/>}
      // renderItem={({item}) => <Text>{typeof item}</Text>}
      ListEmptyComponent={<Text>Empty List</Text>}
      renderSectionHeader={({section}) => (
        <Text>{section.title}</Text>
      )}
      stickySectionHeadersEnabled
    />
  )
}

export default TaskList

const styles = StyleSheet.create({})
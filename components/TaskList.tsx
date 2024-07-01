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
      renderItem={({ index, section }) => <TaskListItem index={index} taskType={section.title} />}
      ListEmptyComponent={<Text>Empty List</Text>}
      renderSectionHeader={({ section }) => (
        <Text>{section.title}</Text>
      )}
      stickySectionHeadersEnabled
    />
  )
}

export default TaskList

const styles = StyleSheet.create({})